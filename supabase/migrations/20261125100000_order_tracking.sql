-- =============================================================================
-- Order tracking.
--
-- 1. Statuses that follow the real workflow:
--      received → confirmed → in_production → shipped → delivered
--    (+ cancelled at any point). Old values are converted:
--      pending → received, shipped → shipped, cancelled → cancelled.
-- 2. place_order() now creates orders as 'received'.
-- 3. track_order(code, phone): public lookup for the "Следи нарачка" page.
--    Needs the 8-character order number AND the phone used on the order,
--    and returns only status, dates, products and total (no name/address).
-- =============================================================================

-- ---- 1. statuses ------------------------------------------------------------
alter table public.orders drop constraint orders_status_check;
alter table public.order_status_history drop constraint order_status_history_status_check;

update public.orders set status = 'received' where status = 'pending';
update public.order_status_history set status = 'received' where status = 'pending';

alter table public.orders
  alter column status set default 'received',
  add constraint orders_status_check check (status = any (array[
    'received', 'confirmed', 'in_production', 'shipped', 'delivered', 'cancelled'
  ]));

alter table public.order_status_history
  add constraint order_status_history_status_check check (status = any (array[
    'received', 'confirmed', 'in_production', 'shipped', 'delivered', 'cancelled'
  ]));

-- ---- 2. place_order: new initial status --------------------------------------
-- Same as in 20261124100000_product_promotions.sql except 'pending' → 'received'.
create or replace function public.place_order(
  p_name    text,
  p_phone   text,
  p_city    text,
  p_address text,
  p_items   jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_name     text := btrim(coalesce(p_name, ''));
  v_phone    text := regexp_replace(coalesce(p_phone, ''), '\D', '', 'g');
  v_city     text := btrim(coalesce(p_city, ''));
  v_address  text := btrim(coalesce(p_address, ''));
  v_elem     jsonb;
  v_pid      text;
  v_qty_text text;
  v_qty      integer;
  v_product  record;
  v_lines    jsonb := '[]'::jsonb;
  v_total    integer := 0;
  v_order_id uuid;
begin
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
    if v_pid is null
       or v_pid !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
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

    select p.id, p.title, p.slug, p.in_stock,
           case
             when p.sale_price is not null
                  and (p.sale_ends_at is null or p.sale_ends_at > now())
             then p.sale_price
             else p.price
           end as price
      into v_product
      from public.products p
     where p.id = v_pid::uuid;

    if not found then
      raise exception 'unknown_product';
    end if;
    if not v_product.in_stock then
      raise exception 'out_of_stock:%', v_product.title;
    end if;

    v_total := v_total + v_product.price * v_qty;
    v_lines := v_lines || jsonb_build_object(
      'product_id',   v_product.id,
      'product_name', v_product.title,
      'product_slug', v_product.slug,
      'quantity',     v_qty,
      'unit_price',   v_product.price,
      'line_total',   v_product.price * v_qty
    );
  end loop;

  -- ---- write --------------------------------------------------------------
  insert into public.orders
    (status, total_amount, shipping_name, shipping_phone, shipping_city, shipping_address)
  values
    ('received', v_total, v_name, v_phone, v_city, v_address)
  returning id into v_order_id;

  insert into public.order_items
    (order_id, product_id, product_name, quantity, unit_price, line_total)
  select v_order_id, l.product_id, l.product_name, l.quantity, l.unit_price, l.line_total
    from jsonb_to_recordset(v_lines) as l(
      product_id uuid, product_name text, quantity integer,
      unit_price integer, line_total integer
    );

  return jsonb_build_object(
    'order_id',     v_order_id,
    'total_amount', v_total,
    'lines',        v_lines
  );
end;
$$;

-- ---- 3. track_order ----------------------------------------------------------
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
               'product_name', i.product_name,
               'quantity',     i.quantity,
               'line_total',   i.line_total) order by i.product_name)
        from public.order_items i
       where i.order_id = v_order.id), '[]'::jsonb),
    -- Status changes only; the admin notes stay internal.
    'history', coalesce((
      select jsonb_agg(jsonb_build_object(
               'status',     h.status,
               'created_at', h.created_at) order by h.created_at)
        from public.order_status_history h
       where h.order_id = v_order.id), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.track_order(text, text) from public;
grant execute on function public.track_order(text, text) to anon, authenticated, service_role;
