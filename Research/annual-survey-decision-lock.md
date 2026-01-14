# Annual Survey Gate: Decision Lock & Implementation Plan

**Date:** January 14, 2026  
**Status:** Ready for implementation after Ale confirmation on Wednesday

---

## The Locked Decision

**"Completion is defined by Insights submission (all users) + Org Profile confirmation (admins only), within an active Season."**

This is the foundation. Everything else flows from it.

---

## What's Solid (Keep)

| Component | Status | Notes |
|-----------|--------|-------|
| `survey_seasons` table | ✅ Keep | Clean control plane for start/end |
| Role-based branching | ✅ Keep | Admin sees org profile; members don't |
| Optional practitioner/resource with "Skip" | ✅ Keep | Fresh contributions only |
| "My Contributions" separate page | ✅ Keep | Editing happens outside the gate flow |

## What Needs Fixing

| Issue | Problem | Fix |
|-------|---------|-----|
| Missing org-level completion | Can't enforce "admin must confirm org" | Add `organizations.last_annual_survey_at` |
| `get_user_impact_stats()` assumes tables | `activity_logs` may not exist or be stable | Simplify or defer stats until logging is solid |
| RLS references `user_roles` | Actual model is `organization_memberships` | Align policies to actual schema |
| Tone is over-committed | "🔥 everywhere", "Add My Spark ✨" | Soften to warm, human, understated |

---

## Schema Delta (Minimal)

```sql
-- 1. Track org-level completion (for admin gate)
ALTER TABLE organizations 
ADD COLUMN last_annual_survey_at timestamptz;

-- 2. Better: explicit submissions table for audit trail
CREATE TABLE annual_survey_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id uuid REFERENCES survey_seasons(id) NOT NULL,
  organization_id uuid REFERENCES organizations(id) NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  submission_type text NOT NULL, -- 'insights' | 'org_profile'
  payload jsonb,
  submitted_at timestamptz DEFAULT now()
);

CREATE INDEX idx_submissions_season ON annual_survey_submissions(season_id);
CREATE INDEX idx_submissions_user ON annual_survey_submissions(user_id);
CREATE INDEX idx_submissions_org ON annual_survey_submissions(organization_id);
```

---

## Gate Logic

### The Rule

```
User is BLOCKED if:
  - activeSeason exists
  - AND user.last_annual_survey_at < season.start_at (or null)
  
Additionally, if user is ADMIN:
  - AND organization.last_annual_survey_at < season.start_at (or null)
```

### Whitelist Routes (Always Accessible)

```typescript
const ALLOWED_WHILE_GATED = [
  '/annual-survey',
  '/annual-survey/*',
  '/logout',
  '/support',
  '/api/auth/*',
];
```

### Middleware Implementation

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ALLOWED_ROUTES = [
  '/annual-survey',
  '/logout',
  '/support',
  '/api/',
  '/_next/',
  '/favicon.ico',
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Check if route is allowed
  const isAllowed = ALLOWED_ROUTES.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );
  if (isAllowed) return res;
  
  // Get user and check gate status
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return res; // Let auth handle redirect
  
  // Check if gated
  const { data: gateStatus } = await supabase
    .rpc('check_annual_survey_gate', { target_user_id: user.id });
  
  if (gateStatus?.is_blocked) {
    return NextResponse.redirect(new URL('/annual-survey', req.url));
  }
  
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

### Database Function for Gate Check

```sql
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
  is_admin boolean;
  is_blocked boolean := false;
BEGIN
  -- Get active season
  SELECT * INTO active_season 
  FROM survey_seasons 
  WHERE is_active = true 
  AND now() BETWEEN start_at AND end_at
  LIMIT 1;
  
  -- No active season = no gate
  IF active_season IS NULL THEN
    RETURN json_build_object('is_blocked', false, 'reason', 'no_active_season');
  END IF;
  
  -- Get user's completion status
  SELECT * INTO user_record FROM users WHERE id = target_user_id;
  
  -- User hasn't completed since season started
  IF user_record.last_annual_survey_at IS NULL 
     OR user_record.last_annual_survey_at < active_season.start_at THEN
    is_blocked := true;
  END IF;
  
  -- Check if admin and org completion
  SELECT om.organization_id, om.role INTO user_org_id, is_admin
  FROM organization_memberships om
  WHERE om.user_id = target_user_id
  AND om.role IN ('primary_admin', 'admin')
  LIMIT 1;
  
  IF is_admin AND user_org_id IS NOT NULL THEN
    SELECT * INTO org_record FROM organizations WHERE id = user_org_id;
    IF org_record.last_annual_survey_at IS NULL 
       OR org_record.last_annual_survey_at < active_season.start_at THEN
      is_blocked := true;
    END IF;
  END IF;
  
  RETURN json_build_object(
    'is_blocked', is_blocked,
    'season_name', active_season.name,
    'is_admin', COALESCE(is_admin, false)
  );
END;
$$;
```

