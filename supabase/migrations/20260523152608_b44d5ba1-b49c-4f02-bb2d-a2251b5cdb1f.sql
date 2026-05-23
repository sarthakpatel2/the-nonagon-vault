CREATE TABLE public.love_notes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL DEFAULT '' CHECK (char_length(name) <= 60),
  message text NOT NULL CHECK (char_length(message) > 0 AND char_length(message) <= 280),
  page text NOT NULL DEFAULT '/' CHECK (char_length(page) <= 120),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.love_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view love notes"
  ON public.love_notes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can send a love note"
  ON public.love_notes FOR INSERT
  WITH CHECK (
    char_length(message) > 0
    AND char_length(message) <= 280
    AND char_length(name) <= 60
    AND char_length(page) <= 120
  );

CREATE INDEX idx_love_notes_page_created ON public.love_notes (page, created_at DESC);