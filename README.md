# Job Tracker

A Next.js app for tracking job applications. The project is wired for Tailwind CSS and a browser-side Supabase connection check.

## Local Setup

Install dependencies:

```bash
npm install
```

Create `.env.local` with your Supabase project values:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The homepage queries the `applications` table and logs the result in the browser console as `Supabase applications:`.

## Supabase

The frontend client is defined in `lib/supabaseClient.js` using `@supabase/supabase-js`.

Create the `applications` table in Supabase SQL Editor before using the app:

```sql
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company text not null,
  position text not null,
  status text not null default 'Applied',
  location text,
  applied_date date,
  notes text,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users
    where id = auth.uid()
    and role = 'admin'
  );
$$;

alter table public.applications enable row level security;

create policy "Users can read own applications"
on public.applications
for select
to authenticated
using (auth.uid() = user_id or public.is_admin());

create policy "Users can create own applications"
on public.applications
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own applications"
on public.applications
for update
to authenticated
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

create policy "Users can delete own applications"
on public.applications
for delete
to authenticated
using (auth.uid() = user_id or public.is_admin());
```

If `public.applications` already exists from an earlier prototype, add ownership before enabling the protected API routes:

```sql
alter table public.applications
add column if not exists user_id uuid references auth.users(id) on delete cascade;
```

Existing rows without `user_id` will not be visible to normal users until you assign them to an auth user.

This policy is intentionally simple for local learning and prototyping. Tighten it before using real user data.

For the admin user list, create a matching public `users` table:

```sql
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text not null,
  password text,
  role text not null default 'user',
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "Users can create own profile"
on public.users
for insert
to authenticated
with check (auth.uid() = id);

create policy "Users can read own profile"
on public.users
for select
to authenticated
using (auth.uid() = id);

create policy "Admins can read users"
on public.users
for select
to authenticated
using (public.is_admin());

create policy "Admins can delete users"
on public.users
for delete
to authenticated
using (public.is_admin());
```

If `public.users` already exists, add the compatibility password column with:

```sql
alter table public.users
add column if not exists password text;
```

Passwords should still be managed by Supabase Auth. Do not store plaintext passwords in `public.users.password`; keep it null unless you replace it with a proper password hash strategy.

Registered users are inserted with `role = 'user'` by the app. To seed your first admin, create the admin account in Supabase Auth first, copy its Auth user UUID, then run:

```sql
insert into public.users (id, name, email, role)
values (
  'PASTE_AUTH_USER_UUID_HERE',
  'Admin',
  'admin@example.com',
  'admin'
)
on conflict (id) do update
set role = 'admin',
    name = excluded.name,
    email = excluded.email;
```

## Deploy on Vercel

Add these environment variables in Vercel Project Settings before deploying:

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Then deploy with the default Next.js settings.
