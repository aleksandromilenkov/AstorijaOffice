/**
 * Site content — Macedonian only.
 *
 * This module replaces the old `translations.jsx` system. All copy lives
 * here as plain constants. Components import the section they need.
 *
 * If you ever want to add English later, the cleanest path is to make this
 * an object keyed by language — but for now we keep it single-language.
 */

export const navLinks = [
  { label: 'Дома', href: '/' },
  { label: 'За нас', href: '/about' },
  { label: 'Контакт', href: '/contact', variant: 'contained' },
]

export const hero = {
  badge: '✦ Професионално печатење',
  titlePrefix: 'Печатете го вашиот бренд',
  titleAccent: 'на сè',
  sub: 'Професионално печатење за бизниси, настани, клубови, училишта и организации — од единечен примерок до милион бренд-артикли.',
  primaryCta: 'Печати сега',
  secondaryCta: 'Како работиме ↓',
  socialProof: '1.000+ задоволни клиенти',
}

export const featured = {
  trustedBy: 'Проверено од',
}

export const stats = {
  overline: 'со бројки',
  items: [
    { value: 1000000, display: '1M+', label: 'Печатени производи', icon: '🖨', suffix: '' },
    { value: 5000,    display: '5,000+', label: 'Бизнис клиенти',    icon: '💼', suffix: '+' },
    { value: 25,      display: '25+',    label: 'Години искуство',   icon: '🏆', suffix: '+' },
    { value: 100,     display: '100%',   label: 'Персонализиран дизајн', icon: '🎨', suffix: '%' },
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
      desc: 'Вашата нарачка е спакувана и подготвена. Подигнување во продавница или достава дистрибуирано до вашиот дом.',
    },
  ],
}

export const weDesign = {
  overline: 'што печатиме',
  title1: 'Дизајнираме',
  title2: 'сѐ.',
  bottom: 'Ако можете да го замислите — можеме да го отпечатиме.',
  items: [
    { label: 'Маички',    icon: '👕' },
    { label: 'Моливи',    icon: '✏️' },
    { label: 'Капи',      icon: '🧢' },
    { label: 'Хартија',   icon: '📄' },
    { label: 'Пакети',    icon: '🔥' },
    { label: 'Торби',     icon: '👜' },
    { label: 'Шолји',     icon: '☕' },
    { label: 'Календари', icon: '📅' },
    { label: 'Етикети',   icon: '🏷️' },
    { label: 'Налепници', icon: '⭐' },
    { label: 'Повеќе...',  icon: '✨' },
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
    { icon: 'mail',  href: 'mailto:astorijanova@yahoo.com', text: 'astorijanova@yahoo.com' },
    { icon: 'phone', href: 'tel:+38970210128',             text: '070-210-128' },
    { icon: 'phone', href: 'tel:+38932444466',             text: '032-444-466' },
    { icon: 'pin',   href: null,                           text: 'Leninova 24, Sveti Nikole' },
  ],
}

export const about = {
  overline: 'нашата приказна',
  title: 'За Асторија',
  story: 'АСТОРИЈА е доверливо име на македонскиот пазар веќе повеќе од 25 години. Од мал копи-центар до целосно студио за дизајн и печатење, ние растеме заедно со бизнисите и училиштата што ги служиме — печатејќи сè, од една страница до милион бренд-артикли.',
  timeline: [
    { year: '1998', label: 'Основано' },
    { year: '2010', label: 'Проширено' },
    { year: '2018', label: 'Ребрендирано' },
    { year: 'Сега', label: '1M+ отпечатени продукти' },
  ],
  location: 'Плоштад Илинден бр.34, Свети Николе, Македонија',
  getInTouchLabel: 'Контакт',
}

export const footer = {
  quote: 'Ја печатиме вашата визија од 1998.',
  contact: 'Контакт',
  hours: 'Работно време',
  location: 'Локација',
  dooel: 'АЛЕКСАНДРО ДООЕЛ',
  copyright: '©',
  reserved: 'Сите права се задржани.',
  closed: 'ЗАТВОРЕНО',
}
