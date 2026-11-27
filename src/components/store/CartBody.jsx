'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import { useCart, MAX_QTY } from '@/store/CartContext'
import { formatPrice } from '@/lib/formatPrice'
import { placeOrder } from '@/app/checkout/actions'
import { municipalities } from '@/data/municipalities'
import { matchesSearch } from '@/lib/transliterate'
import { createClient } from '@/lib/supabase/client'
import ProductImg from './ProductImg'
import { Confetti, SuccessCheck } from './Celebration'
import PaymentMethods from './PaymentMethods'
import PriceTag from '@/components/promo/PriceTag'
import { effectivePrice, variantPrice } from '@/lib/pricing'

export default function CartBody() {
  const { items, count, subtotal, hydrated, updateQty, removeItem, clear, replaceItems } = useCart()
  const cartNotices = useCartPriceSync(items, replaceItems)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('07')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [termsError, setTermsError] = useState(false)
  const [error, setError] = useState(null)
  const [orderResult, setOrderResult] = useState(null)

  const shipping = 0
  const total = subtotal + shipping

  async function handleCheckout() {
    setError(null)

    if (!name.trim() || !phone.trim() || !city.trim()) {
      setError('Пополнете ги сите задолжителни полиња (име, телефон и град).')
      return
    }

    // Validate Macedonian phone number: starts with 07, total 9 digits (ignoring dashes)
    const digitsOnly = phone.replace(/\D/g, '')
    if (!/^07\d{7}$/.test(digitsOnly)) {
      setError('Внесете валиден македонски телефонски број (пр. 075-XXX-XXX).')
      return
    }

    // Validate City is one of the allowed municipalities
    if (!municipalities.includes(city)) {
      setError('Ве молиме изберете валиден град/општина од листата.')
      return
    }

    if (!acceptTerms) {
      setTermsError(true)
      setError('За да нарачате, потврдете дека се согласувате со условите за купување.')
      return
    }

    setSubmitting(true)
    try {
      const result = await placeOrder({
        customer: { name, phone, city, address },
        acceptTerms,
        // Only ids and quantities — prices and the total are taken from the
        // database by the server.
        items: items.map((it) => ({ id: it.id, variantId: it.variantId ?? null, qty: it.qty })),
      })

      if (!result?.ok) {
        setError(result?.error ?? 'Нарачката не успеа. Обидете се повторно.')
        return
      }

      clear()
      setOrderResult({ orderId: result.orderId, total: result.total })
    } catch (err) {
      setError(err?.message ?? 'Нарачката не успеа. Обидете се повторно.')
    } finally {
      setSubmitting(false)
    }
  }

  if (orderResult) {
    const shortId =
      typeof orderResult.orderId === 'string'
        ? orderResult.orderId.slice(0, 8).toUpperCase()
        : ''
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: { xs: 4, md: 8 } }}>
        <Paper
          elevation={0}
          sx={{
            maxWidth: 560,
            width: '100%',
            textAlign: 'center',
            p: { xs: 3, md: 5 },
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 4,
            bgcolor: 'background.paper',
            position: 'relative',
            animation: 'a-scale-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) backwards',
          }}
        >
          <Confetti />
          <Box sx={{ mb: 2 }}>
            <SuccessCheck />
          </Box>
          <Typography variant="h4" className="a-fade-up" style={{ '--d': '500ms' }} sx={{ fontWeight: 800, mb: 1 }}>
            Нарачката е потврдена
          </Typography>
          <Typography variant="body1" color="text.secondary" className="a-fade-up" style={{ '--d': '620ms' }} sx={{ mb: 3 }}>
            Ви благодариме! Вашата нарачка е примена и ќе ја обработиме во
            најкраток можен рок. Наскоро ќе ве контактираме за потврда на
            доставата.
          </Typography>
          {shortId ? (
            <Box
              sx={{
                mx: 'auto',
                mb: 3,
                px: 2,
                py: 1,
                display: 'inline-block',
                borderRadius: 999,
                bgcolor: 'rgba(215,31,43,0.08)',
                color: 'primary.main',
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: '0.06em',
              }}
            >
              Број на нарачка: #{shortId}
            </Box>
          ) : null}
          {shortId ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: -1.5, mb: 3 }}>
              Зачувајте го бројот — со него и вашиот телефон можете да ја следите нарачката.
            </Typography>
          ) : null}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ justifyContent: 'center' }}>
            {shortId ? (
              <Button
                component={Link}
                href={`/sledenje?kod=${shortId}`}
                variant="contained"
                size="large"
                sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
              >
                Следи ја нарачката
              </Button>
            ) : null}
            <Button
              component={Link}
              href="/prodavnica"
              variant={shortId ? 'outlined' : 'contained'}
              size="large"
              sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
            >
              Продолжи со купување
            </Button>
          </Stack>
        </Paper>
      </Box>
    )
  }

  // Before hydration the saved cart is not read yet: show a spinner, not
  // "empty", so a full cart never flashes as empty after a refresh.
  if (!hydrated) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress aria-label="Се вчитува кошничката" />
      </Box>
    )
  }

  if (items.length === 0) {
    return (
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          px: 2,
          textAlign: 'center',
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 3,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h5" component="h2" sx={{ fontWeight: 800, mb: 1 }}>
          Вашата кошничка е празна
        </Typography>
        {cartNotices.length > 0 ? (
          <Alert severity="info" sx={{ maxWidth: 520, mx: 'auto', mb: 2, textAlign: 'left' }}>
            {cartNotices.map((notice) => (
              <div key={notice}>{notice}</div>
            ))}
          </Alert>
        ) : (
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Разгледајте ги производите и додадете нешто во кошничката.
          </Typography>
        )}
        <Button
          component={Link}
          href="/prodavnica"
          variant="contained"
          size="large"
          sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
        >
          Кон продавницата
        </Button>
      </Box>
    )
  }

  function handlePhoneChange(e) {
    let val = e.target.value
    // Only allow digits, and must start with '07'
    if (!val.startsWith('07')) {
      val = '07'
    }
    // Remove all non-digits
    const digits = val.replace(/\D/g, '').slice(0, 9)
    
    // Format as 0XX-XXX-XXX
    let formatted = ''
    for (let i = 0; i < digits.length; i++) {
      if (i === 3 || i === 6) formatted += '-'
      formatted += digits[i]
    }
    setPhone(formatted)
  }

  return (
    <Box sx={{ display: 'grid', gap: { xs: 3, md: 4 }, gridTemplateColumns: { xs: '1fr', md: '1fr 380px' }, alignItems: 'start' }}>
      {/* line items — unchanged from your version */}
      <Stack spacing={2}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>Производи ({count})</Typography>
        {cartNotices.length > 0 ? (
          <Alert severity="info">
            {cartNotices.map((notice) => (
              <div key={notice}>{notice}</div>
            ))}
          </Alert>
        ) : null}
        <Stack spacing={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden', bgcolor: 'background.paper' }}>
          {items.map((it, idx) => (
            <Stack key={it.key} direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ p: 2, borderTop: idx === 0 ? 'none' : '1px solid', borderColor: 'divider' }}>
              <Box sx={{ width: { xs: '100%', sm: 96 }, height: 96, borderRadius: 2, bgcolor: 'grey.100', background: 'linear-gradient(135deg, rgba(215,31,43,0.12), rgba(179,18,29,0.12))', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                <ProductImg src={it.imageUrl} alt={it.name} sx={{ objectFit: 'cover', width: '100%', height: '100%' }} />
              </Box>
              <Stack sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.25 }}>{it.name}</Typography>
                {it.variantLabel ? (
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    {it.variantLabel}
                  </Typography>
                ) : null}
                <Box sx={{ mt: 0.25 }}><PriceTag price={it.price} regularPrice={it.regularPrice} size="sm" /></Box>
                <Stack direction="row" spacing={1} sx={{ mt: 1.5, alignItems: 'center' }}>
                  <IconButton size="small" aria-label="Намали количина" disabled={it.qty <= 1} onClick={() => updateQty(it.key, it.qty - 1)} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography sx={{ minWidth: 28, textAlign: 'center', fontWeight: 700 }}>{it.qty}</Typography>
                  <IconButton size="small" aria-label="Зголеми количина" disabled={it.qty >= MAX_QTY} onClick={() => updateQty(it.key, it.qty + 1)} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
                    <AddIcon fontSize="small" />
                  </IconButton>
                  <Box sx={{ flex: 1 }} />
                  <IconButton size="small" color="error" aria-label="Отстрани од кошничката" onClick={() => removeItem(it.key)}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, alignSelf: { xs: 'flex-end', sm: 'center' } }}>
                {formatPrice(it.price * it.qty)}
              </Typography>
            </Stack>
          ))}
        </Stack>
        <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
          <Button variant="text" color="inherit" onClick={clear} sx={{ textTransform: 'none', fontWeight: 700 }}>
            Испразни кошничка
          </Button>
        </Stack>
      </Stack>

      {/* summary + checkout */}
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: { xs: 2, md: 2.5 }, bgcolor: 'background.paper', position: { md: 'sticky' }, top: { md: 96 } }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>Преглед на нарачка</Typography>
        <Stack spacing={1}>
          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">Меѓузбир</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatPrice(subtotal)}</Typography>
          </Stack>
          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">Достава</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{shipping === 0 ? 'Бесплатна' : formatPrice(shipping)}</Typography>
          </Stack>
          <Divider sx={{ my: 0.5 }} />
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Вкупно</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main' }}>{formatPrice(total)}</Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'right' }}>
            Цените се со вклучен ДДВ
          </Typography>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1.5}>
          <TextField 
            label="Име и презиме *" 
            size="small" 
            fullWidth 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            autoComplete="name" 
            error={!!error && !name.trim()}
          />
          <TextField 
            label="Телефон *" 
            size="small" 
            fullWidth 
            value={phone} 
            onChange={handlePhoneChange} 
            autoComplete="tel" 
            placeholder="07X-XXX-XXX"
            error={!!error && (!/^07\d{7}$/.test(phone.replace(/\D/g, '')))}
          />
          <Autocomplete
            options={municipalities}
            value={city}
            onChange={(event, newValue) => setCity(newValue || '')}
            filterOptions={(options, state) =>
              // Cyrillic or Latin, any spelling: "Штип", "stip", "shtip", "štip".
              options.filter((option) => matchesSearch(option, state.inputValue))
            }
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Град / Општина" 
                size="small" 
                required 
                autoComplete="address-level2" 
                error={!!error && !city.trim()}
              />
            )}
            fullWidth
          />
          <TextField label="Адреса за достава (опционално)" size="small" fullWidth multiline minRows={2} value={address} onChange={(e) => setAddress(e.target.value)} autoComplete="street-address" />

          <PaymentMethods />

          <FormControlLabel
            sx={{
              alignItems: 'flex-start',
              mx: 0,
              p: 1,
              borderRadius: 2,
              border: '1px solid',
              borderColor: termsError && !acceptTerms ? 'error.main' : 'transparent',
              bgcolor: termsError && !acceptTerms ? 'rgba(211,47,47,0.04)' : 'transparent',
            }}
            control={
              <Checkbox
                checked={acceptTerms}
                onChange={(e) => {
                  setAcceptTerms(e.target.checked)
                  if (e.target.checked) setTermsError(false)
                }}
                sx={{ mt: -0.75, ml: -0.75 }}
              />
            }
            label={
              <Typography variant="body2" sx={{ pt: 0.25 }}>
                Ги прочитав и се согласувам со{' '}
                <Box
                  component={Link}
                  href="/uslovi"
                  target="_blank"
                  rel="noopener"
                  onClick={(e) => e.stopPropagation()}
                  sx={{ color: 'primary.main', fontWeight: 700, textDecoration: 'underline' }}
                >
                  условите за купување и достава
                </Box>
                .
              </Typography>
            }
          />

          {error ? <Alert severity="error">{error}</Alert> : null}

          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={submitting}
            sx={{ mt: 1, textTransform: 'none', fontWeight: 800, borderRadius: 2 }}
            onClick={handleCheckout}
          >
            {submitting ? <CircularProgress size={22} color="inherit" /> : 'Купи'}
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * The cart lives in localStorage, so its prices/names can be days old.
 * When the cart page opens, re-read every product from Supabase:
 *   - update price, name, image and slug to the current values
 *   - drop products that were deleted or are out of stock
 * Returns human-readable notices about what changed. A price notice is tied
 * to its cart line and disappears once that line is removed; notices about
 * lines the sync itself removed stay, since they explain the change.
 */
