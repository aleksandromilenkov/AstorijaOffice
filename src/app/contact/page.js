import Contact from '@/components/Contact'

export const metadata = {
  title: 'Контакт — Асторија',
  description:
    'Испратете ни порака и ќе ви одговориме за неколку часа. ул. Рахилка Гонева 10, Свети Николе.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return <Contact />
}
