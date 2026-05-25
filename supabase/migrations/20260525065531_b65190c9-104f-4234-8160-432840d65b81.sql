CREATE TABLE public.letter_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  emoji TEXT NOT NULL,
  memory TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.letter_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view letter reactions"
ON public.letter_reactions FOR SELECT
USING (true);

CREATE POLICY "Anyone can post a letter reaction"
ON public.letter_reactions FOR INSERT
WITH CHECK (
  char_length(emoji) > 0 AND char_length(emoji) <= 16
  AND char_length(memory) <= 200
  AND char_length(name) <= 60
);