function useCartPriceSync(items, replaceItems) {
  const [notices, setNotices] = useState([])
  const synced = useRef(false)

  useEffect(() => {
    if (synced.current || items.length === 0) return
    synced.current = true
    const snapshot = items

    async function sync() {
      const ids = snapshot.map((it) => it.id).filter((id) => UUID_RE.test(id))
      let rows = []
      if (ids.length > 0) {
        const { data, error } = await createClient()
          .from('products')
          .select('id,title,slug,price,sale_price,sale_ends_at,image_url,in_stock,product_variants(id,label,price)')
          .in('id', ids)
        if (error) return // keep the cart as is; the server re-checks on order
        rows = data ?? []
      }
      const byId = new Map(rows.map((row) => [row.id, row]))

      // Per cart line: fresh fields, or null = remove the line.
      const updates = new Map()
      const messages = []
      for (const it of snapshot) {
        const row = byId.get(it.id)
        if (!row) {
          messages.push({ text: `„${it.name}“ повеќе не е достапен и е отстранет од кошничката.` })
          updates.set(it.key, null)
          continue
        }
        if (!row.in_stock) {
          messages.push({ text: `„${row.title}“ моментално нема на залиха и е отстранет од кошничката.` })
          updates.set(it.key, null)
          continue
        }
        const options = row.product_variants ?? []
        let currentPrice
        let regularPrice
        let variantLabel = null
        if (options.length > 0) {
          const option = options.find((v) => v.id === it.variantId)
          if (!option) {
            messages.push({ text: `За „${row.title}“ изберете количина повторно — опцијата е изменета.` })
            updates.set(it.key, null)
            continue
          }
          currentPrice = variantPrice(row, option.price)
          regularPrice = currentPrice < option.price ? option.price : null
          variantLabel = option.label
        } else {
          currentPrice = effectivePrice(row)
          regularPrice = currentPrice < row.price ? row.price : null
        }
        if (currentPrice !== it.price) {
          messages.push({
            key: it.key,
            text: `Цената на „${row.title}“ е ажурирана: ${formatPrice(it.price)} → ${formatPrice(currentPrice)}`,
          })
        }
        const fresh = {
          name: row.title,
          slug: row.slug,
          price: currentPrice,
          regularPrice,
          variantLabel,
          imageUrl: row.image_url || null,
        }
        if (Object.keys(fresh).some((k) => fresh[k] !== it[k])) updates.set(it.key, fresh)
      }

      // Apply to the cart as it is NOW: +/−/remove clicked while the
      // request was running must not be undone.
      if (updates.size > 0) {
        replaceItems((current) =>
          current.flatMap((it) => {
            if (!updates.has(it.key)) return [it]
            const fresh = updates.get(it.key)
            return fresh ? [{ ...it, ...fresh }] : []
          }),
        )
      }
      setNotices(messages)
    }

    sync()
  }, [items, replaceItems])

  return notices
    .filter((n) => !n.key || items.some((it) => it.key === n.key))
    .map((n) => n.text)
}
