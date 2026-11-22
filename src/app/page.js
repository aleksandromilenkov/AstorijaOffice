import Hero from '@/components/Hero'
import FeaturedIn from '@/components/FeaturedIn'
import Stats from '@/components/Stats'
import Process from '@/components/Process'
import Products from '@/components/Products'
import WeDesignEverything from '@/components/WeDesignEverything'
import Services from '@/components/Services'
import PromotionsSection from '@/components/promo/PromotionsSection'

// Re-check promotions at most once a minute (ISR), so new or expired
// promos show up without a redeploy while the page stays fast.
export const revalidate = 60

export default function HomePage() {
  return (
    <>
      <Hero />
      <PromotionsSection />
      <FeaturedIn />
      <Stats />
      <Process />
      <Products />
      <WeDesignEverything />
      <Services />
    </>
  )
}
