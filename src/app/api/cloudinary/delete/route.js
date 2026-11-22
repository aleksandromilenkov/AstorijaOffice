import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { createClient } from '@/lib/supabase/server'
import { cloudinaryPublicId, PRODUCT_IMAGE_FOLDER } from '@/lib/cloudinary'

/**
 * POST /api/cloudinary/delete   body: { imageUrl }
 *
 * Deletes a product image from Cloudinary. Only for logged-in admins
 * (a row in `admins`), and only for images in the product folder, so the
 * route cannot be used to wipe anything else in the Cloudinary account.
 */
export async function POST(request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  }
  // RLS on `admins` lets a user read only their own row.
  const { data: adminRow } = await supabase
    .from('admins')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()
  if (!adminRow) {
    return NextResponse.json({ error: 'Admins only' }, { status: 403 })
  }

  let imageUrl
  try {
    ;({ imageUrl } = await request.json())
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: 'Cloudinary credentials not configured' }, { status: 500 })
  }

  const publicId = typeof imageUrl === 'string' ? cloudinaryPublicId(imageUrl, cloudName) : null
  if (!publicId || !publicId.startsWith(`${PRODUCT_IMAGE_FOLDER}/`)) {
    return NextResponse.json({ error: 'Not a product image on this Cloudinary account' }, { status: 400 })
  }

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true })
  try {
    const result = await cloudinary.uploader.destroy(publicId, { invalidate: true })
    // result.result is 'ok' or 'not found' (already gone) — both are fine.
    return NextResponse.json({ success: true, result: result?.result ?? null })
  } catch (err) {
    console.error('Cloudinary delete failed', publicId, err)
    return NextResponse.json({ error: 'Cloudinary delete failed' }, { status: 502 })
  }
}
