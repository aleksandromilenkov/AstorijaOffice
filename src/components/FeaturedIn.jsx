'use client'

import { motion } from 'framer-motion'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { featured } from '@/content'

const LOGOS = ['bim.png', 'lion.png', 'moda.png', 'dime.png', 'sitkarski.png']
const BASE = '/img/featured-in-images/'
const TRACK = [...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS]

const KEYFRAMES = `
@keyframes marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  .marquee-track { animation-play-state: paused !important; }
}
`

export default function FeaturedIn() {
  return (
    <Box
      component="section"
      id="featuredIn"
      sx={{
        py: { xs: 5, md: 7 },
        position: 'relative',
      }}
    >
      <style>{KEYFRAMES}</style>

      <Box sx={{ width: '100%', textAlign: 'center', mb: { xs: 3, md: 4 } }}>
        <Typography
          variant="overline"
          sx={{
            color: 'primary.main',
            letterSpacing: '0.25em',
            fontSize: '0.65rem',
            fontWeight: 700,
          }}
        >
          {featured.trustedBy}
        </Typography>
      </Box>

      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: { xs: 60, md: 120 },
            zIndex: 2,
            pointerEvents: 'none',
          },
          '&::before': {
            left: 0,
            background:
              'linear-gradient(to right, var(--mui-palette-background-default, #fff) 0%, transparent 100%)',
          },
          '&::after': {
            right: 0,
            background:
              'linear-gradient(to left, var(--mui-palette-background-default, #fff) 0%, transparent 100%)',
          },
          '&:hover .marquee-track': {
            animationPlayState: 'paused',
          },
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6 }}
        >
          <Box
            className="marquee-track"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 6, md: 10 },
              width: 'max-content',
              animation: 'marquee 22s linear infinite',
              py: 1,
            }}
          >
            {TRACK.map((f, i) => (
              <Box
                key={i}
                component="img"
                src={`${BASE}${f}`}
                alt={f.replace('.png', '')}
                sx={{
                  height: { xs: 36, md: 48 },
                  width: 'auto',
                  display: 'block',
                  flexShrink: 0,
                  filter: 'grayscale(20%) opacity(0.75)',
                  transition: 'filter 0.3s ease, transform 0.3s ease',
                  '&:hover': {
                    filter: 'grayscale(0%) opacity(1)',
                    transform: 'scale(1.1)',
                  },
                }}
              />
            ))}
          </Box>
        </motion.div>
      </Box>
    </Box>
  )
}
