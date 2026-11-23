-- =============================================================================
-- Several photos per product (front, back, details).
--
-- products.images   ordered list of photo URLs, at most 8. images[1] is the
--                   main photo. products.image_url is kept equal to images[1]
--                   so everything that shows one photo (cards, cart, promos,
--                   share previews, order emails) keeps working unchanged.
-- =============================================================================

alter table public.products
  add column images text[] not null default '{}',
  add constraint products_images_max check (cardinality(images) <= 8);

-- Existing products: their current photo becomes photo #1.
update public.products
   set images = array[image_url]
 where image_url is not null
   and btrim(image_url) <> '';

-- Keep image_url in sync with the first photo on every write.
create or replace function public.sync_product_main_image()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    if cardinality(new.images) = 0 and new.image_url is not null and btrim(new.image_url) <> '' then
      new.images := array[new.image_url];           -- inserted the old way
    end if;
  elsif new.images is distinct from old.images then
    null;                                           -- images changed: they win
  elsif new.image_url is distinct from old.image_url then
    -- updated the old way (only image_url): make it the main photo
    new.images := case
      when new.image_url is null or btrim(new.image_url) = '' then '{}'::text[]
      else array[new.image_url] || array_remove(new.images[2:], new.image_url)
    end;
  end if;
  new.image_url := case when cardinality(new.images) > 0 then new.images[1] else null end;
  return new;
end;
$$;

create trigger products_sync_main_image
  before insert or update on public.products
  for each row execute function public.sync_product_main_image();
