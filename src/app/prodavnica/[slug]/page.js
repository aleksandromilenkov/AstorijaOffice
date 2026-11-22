import { Suspense, cache } from 'react'
import { notFound } from 'next/navigation'
import ProductDetailClient from '@/components/store/ProductDetailClient'
import { createClient } from '@/lib/supabase/server'

export async function generateMetadata({ params }) {
  const slug = decodeSlug((await params).slug)
  let product = null
  try {
    product = await fetchProductBySlug(slug)
  } catch {
    // fall through to the generic title
  }
  if (!product) {
    return { title: 'Производ — Асторија' }
  }

  const description =
    (product.description ?? '').trim().slice(0, 160) ||
    `${product.title} — нарачајте онлајн од Асторија. Плаќање при достава низ цела Македонија.`
  const image = product.image_url?.startsWith('https://') ? product.image_url : null

  return {
    title: `${product.title} — Асторија`,
    description,
    alternates: { canonical: `/prodavnica/${product.slug}` },
    openGraph: {
      type: 'website',
      title: product.title,
      description,
      url: `/prodavnica/${product.slug}`,
      siteName: 'Асторија',
      locale: 'mk_MK',
      ...(image ? { images: [{ url: image, alt: product.title }] } : {}),
    },
  }
}

// Cyrillic slugs arrive URL-encoded ("%D0%BC..."); the database stores them decoded.
function decodeSlug(raw = '') {
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}

// cache(): generateMetadata and the page share one database query per request.
const fetchProductBySlug = cache(async (slug) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('id,title,slug,description,image_url,price,sale_price,sale_ends_at,category_id,in_stock,created_at,specs,product_variants(id,label,price,sort_order)')
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }
  return data
})

export default async function ProductDetailPage({ params }) {
  const slug = decodeSlug((await params).slug)

  let product = null
  let loadError = null
  try {
    product = await fetchProductBySlug(slug)
  } catch (error) {
    loadError = error.message ?? 'Грешка при вчитување на производот.'
  }

  if (!product) {
    notFound()
  }

  return (
    <Suspense fallback={null}>
      <ProductDetailClient product={product} loadError={loadError} />
    </Suspense>
  )
}