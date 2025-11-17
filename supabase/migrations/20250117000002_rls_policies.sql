-- Springboard Platform - Row Level Security Policies
-- Generated: 2025-11-17
-- Description: RLS policies for privacy-first access control

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_provider_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- HELPER FUNCTIONS FOR RLS
-- ============================================================================

-- Check if user is a member of an organization
CREATE OR REPLACE FUNCTION is_org_member(org_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM organization_memberships
    WHERE organization_id = org_id
      AND organization_memberships.user_id = user_id
      AND is_active = TRUE
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Check if user is an admin (primary or backup) of an organization
CREATE OR REPLACE FUNCTION is_org_admin(org_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM organization_memberships
    WHERE organization_id = org_id
      AND organization_memberships.user_id = user_id
      AND role IN ('primary_admin', 'backup_admin')
      AND is_active = TRUE
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Check if user has a specific permission
CREATE OR REPLACE FUNCTION has_permission(org_id UUID, user_id UUID, permission TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM organization_memberships
    WHERE organization_id = org_id
      AND organization_memberships.user_id = user_id
      AND (
        role IN ('primary_admin', 'backup_admin')
        OR (permissions->permission)::BOOLEAN = TRUE
      )
      AND is_active = TRUE
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Check if user is WBP admin (super admin)
CREATE OR REPLACE FUNCTION is_wbp_admin(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE id = user_id
      AND email LIKE '%@wellbeingproject.org'  -- Adjust this to your actual domain
      AND is_active = TRUE
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Get user's organizations
CREATE OR REPLACE FUNCTION user_organizations(user_id UUID)
RETURNS SETOF UUID AS $$
  SELECT organization_id
  FROM organization_memberships
  WHERE organization_memberships.user_id = user_id
    AND is_active = TRUE;
$$ LANGUAGE SQL SECURITY DEFINER;

-- ============================================================================
-- ORGANIZATIONS POLICIES
-- ============================================================================

-- Members can view their own organization
CREATE POLICY "Members can view own organization"
ON organizations FOR SELECT
USING (
  is_org_member(id, auth.uid())
);

-- All network members can view other orgs' basic info (network or public visibility)
CREATE POLICY "Network members can view other orgs"
ON organizations FOR SELECT
USING (
  visibility_level IN ('network', 'public')
  AND EXISTS (
    SELECT 1 FROM organization_memberships
    WHERE user_id = auth.uid() AND is_active = TRUE
  )
);

-- WBP admins can view all organizations
CREATE POLICY "WBP admins can view all organizations"
ON organizations FOR SELECT
USING (is_wbp_admin(auth.uid()));

-- Admins can update their own organization
CREATE POLICY "Admins can update own organization"
ON organizations FOR UPDATE
USING (is_org_admin(id, auth.uid()));

-- WBP admins can create organizations
CREATE POLICY "WBP admins can create organizations"
ON organizations FOR INSERT
WITH CHECK (is_wbp_admin(auth.uid()));

-- WBP admins can delete organizations
CREATE POLICY "WBP admins can delete organizations"
ON organizations FOR DELETE
USING (is_wbp_admin(auth.uid()));

-- ============================================================================
-- USERS POLICIES
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (id = auth.uid());

-- Org members can view other members in same org
CREATE POLICY "Org members can view org colleagues"
ON users FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM organization_memberships om1
    WHERE om1.user_id = auth.uid()
      AND EXISTS (
        SELECT 1 FROM organization_memberships om2
        WHERE om2.user_id = users.id
          AND om2.organization_id = om1.organization_id
          AND om2.is_active = TRUE
      )
      AND om1.is_active = TRUE
  )
);

-- WBP admins can view all users
CREATE POLICY "WBP admins can view all users"
ON users FOR SELECT
USING (is_wbp_admin(auth.uid()));

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (id = auth.uid());

-- New users can insert their own profile
CREATE POLICY "Users can insert own profile"
ON users FOR INSERT
WITH CHECK (id = auth.uid());

-- ============================================================================
-- ORGANIZATION_MEMBERSHIPS POLICIES
-- ============================================================================

-- Members can view memberships in their orgs
CREATE POLICY "Members can view org memberships"
ON organization_memberships FOR SELECT
USING (
  is_org_member(organization_id, auth.uid())
);

-- Admins can create memberships (invite users)
CREATE POLICY "Admins can create memberships"
ON organization_memberships FOR INSERT
WITH CHECK (
  is_org_admin(organization_id, auth.uid())
);

-- Admins can update memberships (change roles)
CREATE POLICY "Admins can update memberships"
ON organization_memberships FOR UPDATE
USING (
  is_org_admin(organization_id, auth.uid())
);

-- Admins can delete memberships (remove users)
CREATE POLICY "Admins can delete memberships"
ON organization_memberships FOR DELETE
USING (
  is_org_admin(organization_id, auth.uid())
);

-- WBP admins can do everything with memberships
CREATE POLICY "WBP admins can manage all memberships"
ON organization_memberships FOR ALL
USING (is_wbp_admin(auth.uid()))
WITH CHECK (is_wbp_admin(auth.uid()));

-- ============================================================================
-- SERVICE_PROVIDERS POLICIES
-- ============================================================================

-- All network members can view visible service providers
CREATE POLICY "Network members can view service providers"
ON service_providers FOR SELECT
USING (
  is_visible = TRUE
  AND EXISTS (
    SELECT 1 FROM organization_memberships
    WHERE user_id = auth.uid() AND is_active = TRUE
  )
);

-- Service providers can view their own profile
CREATE POLICY "Service providers can view own profile"
ON service_providers FOR SELECT
USING (
  email = (SELECT email FROM users WHERE id = auth.uid())
);

-- Contributors and admins can create service providers
CREATE POLICY "Contributors can create service providers"
ON service_providers FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM organization_memberships
    WHERE user_id = auth.uid()
      AND role IN ('primary_admin', 'backup_admin', 'contributor')
      AND is_active = TRUE
  )
);

