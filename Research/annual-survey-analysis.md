# Annual Survey Analysis & Implementation Strategy

**Date:** January 14, 2026
**Source:** `Springboard Annual Survey.xlsx` from Ale
**Purpose:** Decompose survey requirements, identify gaps, and plan implementation

---

## Executive Summary

Ale provided a comprehensive survey specification with **5 major sections**, **60+ fields**, and a **complete TWP taxonomy** (17 dropdown categories with 400+ values). This is significantly more complex than our current implementation.

### Key Findings
1. **Survey is multi-purpose**: Updates org data, personal data, practitioners, resources, AND collects insights
2. **Many fields need multi-select**: Most taxonomy fields allow "more than 1" selection
3. **Quality concerns raised**: Ale asks "How do we ensure spelling?" for most open text fields
4. **Consent checkboxes required**: For practitioners and resources
5. **8 qualitative insight questions**: Rich open-text for CRED/LLM processing

---

## Survey Structure Breakdown

### Section 1: Organization Data (14 fields)
**Note:** Ale questions "Who fills in this info? I don't think this should be in the annual survey for all, just for admins"

| Field | Type | Multi-select | Notes |
|-------|------|--------------|-------|
| Name | Open Text | - | Consistency/spelling concern |
| Website | Open Text | - | Spelling concern |
| Description | Open Text | - | Grammar concern |
| Type of Registration | Dropdown (6) | No | Org/Network/Person/Program/Corp/Event |
| Legal Status | Dropdown (4) | No | For-Profit/NGO/Public/Unclear |
| Entity Size (staff) | Dropdown (9) | No | 1 to 5001+ |
| Entity Type | Dropdown (17) | No | CSO, Consultancy, Educational, etc. |
| Headquarters - Country | Dropdown (193) | **Yes** | Auto-link to Region |
| Geographic Area of Work | Dropdown (193) | **Yes** | "What if Global?" |
| Area of Work | Dropdown (21) | **Yes** | Advisor, Advocacy, Coaching, etc. |
| Focus of Work | Dropdown (37) | **Yes** | Agriculture, Climate, Democracy, etc. |
| Target Audience | Dropdown (34) | **Yes** | Individuals, Children, Women, etc. |
| Audience Specifics | Dropdown (30) | **Yes** | Activists, Refugees, Leaders, etc. |
| Community Type & Beneficiaries | Dropdown (5) | **Yes** | Fellows, Grantees, Members, etc. |

**Decision Needed:** Should this section be admin-only or in annual survey for all?

---

### Section 2: Personal Data (3 fields)

| Field | Type | Multi-select | Notes |
|-------|------|--------------|-------|
| Email | Open Text | - | Spelling concern |
| Organization | Open Text / Dropdown | - | "Default by Org Admin? Drop down from existing Orgs?" |
| Nationality - Country | Dropdown (193) | No | Auto-link to Region |

**Decision Needed:** Is this for the logged-in user's profile update?

---

### Section 3: Practitioners (16 fields)
**Note:** Ale asks "What if they want to add more than 1 practitioner on the survey?"

| Field | Type | Multi-select | Notes |
|-------|------|--------------|-------|
| Full Name | Open Text | - | Spelling concern |
| Website | Open Text | - | |
| Email | Open Text | - | |
| Phone | Open Text | - | Area code concern |
| Profile Photo | File Upload | - | JPG/PNG/GIF, Max 2MB |
| Biography | Open Text | - | |
| Location: City, State | Open Text | - | |
| Location: Country | Dropdown (193) | No | Auto-link to Region |
| Offers remote sessions | Yes/No/Unsure | - | |
| Offers in-person sessions | Yes/No/Unsure | - | |
| Currently accepting clients | Yes/No/Unsure | - | |
| Specialties | Dropdown (17) | **Yes** | Burnout, Trauma, Leadership, etc. |
| Modalities & Approaches | Dropdown (16) | **Yes** | Breathwork, Coaching, Somatic, etc. |
| Language(s) | Dropdown (18) | **Yes** | English, Spanish, Arabic, etc. |
| Relationship Note | Open Text | - | |
| **Consent Checkbox** | Checkbox | - | "This practitioner agreed to be recommended or contacted" |

