CREATE TABLE public.note_reactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  note_id uuid NOT NULL REFERENCES public.love_notes(id) ON DELETE CASCADE,
  emoji text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.note_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view note reactions"
  ON public.note_reactions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can add a note reaction"
  ON public.note_reactions FOR INSERT
  WITH CHECK (char_length(emoji) > 0 AND char_length(emoji) <= 16);

CREATE INDEX idx_note_reactions_note_id ON public.note_reactions(note_id);