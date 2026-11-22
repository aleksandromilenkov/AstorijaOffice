// Macedonian date formatting without relying on the browser's locale data
// (many browsers/phones fall back to English for 'mk-MK').

const MONTHS = [
  'јануари', 'февруари', 'март', 'април', 'мај', 'јуни',
  'јули', 'август', 'септември', 'октомври', 'ноември', 'декември',
]
const WEEKDAYS = ['недела', 'понеделник', 'вторник', 'среда', 'четврток', 'петок', 'сабота']

const pad = (n) => String(n).padStart(2, '0')

/** "22 ноември, 18:42" */
export function formatDateTimeMk(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getDate()} ${MONTHS[d.getMonth()]}, ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** "понеделник, 23 ноември" */
export function formatDayMk(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`
}
