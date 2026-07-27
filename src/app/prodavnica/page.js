import { Suspense } from 'react'
import ProdavnicaClient from '@/components/store/ProdavnicaClient'

export const metadata = {
  title: 'Продавница — Асторија',
  description:
    'Купете производи за печатење онлајн: визитки, флаери, маички, чаши, постери, налепници и покани. Испорака низ цела Македонија.',
}

/**
 * /prodavnica route.
 *
 * Server component: reads `searchParams` (a Promise in Next.js 16) and
 * passes the resolved values into the client view. Wraps the client
 * in `<Suspense>` so `useSearchParams()` inside the client doesn't
 * block the rest of the page during prerendering.
 */
export default async function ProdavnicaPage({ searchParams }) {
  const sp = (await searchParams) || {}
  const q = typeof sp.q === 'string' ? sp.q : ''
  const cat = typeof sp.cat === 'string' ? sp.cat : 'all'

  return (
    <Suspense fallback={null}>
      <ProdavnicaClient initialQ={q} initialCat={cat} />
    </Suspense>
  )
}