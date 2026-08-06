GRANT SELECT, INSERT, DELETE ON public.video_comments TO anon, authenticated;
GRANT SELECT, INSERT, DELETE ON public.video_likes TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.videos TO anon, authenticated;
GRANT ALL ON public.video_comments TO service_role;
GRANT ALL ON public.video_likes TO service_role;
GRANT ALL ON public.videos TO service_role;