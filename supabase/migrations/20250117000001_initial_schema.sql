-- Springboard Platform - Initial Database Schema
-- Generated: 2025-11-17
-- Description: Complete schema for Phase 1A/B/C (all tables)

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pgvector";

-- ============================================================================
-- TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. ORGANIZATIONS
-- ----------------------------------------------------------------------------
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,

  -- Location
  location_city TEXT,
  location_region TEXT,
  location_country TEXT,
  timezone TEXT,

  -- Contact
  website_url TEXT,
  contact_email TEXT,

  -- Settings
  is_active BOOLEAN DEFAULT TRUE,
  visibility_level TEXT DEFAULT 'network' CHECK (visibility_level IN ('private', 'network', 'public')),

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by_user_id UUID, -- Will reference users(id) after users table is created

  -- Search
  tsv TSVECTOR
);

-- Indexes
CREATE INDEX organizations_slug_idx ON organizations(slug);
CREATE INDEX organizations_tsv_idx ON organizations USING GIN(tsv);
CREATE INDEX organizations_active_idx ON organizations(is_active) WHERE is_active = TRUE;

-- ----------------------------------------------------------------------------
-- 2. USERS
-- ----------------------------------------------------------------------------
-- Note: This table stores application user data
-- Supabase auth.users handles authentication
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,

  -- Profile
  full_name TEXT NOT NULL,
  avatar_url TEXT,

  -- Account status
  email_confirmed_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Security
  failed_login_attempts INT DEFAULT 0,
  locked_until TIMESTAMPTZ
);

-- Add foreign key to organizations now that users table exists
ALTER TABLE organizations
  ADD CONSTRAINT organizations_created_by_fkey
  FOREIGN KEY (created_by_user_id) REFERENCES users(id);

-- Indexes
CREATE INDEX users_email_idx ON users(email);
CREATE INDEX users_active_idx ON users(is_active) WHERE is_active = TRUE;

-- ----------------------------------------------------------------------------
-- 3. ORGANIZATION_MEMBERSHIPS
-- ----------------------------------------------------------------------------
CREATE TABLE organization_memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Role & permissions
  role TEXT NOT NULL CHECK (role IN ('primary_admin', 'backup_admin', 'contributor', 'viewer')),
  permissions JSONB DEFAULT '{}',

  -- Metadata
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  invited_by_user_id UUID REFERENCES users(id),
  invitation_accepted_at TIMESTAMPTZ,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,

  UNIQUE(organization_id, user_id)
);

-- Indexes
CREATE INDEX org_memberships_org_idx ON organization_memberships(organization_id);
CREATE INDEX org_memberships_user_idx ON organization_memberships(user_id);
CREATE INDEX org_memberships_role_idx ON organization_memberships(role);

-- ----------------------------------------------------------------------------
-- 4. SERVICE_PROVIDERS
-- ----------------------------------------------------------------------------
CREATE TABLE service_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Identity
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  website_url TEXT,
  photo_url TEXT,

  -- Profile
  bio TEXT,
  specialties TEXT[] DEFAULT '{}',
  modalities TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',

  -- Location & availability
  location_city TEXT,
  location_region TEXT,
  location_country TEXT,
  timezone TEXT,
  offers_remote BOOLEAN DEFAULT TRUE,
  offers_in_person BOOLEAN DEFAULT FALSE,

  -- Capacity management
  is_accepting_clients BOOLEAN DEFAULT TRUE,
  is_visible BOOLEAN DEFAULT TRUE,
  availability_note TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by_user_id UUID REFERENCES users(id),
  last_edited_by_user_id UUID REFERENCES users(id),

  -- Search
  tsv TSVECTOR
);

-- Indexes
CREATE INDEX service_providers_specialties_idx ON service_providers USING GIN(specialties);
CREATE INDEX service_providers_modalities_idx ON service_providers USING GIN(modalities);
CREATE INDEX service_providers_languages_idx ON service_providers USING GIN(languages);
CREATE INDEX service_providers_location_idx ON service_providers(location_country, location_region, location_city);
CREATE INDEX service_providers_tsv_idx ON service_providers USING GIN(tsv);
CREATE INDEX service_providers_visible_idx ON service_providers(is_visible, is_accepting_clients) WHERE is_visible = TRUE;

-- ----------------------------------------------------------------------------
-- 5. SERVICE_PROVIDER_RECOMMENDATIONS
-- ----------------------------------------------------------------------------
CREATE TABLE service_provider_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  service_provider_id UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  recommended_by_user_id UUID NOT NULL REFERENCES users(id),

  -- Recommendation details
  relationship_note TEXT,
  would_recommend_for TEXT[] DEFAULT '{}',

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(service_provider_id, organization_id)
);

