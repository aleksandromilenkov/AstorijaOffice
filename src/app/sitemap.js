import { createPublicClient } from '@/lib/supabase/public'
import { absoluteUrl, productPath, categoryPath } from '@/lib/seo'

// Rebuilt at most once an hour, so new products reach Google without a redeploy.
export const revalidate = 3600

const STATIC_PAGES = [
  { path: '/', priority: 1, changeFrequency: 'daily' },
  { path: '/prodavnica', priority: 0.9, changeFrequency: 'daily' },
  { path: '/promocii', priority: 0.8, changeFrequency: 'daily' },
  { path: '/about', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/uslovi', priority: 0.3, changeFrequency: 'yearly' },
]

export default async function sitemap() {
  const entries = STATIC_PAGES.map((p) => ({
    url: absoluteUrl(p.path),
    lastModified: new Date(),
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }))

  try {
    const supabase = createPublicClient()
    const [{ data: products }, { data: categories }] = await Promise.all([
      supabase.from('products').select('slug,updated_at,created_at,image_url,images'),
      supabase.from('categories').select('slug,created_at'),
    ])

    for (const c of categories ?? []) {
      if (!c.slug) continue
      entries.push({
        url: absoluteUrl(categoryPath(c.slug)),
        lastModified: c.created_at ? new Date(c.created_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }

    for (const p of products ?? []) {
      if (!p.slug) continue
      const images = (p.images?.length ? p.images : [p.image_url]).filter(
        (u) => typeof u === 'string' && u.startsWith('https://'),
      )
      entries.push({
        url: absoluteUrl(productPath(p.slug)),
        lastModified: new Date(p.updated_at || p.created_at || Date.now()),
        changeFrequency: 'weekly',
        priority: 0.8,
        ...(images.length ? { images } : {}),
      })
    }
  } catch (error) {
    // A database hiccup should not take the sitemap down: serve the static pages.
    console.error('sitemap: could not load products/categories:', error)
  }

  return entries
}
