# Springboard Platform - MVP Design Plan
**Version 1.0 | Created: 2025-11-17**

## Executive Summary

A secure, privacy-first resource platform for the Wellbeing Project ecosystem. Organizations connect to find trusted service providers (coaches/therapists), share research, and deploy validated wellbeing assessments. Not a social platform - a springboard to access what you need and move forward.

---

## Core Design Decisions

### 1. User Model: Hybrid Organization-First
- **Organizations are primary users** with accounts and logins
- **Individuals exist within orgs** with different permission levels
- **Service providers (coaches/therapists)** are the only "individual profiles" visible across platform
- **Privacy-first**: People don't speak as themselves publicly (can be toggled on/off in future)
- **No member-to-member communication** - not a social network

### 2. Authentication & Security
- **Email + password** authentication (no Google SSO for MVP - maintain control)
- **Primary admin + backup admin** required per organization
- **Hardened security** - protection from state actors, encrypted data
- **Admin panel** for Wellbeing Project to manage organizations

### 3. Core Features (MVP Scope)
1. **Service Provider Registry** (org-mediated only - Option A)
   - Organizations recommend coaches/therapists they've worked with
   - Searchable directory by specialty, location, language, modality
   - Contact info displayed, users reach out off-platform

2. **Research Repository** with RAG/AI search
   - Organizations upload PDFs/documents
   - Gallery page for organization's research
   - Gallery page for tags/topics across all research
   - AI-powered search within all PDFs
   - Post-MVP: Process research for visualizations/insights

3. **Wellbeing Survey Tool**
   - Organizations deploy surveys to their communities
   - Org admin sees their own data
   - Wellbeing Project has access to aggregate/anonymized data
   - Contributes to field baseline
   - Internal to org but hosted on platform

### 4. What We're NOT Building (Scope Boundaries)
- ❌ No social network features (chat, forums, feeds)
- ❌ No direct member-to-member communication
- ❌ No payment processing or booking systems
- ❌ No calendar/events system (MVP - maybe later)
- ❌ No self-registration for service providers (org-mediated only)
- ❌ No public visibility (all network-only for pilot)

---

## User Types & Their Values

### User Type 1: Organization Admin (Primary)
**Who they are:**
- Leaders of social justice, education, community organizing orgs
- Responsible for team wellbeing and capacity
- Often burned out themselves, juggling many responsibilities
- Part of Wellbeing Project network

**Their core values:**
- **Trust & safety**: Need to protect their team from exposure
- **Efficiency**: No time for complex systems or homework
- **Reciprocity**: Want to give back to the network that supports them
- **Quality over quantity**: Need vetted, trusted resources, not endless options
- **Autonomy**: Want control over what they share and with whom

**What they need:**
- Quick access to trusted therapists/coaches when team member needs support
- Ability to share what works (resources, research) without bureaucracy
- See their team's wellbeing trends without surveillance feel
- Know they're contributing to something larger than themselves
- Minimal time investment (springboard, not platform)

**Pain points:**
- Constantly fielding "who do you know who...?" requests
- Repeating same recommendations over and over
- Fear of data being used against them (funders, government)
- Survey fatigue, form fatigue, platform fatigue
- Losing institutional knowledge when people leave

**User journey:**
1. Gets invite from Wellbeing Project
2. Creates org account (5 min setup with backup admin)
3. Adds 2-3 trusted coaches they've worked with
4. Searches for therapist specializing in racial trauma in Seattle
5. Finds one, contacts off-platform, done
6. Returns quarterly to update, check new resources
7. Maybe deploys wellbeing survey once/year

---

### User Type 2: Organization Member (Secondary Admin / Contributor)
**Who they are:**
- Operations manager, wellbeing lead, or trusted team member
- Delegated to manage org's presence on platform
- May have more time than primary admin to engage

**Their core values:**
- **Stewardship**: Taking care of the organization's knowledge
- **Connection**: Want org to benefit from network
- **Reliability**: Don't want to drop the ball on something important
- **Learning**: Interested in what other orgs are doing

