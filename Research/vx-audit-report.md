# VX Audit: Springboard Platform (Wellbeing Project)

**Date:** 2025-11-17
**Audit Type:** Pre-Implementation Design Analysis
**Auditor:** Values-Through-Code Analysis Framework

---

## Executive Summary

The Springboard platform represents a **significant design pivot** from the original "Hearth" vision. The shift from individual-first community directory to organization-first resource platform fundamentally changes which values the system supports.

**Key Finding:** The current MVP design excels at **safety, efficiency, and institutional sustainability** but systematically excludes **individual belonging, emergence, and relational depth**—values central to the original Hearth concept and to changemakers' wellbeing needs.

**Critical Tension:** The threat model (state actors, surveillance) drives privacy decisions that protect organizations but render individuals invisible. This creates a paradox: a wellbeing platform where people cannot be seen.

---

## Design Context

**No code exists yet** - this audit analyzes design decisions documented in:
- `hearthfiles/mvp-design-plan.md` (current MVP scope - "Springboard")
- `wellbeing_hearth_concept.md` (original vision - "Hearth")
- `wellbeing_hearth_rationale.md` (research-backed design principles)

The audit treats **database schema, feature scope, and security architecture** as the "code" layer.

---

## Persona 1: Marisol - Overwhelmed Organization Director

**Who**: Director of a 12-person racial justice org in Oakland. Fields weekly "who do you know?" requests from staff. Trusts WBP network but fears surveillance (has been targeted by state actors). Needs solutions fast—no time for platforms.

**Values** (CAPs):

1. **MOMENTS when finding help feels like a gift from trusted friends, not homework from bureaucracy**
2. **PROTECTIONS that let her team's vulnerability stay sacred, not become data for hostile actors**
3. **RECIPROCAL ACTS where she can give back to the network without it becoming a second job**
4. **TRUST SIGNALS that tell her "this therapist has held people like us" without needing to explain the context**

### VX Trace

**VALUES** → Trusted referrals that protect privacy while enabling fast help
**AFFORDANCES** → Can search service providers by specialty, see which orgs recommended them, contact directly
**UX** → Search → Filter (trauma/racial healing/Oakland) → See "Recommended by 3 orgs" → Email therapist → Done in 5 min
**UI** → Search bar, filter dropdowns, provider cards with "Recommended by [Org X, Org Y]" badges, contact button
**DESIGN** →
- `service_providers` table with `specialties[]`, `location_city`, `modalities[]`
- `service_provider_recommendations` table linking orgs to providers (trust signal)
- RLS policy: "Network members can view service providers" (mvp-design-plan.md:679-685)
- No self-registration for providers (org-mediated only - design decision line 26-29)

### Alignment Analysis

✓ **MOMENTS when finding help feels like gifts, not homework**
- **SUPPORTS:** Springboard model (line 6) - "access what you need and move forward, not a platform to live on"
- **SUPPORTS:** Service provider search with filters (database schema line 384-390) - specialty/location/modality arrays enable quick filtering
- **SUPPORTS:** Contact info displayed, users reach out off-platform (line 29) - no complex booking system
- **DESIGN DECISION:** 5-minute user journey (line 86-92) explicitly designed for speed

✓ **PROTECTIONS that keep vulnerability sacred**
- **SUPPORTS:** Individuals obscured - only visible within own org (line 15, RLS policies line 642-674)
- **SUPPORTS:** Survey responses NEVER shown individually, aggregate-only (line 599-603)
- **SUPPORTS:** Threat model addresses state actors (line 908-920)
- **SUPPORTS:** Application-level encryption for sensitive fields (line 925-930)
- **DESIGN DECISION:** Privacy-first architecture (line 16) - "no member-to-member communication"

✓ **RECIPROCAL ACTS without it becoming a second job**
- **SUPPORTS:** Org can add 2-3 trusted coaches in minutes (line 88)
- **SUPPORTS:** Research upload with simple metadata form (line 771)
- **SUPPORTS:** Quarterly update cadence, not constant maintenance (line 92)
- **PARTIALLY HINDERS:** No "seasonal pulse" ritual from original Hearth design - lose gentle touchpoints
- **DESIGN DECISION:** "Springboard not platform" (line 6) limits obligation

