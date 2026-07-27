/**
 * Category taxonomy for the Продавница store.
 *
 * The `key` is what appears in `mockProducts[i].category` and in the
 * `?cat=` query param. The `label` is the user-facing Macedonian name.
 * The "all" entry is the default ("Сите").
 */

export const categories = [
  { key: 'all',      label: 'Сите' },
  { key: 'vizitki',  label: 'Визитки' },
  { key: 'flaeri',   label: 'Флаери' },
  { key: 'maicki',   label: 'Маички' },
  { key: 'chasi',    label: 'Чаши' },
  { key: 'posteri',  label: 'Постери' },
  { key: 'nalepnici',label: 'Налепници' },
  { key: 'pokani',   label: 'Покани' },
]

export const sortOptions = [
  { key: 'newest',    label: 'Најнови' },
  { key: 'price-asc', label: 'Цена: Ниска → Висока' },
  { key: 'price-desc',label: 'Цена: Висока → Ниска' },
]