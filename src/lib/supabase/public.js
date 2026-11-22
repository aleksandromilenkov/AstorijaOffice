import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Cookie-less Supabase client for public, read-only data (products,
 * categories) in Server Components. Unlike `server.js` it does not touch
 * the request cookies, so pages using it can be statically cached and
 * revalidated (ISR) instead of rendering on every request.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  )
}
