/**
 * Mock product catalog for the Продавница (Store) experience.
 *
 * Replace this with a Supabase query once the backend is ready — every
 * consumer in `app/prodavnica` should only depend on the shape exported
 * here (id, name, slug, category, price, description, imageUrl, inStock).
 *
 * Prices are stored as integers in Macedonian denars (MKD / ден.).
 * The UI appends the ` ден.` suffix when rendering, so the currency is
 * single-sourced in `src/lib/formatPrice.js`.
 */

export const mockProducts = [
  {
    id: 'p-001',
    name: 'Бизнис Визитки 100гр',
    slug: 'biznis-vizitki-100gr',
    category: 'vizitki',
    price: 450,
    description:
      'Стандардни бизнис визитки на квалитетна 300гр картонска хартија, двострано печатење во полна боја.',
    imageUrl: '/img/products/vizitki.svg',
    inStock: true,
  },
  {
    id: 'p-002',
    name: 'А5 Флаери — 1000 парчиња',
    slug: 'a5-flaeri-1000',
    category: 'flaeri',
    price: 1800,
    description:
      'Флаери во формат А5, глазиран мат 150гр хартија, идеални за промоции, настани и отворања.',
    imageUrl: '/img/products/flaeri.svg',
    inStock: true,
  },
  {
    id: 'p-003',
    name: 'Персонализирана Маица',
    slug: 'personalizirana-maica',
    category: 'maicki',
    price: 590,
    description:
      'Памучна маица 180гр, директно дигитално печатење, достапна во сите стандардни големини.',
    imageUrl: '/img/products/maica.svg',
    inStock: true,
  },
  {
    id: 'p-004',
    name: 'Керамичка Чаша со Печатен Дизајн',
    slug: 'keramicka-chasa',
    category: 'chasi',
    price: 350,
    description:
      'Бела керамичка чаша 330ml, отпорна на миење, со ваш дизајн или лого во полна боја.',
    imageUrl: '/img/products/chasa.svg',
    inStock: true,
  },
  {
    id: 'p-005',
    name: 'А3 Постер Print',
    slug: 'a3-poster-print',
    category: 'posteri',
    price: 280,
    description:
      'А3 постер на сјајна фотохартија 200гр — остар print, живи бои, совршен за рамка на ѕид.',
    imageUrl: '/img/products/poster.svg',
    inStock: true,
  },
  {
    id: 'p-006',
    name: 'Винил Налепници — 50 парчиња',
    slug: 'vinil-nalepnici-50',
    category: 'nalepnici',
    price: 650,
    description:
      'Водоотпорни винил налепници, дијаметар до 8cm, совршени за брендирање, лого или промоции.',
    imageUrl: '/img/products/nalepnica.svg',
    inStock: true,
  },
  {
    id: 'p-007',
    name: 'Плакат Мени за Кафе Бар',
    slug: 'plakat-meni',
    category: 'posteri',
    price: 950,
    description:
      'Готов плакат мени за кафе-бар / ресторан, прилагодлив дизајн, А2 формат, глазиран мат 200гр.',
    imageUrl: '/img/products/meni.svg',
    inStock: false,
  },
  {
    id: 'p-008',
    name: 'Покана за Свадба — Комплект 50',
    slug: 'pokana-svadba-50',
    category: 'pokani',
    price: 2400,
    description:
      'Елегантни покани за свадба, комплет од 50 парчиња, каширана хартија 250гр, златна фолија вклучена.',
    imageUrl: '/img/products/pokana.svg',
    inStock: true,
  },
]