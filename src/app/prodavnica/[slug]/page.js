import { Suspense, cache } from 'react'
import { notFound, permanentRedirect } from 'next/navigation'
import { latinSlug } from '@/lib/transliterate'
import ProductDetailClient from '@/components/store/ProductDetailClient'
import { createClient } from '@/lib/supabase/server'
import { effectivePrice } from '@/lib/pricing'
import {
  SITE_NAME,
  withLatin,
  productDescription,
  productPath,
  categoryPath,
  productJsonLd,
  breadcrumbJsonLd,
  jsonLdHtml,
} from '@/lib/seo'

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

  const categoryName = product.categories?.name
  const description = productDescription(product, categoryName)
  const images = (product.images?.length ? product.images : [product.image_url]).filter((u) =>
    u?.startsWith('https://'),
  )
  const path = productPath(product.slug)

  return {
    // "Фактура А5 (Faktura A5) — Асторија": found whether people search in Cyrillic or Latin
    title: `${withLatin(product.title)} — ${SITE_NAME}`,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      title: withLatin(product.title),
      description,
      url: path,
      siteName: SITE_NAME,
      locale: 'mk_MK',
      ...(images.length ? { images: images.map((url) => ({ url, alt: product.title })) } : {}),
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
    .select('id,title,slug,description,image_url,images,price,sale_price,sale_ends_at,category_id,in_stock,created_at,specs,categories(name,slug),product_variants(id,label,price,sort_order)')
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
    console.error('Product page: loading failed:', error)
    loadError = 'Моментално не можеме да го вчитаме производот. Обидете се повторно за неколку минути.'
  }

  // Old Cyrillic address (/prodavnica/фактура-а5) → the Latin one (/prodavnica/faktura-a5),
  // with a permanent 308 so shared links keep working and Google moves to the new URL.
  if (!product && !loadError && /[Ѐ-ӿ]/.test(slug)) {
    const latin = latinSlug(slug)
    let moved = null
    try {
      moved = latin && latin !== slug ? await fetchProductBySlug(latin) : null
    } catch {
      // treat as not found
    }
    if (moved) permanentRedirect(productPath(moved.slug))
  }

  // A database error is not "product does not exist": show the error, not 404.
  if (!product && !loadError) {
    notFound()
  }

  let structuredData = null
  if (product) {
    const variants = product.product_variants ?? []
    const price = variants.length ? Math.min(...variants.map((v) => v.price)) : effectivePrice(product)
    const category = product.categories
    structuredData = [
      productJsonLd(product, { price, categoryName: category?.name }),
      breadcrumbJsonLd([
        { name: SITE_NAME, path: '/' },
        { name: 'Продавница', path: '/prodavnica' },
        ...(category?.slug ? [{ name: category.name, path: categoryPath(category.slug) }] : []),
        { name: product.title, path: productPath(product.slug) },
      ]),
    ]
  }

  return (
    <>
      {structuredData ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(structuredData)} />
      ) : null}
      <Suspense fallback={null}>
        <ProductDetailClient product={product} loadError={loadError} />
      </Suspense>
    </>
  )
}
