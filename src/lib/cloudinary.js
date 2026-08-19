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