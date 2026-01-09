# Security & Privacy Codebase Review

## Executive Summary
This review analyzes the current codebase and database schema against the project's "Privacy-First" and "Hardened Security" requirements. 

**Verdict:** The application implements a **robust, defense-in-depth security model** that is highly aligned with the stated values. The "Privacy Paradox" (protecting individuals while enabling connection) is solved effectively through strict Row-Level Security (RLS) and aggregation-only access patterns.

---

## ✅ Strengths & Verified Protections

### 1. Survey Privacy (Critical Requirement)
*   **Implementation:** The database **strictly blocks** all direct access to the `survey_responses` table (`CREATE POLICY ... USING (FALSE)`).
*   **Enforcement:** Access is only possible via `SECURITY DEFINER` functions (e.g., `get_deployment_aggregate_stats`).
*   **Privacy Threshold:** These functions explicitly check `IF response_count < 3 THEN RETURN error`.
*   **Evidence:** Verified in `supabase/migrations/20250117000005_survey_aggregates.sql` and `app/api/surveys/export/[id]/route.ts`.
*   **Impact:** Even if an admin account is compromised or a UI bug occurs, individual survey answers cannot be extracted via the application's standard data access patterns.

### 2. Organization Boundaries
*   **Implementation:** RLS policies consistently use `is_org_member()` and `is_org_admin()` checks.
*   **Visibility Control:** Resources like `research_documents` respect `private`, `network`, and `public` visibility levels at the database level.
*   **Impact:** Prevents "enumeration attacks" where a user from one organization could scrape data from another.

### 3. Server-Side Security
*   **Auth Handling:** The project uses the modern `@supabase/ssr` package with strictly typed `createClient` in `lib/supabase/server.ts`. This prevents common client-side token leakage vulnerabilities.
*   **Admin Access:** The Admin Dashboard (`app/admin/page.tsx`) performs checks on the server side before fetching any data, backed by RLS policies that only allow `@wellbeingproject.org` emails to access global data.

---

## ⚠️ Potential Issues & Vulnerabilities

### 1. Hardcoded Admin Domain
**Issue:** The `is_wbp_admin` SQL function hardcodes the email domain check:
```sql
AND email LIKE '%@wellbeingproject.org'
```
**Risk:** If the organization changes domains or uses a different email for contractors, this requires a database migration to fix.
**Fix:** Move this to a `app_config` table or use a specific Supabase Auth Role.

### 2. Lack of Rate Limiting
**Issue:** No explicit rate limiting (e.g., "100 requests per minute") was found in `middleware.ts` or API routes.
**Risk:** Susceptible to denial-of-service (DoS) attacks or brute-force attempts on login/export endpoints.
**Fix:** Implement `upstash/ratelimit` or similar middleware for API routes.

### 3. "System" Activity Logging
**Issue:** The `activity_logs` table allows `INSERT` with `TRUE` policy:
```sql
CREATE POLICY "System can insert activity logs" ON activity_logs FOR INSERT WITH CHECK (TRUE);
```
**Risk:** While authenticated users can only view their own logs, a malicious user *could* theoretically spam the logs with garbage data, filling up storage.
**Fix:** Restrict `INSERT` to authenticated users only, or use a trigger-based approach where the DB automatically logs actions.

---

## 📋 Recommendations for "State Actor" Threat Model

To meet the "hardened security" requirement mentioned in the design docs:

1.  **Enable Point-in-Time Recovery (PITR):** Ensure Supabase backups are configured for PITR to recover from data destruction attacks.
2.  **Audit Logs for Reads:** Currently, `activity_logs` likely captures writes. For high-threat models, consider logging *who accessed* sensitive aggregate reports (even if they are aggregates).
3.  **Content Security Policy (CSP):** Add strict CSP headers in `next.config.js` to prevent Cross-Site Scripting (XSS).

## Conclusion
The current implementation is **production-ready** regarding its core privacy promises. The privacy-critical features are not just "UI hide" features but are enforced at the database engine level, which is the gold standard for this type of application.