**Current Implementation Gap:** We have single practitioner add, not batch add in survey

---

### Section 4: Resources (13 fields)
**Note:** Ale asks "What if they want to add more than 1 resource on the survey?"

| Field | Type | Multi-select | Notes |
|-------|------|--------------|-------|
| Resource Type | Dropdown (14) | **Yes** | Article, Book, Podcast, Toolkit, etc. |
| Upload File | File Upload | - | PDF, MOV, MP4, Doc, JPG |
| External Link / URL | Open Text | - | |
| Language(s) | Dropdown (18) | **Yes** | |
| Title | Open Text | - | |
| Description | Open Text | - | |
| Authors | Open Text | - | "Can be org too, not individual" |
| Publication Year | Open Text | - | "What if they don't know?" |
| Area | Dropdown (18) | **Yes** | Burnout, Climate, Collective Care, etc. |
| Topic | Dropdown (18) | **Yes** | Art, Cities, Governance, etc. |
| Geographic Context - Region | Dropdown (17) | **Yes** | "What if global or no context?" |
| Recommendation Note | Open Text | - | Why recommending |
| Visibility | Public/Private | - | |
| **Consent Checkbox** | Checkbox | - | "I confirm this resource is available for sharing..." |

**Current Implementation Gap:** We have resource upload, but missing consent flow

---

### Section 5: Collective Insights from the Field (8 questions)
**All Open Text - Prime candidates for CRED/LLM processing**

| # | Question | Suggested Enhancement |
|---|----------|----------------------|
| 1 | What are the most pressing wellbeing needs you are seeing right now among the people or communities you work with? | Specify by region/audience |
| 2 | Compared to the past 12 months, what has shifted in wellbeing challenges or capacities in your context? | Specify by region/audience |
| 3 | What social, political, economic, environmental, or cultural factors are most shaping wellbeing where you are? | Specify by region |
| 4 | What practices, approaches, or ways of working feel especially promising or effective in your context right now? | Specify by region/audience |
| 5 | How is wellbeing talked about in your context, if at all? Who feels able to talk about it, and where does it remain invisible or taboo? | Specify by region/audience |
| 6 | To what extent are Indigenous, ancestral, or culturally rooted understandings of wellbeing recognized or integrated where you work? How are they treated? | Specify by region |
| 7 | How do public institutions or governments in your region engage with wellbeing, and where do you see alignment or tension with lived realities? | Specify by region |
| 8 | Looking ahead, what would a more wellbeing-centered social change ecosystem look like in your context? Please share one story, belief, or practice from your region that the field should learn from. | Specify by region/audience |

---

## TWP Taxonomy Summary (17 Categories)

| Category | Items | Used For |
|----------|-------|----------|
| Type of Registration | 6 | Organization |
| Legal Status | 4 | Organization |
| Entity Size | 9 | Organization |
| Entity Type | 17 | Organization |
| Continent | 6 | Geography |
| Country | 193 | Geography |
| Region | 17 | Geography |
| Area of Work | 21 | Organization |
| Focus of Work | 37 | Organization |
| Target Audience | 34 | Organization |
| Audience Specifics | 30 | Organization |
| Community Type & Beneficiaries | 5 | Organization |
| Specialties | 17 | Practitioners |
| Modalities & Approaches | 16 | Practitioners |
| Language | 18 | Practitioners + Resources |
| Resource Type | 14 | Resources |
| Area (Wellbeing Domain) | 18 | Resources |
| Topic | 18 | Resources |

**Total: ~400+ dropdown values to import**

---

## Gap Analysis: Current vs. Required

### What We Have
- [x] Service Provider Registry (basic fields)
- [x] Research Repository (PDF upload, tags)
- [x] Survey Tool (deploy, respond, aggregate)
- [x] Organization management (members, roles)

### What We Need to Add/Modify

#### High Priority (Phase 2 Blockers)
1. **Multi-select dropdowns** - Most taxonomy fields need this
2. **Consent checkboxes** - Required for practitioners and resources
3. **"Add another" pattern** - Add multiple practitioners/resources in one survey
4. **TWP Taxonomy import** - 400+ values need to be in database
5. **Country → Region auto-linking** - When country selected, infer region
6. **Annual Survey "Gate" flow** - Block platform access until completed

