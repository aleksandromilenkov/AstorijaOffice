'use client'

import { useId } from 'react'
import { COLORS, EMBLEM, LOCKUP, LOCKUP_WIDTH, REGISTERED, TAGLINE, WORDMARK } from './logoGeometry'

function Emblem({ circle = COLORS.red, star = COLORS.white }) {
  return (
    <>
      <circle cx={EMBLEM.circle.cx} cy={EMBLEM.circle.cy} r={EMBLEM.circle.r} fill={circle} />
      <path d={EMBLEM.star} fill={star} />
    </>
  )
}

/**
 * Astorija logo (pure SVG, no fonts needed).
 *   variant="full"  emblem + "ПЕЧАТНИЦА · ОД 1999" + stencil "АСТОРИЈА" ®
 *   variant="mark"  just the star emblem
 *   tone="dark"     red name, dark tagline — for light backgrounds
 *   tone="light"    white name and tagline — for dark backgrounds
 *   tone="mono"     everything white — for red backgrounds (emblem inverted)
 * `height` is the rendered height in px; width follows the aspect ratio.
 */
export default function Logo({ variant = 'full', tone = 'dark', height = 44, title = 'Асторија' }) {
  const maskId = `astorija-stencil-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`
  const mono = tone === 'mono'
  const word = tone === 'dark' ? COLORS.red : COLORS.white
  const tag = tone === 'dark' ? COLORS.ink : COLORS.white
  const emblem = mono ? { circle: COLORS.white, star: COLORS.red } : {}

  if (variant === 'mark') {
    return (
      <svg viewBox={`0 0 ${EMBLEM.size} ${EMBLEM.size}`} height={height} width={height} role="img" aria-label={title}>
        <Emblem {...emblem} />
      </svg>
    )
  }

  return (
    <svg
      viewBox={`0 0 ${LOCKUP_WIDTH} ${LOCKUP.height}`}
      height={height}
      width={(LOCKUP_WIDTH / LOCKUP.height) * height}
      role="img"
      aria-label={title}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="-20" y="-30" width="360" height="100">
          <rect x="-20" y="-30" width="360" height="100" fill="#fff" />
          <path d={WORDMARK.cuts} fill="#000" />
        </mask>
      </defs>
      <Emblem {...emblem} />
      <path transform={`translate(${LOCKUP.textX} ${LOCKUP.tagY})`} d={TAGLINE.d} fill={tag} />
      <path
        transform={`translate(${LOCKUP.textX} ${LOCKUP.wordY})`}
        d={WORDMARK.d}
        fill={word}
        mask={`url(#${maskId})`}
      />
      <path
        transform={`translate(${LOCKUP.textX + WORDMARK.width + 4} ${LOCKUP.regY})`}
        d={REGISTERED.d}
        fill={word}
      />
    </svg>
  )
}
