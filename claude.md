# Springboard Platform - Developer Guide for Claude/AI Assistants

**Last Updated**: January 17, 2025
**Phase**: Phase 1 Complete (MVP Ready)

This document provides context for AI development assistants (Claude, Copilot, etc.) working on the Springboard platform. It covers architecture, patterns, testing, and development workflows.

---

## Project Overview

**Springboard** is a privacy-first wellbeing resource platform serving social justice / changemaker organizations. Core features:

1. **Service Provider Registry**: Org-mediated referrals to therapists/coaches
2. **Research Repository**: PDF sharing with tags and full-text search
3. **Survey Tool**: Anonymous wellbeing assessments with aggregate-only analytics

**Key Constraint**: **Privacy First**. Individual survey responses are NEVER accessible. RLS policies enforce aggregate-only access.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router, Server Components)
- **Language**: TypeScript
- **Database**: PostgreSQL via Supabase
- **Auth**: Supabase Auth (email/password)
- **Storage**: Supabase Storage (PDFs)
- **Styling**: Tailwind CSS
- **Testing**: Vitest (unit), Playwright (E2E)

---

## Architecture Patterns

### 1. Server-First Rendering

**All data fetching in Server Components** (app/*/page.tsx):

```typescript
// ✅ GOOD: Server Component
export default async function ResearchPage() {
  const supabase = await createClient() // Server client
  const { data } = await supabase.from('research_documents').select('*')
  return <ResearchGrid documents={data} />
}

// ❌ AVOID: Client-side fetching (adds waterfall, hurts performance)
'use client'
export default function ResearchPage() {
  const [data, setData] = useState([])
  useEffect(() => {
    fetch('/api/research').then(...)
  }, [])
}
```

### 2. Org-First Model

**All features scoped to organizations**:

```typescript
// Permission check pattern (used everywhere)
const { data: membership } = await supabase
  .from('organization_memberships')
  .select('id, role')
  .eq('user_id', user.id)
  .eq('organization_id', organizationId)
  .eq('is_active', true)
  .single()

if (!membership) {
  return <AccessDenied />
}
```

### 3. Privacy-First Survey Responses

**Individual responses BLOCKED at database level**:

```sql
-- RLS policy blocks ALL SELECT
CREATE POLICY "No direct access to survey responses"
ON survey_responses FOR SELECT
USING (FALSE);

-- Access ONLY via aggregate functions
SELECT get_deployment_aggregate_stats('deployment-id');
-- Returns: { avg_exhaustion: 3.2, avg_cynicism: 2.8, ... }
-- NEVER individual {user_id: 'x', answers: {...}}
```

### 4. Role-Based Permissions

**Four roles** (in `organization_memberships.role`):

- `primary_admin`: Full control
- `backup_admin`: Same as primary (redundancy)
- `contributor`: Can upload research, add providers
- `viewer`: Read-only

**Permission checks in UI**:

```typescript
const isAdmin = membership.role === 'primary_admin' ||
                membership.role === 'backup_admin'

{isAdmin && (
  <button>Deploy Survey</button>
)}
```

---

## File Structure

```
app/
├── (auth)/
│   ├── login/              # Login page
│   └── signup/             # Signup (if enabled)
├── dashboard/              # Main dashboard
├── organizations/
│   └── [slug]/
│       ├── page.tsx        # Org profile
│       ├── members/        # Member management
│       ├── research/       # Org research gallery
│       └── surveys/        # Survey history
├── service-providers/
│   ├── page.tsx            # Provider listing
│   ├── [id]/               # Provider detail
│   └── new/                # Add provider
├── research/
│   ├── page.tsx            # Research library
│   ├── new/                # Upload research
│   └── [id]/               # Document detail
├── surveys/
│   ├── page.tsx            # Survey library
│   ├── deploy/             # Deploy survey (admin)
│   ├── respond/[id]/       # Take survey
│   └── results/[id]/       # View results (admin)
├── admin/
│   ├── page.tsx            # WBP admin dashboard
│   └── activity/           # Activity logs
└── api/
    ├── service-providers/  # Provider CRUD
    ├── research/           # Research upload
    └── surveys/
        ├── deploy/         # Deploy survey
        ├── respond/        # Submit response
        └── export/[id]/    # Export results

components/
├── research/
│   ├── research-grid.tsx
│   └── research-upload-form.tsx
└── surveys/
    ├── survey-deployment-form.tsx
    └── survey-response-form.tsx

lib/
├── supabase/
│   ├── server.ts           # Server-side client
│   ├── client.ts           # Client-side client
│   └── middleware.ts       # Auth middleware
└── utils/                  # Shared utilities

utils/
└── constants/
    ├── surveys.ts          # Survey templates
    └── research.ts         # Research tags/topics

supabase/
└── migrations/
    ├── 20250117000001_initial_schema.sql
    ├── 20250117000002_rls_policies.sql
    ├── 20250117000003_storage_setup.sql
    ├── 20250117000004_research_search.sql
    └── 20250117000005_survey_aggregates.sql
```

---

## Common Patterns

### Pattern 1: Auth Check

```typescript
// app/some-page/page.tsx
export default async function SomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Continue with authenticated user
}
```

### Pattern 2: Permission Check

```typescript
// Check if user is org admin
const { data: membership } = await supabase
  .from('organization_memberships')
  .select('role')
  .eq('user_id', user.id)
  .eq('organization_id', organizationId)
  .eq('is_active', true)
  .in('role', ['primary_admin', 'backup_admin'])
  .single()

if (!membership) {
  return <AccessDenied />
}
```

### Pattern 3: Soft Deletes

```typescript
// NEVER hard delete - use soft delete
// ❌ WRONG:
await supabase.from('organizations').delete().eq('id', orgId)

// ✅ CORRECT:
await supabase
  .from('organizations')
  .update({ is_active: false })
  .eq('id', orgId)
```

### Pattern 4: Activity Logging

```typescript
// Log significant actions
await supabase.from('activity_logs').insert({
  user_id: user.id,
  organization_id: organizationId,
  action_type: 'research.uploaded', // or 'survey.deployed', 'member.invited', etc.
  details: {
    document_id: documentId,
    title: 'Burnout Study',
  },
})
```

### Pattern 5: File Uploads

```typescript
// Upload to Supabase Storage
const uniqueFileName = `${organizationId}/${timestamp}_${sanitizedName}`

const { data, error } = await supabase.storage
  .from('research-documents')
  .upload(uniqueFileName, fileBuffer, {
    contentType: 'application/pdf',
    upsert: false,
  })

// Get signed URL for download (1-hour expiry)
const { data: { signedUrl } } = await supabase.storage
  .from('research-documents')
  .createSignedUrl(uniqueFileName, 3600)
```

---

## Testing

### Running Tests

```bash
# Unit tests (Vitest)
npm test                    # Run once
npm run test:ui             # Interactive UI
npm run test:coverage       # Coverage report

# E2E tests (Playwright)
npm run test:e2e            # Headless
npm run test:e2e:ui         # Interactive UI
npm run test:e2e:debug      # Debug mode

# Type checking
npm run type-check
```

### Writing Tests

**Unit Tests** (utils, constants, pure functions):

```typescript
// __tests__/utils/constants/surveys.test.ts
import { describe, it, expect } from 'vitest'
import { BURNOUT_ASSESSMENT } from '@/utils/constants/surveys'

describe('BURNOUT_ASSESSMENT', () => {
  it('should have 8 questions', () => {
    expect(BURNOUT_ASSESSMENT.questions).toHaveLength(8)
  })

  it('should have correct aggregate metrics', () => {
    expect(BURNOUT_ASSESSMENT.aggregateMetrics).toEqual([
      'exhaustion',
      'cynicism',
      'efficacy',
      'burnout_risk',
    ])
  })
})
```

**E2E Tests** (full user flows with mock auth):

```typescript
// e2e/surveys.spec.ts
import { test, expect } from './fixtures'

test('should allow admin to deploy survey', async ({ adminPage }) => {
  // Mock API responses
  await adminPage.route('**/rest/v1/organization_memberships*', async (route) => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify([{ role: 'primary_admin', ... }]),
    })
  })

  await adminPage.goto('/surveys/deploy?template=burnout-assessment')

  await expect(adminPage.getByText('Burnout Assessment')).toBeVisible()
})
```

**Mock Auth** (no login required):

```typescript
// e2e/fixtures.ts defines test fixtures with mock auth
import { test } from './fixtures' // NOT '@playwright/test'

