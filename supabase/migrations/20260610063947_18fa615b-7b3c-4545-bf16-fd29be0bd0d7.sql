
DROP POLICY IF EXISTS "Anyone can insert freshers photos" ON public.freshers_photos;
DROP POLICY IF EXISTS "Anyone can update freshers photos" ON public.freshers_photos;

CREATE POLICY "Anyone can insert freshers photos"
ON public.freshers_photos FOR INSERT
TO public
WITH CHECK (
  char_length(friend_slug) > 0
  AND char_length(friend_slug) <= 64
  AND (image_url IS NULL OR char_length(image_url) <= 2048)
  AND (final_image_url IS NULL OR char_length(final_image_url) <= 2048)
);

CREATE POLICY "Anyone can update freshers photos"
ON public.freshers_photos FOR UPDATE
TO public
USING (true)
WITH CHECK (
  char_length(friend_slug) > 0
  AND (image_url IS NULL OR char_length(image_url) <= 2048)
  AND (final_image_url IS NULL OR char_length(final_image_url) <= 2048)
);
