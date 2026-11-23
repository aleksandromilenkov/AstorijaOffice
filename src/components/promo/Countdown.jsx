'use client'

import { useSyncExternalStore } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// One shared 1-second clock for every countdown on the page.
const listeners = new Set()
let timer = null
function subscribe(listener) {
  listeners.add(listener)
  if (!timer) timer = setInterval(() => listeners.forEach((l) => l()), 1000)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      clearInterval(timer)
      timer = null
    }
  }
}
const getNow = () => Math.floor(Date.now() / 1000)
// Server render (and the first client render) shows no numbers, so the
// server HTML and the hydrated client always match.
const getServerNow = () => null

function parts(seconds) {
  const s = Math.max(0, seconds)
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

const LABELS = { days: 'дена', hours: 'часа', minutes: 'мин.', seconds: 'сек.' }

/**
 * Live countdown to `endsAt`.
 *   variant="boxes"  — big tiles (promo hero / home section)
 *   variant="inline" — one compact line ("Завршува за 3д 04:12:09")
 */
export default function Countdown({ endsAt, variant = 'boxes', inverted = false, label }) {
  const now = useSyncExternalStore(subscribe, getNow, getServerNow)
  if (!endsAt) return null

  const end = Math.floor(new Date(endsAt).getTime() / 1000)
  const p = now == null ? null : parts(end - now)
  const pad = (n) => (p ? String(n).padStart(2, '0') : '--')

  if (variant === 'inline') {
    return (
      <Typography
        variant="body2"
        component="span"
        sx={{
          fontWeight: 700,
          color: inverted ? 'rgba(255,255,255,0.9)' : 'sale.dark',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {label ?? 'Завршува за'}{' '}
        {p ? `${p.days}д ${pad(p.hours)}:${pad(p.minutes)}:${pad(p.seconds)}` : '…'}
      </Typography>
    )
  }

  return (
    <Box role="timer" aria-live="off">
      {label ? (
        <Typography
          variant="overline"
          sx={{
            display: 'block',
            mb: 1,
            fontWeight: 800,
            letterSpacing: '0.16em',
            color: inverted ? 'rgba(255,255,255,0.75)' : 'text.secondary',
          }}
        >
          {label}
        </Typography>
      ) : null}
      <Box sx={{ display: 'flex', gap: { xs: 1, sm: 1.5 } }}>
        {Object.keys(LABELS).map((key) => (
          <Box
            key={key}
            sx={{
              minWidth: { xs: 60, sm: 72 },
              px: 1,
              py: { xs: 1, sm: 1.25 },
              borderRadius: 2.5,
              textAlign: 'center',
              bgcolor: inverted ? 'rgba(255,255,255,0.1)' : 'background.paper',
              border: '1px solid',
              borderColor: inverted ? 'rgba(255,255,255,0.18)' : 'divider',
              backdropFilter: inverted ? 'blur(6px)' : 'none',
            }}
          >
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1.4rem', sm: '1.75rem' },
                lineHeight: 1.1,
                fontVariantNumeric: 'tabular-nums',
                color: inverted ? '#fff' : 'text.primary',
              }}
            >
              <Box
                component="span"
                key={p ? p[key] : 'x'}
                sx={{ display: 'inline-block', animation: 'a-tick 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                {key === 'days' ? (p ? p.days : '--') : pad(p?.[key])}
              </Box>
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: inverted ? 'rgba(255,255,255,0.7)' : 'text.secondary',
              }}
            >
              {LABELS[key]}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
