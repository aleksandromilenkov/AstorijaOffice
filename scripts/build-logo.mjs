// Generates the downloadable logo files in public/brand and the favicon
// (src/app/icon.svg) from src/components/brand/logoGeometry.js.
//   node scripts/build-logo.mjs
import { writeFileSync } from 'node:fs'
import {
  COLORS, LOCKUP, LOCKUP_WIDTH, MARK, TAGLINE, WORDMARK,
} from '../src/components/brand/logoGeometry.js'

const mark = (dot) => `<path d="${MARK.left}" fill="${COLORS.magenta}"/>
  <path d="${MARK.right}" fill="${COLORS.purple}"/>
  <path d="${MARK.overlap}" fill="${COLORS.overprint}"/>
  <path d="${MARK.dot}" fill="${dot}"/>`

const full = (ink, sub) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${LOCKUP_WIDTH} ${LOCKUP.height}" role="img" aria-label="Асторија">
  <title>Асторија — печатница од 1999</title>
  ${mark(ink)}
  <path transform="translate(${LOCKUP.textX} ${LOCKUP.wordY})" d="${WORDMARK.d}" fill="${ink}"/>
  <path transform="translate(${LOCKUP.textX} ${LOCKUP.tagY})" d="${TAGLINE.d}" fill="${sub}"/>
</svg>
`

const markOnly = (dot) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MARK.size} ${MARK.size}" role="img" aria-label="Асторија">
  ${mark(dot)}
</svg>
`

// Favicon: mark on a white rounded tile so it reads on dark browser tabs too.
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 76 76">
  <rect x="-6" y="-6" width="76" height="76" rx="16" fill="#ffffff"/>
  ${mark(COLORS.ink)}
</svg>
`

const wordOnly = (ink) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Math.ceil(WORDMARK.width)} ${WORDMARK.height}" role="img" aria-label="Асторија">
  <path d="${WORDMARK.d}" fill="${ink}"/>
</svg>
`

writeFileSync('public/brand/astorija-logo.svg', full(COLORS.ink, COLORS.tagline))
writeFileSync('public/brand/astorija-logo-white.svg', full('#ffffff', 'rgba(255,255,255,0.68)'))
writeFileSync('public/brand/astorija-mark.svg', markOnly(COLORS.ink))
writeFileSync('public/brand/astorija-mark-white.svg', markOnly('#ffffff'))
writeFileSync('public/brand/astorija-wordmark.svg', wordOnly(COLORS.ink))
writeFileSync('src/app/icon.svg', favicon)
console.log('logo files written')
