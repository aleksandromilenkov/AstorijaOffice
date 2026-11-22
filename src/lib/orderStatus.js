/**
 * Order statuses — single source of truth for the admin panel and the
 * customer "Следи нарачка" page. Keys must match the CHECK constraint in
 * supabase/migrations/20261125100000_order_tracking.sql.
 */
export const ORDER_STATUSES = {
  received: {
    label: 'Примена',
    color: 'warning',
    customer: 'Ја примивме вашата нарачка. Наскоро ќе ве контактираме за потврда.',
  },
  confirmed: {
    label: 'Потврдена',
    color: 'info',
    customer: 'Нарачката е потврдена и чека изработка.',
  },
  in_production: {
    label: 'Во изработка',
    color: 'secondary',
    customer: 'Вашата нарачка се печати.',
  },
  shipped: {
    label: 'Испратена',
    color: 'primary',
    customer: 'Предадена на курир. Достава за 1–2 работни дена.',
  },
  delivered: {
    label: 'Доставена',
    color: 'success',
    customer: 'Нарачката е доставена. Ви благодариме!',
  },
  cancelled: {
    label: 'Откажана',
    color: 'default',
    customer: 'Нарачката е откажана. За прашања контактирајте нè.',
  },
}

/** The normal path, in order (cancelled is outside it). */
export const STATUS_STEPS = ['received', 'confirmed', 'in_production', 'shipped', 'delivered']

export const STATUS_KEYS = Object.keys(ORDER_STATUSES)

export function statusLabel(status) {
  return ORDER_STATUSES[status]?.label ?? status
}

export function statusColor(status) {
  return ORDER_STATUSES[status]?.color ?? 'default'
}
