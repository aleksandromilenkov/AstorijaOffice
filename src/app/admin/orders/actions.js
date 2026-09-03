'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateOrderStatus(orderId, newStatus, note = '') {
  const supabase = await createClient()

  // In this project, 'notes' currently stores a JSON string of the order items.
  // To avoid overwriting order items, we check if the table has 'status_history'.
  // If not, we'll implement a simple append if we had a dedicated column, 
  // but for now we'll just update the status.
  
  const { data, error } = await supabase
    .from('orders')
    .update({ 
      status: newStatus,
    })
    .eq('id', orderId)
    .select()


  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/admin/orders/${orderId}`)
  revalidatePath('/admin/orders')

  return { success: true, data }
}
