// Generates the downloadable logo files in public/brand and the favicon
// (src/app/icon.svg) from src/components/brand/logoGeometry.js.
//   node scripts/build-logo.mjs
import { writeFileSync } from 'node:fs'
import {
  CAP_HEIGHT, GRADIENT, LOGO, LOGO_WIDTH, MARK_RADIUS, MARK_SIZE,
  MARK_SPARKLE, MARK_STAR, STROKE, WORDMARK, WORDMARK_WIDTH,
} from '../src/components/brand/logoGeometry.js'

const r = (n) => Math.round(n * 100) / 100

function mark(id = 'g') {
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${GRADIENT.from}"/><stop offset="1" stop-color="${GRADIENT.to}"/></linearGradient></defs>
  <rect width="${MARK_SIZE}" height="${MARK_SIZE}" rx="${MARK_RADIUS}" fill="url(#${id})"/>
  <path d="${MARK_STAR}" fill="#fff" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>
  <path d="${MARK_SPARKLE}" fill="#fff" opacity="0.9"/>`
}

function wordmark(color) {
  return `<g fill="none" stroke="${color}" stroke-width="${STROKE}" stroke-linecap="round" stroke-linejoin="round">
    ${WORDMARK.map((l) => `<path transform="translate(${l.x} 0)" d="${l.d}"/>`).join('\n    ')}
  </g>`
}

function full(ink, sub) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${r(LOGO_WIDTH)} ${LOGO.height}" role="img" aria-label="Асторија">
  <title>Асторија — печатница, Свети Николе</title>
  ${mark()}
  <g transform="translate(${LOGO.wordX} ${LOGO.wordY}) scale(${LOGO.wordScale})">
  ${wordmark(ink)}
  </g>
  <text x="${LOGO.wordX}" y="${LOGO.taglineY}" fill="${sub}" font-family="Inter, Arial, sans-serif" font-size="9.5" font-weight="700" textLength="${r(LOGO_WIDTH - LOGO.wordX)}" lengthAdjust="spacing">${LOGO.tagline}</text>
</svg>
`
}

const markOnly = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MARK_SIZE} ${MARK_SIZE}" role="img" aria-label="Асторија">
  ${mark()}
</svg>
`
const wordOnly = (c) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 ${WORDMARK_WIDTH + 12} ${CAP_HEIGHT + 12}" role="img" aria-label="Асторија">
  ${wordmark(c)}
</svg>
`

writeFileSync('public/brand/astorija-logo.svg', full('#1d1026', '#862e9c'))
writeFileSync('public/brand/astorija-logo-white.svg', full('#ffffff', 'rgba(255,255,255,0.7)'))
writeFileSync('public/brand/astorija-mark.svg', markOnly)
writeFileSync('public/brand/astorija-wordmark.svg', wordOnly('#1d1026'))
writeFileSync('src/app/icon.svg', markOnly)
console.log('logo files written')
