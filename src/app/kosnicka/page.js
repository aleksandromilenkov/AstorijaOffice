import CartPage from '@/components/store/CartPage'

export const metadata = {
  title: 'Кошничка — Асторија',
  description:
    'Преглед на вашата кошничка. Плаќање при достава низ цела Македонија.',
}

/**
 * /kosnicka — full-page cart route.
 *
 * The cart state itself lives in `CartContext`, which hydrates from
 * `localStorage` on the client. The server therefore renders an empty
 * placeholder; the client fills it in after mount.
 */
export default function KosnickaRoute() {
  return <CartPage />
}