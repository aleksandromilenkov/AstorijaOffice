/**
 * Promotion pricing — mirrors the rule in the `place_order` database
 * function so the price customers see is exactly what they are charged.
 *
 * A promo is active when `sale_price` is set and `sale_ends_at` is empty or
 * still in the future.
 */
export function isOnSale(product, now = Date.now()) {
  if (product?.sale_price == null) return false
  if (!product.sale_ends_at) return true
  return new Date(product.sale_ends_at).getTime() > now
}

/** Price to charge right now (promo price while the promo is active). */
export function effectivePrice(product, now = Date.now()) {
  return isOnSale(product, now) ? product.sale_price : product.price
}

/**
 * Price of a quantity option right now. While the product's promo is active,
 * the same percentage discount applies to every option (same rounding as the
 * database).
 */
export function variantPrice(product, regularVariantPrice, now = Date.now()) {
  if (!isOnSale(product, now) || !product.price) return regularVariantPrice
  return Math.round((regularVariantPrice * product.sale_price) / product.price)
}

/** "100 парчиња" → 100 (for the per-piece price); null when no leading number. */
export function variantUnits(label) {
  const m = String(label ?? '').trim().match(/^(\d[\d\s.]*)/)
  if (!m) return null
  const n = Number(m[1].replace(/[\s.]/g, ''))
  return Number.isFinite(n) && n > 1 ? n : null
}

/** Sorted options of a product row that embedded `product_variants(...)`. */
export function sortedVariants(product) {
  return [...(product?.product_variants ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order || a.price - b.price,
  )
}

/** Whole-number discount, e.g. 450 → 359 gives 20. */
export function discountPercent(regular, sale) {
  if (!regular || sale == null || sale >= regular) return 0
  return Math.round(((regular - sale) / regular) * 100)
}

/** Columns every storefront query needs to price a product. */
export const PRODUCT_PRICE_COLUMNS = 'price,sale_price,sale_ends_at'
