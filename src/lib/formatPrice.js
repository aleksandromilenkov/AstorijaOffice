/**
 * Single source of truth for currency formatting.
 *
 * Stores keep `price` as an integer in MKD. Anywhere we render money in
 * the UI goes through `formatPrice` so the suffix (` ден.`) stays
 * consistent — change here once, change everywhere.
 *
 * The format is fixed and locale-independent on purpose: server render
 * and client render must produce the exact same string, or React will
 * throw a hydration mismatch warning (the Node runtime may not have
 * ICU data for `mk-MK`, so `toLocaleString` returns `,` instead of `.`).
 */
export function formatPrice(amount) {
  const n = Number.isFinite(amount) ? Math.round(amount) : 0
  const negative = n < 0
  const digits = Math.abs(n).toString()
  // Insert a thin-space thousands separator every 3 digits from the right.
  // Thin space (U+202F) is what Macedonian typography uses between
  // thousands, and it round-trips the same in both Node and the browser.
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, '\u202F')
  return `${negative ? '-' : ''}${grouped} ден.`
}