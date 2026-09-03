'use client'

import Link from 'next/link'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress'
import AdminNav from '@/components/admin/AdminNav'
import { formatPrice } from '@/lib/formatPrice'
import { updateOrderStatus } from '@/app/admin/orders/actions'
import { useState } from 'react'

const STATUS_COLORS = {
  pending: 'warning',
  shipped: 'success',
  cancelled: 'default',
}

const STATUS_LABELS = {
  pending: 'чекање',
  shipped: 'испорачано',
  cancelled: 'откажано',
}

function parseLineItems(notes) {
  if (!notes) return []
  try {
    const parsed = JSON.parse(notes)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function AdminOrderDetailClient({ order, loadError }) {
  const [status, setStatus] = useState(order.status)
  const [note, setNote] = useState('')
  const [updating, setUpdating] = useState(false)
  const [updateError, setUpdateError] = useState(null)

  if (!order) {
    return (
      <Box sx={{ maxWidth: 1080, mx: 'auto', px: 3, py: 4 }}>
        <AdminNav active="/admin/orders" />
        <Alert severity="error">Нарачката не постои.</Alert>
      </Box>
    )
  }

  const lineItems = parseLineItems(order.notes)
  const shortId = (order.id ?? '').slice(0, 8).toUpperCase()
  const statusColor = STATUS_COLORS[status] ?? 'default'

  async function handleUpdateStatus() {
    setUpdating(true)
    setUpdateError(null)
    try {
      await updateOrderStatus(order.id, status, note)
      setNote('')
      // The page will revalidate via the server action
    } catch (e) {
      setUpdateError(e.message)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 1080, mx: 'auto', px: 3, py: 4 }}>
      <AdminNav active="/admin/orders" />

      <Button
        component={Link}
        href="/admin/orders"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3, textTransform: 'none', fontWeight: 600 }}
      >
        Сите нарачки
      </Button>

      {loadError ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {loadError}
        </Alert>
      ) : null}

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between', mb: 3 }}
      >
        <Box>
          <Typography
            variant="overline"
            sx={{ fontWeight: 800, letterSpacing: '0.18em', color: 'primary.main' }}
          >
            Нарачка
          </Typography>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 800, fontSize: { xs: '1.85rem', md: '2.4rem' } }}
          >
            #{shortId}
          </Typography>
          <Typography color="text.secondary">
            {new Date(order.created_at).toLocaleString('mk-MK', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', alignSelf: { xs: 'flex-start', md: 'center' } }}>
          <TextField
            select
            size="small"
            label="Статус"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            sx={{ minWidth: 160 }}
          >
            {Object.keys(STATUS_COLORS).map((s) => (
              <MenuItem key={s} value={s}>
                {STATUS_LABELS[s]}
              </MenuItem>
            ))}
          </TextField>
          <Chip
            label={STATUS_LABELS[status] ?? status}
            color={statusColor}
            sx={{ fontWeight: 700 }}
          />
        </Stack>
      </Stack>

      {updateError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Грешка при ажурирање: {updateError}
        </Alert>
      )}

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.4fr) minmax(0, 1fr)' },
          alignItems: 'flex-start',
        }}
      >
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
            Производи
          </Typography>

          {lineItems.length === 0 ? (
            <Typography color="text.secondary">
              Нема детали за ставките во оваа нарачка.
            </Typography>
          ) : (
            <Stack
              spacing={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              {lineItems.map((item, idx) => (
                <Stack
                  key={`${item.product_id ?? item.product_name ?? idx}`}
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.5}
                  sx={{
                    p: 2,
                    borderTop: idx === 0 ? 'none' : '1px solid',
                    borderColor: 'divider',
                    alignItems: { sm: 'center' },
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700 }} noWrap>
                      {item.product_name}
                    </Typography>
                    {item.product_slug ? (
                      <Typography variant="caption" color="text.secondary">
                        /prodavnica/{item.product_slug}
                      </Typography>
                    ) : null}
                  </Box>
                  <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {item.quantity} × {formatPrice(item.unit_price)}
                    </Typography>
                    <Typography
                      sx={{ fontWeight: 800, minWidth: 110, textAlign: 'right' }}
                    >
                      {formatPrice(item.line_total)}
                    </Typography>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          )}

          <Divider sx={{ my: 3 }} />

          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              Вкупно за наплата
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, color: 'primary.main' }}
            >
              {formatPrice(order.total_amount)}
            </Typography>
          </Stack>
        </Paper>

        <Stack spacing={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
              Клиент
            </Typography>
            <Stack spacing={1.25}>
              <DetailRow label="Име" value={order.shipping_name} />
              <DetailRow label="Телефон" value={order.shipping_phone} />
              <DetailRow label="Град" value={order.shipping_city} />
              <DetailRow label="Адреса" value={order.shipping_address} />
            </Stack>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
              Достава
            </Typography>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <LocalShippingIcon color="primary" />
              <Typography sx={{ fontWeight: 600 }}>
                Плаќање при достава
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Нарачката ќе биде испратена откако ќе потврдите со клиентот.
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Белешка за статусот / Историја
            </Typography>
            <Stack spacing={2}>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Додај забелешка за промената на статусот..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                size="small"
              />
              <Button
                variant="contained"
                disabled={updating || status === order.status && !note}
                onClick={handleUpdateStatus}
                startIcon={updating && <CircularProgress size={20} color="inherit" />}
                sx={{ alignSelf: 'flex-end', textTransform: 'none', fontWeight: 600 }}
              >
                {updating ? 'Зачувување...' : 'Зачувај промена'}
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Box>
    </Box>
  )
}

function DetailRow({ label, value }) {
  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: 'baseline' }}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ minWidth: 90, fontWeight: 600 }}
      >
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 600, wordBreak: 'break-word' }}>
        {value || '—'}
      </Typography>
    </Stack>
  )
}