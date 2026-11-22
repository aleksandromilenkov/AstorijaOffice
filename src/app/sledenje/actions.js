'use server'

import { createPublicClient } from '@/lib/supabase/public'

/**
 * Look up an order for the "Следи нарачка" page. Uses the public
 * `track_order` database function, which only answers when the order number
 * AND the phone used on the order both match.
 */
export async function trackOrder(code, phone) {
  const cleanCode = String(code ?? '').replace(/[^0-9a-f]/gi, '')
  const cleanPhone = String(phone ?? '').replace(/\D/g, '')

  if (cleanCode.length !== 8) {
    return { ok: false, error: 'Бројот на нарачка има 8 знаци (пр. 0E0C4F3B).' }
  }
  if (!/^07\d{7}$/.test(cleanPhone)) {
    return { ok: false, error: 'Внесете го телефонот од нарачката (пр. 075-123-456).' }
  }

  const { data, error } = await createPublicClient().rpc('track_order', {
    p_code: cleanCode,
    p_phone: cleanPhone,
  })

  if (error) {
    console.error('track_order failed:', error)
    return { ok: false, error: 'Моментално не можеме да ја провериме нарачката. Обидете се повторно.' }
  }
  if (!data) {
    return {
      ok: false,
      error: 'Не најдовме нарачка со овој број и телефон. Проверете ги податоците.',
    }
  }
  return { ok: true, order: data }
}
