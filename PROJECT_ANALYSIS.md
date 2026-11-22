# Astorija web store — project analysis (2026-11-22)

State of `master` @ `68e5969` plus the uncommitted Latin-search change in `ProdavnicaClient.jsx`.

## Stack

| Layer | What |
|---|---|
| Framework | Next.js **16.2** (App Router, `src/`), React 19.2, plain JS (no TypeScript) |
| UI | MUI 9 + Emotion, framer-motion, Inter font (latin + cyrillic). All UI text in Macedonian |
| Data / auth | Supabase (`@supabase/ssr` + `supabase-js`), project `astorijashop` (free tier) |
| Images | Cloudinary — unsigned browser upload, server-side delete via API secret |
| Email | EmailJS — contact form (browser) and new-order email to owner (server, REST) |
| Hosting | Netlify (`@netlify/plugin-nextjs`), deployed from GitHub |

## Routes

| Route | Type | Purpose |
|---|---|---|
| `/` `/about` `/contact` | public | Marketing site (Hero, Services, Gallery, Stats, Contact form …) |
| `/prodavnica` | public, client fetch | Store: Supabase products + categories, search (Cyrillic + Latin), category filter, sort |
| `/prodavnica/[slug]` | public, server fetch | Product detail + zoom |
| `/kosnicka` | public | Cart (localStorage `astorija.cart.v1`) + checkout form |
| `/admin/login` | public | Email + password sign-in |
| `/admin` `/admin/categories` `/admin/products` | protected | CRUD (client-side Supabase calls) |
| `/admin/orders` `/admin/orders/[id]` | protected | Order list (last 200), detail, change status |
| `POST /api/cloudinary/delete` | API | Delete image by URL |
| `POST /api/orders/notify` | API | Order email (now **unused** — checkout sends email inline) |

## Database (exact schema: `supabase/migrations/20261122133859_remote_schema.sql`)

Pulled from production with `supabase db pull` and recorded as applied in the remote migration history. Every future DB change = a new file in `supabase/migrations/`.

`admins`, `categories`, `products`, `orders`, `order_items` — all with RLS on (plus an `ensure_rls` event trigger that auto-enables RLS on new public tables).
Prices are integers in MKD with `>= 0` checks. `orders.status` is constrained to `pending | shipped | cancelled`. Slugs are UNIQUE. `products.category_id` → `ON DELETE SET NULL`. `updated_at` maintained by `set_updated_at()` triggers on products and orders.

`order_items` columns: `id, order_id (cascade), product_id (set null), quantity > 0, unit_price, line_total` — no `product_name` snapshot column.

### RLS policies (real)

| Table | anon | authenticated non-admin | admin (row in `admins`) |
|---|---|---|---|
| categories, products | SELECT | SELECT | ALL |
| orders | INSERT only | INSERT only | SELECT, UPDATE, DELETE |
| order_items | INSERT only | INSERT only | SELECT |
| admins | — | read own row | read own row |

Data right now: 10 categories (incl. test `op`, `nova`), 10 products (incl. test `asdasd`), 9 test orders, 0 order_items, 1 admin.

## Auth — how it actually works

1. `/admin/login` calls `supabase.auth.signInWithPassword` in the browser; the session is kept in cookies by `@supabase/ssr`.
2. `src/middleware.js` (matcher `/admin/:path*`) calls `auth.getUser()`; no user → redirect to login, logged-in on login page → redirect to `/admin`.
3. **Admin check in the app is "is anyone logged in", not "is this user in `admins`".** The app never reads `admins`, **but every RLS policy does** — so a logged-in non-admin can open the `/admin` pages but sees no orders and cannot change products/categories.
4. Real protection of data = Supabase RLS. Admin pages call Supabase directly from the browser with the publishable key + user's JWT.
5. No logout button anywhere. No customer accounts (guest checkout only).

## Order flow

Cart (localStorage) → `placeOrder` Server Action (`src/app/checkout/actions.js`):
1. validates name/phone/city (phone `07XXXXXXX`, city from list of 80 municipalities — client side only)
2. `insert` into `orders` with `total_amount` **as sent by the browser**
3. `update orders.notes = JSON.stringify(lineItems)` — line items live in `notes`, not in `order_items`
4. sends owner email via EmailJS REST; email failure doesn't fail the order
5. Payment: cash on delivery, shipping free (`shipping = 0` hard-coded)