-- Indexes
CREATE INDEX sp_recommendations_provider_idx ON service_provider_recommendations(service_provider_id);
CREATE INDEX sp_recommendations_org_idx ON service_provider_recommendations(organization_id);

-- ----------------------------------------------------------------------------
-- 6. RESEARCH_DOCUMENTS
-- ----------------------------------------------------------------------------
CREATE TABLE research_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  uploaded_by_user_id UUID NOT NULL REFERENCES users(id),

  -- Document info
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size_bytes BIGINT,
  mime_type TEXT,

  -- Metadata
  publication_year INT,
  authors TEXT[] DEFAULT '{}',
  doi TEXT,

  -- Categorization
  tags TEXT[] DEFAULT '{}',
  topics TEXT[] DEFAULT '{}',
  research_type TEXT,

  -- Visibility
  visibility_level TEXT DEFAULT 'network' CHECK (visibility_level IN ('private', 'network', 'public')),

  -- RAG/AI processing
  is_processed BOOLEAN DEFAULT FALSE,
  processing_status TEXT CHECK (processing_status IN ('pending', 'processing', 'complete', 'failed')),
  embeddings_generated BOOLEAN DEFAULT FALSE,
  extracted_text TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Search
  tsv TSVECTOR
);

-- Indexes
CREATE INDEX research_documents_org_idx ON research_documents(organization_id);
CREATE INDEX research_documents_tags_idx ON research_documents USING GIN(tags);
CREATE INDEX research_documents_topics_idx ON research_documents USING GIN(topics);
CREATE INDEX research_documents_tsv_idx ON research_documents USING GIN(tsv);
CREATE INDEX research_documents_visibility_idx ON research_documents(visibility_level);

-- ----------------------------------------------------------------------------
-- 7. DOCUMENT_EMBEDDINGS (For RAG/AI Search)
-- ----------------------------------------------------------------------------
CREATE TABLE document_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  research_document_id UUID NOT NULL REFERENCES research_documents(id) ON DELETE CASCADE,

  -- Chunking
  chunk_index INT NOT NULL,
  chunk_text TEXT NOT NULL,
  page_number INT,

  -- Vector embedding (OpenAI ada-002: 1536 dimensions)
  embedding VECTOR(1536),

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(research_document_id, chunk_index)
);

-- Indexes
CREATE INDEX document_embeddings_doc_idx ON document_embeddings(research_document_id);
CREATE INDEX document_embeddings_vector_idx ON document_embeddings USING ivfflat (embedding vector_cosine_ops);

-- ----------------------------------------------------------------------------
-- 8. SURVEYS
-- ----------------------------------------------------------------------------
CREATE TABLE surveys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Survey info
  title TEXT NOT NULL,
  description TEXT,
  version TEXT,

  -- Survey structure (flexible JSON)
  questions JSONB NOT NULL,
  scoring_logic JSONB,

  -- Baseline data
  is_baseline_survey BOOLEAN DEFAULT FALSE,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by_user_id UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT TRUE
);

-- Indexes
CREATE INDEX surveys_active_idx ON surveys(is_active) WHERE is_active = TRUE;

-- ----------------------------------------------------------------------------
-- 9. SURVEY_DEPLOYMENTS
-- ----------------------------------------------------------------------------
CREATE TABLE survey_deployments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  survey_id UUID NOT NULL REFERENCES surveys(id),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  deployed_by_user_id UUID NOT NULL REFERENCES users(id),

  -- Deployment config
  title TEXT,
  custom_intro_text TEXT,

  -- Access control
  is_anonymous BOOLEAN DEFAULT TRUE,
  requires_auth BOOLEAN DEFAULT FALSE,
  public_link TEXT UNIQUE,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  opens_at TIMESTAMPTZ,
  closes_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX survey_deployments_survey_idx ON survey_deployments(survey_id);
CREATE INDEX survey_deployments_org_idx ON survey_deployments(organization_id);
CREATE INDEX survey_deployments_public_link_idx ON survey_deployments(public_link);

-- ----------------------------------------------------------------------------
-- 10. SURVEY_RESPONSES
-- ----------------------------------------------------------------------------
CREATE TABLE survey_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  survey_deployment_id UUID NOT NULL REFERENCES survey_deployments(id) ON DELETE CASCADE,

  -- Respondent info (minimal for privacy)
  respondent_id UUID REFERENCES users(id),
  respondent_metadata JSONB,

  -- Response data
  answers JSONB NOT NULL,
  scores JSONB,

  -- Metadata
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address_hash TEXT,

  -- Consent
  consented_to_research BOOLEAN DEFAULT FALSE
);

