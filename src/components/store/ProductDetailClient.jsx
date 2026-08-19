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
import { formatPrice } from '@/lib/formatPrice'

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
  const imageUrl = product.image_url || '/img/products/vizitki.svg'

  const dec = () => setQty((q) => Math.max(1, q - 1))
  const inc = () => setQty((q) => q + 1)

  const onAdd = () => {
    if (!inStock) return
    addItem(
      {
        id: product.id,
        name: product.title,
        slug: product.slug,
        price: product.price,
        imageUrl,
      },
      qty,
    )
    setConfirmation(
      qty === 1
        ? 'Производот е додаден во кошничката.'
        : `Додадени ${qty} парчиња во кошничката.`,
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
          <Box
            component="img"
            src={imageUrl}
            alt={product.title}
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
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

          <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
            {formatPrice(product.price)}
          </Typography>

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

          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
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