**What they need:**
- Clear permissions (what can I edit? what can I see?)
- Easy way to add/update service provider recommendations
- Upload research their org has done
- Browse what other orgs have shared
- Run reports if they're wellbeing lead

**Pain points:**
- Unclear delegation (am I supposed to do this?)
- Not knowing what's been shared already
- Accidentally sharing something that should be private
- Losing track of who recommended whom

**User journey:**
1. Gets invited by primary admin
2. Logs in, sees org dashboard
3. Uploads recent research report on youth burnout
4. Adds new coach org just started working with
5. Browses research gallery, downloads 2 relevant PDFs
6. Helps admin review wellbeing survey results

---

### User Type 3: Service Provider (Coach/Therapist)
**Who they are:**
- Coaches, therapists, facilitators, healers working with changemakers
- Recommended by orgs they've worked with
- May serve multiple orgs in the network
- Often work independently or small group practice

**Their core values:**
- **Integrity**: Want accurate representation of their work
- **Accessibility**: Want to be found by people who need them
- **Relationship-based**: Trust comes through referrals, not ads
- **Boundary-aware**: Respect privacy of clients/orgs
- **Quality practice**: Want right-fit clients, not volume

**What they need:**
- Profile that shows their specialties accurately
- Know which orgs have recommended them (trust signal)
- Keep contact info current
- Manage their capacity (maybe pause visibility if full)
- See profile as others see it

**Pain points:**
- Don't have time to manage multiple platforms
- Profile gets out of date quickly
- Getting contacted by people who aren't right fit
- Unclear if someone was referred or cold contact

**User journey:**
1. Gets email: "Org X recommended you on Wellbeing Project Springboard"
2. Clicks link, creates profile (name, specialty, contact, bio)
3. Sees "Recommended by: [Org X, Org Y]" as trust signal
4. Updates profile quarterly or when contact info changes
5. Receives inquiry directly via email (off-platform)
6. Occasionally logs in to update availability

---

### User Type 4: Wellbeing Project Admin (Platform Steward)
**Who they are:**
- Aaron, Ale, or designated WBP staff
- Responsible for platform integrity and community safety
- Relationship with all orgs, high trust

**Their core values:**
- **Protection**: Keep community safe from external threats
- **Emergence**: Want to see patterns, connections, possibilities
- **Stewardship**: Light touch facilitation, not control
- **Movement-building**: This serves something larger

**What they need:**
- See all orgs, manage access, handle edge cases
- Aggregate view of wellbeing data (never individual-level)
- Ability to message/notify orgs about updates
- See what resources are being shared/accessed
- Manage service provider verification/quality
- Handle organizational transitions (admin leaves, etc.)

**Pain points:**
- Can't scale 1:1 support for all orgs
- Need to protect data while making it useful
- Balancing openness with security
- Unclear boundaries (how much curation? quality control?)

**User journey:**
1. Logs into admin panel daily/weekly
2. Approves new org registrations (pilot phase)
3. Reviews flagged service provider profiles
4. Exports aggregate wellbeing data for Richie's research
5. Sends quarterly pulse to all orgs: "Update your profiles!"
6. Handles edge case: admin left org, needs to transfer account

---

### User Type 5: Future Individual Member (Post-MVP)
**Who they are:**
- Changemakers, organizers, educators in the ecosystem
- Part of an org, but also their own person
- Value personal connection and peer learning

**Their values (for future consideration):**
- **Belonging**: Want to know who else is in this movement
- **Peer learning**: Learn from others doing similar work
- **Offering gifts**: Have skills/knowledge to share
- **Receiving support**: Sometimes need help, resources

**Why they're not in MVP:**
- Privacy concerns (state actors, exposure risk)
- Keeps scope focused (springboard not social network)
- Can be added later with privacy toggles
- Pilot tests if org-level is sufficient first

---

## Database Schema Design

