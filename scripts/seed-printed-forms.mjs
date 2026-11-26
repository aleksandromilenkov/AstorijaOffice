// Seeds the printed-forms catalogue (68 products) into Supabase.
//
//   1. Creates the categories that don't exist yet (matched by slug or name,
//      so the existing "Медицински обрасци" is reused).
//   2. Uploads every product photo to Cloudinary (folder astorija/products,
//      the same folder the admin panel uses).
//   3. Inserts each product, or updates it if a product with the same slug
//      already exists — so the script is safe to run again.
//
// Data:   scripts/seed-data/printed-forms.json
// Photos: SEED_IMAGE_DIR (default C:/Users/Administrator/Desktop/media-sliki/watermark-replaced-with-astorija)
//
// Needs in .env.local (besides what the app already has):
//   SUPABASE_SERVICE_ROLE_KEY=...   (Supabase → Project Settings → API → service_role; server-only, never NEXT_PUBLIC_)
//
// Run from the project root:
//   node scripts/seed-printed-forms.mjs --dry-run   # shows what would happen, uploads/writes nothing
//   node scripts/seed-printed-forms.mjs
//   node scripts/seed-printed-forms.mjs --update     # also overwrite products that already exist

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import { v2 as cloudinary } from 'cloudinary'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
// .env.local first: loadEnvFile never overrides a variable that is already set
for (const f of ['.env.local', '.env']) {
  const p = path.join(ROOT, f)
  if (fs.existsSync(p)) process.loadEnvFile(p)
}

const DRY = process.argv.includes('--dry-run')
// Products that already exist (same slug or title) are left untouched unless --update is passed.
const UPDATE = process.argv.includes('--update')
const IMAGE_DIR = process.env.SEED_IMAGE_DIR || 'C:/Users/Administrator/Desktop/media-sliki/watermark-replaced-with-astorija'
const FOLDER = 'astorija/products'

const env = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  cloud: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
}
const missing = Object.entries({
  NEXT_PUBLIC_SUPABASE_URL: env.url,
  SUPABASE_SERVICE_ROLE_KEY: env.serviceKey,
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: env.cloud,
  CLOUDINARY_API_KEY: env.apiKey,
  CLOUDINARY_API_SECRET: env.apiSecret,
}).filter(([, v]) => !v).map(([k]) => k)
if (missing.length) {
  console.error(`Missing in .env.local: ${missing.join(', ')}`)
  process.exit(1)
}

const supabase = createClient(env.url, env.serviceKey, { auth: { persistSession: false } })
cloudinary.config({ cloud_name: env.cloud, api_key: env.apiKey, api_secret: env.apiSecret, secure: true })

const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/seed-data/printed-forms.json'), 'utf8'))

// Same slug rules as the admin panel (src/app/admin/products/page.js)
function slugify(value = '') {
  return value.toString().trim().toLowerCase()
    .replace(/[\s]+/g, '-')
    .replace(/[^\p{L}\p{N}-]+/gu, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Cyrillic → Latin, for Cloudinary public IDs
const LATIN = { а:'a',б:'b',в:'v',г:'g',д:'d',ѓ:'gj',е:'e',ж:'zh',з:'z',ѕ:'dz',и:'i',ј:'j',к:'k',л:'l',љ:'lj',м:'m',н:'n',њ:'nj',о:'o',п:'p',р:'r',с:'s',т:'t',ќ:'kj',у:'u',ф:'f',х:'h',ц:'c',ч:'ch',џ:'dzh',ш:'sh' }
const latin = (s) => s.toLowerCase().split('').map((c) => LATIN[c] ?? c).join('')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

function fail(error, what) {
  if (error) {
    console.error(`\n✗ ${what}: ${error.message}`)
    process.exit(1)
  }
}

// Fail early on a missing photo, before anything is uploaded or written.
const missingImages = data.products.flatMap((p) => p.images).filter((f) => !fs.existsSync(path.join(IMAGE_DIR, f)))
if (missingImages.length) {
  console.error(`Photos not found in ${IMAGE_DIR}:\n  ${missingImages.join('\n  ')}`)
  process.exit(1)
}

async function seedCategories() {
  const { data: existing, error } = await supabase.from('categories').select('id,slug,name')
  fail(error, 'reading categories')
  const ids = {}
  for (const cat of data.categories) {
    const found = existing.find((c) => c.slug === cat.slug || c.name.trim().toLowerCase() === cat.name.toLowerCase())
    if (found) {
      ids[cat.name] = found.id
      console.log(`  = exists   ${cat.name}`)
      continue
    }
    if (DRY) {
      ids[cat.name] = `(new) ${cat.slug}`
    } else {
      const { data: row, error: insErr } = await supabase.from('categories')
        .insert({ slug: cat.slug, name: cat.name }).select('id').single()
      fail(insErr, `creating category ${cat.name}`)
      ids[cat.name] = row.id
    }
    console.log(`  + created  ${cat.name}  (${cat.slug})`)
  }
  return ids
}

async function upload(file, publicId) {
  if (DRY) return `https://res.cloudinary.com/${env.cloud}/image/upload/${FOLDER}/${publicId}.png`
  // Send the bytes as a data URI: the SDK mis-handles some Cyrillic file paths.
  const dataUri = `data:image/png;base64,${fs.readFileSync(path.join(IMAGE_DIR, file)).toString('base64')}`
  const res = await cloudinary.uploader.upload(dataUri, {
    folder: FOLDER,
    public_id: publicId,
    overwrite: true,
    resource_type: 'image',
  })
  return res.secure_url
}

async function seedProducts(catIds) {
  const { data: existing, error } = await supabase.from('products').select('id,slug,title')
  fail(error, 'reading products')
  let created = 0
  let updated = 0
  let skipped = 0
  for (const [i, p] of data.products.entries()) {
    const slug = slugify(p.title)
    const match = existing.find((e) => e.slug === slug || e.title.trim() === p.title)
    if (match && !UPDATE) {
      skipped++
      console.log(`  = skip   [${i + 1}/${data.products.length}] ${p.title}  (already in the shop; --update to overwrite)`)
      continue
    }
    const images = []
    for (const [k, file] of p.images.entries()) {
      const base = latin(p.title)
      images.push(await upload(file, k === 0 ? base : `${base}-${k + 1}`))
    }
    const row = {
      title: p.title,
      slug,
      description: p.description,
      specs: p.specs,
      price: p.price,
      category_id: catIds[p.category],
      images, // a DB trigger keeps image_url = images[1]
    }
    if (!DRY) {
      if (match) {
        const { error: updErr } = await supabase.from('products').update(row).eq('id', match.id)
        fail(updErr, `updating ${p.title}`)
      } else {
        const { error: insErr } = await supabase.from('products').insert({ ...row, in_stock: true })
        fail(insErr, `creating ${p.title}`)
      }
    }
    match ? updated++ : created++
    console.log(`  ${match ? '~ update' : '+ create'} [${i + 1}/${data.products.length}] ${p.title}  →  ${p.category}  (${p.price} ден.)`)
  }
  return { created, updated, skipped }
}

console.log(DRY ? '\nDRY RUN — nothing is uploaded or written.\n' : '')
console.log('Categories:')
const catIds = await seedCategories()
console.log('\nProducts:')
const { created, updated, skipped } = await seedProducts(catIds)
console.log(`\nDone: ${created} created, ${updated} updated, ${skipped} skipped${DRY ? ' (dry run)' : ''}.`)
