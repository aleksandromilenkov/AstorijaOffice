// Macedonian Cyrillic → Latin, lower-cased. Lets customers search
// "vizitki" and find "Визитки".
const CYRILLIC_TO_LATIN = {
  'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Ѓ': 'Gj', 'Е': 'E', 'Ж': 'Zh', 'З': 'Z', 'Ѕ': 'Dz',
  'И': 'I', 'Ј': 'J', 'К': 'K', 'Л': 'L', 'Љ': 'Lj', 'М': 'M', 'Н': 'N', 'Њ': 'Nj', 'О': 'O', 'П': 'P',
  'Р': 'R', 'С': 'S', 'Т': 'T', 'Ќ': 'Kj', 'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'C', 'Ч': 'Ch', 'Џ': 'Dzh', 'Ш': 'Sh',
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'ѓ': 'gj', 'е': 'e', 'ж': 'zh', 'з': 'z', 'ѕ': 'dz',
  'и': 'i', 'ј': 'j', 'к': 'k', 'л': 'l', 'љ': 'lj', 'м': 'm', 'н': 'n', 'њ': 'nj', 'о': 'o', 'п': 'p',
  'р': 'r', 'с': 's', 'т': 't', 'ќ': 'kj', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'џ': 'dzh', 'ш': 'sh',
}

export function transliterate(text) {
  if (!text) return ''
  return Array.from(text, (char) => CYRILLIC_TO_LATIN[char] ?? char).join('').toLowerCase()
}

/**
 * Comparable search form of any text (Cyrillic or Latin): transliterated,
 * lower-cased, and with the usual Latin spellings collapsed so "shtip",
 * "stip", "štip" and "Штип" all match. Same for zh/z, ch/c, kj/k, gj/g.
 */
export function searchKey(text) {
  return transliterate(text)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // š → s, č → c, ž → z
    .replace(/dzh/g, 'dz')
    .replace(/sh/g, 's')
    .replace(/zh/g, 'z')
    .replace(/ch/g, 'c')
    .replace(/kj/g, 'k')
    .replace(/gj/g, 'g')
}

/** Does `text` contain `query`, ignoring alphabet and spelling variants? */
export function matchesSearch(text, query) {
  const q = searchKey(String(query ?? '').trim())
  if (!q) return true
  return searchKey(String(text ?? '')).includes(q)
}