-- Service providers can update their own profile (hybrid model: certain fields only)
-- Note: This allows them to edit bio, photo, contact, availability
-- Organizations control recommendations via service_provider_recommendations table
CREATE POLICY "Service providers can update own profile"
ON service_providers FOR UPDATE
USING (
  email = (SELECT email FROM users WHERE id = auth.uid())
);

-- Org admins can update service providers they recommended
CREATE POLICY "Org admins can update recommended providers"
ON service_providers FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM service_provider_recommendations spr
    JOIN organization_memberships om ON om.organization_id = spr.organization_id
    WHERE spr.service_provider_id = service_providers.id
      AND om.user_id = auth.uid()
      AND om.role IN ('primary_admin', 'backup_admin')
      AND om.is_active = TRUE
  )
);

-- WBP admins can manage all service providers
CREATE POLICY "WBP admins can manage service providers"
ON service_providers FOR ALL
USING (is_wbp_admin(auth.uid()))
WITH CHECK (is_wbp_admin(auth.uid()));

-- ============================================================================
-- SERVICE_PROVIDER_RECOMMENDATIONS POLICIES
-- ============================================================================

-- Network members can view recommendations
CREATE POLICY "Network members can view recommendations"
ON service_provider_recommendations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM organization_memberships
    WHERE user_id = auth.uid() AND is_active = TRUE
  )
);

-- Org contributors can create recommendations
CREATE POLICY "Contributors can create recommendations"
ON service_provider_recommendations FOR INSERT
WITH CHECK (
  is_org_member(organization_id, auth.uid())
  AND has_permission(organization_id, auth.uid(), 'can_add_service_providers')
);

-- Org admins can update their org's recommendations
CREATE POLICY "Org admins can update recommendations"
ON service_provider_recommendations FOR UPDATE
USING (
  is_org_admin(organization_id, auth.uid())
);

-- Org admins can delete their org's recommendations
CREATE POLICY "Org admins can delete recommendations"
ON service_provider_recommendations FOR DELETE
USING (
  is_org_admin(organization_id, auth.uid())
);

-- ============================================================================
-- RESEARCH_DOCUMENTS POLICIES
-- ============================================================================

-- Org members can view their own org's research
CREATE POLICY "Org members can view own research"
ON research_documents FOR SELECT
USING (
  is_org_member(organization_id, auth.uid())
);

-- Network members can view network-shared research
CREATE POLICY "Network members can view shared research"
ON research_documents FOR SELECT
USING (
  visibility_level IN ('network', 'public')
  AND EXISTS (
    SELECT 1 FROM organization_memberships
    WHERE user_id = auth.uid() AND is_active = TRUE
  )
);

-- Public research is visible to all (for future public access)
CREATE POLICY "Public research is visible to all"
ON research_documents FOR SELECT
USING (visibility_level = 'public');

-- Contributors can upload research
CREATE POLICY "Contributors can upload research"
ON research_documents FOR INSERT
WITH CHECK (
  is_org_member(organization_id, auth.uid())
  AND has_permission(organization_id, auth.uid(), 'can_upload_research')
);

-- Contributors can update research from their org
CREATE POLICY "Contributors can update own org research"
ON research_documents FOR UPDATE
USING (
  is_org_member(organization_id, auth.uid())
  AND has_permission(organization_id, auth.uid(), 'can_upload_research')
);

