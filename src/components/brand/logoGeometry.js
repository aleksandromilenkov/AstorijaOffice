/**
 * Astorija logo geometry — single source of truth for the <Logo> component
 * and the downloadable SVG files in /public/brand (scripts/build-logo.mjs).
 *
 * Wordmark "АСТОРИЈА": custom geometric letters drawn as stroked centre
 * lines (rounded caps/joins) on a 56-unit cap height, so it is a true vector
 * that never depends on an installed font.
 *
 * Mark: rounded square in the brand gradient with a white star — a modern
 * take on the stars of the original Astorija logo.
 */

export const STROKE = 11
export const CAP_HEIGHT = 56
const GAP = 9

// Each letter: width of its box and centre-line path inside that box.
const LETTERS = [
  { w: 46, d: 'M5.5 50.5 L23 5.5 L40.5 50.5 M12 34 H34' }, // А
  { w: 42, d: 'M35.4 12.1 A17.5 22.5 0 1 0 35.4 43.9' }, // С
  { w: 42, d: 'M5.5 5.5 H36.5 M21 5.5 V50.5' }, // Т
  { w: 46, d: 'M23 5.5 A17.5 22.5 0 1 1 22.99 5.5 Z' }, // О
  { w: 38, d: 'M5.5 50.5 V5.5 H20 A11.5 11.5 0 0 1 20 28.5 H5.5' }, // Р
  { w: 42, d: 'M5.5 5.5 V50.5 L36.5 5.5 V50.5' }, // И
  { w: 33, d: 'M27.5 5.5 V39 A11.5 11.5 0 0 1 4.5 39' }, // Ј
  { w: 46, d: 'M5.5 50.5 L23 5.5 L40.5 50.5 M12 34 H34' }, // А
]

/** Wordmark letters positioned left to right: [{ x, d }]. */
export const WORDMARK = (() => {
  let x = 0
  return LETTERS.map((letter) => {
    const placed = { x, d: letter.d }
    x += letter.w + GAP
    return placed
  })
})()

export const WORDMARK_WIDTH =
  LETTERS.reduce((sum, l) => sum + l.w, 0) + GAP * (LETTERS.length - 1)

// ---- mark (64 × 64) ----------------------------------------------------------
export const MARK_SIZE = 64
export const MARK_RADIUS = 16
export const GRADIENT = { from: '#862e9c', to: '#e8365d' }

function starPath(cx, cy, outer, inner, points = 5, rotationDeg = -90) {
  const parts = []
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner
    const a = ((rotationDeg + (i * 180) / points) * Math.PI) / 180
    parts.push(`${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`)
  }
  return `M${parts.join(' L')} Z`
}

/** Main star (slightly below centre so it looks optically centred). */
export const MARK_STAR = starPath(32, 34.5, 19, 8.2)
/** Small four-point sparkle, top right — nod to the small stars of the old logo. */
export const MARK_SPARKLE = starPath(50, 14, 6.5, 1.8, 4, -90)

// ---- full horizontal logo ----------------------------------------------------
// mark at left, wordmark + tagline to the right.
export const LOGO = {
  height: 64,
  wordX: 80,
  wordY: 8,
  wordScale: 0.62,
  taglineY: 59,
  tagline: 'ПЕЧАТНИЦА · СВЕТИ НИКОЛЕ',
}
export const LOGO_WIDTH = LOGO.wordX + WORDMARK_WIDTH * LOGO.wordScale
