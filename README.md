# Springboard Platform - Wellbeing Project

A secure, privacy-first resource platform for the Wellbeing Project ecosystem. Organizations connect to find trusted service providers, share research, and deploy validated wellbeing assessments.

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (https://supabase.com)
- A Vercel account (https://vercel.com) for deployment

### 1. Set Up Supabase

1. Create a new project at https://app.supabase.com
2. Get your project credentials from Settings → API
3. Run the database migrations:

```bash
# Navigate to your Supabase project's SQL Editor
# Copy and paste the contents of:
# - supabase/migrations/20250117000001_initial_schema.sql
# - supabase/migrations/20250117000002_rls_policies.sql
# Run them in order
```

**Important:** Update the `is_wbp_admin` function in the RLS policies migration:

```sql
-- Change this line in supabase/migrations/20250117000002_rls_policies.sql
-- From:
WHERE email LIKE '%@wellbeingproject.org'
-- To your actual domain:
WHERE email LIKE '%@yourdomain.org'
```

### 2. Set Up Environment Variables

```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Optional, for admin operations
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### 5. Create Your First User

Since this is a new database, you'll need to create your first user manually:

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add user" → "Create new user"
3. Enter email and password
4. Copy the user ID

Then, insert the user into your `users` table:

```sql
-- In Supabase SQL Editor
INSERT INTO users (id, email, full_name, is_active, email_confirmed_at)
VALUES (
  'paste-user-id-here',
  'your-email@wellbeingproject.org',
  'Your Name',
  true,
  NOW()
);
```

### 6. Create Your First Organization

```sql
-- In Supabase SQL Editor
INSERT INTO organizations (name, slug, created_by_user_id)
VALUES (
  'Wellbeing Project',
  'wellbeing-project',
  'paste-user-id-here'
);

-- Make yourself an admin
INSERT INTO organization_memberships (organization_id, user_id, role)
VALUES (
  (SELECT id FROM organizations WHERE slug = 'wellbeing-project'),
  'paste-user-id-here',
  'primary_admin'
);
```

Now you can log in at http://localhost:3000/login

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
```

## Project Structure

```
wbp-community/
├── app/                    # Next.js 14 App Router
│   ├── auth/              # Auth API routes
│   ├── dashboard/         # Main dashboard
│   ├── login/             # Login page
│   └── layout.tsx         # Root layout
├── lib/
│   └── supabase/          # Supabase clients
│       ├── client.ts      # Browser client
│       ├── server.ts      # Server client
│       └── middleware.ts  # Auth middleware
├── types/
│   └── database.ts        # TypeScript types from schema
├── supabase/
│   └── migrations/        # Database migrations
│       ├── 20250117000001_initial_schema.sql
│       └── 20250117000002_rls_policies.sql
├── hearthfiles/           # Design documentation
│   ├── mvp-design-plan.md
│   └── vx-audit-report.md
└── middleware.ts          # Next.js middleware for auth
```

## Database Schema

### Core Tables

1. **organizations** - Member organizations (primary entity)
2. **users** - Individual users (private, org-scoped)
3. **organization_memberships** - User-org relationships with roles
4. **service_providers** - Therapists/coaches (publicly visible)
5. **service_provider_recommendations** - Org → provider trust signals
6. **research_documents** - PDFs and research papers
7. **document_embeddings** - Vector embeddings for RAG/AI search
8. **surveys** - Survey templates
9. **survey_deployments** - Org-specific survey instances
10. **survey_responses** - Anonymous responses (aggregate-only access)
11. **activity_logs** - Audit trail

### User Roles

- **primary_admin** - Full control, can manage all aspects
- **backup_admin** - Same as primary (for continuity)
- **contributor** - Can add service providers, upload research
- **viewer** - Read-only access

### Default Permissions (JSONB)

Contributors have these permissions by default:
```json
{
  "can_add_service_providers": true,
  "can_upload_research": true,
  "can_view_surveys": true
}
```

## Security Architecture

### Row-Level Security (RLS)

All tables have RLS enabled. Key policies:

- **Organizations**: Members see own org, network members see others
- **Users**: Only visible within own organization
- **Service Providers**: Visible to all network members
- **Survey Responses**: NO direct access (aggregate-only via functions)
- **Research**: Respects visibility_level (private/network/public)

### Privacy Protections

1. **Individuals are obscured** - only visible within their org
2. **Survey responses are aggregate-only** - never exposed individually
3. **Audit logs** track actions without surveillance
4. **Encryption** at rest (Supabase default) and in transit (TLS)
5. **No third-party trackers**

### Hybrid Service Provider Editing

- **Providers control**: bio, photo, contact, availability
- **Organizations control**: recommendation text, relationship notes
- **Audit trail**: `last_edited_by_user_id` tracks changes

## Development Workflow

### Making Database Changes

1. Create a new migration file: `supabase/migrations/YYYYMMDD_description.sql`
2. Test locally in Supabase SQL Editor
3. Apply to production via Supabase Dashboard
4. Update `types/database.ts` if schema changed

### Adding Features

Follow this flow for values-aligned development:

1. **VALUES**: What user value does this serve? (Reference VX audit)
2. **DATABASE**: What data/tables needed?
3. **AFFORDANCES**: What can users DO?
4. **UX**: What's the experience?
5. **UI**: What do they see/click?
6. **CODE**: Implement with RLS policies

Example: Adding service provider search

- **VALUE**: "MOMENTS when finding help feels like a gift, not homework" (Marisol)
- **DATABASE**: `service_providers` table with `specialties[]`, RLS allows network viewing
- **AFFORDANCES**: Filter by specialty, location, language; see trust signals
- **UX**: Search → Filter → See results with "Recommended by X orgs" → Contact directly
- **UI**: Search bar, filter dropdowns, provider cards, contact button
- **CODE**: `/app/service-providers/page.tsx` with Supabase query

## Phase 1 Implementation Roadmap

### Phase 1A (Weeks 1-4): Foundation ✅ COMPLETE

- [x] Database schema (11 tables)
- [x] RLS policies (comprehensive)
- [x] Next.js project structure
- [x] Authentication (email + password)
- [x] Organization creation workflow
- [x] User invitation system
- [x] Service provider registry with trust signals
- [x] Admin panel (WBP)
- [x] Member management UI

### Phase 1B (Weeks 5-8): Research Repository ✅ COMPLETE

- [x] PDF upload to Supabase Storage
- [x] Research metadata forms
- [x] Organization research gallery
- [x] Network-wide research library
- [x] Tag-based discovery (25 tags, 12 topics)
- [x] Full-text search (PostgreSQL tsvector)
- [ ] RAG/AI search (future enhancement)

### Phase 1C (Weeks 9-12): Survey Tool ✅ COMPLETE

- [x] Survey template library (5 templates)
- [x] Survey deployment workflow (admin)
- [x] Anonymous response collection
- [x] Aggregate reporting dashboard
- [x] Privacy threshold enforcement (≥3 responses)
- [x] Time-series tracking
- [x] Export functionality (CSV, JSON)

## Key Design Decisions

### Why Organization-First?

**From VX Audit:** This serves Marisol (Org Director) and Aaron (WBP Steward) exceptionally well:
- Fast resource access (5-minute user journey)
- Privacy protection from state actors
- Distributed stewardship (not all through Aaron)
- Trust signals via org recommendations

**Trade-off:** Individual belonging needs (peer profiles, peer witnessing) are excluded for MVP.

**Post-MVP Path:** Add opt-in individual profiles with field-level privacy controls.

### Why No Direct Survey Response Access?

**From Threat Model:** State actors could subpoena individual responses.

**Solution:** RLS policy blocks ALL direct queries:
```sql
CREATE POLICY "No direct access to survey responses"
ON survey_responses FOR SELECT
USING (FALSE);
```

Access only via aggregate function:
```sql
get_deployment_aggregate_stats(deployment_id) -- Returns counts/averages only
```

### Why Hybrid Service Provider Editing?

**From VX Audit:** Dr. Amara (therapist) needs autonomy over her availability, but orgs should control trust signals.

**Solution:**
- Providers edit: bio, photo, contact, `is_accepting_clients`, `is_visible`
- Orgs edit: `service_provider_recommendations` table (separate relationship)
- RLS policies enforce this split

## Testing

### Running Tests

```bash
# Unit tests (Vitest)
npm test

# Unit tests with UI
npm run test:ui

# Coverage report
npm run test:coverage

# E2E tests (Playwright)
npm run test:e2e

# E2E tests with UI
npm run test:e2e:ui

# Type checking
npm run type-check
```

### Test Structure

```
__tests__/
├── utils/
│   ├── constants/
│   │   ├── surveys.test.ts       # Survey template tests
│   │   └── research.test.ts      # Research constant tests
│   └── mock-supabase.ts          # Mocking utilities

e2e/
├── fixtures.ts                   # Auth fixtures
├── surveys.spec.ts               # Survey flow tests
├── research.spec.ts              # Research flow tests
└── organizations.spec.ts         # Org management tests
```

### Testing Philosophy

- **Unit Tests**: Pure logic, constants, utilities
- **Component Tests**: React components with Testing Library
- **E2E Tests**: Full user flows with Playwright
- **No Login Required**: E2E tests use mock authentication
- **Privacy First**: Tests verify aggregate-only access

### Key Testing Features

1. **Mock Auth**: Bypass login in E2E tests via fixtures
2. **Mock Supabase**: Mock database responses without real backend
3. **Privacy Validation**: Tests verify individual data is never accessible
4. **Accessibility**: Tests check ARIA labels, keyboard nav (TODO)

## Contributing

Before adding features:

1. Read `hearthfiles/vx-audit-report.md` - understand values alignment
2. Read `hearthfiles/mvp-design-plan.md` - understand scope
3. Check which persona(s) this serves
4. Follow the VALUES → DATABASE → AFFORDANCES → UX → UI → CODE flow
5. **Write tests** for new features (unit + E2E)
6. Run `npm run type-check` before committing

## Support

- **Design docs**: See `/hearthfiles/` directory
- **VX Audit**: See `/hearthfiles/vx-audit-report.md` for values analysis
- **Issues**: Contact WBP platform team

## License

Private - Wellbeing Project Internal Use Only
