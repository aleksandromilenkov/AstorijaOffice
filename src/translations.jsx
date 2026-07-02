import React, { createContext, useContext, useMemo, useState } from 'react'

export const LANGUAGE_OPTIONS = [
  { code: 'mk', label: 'Македонски', flag: '🇲🇰' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
]

export const DEFAULT_LANGUAGE = 'mk'

export const translations = {
  mk: {
    header: {
      nav: [
        { label: 'Продукти', href: '#products' },
        { label: 'Услуги', href: '#services' },
        { label: 'За нас', href: '#about' },
        { label: 'Контакт', href: '#contact', variant: 'contained' },
      ],
      language: 'Јазик',
      languageNames: { mk: 'Македонски', en: 'English' },
    },
    hero: {
      badge: '✦ Професионално печатење',
      titlePrefix: 'Печатете го вашиот бренд',
      titleAccent: 'на сè',
      sub: 'Професионално печатење за бизниси, настани, клубови, училишта и организации — од единечен примерок до милион бренд-артикли.',
      primaryCta: 'Печати сега',
      secondaryCta: 'Како работиме ↓',
      socialProof: '1.000+ задоволни клиенти',
    },
    featured: {
      trustedBy: 'Проверено од',
    },
    products: {
      title: 'Наши печатени производи',
      description: 'Кликнете на дизајн за да го видите во цел екран',
      galleryTitle: 'Печатени производи',
      galleryDesign: 'Дизајн',
      altPrefix: 'Дизајн',
    },
    stats: {
      overline: 'со бројки',
      labels: ['Печатени производи', 'Бизнис клиенти', 'Години искуство', 'Персонализиран дизајн'],
    },
    process: {
      overline: 'како работиме',
      titlePrefix: 'Од идеја до',
      titleAccent: 'ваши раце',
      description: 'Четири едноставни чекори — ние ги водиме сите детали.',
      steps: [
        {
          num: '01',
          title: 'Испратете го вашиот дизајн',
          desc: 'Споделете ја вашата идеја, лого или датотека — секој формат е добредојден. Не сте сигурни? Ние ќе ве водиме.',
        },
        {
          num: '02',
          title: 'Подготвуваме макета',
          desc: 'Нашиот тим создава преглед за да видите точно како ќе изгледа финалниот производ пред да печатиме.',
        },
        {
          num: '03',
          title: 'Продукција',
          desc: 'Откако ќе одобрите макета, ние отпечатуваме. Брза реализација, конзистентен квалитет, секој пат.',
        },
        {
          num: '04',
          title: 'Испорака',
          desc: 'Вашата нарачка е спакувана и подготвена. Подигнување во продавница или достава дистрибуирано до вашиот дом.',
        },
      ],
    },
    weDesign: {
      overline: 'што печатиме',
      title1: 'Дизајнираме',
      title2: 'сѐ.',
      bottom: 'Ако можете да го замислите — можеме да го отпечатиме.',
      items: ['Маички', 'Моливи', 'Капи', 'Хартија', 'Пакети', 'Торби', 'Шолји', 'Календари', 'Етикети', 'Налепници', 'Повеќе...'],
    },
    services: {
      overline: 'што нудиме',
      heading: 'Уживајте во нашите услуги',
      items: [
        {
          title: 'Копирање',
          desc: 'Брзо, висококвалитетно копирање за било каков обем — од единечна страница до серија.',
        },
        {
          title: 'Печатење',
          desc: 'Целосно колорно или црно-бело печатење на секој формат — од визит карта до банер.',
        },
        {
          title: 'Канцелариски материјали',
          desc: 'Сè што е потребно за вашиот работен простор — канцелариски материјали, опрема и брендирани материјали.',
        },
        {
          title: 'Договор за набавка',
          desc: 'Професионална подготовка на документи и печатење на договори.',
        },
        {
          title: 'Скенирање документи',
          desc: 'Висококвалитетно скенирање — дигитализирајте и архивирајте документи со јасност.',
        },
        {
          title: 'Училишни материјали',
          desc: 'Тетратки, работни листови и училишни пакети печатени и поврзани по нарачка.',
        },
      ],
    },
    contact: {
      overline: 'контакт',
      title: 'Ајде да започнеме нешто големо.',
      subtitle: 'Испратете ни порака и ќе ви одговориме за неколку часа.',
      fields: {
        name: 'Вашето име',
        email: 'Вашиот е-пошта',
        subject: 'Наслов',
        message: 'Вашата порака',
      },
      submit: 'Испрати порака',
      snackbar: {
        success: 'Пораката е пратена! Ќе ви одговориме наскоро.',
        error: 'Неуспешно испраќање:',
      },
    },
    about: {
      overline: 'нашата приказна',
      title: 'За Асторија',
      story: 'АСТОРИЈА е доверливо име на македонскиот пазар веќе повеќе од 25 години. Од мал копи-центар до целосно студио за дизајн и печатење, ние растеме заедно со бизнисите и училиштата што ги служиме — печатејќи сè, од една страница до милион бренд-артикли.',
      timeline: [
        { year: '1998', label: 'Основано' },
        { year: '2010', label: 'Проширено' },
        { year: '2018', label: 'Ребрендирано' },
        { year: 'Сега', label: '1M+ отпечатено' },
      ],
      location: 'Плоштад Илинден бр.34, Свети Николе, Македонија',
      contactLabel: 'Контакт',
    },
    footer: {
      quote: 'Печатиме вашата визија од 1998.',
      contact: 'Контакт',
      hours: 'Работно време',
      location: 'Локација',
      dooel: 'АЛЕКСАНДРО ДООЕЛ',
      copyright: '©',
      reserved: 'Сите права се задржани.',
      closed: 'ЗАТВОРЕНО',
      sunday: 'Недела',
    },
  },
  en: {
    header: {
      nav: [
        { label: 'Products', href: '#products' },
        { label: 'Services', href: '#services' },
        { label: 'About', href: '#about' },
        { label: 'Contact', href: '#contact', variant: 'contained' },
      ],
      language: 'Language',
      languageNames: { mk: 'Macedonian', en: 'English' },
    },
    hero: {
      badge: '✦ Professional printing',
      titlePrefix: 'Print your brand',
      titleAccent: 'on anything',
      sub: 'Professional printing for businesses, events, clubs, schools, and organizations — from a single copy to a million branded products.',
      primaryCta: 'Print Now',
      secondaryCta: 'How it works ↓',
      socialProof: '1,000+ happy customers',
    },
    featured: {
      trustedBy: 'trusted by',
    },
    products: {
      title: 'Our Printed Products',
      description: 'Click any design to explore in full screen',
      galleryTitle: 'Printed Products',
      galleryDesign: 'Design',
      altPrefix: 'Design',
    },
    stats: {
      overline: 'by the numbers',
      labels: ['Printed Products', 'Business Clients', 'Years Experience', 'Custom Design'],
    },
    process: {
      overline: 'how it works',
      titlePrefix: 'From idea to',
      titleAccent: 'your hands',
      description: 'Four simple steps — we handle everything in between.',
      steps: [
        {
          num: '01',
          title: 'Send Your Design',
          desc: 'Share your idea, logo, or file — any format works. Not sure what you need? We will guide you.',
        },
        {
          num: '02',
          title: 'We Prepare a Mockup',
          desc: 'Our team creates a preview so you see exactly how the final product will look before we print.',
        },
        {
          num: '03',
          title: 'Production',
          desc: 'Once you approve the mockup, we go to print. Fast turnaround, consistent quality, every time.',
        },
        {
          num: '04',
          title: 'Delivery',
          desc: 'Your order is packaged and ready. Pick it up in store or have it delivered straight to your door.',
        },
      ],
    },
    weDesign: {
      overline: 'what we print',
      title1: 'We design',
      title2: 'everything.',
      bottom: 'If you can imagine it — we can print it.',
      items: ['Shirts', 'Pencils', 'Caps', 'Paper', 'Lighters', 'Bags', 'Cups', 'Calendars', 'Labels', 'Stickers', 'More...'],
    },
    services: {
      overline: 'what we offer',
      heading: 'Enjoy our services',
      items: [
        {
          title: 'Copying',
          desc: 'Fast, high-quality copies for any volume — from single pages to bulk runs.',
        },
        {
          title: 'Printing',
          desc: 'Full-colour or monochrome printing on any format — business cards to banners.',
        },
        {
          title: 'Office Materials',
          desc: 'Everything your workspace needs — stationery, supplies and branded materials.',
        },
        {
          title: 'Purchase Contract',
          desc: 'Professional document preparation and contract printing done right.',
        },
        {
          title: 'Scanning Documents',
          desc: 'High-resolution scanning — digitise and archive your documents with clarity.',
        },
        {
          title: 'School Material',
          desc: 'Workbooks, worksheets, and learning packs printed and bound to order.',
        },
      ],
    },
    contact: {
      overline: 'get in touch',
      title: "Let's start something big.",
      subtitle: "Send us a message and we'll get back to you within a few hours.",
      fields: {
        name: 'Your Name',
        email: 'Your Email',
        subject: 'Subject',
        message: 'Your Message',
      },
      submit: 'Send Message',
      snackbar: {
        success: 'Message sent! We will get back to you soon.',
        error: 'Failed to send:',
      },
    },
    about: {
      overline: 'our story',
      title: 'About Astorija',
      story: 'Astorija has been a trusted name on the Macedonian market for more than 25 years. From a small copy shop to a full-service print and design studio, we have grown alongside the businesses and schools we serve — printing everything from a single document to a million branded products.',
      timeline: [
        { year: '1998', label: 'Founded' },
        { year: '2010', label: 'Expanded' },
        { year: '2018', label: 'Rebranded' },
        { year: 'Now', label: '1M+ prints' },
      ],
      location: 'Square Ilinden No.34, Sveti Nikole, Macedonia',
      contactLabel: 'Contact',
    },
    footer: {
      quote: 'Printing your vision since 1998.',
      contact: 'Contact',
      hours: 'Working Hours',
      location: 'Location',
      dooel: "ALEKSANDRO DOOEL",
      copyright: '©',
      reserved: 'All rights reserved.',
      closed: 'CLOSED',
      sunday: 'Sunday',
    },
  },
}

const TranslationContext = createContext({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  t: translations[DEFAULT_LANGUAGE],
  languages: LANGUAGE_OPTIONS,
})

export function TranslationProvider({ children }) {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE)
  const value = useMemo(() => ({
    language,
    setLanguage,
    t: translations[language],
    languages: LANGUAGE_OPTIONS,
  }), [language])

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslations() {
  return useContext(TranslationContext)
}
