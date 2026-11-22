import { COLORS, LOCKUP, LOCKUP_WIDTH, MARK, TAGLINE, WORDMARK } from './logoGeometry'

function Mark({ dotColor }) {
  return (
    <>
      <path d={MARK.left} fill={COLORS.magenta} />
      <path d={MARK.right} fill={COLORS.purple} />
      <path d={MARK.overlap} fill={COLORS.overprint} />
      <path d={MARK.dot} fill={dotColor} />
    </>
  )
}

/**
 * Astorija logo (pure SVG, no fonts needed).
 *   variant="full"  mark + "АСТОРИЈА" + "ПЕЧАТНИЦА · ОД 1999"
 *   variant="mark"  just the overprint A
 *   tone="dark"     dark type, for light backgrounds
 *   tone="light"    white type, for dark backgrounds
 * `height` is the rendered height in px; width follows the aspect ratio.
 */
export default function Logo({ variant = 'full', tone = 'dark', height = 44, title = 'Асторија' }) {
  const light = tone === 'light'
  const ink = light ? '#ffffff' : COLORS.ink
  const sub = light ? 'rgba(255,255,255,0.68)' : COLORS.tagline

  if (variant === 'mark') {
    return (
      <svg viewBox={`0 0 ${MARK.size} ${MARK.size}`} height={height} width={height} role="img" aria-label={title}>
        <Mark dotColor={ink} />
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
      <Mark dotColor={ink} />
      <path transform={`translate(${LOCKUP.textX} ${LOCKUP.wordY})`} d={WORDMARK.d} fill={ink} />
      <path transform={`translate(${LOCKUP.textX} ${LOCKUP.tagY})`} d={TAGLINE.d} fill={sub} />
    </svg>
  )
}
