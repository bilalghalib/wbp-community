create table regional_insights (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  region text not null,
  sector text,
  answers jsonb not null,
  analysis_status text default 'pending',
  created_at timestamptz default now()
);

create index idx_regional_insights_region on regional_insights(region);
create index idx_regional_insights_sector on regional_insights(sector);

alter table regional_insights enable row level security;

-- Only admins can see all insights
create policy "Admins can view all insights"
  on regional_insights for select
  using (
    exists (
      select 1 from user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  );

-- Users can create insights
create policy "Users can create insights"
  on regional_insights for insert
  with check ( auth.uid() = user_id );

-- Users can view their own insights (for "My Contributions" view)
create policy "Users can view own insights"
  on regional_insights for select
  using ( auth.uid() = user_id );
