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

/**
 * "22 ноември 2026, 18:42" in Macedonian time (Europe/Skopje), whatever the
 * time zone of the machine. Gives the same text on the server (UTC on
 * Netlify) and in the browser, so server-rendered pages hydrate cleanly.
 */
export function formatDateTimeSkopje(iso) {
  if (!iso) return ''
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Skopje',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(new Date(iso))
      .map((p) => [p.type, p.value]),
  )
  return `${Number(parts.day)} ${MONTHS[Number(parts.month) - 1]} ${parts.year}, ${parts.hour}:${parts.minute}`
}