// Provides: adminPage, memberPage, authenticatedPage
// Each has pre-set auth state (no need to log in)
```

---

## Database Operations

### Creating Migrations

1. Create file: `supabase/migrations/YYYYMMDD_description.sql`
2. Test in Supabase SQL Editor
3. Apply to production via Dashboard
4. Update types if schema changed

Example migration:

```sql
-- supabase/migrations/20250118_add_feature.sql

-- Add table
CREATE TABLE new_feature (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policy
ALTER TABLE new_feature ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can view"
ON new_feature FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id
    FROM organization_memberships
    WHERE user_id = auth.uid() AND is_active = true
  )
);

-- Add index
CREATE INDEX idx_new_feature_org ON new_feature(organization_id);
```

### Query Patterns

**Fetching with Relations**:

```typescript
const { data } = await supabase
  .from('research_documents')
  .select(`
    *,
    organization:organizations(name, slug),
    uploaded_by:users(full_name, email)
  `)
```

**Filtering**:

```typescript
// Tags (array contains)
.contains('tags', ['Burnout'])

// Full-text search
.textSearch('tsv', 'burnout collective care')

// Multiple conditions
.eq('organization_id', orgId)
.in('visibility_level', ['network', 'public'])
.gte('created_at', '2025-01-01')
```

**Aggregate Functions**:

```typescript
// Use RPC for complex aggregations
const { data } = await supabase.rpc('get_deployment_aggregate_stats', {
  deployment_id_param: deploymentId,
})