#### Medium Priority
1. **Organization profile expansion** - 14 new taxonomy fields
2. **Personal profile section** - User nationality, organization link
3. **Resource visibility toggle** - Public vs Private
4. **Geographic Context** - "Global" option for resources/orgs

#### Lower Priority (Phase 3+)
1. **Spelling/grammar validation** - AI-assisted or human review
2. **CRED processing** - LLM analysis of 8 insight questions
3. **Data aggregation by Region/Sector** - Visualization dashboards

---

## Open Questions for Ale

### Survey Flow
1. **Admin-only sections?** Should Organization Data be separate from annual survey?
2. **Multiple practitioners/resources?** How many can they add per survey? Unlimited?
3. **Required vs Optional?** Which fields are mandatory?
4. **Skip logic?** Can users skip sections they don't want to contribute to?

### Data & Privacy
5. **Personal nationality storage?** Is this sensitive data we should aggregate?
6. **Resource visibility default?** Public or Private?
7. **"Global" option?** How to handle orgs/resources with no geographic context?

### UX
8. **Survey length concern?** This is 60+ fields - should it be paginated/sectioned?
9. **Save progress?** Can users save draft and return?
10. **"Magic moment" reveal?** What data shows when they complete?

---

## Proposed Implementation Strategy

### Phase 2A: Database & Taxonomy (Week 1)
1. Create `twp_taxonomy` tables (or JSON constants)
2. Add Country → Continent → Region mapping table
3. Extend `organizations` table with new fields
4. Extend `service_providers` with new fields
5. Extend `research_documents` with new fields
6. Add consent tracking fields

### Phase 2B: Multi-Select Components (Week 1-2)
1. Build reusable multi-select dropdown component
2. Implement "Add another" pattern for dynamic forms
3. Build file upload with consent checkbox
4. Create Yes/No/Unsure radio component

### Phase 2C: Annual Survey Form (Week 2-3)
1. Multi-page/accordion form layout
2. Section 1: Organization Data (admin only? or all?)
3. Section 2: Personal Data (profile update)
4. Section 3: Practitioners (with "Add another")
5. Section 4: Resources (with "Add another")
6. Section 5: Collective Insights (8 open text)
7. Progress indicator + save draft

### Phase 2D: Gate Logic (Week 3)
1. Check if user completed annual survey this year
2. Block access to main platform if not
3. Show "Your contributions" summary on completion
4. Store survey completion timestamp per user

### Phase 3: CRED Processing (Future)
1. Process insight questions with LLM
2. Extract: Confidence, Rationale, Evidence, Decision
3. Aggregate by Region and Sector
4. Build visualization dashboard

---

## Immediate Next Steps

1. **Review this analysis** with Ale on Wednesday check-in
2. **Clarify open questions** (especially admin-only sections)
3. **Import TWP taxonomy** into database/constants
4. **Build multi-select component** (high reuse)
5. **Create survey form skeleton** with sections

---

## Appendix: Full Taxonomy Values

See `Springboard Annual Survey.xlsx` → "TWP Taxonomy" sheet for complete lists.

Key categories for quick reference:

### Practitioner Specialties (17)
- Burnout & Chronic Stress Recovery
- Compassion Fatigue & Moral Injury
- Conflict Transformation & Mediation
- Cultural & Intergenerational Healing
- Ecosystem and Movement Building
- Emotional Resilience & Regulation
- Family Systems & Relational Work
- Grief, Loss & Life Transitions
- Group Facilitation & Collective Processes
- Identity-Based & Racialized Stress
- Leadership Coaching
- Organizational Wellbeing & Team Care
- Retreat Design & Facilitation
- Somatic & Body-Based Healing
- Spiritual & Meaning-Centered Support
- Trauma-Informed Healing
- Youth Wellbeing

### Regions (17)
- West & Central Africa
- East & South Africa
- Latin America
- US & Canada
- Southeast Asia
- East Asia
- WANA (West Asia & North Africa)
- Central Asia
- European Mediterranean
- Central & Eastern Europe
- Western Europe
- Northern Europe
- Oceania
- Himalayan
- India
- Brazil
- Bangladesh
