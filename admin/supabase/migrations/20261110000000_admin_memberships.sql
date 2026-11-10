create table public.admin_memberships (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('super_admin', 'owner', 'content_editor', 'enquiry_manager', 'viewer')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.admin_memberships enable row level security;

revoke all on table public.admin_memberships from anon, authenticated;
grant select on table public.admin_memberships to authenticated;

create policy "Users can read their own active admin membership"
  on public.admin_memberships
  for select
  to authenticated
  using ((select auth.uid()) = user_id and active);
