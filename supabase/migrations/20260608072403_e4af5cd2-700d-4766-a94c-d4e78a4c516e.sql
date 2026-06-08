CREATE TABLE public.freshers_photos (
  friend_slug text NOT NULL PRIMARY KEY,
  image_url text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.freshers_photos TO anon, authenticated;
GRANT ALL ON public.freshers_photos TO service_role;

ALTER TABLE public.freshers_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view freshers photos" ON public.freshers_photos FOR SELECT USING (true);
CREATE POLICY "Anyone can insert freshers photos" ON public.freshers_photos FOR INSERT WITH CHECK (char_length(friend_slug) > 0 AND char_length(friend_slug) <= 64 AND char_length(image_url) <= 2048);
CREATE POLICY "Anyone can update freshers photos" ON public.freshers_photos FOR UPDATE USING (true) WITH CHECK (char_length(friend_slug) > 0 AND char_length(image_url) <= 2048);
CREATE POLICY "Anyone can delete freshers photos" ON public.freshers_photos FOR DELETE USING (true);