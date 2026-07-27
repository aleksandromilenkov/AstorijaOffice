import { Inter } from 'next/font/google'
import './globals.css'
import ThemeRegistry from '@/components/ThemeRegistry'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartShell from '@/components/store/CartShell'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata = {
  title: 'Асторија — Професионално печатење',
  description:
    'Асторија — доверливо име за печатење, дизајн и брендирање веќе повеќе од 25 години. Од единечен примерок до милион бренд-артикли.',
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
          </CartShell>
        </ThemeRegistry>
      </body>
    </html>
  )
}
