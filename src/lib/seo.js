import { company, fullAddress } from '@/content'
import { latinName } from '@/lib/transliterate'

// Absolute base for canonical, sitemap and structured-data URLs.
// NEXT_PUBLIC_SITE_ORIGIN wins (set it to the real domain, e.g. https://astorija.mk);
// otherwise Netlify's own `URL` (set automatically during builds).
export const siteOrigin = (
  process.env.NEXT_PUBLIC_SITE_ORIGIN || process.env.URL || 'http://localhost:3000'
).replace(/\/+$/, '')

export const SITE_NAME = 'Асторија'
export const SITE_NAME_LATIN = 'Astorija'

export const absoluteUrl = (path = '/') => `${siteOrigin}${path.startsWith('/') ? path : `/${path}`}`

export const productPath = (slug) => `/prodavnica/${encodeURIComponent(slug)}`
export const categoryPath = (slug) => `/prodavnica?cat=${encodeURIComponent(slug)}`

export { latinName }

const hasCyrillic = (text = '') => /[Ѐ-ӿ]/.test(text)

/** "Фактура А5 (Faktura A5)" when the name is Cyrillic, else the name as is. */
export function withLatin(text = '') {
  return hasCyrillic(text) ? `${text} (${latinName(text)})` : text
}

/** Safe JSON for a <script type="application/ld+json"> (see Next's JSON-LD guide). */
export function jsonLdHtml(data) {
  return { __html: JSON.stringify(data).replace(/</g, '\\u003c') }
}

// ---------------------------------------------------------------- structured data

const businessId = `${siteOrigin}/#business`

/** The print shop as a local business: name, address, phones, hours. */
export function businessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'Store'],
    '@id': businessId,
    name: SITE_NAME,
    alternateName: [SITE_NAME_LATIN, 'Печатница Асторија', 'Pecatnica Astorija', 'Astorija Sveti Nikole'],
    description:
      'Печатница во Свети Николе од 1999: визитки, флаери, обрасци, работни книги, маички и брендирани производи. Pecatnica Astorija — vizitki, flaeri, obrasci, rabotni knigi.',
    url: siteOrigin,
    logo: absoluteUrl('/brand/astorija-logo.svg'),
    image: absoluteUrl('/brand/astorija-logo.svg'),
    email: company.email,
    telephone: company.phones.map((p) => p.href.replace('tel:', '')),
    foundingDate: String(company.founded),
    priceRange: 'ден',
    currenciesAccepted: 'MKD',
    paymentAccepted: 'Cash on delivery',
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.address,
      addressLocality: company.city,
      postalCode: company.postalCode,
      addressCountry: 'MK',
    },
    areaServed: { '@type': 'Country', name: 'North Macedonia' },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '15:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '19:00',
        closes: '22:00',
      },
    ],
  }
}

/** The website itself, with the shop search so Google can offer a search box. */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteOrigin}/#website`,
    name: SITE_NAME,
    alternateName: SITE_NAME_LATIN,
    url: siteOrigin,
    inLanguage: 'mk',
    publisher: { '@id': businessId },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${siteOrigin}/prodavnica?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }
}

/** Product rich result: name (both alphabets), photos, price in MKD, stock. */
export function productJsonLd(product, { price, categoryName } = {}) {
  const images = (product.images?.length ? product.images : [product.image_url]).filter(
    (u) => typeof u === 'string' && u.startsWith('https://'),
  )
  const url = absoluteUrl(productPath(product.slug))
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product.title,
    ...(hasCyrillic(product.title) ? { alternateName: latinName(product.title) } : {}),
    description: productDescription(product, categoryName),
    ...(images.length ? { image: images } : {}),
    sku: product.slug,
    url,
    brand: { '@type': 'Brand', name: SITE_NAME },
    ...(categoryName ? { category: categoryName } : {}),
    ...(product.specs?.length
      ? { additionalProperty: product.specs.map((s) => ({ '@type': 'PropertyValue', name: 'Спецификација', value: s })) }
      : {}),
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'MKD',
      price: String(price ?? product.price),
      availability: product.in_stock === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': businessId },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'MKD' },
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'MK' },
      },
    },
  }
}

export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  }
}

/**
 * Meta description for a product: the product's own text when it has one,
 * otherwise built from its specs. Always mentions the Latin spelling, delivery
 * and the shop, so it reads well in Google results.
 */
export function productDescription(product, categoryName) {
  let own = (product.description ?? '').replace(/\s+/g, ' ').trim()
  // Seeded descriptions start with "<title> — ..."; drop that so the name isn't repeated.
  if (own.startsWith(`${product.title} — `)) own = own.slice(product.title.length + 3)
  const body = (own || (product.specs ?? []).join(', ')).replace(/[.\s]+$/, '')
  const cat = categoryName ? ` ${categoryName}.` : ''
  return `${withLatin(product.title)}${body ? ` — ${body}` : ''}.${cat} Нарачајте онлајн од печатница Асторија — бесплатна достава низ цела Македонија.`.slice(0, 300)
}

export { fullAddress }
