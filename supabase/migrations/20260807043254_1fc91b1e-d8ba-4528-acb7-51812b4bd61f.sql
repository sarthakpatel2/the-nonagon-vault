DROP POLICY IF EXISTS "Anyone can post a video comment" ON public.video_comments;
CREATE POLICY "Anyone can post a video comment"
ON public.video_comments
FOR INSERT
WITH CHECK (
  char_length(btrim(message)) >= 1
  AND char_length(message) <= 500
  AND char_length(btrim(name)) >= 1
  AND char_length(name) <= 60
);