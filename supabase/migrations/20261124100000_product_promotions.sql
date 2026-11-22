-- =============================================================================
-- Promotions: a product can have a temporary promo price.
--
--   price          regular price (shown crossed out while a promo is active)
--   sale_price     promo price; NULL = no promotion
--   sale_ends_at   when the promo stops; NULL = until removed by hand
--
-- A promo is active when sale_price is set and sale_ends_at is NULL or in the
-- future. place_order() charges the promo price while it is active, so the
-- price customers see is the price they pay, and expired promos stop on time
-- without anyone touching the data.
-- =============================================================================

alter table public.products
  add column sale_price   integer,
  add column sale_ends_at timestamptz,
  add constraint products_sale_price_check
    check (sale_price is null or (sale_price >= 0 and sale_price < price));

create index products_on_sale_idx
  on public.products using btree (sale_ends_at)
  where sale_price is not null;

-- Same function as in 20261122150000_place_order_rpc.sql; only the price
-- lookup changed to use the active promo price.
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

-- -----------------------------------------------------------------------------
-- Launch promotions. Change or stop them later in the admin panel by editing
-- or clearing "Промо цена" on the product.
-- -----------------------------------------------------------------------------
update public.products
   set sale_price = 359, sale_ends_at = '2026-12-31 23:59:59+01'
 where slug = 'biznis-vizitki-100gr' and price = 450;

update public.products
   set sale_price = 29, sale_ends_at = '2026-12-31 23:59:59+01'
 where slug = 'rozevi-recepti' and price = 39;