// Returns: { total_responses: 15, response_rate: 75.0, ... }
```

---

## Error Handling

### Client Components

```typescript
'use client'

const [error, setError] = useState<string | null>(null)

try {
  const response = await fetch('/api/surveys/deploy', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const { error } = await response.json()
    throw new Error(error)
  }
} catch (err) {
  console.error('Error:', err)
  setError(err instanceof Error ? err.message : 'An error occurred')
}
```

### API Routes

```typescript
// app/api/some-route/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // ... operation
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Server Components

```typescript
// Use error.tsx for error boundaries
// app/some-page/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

---

## Development Workflow

### Adding a New Feature

1. **Understand Values Alignment**
   - Read `hearthfiles/vx-audit-report.md`
   - Identify which persona(s) this serves
   - Trace: VALUES → DATABASE → AFFORDANCES → UX → UI → CODE

2. **Design Database Changes**
   - Create migration file
   - Add tables, columns, RLS policies
   - Add indexes for performance

3. **Implement Backend**
   - Create API routes if needed
   - Add server components for data fetching
   - Implement permission checks

4. **Build Frontend**
   - Create page components
   - Add client components for interactivity
   - Style with Tailwind

5. **Write Tests**
   - Unit tests for utilities
   - E2E tests for user flows
   - Verify privacy constraints

6. **Document**
   - Update README if user-facing
   - Add comments for complex logic
   - Create implementation guide in `hearthfiles/`

### Code Review Checklist

- [ ] RLS policies enforce permissions
- [ ] Survey responses never directly accessible
- [ ] Soft deletes used (not hard deletes)
- [ ] Activity logs for significant actions
- [ ] Permission checks in UI
- [ ] Server-side validation
- [ ] Error handling implemented
- [ ] Tests written (unit + E2E)
- [ ] TypeScript types defined
- [ ] Documentation updated

---

## Common Issues & Solutions

### Issue: "User not found" after login

**Cause**: User exists in `auth.users` but not in `users` table

**Solution**:
```sql
INSERT INTO users (id, email, full_name)
VALUES (
  'auth-user-id',
  'email@example.com',
  'Full Name'
);
```

### Issue: "Permission denied" on query

**Cause**: Missing table-level GRANT permissions (not RLS)

**Solution**: Grant permissions to authenticated role:
```sql
-- This is REQUIRED after running migrations
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- Also grant to anon role for public access
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
```

**Then** check if it's an RLS issue:
```sql
SELECT *
FROM organization_memberships
WHERE user_id = 'your-user-id'
AND is_active = true;
```

### Issue: Survey results showing individual responses

**Cause**: This should NEVER happen (critical bug)

**Solution**: Verify RLS policy:
```sql
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'survey_responses';

