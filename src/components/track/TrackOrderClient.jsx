'use client'

import { useState } from 'react'
import Link from 'next/link'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import SearchIcon from '@mui/icons-material/Search'
import CheckIcon from '@mui/icons-material/Check'
import InventoryOutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined'
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import { trackOrder } from '@/app/sledenje/actions'
import { ORDER_STATUSES, STATUS_STEPS, statusColor, statusLabel } from '@/lib/orderStatus'
import { formatPrice } from '@/lib/formatPrice'
import { formatDateTimeMk, formatDayMk } from '@/lib/dates'

const STEP_ICONS = {
  received: InventoryOutlinedIcon,
  confirmed: VerifiedOutlinedIcon,
  in_production: PrintOutlinedIcon,
  shipped: LocalShippingOutlinedIcon,
  delivered: HomeOutlinedIcon,
}

function formatPhone(value) {
  let digits = value.replace(/\D/g, '')
  if (!digits.startsWith('07')) digits = '07' + digits.replace(/^0?7?/, '')
  digits = digits.slice(0, 9)
  let out = ''
  for (let i = 0; i < digits.length; i++) {
    if (i === 3 || i === 6) out += '-'
    out += digits[i]
  }
  return out
}

function formatDate(iso, withTime = true) {
  return withTime ? formatDateTimeMk(iso) : formatDayMk(iso)
}

/** Add `n` working days (Mon–Fri) to a date. */
function addWorkingDays(iso, n) {
  const d = new Date(iso)
  let added = 0
  while (added < n) {
    d.setDate(d.getDate() + 1)
    const day = d.getDay()
    if (day !== 0 && day !== 6) added++
  }
  return d.toISOString()
}

export default function TrackOrderClient({ initialCode = '' }) {
  const [code, setCode] = useState(initialCode.toUpperCase())
  const [phone, setPhone] = useState('07')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await trackOrder(code, phone)
      if (result.ok) {
        setOrder(result.order)
      } else {
        setOrder(null)
        setError(result.error)
      }
    } catch {
      setError('Моментално не можеме да ја провериме нарачката. Обидете се повторно.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Stack spacing={3}>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3.5 },
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 18px 40px -24px rgba(20,22,26,0.35)',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr auto' },
            alignItems: 'start',
          }}
        >
          <TextField
            label="Број на нарачка"
            placeholder="пр. 0E0C4F3B"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^0-9A-F#]/g, '').slice(0, 9))}
            autoComplete="off"
            slotProps={{ htmlInput: { spellCheck: false, style: { letterSpacing: '0.08em', fontWeight: 700 } } }}
            required
          />
          <TextField
            label="Телефон од нарачката"
            placeholder="07X-XXX-XXX"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            autoComplete="tel"
            inputMode="tel"
            required
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SearchIcon />}
            sx={{
              height: 56,
              px: 3,
              textTransform: 'none',
              fontWeight: 800,
              borderRadius: 2.5,
              whiteSpace: 'nowrap',
              backgroundImage: 'linear-gradient(135deg, #d71f2b, #b3121d)',
            }}
          >
            Провери
          </Button>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
          Бројот на нарачката го добивте по нарачувањето (8 знаци, пр. #0E0C4F3B).
        </Typography>
        {error ? (
          <Alert severity="warning" sx={{ mt: 2 }}>
            {error}
          </Alert>
        ) : null}
      </Paper>

      {order ? <OrderResult order={order} /> : null}
    </Stack>
  )
}

