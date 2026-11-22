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

/** Whole-number discount, e.g. 450 → 359 gives 20. */
export function discountPercent(regular, sale) {
  if (!regular || sale == null || sale >= regular) return 0
  return Math.round(((regular - sale) / regular) * 100)
}

/** Columns every storefront query needs to price a product. */
export const PRODUCT_PRICE_COLUMNS = 'price,sale_price,sale_ends_at'
