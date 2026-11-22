-- =============================================================================
-- Product specifications, quantity options ("variants") and terms acceptance.
--
-- products.specs           short spec lines ("100 листа", "Хартија 80 g/m2")
-- product_variants         optional print-run options with their own price
--                          ("100 парчиња" 190 ден., "500 парчиња" 690 ден.).
--                          For a product with options, products.price holds
--                          the lowest option price ("од 190 ден.").
-- Promotions on a product with options: the product's promo discount
--   (sale_price vs price) applies as the same percentage to every option.
-- orders.terms_accepted_at when the customer ticked "accept the terms".
-- =============================================================================

alter table public.products
  add column specs text[] not null default '{}';

create table public.product_variants (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products (id) on delete cascade,
  label       text not null check (char_length(label) between 1 and 60),
  price       integer not null check (price >= 0),
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create index product_variants_product_id_idx
  on public.product_variants using btree (product_id, sort_order);

alter table public.product_variants enable row level security;

create policy "public read product variants"
  on public.product_variants
  for select
  to anon, authenticated
  using (true);

create policy "admin write product variants"
  on public.product_variants
  for all
  to authenticated
  using ((select auth.uid()) in (select admins.id from public.admins))
  with check ((select auth.uid()) in (select admins.id from public.admins));

alter table public.order_items
  add column variant_id    uuid references public.product_variants (id) on delete set null,
  add column variant_label text;

alter table public.orders
  add column terms_accepted_at timestamptz;

-- -----------------------------------------------------------------------------
-- place_order: + chosen option per line, + terms acceptance (required).
-- Replaces the 5-argument version.
-- -----------------------------------------------------------------------------
drop function if exists public.place_order(text, text, text, text, jsonb);

create function public.place_order(
  p_name           text,
  p_phone          text,
  p_city           text,
  p_address        text,
  p_items          jsonb,
  p_terms_accepted boolean
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uuid_re   constant text := '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
  v_name      text := btrim(coalesce(p_name, ''));
  v_phone     text := regexp_replace(coalesce(p_phone, ''), '\D', '', 'g');
  v_city      text := btrim(coalesce(p_city, ''));
  v_address   text := btrim(coalesce(p_address, ''));
  v_elem      jsonb;
  v_pid       text;
  v_vid       text;
  v_qty_text  text;
  v_qty       integer;
  v_product   record;
  v_variant   record;
  v_on_sale   boolean;
  v_has_vars  boolean;
  v_unit      integer;
  v_label     text;
  v_lines     jsonb := '[]'::jsonb;
  v_total     integer := 0;
  v_order_id  uuid;
begin
  if p_terms_accepted is distinct from true then
    raise exception 'terms_not_accepted';
  end if;

  -- ---- customer -----------------------------------------------------------
  if char_length(v_name) < 2 or char_length(v_name) > 100 then
    raise exception 'invalid_name';
  end if;
  if v_phone !~ '^07[0-9]{7}$' then
    raise exception 'invalid_phone';
  end if;
  if char_length(v_city) < 2 or char_length(v_city) > 60 then
    raise exception 'invalid_city';
  end if;
  if char_length(v_address) > 300 then
    raise exception 'invalid_address';
  end if;

  -- ---- items --------------------------------------------------------------
  if p_items is null
     or jsonb_typeof(p_items) <> 'array'
     or jsonb_array_length(p_items) = 0 then
    raise exception 'empty_cart';
  end if;
  if jsonb_array_length(p_items) > 50 then
    raise exception 'too_many_items';
  end if;

  for v_elem in select value from jsonb_array_elements(p_items)
  loop
    v_pid := v_elem ->> 'product_id';
    if v_pid is null or v_pid !~* v_uuid_re then
      raise exception 'unknown_product';
    end if;

    v_qty_text := v_elem ->> 'quantity';
    if v_qty_text is null or v_qty_text !~ '^[0-9]{1,4}$' then
      raise exception 'invalid_quantity';
    end if;
    v_qty := v_qty_text::integer;
    if v_qty < 1 or v_qty > 1000 then
      raise exception 'invalid_quantity';
    end if;

    select p.id, p.title, p.slug, p.in_stock, p.price, p.sale_price,
           (p.sale_price is not null
             and (p.sale_ends_at is null or p.sale_ends_at > now())) as on_sale
      into v_product
      from public.products p
     where p.id = v_pid::uuid;

    if not found then
      raise exception 'unknown_product';
    end if;
    if not v_product.in_stock then
      raise exception 'out_of_stock:%', v_product.title;
    end if;
    v_on_sale := v_product.on_sale;

    select exists (select 1 from public.product_variants pv where pv.product_id = v_product.id)
      into v_has_vars;

    v_vid := v_elem ->> 'variant_id';
    v_label := null;

    if v_has_vars then
      if v_vid is null or v_vid !~* v_uuid_re then
        raise exception 'variant_required:%', v_product.title;
      end if;
      select pv.id, pv.label, pv.price into v_variant
        from public.product_variants pv
       where pv.id = v_vid::uuid and pv.product_id = v_product.id;
      if not found then
        raise exception 'variant_required:%', v_product.title;
      end if;
      v_label := v_variant.label;
      v_unit := case
        when v_on_sale and v_product.price > 0
          then round(v_variant.price::numeric * v_product.sale_price / v_product.price)::integer
        else v_variant.price
      end;
    else
      v_vid := null;
      v_unit := case when v_on_sale then v_product.sale_price else v_product.price end;
    end if;

    v_total := v_total + v_unit * v_qty;
    v_lines := v_lines || jsonb_build_object(
      'product_id',    v_product.id,
      'product_name',  v_product.title,
      'product_slug',  v_product.slug,
      'variant_id',    v_vid,
      'variant_label', v_label,
      'quantity',      v_qty,
      'unit_price',    v_unit,
      'line_total',    v_unit * v_qty
    );
  end loop;

  -- ---- write --------------------------------------------------------------
  insert into public.orders
    (status, total_amount, shipping_name, shipping_phone, shipping_city,
     shipping_address, terms_accepted_at)
  values
    ('received', v_total, v_name, v_phone, v_city, v_address, now())
  returning id into v_order_id;

  insert into public.order_items
    (order_id, product_id, product_name, variant_id, variant_label,
     quantity, unit_price, line_total)
  select v_order_id, l.product_id, l.product_name, l.variant_id, l.variant_label,
         l.quantity, l.unit_price, l.line_total
    from jsonb_to_recordset(v_lines) as l(
      product_id uuid, product_name text, variant_id uuid, variant_label text,
      quantity integer, unit_price integer, line_total integer
    );

  return jsonb_build_object(
    'order_id',     v_order_id,
    'total_amount', v_total,
    'lines',        v_lines
  );
end;
$$;

revoke all on function public.place_order(text, text, text, text, jsonb, boolean) from public;
grant execute on function public.place_order(text, text, text, text, jsonb, boolean)
  to anon, authenticated, service_role;

-- -----------------------------------------------------------------------------
-- track_order: include the chosen option in the item list.
-- -----------------------------------------------------------------------------
create or replace function public.track_order(p_code text, p_phone text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_code  text := lower(regexp_replace(coalesce(p_code, ''), '[^0-9a-fA-F]', '', 'g'));
  v_phone text := regexp_replace(coalesce(p_phone, ''), '\D', '', 'g');
  v_order public.orders;
begin
  if char_length(v_code) <> 8 or v_phone !~ '^07[0-9]{7}$' then
    return null;
  end if;

  select o.* into v_order
    from public.orders o
   where left(o.id::text, 8) = v_code
     and regexp_replace(o.shipping_phone, '\D', '', 'g') = v_phone
   limit 1;

  if not found then
    return null;
  end if;

  return jsonb_build_object(
    'code',         upper(v_code),
    'status',       v_order.status,
    'created_at',   v_order.created_at,
    'updated_at',   v_order.updated_at,
    'total_amount', v_order.total_amount,
    'city',         v_order.shipping_city,
    'items', coalesce((
      select jsonb_agg(jsonb_build_object(
               'product_name',  i.product_name,
               'variant_label', i.variant_label,
               'quantity',      i.quantity,
               'line_total',    i.line_total) order by i.product_name)
        from public.order_items i
       where i.order_id = v_order.id), '[]'::jsonb),
    'history', coalesce((
      select jsonb_agg(jsonb_build_object(
               'status',     h.status,
               'created_at', h.created_at) order by h.created_at)
        from public.order_status_history h
       where h.order_id = v_order.id), '[]'::jsonb)
  );
end;
$$;
