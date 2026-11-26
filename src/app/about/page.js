import About from '@/components/About'

export const metadata = {
  title: 'За нас — Асторија',
  description:
    'Асторија печати од 1999 година — повеќе од 5.000 задоволни клиенти. Запознајте ја нашата приказна.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return <About />
}
