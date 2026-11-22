// Generates the downloadable logo files in public/brand and the favicon
// (src/app/icon.svg) from src/components/brand/logoGeometry.js.
//   node scripts/build-logo.mjs
import { writeFileSync } from 'node:fs'
import {
  COLORS, EMBLEM, LOCKUP, LOCKUP_WIDTH, REGISTERED, TAGLINE, WORDMARK,
} from '../src/components/brand/logoGeometry.js'

const emblem = (circle, star) =>
  `<circle cx="${EMBLEM.circle.cx}" cy="${EMBLEM.circle.cy}" r="${EMBLEM.circle.r}" fill="${circle}"/>
  <path d="${EMBLEM.star}" fill="${star}"/>`

function lockup({ circle, star, word, tag, background }) {
  const pad = background ? 24 : 0
  const w = LOCKUP_WIDTH + pad * 2
  const h = LOCKUP.height + pad * 2
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Асторија">
  <title>Асторија — печатница од 1999</title>
  <defs>
    <mask id="stencil" maskUnits="userSpaceOnUse" x="-20" y="-30" width="360" height="100">
      <rect x="-20" y="-30" width="360" height="100" fill="#fff"/>
      <path d="${WORDMARK.cuts}" fill="#000"/>
    </mask>
  </defs>
  ${background ? `<rect width="${w}" height="${h}" fill="${background}"/>` : ''}
  <g transform="translate(${pad} ${pad})">
  ${emblem(circle, star)}
  <path transform="translate(${LOCKUP.textX} ${LOCKUP.tagY})" d="${TAGLINE.d}" fill="${tag}"/>
  <path transform="translate(${LOCKUP.textX} ${LOCKUP.wordY})" d="${WORDMARK.d}" fill="${word}" mask="url(#stencil)"/>
  <path transform="translate(${LOCKUP.textX + WORDMARK.width + 4} ${LOCKUP.regY})" d="${REGISTERED.d}" fill="${word}"/>
  </g>
</svg>
`
}

const mark = (circle, star) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${EMBLEM.size} ${EMBLEM.size}" role="img" aria-label="Асторија">
  ${emblem(circle, star)}
</svg>
`

const { red, ink, white } = COLORS
// Main logo: red on light backgrounds.
writeFileSync('public/brand/astorija-logo.svg', lockup({ circle: red, star: white, word: red, tag: ink }))
// Dark backgrounds: red emblem, white type.
writeFileSync('public/brand/astorija-logo-white.svg', lockup({ circle: red, star: white, word: white, tag: white }))
// Red banner, like the calendar header.
writeFileSync('public/brand/astorija-banner.svg', lockup({ circle: white, star: red, word: white, tag: white, background: red }))
writeFileSync('public/brand/astorija-mark.svg', mark(red, white))
writeFileSync('public/brand/astorija-mark-white.svg', mark(white, red))
writeFileSync('src/app/icon.svg', mark(red, white))
console.log('logo files written')
