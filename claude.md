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
-   **Values:** "White Glove" support (human connection) initially, automated later. Idiomatic code, clean architecture.