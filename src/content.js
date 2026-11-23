/**
 * Site content — Macedonian only.
 *
 * This module replaces the old `translations.jsx` system. All copy lives
 * here as plain constants. Components import the section they need.
 *
 * If you ever want to add English later, the cleanest path is to make this
 * an object keyed by language — but for now we keep it single-language.
 */

// ---------------------------------------------------------------------------
// Company facts — the single source for address, phones, hours and years.
// Change them here and every page (header, footer, about, contact, terms,
// checkout) updates.
// ---------------------------------------------------------------------------
export const company = {
  name: 'Асторија',
  founded: 1999,
  clients: '5.000+',
  address: 'ул. Рахилка Гонева 10',
  city: 'Свети Николе',
  postalCode: '2220',
  country: 'Северна Македонија',
  phones: [
    { text: '070-210-128', href: 'tel:+38970210128' },
    { text: '075-260-480', href: 'tel:+38975260480' },
    { text: '032-444-466', href: 'tel:+38932444466' },
  ],
  // Number used for the floating "Viber" button.
  viber: '+38970210128',
  email: 'astorijanova@yahoo.com',
  hours: { days: 'Понеделник – Сабота', time: '08:00–15:00 и 19:00–22:00', closed: 'Недела' },
}
export const yearsOfExperience = new Date().getFullYear() - company.founded
export const fullAddress = `${company.address}, ${company.postalCode} ${company.city}`

export const navLinks = [
  { label: 'Дома', href: '/', icon: 'Home' },
  { label: 'Продавница', href: '/prodavnica', icon: 'Storefront' },
  { label: 'Промоции', href: '/promocii', icon: 'LocalOffer', accent: true },
  { label: 'Галерија', href: '/#products', icon: 'Collections', drawerOnly: true },
  { label: 'Следи нарачка', href: '/sledenje', icon: 'LocalShipping', drawerOnly: true },
  { label: 'За нас', href: '/about', icon: 'Info' },
  { label: 'Контакт', href: '/contact', variant: 'contained', icon: 'Email' },
]

export const hero = {
  badge: `Печатница од ${company.founded}`,
  titlePrefix: 'Печатете го вашиот бренд',
  titleAccent: 'на сè',
  sub: 'Визитки, флаери, маички, обрасци и брендирани производи — квалитетно отпечатени во Свети Николе и доставени до вашата врата низ цела Македонија.',
  primaryCta: 'Нарачај онлајн',
  secondaryCta: 'Побарај понуда',
  promises: ['Бесплатна достава', 'Плаќање при достава', 'Испорака за 1–2 дена'],
  socialProof: `${company.clients} задоволни клиенти · ${yearsOfExperience} години искуство`,
}

export const featured = {
  trustedBy: 'Проверено од',
}

export const stats = {
  overline: 'со бројки',
  items: [
    { value: 5000, display: '5.000+', label: 'Задоволни клиенти' },
    { value: yearsOfExperience, display: String(yearsOfExperience), label: `Години искуство (од ${company.founded})` },
    { value: 1000000, display: '1М+', label: 'Отпечатени производи (над милион)' },
    { value: 80, display: '80', label: 'Општини — бесплатна достава насекаде' },
  ],
}

export const process = {
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
      desc: 'Вашата нарачка е спакувана и испратена — бесплатна достава до вашата адреса за 1–2 работни дена, или подигнување во печатницата.',
    },
  ],
}

export const weDesign = {
  overline: 'што печатиме',
  title1: 'Дизајнираме',
  title2: 'сѐ.',
  bottom: 'Ако можете да го замислите — можеме да го отпечатиме.',
  // icon = MUI icon name, rendered by WeDesignEverything
  items: [
    { label: 'Маички', icon: 'Checkroom' },
    { label: 'Моливи', icon: 'Create' },
    { label: 'Капи', icon: 'Face' },
    { label: 'Хартија', icon: 'Description' },
    { label: 'Пакети', icon: 'Inventory2' },
    { label: 'Торби', icon: 'ShoppingBag' },
    { label: 'Шолји', icon: 'Coffee' },
    { label: 'Календари', icon: 'CalendarMonth' },
    { label: 'Етикети', icon: 'Sell' },
    { label: 'Налепници', icon: 'AutoAwesome' },
    { label: 'И многу повеќе', icon: 'MoreHoriz' },
  ],
}

export const products = {
  title: 'Наши печатени производи',
  description: 'Кликнете на дизајн за да го видите во цел екран',
  galleryTitle: 'Печатени производи',
  altPrefix: 'Дизајн',
  shirtCount: 12,
}

export const services = {
  overline: 'што нудиме',
  heading: 'Сè за печатење на едно место',
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
}

export const contact = {
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
  info: [
    { icon: 'mail', href: `mailto:${company.email}`, text: company.email },
    ...company.phones.map((p) => ({ icon: 'phone', href: p.href, text: p.text })),
    { icon: 'pin', href: null, text: fullAddress },
  ],
}

export const about = {
  overline: 'нашата приказна',
  title: 'За Асторија',
  story: `АСТОРИЈА печати од ${company.founded} година — повеќе од ${yearsOfExperience} години доверба на ${company.clients} клиенти. Од мал копи-центар до целосно студио за дизајн и печатење, растеме заедно со бизнисите, училиштата и луѓето што ги служиме — печатејќи сè, од една страница до илјадници брендирани артикли.`,
  timeline: [
    { year: String(company.founded), label: 'Основано' },
    { year: '2010', label: 'Проширено' },
    { year: '2018', label: 'Ребрендирано' },
    { year: 'Денес', label: 'Онлајн продавница' },
  ],
  location: `${fullAddress}, ${company.country}`,
  getInTouchLabel: 'Контакт',
}

export const footer = {
  tagline: `Ја печатиме вашата визија од ${company.founded}.`,
  contact: 'Контакт',
  hours: 'Работно време',
  location: 'Локација',
  dooel: 'АЛЕКСАНДРО ДООЕЛ',
  reserved: 'Сите права се задржани.',
  closed: 'затворено',
}
