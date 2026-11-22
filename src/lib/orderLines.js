/**
 * Line items of an order, in one shape for the admin pages:
 *   { product_id, product_name, product_slug, quantity, unit_price, line_total }
 *
 * New orders keep their lines in the `order_items` table (embedded in the
 * query as `order_items(...)`). Orders placed before 2026-11-22 stored them
 * as a JSON string in `orders.notes`, so fall back to that.
 */
export function getOrderLines(order) {
  const rows = Array.isArray(order?.order_items) ? order.order_items : []
  if (rows.length > 0) {
    return rows.map((row) => ({
      product_id: row.product_id,
      product_name: row.product_name,
      variant_label: row.variant_label ?? null,
      product_slug: row.products?.slug ?? null,
      quantity: row.quantity,
      unit_price: row.unit_price,
      line_total: row.line_total,
    }))
  }
  return parseLegacyNotes(order?.notes)
}

function parseLegacyNotes(notes) {
  if (!notes) return []
  try {
    const parsed = JSON.parse(notes)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}
