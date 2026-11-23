'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined'
import { hero } from '@/content'

export default function Hero() {
  return (
    <Box
      component="section"
      id="hero"
      sx={{
        position: 'relative',
        minHeight: { xs: 'calc(100svh - 64px)', md: '88vh' },
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        bgcolor: '#0f1113',
      }}
    >
      {/* Background photo — optimised (WebP/AVIF, right size per screen) */}
      <Image
        src="/img/hero-img.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        style={{ objectFit: 'cover', objectPosition: '70% center' }}
      />

      {/* Readability overlays */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background: {
            xs: 'linear-gradient(180deg, rgba(15,17,19,0.78) 0%, rgba(15,17,19,0.9) 100%)',
            md: 'linear-gradient(90deg, rgba(15,17,19,0.95) 0%, rgba(15,17,19,0.82) 42%, rgba(15,17,19,0.25) 100%)',
          },
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 55% 70% at 15% 55%, rgba(215,31,43,0.22) 0%, transparent 70%)',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', py: { xs: 8, md: 10 } }}>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <Box sx={{ maxWidth: { xs: '100%', md: 620 } }}>
            {/* Badge */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                mb: 3,
                px: 1.5,
                py: 0.6,
                borderRadius: 999,
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#ffe1e1',
                bgcolor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.18)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#ff3b47' }} />
              {hero.badge}
            </Box>

            {/* Headline */}
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: '2.6rem', sm: '3.4rem', md: '4.2rem' },
                fontWeight: 900,
                letterSpacing: '-0.035em',
                lineHeight: 1.04,
                color: '#fff',
                mb: 2.5,
              }}
            >
              {hero.titlePrefix}{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(90deg, #ff3b47, #ff7a6b)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                {hero.titleAccent}
              </Box>
            </Typography>

            {/* Sub */}
            <Typography
              sx={{
                fontSize: { xs: '1.02rem', md: '1.15rem' },
                color: 'rgba(255,255,255,0.78)',
                lineHeight: 1.7,
                mb: 3,
                maxWidth: 520,
              }}
            >
              {hero.sub}
            </Typography>

            {/* Promises */}
            <Box
              component="ul"
              sx={{
                listStyle: 'none',
                p: 0,
                m: 0,
                mb: 4,
                display: 'flex',
                flexWrap: 'wrap',
                gap: { xs: 1, sm: 2.5 },
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              {hero.promises.map((promise) => (
                <Box
                  component="li"
                  key={promise}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                  }}
                >
                  <CheckCircleRoundedIcon sx={{ fontSize: 20, color: '#7be0a8' }} />
                  {promise}
                </Box>
              ))}
            </Box>

            {/* CTAs */}
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 4 }}>
              <Button
                component={Link}
                href="/prodavnica"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  px: 3.5,
                  py: 1.4,
                  fontWeight: 800,
                  fontSize: '1rem',
                  textTransform: 'none',
                  borderRadius: 2.5,
                  backgroundImage: 'linear-gradient(135deg, #d71f2b, #b3121d)',
                  boxShadow: '0 10px 30px -8px rgba(179,18,29,0.6)',
                  '&:hover': { boxShadow: '0 14px 36px -8px rgba(179,18,29,0.75)' },
                }}
              >
                {hero.primaryCta}
              </Button>
              <Button
                component={Link}
                href="/contact"
                variant="outlined"
                size="large"
                sx={{
                  px: 3,
                  py: 1.4,
                  fontWeight: 700,
                  fontSize: '1rem',
                  textTransform: 'none',
                  borderRadius: 2.5,
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.35)',
                  bgcolor: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(8px)',
                  '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.12)' },
                }}
              >
                {hero.secondaryCta}
              </Button>
            </Box>

            {/* Social proof (true numbers only) */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                color: 'rgba(255,255,255,0.75)',
                fontSize: '0.92rem',
                fontWeight: 600,
              }}
            >
              <VerifiedOutlinedIcon sx={{ fontSize: 20, color: '#ff5a5f' }} />
              {hero.socialProof}
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
