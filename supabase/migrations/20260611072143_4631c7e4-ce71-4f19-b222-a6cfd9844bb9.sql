CREATE TABLE public.freshers_photo_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  friend_slug text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('then','now')),
  image_url text NOT NULL CHECK (char_length(image_url) <= 2048),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.freshers_photo_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.freshers_photo_items TO authenticated;
GRANT ALL ON public.freshers_photo_items TO service_role;

ALTER TABLE public.freshers_photo_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read freshers items"
  ON public.freshers_photo_items FOR SELECT
  USING (true);

CREATE POLICY "anyone insert freshers items"
  ON public.freshers_photo_items FOR INSERT
  WITH CHECK (
    char_length(friend_slug) BETWEEN 1 AND 64
    AND kind IN ('then','now')
    AND char_length(image_url) <= 2048
  );

CREATE POLICY "anyone update freshers items"
  ON public.freshers_photo_items FOR UPDATE
  USING (true)
  WITH CHECK (
    char_length(friend_slug) BETWEEN 1 AND 64
    AND kind IN ('then','now')
    AND char_length(image_url) <= 2048
  );

CREATE POLICY "anyone delete freshers items"
  ON public.freshers_photo_items FOR DELETE
  USING (true);

CREATE INDEX freshers_photo_items_slug_kind_idx
  ON public.freshers_photo_items (friend_slug, kind, sort_order);

-- Backfill from existing single-photo table
INSERT INTO public.freshers_photo_items (friend_slug, kind, image_url, sort_order)
SELECT friend_slug, 'then', image_url, 0
FROM public.freshers_photos
WHERE image_url IS NOT NULL;

INSERT INTO public.freshers_photo_items (friend_slug, kind, image_url, sort_order)
SELECT friend_slug, 'now', final_image_url, 0
FROM public.freshers_photos
WHERE final_image_url IS NOT NULL;