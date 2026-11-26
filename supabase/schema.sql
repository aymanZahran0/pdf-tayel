create extension if not exists pgcrypto;

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  public_id uuid unique not null default gen_random_uuid(),
  title text not null,
  file_path text not null,
  file_url text not null,
  file_size bigint not null default 0,
  is_active boolean not null default true,
  views_count bigint not null default 0,
  created_at timestamptz not null default now()
);

alter table public.documents enable row level security;

drop policy if exists "Public can read active documents" on public.documents;
create policy "Public can read active documents" on public.documents for select using (is_active = true);

drop policy if exists "Authenticated admins can insert documents" on public.documents;
create policy "Authenticated admins can insert documents" on public.documents for insert to authenticated with check (true);

drop policy if exists "Authenticated admins can update documents" on public.documents;
create policy "Authenticated admins can update documents" on public.documents for update to authenticated using (true) with check (true);

drop policy if exists "Authenticated admins can delete documents" on public.documents;
create policy "Authenticated admins can delete documents" on public.documents for delete to authenticated using (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('pdfs', 'pdfs', true, 20971520, array['application/pdf'])
on conflict (id) do update set public = true, file_size_limit = 20971520, allowed_mime_types = array['application/pdf'];

drop policy if exists "Public can read PDFs" on storage.objects;
create policy "Public can read PDFs" on storage.objects for select using (bucket_id = 'pdfs');

drop policy if exists "Authenticated admins can upload PDFs" on storage.objects;
create policy "Authenticated admins can upload PDFs" on storage.objects for insert to authenticated with check (bucket_id = 'pdfs');

drop policy if exists "Authenticated admins can update PDFs" on storage.objects;
create policy "Authenticated admins can update PDFs" on storage.objects for update to authenticated using (bucket_id = 'pdfs');

drop policy if exists "Authenticated admins can delete PDFs" on storage.objects;
create policy "Authenticated admins can delete PDFs" on storage.objects for delete to authenticated using (bucket_id = 'pdfs');
