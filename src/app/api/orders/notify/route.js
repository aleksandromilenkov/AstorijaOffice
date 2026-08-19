// Server-side route handler that emails the shop owner whenever a new
// order lands. Uses the EmailJS REST endpoint so we never expose the
// EmailJS public key to the browser for transactional mail.
//
// Required env vars (server-only, no NEXT_PUBLIC_ prefix):
//   EMAILJS_SERVICE_ID
//   EMAILJS_ORDER_TEMPLATE_ID   (a separate template configured in
//                                EmailJS that emails the shop owner)
//   EMAILJS_PUBLIC_KEY
//   OWNER_NOTIFICATION_EMAIL     (the inbox that should receive orders)

import { NextResponse } from 'next/server'

const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send'

export async function POST(request) {
  let payload
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Невалиден формат на податоци.' },
      { status: 400 },
    )
  }

  const order = payload?.order
  if (!order) {
    return NextResponse.json(
      { ok: false, error: 'Податоците за нарачката недостасуваат.' },
      { status: 400 },
    )
  }

  const serviceId = process.env.EMAILJS_SERVICE_ID
  const templateId = process.env.EMAILJS_ORDER_TEMPLATE_ID
  const publicKey = process.env.EMAILJS_PUBLIC_KEY
  const ownerEmail = process.env.OWNER_NOTIFICATION_EMAIL

  if (!serviceId || !templateId || !publicKey) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'EmailJS не е конфигуриран. Поставете EMAILJS_SERVICE_ID, EMAILJS_ORDER_TEMPLATE_ID и EMAILJS_PUBLIC_KEY.',
      },
      { status: 500 },
    )
  }

  const lines = Array.isArray(order.lines) ? order.lines : []
  const itemsBlock = lines
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
    order_url: buildOrderUrl(order.id),
  }

  try {
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
      return NextResponse.json(
        {
          ok: false,
          error: `EmailJS врати ${response.status}: ${errorText || 'непозната грешка'}`,
        },
        { status: 502 },
      )
    }

    return NextResponse.json({ ok: true })
  } catch (sendError) {
    return NextResponse.json(
      {
        ok: false,
        error: sendError?.message ?? 'Не може да се испрати известување.',
      },
      { status: 500 },
    )
  }
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

function buildOrderUrl(id) {
  const origin = (process.env.NEXT_PUBLIC_SITE_ORIGIN || '').replace(/\/$/, '')
  if (!origin || !id) return ''
  return `${origin}/admin/orders/${id}`
}