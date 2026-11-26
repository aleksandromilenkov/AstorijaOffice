import { absoluteUrl, siteOrigin } from '@/lib/seo'

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Private or per-visitor pages: nothing for search engines there.
        disallow: ['/admin', '/api/', '/kosnicka', '/checkout'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: siteOrigin,
  }
}
