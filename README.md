# Асторија — online store

Web store for the Astorija printing house: marketing site, product catalogue,
cart with cash-on-delivery checkout, and an admin panel for products,
categories and orders.

| | |
|---|---|
| Framework | Next.js 16 (App Router, `src/`), React 19, MUI 9 |
| Database & auth | Supabase (Postgres + RLS, email/password admin login) |
| Images | Cloudinary |
| Email | EmailJS (contact form + new-order email to the owner) |
| Hosting | Netlify, auto-deploys from `master` on GitHub |

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

## Pages

| Route | |
|---|---|
| `/prodavnica`, `/prodavnica/[slug]` | Store and product pages |
| `/kosnicka` | Cart + checkout (cart is kept in the browser's localStorage) |
| `/admin/login` | Admin sign-in (new sign-ups are disabled in Supabase) |
| `/admin/products`, `/admin/categories`, `/admin/orders` | Admin panel |

`src/proxy.js` redirects `/admin/*` to the login page when nobody is signed in.
What each user may read or change is enforced by Supabase RLS: only users
listed in the `admins` table can manage products, categories and orders.

## How an order is placed

The cart sends only product ids and quantities to the `placeOrder` Server
Action (`src/app/checkout/actions.js`), which calls the `place_order` Postgres
function. That function validates the customer details, reads prices and stock
from `products`, computes the total and writes `orders` + `order_items` in one
transaction. The browser never decides prices. Then the owner gets an email.

## Database changes (Supabase migrations)

The schema lives in `supabase/migrations/`. Never change tables or policies by
hand in the dashboard — add a migration instead.

```bash
npx supabase migration new <name>     # create an empty migration file
npx supabase start                     # local copy in Docker (needs Docker Desktop)
npx supabase db reset                  # re-apply all migrations to the LOCAL copy
npx supabase db push --db-url "<session pooler connection string>"   # apply to LIVE
```

Use the **Session pooler** connection string from Supabase → Connect.
Never run `db reset` with `--linked`: that wipes the live database.

## Deploy

Push to `master` → Netlify builds and publishes. When a change includes a new
migration, run `db push` **before** pushing the code.
