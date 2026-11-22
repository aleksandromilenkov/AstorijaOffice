SET local check_function_bodies = off;

CREATE TABLE "public"."admins" (
  "id"         uuid                     NOT NULL,
  "created_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "admins_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."admins"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."categories" (
  "id"         uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "slug"       text                     NOT NULL,
  "name"       text                     NOT NULL,
  "created_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "categories_pkey" PRIMARY KEY (id),
  CONSTRAINT "categories_slug_key" UNIQUE (slug)
);

ALTER TABLE "public"."categories"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."order_items" (
  "id"         uuid    NOT NULL DEFAULT gen_random_uuid(),
  "order_id"   uuid    NOT NULL,
  "product_id" uuid,
  "quantity"   integer NOT NULL,
  "unit_price" integer NOT NULL,
  "line_total" integer NOT NULL,
  CONSTRAINT "order_items_line_total_check" CHECK ((line_total >= 0)),
  CONSTRAINT "order_items_pkey" PRIMARY KEY (id),
  CONSTRAINT "order_items_quantity_check" CHECK ((quantity > 0)),
  CONSTRAINT "order_items_unit_price_check" CHECK ((unit_price >= 0))
);

ALTER TABLE "public"."order_items"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."orders" (
  "id"               uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "status"           text                     NOT NULL DEFAULT 'pending'::text,
  "total_amount"     integer                  NOT NULL,
  "shipping_name"    text                     NOT NULL,
  "shipping_address" text                     NOT NULL,
  "shipping_city"    text                     NOT NULL,
  "shipping_phone"   text                     NOT NULL,
  "notes"            text,
  "created_at"       timestamp with time zone DEFAULT now(),
  "updated_at"       timestamp with time zone DEFAULT now(),
  CONSTRAINT "orders_pkey" PRIMARY KEY (id),
  CONSTRAINT "orders_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'shipped'::text, 'cancelled'::text]))),
  CONSTRAINT "orders_total_amount_check" CHECK ((total_amount >= 0))
);

ALTER TABLE "public"."orders"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."products" (
  "id"          uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "slug"        text                     NOT NULL,
  "title"       text                     NOT NULL,
  "description" text,
  "category_id" uuid,
  "price"       integer                  NOT NULL,
  "image_url"   text,
  "meta"        jsonb                    DEFAULT '{}'::jsonb,
  "created_at"  timestamp with time zone DEFAULT now(),
  "updated_at"  timestamp with time zone DEFAULT now(),
  "in_stock"    boolean                  NOT NULL DEFAULT true,
  CONSTRAINT "products_pkey" PRIMARY KEY (id),
  CONSTRAINT "products_price_check" CHECK ((price >= 0)),
  CONSTRAINT "products_slug_key" UNIQUE (slug)
);

ALTER TABLE "public"."products"
  ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.rls_auto_enable()
  RETURNS event_trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'pg_catalog'
  AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

ALTER TABLE "public"."admins"
  ADD CONSTRAINT "admins_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE "public"."order_items"
  ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;

ALTER TABLE "public"."products"
  ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;

ALTER TABLE "public"."order_items"
  ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;

CREATE INDEX order_items_order_id_idx ON public.order_items USING btree (order_id);

CREATE INDEX products_category_id_idx ON public.products USING btree (category_id);

CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "admin read self" ON "public"."admins"
  FOR SELECT
  TO "authenticated"
  USING ((auth.uid() = id));

CREATE POLICY "admin write categories" ON "public"."categories"
  FOR ALL
  TO "authenticated"
  USING ((auth.uid() IN ( SELECT admins.id
   FROM public.admins)))
  WITH CHECK ((auth.uid() IN ( SELECT admins.id
   FROM public.admins)));

CREATE POLICY "public read categories" ON "public"."categories"
  FOR SELECT
  TO "anon", "authenticated"
  USING (true);

CREATE POLICY "admin read order items" ON "public"."order_items"
  FOR SELECT
  TO "authenticated"
  USING ((auth.uid() IN ( SELECT admins.id
   FROM public.admins)));

CREATE POLICY "anyone can create order items" ON "public"."order_items"
  FOR INSERT
  TO "anon", "authenticated"
  WITH CHECK (true);

CREATE POLICY "Admins can update orders" ON "public"."orders"
  FOR UPDATE
  TO PUBLIC
  USING ((EXISTS ( SELECT 1
   FROM public.admins a
  WHERE (a.id = auth.uid()))))
  WITH CHECK ((EXISTS ( SELECT 1
   FROM public.admins a
  WHERE (a.id = auth.uid()))));

CREATE POLICY "admin delete orders" ON "public"."orders"
  FOR DELETE
  TO "authenticated"
  USING ((auth.uid() IN ( SELECT admins.id
   FROM public.admins)));

CREATE POLICY "admin read orders" ON "public"."orders"
  FOR SELECT
  TO "authenticated"
  USING ((auth.uid() IN ( SELECT admins.id
   FROM public.admins)));

CREATE POLICY "admin update orders" ON "public"."orders"
  FOR UPDATE
  TO "authenticated"
  USING ((auth.uid() IN ( SELECT admins.id
   FROM public.admins)))
  WITH CHECK ((auth.uid() IN ( SELECT admins.id
   FROM public.admins)));

CREATE POLICY "anyone can create an order" ON "public"."orders"
  FOR INSERT
  TO "anon", "authenticated"
  WITH CHECK (true);

CREATE POLICY "admin write products" ON "public"."products"
  FOR ALL
  TO "authenticated"
  USING ((auth.uid() IN ( SELECT admins.id
   FROM public.admins)))
  WITH CHECK ((auth.uid() IN ( SELECT admins.id
   FROM public.admins)));

CREATE POLICY "public read products" ON "public"."products"
  FOR SELECT
  TO "anon", "authenticated"
  USING (true);

CREATE EVENT TRIGGER "ensure_rls"
  ON ddl_command_end
  WHEN TAG IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
  EXECUTE FUNCTION "public"."rls_auto_enable"();

GRANT EXECUTE ON FUNCTION "public"."rls_auto_enable"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."rls_auto_enable"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."rls_auto_enable"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."rls_auto_enable"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."set_updated_at"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."set_updated_at"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."set_updated_at"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."set_updated_at"() TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."admins" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."admins" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."admins" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."admins" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."categories" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."categories" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."categories" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."categories" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."order_items" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."order_items" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."order_items" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."order_items" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."orders" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."orders" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."orders" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."orders" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."products" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."products" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."products" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."products" TO "service_role";

