ALTER TABLE public.freshers_photos
  ADD COLUMN IF NOT EXISTS final_image_url text;

ALTER TABLE public.freshers_photos
  ALTER COLUMN image_url DROP NOT NULL;