---

## User Flow (Refined)

### First-Time User

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Welcome to the 2026 Gathering                                  │
│                                                                 │
│  You're joining 847 practitioners and organizations            │
│  from 17 regions.                                               │
│                                                                 │
│  This is your first annual update. What you share helps        │
│  others in your region find support and see what's shifting.   │
│                                                                 │
│  [ Begin ]                                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Returning User (With Activity)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Welcome back                                                   │
│                                                                 │
│  Since last year:                                               │
│  A few people found practitioners you shared.                   │
│  Someone downloaded your burnout toolkit.                       │
│                                                                 │
│  Ready to refresh your contribution for 2026?                  │
│                                                                 │
│  [ Continue ]                                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

*Note: If stats aren't available yet, fall back to first-time copy.*

### Admin Flow

```
Step 1: Confirm Organization Profile
        └── Pre-filled fields, "Confirm & Continue" button
        
Step 2: Add New Practitioner? (Optional)
        └── [ Skip ] or [ Add One ]
        
Step 3: Add New Resource? (Optional)
        └── [ Skip ] or [ Add One ]
        
Step 4: Regional Insights (Required)
        └── 8 questions, blank each year
        
Step 5: Thank You
        └── Simple acknowledgment, enter platform
```

### Member Flow

```
Step 1: Add New Practitioner? (Optional)
        └── [ Skip ] or [ Add One ]
        
Step 2: Add New Resource? (Optional)
        └── [ Skip ] or [ Add One ]
        
Step 3: Regional Insights (Required)
        └── 8 questions, blank each year
        
Step 4: Thank You
        └── Simple acknowledgment, enter platform
```

---

## Tone Guidelines

### Do

- "Welcome to the 2026 Gathering"
- "Your contribution helps others in your region"
- "A few people found practitioners you shared"
- "Thank you for being here"
- "Continue" / "Submit" / "Skip for now"

### Don't

- "Add My Spark ✨"
- "🔥" or fire metaphors everywhere
- "The Hearth Grows Brighter"
- Big stat numbers as the primary element
- Gamified language (points, badges, streaks)

---

## "Cute But Not Tech-Bro" Ideas

| Idea | Description | Effort |
|------|-------------|--------|
| **Before we ask, we give** | Show what community has gathered before asking | Low |
| **Community Pulse Preview** | Blurred/teased regional themes, unlocked after submission | Medium |
| **Mosaic animation** | On submit, contribution becomes tile in regional picture | Medium |
| **One gift in return** | After submission, show one helpful practitioner/resource | Low |
| **Time capsule line** | Optional: "What would you like to be true next year?" | Low |

---

## Questions for Ale (Wednesday)

### Gate Logic
1. **Grace period?** First 7 days soft gate (banner + read-only) then hard gate?
2. **End of season behavior?** If someone never completes, do they get access after season ends?

### First-Time Experience
3. **Community quote?** Can we feature real quotes from community members on welcome screen?
4. **Community stats?** Can we show "847 practitioners from 17 regions" publicly?

### Org Profile
5. **Admin-only confirmation:** Is it enough for admin to just click "Confirm & Continue" on pre-filled org data?
6. **Which org fields are editable?** All 14 taxonomy fields, or a subset?

### Insights
7. **All 8 questions required?** Or can some be optional?
8. **Minimum length?** Any validation on insight responses?

---

## Implementation Order

```
Week 1: Foundation
├── Schema migration (org completion + submissions table)
├── Gate check function
├── Middleware implementation
└── Season admin UI (create/activate seasons)

Week 2: Survey Flow
├── Welcome screen (first-time vs returning)
├── Org profile confirmation (admin only)
├── Practitioner/Resource add (optional)
├── Insights form (8 questions)
└── Completion handler (set timestamps)

Week 3: Polish
├── My Contributions page
├── Thank you screen
├── Activity stats (if logging is stable)
└── Testing with 5 internal users
```

---

## Summary

**Locked:** Completion = Insights (all) + Org Profile (admins), within active Season.

**Fixed:** Add org-level tracking, align RLS, soften tone.

**Deferred:** Activity stats until logging is stable.

**Ready:** Middleware gate logic, flow structure, tone guidelines.

Next step: Confirm with Ale on Wednesday, then implement Week 1 foundation.
