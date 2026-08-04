CREATE TABLE public.videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_url TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  caption TEXT NOT NULL DEFAULT '',
  poster_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.videos TO anon, authenticated;
GRANT ALL ON public.videos TO service_role;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Anyone can add a video" ON public.videos FOR INSERT WITH CHECK (char_length(video_url) > 0 AND char_length(video_url) <= 2048 AND char_length(title) <= 120 AND char_length(caption) <= 280);
CREATE POLICY "Anyone can update videos" ON public.videos FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete videos" ON public.videos FOR DELETE USING (true);