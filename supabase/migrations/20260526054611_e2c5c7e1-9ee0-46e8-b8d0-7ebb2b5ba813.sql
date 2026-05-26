CREATE TABLE public.site_visits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record a visit"
ON public.site_visits FOR INSERT TO public
WITH CHECK (true);

CREATE POLICY "Anyone can view visits"
ON public.site_visits FOR SELECT TO public
USING (true);

CREATE INDEX idx_site_visits_created_at ON public.site_visits(created_at);