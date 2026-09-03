// Cloudinary unsigned upload helper. Uploads directly from the browser using
// a public upload preset. The Cloudinary cloud name and the upload preset
// name must be configured via environment variables.
//
// Required env vars:
//   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME      e.g. "astorija"
//   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET   e.g. "astorija_products"
//
// The upload preset must allow unsigned uploads in the Cloudinary console
// (Settings -> Upload -> Upload presets -> Signing Mode = "Unsigned").
//
// The returned object mirrors a small subset of Cloudinary's response so the
// caller can persist the URL and other metadata in Supabase.

export async function uploadImageToCloudinary(file, { folder } = {}) {
  if (!file) {
    throw new Error('Не е избрана слика за прикачување.')
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error(
      'Cloudinary не е конфигуриран. Поставете NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME и NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.',
    )
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  if (folder) {
    formData.append('folder', folder)
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
  const response = await fetch(endpoint, { method: 'POST', body: formData })

  if (!response.ok) {
    let message = `Cloudinary upload failed (${response.status})`
    try {
      const data = await response.json()
      if (data?.error?.message) message = data.error.message
    } catch {
      // ignore JSON parse errors and keep the generic message
    }
    throw new Error(message)
  }

  const data = await response.json()

  return {
    url: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
    format: data.format,
    resourceType: data.resource_type,
  }
}

/**
 * Delete an image from Cloudinary using its full URL.
 * The function extracts the public ID from the URL and calls the Cloudinary
 * Admin API. It requires server‑side environment variables:
 *   CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, and NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME.
 */
export async function deleteImageFromCloudinary(imageUrl) {
  if (!imageUrl) return

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  if (!cloudName || !apiKey || !apiSecret) {
    console.warn('Cloudinary delete not configured – missing environment variables')
    return
  }

  // Extract public ID: part after '/upload/' and before file extension
  const uploadSegment = '/upload/'
  const idx = imageUrl.indexOf(uploadSegment)
  if (idx === -1) {
    console.warn('Unable to parse Cloudinary public ID from URL')
    return
  }
  const path = imageUrl.substring(idx + uploadSegment.length)
  const publicId = path.replace(/\.[^/.]+$/, '') // strip extension

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload/${publicId}`
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
  const response = await fetch(endpoint, {
    method: 'DELETE',
    headers: {
      Authorization: `Basic ${auth}`,
    },
  })
  if (!response.ok) {
    const text = await response.text()
    console.error('Failed to delete Cloudinary image', response.status, text)
  }
}