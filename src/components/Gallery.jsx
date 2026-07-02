import React, { useState, useRef, useEffect, useCallback } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { useTranslations } from '../translations'

const IMAGES = Array.from({ length: 12 }, (_, i) => ({
  file: `shirt${i + 1}.jpg`,
  label: `Design ${String(i + 1).padStart(2, '0')}`,
}))

const BASE = '/img/products/'

function ArrowLeft() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M15 5L8 12L15 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function ArrowRight() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function Gallery({ onClose, initialIndex = 0 }) {
  const { t } = useTranslations()
  const [current, setCurrent] = useState(initialIndex)
  const [direction, setDir]   = useState(1)
  const [animating, setAnim]  = useState(false)
  const [visible, setVisible] = useState(false)

  // touch / drag
  const touchStartX = useRef(null)
  const touchStartY = useRef(null)
  const isSwipe     = useRef(false)   // true once we decide it's horizontal

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  const go = useCallback((next, dir) => {
    if (animating) return
    setDir(dir)
    setAnim(true)
    setTimeout(() => {
      setCurrent(next)
      setAnim(false)
    }, 380)
  }, [animating])

  const prev = useCallback(() => go((current - 1 + IMAGES.length) % IMAGES.length, -1), [current, go])
  const next = useCallback(() => go((current + 1) % IMAGES.length,  1), [current, go])

  // Keyboard
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape' && onClose) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next, onClose])

  // Touch handlers — native touch for reliable mobile swipe
  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    isSwipe.current = false
  }
  function onTouchMove(e) {
    if (touchStartX.current === null) return
    const dx = e.touches[0].clientX - touchStartX.current
    const dy = e.touches[0].clientY - touchStartY.current
    // Once we see more horizontal movement than vertical, lock as a swipe
    if (!isSwipe.current && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
      isSwipe.current = true
    }
    if (isSwipe.current) e.preventDefault() // stop page scroll during horizontal swipe
  }
  function onTouchEnd(e) {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (isSwipe.current && Math.abs(dx) > 44) {
      dx < 0 ? next() : prev()
    }
  }

  const img = IMAGES[current]
  const altText = `${t.products.altPrefix} ${String(current + 1).padStart(2, '0')}`

  const slideStyle = {
    transform: animating ? `translateX(${direction * -55}px)` : 'translateX(0)',
    opacity: animating ? 0 : 1,
    transition: 'transform 0.38s cubic-bezier(0.77,0,0.175,1), opacity 0.38s ease',
    willChange: 'transform, opacity',
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 1400,
        background: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.45s ease',
        userSelect: 'none',
        overflow: 'hidden',
        // Safe area insets for notched phones
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* ── radial glow ── */}
      <Box sx={{
        position: 'absolute',
        width: '70vmax', height: '70vmax',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(134,46,156,0.15) 0%, transparent 70%)',
        top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* ── top bar ── */}
      <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        px: { xs: 2, md: 5 },
        pt: { xs: 2, md: 3 },
        pb: 1,
        zIndex: 10,
      }}>
        <Typography sx={{
          fontSize: '0.65rem', letterSpacing: '0.2em',
          textTransform: 'uppercase', color: '#862e9c', fontWeight: 700,
        }}>
          {t.products.galleryTitle}
        </Typography>

        {onClose && (
          <IconButton
            onClick={onClose}
            aria-label="Close gallery"
            sx={{
              color: 'rgba(255,255,255,0.5)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '50%',
              width: { xs: 36, md: 42 },
              height: { xs: 36, md: 42 },
              '&:hover': { color: '#fff', borderColor: 'rgba(255,255,255,0.4)' },
              transition: 'all 0.2s',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </IconButton>
        )}
      </Box>

      {/* ── image stage ── */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Leave room for top/bottom chrome
        pt: { xs: 7, md: 9 },
        pb: { xs: 10, md: 12 },
        px: { xs: 7, md: 10 }, // room for side arrows
        position: 'relative',
        zIndex: 2,
      }}>
        <Box style={slideStyle} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <Box
            component="img"
            src={`${BASE}${img.file}`}
            alt={img.label}
            sx={{
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
              display: 'block',
              borderRadius: 1,
            }}
          />
        </Box>
      </Box>

      {/* ── arrow buttons — hidden on xs, shown on sm+ ── */}
      {[
        { side: 'left',  action: prev, icon: <ArrowLeft />  },
        { side: 'right', action: next, icon: <ArrowRight /> },
      ].map(({ side, action, icon }) => (
        <Box key={side} sx={{
          position: 'absolute', top: '50%',
          [side]: { xs: 4, sm: 16, md: 28 },
          transform: 'translateY(-50%)',
          zIndex: 10,
          // On mobile hide arrows — users swipe; arrows clutter small screens
          display: { xs: 'none', sm: 'block' },
        }}>
          <IconButton
            onClick={action}
            aria-label={side === 'left' ? 'Previous' : 'Next'}
            sx={{
              color: 'rgba(255,255,255,0.5)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '50%',
              width: { sm: 44, md: 52 },
              height: { sm: 44, md: 52 },
              backdropFilter: 'blur(8px)',
              background: 'rgba(255,255,255,0.03)',
              '&:hover': {
                color: '#fff',
                borderColor: '#862e9c',
                background: 'rgba(134,46,156,0.15)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            {icon}
          </IconButton>
        </Box>
      ))}

      {/* ── bottom bar: label + counter ── */}
      <Box sx={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        px: { xs: 2.5, md: 5 },
        pb: { xs: 3.5, md: 4 },
        zIndex: 10,
      }}>
        <Box style={slideStyle}>
          <Typography sx={{
            fontSize: { xs: '1.1rem', md: '1.8rem' },
            fontWeight: 700, letterSpacing: '-0.02em',
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 1,
          }}>
            {img.label}
          </Typography>
        </Box>

        <Typography sx={{
          fontSize: { xs: '0.7rem', md: '0.78rem' },
          letterSpacing: '0.15em',
          color: 'rgba(255,255,255,0.3)',
          fontVariantNumeric: 'tabular-nums',
          flexShrink: 0,
          ml: 1,
        }}>
          {String(current + 1).padStart(2, '0')} / {String(IMAGES.length).padStart(2, '0')}
        </Typography>
      </Box>

      {/* ── dot nav ── */}
      <Box sx={{
        position: 'absolute',
        bottom: { xs: 56, md: 68 },
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: { xs: 0.8, md: 1.2 },
        zIndex: 10,
      }}>
        {IMAGES.map((_, i) => (
          <Box
            key={i}
            onClick={() => go(i, i > current ? 1 : -1)}
            sx={{
              width: i === current ? 20 : 5,
              height: 5,
              borderRadius: 99,
              background: i === current ? '#862e9c' : 'rgba(255,255,255,0.2)',
              cursor: 'pointer',
              transition: 'width 0.35s cubic-bezier(0.34,1.56,0.64,1), background 0.3s',
              // Bigger tap target on mobile
              '&::after': {
                content: '""',
                display: 'block',
                position: 'absolute',
                inset: '-6px',
              },
              position: 'relative',
            }}
          />
        ))}
      </Box>

      {/* ── swipe hint on mobile (fades out) ── */}
      <Box sx={{
        display: { xs: 'flex', sm: 'none' },
        position: 'absolute',
        bottom: { xs: 72 },
        left: '50%',
        transform: 'translateX(-50%)',
        alignItems: 'center',
        gap: 0.5,
        zIndex: 10,
        opacity: 0.35,
        pointerEvents: 'none',
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 7h4M12 7H8M2 7l3-3M2 7l3 3M12 7l-3-3M12 7l-3 3" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        <Typography sx={{ fontSize: '0.6rem', color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          swipe
        </Typography>
      </Box>

      {/* ── progress bar ── */}
      <Box sx={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '2px', background: 'rgba(255,255,255,0.06)', zIndex: 10,
      }}>
        <Box sx={{
          height: '100%',
          width: `${((current + 1) / IMAGES.length) * 100}%`,
          background: 'linear-gradient(90deg, #862e9c, #c77dff)',
          transition: 'width 0.38s cubic-bezier(0.77,0,0.175,1)',
        }} />
      </Box>
    </Box>
  )
}