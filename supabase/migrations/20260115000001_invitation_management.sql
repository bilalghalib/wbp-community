-- Invitation Management System
-- Adds invitation tokens for proper email-based invitations

-- ============================================================================
-- INVITATION TOKENS TABLE
-- ============================================================================

CREATE TABLE invitation_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Invitation details
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('primary_admin', 'backup_admin', 'contributor', 'viewer')),

  -- Token
  token TEXT UNIQUE NOT NULL,

  -- Expiry and status
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,

  -- Audit
  invited_by_user_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- For tracking resends
  last_sent_at TIMESTAMPTZ DEFAULT NOW(),
  send_count INT DEFAULT 1
);

-- Indexes
CREATE INDEX invitation_tokens_email_idx ON invitation_tokens(email);
CREATE INDEX invitation_tokens_org_idx ON invitation_tokens(organization_id);
CREATE INDEX invitation_tokens_token_idx ON invitation_tokens(token);
CREATE INDEX invitation_tokens_pending_idx ON invitation_tokens(organization_id, accepted_at, revoked_at)
  WHERE accepted_at IS NULL AND revoked_at IS NULL;

-- ============================================================================
-- ADD WELCOME FLAG TO USERS
-- ============================================================================

ALTER TABLE users ADD COLUMN IF NOT EXISTS has_seen_welcome BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS welcomed_at TIMESTAMPTZ;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

ALTER TABLE invitation_tokens ENABLE ROW LEVEL SECURITY;

-- Org admins can view their org's invitations
CREATE POLICY "Org admins can view invitations"
ON invitation_tokens FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id
    FROM organization_memberships
    WHERE user_id = auth.uid()
    AND is_active = true
    AND role IN ('primary_admin', 'backup_admin')
  )
);

-- Org admins can create invitations
CREATE POLICY "Org admins can create invitations"
ON invitation_tokens FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT organization_id
    FROM organization_memberships
    WHERE user_id = auth.uid()
    AND is_active = true
    AND role IN ('primary_admin', 'backup_admin')
  )
);

-- Org admins can update invitations (resend, revoke)
CREATE POLICY "Org admins can update invitations"
ON invitation_tokens FOR UPDATE
USING (
  organization_id IN (
    SELECT organization_id
    FROM organization_memberships
    WHERE user_id = auth.uid()
    AND is_active = true
    AND role IN ('primary_admin', 'backup_admin')
  )
);

-- ============================================================================
-- HELPER FUNCTION TO GENERATE SECURE TOKEN
-- ============================================================================

CREATE OR REPLACE FUNCTION generate_invitation_token()
RETURNS TEXT AS $$
  SELECT encode(gen_random_bytes(32), 'base64');
$$ LANGUAGE SQL;

-- ============================================================================
-- FUNCTION TO CHECK IF INVITATION IS VALID
-- ============================================================================

CREATE OR REPLACE FUNCTION check_invitation_token(token_param TEXT)
RETURNS TABLE (
  is_valid BOOLEAN,
  invitation_id UUID,
  email TEXT,
  full_name TEXT,
  organization_id UUID,
  organization_name TEXT,
  organization_slug TEXT,
  role TEXT,
  error_message TEXT
) AS $$
DECLARE
  inv invitation_tokens%ROWTYPE;
  org organizations%ROWTYPE;
BEGIN
  -- Find the invitation
  SELECT * INTO inv FROM invitation_tokens WHERE token = token_param;

  IF NOT FOUND THEN
    RETURN QUERY SELECT
      FALSE, NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT,
      'Invalid invitation link'::TEXT;
    RETURN;
  END IF;

  -- Check if already accepted
  IF inv.accepted_at IS NOT NULL THEN
    RETURN QUERY SELECT
      FALSE, inv.id, inv.email, inv.full_name, inv.organization_id, NULL::TEXT, NULL::TEXT, inv.role,
      'This invitation has already been accepted'::TEXT;
    RETURN;
  END IF;

  -- Check if revoked
  IF inv.revoked_at IS NOT NULL THEN
    RETURN QUERY SELECT
      FALSE, inv.id, inv.email, inv.full_name, inv.organization_id, NULL::TEXT, NULL::TEXT, inv.role,
      'This invitation has been cancelled'::TEXT;
    RETURN;
  END IF;

  -- Check if expired
  IF inv.expires_at < NOW() THEN
    RETURN QUERY SELECT
      FALSE, inv.id, inv.email, inv.full_name, inv.organization_id, NULL::TEXT, NULL::TEXT, inv.role,
      'This invitation has expired'::TEXT;
    RETURN;
  END IF;

  -- Get organization details
  SELECT * INTO org FROM organizations WHERE id = inv.organization_id;

  -- Valid invitation
  RETURN QUERY SELECT
    TRUE, inv.id, inv.email, inv.full_name, inv.organization_id, org.name, org.slug, inv.role,
    NULL::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE invitation_tokens IS 'Pending invitations to join organizations';
COMMENT ON COLUMN invitation_tokens.token IS 'Secure token sent in invitation email';
COMMENT ON COLUMN invitation_tokens.expires_at IS 'When the invitation expires (typically 7 days)';
COMMENT ON COLUMN invitation_tokens.accepted_at IS 'When the invitee accepted and joined';
COMMENT ON COLUMN invitation_tokens.revoked_at IS 'When the invitation was cancelled by admin';
