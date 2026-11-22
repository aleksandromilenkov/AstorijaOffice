-- =============================================================================
-- Checkout via a single, validated database function.
--
-- Before: the website inserted into `orders` directly with prices/total sent
-- by the browser, then read the row back. Logged-out customers are not allowed
-- to read orders, so every real checkout failed with an RLS error.
--
-- After: the website calls `place_order(...)`. The function runs with the
-- table owner's rights, validates the input, takes prices from `products`,
-- computes the total itself and writes `orders` + `order_items` in one
-- transaction. Direct inserts by the public are no longer allowed.
-- =============================================================================

-- Keep the product name on the order line, so old orders still read correctly
-- after a product is renamed or deleted. The table is empty, so NOT NULL is safe.
alter table public.order_items
  add column product_name text not null;

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

    select p.id, p.title, p.slug, p.price, p.in_stock
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
    ('pending', v_total, v_name, v_phone, v_city, v_address)
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

revoke all on function public.place_order(text, text, text, text, jsonb) from public;
grant execute on function public.place_order(text, text, text, text, jsonb)
  to anon, authenticated, service_role;

-- Orders can now only be created through place_order().
drop policy if exists "anyone can create an order" on public.orders;
drop policy if exists "anyone can create order items" on public.order_items;

-- Duplicate of "admin update orders".
drop policy if exists "Admins can update orders" on public.orders;