✓ **TRUST SIGNALS without needing to explain context**
- **SUPPORTS:** "Recommended by [Org X, Org Y, Org Z]" displayed on provider profiles (line 416-419)
- **SUPPORTS:** `relationship_note` field: "Worked with our team for 6 months on burnout" (line 405)
- **SUPPORTS:** Org-mediated recommendations only (line 26-27) - no self-promotion
- **MISSED OPPORTUNITY:** No way to signal "has held Black/queer/immigrant organizers" without explicit tagging

### Overall: **STRONG ALIGNMENT** (90%)

Marisol's values are **the design center** of the current MVP. Almost every decision serves her need for fast, safe, trustworthy resource access.

---

## Persona 2: James - Isolated Individual Activist

**Who**: 32-year-old climate justice organizer. Not affiliated with a WBP member organization. Works independently, often burned out. Seeking peer connection and resource-sharing. Would have joined original "Hearth" platform for community.

**Values** (CAPs):

1. **ENCOUNTERS with other organizers where "you too?" becomes "we together"**
2. **MOMENTS of being witnessed—when someone sees the gifts I can't name in myself**
3. **PRACTICES and resources that other changemakers vouch for, offered as peer gifts**
4. **SPACES where I can both ask for support and offer what I've learned, as equals**

### VX Trace

**VALUES** → Peer belonging, mutual aid, being seen
**AFFORDANCES** → None—he cannot access the platform
**UX** → Visits site → "This platform is for WBP member organizations only" → Leaves
**UI** → N/A (locked out at auth layer)
**DESIGN** →
- Hybrid org-first model: "Organizations are primary users" (line 13)
- "Individuals exist within orgs" (line 14)
- No individual membership option (design scope)
- RLS policies require `organization_memberships` to see any content (line 646-660)

### Alignment Analysis

✗ **ENCOUNTERS where "you too?" becomes "we together"**
- **COMPLETELY HINDERS:** No individual profiles (line 15-16: "People don't speak as themselves publicly")
- **COMPLETELY HINDERS:** "No member-to-member communication" (line 17)
- **LOST FROM ORIGINAL:** Peer-interviewed profiles (original concept line 98-109)
- **LOST FROM ORIGINAL:** "Ways of Being" sharing (original concept line 207-218)

✗ **MOMENTS of being witnessed**
- **COMPLETELY HINDERS:** Cannot create profile at all without org affiliation
- **LOST FROM ORIGINAL:** Peer interview ritual where someone mirrors your gifts back (rationale line 220-234)
- **LOST FROM ORIGINAL:** Gratitude/appreciation wall (concept line 132-138)
- **LOST FROM ORIGINAL:** Member spotlights (concept line 155-161)

✗ **PRACTICES as peer gifts**
- **PARTIALLY HINDERS:** Research repository exists (Phase 1B) but James cannot access or contribute
- **LOST FROM ORIGINAL:** "Story & Practice Cards" (concept line 122-128) - peer-gifted practices
- **LOST FROM ORIGINAL:** "A practice that carried me during hard season" sharing

✗ **SPACES for mutual asking and offering**
- **COMPLETELY HINDERS:** "Offers & Needs Board" (concept line 112-120) removed from scope
- **COMPLETELY HINDERS:** No way to signal "I can host a grief ritual" or "seeking co-facilitator"
- **DESIGN DECISION:** Line 45-51 explicitly excludes social network features

### Overall: **ZERO ALIGNMENT** (0%)

James's values are **systematically excluded** by the organization-first pivot. Every feature from the original Hearth design that would serve him has been removed for MVP scope.

**This is a design choice, not an oversight** - but it means the platform serves institutional sustainability over individual belonging.

---

## Persona 3: Dr. Amara - Trauma Therapist

**Who**: Black woman therapist, 15 years specializing in racial trauma and activist burnout. Works with 4 WBP organizations. Relationship-based practice—only takes clients through trusted referrals. Often at capacity, needs to manage boundaries.

**Values** (CAPs):

1. **REFERRALS that arrive with context—so I'm not explaining "why this work" from scratch**
2. **BOUNDARIES that protect my practice from being commodified or extracted**
3. **TRUST RELATIONSHIPS with organizations that become visible, honoring our history**
4. **AUTONOMY over whether I'm listed as "accepting clients" when my capacity shifts**

