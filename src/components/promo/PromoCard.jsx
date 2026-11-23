'use client'

import { useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import CheckIcon from '@mui/icons-material/Check'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import { useCart } from '@/store/CartContext'
import { discountPercent, variantPrice } from '@/lib/pricing'
import ProductImg from '@/components/store/ProductImg'
import PriceTag from './PriceTag'
import Countdown from './Countdown'

/**
 * Large promotion card: image with discount badge, promo price vs regular
 * price, savings, a live countdown and a one-tap "add to cart".
 *
 * `product` is a products row (title, slug, price, sale_price, sale_ends_at…).
 */
export default function PromoCard({ product, layout = 'horizontal' }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const href = `/prodavnica/${encodeURIComponent(product.slug)}`
  const percent = discountPercent(product.price, product.sale_price)
  // Products with quantity options: show the cheapest option, choose on the product page.
  const options = product.product_variants ?? []
  const hasVariants = options.length > 0
  const regular = hasVariants ? Math.min(...options.map((v) => v.price)) : product.price
  const current = hasVariants ? variantPrice(product, regular) : product.sale_price
  const horizontal = layout === 'horizontal'

  function handleAdd() {
    addItem(
      {
        id: product.id,
        name: product.title,
        slug: product.slug,
        price: product.sale_price,
        regularPrice: product.price,
        imageUrl: product.image_url || null,
      },
      1,
    )
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  return (
    <Box
      component="article"
      sx={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: horizontal ? { xs: '1fr', sm: '44% 1fr' } : '1fr',
        bgcolor: 'background.paper',
        // Cards sit on dark sections too; never inherit white text.
        color: 'text.primary',
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'rgba(215,31,43,0.14)',
        boxShadow: '0 18px 40px -24px rgba(20,22,26,0.35)',
        transition: 'transform 220ms ease, box-shadow 220ms ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 28px 56px -26px rgba(20,22,26,0.45)',
        },
        '&:hover .promo-img': { transform: 'scale(1.04)' },
      }}
    >
      {/* Image + discount badge */}
      <Box
        component={Link}
        href={href}
        aria-label={product.title}
        sx={{
          position: 'relative',
          display: 'block',
          overflow: 'hidden',
          bgcolor: '#f5f3f2',
          aspectRatio: horizontal ? { xs: '4 / 3', sm: 'auto' } : '4 / 3',
          minHeight: horizontal ? { sm: 300 } : undefined,
        }}
      >
        <ProductImg
          className="promo-img"
          src={product.image_url}
          alt={product.title}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 400ms ease',
          }}
        />
        {percent > 0 ? (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              px: 1.5,
              py: 0.75,
              borderRadius: 999,
              bgcolor: 'sale.main',
              color: 'sale.contrastText',
              fontWeight: 900,
              fontSize: '1.05rem',
              letterSpacing: '0.02em',
              boxShadow: '0 8px 20px -6px rgba(242,106,27,0.6)',
            }}
          >
            −{percent}%
          </Box>
        ) : null}
      </Box>

      {/* Details */}
      <Stack spacing={2} sx={{ p: { xs: 2.5, sm: 3.5 }, justifyContent: 'center' }}>
        <Box>
          <Typography
            variant="overline"
            sx={{ fontWeight: 800, letterSpacing: '0.16em', color: 'sale.main', lineHeight: 1.6 }}
          >
            Промоција
          </Typography>
          <Typography
            component={Link}
            href={href}
            variant="h5"
            sx={{
              display: 'block',
              fontWeight: 800,
              lineHeight: 1.2,
              fontSize: { xs: '1.3rem', md: '1.5rem' },
              '&:hover': { color: 'primary.main' },
            }}
          >
            {product.title}
          </Typography>
          {product.description ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 1,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {product.description}
            </Typography>
          ) : null}
        </Box>

        <PriceTag
          price={current}
          regularPrice={regular}
          size="lg"
          showSavings={!hasVariants}
          fromPrefix={hasVariants}
        />

        {product.sale_ends_at ? <Countdown endsAt={product.sale_ends_at} variant="inline" /> : null}

        {hasVariants ? (
          <Button
            component={Link}
            href={href}
            variant="contained"
            size="large"
            fullWidth
            disabled={!product.in_stock}
            endIcon={<ArrowForwardIcon />}
            sx={{
              textTransform: 'none',
              fontWeight: 800,
              borderRadius: 2.5,
              py: 1.25,
              backgroundImage: 'linear-gradient(135deg, #d71f2b, #b3121d)',
            }}
          >
            Избери количина
          </Button>
        ) : (
        <Stack spacing={1}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleAdd}
            disabled={!product.in_stock}
            startIcon={added ? <CheckIcon /> : <AddShoppingCartIcon />}
            sx={{
              whiteSpace: 'nowrap',
              textTransform: 'none',
              fontWeight: 800,
              borderRadius: 2.5,
              py: 1.25,
              ...(added
                ? {}
                : { backgroundImage: 'linear-gradient(135deg, #d71f2b, #b3121d)' }),
            }}
            color={added ? 'success' : 'primary'}
          >
            {!product.in_stock ? 'Нема на залиха' : added ? 'Додадено во кошничка' : 'Додади во кошничка'}
          </Button>
          <Button
            component={Link}
            href={added ? '/kosnicka' : href}
            fullWidth
            endIcon={<ArrowForwardIcon />}
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2.5 }}
          >
            {added ? 'Кон кошничка' : 'Погледни детали'}
          </Button>
        </Stack>
        )}

        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', color: 'text.secondary' }}>
          <LocalShippingOutlinedIcon fontSize="small" />
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            Бесплатна достава · Плаќање при достава
          </Typography>
        </Stack>
      </Stack>
    </Box>
  )
}
