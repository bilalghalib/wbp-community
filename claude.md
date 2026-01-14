# Springboard - Wellbeing Project

## Project Context
**Current Phase:** Phase 1 (Platform Build & Internal Testing)
**Last Update:** January 14, 2026
**Recent Meeting:** Jan 9, 2026 (Bilal & Ale)

## Vision
To create a "Springboard" platform for the Wellbeing Project community (approx. 1200 organizations). The platform serves as a resource hub and a "Data Intelligence Hub" to capture and aggregate regional and sectoral insights on wellbeing.

## Strategic Decisions & Roadmap

### Phasing
1.  **Phase 1 (Current):** Platform build, internal testing with Wellbeing Project team (5 users). Focus on "Happy Path" and core features.
2.  **Phase 2:** Pilot testing with 30 participants. Budget approx. 1500. Focus on feedback and bug fixes.
3.  **Phase 3:** Scaled soft launch in batches of 30. Budget approx. 2500.

### Core Features & Logic
-   **Annual Member Survey (The "Gate"):**
    -   Users must complete an annual "contribution" (survey + resource sharing) to renew platform access.
    -   Captures: Profile updates, new resources/practitioners, and qualitative regional insights.
    -   **Magic Moment:** Reveal community insights/aggregate data upon completion (e.g., "Your Year in Wellbeing").
-   **Data Intelligence Hub:**
    -   Aggregates data by Region and Sector.
    -   **Privacy Rule:** For organizations with < 7 members, data is **only** aggregated at the Regional/Sector level, never shown at the Organization level to preserve anonymity.
    -   **CRED Framework (Concept):** For processing qualitative text inputs (insights):
        -   **C**onfidence (LLM confidence score)
        -   **R**ationale (Why the LLM classified it this way)
        -   **E**vidence (The original raw text saved to avoid hallucination)
        -   **D**ecision (The resulting structured taxonomy tag)
-   **User Experience:**
    -   **Web App Only:** No mobile app planned.
    -   **Dashboard:** Needs a "My Resources" view for users to see their contributions.
    -   **Notifications:** "Notification Strategy" via dashboard inbox + email alerts (no push notifications).
    -   **Surveys:** Deployed by Wellbeing Project Admin (not individual orgs). Must have **closing dates** to drive urgency and allow for static analysis periods.

## Immediate Action Items
-   [ ] **Survey Engine:** Implement the "Gatekeeper" logic for the Annual Survey.
-   [ ] **Dashboard:** Add "My Resources" filter/view.
-   [ ] **Data:** Generate sample data for internal testing (Practitioners, Resources).
-   [ ] **UX:** Wait for Ale to provide survey questions and taxonomies (Regions, Sectors).
-   [ ] **Routine:** Weekly check-ins established (Wednesdays 3:30 PM).

## Technical Constraints & Preferences
-   **Stack:** Next.js + Supabase (Production grade).
-   **Security:** High priority. Prefer aggressive data aggregation/anonymization over storing sensitive individual data long-term.
-   **GDPR:** Verify server locations (European preference).

## Memory Bank
-   **User:** Bilal Ghalib.
-   **Project Lead:** Ale (Wellbeing Project).
-   **Key Contact:** Aaron (Vision/Leadership).
-   **Coordinator:** Joining February 2026 (junior role for outreach/scheduling).
-   **Values:** "White Glove" support (human connection) initially, automated later. Idiomatic code, clean architecture.

## Development Track Record

### Git History (25 commits since Jan 2025)
```
5ea50b4 toot (Jan 14, 2026)
87eb58d fix: handle polymorphic organization response in survey deploy page
4040ddf feat: add Security Explained page with mermaid diagrams
912a071 feat: add FAQ/Community Guidelines page with liability disclaimer
fd66297 Add service provider photo upload and edit functionality (Dec 2025)
94c76ac Add comprehensive testing suite and development documentation
6cb8ad2 Complete Phase 1C: Survey Tool with privacy-first aggregate analytics
b7cda86 Complete Phase 1B: Research Repository with PDF uploads
15f9182 Complete Phase 1A Week 3-4: Organization Management + WBP Admin Panel
71c2e29 Complete Phase 1A Week 2: Service Provider Registry with trust signals
f1f2d66 Implement complete Phase 1 scaffolding: Database + Next.js foundation (Nov 2025)
```

### What's Been Built (Phase 1 Complete)
- ✅ Database schema (11 tables) with comprehensive RLS policies
- ✅ Authentication (email/password via Supabase)
- ✅ Organization management (create, members, roles)
- ✅ Service Provider Registry (add, search, recommendations, trust signals)
- ✅ Research Repository (PDF upload, tagging, full-text search)
- ✅ Survey Tool (deploy, respond, aggregate-only results)
- ✅ WBP Admin Panel (manage orgs, view activity)
- ✅ FAQ & Security Explained pages

## Key Resources

-   `/Research/mvp-design-plan.md` - Original MVP specification
-   `/Research/vx-audit-report.md` - Values alignment analysis
-   `/Research/Alehandra-Bilal-Friday-Jan-9-2026.md` - Latest planning meeting notes
-   `/Research/phase-1*` - Implementation guides for each phase

## Budget Summary
| Phase | Budget | Description |
|-------|--------|-------------|
| Phase 1 | ~€2,000 | Build + internal testing |
| Phase 2 | ~€1,500 | 30 participant testing |
| Phase 3 | ~€2,500 | Scaled soft launch |
| **Total** | **~€6,000** | Through Week 13 |