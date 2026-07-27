'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from 'react'

/**
 * Shopping cart state with localStorage persistence.
 *
 * State shape:
 *   items: Array<{
 *     id: string,
 *     name: string,
 *     price: number,
 *     imageUrl: string,
 *     slug: string,
 *     qty: number,
 *   }>
 *
 * Persistence model:
 *   - The source of truth is localStorage under the key below. A
 *     `useSyncExternalStore` subscription gives us SSR-safe reads
 *     (returns `[]` on the server, the saved value on the client)
 *     and reactive updates across tabs via the `storage` event.
 *   - Every mutator (`addItem`, `updateQty`, `removeItem`, `clear`)
 *     updates both the React state and the stored value.
 *
 * Refresh / close-tab / new-tab all restore the same cart because
 * the data lives in localStorage, not in component state.
 *
 * The store is intentionally simple and dependency-free. When we wire
 * Supabase, the only thing that changes is `placeOrder()` — everything
 * the UI needs (add, remove, qty, totals) already lives here.
 */

const STORAGE_KEY = 'astorija.cart.v1'

// Module-level snapshot of the cart. This is the "store" that
// `useSyncExternalStore` subscribes to — every mutation goes through
// `setSnapshot`, which writes to localStorage and notifies listeners.
let snapshot = []
let listeners = new Set()

function readSnapshot() {
  return snapshot
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function emit() {
  for (const l of listeners) l()
}

function safeParse(raw) {
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (it) =>
        it &&
        typeof it.id === 'string' &&
        typeof it.name === 'string' &&
        Number.isFinite(it.price) &&
        Number.isFinite(it.qty)
    )
  } catch {
    return []
  }
}

function loadFromStorage() {
  if (typeof window === 'undefined') return []
  try {
    return safeParse(window.localStorage.getItem(STORAGE_KEY))
  } catch {
    return []
  }
}

function writeToStorage(items) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Quota / disabled storage: silently degrade, current session works.
  }
}

// Initialise the module snapshot from localStorage. This runs once
// when the module is first imported in the browser; on the server it
// stays an empty array. `useSyncExternalStore` will then hand each
// component the correct snapshot for its environment.
if (typeof window !== 'undefined') {
  snapshot = loadFromStorage()

  // Cross-tab sync: when another tab writes to localStorage, mirror
  // it here so the badge / cart page stay accurate everywhere.
  window.addEventListener('storage', (e) => {
    if (e.key !== STORAGE_KEY) return
    snapshot = loadFromStorage()
    emit()
  })
}

function setSnapshot(next) {
  snapshot = next
  writeToStorage(next)
  emit()
}

const CartContext = createContext(null)

// `useSyncExternalStore`'s third arg is called on every render to
// read the snapshot during SSR. Returning a fresh `[]` each time
// makes React think the snapshot changed every render — that's the
// "getServerSnapshot should be cached" infinite-loop warning. A
// module-level frozen array keeps the reference stable forever.
const EMPTY = Object.freeze([])

export function CartProvider({ children }) {
  // `useSyncExternalStore` is the React 19–native way to subscribe to
  // an external (non-React) source. It returns the current snapshot
  // safely during SSR (`[]`) and on the client (the saved cart).
  const items = useSyncExternalStore(subscribe, readSnapshot, () => EMPTY)

  // Cross-tab sync is already wired in the module-level `storage`
  // listener; no per-component effect is needed.

  const addItem = useCallback((product, qty = 1) => {
    if (!product || !product.id) return
    const q = Math.max(1, Number(qty) || 1)
    const i = snapshot.findIndex((it) => it.id === product.id)
    if (i >= 0) {
      const next = snapshot.slice()
      next[i] = { ...next[i], qty: next[i].qty + q }
      setSnapshot(next)
      return
    }
    setSnapshot([
      ...snapshot,
      {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        slug: product.slug,
        qty: q,
      },
    ])
  }, [])

  const updateQty = useCallback((id, qty) => {
    const q = Math.max(1, Number(qty) || 1)
    setSnapshot(snapshot.map((it) => (it.id === id ? { ...it, qty: q } : it)))
  }, [])

  const removeItem = useCallback((id) => {
    setSnapshot(snapshot.filter((it) => it.id !== id))
  }, [])

  const clear = useCallback(() => setSnapshot([]), [])

  const { count, subtotal, hydrated } = useMemo(() => {
    let c = 0
    let s = 0
    for (const it of items) {
      c += it.qty
      s += it.qty * it.price
    }
    return {
      count: c,
      subtotal: s,
      // `hydrated` is true once we've left the SSR snapshot behind.
      // We use it in the UI to avoid flashing "empty cart" on the
      // first paint of the cart page after a refresh.
      hydrated: typeof window !== 'undefined',
    }
  }, [items])

  // `useSyncExternalStore`'s third arg returns the snapshot during
  // SSR / hydration, so on the first client render we already have
  // the persisted items — no extra effect needed.

  const value = useMemo(
    () => ({ items, count, subtotal, hydrated, addItem, updateQty, removeItem, clear }),
    [items, count, subtotal, hydrated, addItem, updateQty, removeItem, clear]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart() must be used within a <CartProvider>.')
  }
  return ctx
}