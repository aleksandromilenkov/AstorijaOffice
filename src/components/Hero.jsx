import React from 'react'
import { motion } from 'framer-motion'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

export default function Hero() {
  return (
    <Box
      component="section"
      id="hero"
      sx={{
        position: 'relative',
        minHeight: { xs: '100svh', md: '95vh' },
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* ── Background image ── */}
      <Box
        component="img"
        src="/img/hero-img.jpg"
        alt=""
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: 0,
        }}
      />

      {/* ── Dark gradient overlay — left heavy so text is always readable ── */}
      <Box sx={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: {
          xs: 'linear-gradient(to bottom, rgba(8,4,16,0.72) 0%, rgba(8,4,16,0.85) 100%)',
          md: 'linear-gradient(to right, rgba(8,4,16,0.92) 0%, rgba(8,4,16,0.75) 45%, rgba(8,4,16,0.2) 100%)',
        },
      }} />

      {/* ── Purple tint layer — brand feel ── */}
      <Box sx={{
        position: 'absolute', inset: 0, zIndex: 2,
        background: 'radial-gradient(ellipse 70% 80% at 20% 50%, rgba(134,46,156,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ── Content ── */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 3, py: { xs: 10, md: 0 } }}>
        <Box sx={{ maxWidth: { xs: '100%', md: 580 } }}>

          {/* motion container for stagger */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

          {/* Badge */}
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 0.75,
            fontSize: '0.65rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', color: '#c77dff',
            fontWeight: 700, mb: 3,
            background: 'rgba(134,46,156,0.2)',
            border: '1px solid rgba(134,46,156,0.4)',
            borderRadius: '100px', px: 1.75, py: 0.7,
            backdropFilter: 'blur(8px)',
          }}>
            ✦ Professional printing
          </Box>

          {/* Headline */}
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: '2.8rem', sm: '3.4rem', md: '4rem' },
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.06,
              color: '#fff',
              mb: 2.5,
            }}
          >
            Print Your Brand{' '}
            <Box component="span" sx={{
              background: 'linear-gradient(90deg, #862e9c, #c77dff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              on Anything
            </Box>
          </Typography>

          {/* Sub */}
          <Typography sx={{
            fontSize: { xs: '1rem', md: '1.1rem' },
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.75,
            mb: 4.5,
            maxWidth: 460,
          }}>
            Professional printing for businesses, events, clubs, schools, and organizations — from a single copy to a million branded products.
          </Typography>

          {/* CTAs */}
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 5 }}>
            <Button
              variant="contained"
              href="#contact"
              size="large"
              sx={{
                px: 3.5, fontWeight: 700, borderRadius: 2,
                background: 'linear-gradient(135deg, #862e9c, #ae3ec9)',
                boxShadow: '0 4px 24px rgba(134,46,156,0.45)',
                '&:hover': {
                  boxShadow: '0 6px 32px rgba(134,46,156,0.65)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.25s',
              }}
            >
              Print Now
            </Button>
            <Button
              variant="outlined"
              href="#process"
              size="large"
              sx={{
                px: 3, fontWeight: 600, borderRadius: 2,
                borderColor: 'rgba(255,255,255,0.3)',
                color: '#fff',
                backdropFilter: 'blur(8px)',
                background: 'rgba(255,255,255,0.06)',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.6)',
                  background: 'rgba(255,255,255,0.1)',
                },
                transition: 'all 0.25s',
              }}
            >
              How it works ↓
            </Button>
          </Box>

          </motion.div>

          {/* Social proof row */}
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, delay: 0.12 }}>
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 2,
            flexWrap: 'wrap',
          }}>
            {/* Avatars */}
            <Box sx={{ display: 'flex' }}>
              {['ben.jpg','customer-3.jpg','customer-4.jpg','customer-5.jpg','hannah.jpg'].map((src, i) => (
                <Box
                  key={i}
                  component="img"
                  src={`/img/customers/${src}`}
                  alt="customer"
                  sx={{
                    width: 38, height: 38,
                    borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.3)',
                    ml: i ? -1.2 : 0,
                    objectFit: 'cover',
                  }}
                />
              ))}
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.85rem', color: '#fff', fontWeight: 700, lineHeight: 1.3 }}>
                1,000+ happy customers
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.3, mt: 0.3 }}>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </Box>
            </Box>
          </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  )
}