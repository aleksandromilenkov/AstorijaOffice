'use client'

import { useId } from 'react'
import {
  CAP_HEIGHT,
  GRADIENT,
  LOGO,
  LOGO_WIDTH,
  MARK_RADIUS,
  MARK_SIZE,
  MARK_SPARKLE,
  MARK_STAR,
  STROKE,
  WORDMARK,
  WORDMARK_WIDTH,
} from './logoGeometry'

function Mark({ gradientId }) {
  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={GRADIENT.from} />
          <stop offset="1" stopColor={GRADIENT.to} />
        </linearGradient>
      </defs>
      <rect width={MARK_SIZE} height={MARK_SIZE} rx={MARK_RADIUS} fill={`url(#${gradientId})`} />
      <path d={MARK_STAR} fill="#fff" stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
      <path d={MARK_SPARKLE} fill="#fff" opacity="0.9" />
    </>
  )
}

function Wordmark({ color }) {
  return (
    <g
      fill="none"
      stroke={color}
      strokeWidth={STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {WORDMARK.map((letter, i) => (
        <path key={i} d={letter.d} transform={`translate(${letter.x} 0)`} />
      ))}
    </g>
  )
}

/**
 * Astorija logo.
 *   variant="full"  mark + wordmark + tagline (header, footer)
 *   variant="mark"  just the star badge (small spaces)
 *   tone="dark"     dark wordmark for light backgrounds
 *   tone="light"    white wordmark for dark backgrounds
 * `height` sets the rendered height in px; width follows the aspect ratio.
 */
export default function Logo({ variant = 'full', tone = 'dark', height = 44, title = 'Асторија' }) {
  const gradientId = `astorija-grad-${useId().replace(/:/g, '')}`
  const ink = tone === 'light' ? '#ffffff' : '#1d1026'
  const sub = tone === 'light' ? 'rgba(255,255,255,0.7)' : '#862e9c'

  if (variant === 'mark') {
    return (
      <svg
        viewBox={`0 0 ${MARK_SIZE} ${MARK_SIZE}`}
        height={height}
        width={height}
        role="img"
        aria-label={title}
      >
        <Mark gradientId={gradientId} />
      </svg>
    )
  }

  if (variant === 'wordmark') {
    return (
      <svg
        viewBox={`-6 -6 ${WORDMARK_WIDTH + 12} ${CAP_HEIGHT + 12}`}
        height={height}
        role="img"
        aria-label={title}
      >
        <Wordmark color={ink} />
      </svg>
    )
  }

  const width = (LOGO_WIDTH / LOGO.height) * height
  return (
    <svg
      viewBox={`0 0 ${LOGO_WIDTH} ${LOGO.height}`}
      height={height}
      width={width}
      role="img"
      aria-label={title}
    >
      <Mark gradientId={gradientId} />
      <g transform={`translate(${LOGO.wordX} ${LOGO.wordY}) scale(${LOGO.wordScale})`}>
        <Wordmark color={ink} />
      </g>
      <text
        x={LOGO.wordX}
        y={LOGO.taglineY}
        fill={sub}
        fontFamily="Inter, Arial, sans-serif"
        fontSize="9.5"
        fontWeight="700"
        textLength={LOGO_WIDTH - LOGO.wordX}
        lengthAdjust="spacing"
      >
        {LOGO.tagline}
      </text>
    </svg>
  )
}
