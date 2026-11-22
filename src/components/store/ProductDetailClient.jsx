'use client'

import { useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useCart } from '@/store/CartContext'
import {
  effectivePrice,
  isOnSale,
  discountPercent,
  sortedVariants,
  variantPrice,
  variantUnits,
} from '@/lib/pricing'
import { formatPrice } from '@/lib/formatPrice'
import SpecList from './SpecList'
import PriceTag from '@/components/promo/PriceTag'
import Countdown from '@/components/promo/Countdown'
import ProductImageZoom from './ProductImageZoom'

/**
 * Public product detail page (`/prodavnica/[slug]`).
 *
 * Renders the image on the left, with title, price, description and
 * a quantity stepper on the right. Adding to the cart uses the same
 * `addItem` action as the product grid so the badge updates everywhere.
 */
export default function ProductDetailClient({ product, loadError }) {
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  const [confirmation, setConfirmation] = useState('')
  const options = sortedVariants(product)
  const [selectedId, setSelectedId] = useState(options[0]?.id ?? null)

  if (loadError) {
    return (
      <Box sx={{ maxWidth: 1180, mx: 'auto', px: { xs: 2, md: 4 }, py: { xs: 3, md: 6 } }}>
        <Alert severity="error">Не може да се вчита производот: {loadError}</Alert>
      </Box>
    )
  }

  if (!product) {
    return null
  }

  const inStock = product.in_stock ?? true
  const onSale = isOnSale(product)
  const selected = options.find((o) => o.id === selectedId) ?? options[0] ?? null
  // With quantity options the chosen option sets the price.
  const regularPrice = selected ? selected.price : product.price
  const price = selected ? variantPrice(product, selected.price) : effectivePrice(product)

  // Per-piece price for each option ("100 парчиња" → price / 100), and which
  // option is the best value.
  const optionRows = options.map((o) => {
    const now = variantPrice(product, o.price)
    const units = variantUnits(o.label)
    return { ...o, now, perUnit: units ? now / units : null }
  })
  const perUnits = optionRows.map((o) => o.perUnit).filter((v) => v != null)
  const bestPerUnit = perUnits.length > 1 ? Math.min(...perUnits) : null
  const percent = onSale ? discountPercent(product.price, product.sale_price) : 0
  const imageUrl = product.image_url || null

  const dec = () => setQty((q) => Math.max(1, q - 1))
  const inc = () => setQty((q) => q + 1)

  const onAdd = () => {
    if (!inStock) return
    addItem(
      {
        id: product.id,
        name: product.title,
        slug: product.slug,
        price,
        regularPrice,
        imageUrl,
        variantId: selected?.id ?? null,
        variantLabel: selected?.label ?? null,
      },
      qty,
    )
    const what = selected ? ` (${selected.label})` : ''
    setConfirmation(
      qty === 1
        ? `Производот${what} е додаден во кошничката.`
        : `Додадени ${qty} ×${what} во кошничката.`,
    )
  }

  return (
    <Box sx={{ maxWidth: 1180, mx: 'auto', px: { xs: 2, md: 4 }, py: { xs: 3, md: 6 } }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          Дома
        </Link>
        <Link href="/prodavnica" style={{ color: 'inherit', textDecoration: 'none' }}>
          Продавница
        </Link>
        <Typography color="text.primary" sx={{ fontWeight: 600 }}>
          {product.title}
        </Typography>
      </Breadcrumbs>

      <Button
        component={Link}
        href="/prodavnica"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3, textTransform: 'none', fontWeight: 600 }}
      >
        Назад кон продавница
      </Button>

      <Box
        sx={{
          display: 'grid',
          gap: { xs: 3, md: 5 },
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.05fr) minmax(0, 1fr)' },
          alignItems: 'flex-start',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            position: 'relative',
            borderRadius: 3,
            border: '1px solid rgba(0,0,0,0.08)',
            overflow: 'hidden',
            bgcolor: 'grey.100',
            aspectRatio: '4 / 3',
          }}
        >
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(135deg, rgba(134,46,156,0.10), rgba(174,62,201,0.10))',
            }}
          />
          <ProductImageZoom imageUrl={imageUrl} alt={product.title} />
          {!inStock ? (
            <Chip
              label="Нема на залиха"
              color="default"
              size="small"
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                bgcolor: 'background.paper',
                fontWeight: 700,
              }}
            />
          ) : null}
        </Paper>

        <Stack spacing={2.5} sx={{ minWidth: 0 }}>
          <Box>
            <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: '0.16em', color: 'primary.main' }}>
              Асторија · Производ
            </Typography>
            <Typography
              variant="h3"
              component="h1"
              sx={{ fontWeight: 800, fontSize: { xs: '1.85rem', md: '2.4rem' }, lineHeight: 1.15 }}
            >
              {product.title}
            </Typography>
          </Box>

          <Box>
            {onSale ? (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 1.25,
                  px: 1.25,
                  py: 0.5,
                  borderRadius: 999,
                  bgcolor: 'sale.light',
                  color: 'sale.dark',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                }}
              >
                Промоција −{percent}%
              </Box>
            ) : null}
            <PriceTag
              price={price}
              regularPrice={onSale ? regularPrice : null}
              size="lg"
              showSavings
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
              Цената е со вклучен ДДВ · Бесплатна достава
            </Typography>
            {onSale && product.sale_ends_at ? (
              <Box sx={{ mt: 1 }}>
                <Countdown endsAt={product.sale_ends_at} variant="inline" label="Промоцијата завршува за" />
              </Box>
            ) : null}
          </Box>

          {optionRows.length > 0 ? (
            <Box role="radiogroup" aria-label="Количина">
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                Изберете количина
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gap: 1,
                  gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)' },
                }}
              >
                {optionRows.map((o) => {
                  const active = o.id === selected?.id
                  const best = bestPerUnit != null && o.perUnit === bestPerUnit
                  return (
                    <Box
                      key={o.id}
                      component="button"
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setSelectedId(o.id)}
                      sx={{
                        position: 'relative',
                        textAlign: 'left',
                        font: 'inherit',
                        cursor: 'pointer',
                        p: 1.5,
                        borderRadius: 2.5,
                        border: '2px solid',
                        borderColor: active ? 'primary.main' : 'divider',
                        bgcolor: active ? 'rgba(134,46,156,0.06)' : 'background.paper',
                        transition: 'border-color 150ms ease, background-color 150ms ease',
                        '&:hover': { borderColor: active ? 'primary.main' : 'primary.light' },
                        '&:focus-visible': { outline: '3px solid rgba(134,46,156,0.35)', outlineOffset: 2 },
                      }}
                    >
                      {best ? (
                        <Box
                          component="span"
                          sx={{
                            position: 'absolute',
                            top: -10,
                            right: 8,
                            px: 0.75,
                            borderRadius: 999,
                            bgcolor: 'success.main',
                            color: '#fff',
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            lineHeight: '18px',
                          }}
                        >
                          Најисплатливо
                        </Box>
                      ) : null}
                      <Typography sx={{ fontWeight: 800, lineHeight: 1.25 }}>{o.label}</Typography>
                      <Typography sx={{ fontWeight: 700, color: onSale ? 'sale.main' : 'primary.main' }}>
                        {formatPrice(o.now)}
                      </Typography>
                      {o.perUnit != null ? (
                        <Typography variant="caption" color="text.secondary">
                          {o.perUnit.toLocaleString('en-US', { maximumFractionDigits: 2 }).replace('.', ',')} ден./парче
                        </Typography>
                      ) : null}
                    </Box>
                  )
                })}
              </Box>
            </Box>
          ) : null}

          {product.specs?.length ? (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                Спецификации
              </Typography>
              <SpecList specs={product.specs} />
            </Box>
          ) : null}

          <Divider />

          {product.description ? (
            <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
              {product.description}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Опис за овој производ дополнително.
            </Typography>
          )}

          <Stack useFlexGap direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
              <IconButton
                onClick={dec}
                disabled={!inStock || qty <= 1}
                aria-label="Намали количина"
                sx={{ border: '1px solid rgba(0,0,0,0.12)', borderRadius: 2 }}
              >
                <RemoveIcon />
              </IconButton>
              <Typography sx={{ minWidth: 36, textAlign: 'center', fontWeight: 700 }}>
                {qty}
              </Typography>
              <IconButton
                onClick={inc}
                disabled={!inStock}
                aria-label="Зголеми количина"
                sx={{ border: '1px solid rgba(0,0,0,0.12)', borderRadius: 2 }}
              >
                <AddIcon />
              </IconButton>
            </Stack>

            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCartIcon />}
              onClick={onAdd}
              disabled={!inStock}
              sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, px: 3 }}
            >
              Додади во кошничка
            </Button>
          </Stack>

          {confirmation ? <Alert severity="success">{confirmation}</Alert> : null}
        </Stack>
      </Box>
    </Box>
  )
}