-- Org admins can delete research
CREATE POLICY "Org admins can delete research"
ON research_documents FOR DELETE
USING (
  is_org_admin(organization_id, auth.uid())
);

-- WBP admins can manage all research
CREATE POLICY "WBP admins can manage all research"
ON research_documents FOR ALL
USING (is_wbp_admin(auth.uid()))
WITH CHECK (is_wbp_admin(auth.uid()));

-- ============================================================================
-- DOCUMENT_EMBEDDINGS POLICIES
-- ============================================================================

-- Embeddings inherit permissions from research_documents
-- Network members can view embeddings for documents they can access
CREATE POLICY "Network members can view embeddings"
ON document_embeddings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM research_documents rd
    WHERE rd.id = document_embeddings.research_document_id
      AND (
        is_org_member(rd.organization_id, auth.uid())
        OR rd.visibility_level IN ('network', 'public')
      )
  )
);

-- System/WBP admins can create embeddings (typically via background job)
CREATE POLICY "WBP admins can create embeddings"
ON document_embeddings FOR INSERT
WITH CHECK (is_wbp_admin(auth.uid()));

-- ============================================================================
-- SURVEYS POLICIES
-- ============================================================================

-- All network members can view active surveys
CREATE POLICY "Network members can view surveys"
ON surveys FOR SELECT
USING (
  is_active = TRUE
  AND EXISTS (
    SELECT 1 FROM organization_memberships
    WHERE user_id = auth.uid() AND is_active = TRUE
  )
);

-- WBP admins can create and manage surveys
CREATE POLICY "WBP admins can manage surveys"
ON surveys FOR ALL
USING (is_wbp_admin(auth.uid()))
WITH CHECK (is_wbp_admin(auth.uid()));

-- ============================================================================
-- SURVEY_DEPLOYMENTS POLICIES
-- ============================================================================

-- Org members can view their org's deployments
CREATE POLICY "Org members can view deployments"
ON survey_deployments FOR SELECT
USING (
  is_org_member(organization_id, auth.uid())
);

-- Org admins can create deployments
CREATE POLICY "Org admins can create deployments"
ON survey_deployments FOR INSERT
WITH CHECK (
  is_org_admin(organization_id, auth.uid())
);

-- Org admins can update their deployments
CREATE POLICY "Org admins can update deployments"
ON survey_deployments FOR UPDATE
USING (
  is_org_admin(organization_id, auth.uid())
);

-- Public deployments are viewable via public_link (handled in app layer)
-- WBP admins can view all deployments
CREATE POLICY "WBP admins can view all deployments"
ON survey_deployments FOR ALL
USING (is_wbp_admin(auth.uid()))
WITH CHECK (is_wbp_admin(auth.uid()));

-- ============================================================================
-- SURVEY_RESPONSES POLICIES (PRIVACY-CRITICAL)
-- ============================================================================

-- NO DIRECT ACCESS - All access must go through aggregate functions
-- This is the core privacy protection for survey responses

-- Block all direct SELECT queries
CREATE POLICY "No direct access to survey responses"
ON survey_responses FOR SELECT
USING (FALSE);

-- Allow anonymous submission (public surveys)
CREATE POLICY "Anyone can submit responses"
ON survey_responses FOR INSERT
WITH CHECK (TRUE);  -- Validation happens in app layer

-- WBP admins can access via aggregate functions only (enforced by app layer)
-- No policy needed here - access through get_deployment_aggregate_stats()

-- ============================================================================
-- ACTIVITY_LOGS POLICIES
-- ============================================================================

-- Users can view their own activity
CREATE POLICY "Users can view own activity"
ON activity_logs FOR SELECT
USING (user_id = auth.uid());

-- Org admins can view org activity
CREATE POLICY "Org admins can view org activity"
ON activity_logs FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id FROM organization_memberships
    WHERE user_id = auth.uid()
      AND role IN ('primary_admin', 'backup_admin')
      AND is_active = TRUE
  )
);

-- WBP admins can view all activity
CREATE POLICY "WBP admins can view all activity"
ON activity_logs FOR SELECT
USING (is_wbp_admin(auth.uid()));

-- System can insert activity logs
CREATE POLICY "System can insert activity logs"
ON activity_logs FOR INSERT
WITH CHECK (TRUE);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION is_org_member IS 'Check if user is an active member of an organization';
COMMENT ON FUNCTION is_org_admin IS 'Check if user is an admin (primary or backup) of an organization';
COMMENT ON FUNCTION has_permission IS 'Check if user has a specific permission in an organization';
COMMENT ON FUNCTION is_wbp_admin IS 'Check if user is a WBP super admin';
COMMENT ON FUNCTION user_organizations IS 'Get list of organizations a user belongs to';
