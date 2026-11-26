'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { STATUS_KEYS } from '@/lib/orderStatus'


/**
 * Change an order's status and/or add a note. Every save is recorded in
 * `order_status_history` (admin-only via RLS), so the order page shows
 * who changed what and when.
 *
 * Returns `{ success: true }` or `{ success: false, error }`. Errors are
 * returned, not thrown: Next.js hides the message of a thrown error in
 * production, so the admin would only see a generic English text.
 */
export async function updateOrderStatus(orderId, newStatus, note = '') {
  if (!STATUS_KEYS.includes(newStatus)) {
    return { success: false, error: 'Невалиден статус.' }
  }
  const trimmedNote = String(note ?? '').trim()
  if (trimmedNote.length > 1000) {
    return { success: false, error: 'Белешката е предолга (најмногу 1000 знаци).' }
  }

  const supabase = await createClient()

  const { data: current, error: readError } = await supabase
    .from('orders')
    .select('status')
    .eq('id', orderId)
    .maybeSingle()
  if (readError) return { success: false, error: readError.message }
  if (!current) return { success: false, error: 'Нарачката не постои или немате пристап.' }

  if (current.status !== newStatus) {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)
    if (error) return { success: false, error: error.message }
  } else if (!trimmedNote) {
    return { success: true }
  }

  const { error: historyError } = await supabase
    .from('order_status_history')
    .insert({ order_id: orderId, status: newStatus, note: trimmedNote || null })
  if (historyError) return { success: false, error: historyError.message }

  revalidatePath(`/admin/orders/${orderId}`)
  revalidatePath('/admin/orders')

  return { success: true }
}
