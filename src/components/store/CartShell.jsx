'use client'

import { CartProvider } from '@/store/CartContext'

/**
 * Mounts the cart context once at the app shell level so the cart
 * state survives client-side navigation between pages and persists
 * across refreshes via `localStorage`. Renders nothing on its own.
 *
 * The cart itself is rendered as a full page at `/kosnicka` — this
 * provider exists only to share state with the header badge and any
 * page that needs to add items.
 */
export default function CartShell({ children }) {
  return <CartProvider>{children}</CartProvider>
}