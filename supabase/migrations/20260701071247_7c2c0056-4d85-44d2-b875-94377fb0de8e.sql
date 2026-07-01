
CREATE TABLE public.crew_avatars (
  slug TEXT PRIMARY KEY,
  image_url TEXT NOT NULL,
  crop_x REAL NOT NULL DEFAULT 50,
  crop_y REAL NOT NULL DEFAULT 50,
  crop_scale REAL NOT NULL DEFAULT 1,
  filter TEXT NOT NULL DEFAULT 'none',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.crew_avatars TO anon, authenticated;
GRANT ALL ON public.crew_avatars TO service_role;

ALTER TABLE public.crew_avatars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read crew avatars"
  ON public.crew_avatars FOR SELECT USING (true);

CREATE POLICY "Anyone can upsert crew avatars"
  ON public.crew_avatars FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update crew avatars"
  ON public.crew_avatars FOR UPDATE USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.crew_avatars_touch()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER crew_avatars_touch
BEFORE UPDATE ON public.crew_avatars
FOR EACH ROW EXECUTE FUNCTION public.crew_avatars_touch();
