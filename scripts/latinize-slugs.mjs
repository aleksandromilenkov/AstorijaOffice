// Converts Cyrillic product and category slugs to Latin:
//   фактура-а5          → faktura-a5
//   медицински-обрасци  → medicinski-obrasci
//
// Slugs that are already Latin are left alone. The new slug is latinSlug(old slug),
// the same rule the site uses to redirect old Cyrillic links, so every old
// address keeps working (308 redirect to the new one).
//
// IMPORTANT: deploy the site with the redirect code FIRST, then run this.
// Otherwise old links 404 until the deploy.
//
// Needs SUPABASE_SERVICE_ROLE_KEY in .env.local. From the project root:
//   node scripts/latinize-slugs.mjs            # shows what would change (writes nothing)
//   node scripts/latinize-slugs.mjs --apply    # changes the slugs

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
for (const f of ['.env.local', '.env']) {
  const p = path.join(ROOT, f)
  if (fs.existsSync(p)) process.loadEnvFile(p)
}
const { latinSlug } = await import(new URL('../src/lib/transliterate.js', import.meta.url))

const APPLY = process.argv.includes('--apply')
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}
const supabase = createClient(url, key, { auth: { persistSession: false } })
const isCyrillic = (s) => /[Ѐ-ӿ]/.test(s)

async function latinize(table, label) {
  const { data: rows, error } = await supabase.from(table).select(`id,slug,${label}`)
  if (error) throw new Error(`${table}: ${error.message}`)

  const taken = new Set(rows.map((r) => r.slug))
  const plan = []
  for (const r of rows.filter((r) => isCyrillic(r.slug))) {
    const next = latinSlug(r.slug)
    if (!next) {
      console.log(`  ! ${table}: "${r.slug}" gives an empty Latin slug — skipped`)
    } else if (taken.has(next)) {
      console.log(`  ! ${table}: "${r.slug}" → "${next}" is already used by another row — skipped`)
    } else {
      taken.add(next)
      plan.push({ id: r.id, from: r.slug, to: next, name: r[label] })
    }
  }

  console.log(`\n${table}: ${plan.length} to change (${rows.length - plan.length} already Latin or skipped)`)
  for (const p of plan) console.log(`  ${p.from}  →  ${p.to}`)

  if (APPLY) {
    for (const p of plan) {
      const { error: updErr } = await supabase.from(table).update({ slug: p.to }).eq('id', p.id)
      if (updErr) throw new Error(`${table} "${p.from}": ${updErr.message}`)
    }
    console.log(`  ✓ ${plan.length} ${table} updated`)
  }
  return plan.length
}

console.log(APPLY ? 'Changing slugs…' : 'DRY RUN — nothing is written. Add --apply to change the slugs.')
await latinize('categories', 'name')
await latinize('products', 'title')
console.log(APPLY ? '\nDone.' : '\nDry run finished.')
