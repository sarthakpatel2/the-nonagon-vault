
create table public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text not null default '',
  date_label text not null default '',
  rotate text not null default 'rotate-0',
  created_at timestamptz not null default now()
);

alter table public.gallery_photos enable row level security;

create policy "Anyone can view gallery photos"
  on public.gallery_photos for select
  using (true);

create policy "Anyone can insert gallery photos"
  on public.gallery_photos for insert
  with check (true);

create policy "Anyone can update gallery photos"
  on public.gallery_photos for update
  using (true);

create policy "Anyone can delete gallery photos"
  on public.gallery_photos for delete
  using (true);

insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true);

create policy "Anyone can view gallery images"
  on storage.objects for select
  using (bucket_id = 'gallery');

create policy "Anyone can upload gallery images"
  on storage.objects for insert
  with check (bucket_id = 'gallery');

create policy "Anyone can update gallery images"
  on storage.objects for update
  using (bucket_id = 'gallery');

create policy "Anyone can delete gallery images"
  on storage.objects for delete
  using (bucket_id = 'gallery');
