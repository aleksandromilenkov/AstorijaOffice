-- =============================================================================
-- Order status history: every status change / note an admin saves on an order.
-- Before this, the "Белешка за статусот" field in the admin panel was discarded.
-- =============================================================================

create table public.order_status_history (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders (id) on delete cascade,
  status      text not null
              check (status = any (array['pending', 'shipped', 'cancelled'])),
  note        text check (char_length(note) <= 1000),
  created_by  uuid default auth.uid() references auth.users (id) on delete set null,
  created_at  timestamptz not null default now()
);

create index order_status_history_order_id_idx
  on public.order_status_history using btree (order_id);

alter table public.order_status_history enable row level security;

create policy "admin read order status history"
  on public.order_status_history
  for select
  to authenticated
  using ((select auth.uid()) in (select admins.id from public.admins));

create policy "admin add order status history"
  on public.order_status_history
  for insert
  to authenticated
  with check ((select auth.uid()) in (select admins.id from public.admins));
