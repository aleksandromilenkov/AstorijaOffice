/**
 * "Fly to cart": a red dot arcs from the last tap/click to the header cart
 * icon, then the icon bounces (listeners of the `cart:bump` event).
 *
 * Called from CartContext.addItem, so every "add to cart" button gets it
 * without extra wiring. Uses the Web Animations API (transform/opacity
 * only). With "reduce motion" the flight is skipped; the bump still fires.
 */

let lastPointer = null

if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointerdown',
    (e) => {
      lastPointer = { x: e.clientX, y: e.clientY }
    },
    { capture: true, passive: true },
  )
}

function visibleCartTarget() {
  const targets = document.querySelectorAll('[data-cart-target]')
  for (const el of targets) {
    const r = el.getBoundingClientRect()
    if (r.width > 0 && r.height > 0) return r
  }
  return null
}

function bump() {
  window.dispatchEvent(new Event('cart:bump'))
}

export function flyToCart() {
  if (typeof window === 'undefined') return
  const target = visibleCartTarget()
  const start = lastPointer
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (!target || !start || reduce || !document.body.animate) {
    bump()
    return
  }

  const SIZE = 18
  const end = { x: target.left + target.width / 2, y: target.top + target.height / 2 }
  const dot = document.createElement('div')
  dot.setAttribute('aria-hidden', 'true')
  Object.assign(dot.style, {
    position: 'fixed',
    left: '0px',
    top: '0px',
    width: `${SIZE}px`,
    height: `${SIZE}px`,
    borderRadius: '50%',
    background: 'radial-gradient(circle at 35% 35%, #ff6b72, #d71f2b 60%, #9e0f19)',
    boxShadow: '0 6px 18px rgba(215,31,43,0.55)',
    zIndex: '2000',
    pointerEvents: 'none',
  })
  document.body.appendChild(dot)

  const at = (x, y, s) => `translate3d(${x - SIZE / 2}px, ${y - SIZE / 2}px, 0) scale(${s})`
  // Arc upwards, but never above the top of the screen (the cart sits there).
  const peakY = Math.max(SIZE, Math.min(start.y, end.y) - 140)
  const midX = start.x + (end.x - start.x) * 0.55

  const flight = dot.animate(
    [
      { transform: at(start.x, start.y, 0.4), opacity: 0 },
      { transform: at(start.x, start.y, 1.15), opacity: 1, offset: 0.12 },
      { transform: at(midX, peakY, 1), opacity: 1, offset: 0.55 },
      { transform: at(end.x, end.y, 0.35), opacity: 0.9 },
    ],
    { duration: 780, easing: 'cubic-bezier(0.45, 0, 0.25, 1)' },
  )
  flight.onfinish = () => {
    dot.remove()
    bump()
  }
  flight.oncancel = () => dot.remove()
}
