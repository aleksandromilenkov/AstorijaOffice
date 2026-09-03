import { notFound } from 'next/navigation'
import AdminOrderDetailClient from './AdminOrderDetailClient'
import { createClient } from '@/lib/supabase/server'

async function fetchOrder(id) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export async function generateMetadata({ params }) {
  const { id } = await params
  return {
    title: `Нарачка #${(id ?? '').slice(0, 8).toUpperCase()} — Асторија Админ`,
  }
}

export default async function AdminOrderDetailPage({ params }) {
  const { id } = await params

  let order = null
  let loadError = null
  try {
    order = await fetchOrder(id)
  } catch (error) {
    loadError = error.message ?? 'Грешка при вчитување на нарачката.'
  }

  if (!order) {
    notFound()
  }

  return <AdminOrderDetailClient order={order} loadError={loadError} />
}