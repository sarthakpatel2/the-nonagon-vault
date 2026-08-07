UPDATE public.love_notes SET name = 'anonymous' WHERE char_length(name) = 0 OR name IS NULL;

ALTER TABLE public.love_notes DROP CONSTRAINT IF EXISTS love_notes_name_check;
ALTER TABLE public.love_notes ADD CONSTRAINT love_notes_name_check CHECK (char_length(name) > 0 AND char_length(name) <= 60);

DROP POLICY IF EXISTS "Anyone can send a love note" ON public.love_notes;
CREATE POLICY "Anyone can send a love note" ON public.love_notes FOR INSERT TO public WITH CHECK (
  char_length(name) > 0 AND char_length(name) <= 60 AND
  char_length(message) > 0 AND char_length(message) <= 280 AND
  char_length(page) <= 120
);