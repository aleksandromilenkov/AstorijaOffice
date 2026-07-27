/**
 * Single source of truth for currency formatting.
 *
 * Stores keep `price` as an integer in MKD. Anywhere we render money in
 * the UI goes through `formatPrice` so the suffix (` ден.`) stays
 * consistent — change here once, change everywhere.
 */
export function formatPrice(amount) {
  const n = Number.isFinite(amount) ? amount : 0
  // Macedonian uses a dot as thousands separator, comma as decimal.
  const formatted = n.toLocaleString('mk-MK', { maximumFractionDigits: 0 })
  return `${formatted} ден.`
}