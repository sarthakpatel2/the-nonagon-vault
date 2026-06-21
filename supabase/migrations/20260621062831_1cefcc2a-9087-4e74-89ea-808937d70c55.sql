CREATE TABLE public.campus_memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id text NOT NULL,
  name text NOT NULL DEFAULT 'Anonymous',
  title text NOT NULL,
  note text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.campus_memories TO anon, authenticated;
GRANT ALL ON public.campus_memories TO service_role;

ALTER TABLE public.campus_memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view campus memories"
  ON public.campus_memories FOR SELECT
  USING (true);

CREATE POLICY "Anyone can add a campus memory"
  ON public.campus_memories FOR INSERT
  WITH CHECK (
    char_length(title) > 0 AND char_length(title) <= 80
    AND char_length(note) > 0 AND char_length(note) <= 500
    AND char_length(name) <= 60
    AND char_length(place_id) > 0 AND char_length(place_id) <= 40
  );

CREATE INDEX campus_memories_place_idx ON public.campus_memories(place_id, created_at DESC);