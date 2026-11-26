import { Suspense, cache } from 'react'
import { permanentRedirect } from 'next/navigation'
import { latinSlug } from '@/lib/transliterate'
import ProdavnicaClient from '@/components/store/ProdavnicaClient'
import { createPublicClient } from '@/lib/supabase/public'
import { SITE_NAME, withLatin, categoryPath } from '@/lib/seo'

const SHOP_DESCRIPTION =
  'Купете онлајн од печатница Асторија: визитки, флаери, обрасци, фактури, работни книги, медицински обрасци, фискални ролни, маички, чаши и постери. Бесплатна достава низ цела Македонија. Online prodavnica — vizitki, obrasci, fakturi.'

// Products and categories are loaded on the server, so the shop's HTML already
// lists every product with a link — that is what Google reads and follows.
const loadStore = cache(async () => {
  const supabase = createPublicClient()
  const [products, categories] = await Promise.all([
    supabase
      .from('products')
      .select('id,title,slug,description,image_url,images,price,sale_price,sale_ends_at,category_id,in_stock,created_at,specs,product_variants(id,price)')
      .order('created_at', { ascending: false }),
    supabase.from('categories').select('id,name,slug').order('created_at', { ascending: false }),
  ])
  return {
    products: products.error ? null : products.data ?? [],
    categories: categories.error ? null : categories.data ?? [],
  }
})

export async function generateMetadata({ searchParams }) {
  const sp = (await searchParams) || {}
  const cat = typeof sp.cat === 'string' ? sp.cat : ''
  const q = typeof sp.q === 'string' ? sp.q.trim() : ''
  // Search-result pages (?q=) shouldn't be indexed; their links are still followed
  const noindexSearch = q ? { robots: { index: false, follow: true } } : {}

  if (cat) {
    let category = null
    try {
      category = (await loadStore()).categories?.find((c) => c.slug === cat) ?? null
    } catch {
      // fall back to the general shop metadata
    }
    if (category) {
      const path = categoryPath(category.slug)
      const title = `${withLatin(category.name)} — ${SITE_NAME}`
      const description = `${withLatin(category.name)} од печатница Асторија — нарачајте онлајн, бесплатна достава и плаќање при достава низ цела Македонија.`
      return {
        title,
        description,
        alternates: { canonical: path },
        openGraph: { type: 'website', title, description, url: path, siteName: SITE_NAME, locale: 'mk_MK' },
        ...noindexSearch,
      }
    }
  }

  return {
    title: `Продавница (Prodavnica) — ${SITE_NAME}`,
    description: SHOP_DESCRIPTION,
    alternates: { canonical: '/prodavnica' },
    openGraph: {
      type: 'website',
      title: `Продавница — ${SITE_NAME}`,
      description: SHOP_DESCRIPTION,
      url: '/prodavnica',
      siteName: SITE_NAME,
      locale: 'mk_MK',
    },
    ...noindexSearch,
  }
}

/**
 * /prodavnica route.
 *
 * Server component: reads `searchParams` (a Promise in Next.js 16), loads the
 * catalogue and passes both into the client view. Wraps the client in
 * `<Suspense>` so `useSearchParams()` inside the client doesn't block the rest
 * of the page during prerendering.
 */
export default async function ProdavnicaPage({ searchParams }) {
  const sp = (await searchParams) || {}
  const q = typeof sp.q === 'string' ? sp.q : ''
  const cat = typeof sp.cat === 'string' ? sp.cat : 'all'

  let store = { products: null, categories: null }
  try {
    store = await loadStore()
  } catch (error) {
    // The client view loads the catalogue itself when this is missing.
    console.error('Shop page: loading failed:', error)
  }

  // Old Cyrillic category address (?cat=медицински-обрасци) → the Latin one (?cat=medicinski-obrasci)
  if (cat !== 'all' && /[Ѐ-ӿ]/.test(cat) && store.categories) {
    const latin = latinSlug(cat)
    if (!store.categories.some((c) => c.slug === cat) && store.categories.some((c) => c.slug === latin)) {
      const params = new URLSearchParams({ cat: latin, ...(q ? { q } : {}) })
      permanentRedirect(`/prodavnica?${params}`)
    }
  }

  return (
    <Suspense fallback={null}>
      {/* key: a new ?q= / ?cat= (e.g. from the header search while already
          on this page) remounts the view with the new filter. */}
      <ProdavnicaClient
        key={`${q}|${cat}`}
        initialQ={q}
        initialCat={cat}
        initialProducts={store.products}
        initialCategories={store.categories}
      />
    </Suspense>
  )
}
