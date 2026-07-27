'use client'

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
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import { useCart } from '@/store/CartContext'
import { formatPrice } from '@/lib/formatPrice'

/**
 * The cart "body" — line items + totals + checkout form.
 *
 * Shared by the legacy slide-in drawer and the full-page `/kosnicka`
 * route. It renders nothing chrome-specific itself, so the parent can
 * wrap it in either a Drawer or a regular page.
 */
export default function CartBody() {
  const {
    items,
    count,
    subtotal,
    updateQty,
    removeItem,
    clear,
  } = useCart()

  const shipping = 0 // Free shipping for the v1 of the store.
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: { xs: 6, md: 10 } }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
          Вашата кошничка е празна.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Додајте производи од Продавницата за да продолжите.
        </Typography>
        <Button
          component={Link}
          href="/prodavnica"
          variant="contained"
          color="primary"
          size="large"
          sx={{ textTransform: 'none', fontWeight: 800, borderRadius: 2 }}
        >
          Кон Продавница
        </Button>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gap: { xs: 3, md: 4 },
        gridTemplateColumns: { xs: '1fr', md: '1fr 380px' },
        alignItems: 'start',
      }}
    >
      {/* Line items */}
      <Stack spacing={2}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Производи ({count})
        </Typography>
        <Stack
          spacing={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            overflow: 'hidden',
            bgcolor: 'background.paper',
          }}
        >
          {items.map((it, idx) => (
            <Stack
              key={it.id}
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{
                p: 2,
                borderTop: idx === 0 ? 'none' : '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box
                sx={{
                  width: { xs: '100%', sm: 96 },
                  height: 96,
                  borderRadius: 2,
                  bgcolor: 'grey.100',
                  background:
                    'linear-gradient(135deg, rgba(134,46,156,0.12), rgba(174,62,201,0.12))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                {it.imageUrl ? (
                  <Image
                    src={it.imageUrl}
                    alt={it.name}
                    width={96}
                    height={96}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : null}
              </Box>

              <Stack sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, lineHeight: 1.25 }}
                >
                  {it.name}
                </Typography>
                <Typography variant="body2" color="primary" sx={{ fontWeight: 700, mt: 0.25 }}>
                  {formatPrice(it.price)}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mt: 1.5, alignItems: 'center' }}
                >
                  <IconButton
                    size="small"
                    onClick={() => updateQty(it.id, it.qty - 1)}
                    aria-label="Намали"
                    sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography sx={{ minWidth: 28, textAlign: 'center', fontWeight: 700 }}>
                    {it.qty}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => updateQty(it.id, it.qty + 1)}
                    aria-label="Зголеми"
                    sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                  <Box sx={{ flex: 1 }} />
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => removeItem(it.id)}
                    aria-label="Отстрани"
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>

              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 800, alignSelf: { xs: 'flex-end', sm: 'center' } }}
              >
                {formatPrice(it.price * it.qty)}
              </Typography>
            </Stack>
          ))}
        </Stack>

        <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
          <Button
            variant="text"
            color="inherit"
            onClick={clear}
            sx={{ textTransform: 'none', fontWeight: 700 }}
          >
            Испразни кошничка
          </Button>
        </Stack>
      </Stack>

      {/* Summary + checkout */}
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          p: { xs: 2, md: 2.5 },
          bgcolor: 'background.paper',
          position: { md: 'sticky' },
          top: { md: 96 },
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>
          Преглед на нарачка
        </Typography>
        <Stack spacing={1}>
          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">Меѓузбир</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {formatPrice(subtotal)}
            </Typography>
          </Stack>
          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">Достава</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {shipping === 0 ? 'Бесплатна' : formatPrice(shipping)}
            </Typography>
          </Stack>
          <Divider sx={{ my: 0.5 }} />
          <Stack
            direction="row"
            sx={{ alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Вкупно</Typography>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 800, color: 'primary.main' }}
            >
              {formatPrice(total)}
            </Typography>
          </Stack>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1.5}>
          <TextField
            label="Име и презиме"
            size="small"
            fullWidth
            autoComplete="name"
          />
          <TextField
            label="Телефон"
            size="small"
            fullWidth
            autoComplete="tel"
          />
          <TextField
            label="Адреса за достава"
            size="small"
            fullWidth
            autoComplete="street-address"
            multiline
            minRows={2}
          />
          <Chip
            icon={<LocalShippingIcon />}
            label="Плаќање при достава (Cargo Express)"
            variant="outlined"
            sx={{ alignSelf: 'flex-start', fontWeight: 600 }}
          />
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{ mt: 1, textTransform: 'none', fontWeight: 800, borderRadius: 2 }}
            onClick={() => {
              // TODO: replace with a Supabase/server action call.
              alert('Нарачката е примена! (демо)')
            }}
          >
            Купи
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}