### VX Trace

**VALUES** → Right-fit referrals, visible trust, boundary control
**AFFORDANCES** → Profile created by org recommendation, visible to network, can update availability
**UX** → Gets email: "Org X recommended you" → Creates profile → Lists specialties/modalities → Marks "not accepting clients" when full → Receives inquiry emails directly
**UI** → Profile page (public to network), "Recommended by" badges, availability toggle, contact form
**DESIGN** →
- `service_providers` table (line 346-383)
- `is_accepting_clients` BOOLEAN (line 373)
- `availability_note` TEXT field (line 374)
- `service_provider_recommendations` with `relationship_note` (line 405)
- Email notification on recommendation (user journey line 159)

### Alignment Analysis

✓ **REFERRALS with context**
- **SUPPORTS:** `relationship_note`: "Worked with our team for 6 months on burnout" (line 405)
- **SUPPORTS:** `would_recommend_for` array shows which issues org vouches for (line 406)
- **SUPPORTS:** Org-mediated only—no cold self-promotion (line 26-27)
- **SUPPORTS:** Can see which orgs recommended her (line 163 - user journey)
- **PARTIALLY HINDERS:** No way for org to signal "great for Black organizers" without public tagging (could out clients)

✓ **BOUNDARIES protecting practice**
- **SUPPORTS:** `is_accepting_clients` boolean toggle (line 373)
- **SUPPORTS:** `availability_note` for nuance: "Accepting new clients March 2026" (line 374)
- **SUPPORTS:** Contact happens off-platform (line 29) - she controls response
- **SUPPORTS:** No payment processing (line 48) - keeps relationships direct
- **MISSED:** No "pause my profile" feature (could add `is_visible` field)

✓ **TRUST RELATIONSHIPS made visible**
- **SUPPORTS:** "Recommended by: [Org X, Org Y, Org Z]" (line 416-418)
- **SUPPORTS:** Can see full list of recommending orgs (transparency)
- **SUPPORTS:** Audit log tracks who added her (line 377-378)
- **DESIGN DECISION:** Provenance/trust is architectural (concept line 44-46)

