-- 1. Create Survey Seasons to manage the "Windows"
create table survey_seasons (
  id uuid primary key default gen_random_uuid(),
  name text not null, -- e.g. "2026 Annual Gathering"
  start_at timestamptz not null,
  end_at timestamptz not null,
  is_active boolean default false,
  created_at timestamptz default now()
);

-- Ensure only one season is active at a time (optional but good practice)
create unique index on survey_seasons (is_active) where is_active = true;

-- 2. Function to get User Impact Stats (for the "Magic" Welcome)
-- Counts how many times OTHER users have interacted with resources/providers linked to THIS user's org
create or replace function get_user_impact_stats(target_user_id uuid)
returns json
language plpgsql
security definer
as $$
declare
  user_org_id uuid;
  provider_views bigint;
  resource_views bigint;
  resource_downloads bigint;
begin
  -- Get user's primary organization
  select organization_id into user_org_id
  from organization_memberships
  where user_id = target_user_id
  limit 1;

  if user_org_id is null then
    return json_build_object(
      'provider_views', 0,
      'resource_views', 0,
      'resource_downloads', 0
    );
  end if;

  -- Count views on Providers recommended by this Org
  -- (Assuming we log 'view_provider' in activity_logs with resource_id)
  select count(*) into provider_views
  from activity_logs al
  join service_provider_recommendations spr on al.resource_id = spr.service_provider_id
  where spr.organization_id = user_org_id
  and al.action_type = 'view_provider';

  -- Count views on Resources uploaded by this Org
  select count(*) into resource_views
  from activity_logs al
  join research_documents rd on al.resource_id = rd.id
  where rd.organization_id = user_org_id
  and al.action_type = 'view_resource';

  -- Count downloads
  select count(*) into resource_downloads
  from activity_logs al
  join research_documents rd on al.resource_id = rd.id
  where rd.organization_id = user_org_id
  and al.action_type = 'download_resource';

  return json_build_object(
    'provider_views', coalesce(provider_views, 0),
    'resource_views', coalesce(resource_views, 0),
    'resource_downloads', coalesce(resource_downloads, 0)
  );
end;
$$;
