-- Migration: Gate Tracking for Annual Survey
-- Date: January 14, 2026
-- Purpose: Track user and org completion status for the annual survey gate

-- 1. Add completion tracking to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS last_annual_survey_at timestamptz;

-- 2. Add completion tracking to organizations table
ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS last_annual_survey_at timestamptz;

-- 3. Create submissions audit trail table
CREATE TABLE IF NOT EXISTS annual_survey_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id uuid REFERENCES survey_seasons(id) NOT NULL,
  organization_id uuid REFERENCES organizations(id),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  submission_type text NOT NULL CHECK (submission_type IN ('insights', 'org_profile', 'practitioner', 'resource')),
  payload jsonb,
  submitted_at timestamptz DEFAULT now()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_submissions_season ON annual_survey_submissions(season_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON annual_survey_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_org ON annual_survey_submissions(organization_id);
CREATE INDEX IF NOT EXISTS idx_submissions_type ON annual_survey_submissions(submission_type);

-- RLS for submissions
ALTER TABLE annual_survey_submissions ENABLE ROW LEVEL SECURITY;

-- Users can view their own submissions
CREATE POLICY "Users can view own submissions"
ON annual_survey_submissions FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own submissions
CREATE POLICY "Users can create own submissions"
ON annual_survey_submissions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 4. Gate check function
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
  is_admin boolean;
  user_blocked boolean := false;
  org_blocked boolean := false;
  block_reason text := null;
BEGIN
  -- Get active season (must be within date range AND marked active)
  SELECT * INTO active_season
  FROM survey_seasons
  WHERE is_active = true
  AND now() BETWEEN start_at AND end_at
  LIMIT 1;

  -- No active season = no gate
  IF active_season IS NULL THEN
    RETURN json_build_object(
      'is_blocked', false,
      'reason', 'no_active_season',
      'season', null
    );
  END IF;

  -- Get user's completion status
  SELECT * INTO user_record
  FROM users
  WHERE id = target_user_id;

  -- Check if user has completed since season started
  IF user_record.last_annual_survey_at IS NULL
     OR user_record.last_annual_survey_at < active_season.start_at THEN
    user_blocked := true;
    block_reason := 'user_not_completed';
  END IF;

  -- Get user's org membership and role
  SELECT om.organization_id, om.role
  INTO user_org_id, user_role
  FROM organization_memberships om
  WHERE om.user_id = target_user_id
  AND om.is_active = true
  LIMIT 1;

  is_admin := user_role IN ('primary_admin', 'backup_admin');

  -- If admin, also check org completion
  IF is_admin AND user_org_id IS NOT NULL THEN
    SELECT * INTO org_record
    FROM organizations
    WHERE id = user_org_id;

    IF org_record.last_annual_survey_at IS NULL
       OR org_record.last_annual_survey_at < active_season.start_at THEN
      org_blocked := true;
      IF block_reason IS NULL THEN
        block_reason := 'org_not_completed';
      ELSE
        block_reason := 'user_and_org_not_completed';
      END IF;
    END IF;
  END IF;

  RETURN json_build_object(
    'is_blocked', user_blocked OR org_blocked,
    'reason', block_reason,
    'is_admin', COALESCE(is_admin, false),
    'organization_id', user_org_id,
    'season', json_build_object(
      'id', active_season.id,
      'name', active_season.name,
      'start_at', active_season.start_at,
      'end_at', active_season.end_at
    )
  );
END;
$$;

-- 5. Function to mark user as completed
CREATE OR REPLACE FUNCTION complete_annual_survey(
  p_user_id uuid,
  p_organization_id uuid DEFAULT NULL,
  p_is_admin boolean DEFAULT false
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update user completion timestamp
  UPDATE users
  SET last_annual_survey_at = now()
  WHERE id = p_user_id;

  -- If admin, also update org completion timestamp
  IF p_is_admin AND p_organization_id IS NOT NULL THEN
    UPDATE organizations
    SET last_annual_survey_at = now()
    WHERE id = p_organization_id;
  END IF;

  RETURN json_build_object(
    'success', true,
    'user_completed', true,
    'org_completed', p_is_admin
  );
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION check_annual_survey_gate(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION complete_annual_survey(uuid, uuid, boolean) TO authenticated;
