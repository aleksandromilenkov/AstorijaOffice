import { NextResponse } from 'next/server';

/**
 * DELETE an image from Cloudinary.
 * This runs on the server (App Router API route), so the private API key
 * and secret can be used safely.
 *
 * Expected payload (JSON): { "imageUrl": "https://res.cloudinary.com/.../upload/v123/.../name.jpg" }
 */
export async function POST(request) {
  try {
    const { imageUrl } = await request.json();
    if (!imageUrl) {
      return NextResponse.json({ error: 'Missing imageUrl' }, { status: 400 });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: 'Cloudinary credentials not configured' }, { status: 500 });
    }

    // Extract the public ID from the URL (after '/upload/' and before extension)
    const uploadSegment = '/upload/';
    const idx = imageUrl.indexOf(uploadSegment);
    if (idx === -1) {
      return NextResponse.json({ error: 'Unable to parse Cloudinary URL' }, { status: 400 });
    }
    const path = imageUrl.substring(idx + uploadSegment.length);
    const publicId = path.replace(/\.[^/.]+$/, ''); // strip file extension

    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload/${publicId}`;
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
    const resp = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json({ error: `Cloudinary delete failed ${resp.status}`, details: text }, { status: resp.status });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    //console.error('Cloudinary delete API error', err);
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}