? **AUTONOMY over profile**
- **UNCLEAR:** Can she edit her own profile? (Open question #4, line 991-993)
- **DESIGN FORK:**
  - **Option A:** Service providers can self-edit → autonomy but risk of stale org data
  - **Option B:** Org-mediated updates only → accurate but burdensome for providers
- **RECOMMENDATION:** Hybrid - providers can edit bio/availability, orgs own recommendation text

### Overall: **STRONG ALIGNMENT** (75%)

Dr. Amara's values are well-served **except for the unresolved autonomy question**. The trust-based, org-mediated model matches her practice philosophy.

**Critical gap:** Need to decide service provider editing rights before implementation.

---

## Persona 4: Aaron - Wellbeing Project Steward

**Who**: WBP founder, relationship holder for 30+ organizations. Constantly fielding "who do you know?" requests. Wants to steward ecosystem health while protecting community from surveillance. Needs to see patterns without surveillance.

**Values** (CAPs):

1. **PATTERNS across the ecosystem that reveal where care is needed, without tracking individuals**
2. **DISTRIBUTED STEWARDSHIP where orgs hold each other, not everything flowing through him**
3. **PROTECTIONS that let the community trust-fall, knowing their vulnerability is sacred**
4. **EMERGENT POSSIBILITIES that arise when the field can see itself, not just isolated orgs**

### VX Trace

**VALUES** → Ecosystem health, distributed care, aggregate patterns, trust
**AFFORDANCES** → Admin panel, aggregate survey data, org management, no individual surveillance
**UX** → Logs into admin panel → Sees: 28 orgs active, 47 service providers, 12 surveys deployed → Views aggregate wellbeing trends (no individual data) → Exports field baseline for research
**UI** → Admin dashboard with org list, aggregate charts, approval queues, no individual user access
**DESIGN** →
- Admin panel (Phase 1A, line 754-760)
- Aggregate-only survey access (line 716-723)
- WBP admin role with elevated permissions
- RLS policies block individual response viewing (line 699-709)
- Activity logs show ecosystem patterns (line 606-630)

### Alignment Analysis

✓ **PATTERNS without tracking individuals**
- **SUPPORTS:** Survey responses aggregate-only via database function (line 711-723)
- **SUPPORTS:** `get_deployment_aggregate_stats()` returns counts/averages, never rows (line 711-723)
- **SUPPORTS:** RLS policy: "No direct access to survey responses" (line 706-709)
- **SUPPORTS:** Privacy-by-design aggregation (line 959)
- **PERFECTLY ALIGNED:** This is the security architecture's core principle

✓ **DISTRIBUTED STEWARDSHIP**
- **SUPPORTS:** Org admins manage their own service provider recommendations (line 87-88)
- **SUPPORTS:** Research repository - orgs share with each other (Phase 1B)
- **SUPPORTS:** Org members can have contributor roles (line 316-342)
- **SUPPORTS:** Recommendations create network effects without Aaron as bottleneck (line 67-69)
- **DESIGN DECISION:** "Sustainable care—work of connecting people is shared" (original concept line 25-26)

✓ **PROTECTIONS for trust-fall**
- **SUPPORTS:** Hardened security vs state actors (line 908-973)
- **SUPPORTS:** Encryption at rest, in transit, application-level (line 923-930)
- **SUPPORTS:** Audit logs for accountability without surveillance (line 606-630)
- **SUPPORTS:** No third-party trackers (line 960)
- **SUPPORTS:** Privacy-friendly analytics only (PostHog, not Google - line 959)

? **EMERGENT POSSIBILITIES from field seeing itself**
- **PARTIALLY SUPPORTS:** Research repository with tags enables cross-org discovery (Phase 1B)
- **PARTIALLY SUPPORTS:** Service provider recommendations show network connections
- **HINDERS:** No way to see "5 orgs are all working on youth burnout right now"
- **HINDERS:** No "global hearth map" showing geographic/topical clusters (lost from original concept line 142-150)
- **MISSED:** RAG/AI could surface themes: "3 orgs recently uploaded research on collective healing"
- **LOST FROM ORIGINAL:** Seasonal pulse data showing field-wide patterns (rationale line 59-76)

### Overall: **STRONG ALIGNMENT** (80%)

Aaron's protection and distribution values are **architectural priorities**. Emergence is partially supported through research/tags but lacks the relational layer from the original Hearth vision.

**Opportunity:** Phase 2 could add privacy-preserving field visualizations (e.g., tag co-occurrence networks, geographic clusters) without exposing individual/org data.

---

## Persona 5: Keisha - Organization Wellbeing Lead

**Who**: Operations manager at 20-person education justice org. Designated by director to manage org's Springboard presence. Interested in learning from other orgs' practices. Wants to be a good steward but unclear on boundaries.

**Values** (CAPs):

1. **CLARITY about what I'm responsible for vs. what's the director's call**
2. **LEARNING ENCOUNTERS with peers at other orgs who are doing similar wellbeing work**
3. **CONFIDENCE that I won't accidentally expose something meant to be private**
4. **RECIPROCITY where managing this platform helps my org AND contributes to the network**

### VX Trace

**VALUES** → Clear roles, peer learning, safety, contribution
**AFFORDANCES** → Contributor role with defined permissions, research browsing, upload capability
**UX** → Logs in → Dashboard shows: "You can upload research, add service providers, view network resources" → Uploads burnout report → Tags with "youth, burnout, education" → Browses others' research on similar topics
**UI** → Role badge, permissions summary, upload forms with visibility toggles, research gallery
**DESIGN** →
- `organization_memberships` with role field (line 309-334)
- `permissions` JSONB: `{"can_add_service_providers": true, "can_upload_research": true}` (line 321-322)
- `contributor` role defined (line 339)
- Research visibility controls (line 447-450)
- Research gallery pages (Phase 1B, line 776-781)

### Alignment Analysis

✓ **CLARITY about responsibilities**
- **SUPPORTS:** Role-based permissions clearly defined (line 336-341)
- **SUPPORTS:** Permissions stored in JSONB for transparency (line 321-322)
- **SUPPORTS:** Invited by admin with specific role (line 122, user journey)
- **PARTIALLY HINDERS:** No UI mockup showing how permissions are displayed to user
- **MISSED:** No "permission boundaries" help text (e.g., "As contributor, you can X but not Y")

✓ **LEARNING from peer orgs**
- **SUPPORTS:** Research library filterable by tag/topic (line 777-780)
- **SUPPORTS:** Can see which org shared each document (provenance)
- **SUPPORTS:** Full-text search across network research (line 779)
- **SUPPORTS (FUTURE):** RAG/AI search: "Find approaches to youth burnout" (Phase 1B stretch, line 782-788)
- **HINDERS:** No way to message org that shared interesting research (by design - line 17)
- **LOST FROM ORIGINAL:** No "learning circles" feature (concept line 155-161)

✓ **CONFIDENCE won't expose private info**
- **SUPPORTS:** Visibility level field with clear options: 'private', 'network', 'public' (line 450)
- **SUPPORTS:** Default visibility (to be decided - open question #2, line 983-985)
- **SUPPORTS:** RLS policies enforce visibility at database level (line 642-674)
- **CRITICAL GAP:** No UI guidance on "when should research be private vs. network?"
- **NEEDS:** Help text explaining: "Private = your org only; Network = all WBP orgs; Public = searchable on web"

✓ **RECIPROCITY through platform use**
- **SUPPORTS:** Uploading research contributes to network knowledge (Phase 1B)
- **SUPPORTS:** Adding service providers helps other orgs (line 88)
- **SUPPORTS:** Low time investment (line 123-127 user journey - ~30 min quarterly)
- **DESIGN DECISION:** Reciprocity is core value (line 67, org admin values)
- **MISSED:** No visibility into "3 orgs downloaded our research" (usage stats)

### Overall: **GOOD ALIGNMENT** (70%)

Keisha's values are supported by the **role system and research features**, but lack **peer connection** and **usage feedback** that would deepen learning and reciprocity.

**Quick win:** Add research download counts and "Recently viewed by Org X, Org Y" to show contribution impact.

---

## Cross-Cutting Insights

### 1. The Privacy-Visibility Paradox

**Pattern:** Every privacy protection (good for Marisol, Aaron) removes a connection opportunity (bad for James, partially for Keisha).

**Design Tension:**
- `users` table: No public visibility → protects from state actors ✓
- Side effect: "Individuals cannot be seen" → excludes peer belonging ✗
- Resolution: Original Hearth had **opt-in visibility toggles per field** (rationale line 176-180)
- **Current MVP:** No toggles—visibility fixed by entity type (org/provider/user)

**Recommendation:** Post-MVP, add individual profiles with **privacy-by-default, selective opt-in**:
```sql
user_profile_visibility (
  user_id UUID,
  field_name TEXT,
  visibility_level TEXT  -- 'private', 'org', 'network', 'public'
)
```

### 2. The Relational Data is Missing

**Pattern:** The database schema is **entity-centric** (orgs, providers, documents) but lacks **relationship-centric** tables.

**Lost relational features from original Hearth:**
- Peer interviews (concept line 98-109) → No `interviews` table
- Gratitude/appreciation (concept line 132-138) → No `appreciations` table
- Ways-of-being sharing (rationale line 207-218) → No `ways_of_being` table
- Offers & needs matching (concept line 112-120) → No `offers` or `needs` tables

**Why this matters:**
- Current schema stores **facts** (who, what, where)
- Original vision centered **stories** (how people see each other, what they've received/offered)
- Wellbeing work is inherently relational—the data model doesn't reflect this

**Recommendation:** Phase 2 add:
```sql
peer_reflections (  -- Replaces "interviews"
  id UUID,
  about_user_id UUID,  -- Person being reflected on
  by_user_id UUID,     -- Person offering reflection
  reflection_text TEXT,
  gifts_named TEXT[],  -- "You helped me see..."
  approved BOOLEAN,
  created_at TIMESTAMPTZ
)

gratitudes (
  id UUID,
  to_user_id UUID,      -- Can be NULL for "grateful to the community"
  from_user_id UUID,
  gratitude_text TEXT,
  is_public BOOLEAN,
  created_at TIMESTAMPTZ
)
```

### 3. The Temporal Layer is Absent

**Pattern:** Original Hearth design had **seasonal rhythms** (3-4 pulses/year, Hearth Season update, quarterly spotlights). Current MVP is **event-based** (user uploads, searches, deploys survey) with no temporal structure.

**Lost temporal features:**
- Seasonal SMS check-ins (rationale line 138-162)
- Yearly Hearth Season update (concept line 229-232)
- Profile versioning to see "how has this person/org grown" (technical-overview line 63-74)
- Quarterly spotlights (concept line 246-249)

**Why this matters:**
- Wellbeing changes over time—snapshots miss the story
- Rhythms create **gentle obligation** ("everyone updates in March") vs. **forgetting to update**
- Seasons build **communal moments** that strengthen belonging

**Evidence:** The `ProfileVersion` table exists in original technical spec (technical-overview line 63-74) but is **absent from current schema**.

**Recommendation:** Add temporal scaffolding:
```sql
-- From original design, add back:
profile_snapshots (
  id UUID,
  organization_id UUID,  -- Adapt for org-first model
  snapshot_date TIMESTAMPTZ,
  snapshot_data JSONB,   -- Full state at that moment
  season TEXT            -- 'spring_2025', 'fall_2025'
)

seasonal_invitations (
  id UUID,
  season TEXT,
  sent_at TIMESTAMPTZ,
  prompt_text TEXT,      -- "What has shifted in your wellbeing work?"
  response_count INT
)
```

### 4. The Research Suggests Missing Features

**Pattern:** `wellbeing_hearth_rationale.md` cites **robust research** (EMA, single-item scales, participant burden studies) to justify design choices... but those choices aren't in the current MVP.

**Research-backed features NOT in current schema:**
- Single-item wellbeing check-ins (rationale line 78-95) → No `pulse_checks` table
- Low-burden seasonal pulses (rationale line 59-76) → No implementation
- Time-series wellbeing data (rationale line 72-74) → No temporal tables
- "Ways of being" tracking (rationale line 207-218) → No `ways_of_being` dimension

**What IS in current schema:**
- Survey tool (Phase 1C) - but designed for **org-wide deployment**, not individual pulse checks
- `survey_responses.scores` JSONB (line 587) - could store wellbeing scores

**Disconnect:** The survey tool serves **Richie's research** (org-level baseline). The seasonal pulse serves **individual self-understanding** and **Aaron's ecosystem sensing**. These are different jobs.

**Recommendation:** Don't conflate them. Add lightweight pulse system alongside surveys:
```sql
pulse_responses (
  id UUID,
  user_id UUID,                    -- Individual, not org
  sent_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  wellbeing_score INT,             -- 1-5 single item
  reflection_text TEXT,            -- Optional one sentence
  season TEXT,
  consented_to_aggregate BOOLEAN   -- Aaron can see aggregate only
)
```

### 5. Scope Reduction Aligns with Threat Model

**Pattern:** Almost every feature removal from Hearth → Springboard can be traced to the **state actor threat model** (line 908-920).

| Original Feature | Current Status | Reason |
|---|---|---|
| Individual public profiles | ❌ Removed | Exposure risk (line 15-16) |
| Member-to-member messaging | ❌ Removed | Surveillance vector (line 17) |
| Offers & needs board | ❌ Removed | Reveals activist identity/needs |
| Global hearth map | ❌ Removed | Geographic tracking risk |
| Peer-to-peer features | ❌ Removed | Network analysis risk |

**This is coherent**—but it means the platform cannot serve **individual belonging needs** under this threat model.

**Two paths forward:**
1. **Accept trade-off:** Springboard serves orgs, future separate tool serves individuals
2. **Differential privacy:** Add individual features with privacy budget, anonymization, aggregation
   - E.g., "5 organizers in the Pacific Northwest are exploring grief work" (no names)
   - E.g., Opt-in profiles with plausible deniability ("profile may not reflect current activity")

---

## Recommendations

### High Priority (Affects Multiple Personas)

**H1. Resolve service provider editing rights** (Open Question #4)
- **Affects:** Dr. Amara (autonomy), Marisol (trust in accuracy)
- **Recommendation:** Hybrid model
  - Providers control: bio, photo, contact info, availability status
  - Orgs control: recommendation text, relationship notes
  - Audit log shows who edited what
- **Implementation:** Add `last_edited_by_user_id` to `service_providers`, gate fields by RLS

**H2. Add research visibility guidance in UI**
- **Affects:** Keisha (confidence), all orgs (privacy)
- **Recommendation:** Inline help text on upload form:
  ```
  Private: Only your organization can see this
  Network: All WBP organizations can access (recommended for sharing learnings)
  Public: Searchable on web (use for public reports only)
  ```
- **Implementation:** Add tooltip component, set smart default based on document type

**H3. Clarify default research visibility** (Open Question #2)
- **Affects:** All organizations
- **Recommendation:** Default to **"network"** to encourage sharing, with prominent toggle
- **Rationale:** Aligns with reciprocity value; org can change before publishing

**H4. Decide on Phase 2 individual profile approach**
- **Affects:** James (excluded), future ecosystem growth
- **Recommendation:** Post-MVP, add **opt-in individual profiles** with:
  - Privacy-by-default (only name + rough location visible initially)
  - Field-level visibility controls
  - Ability to affiliate with org OR be independent
  - Clear informed consent re: risks
- **Implementation:** Extend `users` table, add `profile_visibility` table, update RLS policies

### Medium Priority

**M1. Add research contribution visibility**
- **Affects:** Keisha (reciprocity feedback), all contributors
- **Recommendation:** Show "Downloaded by 3 organizations" on research items
- **Implementation:** Add `research_downloads` tracking table, aggregate view

**M2. Add temporal layer for seasonal rhythms**
- **Affects:** Aaron (ecosystem sensing), aligns with research (wellbeing_hearth_rationale.md)
- **Recommendation:** Add `pulse_responses` table for lightweight check-ins (separate from heavy surveys)
- **Implementation:** See schema in Cross-Cutting Insight #4

**M3. Surface ecosystem patterns for Aaron**
- **Affects:** Aaron (emergent possibilities)
- **Recommendation:** Admin dashboard shows:
  - "Top 10 research tags this quarter" (shows where orgs are focusing)
  - "Geographic distribution of service providers" (shows coverage gaps)
  - "Org→provider recommendation network" (graph visualization)
- **Implementation:** Aggregate queries, data viz library

**M4. Add permission boundary UI clarity**
- **Affects:** Keisha (role clarity), all non-admin members
- **Recommendation:** Dashboard shows: "As Contributor, you can: ✓ Upload research, ✓ Add providers, ✗ Manage members"
- **Implementation:** Permission matrix component based on `permissions` JSONB

### Low Priority

**L1. Add "pause my profile" for service providers**
- **Affects:** Dr. Amara (boundary control)
- **Recommendation:** Add `is_visible` boolean to `service_providers` table, separate from `is_accepting_clients`
- **Rationale:** "Not accepting" vs "don't show me at all" are different states

**L2. Consider relational data tables (Phase 3)**
- **Affects:** Future Hearth vision alignment
- **Recommendation:** Add `peer_reflections` and `gratitudes` tables (see Cross-Cutting Insight #2)
- **Rationale:** Enables relational features if threat model evolves

**L3. Add smart service provider tags**
- **Affects:** Dr. Amara (context in referrals), Marisol (finding right-fit providers)
- **Recommendation:** Support community tags like "experienced with Black organizers," "LGBTQ-affirming," "sliding scale"
- **Implementation:** Add `community_experience` TEXT[] to `service_providers`, make searchable
- **Privacy consideration:** These should be added by providers themselves, not inferred from org affiliations

---

## Questions for Discussion

These are **values conflicts** that need human decision-making, not just technical solutions:

### Q1: What is the Springboard's relationship to individual wellbeing?

**Tension:** The platform is for organizational resource-finding, but wellbeing is inherently personal.

- Marisol needs to find resources for her *staff members* (individuals)
- Those staff members (like James) may not be affiliated with an org
- The original Hearth vision centered individual wellbeing journeys
- The current MVP obscures individuals entirely

**Questions:**
- Is individual invisibility a **temporary MVP scope decision** or a **permanent architectural principle**?
- If WBP believes "changemakers need peer belonging to sustain" (original concept line 39), where does that happen if not here?
- Should there be a separate tool for individual members, or is that abandoning the integrated vision?

### Q2: How much emergence vs. efficiency?

**Tension:** "Springboard" optimizes for **fast resource access**. "Hearth" optimized for **relational emergence and surprise** (concept line 51-53).

- Marisol's 5-minute user journey (line 86-92) is beautiful efficiency
- But it means she never sees "Oh, this org is also working on youth burnout—I should connect with them"
- The research repository enables some serendipity (browsing tags)
- But there's no "you and 3 others are exploring grief work right now" feature

**Questions:**
- Is the efficiency focus appropriate for MVP and we add emergence later?
- Or does removing relational features change the **kind of wellbeing** the platform supports?
- What's the minimum viable emergence?

### Q3: Who is the platform protecting, and from whom?

**Tension:** The threat model (state actors, line 908-920) is **real and serious**. But it assumes:
- Organizations can be visible (they already are—they're registered nonprofits)
- Individuals cannot (they must be hidden)
- Service providers are public (they advertise their services)

**Questions:**
- Is this the right threat boundary? (Orgs face state scrutiny too)
- Could individual profiles use **differential privacy** techniques (noise, aggregation) to allow some visibility without precision tracking?
- Are there community members who *want* to be visible as part of a movement (like original Hearth assumed)?
- Should visibility be **user choice with informed consent** rather than architectural restriction?

### Q4: What's the measure of success?

**Tension:** Different personas have different success metrics.

- **Marisol:** "I found a therapist in 5 minutes" ← transactional
- **James:** "I feel less alone in this work" ← relational
- **Dr. Amara:** "I got 3 right-fit referrals this year" ← quality
- **Aaron:** "Orgs are supporting each other without me" ← distribution
- **Keisha:** "I learned a new approach from another org's research" ← peer learning

**Questions:**
- Which of these is the **primary** success metric for MVP?
- Are the others deferred, or fundamentally out of scope?
- How will you know if the platform is serving wellbeing vs. just serving efficiency?

### Q5: Is this Springboard or Hearth?

**Tension:** The names reflect different philosophies.
- **Springboard:** "Access what you need and move on" (line 6)
- **Hearth:** "Sit, be seen, belong, warm yourself" (concept line 20-21)

Both are valid—but they're different tools for different needs.

**Questions:**
- Has the vision changed, or is this a phased approach where Hearth features come later?
- If this is a true pivot, should the original Hearth docs be archived to avoid confusion?
- Or is the long-term vision to have both layers: a fast Springboard surface with a slow Hearth depth for those who want it?

---

## Conclusion

The **Springboard MVP design is excellent** at what it optimizes for: **safe, fast, organization-mediated resource access**. The database schema is clean, the security architecture is robust, and the user journeys for Marisol and Aaron are coherent.

**However**, the design systematically excludes **individual belonging, relational emergence, and peer witnessing**—values that were central to the original Hearth vision and that wellbeing research suggests are critical for sustained changemaker resilience.

This is not a failure. **It's a choice.** But it's a choice that should be made explicitly, with awareness of:
- Who is served (organizations, institutional sustainability)
- Who is not served (independent organizers, peer belonging needs)
- What is gained (safety, efficiency, simplicity)
- What is lost (community, emergence, relational depth)

### If you proceed with current MVP:

**Strengths to preserve:**
- Organization-first model for pilot (limits scope, builds with known community)
- Hardened security architecture (appropriate for context)
- Springboard philosophy (respect for user time)
- Org-mediated service providers (trust signals, no self-promotion)

**Gaps to address before launch:**
- Resolve service provider editing rights (H1)
- Add research visibility guidance (H2)
- Clarify role permissions in UI (M4)

**Post-MVP evolution paths:**
- **Path A (Expand):** Add opt-in individual profiles with privacy controls → serve James
- **Path B (Deepen):** Add relational data (peer reflections, gratitudes) → serve Hearth vision
- **Path C (Sense):** Add temporal layer (seasonal pulses, snapshots) → serve research vision
- **Path D (Connect):** Add emergence features (pattern surfacing, themed circles) → serve Aaron's visibility

You don't have to do all of these—but you should **choose** which values the platform will serve, and design accordingly.

---

**Next step:** Discuss Q1-Q5 with Aaron, Ale, and Richie to align on values priorities before implementing database schema.
