import React, { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

const ITEMS = [
  { label: 'Shirts',    icon: '👕' },
  { label: 'Pencils',   icon: '✏️' },
  { label: 'Caps',      icon: '🧢' },
  { label: 'Paper',     icon: '📄' },
  { label: 'Lighters',  icon: '🔥' },
  { label: 'Bags',      icon: '👜' },
  { label: 'Cups',      icon: '☕' },
  { label: 'Calendars', icon: '📅' },
  { label: 'Labels',    icon: '🏷️' },
  { label: 'Stickers',  icon: '⭐' },
  { label: 'More...',   icon: '✨' },
]

const KEYFRAMES = `
@keyframes wde-fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes wde-pillIn {
  from { opacity: 0; transform: translateY(10px) scale(0.92); }
  to   { opacity: 1; transform: translateY(0)   scale(1); }
}
@keyframes wde-gridPan {
  from { background-position: 0 0; }
  to   { background-position: 48px 48px; }
}
@keyframes wde-glow {
  0%, 100% { opacity: 0.12; transform: translate(-50%, -50%) scale(1); }
  50%       { opacity: 0.22; transform: translate(-50%, -50%) scale(1.12); }
}
@keyframes wde-orb1 {
  0%,100% { transform: translate(0,   0);   }
  33%     { transform: translate(18px, -14px); }
  66%     { transform: translate(-12px, 10px); }
}
@keyframes wde-orb2 {
  0%,100% { transform: translate(0,   0);   }
  33%     { transform: translate(-16px, 12px); }
  66%     { transform: translate(14px, -10px); }
}
`

export default function WeDesignEverything() {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <Box
      component="section"
      id="we-design-everything"
      ref={ref}
      sx={{
        position: 'relative',
        bgcolor: '#0a0a0a',
        overflow: 'hidden',
        py: { xs: 8, md: 12 },
      }}
    >
      <style>{KEYFRAMES}</style>

      {/* Animated grid pan */}
      <Box sx={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(134,46,156,0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(134,46,156,0.06) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
        animation: 'wde-gridPan 8s linear infinite',
        zIndex: 0,
      }} />

      {/* Breathing radial glow — center */}
      <Box sx={{
        position: 'absolute',
        top: '50%', left: '50%',
        width: '65vw', height: '65vw',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(134,46,156,0.18) 0%, transparent 65%)',
        animation: 'wde-glow 6s ease-in-out infinite',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Floating orb — top right */}
      <Box sx={{
        position: 'absolute', top: '15%', right: '8%',
        width: { xs: 120, md: 220 }, height: { xs: 120, md: 220 },
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(174,62,201,0.18) 0%, transparent 70%)',
        animation: 'wde-orb1 9s ease-in-out infinite',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Floating orb — bottom left */}
      <Box sx={{
        position: 'absolute', bottom: '10%', left: '6%',
        width: { xs: 100, md: 180 }, height: { xs: 100, md: 180 },
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(134,46,156,0.15) 0%, transparent 70%)',
        animation: 'wde-orb2 11s ease-in-out infinite',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

          {/* Overline */}
          <Box sx={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}>
            <Typography sx={{
              fontSize: '0.65rem', letterSpacing: '0.25em',
              textTransform: 'uppercase', color: '#862e9c',
              fontWeight: 700, mb: 2,
            }}>
              what we print
            </Typography>
          </Box>

          {/* "We design" */}
          <Box sx={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.65s ease 0.1s, transform 0.65s ease 0.1s',
          }}>
            <Typography sx={{
              fontSize: { xs: '2.6rem', sm: '3.4rem', md: '4.2rem' },
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              color: '#fff',
              mb: 0.5,
            }}>
              We design
            </Typography>
          </Box>

          {/* "everything." — gradient + shimmer */}
          <Box sx={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.65s ease 0.2s, transform 0.65s ease 0.2s',
            mb: { xs: 5, md: 7 },
            position: 'relative',
          }}>
            <Typography sx={{
              fontSize: { xs: '2.6rem', sm: '3.4rem', md: '4.2rem' },
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              background: 'linear-gradient(90deg, #862e9c 0%, #c77dff 50%, #862e9c 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: visible ? 'shimmer 4s linear infinite' : 'none',
              '@keyframes shimmer': {
                from: { backgroundPosition: '0% center' },
                to:   { backgroundPosition: '200% center' },
              },
            }}>
              everything.
            </Typography>
          </Box>

          {/* Pills */}
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1.2,
            justifyContent: 'center',
            maxWidth: 560,
          }}>
            {ITEMS.map((item, i) => (
              <Box
                key={item.label}
                sx={{
                  px: 2.2, py: 0.85,
                  borderRadius: 99,
                  border: '1px solid rgba(134,46,156,0.35)',
                  background: 'rgba(134,46,156,0.1)',
                  backdropFilter: 'blur(8px)',
                  fontSize: { xs: '0.82rem', md: '0.88rem' },
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.8)',
                  letterSpacing: '0.02em',
                  cursor: 'default',
                  opacity: visible ? 1 : 0,
                  animation: visible ? `wde-pillIn 0.5s ease both` : 'none',
                  animationDelay: `${0.35 + i * 0.055}s`,
                  transition: 'background 0.22s, border-color 0.22s, color 0.22s, transform 0.22s, box-shadow 0.22s',
                  '&:hover': {
                    background: 'rgba(134,46,156,0.3)',
                    borderColor: '#ae3ec9',
                    color: '#fff',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 6px 22px rgba(134,46,156,0.35)',
                  },
                }}
              >
                {item.icon} {item.label}
              </Box>
            ))}
          </Box>

          {/* Bottom tagline */}
          <Box sx={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            transition: `opacity 0.6s ease ${0.35 + ITEMS.length * 0.055 + 0.1}s, transform 0.6s ease ${0.35 + ITEMS.length * 0.055 + 0.1}s`,
            mt: 5,
          }}>
            <Typography sx={{
              fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.06em',
            }}>
              If you can imagine it — we can print it.
            </Typography>
          </Box>

        </Box>
      </Container>
    </Box>
  )
}