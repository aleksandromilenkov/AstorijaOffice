import { Inter } from 'next/font/google'
import './globals.css'
import ThemeRegistry from '@/components/ThemeRegistry'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartShell from '@/components/store/CartShell'
import ContactFab from '@/components/ContactFab'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
})

// Absolute base for canonical / Open Graph URLs. NEXT_PUBLIC_SITE_ORIGIN wins
// (set it to the real domain, e.g. https://astorija.mk); otherwise Netlify's
// own `URL` (the site's main address, set automatically during builds).
const siteOrigin =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || process.env.URL || 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(siteOrigin),
  title: 'Асторија — Професионално печатење',
  description:
    'Асторија — печатница во Свети Николе од 1999. Визитки, флаери, маички, обрасци и брендирани производи со бесплатна достава и плаќање при достава низ цела Македонија.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="mk" className={inter.variable}>
      <body>
        <ThemeRegistry>
          <CartShell>
            <Header />
            <main>{children}</main>
            <Footer />
            <ContactFab />
          </CartShell>
        </ThemeRegistry>
      </body>
    </html>
  )
}
