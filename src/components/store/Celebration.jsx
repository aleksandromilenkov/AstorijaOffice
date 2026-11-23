'use client'

import { useEffect, useRef } from 'react'
import Box from '@mui/material/Box'

const COLORS = ['#d71f2b', '#ff5a5f', '#f26a1b', '#ffc94d', '#1d2024', '#ffffff']

/**
 * One-shot confetti burst from the centre of its container (Web Animations
 * API, transform/opacity only). Skipped for "reduce motion".
 */
export function Confetti({ pieces = 70 }) {
  const ref = useRef(null)

  useEffect(() => {
    const host = ref.current
    if (!host || !host.animate) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    const nodes = []
    for (let i = 0; i < pieces; i++) {
      const el = document.createElement('span')
      const w = 6 + Math.random() * 6
      const h = Math.random() < 0.5 ? w : w * 0.45
      Object.assign(el.style, {
        position: 'absolute',
        left: '50%',
        top: '38%',
        width: `${w}px`,
        height: `${h}px`,
        background: COLORS[i % COLORS.length],
        borderRadius: Math.random() < 0.3 ? '50%' : '2px',
        boxShadow: COLORS[i % COLORS.length] === '#ffffff' ? '0 0 0 1px rgba(0,0,0,0.06)' : 'none',
        pointerEvents: 'none',
      })
      host.appendChild(el)
      nodes.push(el)

      const angle = Math.random() * Math.PI * 2
      const power = 140 + Math.random() * 220
      const dx = Math.cos(angle) * power
      const dy = Math.sin(angle) * power - 120 // bias upwards
      const spin = (Math.random() - 0.5) * 900
      el.animate(
        [
          { transform: 'translate(-50%, -50%) rotate(0deg) scale(0.6)', opacity: 1 },
          {
            transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${spin / 2}deg) scale(1)`,
            opacity: 1,
            offset: 0.45,
          },
          {
            transform: `translate(calc(-50% + ${dx * 1.2}px), calc(-50% + ${dy + 320}px)) rotate(${spin}deg) scale(0.9)`,
            opacity: 0,
          },
        ],
        {
          duration: 1500 + Math.random() * 900,
          delay: Math.random() * 120,
          easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)',
          fill: 'forwards',
        },
      )
    }
    const cleanup = setTimeout(() => nodes.forEach((n) => n.remove()), 2800)
    return () => {
      clearTimeout(cleanup)
      nodes.forEach((n) => n.remove())
    }
  }, [pieces])

  return (
    <Box
      ref={ref}
      aria-hidden
      sx={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none', zIndex: 2 }}
    />
  )
}

/** Green circle + checkmark that draw themselves. */
export function SuccessCheck({ size = 84 }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 52 52"
      width={size}
      height={size}
      aria-hidden
      sx={{
        display: 'block',
        mx: 'auto',
        animation: 'a-scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        '& .ring': {
          strokeDasharray: 157,
          strokeDashoffset: 157,
          animation: 'a-draw 0.7s cubic-bezier(0.65, 0, 0.45, 1) 0.1s forwards',
        },
        '& .tick': {
          strokeDasharray: 40,
          strokeDashoffset: 40,
          animation: 'a-draw 0.45s cubic-bezier(0.65, 0, 0.45, 1) 0.7s forwards',
        },
      }}
    >
      <circle cx="26" cy="26" r="24" fill="rgba(31,157,85,0.1)" />
      <circle className="ring" cx="26" cy="26" r="24" fill="none" stroke="#1f9d55" strokeWidth="3" />
      <path
        className="tick"
        d="M15 27 l7 7 l15 -16"
        fill="none"
        stroke="#1f9d55"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Box>
  )
}