### Core Principles:
1. **Organizational privacy by default** - individuals obscured
2. **Service provider visibility** - they need to be discoverable
3. **Audit trails** - who added what, when (for security/integrity)
4. **Flexible permissions** - role-based access control
5. **Encryption-ready** - sensitive data can be encrypted at rest

---

### Tables & Relationships

#### 1. `organizations`
Primary entity representing member organizations.

```sql
organizations (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                  TEXT NOT NULL,
  slug                  TEXT UNIQUE NOT NULL,  -- URL-friendly: "acme-social-justice"
  description           TEXT,
  location_city         TEXT,
  location_region       TEXT,
  location_country      TEXT,
  timezone              TEXT,
  website_url           TEXT,
  contact_email         TEXT,

  -- Metadata
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),
  created_by_user_id    UUID REFERENCES users(id),

  -- Settings
  is_active             BOOLEAN DEFAULT TRUE,
  visibility_level      TEXT DEFAULT 'network',  -- 'network', 'private', 'public'

  -- Search/indexing
  tsv                   TSVECTOR  -- Full-text search vector
)
```

**Indexes:**
- `organizations_slug_idx` on `slug`
- `organizations_tsv_idx` on `tsv` (GIN index for full-text search)

---

#### 2. `users`
Individual people who can log into the system. Tied to organizations through membership.

```sql
users (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email                 TEXT UNIQUE NOT NULL,
  encrypted_password    TEXT NOT NULL,  -- bcrypt hashed

  -- Profile (minimal for privacy)
  full_name             TEXT NOT NULL,
  avatar_url            TEXT,

  -- Account status
  email_confirmed_at    TIMESTAMPTZ,
  is_active             BOOLEAN DEFAULT TRUE,
  last_login_at         TIMESTAMPTZ,

  -- Metadata
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),

  -- Security
  failed_login_attempts INT DEFAULT 0,
  locked_until          TIMESTAMPTZ
)
```

**Notes:**
- Users are never exposed publicly
- Only visible within their own organization
- Email is login identifier

---

#### 3. `organization_memberships`
Junction table linking users to organizations with roles/permissions.

```sql
organization_memberships (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id       UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Role & permissions
  role                  TEXT NOT NULL,  -- 'primary_admin', 'backup_admin', 'contributor', 'viewer'

  -- Permissions (JSON for flexibility)
  permissions           JSONB DEFAULT '{}',
  -- Example: {"can_add_service_providers": true, "can_upload_research": true, "can_view_surveys": true}

  -- Metadata
  joined_at             TIMESTAMPTZ DEFAULT NOW(),
  invited_by_user_id    UUID REFERENCES users(id),
  invitation_accepted_at TIMESTAMPTZ,

  -- Status
  is_active             BOOLEAN DEFAULT TRUE,

  UNIQUE(organization_id, user_id)
)
```

**Roles:**
- `primary_admin`: Full control, can delete org, manage all members
- `backup_admin`: Same as primary, for continuity
- `contributor`: Can add service providers, upload research, deploy surveys
- `viewer`: Read-only access to org's data

---

#### 4. `service_providers`
Coaches, therapists, facilitators discoverable across the network.

```sql
service_providers (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Identity
  full_name             TEXT NOT NULL,
  email                 TEXT,  -- Optional - they may want contact form instead
  phone                 TEXT,
  website_url           TEXT,
  photo_url             TEXT,

  -- Profile
  bio                   TEXT,  -- Rich text / markdown
  specialties           TEXT[],  -- Array: ['trauma', 'burnout', 'racial healing']
  modalities            TEXT[],  -- ['CBT', 'somatic', 'coaching', 'group facilitation']
  languages             TEXT[],  -- ['English', 'Spanish', 'Arabic']

  -- Location & availability
  location_city         TEXT,
  location_region       TEXT,
  location_country      TEXT,
  timezone              TEXT,
  offers_remote         BOOLEAN DEFAULT TRUE,
  offers_in_person      BOOLEAN DEFAULT FALSE,

  -- Capacity management
  is_accepting_clients  BOOLEAN DEFAULT TRUE,
  availability_note     TEXT,  -- "Accepting new clients starting March 2026"

  -- Metadata
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),
  created_by_user_id    UUID REFERENCES users(id),  -- Who added them initially

  -- Search
  tsv                   TSVECTOR
)
```

