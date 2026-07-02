import React, { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

const STATS = [
  { value: 1000000, display: '1M+',   label: 'Printed Products', icon: '🖨',  suffix: '' },
  { value: 5000,    display: '5,000+', label: 'Business Clients', icon: '💼',  suffix: '+' },
  { value: 25,      display: '25+',    label: 'Years Experience', icon: '🏆',  suffix: '+' },
  { value: 100,     display: '100%',   label: 'Custom Design',    icon: '🎨',  suffix: '%' },
]

// Easing function
function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

function useCountUp(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0)
  const raf = useRef(null)

  useEffect(() => {
    if (!start) return
    const startTime = performance.now()
    function tick(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutExpo(progress)
      setCount(Math.floor(eased * target))
      if (progress < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [start, target, duration])

  return count
}

function StatCard({ stat, animate, index }) {
  const count = useCountUp(stat.value, 1600 + index * 150, animate)

  function formatCount(n, stat) {
    if (stat.value === 1000000) return n >= 1000000 ? '1M+' : (n / 1000).toFixed(0) + 'K'
    if (stat.value === 5000)    return n.toLocaleString() + (n >= 5000 ? '+' : '')
    return n + stat.suffix
  }

  return (
    <Box
      sx={{
        flex: { xs: 'initial', sm: 1 },
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: { xs: 4, md: 4 },
        px: { xs: 0.5, sm: 1, md: 2 },
        position: 'relative',
        // Divider between cards (not before first)
        '&:not(:first-of-type)::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: '15%',
          height: '70%',
          width: '1px',
          background: 'rgba(134,46,156,0.15)',
        },
        // On small screens: hide divider for the first card in each row (1st & 3rd)
        '&:nth-of-type(3)::before': {
          display: { xs: 'none', sm: 'block' },
        },
      }}
    >
      {/* Number */}
      <Typography
        sx={{
          fontSize: { xs: '1.5rem', sm: '2.8rem', md: '3.4rem' },
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: '-0.03em',
          color: 'primary.main',
          fontVariantNumeric: 'tabular-nums',
          mb: { xs: 2, md: 1 },
          transition: 'none',
        }}
      >
        {animate ? formatCount(count, stat) : '0'}
      </Typography>

      {/* Label */}
      <Typography
        sx={{
          fontSize: { xs: '0.65rem', md: '0.72rem' },
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'text.secondary',
          textAlign: 'center',
          lineHeight: 1.5,
          fontWeight: 500,
        }}
      >
        {stat.label}
      </Typography>
    </Box>
  )
}

export default function Stats() {
  const [animate, setAnimate] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAnimate(true); observer.disconnect() } },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Box
      component="section"
      id="stats"
      ref={ref}
      sx={{
        py: { xs: 6, md: 8 },
        background: 'linear-gradient(180deg, rgba(134,46,156,0.04) 0%, transparent 100%)',
        borderTop: '1px solid',
        borderBottom: '1px solid',
        borderColor: 'rgba(134,46,156,0.1)',
      }}
    >
      <Container maxWidth="lg">
        {/* Overline */}
        <Typography
          sx={{
            display: 'block',
            textAlign: 'center',
            fontSize: '0.65rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'primary.main',
            fontWeight: 700,
            mb: { xs: 3, md: 4 },
          }}
        >
          by the numbers
        </Typography>

        {/* Stats row */}
        <Box
          sx={{
            display: { xs: 'grid', sm: 'flex' },
            gridTemplateColumns: { xs: '1fr 1fr', sm: 'none' },
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
          }}
        >
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} animate={animate} index={i} />
          ))}
        </Box>
      </Container>
    </Box>
  )
}