## Problems found (ordered by importance)

> **Fixed on 2026-11-22** (migration `20261122150000_place_order_rpc.sql` + code): #0, #1, #4b, #4c, #6, #7, #8, no logout button. Checkout now calls the `place_order` DB function (server-side prices, validation, writes `orders` + `order_items`); direct public inserts removed; sample products removed; admin pages read `order_items` (old orders fall back to `notes`). Tested against a local Supabase copy.
>
> **Fixed on 2026-11-23** (migration `20261123100000_order_status_history.sql` + code): #2 Cloudinary delete (admin-only, product folder only, correct public ID, image deleted only after the DB row), #9, #10 (status history), #11 (`proxy.js`, dead middleware removed), #12, #13 (+ share metadata), #14, #17 (README, `.env.example`). Also: broken product images now show a placeholder, cart refreshes prices/stock from the DB, customers no longer see email errors, Cyrillic product slugs no longer 404. Not done: #4 (admin UI gate — accepted, sign-ups are off), #16, #18, #19.

### 0. Checkout almost certainly fails for real (logged-out) customers
`placeOrder` runs as the visitor. Anon may only INSERT into `orders`, but the code does `.insert(...).select('id')` — returning the row needs a SELECT policy, so Postgres rejects it with "new row violates row-level security policy". The follow-up `update notes` would also do nothing for anon (no UPDATE policy). All 9 existing orders have `notes` filled → they were all placed while logged in as admin in the same browser. **Verify: place an order from an incognito window.**

### Security
1. **Prices/totals are trusted from the browser.** Anyone can edit localStorage or call the server action and order at 1 ден. Server must re-read prices from `products`.
2. **`/api/cloudinary/delete` has no auth** — anyone can delete any image in your Cloudinary account by POSTing its URL.
3. ~~Orders readable by anyone~~ — **checked, not true.** Only admins can read/update/delete orders. Customer data is safe.
4. The `/admin` UI opens for any logged-in user (data is still protected by RLS). Turn off "Allow new users to sign up" in Supabase Auth settings and make the app check `admins` too.
4b. Anyone can insert junk rows into `orders` / `order_items` directly with the public key (spam risk; no rate limit or validation in DB beyond `>= 0` checks).
4c. Duplicate UPDATE policy on `orders` ("Admins can update orders" and "admin update orders") — harmless, can be cleaned.
5. Server-side validation is minimal (no length limits, phone/city only checked in browser).

### Bugs / correctness
6. **Mock products are mixed into the real store** (`mockProducts.js`, 8 items, ids `p-001…`). Customers can add and order them; `product_id` gets `'p-001'`.
7. Out-of-stock not enforced at checkout (only buttons disabled in UI; old carts still order).
8. `order_items` table exists but is never used; code comment says it doesn't exist.
9. Cloudinary delete parses the public ID wrongly (keeps the `v123456/` version segment) → deletes likely fail silently and images pile up.
10. Order status "note" field in admin is collected but thrown away.
11. Two middleware files: root `middleware.js` is ignored (project uses `src/`), and `src/lib/supabase/middleware.js` is dead code. Next 16 deprecated `middleware` → should be renamed to `proxy.js`.
12. `/api/orders/notify` is dead code duplicating checkout email logic.
13. Product detail `<title>` shows the slug, not the product title.
14. Small: `notifyWarning` alert is rendered inside a `<Typography>` (invalid nesting); `formatMoney` duplicated; `cyrillicToLatin` duplicated in two files.

### Operations
15. ~~Schema isn't in the repo~~ — done: `supabase/migrations/20261122133859_remote_schema.sql`.
16. Supabase free tier pauses after ~1 week without activity — a real shop needs either traffic or the Pro plan / a keep-alive.
17. README is still the Next.js template; `.env.example` doesn't list the Supabase vars; `.env` contains old `VITE_*` keys.
18. Customer gets no confirmation email (no customer email field at all).
19. Netlify free + `.mk`/`.com.mk` domain: needs `NEXT_PUBLIC_SITE_ORIGIN` updated and Supabase Auth "Site URL" set to the new domain.