-- Should have SELECT policy with qual = 'false'
```

### Issue: File upload fails

**Cause**: Storage bucket not created or RLS policy missing

**Solution**:
```sql
-- Check bucket exists
SELECT * FROM storage.buckets WHERE id = 'research-documents';

-- Check policies
SELECT * FROM storage.policies WHERE bucket_id = 'research-documents';
```

---

## Performance Optimization

### Database Indexes

**Critical indexes** (already created):

```sql
-- Full-text search
CREATE INDEX idx_research_tsv ON research_documents USING GIN(tsv);

-- Array searches
CREATE INDEX idx_research_tags ON research_documents USING GIN(tags);
CREATE INDEX idx_research_topics ON research_documents USING GIN(topics);

-- Foreign keys
CREATE INDEX idx_memberships_user_org
ON organization_memberships(user_id, organization_id)
WHERE is_active = true;
```

### Query Optimization

**Avoid N+1 queries**:

```typescript
// ❌ BAD: N+1 query
const deployments = await getDeployments()
for (const d of deployments) {
  const count = await getResponseCount(d.id) // N queries
}

// ✅ GOOD: Single query with JOIN
const { data } = await supabase
  .from('survey_deployments')
  .select('*, responses:survey_responses(count)')
```

**Add pagination**:

```typescript
// Add to large lists
.range(offset, offset + pageSize - 1)
.limit(pageSize)
```

---

## Security Checklist

- [ ] All tables have RLS enabled
- [ ] Survey responses have SELECT policy = FALSE
- [ ] File uploads validated server-side (not just client)
- [ ] Signed URLs used for file downloads
- [ ] User input sanitized
- [ ] SQL injection prevented (use Supabase client, not raw SQL)
- [ ] Rate limiting on API routes (TODO)
- [ ] CSRF protection (TODO)

---

## VALUES → CODE Examples

### Example 1: Fast Trusted Referrals (Marisol's Value)

**VALUE**: "Fast resource access - 5 minutes to find a therapist"

**DATABASE**:
```sql
CREATE TABLE service_providers (
  specialties TEXT[], -- Enables filtering
  is_accepting_clients BOOLEAN, -- Quick availability check
  ...
)

CREATE TABLE service_provider_recommendations (
  relationship_note TEXT, -- Trust signal
  would_recommend_for TEXT[], -- Specific needs
  ...
)
```

**AFFORDANCE**: Filter by specialty → See trust signals → Contact directly

**UX**: Search → Filter dropdowns → Provider cards with "Recommended by 3 orgs" → Email button

**CODE**: `app/service-providers/page.tsx`

### Example 2: Anonymous Surveys (Privacy Value)

**VALUE**: "Psychological safety - no individual surveillance"

**DATABASE**:
```sql
CREATE POLICY "No direct access"
ON survey_responses FOR SELECT
USING (FALSE); -- Absolute block

-- Access ONLY via aggregate function
CREATE FUNCTION get_deployment_aggregate_stats(deployment_id UUID)
RETURNS JSON SECURITY DEFINER AS ...
```

**AFFORDANCE**: Deploy survey → Members respond anonymously → View aggregates only

**UX**: Privacy notice on response form → "Your answers are anonymous" → Results show avg/min/max only

**CODE**: `app/surveys/respond/[id]/page.tsx`, `supabase/migrations/20250117000005_survey_aggregates.sql`

---

## Next Steps

### Immediate Priorities (Post-Phase 1)

1. **Add automated tests** (expand coverage)
2. **Enable TypeScript strict mode**
3. **Add pagination** to all list views
4. **Implement rate limiting** on API routes
5. **Add accessibility improvements** (ARIA, keyboard nav)

### Phase 2 Features

1. Email notifications (survey deployments, reminders)
2. Custom survey builder (beyond templates)
3. Benchmarking (cross-org aggregates with consent)
4. Advanced search (faceted, saved searches)
5. Mobile optimization

---

## Resources

- **Design Docs**: `/hearthfiles/`
- **VX Audit**: `/hearthfiles/vx-audit-report.md`
- **MVP Plan**: `/hearthfiles/mvp-design-plan.md`
- **Code Review**: `/hearthfiles/phase-1-review-and-critique.md`
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Playwright Docs**: https://playwright.dev

---

**Remember**: Privacy first, values-driven, organization-scoped, comprehensive RLS. Every feature should trace back to a user value from the VX audit.