-- Indexes
CREATE INDEX survey_responses_deployment_idx ON survey_responses(survey_deployment_id);
CREATE INDEX survey_responses_submitted_idx ON survey_responses(submitted_at);

-- ----------------------------------------------------------------------------
-- 11. ACTIVITY_LOGS (Audit Trail)
-- ----------------------------------------------------------------------------
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Actor
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,

  -- Action
  action_type TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,

  -- Context
  details JSONB,
  ip_address INET,
  user_agent TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX activity_logs_user_idx ON activity_logs(user_id);
CREATE INDEX activity_logs_org_idx ON activity_logs(organization_id);
CREATE INDEX activity_logs_action_idx ON activity_logs(action_type);
CREATE INDEX activity_logs_created_idx ON activity_logs(created_at DESC);
CREATE INDEX activity_logs_resource_idx ON activity_logs(resource_type, resource_id);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER service_providers_updated_at BEFORE UPDATE ON service_providers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER sp_recommendations_updated_at BEFORE UPDATE ON service_provider_recommendations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER research_documents_updated_at BEFORE UPDATE ON research_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER survey_deployments_updated_at BEFORE UPDATE ON survey_deployments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TRIGGERS FOR FULL-TEXT SEARCH (TSV)
-- ============================================================================

CREATE OR REPLACE FUNCTION update_organizations_tsv()
RETURNS TRIGGER AS $$
BEGIN
  NEW.tsv =
    setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.location_city, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER organizations_tsv_update BEFORE INSERT OR UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_organizations_tsv();

CREATE OR REPLACE FUNCTION update_service_providers_tsv()
RETURNS TRIGGER AS $$
BEGIN
  NEW.tsv =
    setweight(to_tsvector('english', COALESCE(NEW.full_name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.bio, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.specialties, ' '), '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.modalities, ' '), '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER service_providers_tsv_update BEFORE INSERT OR UPDATE ON service_providers
  FOR EACH ROW EXECUTE FUNCTION update_service_providers_tsv();

CREATE OR REPLACE FUNCTION update_research_documents_tsv()
RETURNS TRIGGER AS $$
BEGIN
  NEW.tsv =
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.extracted_text, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER research_documents_tsv_update BEFORE INSERT OR UPDATE ON research_documents
  FOR EACH ROW EXECUTE FUNCTION update_research_documents_tsv();

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to get aggregate survey statistics (privacy-preserving)
CREATE OR REPLACE FUNCTION get_deployment_aggregate_stats(deployment_id UUID)
RETURNS JSON
SECURITY DEFINER
AS $$
  SELECT json_build_object(
    'total_responses', COUNT(*),
    'avg_wellbeing_score', AVG((scores->>'overall_wellbeing')::FLOAT),
    'completion_rate', COUNT(*) FILTER (WHERE answers IS NOT NULL)::FLOAT / NULLIF(COUNT(*), 0),
    'consented_count', COUNT(*) FILTER (WHERE consented_to_research = TRUE)
  )
  FROM survey_responses
  WHERE survey_deployment_id = deployment_id;
$$ LANGUAGE SQL;

-- Function to generate slug from name
CREATE OR REPLACE FUNCTION generate_slug(name TEXT)
RETURNS TEXT AS $$
  SELECT lower(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
$$ LANGUAGE SQL IMMUTABLE;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE organizations IS 'Member organizations in the WBP network';
COMMENT ON TABLE users IS 'Individual users (private, only visible within their org)';
COMMENT ON TABLE organization_memberships IS 'Links users to organizations with roles/permissions';
COMMENT ON TABLE service_providers IS 'Coaches, therapists, facilitators (publicly visible to network)';
COMMENT ON TABLE service_provider_recommendations IS 'Trust signals: which orgs recommend which providers';
COMMENT ON TABLE research_documents IS 'PDFs and documents shared by organizations';
COMMENT ON TABLE document_embeddings IS 'Vector embeddings for RAG/AI semantic search';
COMMENT ON TABLE surveys IS 'Survey templates (e.g., Richie''s baseline assessment)';
COMMENT ON TABLE survey_deployments IS 'Organization-specific survey deployments';
COMMENT ON TABLE survey_responses IS 'Individual survey responses (privacy-protected, aggregate-only access)';
COMMENT ON TABLE activity_logs IS 'Audit trail for security and accountability';
