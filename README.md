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