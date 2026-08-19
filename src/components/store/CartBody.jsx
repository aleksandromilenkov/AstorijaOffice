'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Paper from '@mui/material/Paper'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import { useCart } from '@/store/CartContext'
import { formatPrice } from '@/lib/formatPrice'
import { placeOrder } from '@/app/checkout/actions'

export default function CartBody() {
  const { items, count, subtotal, updateQty, removeItem, clear } = useCart()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [orderResult, setOrderResult] = useState(null)
  const [notifyWarning, setNotifyWarning] = useState(null)

  const shipping = 0
  const total = subtotal + shipping

  async function handleCheckout() {
    setError(null)

    if (!name.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      setError('Пополнете ги сите полиња за достава.')
      return
    }

    setSubmitting(true)
    try {
      const result = await placeOrder({
        customer: { name, phone, city, address },
        items: items.map((it) => ({
          id: it.id,
          name: it.name,
          slug: it.slug,
          price: it.price,
          qty: it.qty,
        })),
        subtotal,
        shipping,
        total,
      })

      if (!result?.ok) {
        setError(result?.error ?? 'Нарачката не успеа. Обидете се повторно.')
        return
      }

      clear()
      setOrderResult({ orderId: result.orderId, total })
      setNotifyWarning(result?.notifyError ?? null)
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
          }}
        >
          <Box
            sx={{
              mx: 'auto',
              mb: 2,
              width: 72,
              height: 72,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(134,46,156,0.10)',
              color: 'primary.main',
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 44 }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Нарачката е потврдена
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Ви благодариме! Вашата нарачка е примена и ќе ја обработиме во
            најкраток можен рок. Наскоро ќе ве контактираме за потврда на
            доставата.
          {notifyWarning ? (
            <Alert severity="warning" sx={{ mb: 3, textAlign: 'left' }}>
              Нарачката е зачувана, но известувањето по е-пошта не можеше да
              се испрати: {notifyWarning}
            </Alert>
          ) : null}
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
                bgcolor: 'rgba(134,46,156,0.08)',
                color: 'primary.main',
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: '0.06em',
              }}
            >
              Број на нарачка: #{shortId}
            </Box>
          ) : null}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ justifyContent: 'center' }}>
            <Button
              component={Link}
              href="/prodavnica"
              variant="contained"
              size="large"
              sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
            >
              Продолжи со купување
            </Button>
            <Button
              component={Link}
              href="/"
              variant="outlined"
              size="large"
              sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
            >
              Назад на почетна
            </Button>
          </Stack>
        </Paper>
      </Box>
    )
  }

  if (items.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: { xs: 6, md: 10 } }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
          Вашата кошничка е празна.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Додајте производи од Продавницата за да продолжите.
        </Typography>
        <Button component={Link} href="/prodavnica" variant="contained" color="primary" size="large" sx={{ textTransform: 'none', fontWeight: 800, borderRadius: 2 }}>
          Кон Продавница
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'grid', gap: { xs: 3, md: 4 }, gridTemplateColumns: { xs: '1fr', md: '1fr 380px' }, alignItems: 'start' }}>
      {/* line items — unchanged from your version */}
      <Stack spacing={2}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>Производи ({count})</Typography>
        <Stack spacing={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden', bgcolor: 'background.paper' }}>
          {items.map((it, idx) => (
            <Stack key={it.id} direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ p: 2, borderTop: idx === 0 ? 'none' : '1px solid', borderColor: 'divider' }}>
              <Box sx={{ width: { xs: '100%', sm: 96 }, height: 96, borderRadius: 2, bgcolor: 'grey.100', background: 'linear-gradient(135deg, rgba(134,46,156,0.12), rgba(174,62,201,0.12))', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                {it.imageUrl ? (
                  <Image src={it.imageUrl} alt={it.name} width={96} height={96} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                ) : null}
              </Box>
              <Stack sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.25 }}>{it.name}</Typography>
                <Typography variant="body2" color="primary" sx={{ fontWeight: 700, mt: 0.25 }}>{formatPrice(it.price)}</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1.5, alignItems: 'center' }}>
                  <IconButton size="small" onClick={() => updateQty(it.id, it.qty - 1)} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography sx={{ minWidth: 28, textAlign: 'center', fontWeight: 700 }}>{it.qty}</Typography>
                  <IconButton size="small" onClick={() => updateQty(it.id, it.qty + 1)} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
                    <AddIcon fontSize="small" />
                  </IconButton>
                  <Box sx={{ flex: 1 }} />
                  <IconButton size="small" color="error" onClick={() => removeItem(it.id)}>
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
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1.5}>
          <TextField label="Име и презиме" size="small" fullWidth value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          <TextField label="Телефон" size="small" fullWidth value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
          <TextField label="Град" size="small" fullWidth value={city} onChange={(e) => setCity(e.target.value)} autoComplete="address-level2" />
          <TextField label="Адреса за достава" size="small" fullWidth multiline minRows={2} value={address} onChange={(e) => setAddress(e.target.value)} autoComplete="street-address" />

          {error ? <Alert severity="error">{error}</Alert> : null}

          <Chip icon={<LocalShippingIcon />} label="Плаќање при достава (Cargo Express)" variant="outlined" sx={{ alignSelf: 'flex-start', fontWeight: 600 }} />

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