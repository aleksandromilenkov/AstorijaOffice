import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

const SERVICES = [
  {
    title: 'Copying',
    desc: 'Fast, high-quality copies for any volume — from single pages to bulk runs.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <rect x="8" y="8" width="13" height="13" rx="2"/>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
      </svg>
    ),
  },
  {
    title: 'Printing',
    desc: 'Full-colour or monochrome printing on any format — business cards to banners.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <polyline points="6 9 6 2 18 2 18 9"/>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
        <rect x="6" y="14" width="12" height="8"/>
      </svg>
    ),
  },
  {
    title: 'Office Materials',
    desc: 'Everything your workspace needs — stationery, supplies and branded materials.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <path d="M2 20h20M6 20V10l6-7 6 7v10M10 20v-5h4v5"/>
      </svg>
    ),
  },
  {
    title: 'Purchase Contract',
    desc: 'Professional document preparation and contract printing done right.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    title: 'Scanning Documents',
    desc: 'High-resolution scanning — digitise and archive your documents with clarity.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>
        <rect x="7" y="7" width="10" height="10" rx="1"/>
      </svg>
    ),
  },
  {
    title: 'School Material',
    desc: 'Workbooks, worksheets, and learning packs printed and bound to order.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
  },
]

function ServiceCard({ service, index }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
    >
      <Box
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'rgba(134,46,156,0.15)',
        background: 'rgba(134,46,156,0.04)',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.5s ease ${index * 80}ms, transform 0.5s ease ${index * 80}ms, border-color 0.3s, background 0.3s`,
        '&:hover': {
          borderColor: 'rgba(134,46,156,0.5)',
          background: 'rgba(134,46,156,0.09)',
          '& .svc-icon': { color: '#c77dff', transform: 'scale(1.1)' },
          '& .svc-line': { width: '100%' },
        },
        // Top accent line that sweeps on hover
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, #862e9c, #c77dff)',
          transform: 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'transform 0.4s ease',
        },
        '&:hover::before': {
          transform: 'scaleX(1)',
        },
      }}
    >
      {/* Icon */}
      <Box
        className="svc-icon"
        sx={{
          color: '#862e9c',
          mb: 2,
          display: 'inline-flex',
          transition: 'color 0.3s, transform 0.3s',
        }}
      >
        {service.icon}
      </Box>

      {/* Title */}
      <Typography sx={{
        fontSize: '1rem',
        fontWeight: 700,
        letterSpacing: '-0.01em',
        color: 'text.primary',
        mb: 0.75,
      }}>
        {service.title}
      </Typography>

      {/* Description */}
      <Typography sx={{
        fontSize: '0.8rem',
        color: 'text.secondary',
        lineHeight: 1.65,
      }}>
        {service.desc}
      </Typography>
      </Box>
    </motion.div>
  )
}

export default function Services() {
  return (
    <Box
      component="section"
      id="services"
      sx={{
        py: { xs: 7, md: 10 },
        position: 'relative',
        overflow: 'hidden',
        // Subtle purple ambient glow top-right
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-10%', right: '-5%',
          width: '40vw', height: '40vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(134,46,156,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg">

        {/* Header */}
        <Box sx={{ mb: { xs: 5, md: 7 }, textAlign: 'center' }}>
          <Typography sx={{
            fontSize: '0.65rem', letterSpacing: '0.22em',
            textTransform: 'uppercase', color: 'primary.main',
            fontWeight: 700, mb: 1.5, display: 'block',
          }}>
            what we offer
          </Typography>
          <Typography sx={{
            fontSize: { xs: '2rem', md: '2.8rem' },
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            color: 'text.primary',
          }}>
            Enjoy our{' '}
            <Box component="span" sx={{
              background: 'linear-gradient(90deg, #862e9c, #c77dff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              services
            </Box>
          </Typography>
        </Box>

        {/* Grid */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: { xs: 1.5, md: 2 },
        }}>
          {SERVICES.map((svc, i) => (
            <ServiceCard key={svc.title} service={svc} index={i} />
          ))}
        </Box>
      </Container>
    </Box>
  )
}