**Indexes:**
- `service_providers_specialties_idx` on `specialties` (GIN index)
- `service_providers_tsv_idx` on `tsv` (GIN index)
- `service_providers_location_idx` on `(location_country, location_region, location_city)`

---

#### 5. `service_provider_recommendations`
Organizations recommend service providers (trust signal).

```sql
service_provider_recommendations (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  service_provider_id   UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  organization_id       UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  recommended_by_user_id UUID NOT NULL REFERENCES users(id),  -- Who in the org added this

  -- Recommendation details
  relationship_note     TEXT,  -- "Worked with our team for 6 months on burnout"
  would_recommend_for   TEXT[],  -- ['trauma', 'leadership coaching']

  -- Metadata
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(service_provider_id, organization_id)
)
```

**This creates the trust signal:**
- "Coach Jane - Recommended by 3 organizations"
- Orgs can see which other orgs recommended someone

---

#### 6. `research_documents`
PDFs, reports, studies uploaded by organizations.

```sql
research_documents (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id       UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  uploaded_by_user_id   UUID NOT NULL REFERENCES users(id),

  -- Document info
  title                 TEXT NOT NULL,
  description           TEXT,
  file_url              TEXT NOT NULL,  -- S3/Supabase Storage URL
  file_name             TEXT NOT NULL,
  file_size_bytes       BIGINT,
  mime_type             TEXT,  -- 'application/pdf'

  -- Metadata
  publication_year      INT,
  authors               TEXT[],
  doi                   TEXT,  -- Digital Object Identifier if applicable

  -- Categorization
  tags                  TEXT[],  -- ['burnout', 'youth', 'survey-results']
  topics                TEXT[],  -- ['mental health', 'collective wellbeing']
  research_type         TEXT,   -- 'survey', 'case-study', 'report', 'white-paper'

  -- Visibility
  visibility_level      TEXT DEFAULT 'network',  -- 'private', 'network', 'public'

  -- RAG/AI processing
  is_processed          BOOLEAN DEFAULT FALSE,
  processing_status     TEXT,  -- 'pending', 'processing', 'complete', 'failed'
  embeddings_generated  BOOLEAN DEFAULT FALSE,
  extracted_text        TEXT,  -- Full text extraction for search

  -- Metadata
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),

  -- Search
  tsv                   TSVECTOR
)
```

**Indexes:**
- `research_documents_org_idx` on `organization_id`
- `research_documents_tags_idx` on `tags` (GIN)
- `research_documents_tsv_idx` on `tsv` (GIN)

---

#### 7. `document_embeddings` (For RAG/AI Search)
Vector embeddings for semantic search within research documents.

```sql
document_embeddings (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  research_document_id  UUID NOT NULL REFERENCES research_documents(id) ON DELETE CASCADE,

  -- Chunking (documents split into smaller pieces)
  chunk_index           INT NOT NULL,
  chunk_text            TEXT NOT NULL,
  page_number           INT,

  -- Vector embedding
  embedding             VECTOR(1536),  -- OpenAI ada-002 embedding dimension

  -- Metadata
  created_at            TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(research_document_id, chunk_index)
)
```

**Notes:**
- Requires `pgvector` extension for Postgres
- Enables semantic search: "Find research about youth burnout interventions"
- Can return exact page/paragraph reference

---

