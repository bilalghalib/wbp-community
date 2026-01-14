# WBP Community Platform (Springboard)

A resource sharing and data intelligence platform for the Wellbeing Project community, designed to connect organizations with practitioners, resources, and regional insights.

## Project Status
**Current Phase:** Phase 1 - Prototype & Internal Testing

## Roadmap

### Phase 1: Build & Internal Validation (Current)
-   **Goal:** Functional prototype for internal team (5 users).
-   **Key Features:**
    -   Resource & Service Provider directory.
    -   Organization management.
    -   "Annual Survey" logic as a gateway to platform access.
    -   Basic "Data Intelligence" visualization.
-   **Deliverable:** Deployed web application ready for internal data entry and review.

### Phase 2: Pilot Group
-   **Goal:** Testing with 30 selected community members.
-   **Focus:** UX refinement, bug squashing, and validating the "Exchange" value proposition (Give to Get).

### Phase 3: Scaled Soft Launch
-   **Goal:** Rolling onboarding in batches of 30.
-   **Focus:** Community building, scaling data aggregation, and refining the "Data Intelligence Hub".

## Core Concepts

### The "Exchange" (Annual Gate)
Access to the platform is granted annually through an act of contribution. Users must complete the **Annual Member Survey**—updating their profile, sharing new resources, and providing regional insights—to unlock the platform's full value for the year.

### Data Intelligence Hub & Privacy
-   **Aggregation:** Insights are aggregated by **Region** and **Sector**.
-   **Small Group Protection:** Organizations with fewer than 7 members will *not* see organization-specific aggregates to protect individual anonymity. Their data contributes only to the broader Regional/Sector pools.
-   **CRED Framework:** We utilize a "CRED" (Confidence, Rationale, Evidence, Decision) approach for AI-assisted analysis of qualitative survey data, ensuring structured insights are always backed by preserved raw evidence.

## Tech Stack
-   **Frontend:** Next.js (React), Tailwind CSS
-   **Backend/Database:** Supabase (PostgreSQL, Auth)
-   **Testing:** Vitest, Playwright
-   **Analysis:** Local/Cloud LLM integration for unstructured data processing (planned).

## Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run development server:**
    ```bash
    npm run dev
    ```

3.  **Run tests:**
    ```bash
    npm run test
    ```

## Directory Structure
-   `/app`: Next.js App Router pages and API routes.
-   `/components`: Reusable UI components.
-   `/lib`: Utility functions and Supabase clients.
-   `/supabase`: Database migrations and types.
-   `/e2e`: Playwright end-to-end tests.
-   `/Research`: Project documentation, interview transcripts, and strategic planning documents.

## Development History

### What's Been Built (Phase 1 Complete - Nov 2025)
- ✅ 11-table database schema with RLS policies
- ✅ Service Provider Registry with trust signals
- ✅ Research Repository with PDF uploads & full-text search
- ✅ Survey Tool with aggregate-only analytics
- ✅ Organization management & WBP Admin Panel
- ✅ FAQ & Security Explained pages

### Recent Commits
| Date | Commit | Description |
|------|--------|-------------|
| Jan 2026 | `87eb58d` | Fix polymorphic org response in survey deploy |
| Jan 2026 | `4040ddf` | Security Explained page with diagrams |
| Jan 2026 | `912a071` | FAQ/Community Guidelines page |
| Dec 2025 | `fd66297` | Service provider photo upload |
| Nov 2025 | `6cb8ad2` | Phase 1C: Survey Tool complete |
| Nov 2025 | `b7cda86` | Phase 1B: Research Repository complete |
| Nov 2025 | `f1f2d66` | Phase 1 scaffolding: Database + Next.js |

## Resources
-   **MVP Plan:** `/Research/mvp-design-plan.md`
-   **Values Audit:** `/Research/vx-audit-report.md`
-   **Meeting Notes:** `/Research/Alehandra-Bilal-Friday-Jan-9-2026.md`