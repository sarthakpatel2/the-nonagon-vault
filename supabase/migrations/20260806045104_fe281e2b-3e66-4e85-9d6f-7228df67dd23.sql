CREATE TABLE public.video_likes (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references public.videos(id) on delete cascade,
  client_id text not null,
  created_at timestamptz not null default now(),
  unique (video_id, client_id)
);
GRANT SELECT, INSERT, DELETE ON public.video_likes TO anon, authenticated;
GRANT ALL ON public.video_likes TO service_role;
ALTER TABLE public.video_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view video likes" ON public.video_likes FOR SELECT USING (true);
CREATE POLICY "Anyone can like a video" ON public.video_likes FOR INSERT WITH CHECK (char_length(client_id) BETWEEN 1 AND 64);
CREATE POLICY "Anyone can unlike a video" ON public.video_likes FOR DELETE USING (true);

CREATE TABLE public.video_comments (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references public.videos(id) on delete cascade,
  name text not null default '',
  message text not null,
  created_at timestamptz not null default now()
);
GRANT SELECT, INSERT, DELETE ON public.video_comments TO anon, authenticated;
GRANT ALL ON public.video_comments TO service_role;
ALTER TABLE public.video_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view video comments" ON public.video_comments FOR SELECT USING (true);
CREATE POLICY "Anyone can post a video comment" ON public.video_comments FOR INSERT WITH CHECK (char_length(message) BETWEEN 1 AND 500 AND char_length(name) <= 60);
CREATE POLICY "Anyone can delete a video comment" ON public.video_comments FOR DELETE USING (true);
CREATE INDEX video_comments_video_idx ON public.video_comments(video_id, created_at DESC);
CREATE INDEX video_likes_video_idx ON public.video_likes(video_id);