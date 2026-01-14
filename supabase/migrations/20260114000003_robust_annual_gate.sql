-- 1. Create Survey Seasons to manage windows
CREATE TABLE IF NOT EXISTS survey_seasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, -- e.g. "2026 Annual Gathering"
  start_at timestamptz NOT NULL,
  end_at timestamptz NOT NULL,
  grace_period_end_at timestamptz, -- Optional grace period
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Ensure only one season is active at a time
CREATE UNIQUE INDEX ON survey_seasons (is_active) WHERE is_active = true;

-- 2. Track org-level completion
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS last_annual_survey_at timestamptz;

-- 3. Explicit submissions table for audit trail
CREATE TABLE IF NOT EXISTS annual_survey_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id uuid REFERENCES survey_seasons(id) NOT NULL,
  organization_id uuid REFERENCES organizations(id) NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  submission_type text NOT NULL, -- 'insights' | 'org_profile'
  payload jsonb,
  submitted_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_submissions_season ON annual_survey_submissions(season_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON annual_survey_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_org ON annual_survey_submissions(organization_id);

-- 4. Robust Gate Check Function
CREATE OR REPLACE FUNCTION check_annual_survey_gate(target_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  active_season record;
  user_record record;
  user_org_id uuid;
  org_record record;
  user_role text;
  is_blocked boolean := false;
BEGIN
  -- Get active season where current time is between start and end (or grace)
  SELECT * INTO active_season 
  FROM survey_seasons 
  WHERE is_active = true 
  AND now() >= start_at
  AND (now() <= end_at OR (grace_period_end_at IS NOT NULL AND now() <= grace_period_end_at))
  LIMIT 1;
  
  -- No active season window = no gate
  IF active_season IS NULL THEN
    RETURN json_build_object('is_blocked', false, 'reason', 'no_active_season');
  END IF;
  
  -- Get user's completion status from public.users table
  SELECT * INTO user_record FROM users WHERE id = target_user_id;
  
  -- User hasn't completed since season started
  IF user_record.last_annual_survey_at IS NULL 
     OR user_record.last_annual_survey_at < active_season.start_at THEN
    is_blocked := true;
  END IF;
  
  -- Check if admin and if org needs confirmation
  SELECT om.organization_id, om.role INTO user_org_id, user_role
  FROM organization_memberships om
  WHERE om.user_id = target_user_id
  AND om.role IN ('primary_admin', 'backup_admin')
  LIMIT 1;
  
  -- If they are an admin, they are also blocked if the ORG hasn't been confirmed this season
  IF user_org_id IS NOT NULL AND user_role IS NOT NULL THEN
    SELECT * INTO org_record FROM organizations WHERE id = user_org_id;
    IF org_record.last_annual_survey_at IS NULL 
       OR org_record.last_annual_survey_at < active_season.start_at THEN
      is_blocked := true;
    END IF;
  END IF;
  
  RETURN json_build_object(
    'is_blocked', is_blocked,
    'season_name', active_season.name,
    'is_admin', user_role IS NOT NULL
  );
END;
$$;
