// Macedonian Cyrillic → Latin, lower-cased. Lets customers search
// "vizitki" and find "Визитки".
const CYRILLIC_TO_LATIN = {
  'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Ѓ': 'Gj', 'Е': 'E', 'Ж': 'Z', 'З': 'Z', 'Ѕ': 'Dz',
  'И': 'I', 'Ј': 'J', 'К': 'K', 'Л': 'L', 'Љ': 'Lj', 'М': 'M', 'Н': 'N', 'Њ': 'Nj', 'О': 'O', 'П': 'P',
  'Р': 'R', 'С': 'S', 'Т': 'T', 'Ќ': 'Kj', 'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'C', 'Ч': 'Ch', 'Џ': 'Dz', 'Ш': 'S',
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'ѓ': 'gj', 'е': 'e', 'ж': 'z', 'з': 'z', 'ѕ': 'dz',
  'и': 'i', 'ј': 'j', 'к': 'k', 'л': 'l', 'љ': 'lj', 'м': 'm', 'н': 'n', 'њ': 'nj', 'о': 'o', 'п': 'p',
  'р': 'r', 'с': 's', 'т': 't', 'ќ': 'kj', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'џ': 'dz', 'ш': 's',
}

export function transliterate(text) {
  if (!text) return ''
  return Array.from(text, (char) => CYRILLIC_TO_LATIN[char] ?? char).join('').toLowerCase()
}
