import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Build a Supabase client bound to the current request's cookies.
 *
 * Call this from Server Components, Server Actions, or Route Handlers:
 *
 *   const supabase = await createClient();
 *
 * Next.js 16 exposes `cookies()` as a Promise, so we `await` it before
 * passing it to `createServerClient`. The `setAll` callback is wrapped
 * in a `try/catch` so it's safe to call from a Server Component —
 * Supabase documents that you only need cookie writes to happen from
 * middleware or a Route Handler.
 */
export const createClient = async () => {
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
};