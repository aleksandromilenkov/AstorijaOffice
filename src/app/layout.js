import { Inter } from 'next/font/google'
import './globals.css'
import ThemeRegistry from '@/components/ThemeRegistry'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartShell from '@/components/store/CartShell'
import ContactFab from '@/components/ContactFab'
import { siteOrigin, SITE_NAME, businessJsonLd, websiteJsonLd, jsonLdHtml } from '@/lib/seo'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
})

const DEFAULT_DESCRIPTION =
  'Асторија — печатница во Свети Николе од 1999. Визитки, флаери, обрасци, фактури, работни книги, маички и брендирани производи со бесплатна достава и плаќање при достава низ цела Македонија. Pecatnica Astorija — vizitki, flaeri, obrasci, fakturi.'

// metadataBase comes from NEXT_PUBLIC_SITE_ORIGIN (the real domain) — see src/lib/seo.js.
// No canonical here on purpose: each page sets its own, otherwise every page
// would inherit the home page's canonical and drop out of Google.
export const metadata = {
  metadataBase: new URL(siteOrigin),
  title: 'Асторија — Печатница и онлајн продавница | Astorija Pecatnica',
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'mk_MK',
    title: 'Асторија — Печатница и онлајн продавница',
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  // Google Search Console → "HTML tag" verification: set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION in Netlify.
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
}

export default function RootLayout({ children }) {
  return (
    <html lang="mk" className={inter.variable}>
      <body>
        {/* Structured data: the print shop (address, phones, hours) and the site search */}
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(businessJsonLd())} />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(websiteJsonLd())} />
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
