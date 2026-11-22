'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { STATUS_KEYS } from '@/lib/orderStatus'


/**
 * Change an order's status and/or add a note. Every save is recorded in
 * `order_status_history` (admin-only via RLS), so the order page shows
 * who changed what and when.
 */
export async function updateOrderStatus(orderId, newStatus, note = '') {
  if (!STATUS_KEYS.includes(newStatus)) {
    throw new Error('Невалиден статус.')
  }
  const trimmedNote = String(note ?? '').trim()
  if (trimmedNote.length > 1000) {
    throw new Error('Белешката е предолга (најмногу 1000 знаци).')
  }

  const supabase = await createClient()

  const { data: current, error: readError } = await supabase
    .from('orders')
    .select('status')
    .eq('id', orderId)
    .maybeSingle()
  if (readError) throw new Error(readError.message)
  if (!current) throw new Error('Нарачката не постои или немате пристап.')

  if (current.status !== newStatus) {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)
    if (error) throw new Error(error.message)
  } else if (!trimmedNote) {
    return { success: true }
  }

  const { error: historyError } = await supabase
    .from('order_status_history')
    .insert({ order_id: orderId, status: newStatus, note: trimmedNote || null })
  if (historyError) throw new Error(historyError.message)

  revalidatePath(`/admin/orders/${orderId}`)
  revalidatePath('/admin/orders')

  return { success: true }
}
