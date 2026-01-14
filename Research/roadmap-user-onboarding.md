# User Onboarding Roadmap

**Date:** January 14, 2026
**Status:** Phase 2 Planning

---

## Current State (What's Built)

### User Creation Flow
- WBP Super Admin creates organizations at `/admin/organizations/new`
- Org Admin invites members at `/organizations/[slug]/members`
- Users are created in Supabase Auth + `users` table
- Memberships created with roles: `primary_admin`, `backup_admin`, `contributor`, `viewer`

### Super Admin Access
Controlled via `lib/utils/admin.ts`:
```typescript
const SUPER_ADMIN_EMAILS = ['bg@bilalghalib.com'];
const SUPER_ADMIN_DOMAINS = ['@wellbeingproject.org'];
```

### Annual Survey Gate
- WBP Admin activates season at `/admin/seasons`
- All users blocked until completing `/annual-survey`
- Completion updates `last_annual_survey_at` on user/org

---

## Phase 2: Onboarding Improvements

### 1. Silent Invite → Email Invite (Priority: High)

**Problem:** Users are created but don't receive any notification.

**Solution Options:**

| Option | Pros | Cons |
|--------|------|------|
| **Supabase Magic Link** | Built-in, no extra setup | Less customizable email |
| **Postmark/SendGrid** | Full email control, templates | Extra service to manage |
| **Resend** | Modern API, good DX | Newer, less mature |

**Implementation:**
```typescript
// In /api/organizations/members/invite/route.ts

// Option A: Supabase Magic Link
const { data, error } = await adminClient.auth.admin.inviteUserByEmail(email, {
  redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/welcome?org=${orgSlug}`,
  data: { full_name, organization_id: organizationId, role }
});

// Option B: Custom email with Postmark
await postmark.sendEmailWithTemplate({
  From: 'team@wellbeingproject.org',
  To: email,
  TemplateAlias: 'org-invitation',
  TemplateModel: {
    org_name: organizationName,
    inviter_name: inviterName,
    accept_url: `${baseUrl}/accept-invite?token=${inviteToken}`
  }
});
```

**Database Changes:**
```sql
-- Add invitation tokens table
CREATE TABLE invitation_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  organization_id uuid REFERENCES organizations(id),
  role text NOT NULL,
  token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  accepted_at timestamptz,
  created_at timestamptz DEFAULT now()
);
```

---

### 2. Bulk Onboarding (Priority: Medium)

**Problem:** Adding 1,200 organizations manually is tedious.

**Solution:** CSV Import for Super Admins

**CSV Format:**
```csv
org_name,org_slug,admin_email,admin_name,website
Climate Justice Alliance,climate-justice,maria@cja.org,Maria Santos,https://cja.org
Health Equity Now,health-equity,james@hen.org,James Wilson,https://healthequitynow.org
```

**UI:** Add to `/admin/organizations`
```
┌─────────────────────────────────────────────────────────────┐
│  Import Organizations                                        │
│                                                              │
│  [Choose CSV File]                                          │
│                                                              │
│  Preview:                                                    │
│  ┌────────────────┬──────────────┬─────────────────┐       │
│  │ Organization   │ Admin        │ Status          │       │
│  ├────────────────┼──────────────┼─────────────────┤       │
│  │ Climate Just...│ maria@cja... │ ✓ Ready         │       │
│  │ Health Equity  │ james@hen... │ ⚠ Email exists  │       │
│  └────────────────┴──────────────┴─────────────────┘       │
│                                                              │
│  [Cancel]                      [Import 47 Organizations]    │
└─────────────────────────────────────────────────────────────┘
```

**API Endpoint:** `POST /api/admin/organizations/bulk`

---

### 3. Warm Handoff - Welcome Admin Page (Priority: Medium)

**Problem:** New org admins land on dashboard with no guidance.

**Solution:** Special first-time admin experience

**Flow:**
```
Admin clicks invite link
    ↓
/welcome-admin?org=climate-justice
    ↓
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  Welcome to Springboard, Maria                              │
│                                                              │
│  You're now the primary admin for Climate Justice Alliance. │
│                                                              │
│  As admin, you can:                                         │
│  • Invite team members (we recommend adding a backup admin) │
│  • Share practitioners your team trusts                      │
│  • Upload resources that could help others                   │
│  • Deploy wellbeing surveys to your team                     │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ First Steps Checklist                               │   │
│  │ □ Add a backup admin (in case you're unavailable)   │   │
│  │ □ Invite 2-3 team members                           │   │
│  │ □ Share a practitioner you trust                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  [Get Started]                                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Implementation:**
- Create `/app/welcome-admin/page.tsx`
- Store `has_seen_welcome` flag in user metadata
- Show checklist progress

---

### 4. Password Reset Flow (Priority: High)

**Problem:** No way for users to recover forgotten passwords.

**Solution:** Standard forgot password flow

**Pages to Create:**
- `/forgot-password` - Enter email
- `/reset-password` - Set new password (with token from email)

**Implementation:**
```typescript
// Forgot password
await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${baseUrl}/reset-password`,
});

// Reset password (on callback)
await supabase.auth.updateUser({ password: newPassword });
```

---

### 5. Invitation Management (Priority: Low)

**Problem:** Can't see pending invitations or resend them.

**Features:**
- View pending invitations
- Resend invitation email
- Revoke/cancel invitation
- Track invitation status

**UI Location:** `/organizations/[slug]/members` - add "Pending Invitations" tab

---

## Implementation Order

| Phase | Feature | Effort | Impact |
|-------|---------|--------|--------|
| 2a | Password Reset | Low | High |
| 2a | Email Invitations (Supabase) | Medium | High |
| 2b | Welcome Admin Page | Medium | Medium |
| 2b | Bulk CSV Import | Medium | High |
| 2c | Invitation Management | Medium | Low |
| 2c | Custom Email Templates | High | Medium |

---

## Notes for Development

### Environment Variables Needed
```env
# For Postmark (if using custom emails)
POSTMARK_API_KEY=xxxxx
POSTMARK_FROM_EMAIL=team@wellbeingproject.org

# For Supabase magic links
NEXT_PUBLIC_APP_URL=https://springboard.wellbeingproject.org
```

### Email Templates to Create
1. `org-invitation` - Initial org admin invite
2. `member-invitation` - Team member invite
3. `password-reset` - Password recovery
4. `survey-reminder` - Annual survey nudge

---

## Questions to Resolve

1. **Email sender:** Should emails come from `team@wellbeingproject.org` or a no-reply?
2. **Invite expiry:** How long should invitation links be valid? (Suggest: 7 days)
3. **Bulk import limit:** Max orgs per CSV import? (Suggest: 100 at a time)
4. **Welcome page:** Should we show it every time or only once?
