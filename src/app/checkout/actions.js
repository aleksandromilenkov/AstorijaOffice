'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send'

/**
 * Persist a customer order along with its line items.
 *
 * This is a Next.js Server Action — it runs on the server with the
 * Supabase cookie-bound client, so the RLS policies on `orders` and
 * `order_items` govern access.
 *
 * Expected payload shape:
 *   {
 *     customer: { name, phone, city, address },
 *     items: [
 *       { id, name, slug?, price, qty }
 *     ],
 *     subtotal: number,
 *     shipping: number,
 *     total: number
 *   }
 *
 * Returns `{ ok: true, orderId }` on success or `{ ok: false, error }`
 * with a friendly message so the client can show it inline (no popups).
 */
export async function placeOrder(payload) {
  const customer = payload?.customer ?? {}
  const items = Array.isArray(payload?.items) ? payload.items : []

  if (!customer.name || !customer.phone || !customer.city || !customer.address) {
    return { ok: false, error: 'Пополнете ги сите полиња за достава.' }
  }

  if (items.length === 0) {
    return { ok: false, error: 'Вашата кошничка е празна.' }
  }

  const subtotal = Number(payload?.subtotal ?? 0)
  const shipping = Number(payload?.shipping ?? 0)
  const total = Number(payload?.total ?? subtotal + shipping)

  let supabase
  try {
    supabase = await createClient()
  } catch (clientError) {
    return {
      ok: false,
      error:
        clientError?.message ??
        'Не може да се воспостави конекција со базата. Обидете се повторно.',
    }
  }

  const { data: orderRow, error: orderError } = await supabase
    .from('orders')
    .insert([
      {
        shipping_name: customer.name,
        shipping_phone: customer.phone,
        shipping_city: customer.city,
        shipping_address: customer.address,
        total_amount: Math.round(total),
        status: 'pending',
      },
    ])
    .select('id')
    .single()

  if (orderError || !orderRow) {
    return {
      ok: false,
      error: orderError?.message ?? 'Нарачката не може да се зачува.',
    }
  }

  const lineItems = items.map((it) => ({
    order_id: orderRow.id,
    product_id: typeof it.id === 'string' ? it.id : null,
    product_name: it.name,
    product_slug: it.slug ?? null,
    unit_price: Math.round(Number(it.price) || 0),
    quantity: Math.max(1, Number(it.qty) || 1),
    line_total: Math.round(Number(it.price) || 0) * Math.max(1, Number(it.qty) || 1),
  }))

  // Reuse the same orders table — there's no separate `order_items` table
  // in this schema. We store the line items as a JSON column on the
  // order itself so the checkout flow is self-contained.
  const { error: itemsError } = await supabase
    .from('orders')
    .update({ notes: JSON.stringify(lineItems) })
    .eq('id', orderRow.id)

  if (itemsError) {
    return {
      ok: false,
      error:
        itemsError.message ??
        'Нарачката е зачувана, но ставките не можеа да се додадат. Контактирајте нè.',
    }
  }

  // Fire the owner notification directly via EmailJS. We do this inline
  // (with proper error logging) instead of bouncing through a same-origin
  // route handler so the Server Action doesn't need to know its own URL.
  // If email fails, the order itself is still saved — we surface a soft
  // `notifyError` to the client so it can show a non-blocking hint.
  let notifyError = null
  try {
    const sendResult = await sendOrderEmail({
      order: {
        id: orderRow.id,
        shipping_name: customer.name,
        shipping_phone: customer.phone,
        shipping_city: customer.city,
        shipping_address: customer.address,
        total_amount: Math.round(total),
        lines: lineItems,
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

  return { ok: true, orderId: orderRow.id, notifyError }
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