import React, { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

const STEPS = [
  {
    num: '01',
    title: 'Send Your Design',
    desc: 'Share your idea, logo, or file — any format works. Not sure what you need? We will guide you.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
    ),
  },
  {
    num: '02',
    title: 'We Prepare a Mockup',
    desc: 'Our team creates a preview so you see exactly how the final product will look before we print.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v4l3 3"/>
        <path d="M5 3l14 0M5 21l14 0"/>
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Production',
    desc: 'Once you approve the mockup, we go to print. Fast turnaround, consistent quality, every time.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 6 2 18 2 18 9"/>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
        <rect x="6" y="14" width="12" height="8"/>
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Delivery',
    desc: 'Your order is packaged and ready. Pick it up in store or have it delivered straight to your door.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1"/>
        <path d="M16 8h4l3 5v3h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
]

function Step({ step, index, total }) {
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

  const isLast = index === total - 1

  return (
    <Box
      ref={ref}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'row', md: 'column' },
        alignItems: { xs: 'flex-start', md: 'center' },
        flex: 1,
        position: 'relative',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.6s ease ${index * 150}ms, transform 0.6s ease ${index * 150}ms`,
      }}
    >
      {/* Connector line between steps — desktop horizontal, hidden on mobile */}
      {!isLast && (
        <Box sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          top: 28,
          left: 'calc(50% + 36px)',
          right: 'calc(-50% + 36px)',
          height: '1px',
          zIndex: 0,
          overflow: 'hidden',
        }}>
          {/* dashed animated line */}
          <Box sx={{
            width: '100%', height: '100%',
            backgroundImage: 'linear-gradient(90deg, #862e9c 50%, transparent 50%)',
            backgroundSize: '10px 1px',
            opacity: visible ? 0.5 : 0,
            transition: `opacity 0.6s ease ${index * 150 + 300}ms`,
          }} />
          {/* progress fill */}
          <Box sx={{
            position: 'absolute', top: 0, left: 0,
            height: '2px',
            width: visible ? '100%' : '0%',
            background: 'linear-gradient(90deg, #862e9c, #c77dff)',
            transition: `width 0.9s ease ${index * 150 + 400}ms`,
            mt: '-1px',
          }} />
        </Box>
      )}

      {/* Mobile vertical connector */}
      {!isLast && (
        <Box sx={{
          display: { xs: 'block', md: 'none' },
          position: 'absolute',
          top: 56,
          left: 27,
          width: '1px',
          height: 'calc(100% - 20px)',
          backgroundImage: 'linear-gradient(180deg, #862e9c 50%, transparent 50%)',
          backgroundSize: '1px 10px',
          opacity: 0.4,
          zIndex: 0,
        }} />
      )}

      {/* Mobile layout: icon col + text col */}
      {/* Icon circle */}
      <Box sx={{
        position: 'relative', zIndex: 1,
        flexShrink: 0,
        width: 56, height: 56,
        borderRadius: '50%',
        border: '1.5px solid rgba(134,46,156,0.4)',
        background: 'rgba(134,46,156,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#ae3ec9',
        mb: { xs: 0, md: 2.5 },
        mr: { xs: 2.5, md: 0 },
        transition: 'all 0.3s',
        '&:hover': {
          background: 'rgba(134,46,156,0.2)',
          borderColor: '#862e9c',
          transform: 'scale(1.08)',
        },
        // step number badge
        '&::after': {
          content: `"${step.num}"`,
          position: 'absolute',
          top: -8, right: -8,
          width: 20, height: 20,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #862e9c, #c77dff)',
          fontSize: '0.55rem',
          fontWeight: 800,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: '20px',
          textAlign: 'center',
        },
      }}>
        {step.icon}
      </Box>

      {/* Text */}
      <Box sx={{ textAlign: { xs: 'left', md: 'center' }, pb: { xs: 4, md: 0 } }}>
        <Typography sx={{
          fontSize: '1rem',
          fontWeight: 700,
          letterSpacing: '-0.01em',
          color: 'text.primary',
          mb: 0.75,
        }}>
          {step.title}
        </Typography>
        <Typography sx={{
          fontSize: '0.8rem',
          color: 'text.secondary',
          lineHeight: 1.7,
          maxWidth: { xs: '100%', md: 180 },
        }}>
          {step.desc}
        </Typography>
      </Box>
    </Box>
  )
}

export default function Process() {
  return (
    <Box
      component="section"
      id="process"
      sx={{
        py: { xs: 7, md: 10 },
        position: 'relative',
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-10%', right: '-5%',
          width: '40vw', height: '40vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(134,46,156,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg">

        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Typography sx={{
            fontSize: '0.65rem', letterSpacing: '0.22em',
            textTransform: 'uppercase', color: 'primary.main',
            fontWeight: 700, mb: 1.5, display: 'block',
          }}>
            how it works
          </Typography>
          <Typography sx={{
            fontSize: { xs: '2rem', md: '2.8rem' },
            fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1,
          }}>
            From idea to{' '}
            <Box component="span" sx={{
              background: 'linear-gradient(90deg, #862e9c, #c77dff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              your hands
            </Box>
          </Typography>
          <Typography sx={{
            mt: 1.5, fontSize: '0.9rem',
            color: 'text.secondary', maxWidth: 420, mx: 'auto',
          }}>
            Four simple steps — we handle everything in between.
          </Typography>
        </Box>

        {/* Steps */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 0, md: 2 },
          alignItems: { xs: 'stretch', md: 'flex-start' },
        }}>
          {STEPS.map((step, i) => (
            <Step key={step.num} step={step} index={i} total={STEPS.length} />
          ))}
        </Box>

        {/* CTA */}
        <Box sx={{ textAlign: 'center', mt: { xs: 6, md: 8 } }}>
          <Box
            component="a"
            href="#contact"
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1.2,
              px: 3.5, py: 1.4,
              borderRadius: 99,
              background: 'linear-gradient(135deg, #862e9c, #ae3ec9)',
              color: '#fff',
              fontSize: '0.85rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textDecoration: 'none',
              boxShadow: '0 4px 24px rgba(134,46,156,0.35)',
              transition: 'all 0.25s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 32px rgba(134,46,156,0.5)',
              },
            }}
          >
            Start your order
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </Box>
        </Box>

      </Container>
    </Box>
  )
}