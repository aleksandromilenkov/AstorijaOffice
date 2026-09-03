'use client'

import { useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
// CardMedia is no longer needed because we use ProductImageZoom for the image.
// import CardMedia from '@mui/material/CardMedia'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { useCart } from '@/store/CartContext'
import { formatPrice } from '@/lib/formatPrice'

/**
 * Single product tile on the Продавница grid.
 *
 * Owns its own local `qty` state until "Додади во кошничка" is clicked.
 * That keeps the parent grid from re-rendering on every +/- tap.
 */
export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)

  const dec = () => setQty((q) => Math.max(1, q - 1))
  const inc = () => setQty((q) => q + 1)

  const onAdd = () => addItem(product, qty)

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
        <CardActionArea
          component={Link}
          href={product.slug ? `/prodavnica/${encodeURIComponent(product.slug)}` : '#'}
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
        {/* Product image */}
        {product.imageUrl ? (
          <Box
            component="img"
            src={product.imageUrl}
            alt={product.name}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999',
              fontSize: '0.8rem',
            }}
          >
            No Image
          </Box>
        )}
        {/* Out‑of‑stock chip stays on top of the image */}
        {!product.inStock && (
          <Chip
            label="Нема на залиха"
            color="default"
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              bgcolor: 'background.paper',
              fontWeight: 600,
            }}
          />
        )}
      </CardActionArea>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        <Typography
          variant="h6"
          component={Link}
          href={product.slug ? `/prodavnica/${encodeURIComponent(product.slug)}` : '#'}
          sx={{
            fontSize: '1.05rem',
            fontWeight: 700,
            lineHeight: 1.3,
            color: 'inherit',
            textDecoration: 'none',
            '&:hover': { color: 'primary.main' },
          }}
        >
          {product.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          component={Link}
          href={product.slug ? `/prodavnica/${encodeURIComponent(product.slug)}` : '#'}
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.description}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
          {formatPrice(product.price)}
        </Typography>

        <Divider flexItem sx={{ my: 0.5 }} />

        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <IconButton
              size="small"
              onClick={dec}
              disabled={!product.inStock}
              aria-label="Намали количина"
              sx={{
                border: '1px solid rgba(0,0,0,0.12)',
                borderRadius: 2,
              }}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            <Typography
              sx={{
                minWidth: 28,
                textAlign: 'center',
                fontWeight: 700,
              }}
              aria-label="Количина"
            >
              {qty}
            </Typography>
            <IconButton
              size="small"
              onClick={inc}
              disabled={!product.inStock}
              aria-label="Зголеми количина"
              sx={{
                border: '1px solid rgba(0,0,0,0.12)',
                borderRadius: 2,
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<ShoppingCartIcon />}
            onClick={onAdd}
            disabled={!product.inStock}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 2,
              px: 1.5,
            }}
          >
            Додади во кошничка
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}