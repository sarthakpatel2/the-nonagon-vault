DROP POLICY IF EXISTS "Authenticated can update freshers_photos" ON public.freshers_photos;

CREATE POLICY "Authenticated can update freshers_photos"
ON public.freshers_photos
FOR UPDATE
TO authenticated
USING (
  char_length(friend_slug) > 0
  AND char_length(friend_slug) <= 64
  AND (image_url IS NULL OR char_length(image_url) <= 2048)
  AND (final_image_url IS NULL OR char_length(final_image_url) <= 2048)
)
WITH CHECK (
  char_length(friend_slug) > 0
  AND char_length(friend_slug) <= 64
  AND (image_url IS NULL OR char_length(image_url) <= 2048)
  AND (final_image_url IS NULL OR char_length(final_image_url) <= 2048)
);