#### 8. `surveys`
Wellbeing survey templates (e.g., Richie's assessment).

```sql
surveys (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Survey info
  title                 TEXT NOT NULL,
  description           TEXT,
  version               TEXT,  -- 'v1.0', 'v2.0'

  -- Survey structure (JSON for flexibility)
  questions             JSONB NOT NULL,
  -- Example: [
  --   {"id": "q1", "type": "likert", "text": "How resourced do you feel?", "scale": 5},
  --   {"id": "q2", "type": "text", "text": "What's alive for you this season?"}
  -- ]

  scoring_logic         JSONB,  -- How to calculate scores/dimensions

  -- Baseline data
  is_baseline_survey    BOOLEAN DEFAULT FALSE,

  -- Metadata
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  created_by_user_id    UUID REFERENCES users(id),
  is_active             BOOLEAN DEFAULT TRUE
)
```

---

#### 9. `survey_deployments`
Organizations deploy surveys to their communities.

```sql
survey_deployments (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  survey_id             UUID NOT NULL REFERENCES surveys(id),
  organization_id       UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  deployed_by_user_id   UUID NOT NULL REFERENCES users(id),

  -- Deployment config
  title                 TEXT,  -- Org can customize title
  custom_intro_text     TEXT,

  -- Access control
  is_anonymous          BOOLEAN DEFAULT TRUE,
  requires_auth         BOOLEAN DEFAULT FALSE,
  public_link           TEXT UNIQUE,  -- Random token for public access

  -- Status
  is_active             BOOLEAN DEFAULT TRUE,
  opens_at              TIMESTAMPTZ,
  closes_at             TIMESTAMPTZ,

  -- Metadata
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
)
```

---

#### 10. `survey_responses`
Individual survey responses (anonymized for privacy).

```sql
survey_responses (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  survey_deployment_id  UUID NOT NULL REFERENCES survey_deployments(id) ON DELETE CASCADE,

  -- Respondent info (minimal for privacy)
  respondent_id         UUID,  -- NULL if anonymous, references users(id) if authenticated
  respondent_metadata   JSONB,  -- {"role": "team-member", "tenure_years": 3} - no PII

  -- Response data
  answers               JSONB NOT NULL,
  -- Example: {"q1": 3, "q2": "I'm feeling stretched but hopeful"}

  -- Calculated scores
  scores                JSONB,  -- {"overall_wellbeing": 3.2, "burnout_risk": 2.1}

  -- Metadata
  submitted_at          TIMESTAMPTZ DEFAULT NOW(),
  ip_address_hash       TEXT,  -- Hashed for duplicate detection, not tracking

  -- Consent
  consented_to_research BOOLEAN DEFAULT FALSE
)
```

**Privacy notes:**
- Individual responses NEVER exposed to org admins (only aggregates)
- Wellbeing Project can access for research with consent
- IP addresses hashed to prevent duplicate responses without tracking

---

#### 11. `activity_logs` (Audit Trail)
Track important actions for security and integrity.

```sql
activity_logs (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Actor
  user_id               UUID REFERENCES users(id) ON DELETE SET NULL,
  organization_id       UUID REFERENCES organizations(id) ON DELETE SET NULL,

  -- Action
  action_type           TEXT NOT NULL,  -- 'user.login', 'service_provider.added', 'research.uploaded'
  resource_type         TEXT,  -- 'service_provider', 'research_document'
  resource_id           UUID,

  -- Context
  details               JSONB,  -- Flexible metadata about the action
  ip_address            INET,
  user_agent            TEXT,

  -- Metadata
  created_at            TIMESTAMPTZ DEFAULT NOW()
)
```

**Partitioning recommended** - partition by created_at (monthly) for performance.

---

### Row-Level Security (RLS) Policies

Supabase's RLS ensures users can only access data they're authorized to see.

#### Example: `organizations` table

```sql
-- Org members can see their own org
CREATE POLICY "Members can view own organization"
ON organizations FOR SELECT
USING (
  id IN (
    SELECT organization_id
    FROM organization_memberships
    WHERE user_id = auth.uid() AND is_active = TRUE
  )
);

-- All network members can see basic org info
CREATE POLICY "Network members can view other orgs (basic info)"
ON organizations FOR SELECT
USING (
  visibility_level IN ('network', 'public')
  AND auth.uid() IN (SELECT user_id FROM organization_memberships WHERE is_active = TRUE)
);

-- Only admins can update their org
CREATE POLICY "Admins can update own organization"
ON organizations FOR UPDATE
USING (
  id IN (
    SELECT organization_id
    FROM organization_memberships
    WHERE user_id = auth.uid()
      AND role IN ('primary_admin', 'backup_admin')
      AND is_active = TRUE
  )
);
```

#### Example: `service_providers` table

```sql
-- All network members can view service providers
CREATE POLICY "Network members can view service providers"
ON service_providers FOR SELECT
USING (
  auth.uid() IN (SELECT user_id FROM organization_memberships WHERE is_active = TRUE)
);

-- Contributors and admins can add service providers
CREATE POLICY "Contributors can add service providers"
ON service_providers FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT user_id
    FROM organization_memberships
    WHERE role IN ('primary_admin', 'backup_admin', 'contributor')
      AND is_active = TRUE
  )
);
```

#### Example: `survey_responses` table (Privacy-critical)

```sql
-- NO ONE can view individual responses (only aggregate queries via functions)
-- This table has NO select policies for regular users

-- Only WBP admins can access via special database functions with aggregation
CREATE POLICY "No direct access to survey responses"
ON survey_responses FOR SELECT
USING (FALSE);  -- Blocks all direct queries

-- Create database function for aggregate-only access
CREATE FUNCTION get_deployment_aggregate_stats(deployment_id UUID)
RETURNS JSON
SECURITY DEFINER  -- Runs with elevated privileges
AS $$
  SELECT json_build_object(
    'total_responses', COUNT(*),
    'avg_wellbeing_score', AVG((scores->>'overall_wellbeing')::FLOAT),
    'completion_rate', AVG(CASE WHEN answers IS NOT NULL THEN 1 ELSE 0 END)
  )
  FROM survey_responses
  WHERE survey_deployment_id = deployment_id;
$$ LANGUAGE SQL;
```

---

## Phased Implementation Roadmap

### Phase 1A: Foundation (Weeks 1-4)
**Goal:** Organizations can register, manage members, add/search service providers.

**Week 1: Auth & Organization Setup**
- [ ] Database schema implementation (all tables)
- [ ] Supabase project setup + RLS policies
- [ ] User registration/login (email + password)
- [ ] Organization creation workflow
- [ ] Primary + backup admin designation
- [ ] Basic user invitation system

**Week 2: Service Provider Registry**
- [ ] Service provider profile creation (by org members)
- [ ] Recommendation system (link provider to org)
- [ ] Search interface (filter by specialty, location, language)
- [ ] Service provider detail page
- [ ] Contact info display (email/phone/website)

**Week 3: Organization Dashboard**
- [ ] Org profile page (editable by admins)
- [ ] Member management (invite, remove, change roles)
- [ ] List of service providers org has recommended
- [ ] Activity feed (who added what, when)

**Week 4: Admin Panel (WBP)**
- [ ] WBP admin authentication
- [ ] View all organizations
- [ ] Approve/deactivate orgs (pilot phase)
- [ ] View all service providers
- [ ] Handle org transitions (transfer primary admin)
- [ ] Basic analytics dashboard

**Deliverable:** Working pilot with 10 orgs, 30+ service providers searchable.

---

### Phase 1B: Research Repository (Weeks 5-8)
**Goal:** Organizations can upload, tag, search, and discover research with AI assistance.

**Week 5: Document Upload & Management**
- [ ] File upload to Supabase Storage (PDFs only MVP)
- [ ] Document metadata form (title, description, year, tags)
- [ ] Organization's research gallery page
- [ ] Edit/delete documents (by org members)
- [ ] Visibility controls (private vs network-shared)

**Week 6: Research Discovery**
- [ ] Research library (all network-shared documents)
- [ ] Filter by tag, topic, research type, year
- [ ] Full-text search (title, description, extracted text)
- [ ] Tag gallery page (browse by topic)
- [ ] Document detail page with download

**Week 7-8: RAG/AI Search (Stretch Goal)**
- [ ] PDF text extraction pipeline
- [ ] Generate embeddings (OpenAI API or open source)
- [ ] Store in `document_embeddings` table
- [ ] AI search interface: "Find research about youth burnout interventions"
- [ ] Response includes: relevant chunks + page numbers + source PDFs

**Deliverable:** Research library with 20+ documents, searchable, AI-assisted discovery.

---

### Phase 1C: Survey Tool (Weeks 9-12)
**Goal:** Organizations can deploy wellbeing surveys, view aggregated results.

**Week 9: Survey Template Setup**
- [ ] Create Richie's baseline survey in database
- [ ] Survey builder UI (WBP admin creates templates)
- [ ] Question types: Likert scale, text, multiple choice
- [ ] Scoring logic configuration

**Week 10: Survey Deployment**
- [ ] Org admin deploys survey to their community
- [ ] Generate public link (no login required)
- [ ] Custom intro text per deployment
- [ ] Set open/close dates
- [ ] Survey response interface (clean, accessible)

**Week 11: Response Collection & Privacy**
- [ ] Anonymous response submission
- [ ] IP hash-based duplicate prevention
- [ ] Consent checkbox for research use
- [ ] Auto-calculate scores from answers
- [ ] Store securely (no PII)

**Week 12: Aggregate Reporting**
- [ ] Org admin dashboard: their deployment stats
  - Total responses, completion rate
  - Average scores by dimension
  - Time-series (if multiple deployments)
- [ ] WBP admin: cross-org aggregate (anonymous)
  - Field baseline calculation
  - Trend analysis
- [ ] Export to CSV (aggregated only)

**Deliverable:** 10 orgs deploy wellbeing survey to their communities, WBP has baseline data.

---

### Post-MVP (Phase 2): Enhancements

**Visualization & Insights**
- Process research for automated insights
- Network graph: which orgs recommend which providers
- Heatmap: service provider coverage by geography
- Wellbeing trends over time

**Enhanced Search**
- Natural language: "Show me coaches in Oakland who work with Black organizers"
- Saved searches
- Email alerts for new matches

**Individual Profiles (Privacy-Optional)**
- Members can opt-in to have discoverable profiles
- "Offers & Needs" board (from original Hearth concept)
- Peer interviews (relational profile creation)

**Seasonal Rituals**
- Quarterly pulse check-ins
- Automated email: "Update your org's profile"
- Member spotlights

**API & Integrations**
- WhatsApp bot for search
- Slack integration
- Email digest of new resources

---

## Technical Stack Confirmation

Based on our conversation and decisions:

**Frontend:**
- **Next.js 14** (App Router)
- **TypeScript** (type safety critical for security)
- **Tailwind CSS** (modern, responsive, accessible)
- **shadcn/ui** (component library - professional, customizable)
- **React Hook Form + Zod** (form validation)

**Backend/Database:**
- **Supabase** (Postgres + Auth + Storage + RLS)
- **PostgreSQL 15+** with extensions:
  - `uuid-ossp` (UUID generation)
  - `pg_trgm` (fuzzy search)
  - `pgvector` (vector embeddings for RAG)

**AI/Search:**
- **OpenAI API** (embeddings + chat for RAG)
- **LangChain** (optional - RAG orchestration)
- **Pinecone** (alternative to pgvector if scale requires)

**Storage:**
- **Supabase Storage** (S3-compatible, RLS-aware)

**Email:**
- **Resend** (transactional emails, invitations)

**Deployment:**
- **Vercel** (Next.js optimized, edge functions)

**Monitoring/Security:**
- **Sentry** (error tracking)
- **PostHog** (privacy-friendly analytics)
- **Supabase Auth** (built-in security features)

**Cost Estimate (Monthly):**
- Supabase Pro: ~$25/month
- Vercel Pro: ~$20/month (if needed, free tier may suffice for pilot)
- OpenAI API: ~$50/month (depends on RAG usage)
- Resend: ~$10/month (low volume)
- **Total: ~$100-150/month for pilot**

---

## Security Architecture

### Threat Model
**Adversaries:**
- State actors seeking activist identities
- Malicious insiders (disgruntled former members)
- Data brokers/scrapers
- Accidental exposure (screenshots, misconfiguration)

**Assets to Protect:**
1. Organization member identities
2. Wellbeing assessment responses
3. Internal organizational data (burnout rates, etc.)
4. Network graph (who knows whom)

### Security Measures

**1. Data Encryption**
- **At rest:** Supabase encrypts all data by default (AES-256)
- **In transit:** TLS 1.3 for all connections
- **Sensitive fields:** Consider application-level encryption for:
  - Survey responses (encrypt before storing)
  - Organization member email addresses
  - Notes/metadata fields

**2. Authentication**
- Email + password (strong password requirements)
- Rate limiting on login attempts (5 failures = 15min lockout)
- Email verification required
- Session management: JWT with short expiry (1 hour), refresh tokens
- Optional: 2FA for admin accounts (Phase 2)

**3. Authorization (RLS)**
- Supabase Row-Level Security on ALL tables
- No data accessible without explicit policy
- Policies tested with automated tests
- Principle of least privilege

**4. Access Control**
- Role-based permissions (primary_admin, backup_admin, contributor, viewer)
- Audit logs for sensitive actions (admin changes, data exports)
- IP allowlisting for WBP admin panel (optional)

**5. Application Security**
- Input validation (Zod schemas)
- Parameterized queries (prevent SQL injection)
- CSRF protection (Next.js built-in)
- CSP headers (prevent XSS)
- No sensitive data in URLs/logs

**6. Privacy by Design**
- Survey responses: aggregated only, never individual
- User profiles: not exposed outside org
- Analytics: privacy-friendly (PostHog, not Google Analytics)
- No third-party trackers
- Cookie consent (GDPR/CCPA compliant)

**7. Incident Response**
- Automated backups (Supabase daily)
- Point-in-time recovery (7 days)
- Security contact: security@wellbeingproject.org
- Breach notification plan (72-hour window)

**8. Penetration Testing**
- Phase 2: Hire ethical hackers (post-pilot)
- Bug bounty program (if budget allows)
- Regular security audits

---

## Open Questions for Discussion

1. **Service Provider Verification**
   - Should WBP vet/approve service providers before they're visible?
   - Or trust org recommendations fully?
   - Flag system for quality concerns?

2. **Research Visibility Defaults**
   - When org uploads document, default to "private" or "network-shared"?
   - Should orgs explicitly opt-in to sharing?

3. **Survey Data Ownership**
   - Can org export their own raw responses?
   - Or only aggregated data to protect respondent privacy?

4. **Service Provider Updates**
   - Can service providers edit their own profiles?
   - Or must orgs update on their behalf?

5. **Budget & Timeline**
   - What's the budget for Phase 1A-C?
   - Target launch date for pilot?
   - Who's building this (you + team? external dev?)

6. **Pilot Organizations**
   - Which 10-30 orgs for pilot?
   - How to recruit them?
   - Support model during pilot (office hours? Slack channel?)

---

## Next Steps

To move forward, I recommend:

1. **Review this document** with Aaron/Ale - alignment on scope
2. **Answer open questions** above
3. **Set up development environment:**
   - Create Supabase project
   - Set up Next.js repo
   - Configure Vercel deployment

4. **Start Phase 1A implementation:**
   - Week 1: Database + auth
   - Week 2: Service provider registry
   - Week 3-4: Dashboards + admin panel

5. **User testing plan:**
   - Who are the first 3-5 orgs to test with?
   - Weekly check-ins during pilot?

---

**Let's kick it for Phase 1!** 🚀

What questions do you have? Should we start setting up the database schema in Supabase?
