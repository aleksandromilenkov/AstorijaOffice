import { createPublicClient } from '@/lib/supabase/public'

/**
 * Products with an active promotion, biggest discount first.
 * Server-only (uses the cookie-less client so pages can be cached).
 * Returns [] on any error so a hiccup never breaks the home page.
 */
export async function getActivePromotions({ limit } = {}) {
  const nowIso = new Date().toISOString()
  const query = createPublicClient()
    .from('products')
    .select('id,title,slug,description,image_url,price,sale_price,sale_ends_at,in_stock,specs,product_variants(id,price)')
    .not('sale_price', 'is', null)
    .or(`sale_ends_at.is.null,sale_ends_at.gt.${nowIso}`)
    .eq('in_stock', true)

  const { data, error } = await query
  if (error) {
    console.error('getActivePromotions failed:', error.message)
    return []
  }

  const sorted = (data ?? []).sort(
    (a, b) => (b.price - b.sale_price) / b.price - (a.price - a.sale_price) / a.price,
  )
  return limit ? sorted.slice(0, limit) : sorted
}

/** Earliest end date among the promotions (for the headline countdown). */
export function soonestEnd(promotions) {
  const ends = promotions
    .map((p) => p.sale_ends_at)
    .filter(Boolean)
    .sort((a, b) => new Date(a) - new Date(b))
  return ends[0] ?? null
}
