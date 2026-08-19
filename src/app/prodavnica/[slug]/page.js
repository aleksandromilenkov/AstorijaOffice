import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import ProductDetailClient from '@/components/store/ProductDetailClient'
import { createClient } from '@/lib/supabase/server'

export async function generateMetadata({ params }) {
  const { slug } = await params
  return {
    title: `${slug} — Асторија`,
    description: 'Преглед на производ од продавницата на Асторија.',
  }
}

async function fetchProductBySlug(slug) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('id,title,slug,description,image_url,price,category_id,in_stock,created_at')
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params

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