'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { municipalities } from '@/data/municipalities'

const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send'

// Error codes raised by the `place_order` database function
// (supabase/migrations/20261122150000_place_order_rpc.sql) → customer message.
const ORDER_ERRORS = {
  invalid_name: 'Внесете име и презиме (2–100 знаци).',
  invalid_phone: 'Внесете валиден македонски телефонски број (пр. 075-XXX-XXX).',
  invalid_city: 'Ве молиме изберете валиден град/општина од листата.',
  invalid_address: 'Адресата е предолга (најмногу 300 знаци).',
  empty_cart: 'Вашата кошничка е празна.',
  too_many_items: 'Премногу различни производи во една нарачка (најмногу 50).',
  invalid_quantity: 'Невалидна количина (1–1000 по производ).',
  unknown_product:
    'Некој производ во кошничката повеќе не е достапен. Отстранете го и обидете се повторно.',
}

function orderErrorMessage(dbMessage = '') {
  if (dbMessage.startsWith('out_of_stock:')) {
    const title = dbMessage.slice('out_of_stock:'.length)
    return `„${title}“ моментално нема на залиха. Отстранете го од кошничката.`
  }
  return ORDER_ERRORS[dbMessage] ?? null
}

/**
 * Place a customer order (Server Action).
 *
 * Payload:
 *   { customer: { name, phone, city, address }, items: [{ id, qty }] }
 *
 * All the real work happens in the `place_order` Postgres function: it
 * validates the input, reads prices from `products` (browser prices are
 * never trusted), computes the total and writes `orders` + `order_items`
 * in one transaction. It runs with the table owner's rights, so it works
 * for logged-out customers even though they cannot read `orders`.
 *
 * Returns `{ ok: true, orderId, total, notifyError }` or `{ ok: false, error }`.
 */
export async function placeOrder(payload) {
  const customer = payload?.customer ?? {}
  const items = Array.isArray(payload?.items) ? payload.items : []

  if (!customer.name || !customer.phone || !customer.city) {
    return { ok: false, error: 'Пополнете ги сите задолжителни полиња за достава.' }
  }
  if (!municipalities.includes(customer.city)) {
    return { ok: false, error: ORDER_ERRORS.invalid_city }
  }
  if (items.length === 0) {
    return { ok: false, error: ORDER_ERRORS.empty_cart }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('place_order', {
    p_name: String(customer.name),
    p_phone: String(customer.phone),
    p_city: String(customer.city),
    p_address: String(customer.address ?? ''),
    p_items: items.map((it) => ({ product_id: it?.id, quantity: it?.qty })),
  })

  if (error || !data?.order_id) {
    const friendly = orderErrorMessage(error?.message)
    if (!friendly) console.error('place_order failed:', error)
    return {
      ok: false,
      error: friendly ?? 'Нарачката не може да се зачува. Обидете се повторно.',
    }
  }

  // Owner notification. If email fails the order is still saved; we return
  // a soft `notifyError` so the client can show a non-blocking hint.
  let notifyError = null
  try {
    const sendResult = await sendOrderEmail({
      order: {
        id: data.order_id,
        shipping_name: customer.name,
        shipping_phone: customer.phone,
        shipping_city: customer.city,
        shipping_address: customer.address,
        total_amount: data.total_amount,
        lines: data.lines,
        notes: '',
      },
    })
    if (!sendResult.ok) {
      notifyError = sendResult.error
      console.error('Order notification email failed:', sendResult.error)
    }
  } catch (emailError) {
    notifyError = emailError?.message ?? 'email_failed'
    console.error('Order notification email threw:', emailError)
  }

  return { ok: true, orderId: data.order_id, total: data.total_amount, notifyError }
}

async function sendOrderEmail({ order }) {
  const serviceId = process.env.EMAILJS_SERVICE_ID
  const templateId = process.env.EMAILJS_ORDER_TEMPLATE_ID
  const publicKey = process.env.EMAILJS_PUBLIC_KEY
  const ownerEmail = process.env.OWNER_NOTIFICATION_EMAIL

  if (!serviceId || !templateId || !publicKey) {
    return {
      ok: false,
      error:
        'EmailJS не е конфигуриран. Поставете EMAILJS_SERVICE_ID, EMAILJS_ORDER_TEMPLATE_ID и EMAILJS_PUBLIC_KEY.',
    }
  }

  const itemsBlock = (Array.isArray(order.lines) ? order.lines : [])
    .map(
      (line) =>
        `• ${line.product_name} x${line.quantity} — ${formatMoney(line.line_total)} ден.`,
    )
    .join('\n')

  const templateParams = {
    to_email: ownerEmail || '',
    order_id: shortOrderId(order.id),
    created_at: new Date().toLocaleString('mk-MK', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
    customer_name: order.shipping_name ?? '',
    customer_phone: order.shipping_phone ?? '',
    customer_city: order.shipping_city ?? '',
    customer_address: order.shipping_address ?? '',
    total_amount: formatMoney(order.total_amount ?? 0),
    items_block: itemsBlock,
    notes: order.notes ?? '',
    order_url: await buildOrderUrl(order.id),
  }

  const response = await fetch(EMAILJS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      origin: 'https://api.emailjs.com',
    },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: templateParams,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    return {
      ok: false,
      error: `EmailJS ${response.status}: ${errorText || 'unknown error'}`,
    }
  }

  console.log('Order notification email sent:', shortOrderId(order.id))
  return { ok: true }
}

function formatMoney(value) {
  const n = Number.isFinite(value) ? Math.round(value) : 0
  const digits = Math.abs(n).toString()
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, '\u202F')
  return `${n < 0 ? '-' : ''}${grouped}`
}

function shortOrderId(id) {
  if (typeof id !== 'string' || id.length < 8) return id ?? ''
  return id.slice(0, 8).toUpperCase()
}

async function buildOrderUrl(id) {
  if (!id) return ''
  const explicit = (process.env.NEXT_PUBLIC_SITE_ORIGIN || '').replace(/\/$/, '')
  if (explicit) return `${explicit}/admin/orders/${id}`
  try {
    const h = await headers()
    const host = h.get('x-forwarded-host') || h.get('host')
    const proto = h.get('x-forwarded-proto') || 'http'
    if (host) return `${proto}://${host}/admin/orders/${id}`
  } catch {
    // headers() not available outside request scope
  }
  return ''
}