function OrderResult({ order }) {
  const cancelled = order.status === 'cancelled'
  const currentIndex = STATUS_STEPS.indexOf(order.status)

  // Date each step was reached: when the order last CHANGED to that status
  // ("received" = order date). History also has note-only entries with the
  // same status; they must not move the date (or the delivery estimate).
  const reachedAt = { received: order.created_at }
  let previous = 'received'
  for (const h of order.history ?? []) {
    if (h.status !== previous) reachedAt[h.status] = h.created_at
    previous = h.status
  }

  const shippedAt = reachedAt.shipped
  const showEta = order.status === 'shipped' && shippedAt

  return (
    <Paper
      elevation={0}
      className="a-fade-up"
      sx={{
        p: { xs: 2.5, md: 3.5 },
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: '0.16em', color: 'primary.main' }}>
            Нарачка #{order.code}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
            {statusLabel(order.status)}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            {ORDER_STATUSES[order.status]?.customer}
          </Typography>
        </Box>
        <Chip
          label={statusLabel(order.status)}
          color={statusColor(order.status)}
          sx={{ fontWeight: 800 }}
        />
      </Box>

      {showEta ? (
        <Box
          sx={{
            mt: 2.5,
            p: 2,
            borderRadius: 3,
            bgcolor: 'rgba(215,31,43,0.06)',
            display: 'flex',
            gap: 1.5,
            alignItems: 'center',
          }}
        >
          <LocalShippingOutlinedIcon color="primary" />
          <Typography sx={{ fontWeight: 700 }}>
            Очекувана достава: {formatDate(addWorkingDays(shippedAt, 1), false)} –{' '}
            {formatDate(addWorkingDays(shippedAt, 2), false)}
          </Typography>
        </Box>
      ) : null}

      {cancelled ? (
        <Alert icon={<CancelOutlinedIcon />} severity="error" sx={{ mt: 2.5 }}>
          Оваа нарачка е откажана. Ако мислите дека е грешка, јавете ни се на 070-210-128.
        </Alert>
      ) : (
        <Timeline currentIndex={currentIndex} reachedAt={reachedAt} />
      )}

      <Divider sx={{ my: 3 }} />

      {/* Items */}
      <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
        Производи
      </Typography>
      {order.items?.length ? (
        <Stack spacing={1}>
          {order.items.map((item, i) => (
            <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Typography sx={{ minWidth: 0 }}>
                {item.product_name}
                {item.variant_label ? ` (${item.variant_label})` : ''}{' '}
                <Box component="span" sx={{ color: 'text.secondary' }}>
                  × {item.quantity}
                </Box>
              </Typography>
              <Typography sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                {formatPrice(item.line_total)}
              </Typography>
            </Box>
          ))}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Деталите за производите не се достапни за оваа нарачка.
        </Typography>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Typography sx={{ fontWeight: 800 }}>Вкупно (плаќање при достава)</Typography>
        <Typography sx={{ fontWeight: 900, color: 'primary.main', whiteSpace: 'nowrap' }}>
          {formatPrice(order.total_amount)}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        Нарачано на {formatDate(order.created_at)} · Достава до {order.city}
      </Typography>

      <Box sx={{ mt: 3, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <Button component={Link} href="/prodavnica" variant="outlined" sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2.5 }}>
          Продолжи со купување
        </Button>
        <Button component={Link} href="/contact" sx={{ textTransform: 'none', fontWeight: 700 }}>
          Прашање за нарачката?
        </Button>
      </Box>
    </Paper>
  )
}

function Timeline({ currentIndex, reachedAt }) {
  return (
    <Box
      component="ol"
      aria-label="Тек на нарачката"
      sx={{
        listStyle: 'none',
        m: 0,
        mt: 3,
        p: 0,
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: `repeat(${STATUS_STEPS.length}, 1fr)` },
        gap: { xs: 0, md: 1 },
      }}
    >
      {STATUS_STEPS.map((step, i) => {
        const done = i < currentIndex
        const current = i === currentIndex
        const reached = done || current
        const Icon = STEP_ICONS[step]
        const last = i === STATUS_STEPS.length - 1
        return (
          <Box
            component="li"
            key={step}
            aria-current={current ? 'step' : undefined}
            sx={{
              position: 'relative',
              display: 'flex',
              flexDirection: { xs: 'row', md: 'column' },
              alignItems: { xs: 'flex-start', md: 'center' },
              textAlign: { xs: 'left', md: 'center' },
              gap: { xs: 2, md: 1 },
              pb: { xs: last ? 0 : 3, md: 0 },
            }}
          >
            {/* connector */}
            {!last ? (
              <Box
                aria-hidden
                sx={{
                  position: 'absolute',
                  bgcolor: done ? 'primary.main' : 'divider',
                  // the line "fills up" step by step
                  transformOrigin: { xs: 'top', md: 'left' },
                  animation: done
                    ? {
                        xs: `a-grow-y 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${200 + i * 220}ms backwards`,
                        md: `a-grow-x 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${200 + i * 220}ms backwards`,
                      }
                    : 'none',
                  // vertical on mobile, horizontal on desktop
                  left: { xs: 21, md: 'calc(50% + 26px)' },
                  top: { xs: 46, md: 21 },
                  width: { xs: 2, md: 'calc(100% - 44px)' },
                  height: { xs: 'calc(100% - 46px)', md: 2 },
                }}
              />
            ) : null}
            <Box
              sx={{
                position: 'relative',
                zIndex: 1,
                flexShrink: 0,
                width: 44,
                height: 44,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                bgcolor: reached ? 'primary.main' : 'background.paper',
                color: reached ? '#fff' : 'text.disabled',
                border: '2px solid',
                borderColor: reached ? 'primary.main' : 'divider',
                boxShadow: current ? '0 0 0 6px rgba(215,31,43,0.18)' : 'none',
                animation: reached ? `a-scale-in 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 220}ms backwards` : 'none',
                '&::after': current
                  ? {
                      content: '""',
                      position: 'absolute',
                      inset: -2,
                      borderRadius: '50%',
                      border: '2px solid',
                      borderColor: 'primary.main',
                      animation: 'a-pulse-ring 1.8s cubic-bezier(0.16, 1, 0.3, 1) 1s infinite',
                    }
                  : {},
              }}
            >
              {done ? <CheckIcon /> : <Icon fontSize="small" />}
            </Box>
            <Box sx={{ pt: { xs: 1, md: 0 } }}>
              <Typography
                sx={{
                  fontWeight: current ? 900 : 700,
                  color: reached ? 'text.primary' : 'text.disabled',
                  lineHeight: 1.25,
                }}
              >
                {statusLabel(step)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {reached && reachedAt[step] ? formatDate(reachedAt[step]) : '—'}
              </Typography>
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}
