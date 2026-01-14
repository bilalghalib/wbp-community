# Jan 9 Conversation vs. Ale's Spreadsheet: Gap Analysis

**Date:** January 14, 2026
**Purpose:** Cross-reference what was discussed vs. what was delivered to identify alignment, surprises, and questions

---

## Side-by-Side Comparison

| Topic | Jan 9 Discussion | Spreadsheet Reality | Gap/Alignment |
|-------|------------------|---------------------|---------------|
| **Survey Purpose** | "Annual gate" + regional insights | ✅ Exactly this, plus org/personal updates | BIGGER than expected |
| **Taxonomies** | "Ale to provide" | ✅ **400+ values in 17 categories** | DELIVERED |
| **Regions/Sectors** | "Need to map" | ✅ 17 regions, country mapping provided | DELIVERED |
| **Structured vs Free-text** | "Prefer structured with open input" | ✅ Mix: dropdowns + 8 open-text questions | ALIGNED |
| **CRED Processing** | "For qualitative insights" | ✅ 8 insight questions ready for CRED | ALIGNED |
| **Practitioner Fields** | Existing basic fields | 16 fields with consent checkbox | EXPANDED |
| **Resource Fields** | Existing basic fields | 13 fields with consent + visibility | EXPANDED |
| **Organization Data** | Not discussed in detail | **14 new taxonomy fields** | SURPRISE |
| **Personal Data Section** | Not discussed | **New section (3 fields)** | SURPRISE |
| **Multi-select** | Not discussed | **Needed for most fields** | NEW REQUIREMENT |
| **"Add Another" Pattern** | Mentioned briefly | **Critical for practitioners/resources** | NEW REQUIREMENT |
| **Consent Checkboxes** | Not discussed | **Required for practitioners AND resources** | NEW REQUIREMENT |

---

## What Aligned Perfectly

### 1. Annual Survey as "Gate"
- **Jan 9:** "You don't get access until you do this at least once a year"
- **Spreadsheet:** Survey collects everything needed to "unlock" the platform

### 2. Regional Data Aggregation
- **Jan 9:** "Aggregate at region/sector when necessary" + "<7 members = only regional"
- **Spreadsheet:** Full region taxonomy (17 regions), country-region mapping provided

### 3. CRED Framework Fit
- **Jan 9:** "Adaptive taxonomy to classify insights"
- **Spreadsheet:** 8 rich qualitative questions perfectly suited for CRED processing:
  - Pressing wellbeing needs
  - Shifts from past 12 months
  - Social/political/economic factors
  - Promising practices
  - How wellbeing is talked about
  - Indigenous/ancestral practices
  - Government engagement
  - Future vision + stories

### 4. Structured + Open Input
- **Jan 9:** "Preference for structured data with open input"
- **Spreadsheet:** Dropdowns for categorization, open text for nuance

---

## What's Bigger Than Expected

### 1. Organization Data Section (14 fields)
**Not discussed Jan 9, but now required:**
- Type of Registration (6 options)
- Legal Status (4 options)
- Entity Size (9 options)
- Entity Type (17 options)
- Headquarters Country (193 countries)
- Geographic Area of Work (193 countries)
- Area of Work (21 options)
- Focus of Work (37 options)
- Target Audience (34 options)
- Audience Specifics (30 options)
- Community Type & Beneficiaries (5 options)

**Ale's Question:** "Who fills in this info? I don't think this should be in the annual survey for all, just for admins"

**Implication:** This may be a SEPARATE admin-only form, not part of annual survey

### 2. Personal Data Section (3 fields)
**Not discussed Jan 9:**
- Email
- Organization (dropdown from existing?)
- Nationality - Country

**Implication:** User profile update as part of annual survey

### 3. Survey Length
**Jan 9:** Assumed relatively simple onboarding
**Reality:** 60+ fields across 5 sections

**Implication:** Need pagination, progress indicator, save draft

---

## New Technical Requirements Revealed

| Requirement | Jan 9 | Spreadsheet | Implementation Effort |
|-------------|-------|-------------|----------------------|
| Multi-select dropdowns | Not discussed | 15+ fields need it | Medium (new component) |
| "Add another" dynamic forms | Briefly mentioned | Critical path | High (complex UX) |
| Consent checkboxes | Not discussed | Required x2 | Low (simple) |
| File upload in survey | Not discussed | Photos + documents | Medium (already have) |
| Yes/No/Unsure radios | Not discussed | 3 fields | Low (simple) |
| Country → Region auto-link | Mentioned | Mapping provided | Medium (lookup table) |
| Save draft / resume | Not discussed | Implied by length | High (state management) |

---

## Revised Feature Pipeline

### BEFORE (Jan 9 Understanding)
1. Simple onboarding survey
2. "My Resources" view
3. Sample data
4. 5-person test

### AFTER (Spreadsheet Reality)
```
Phase 2A: Foundation (Week 1)
├── Import TWP taxonomy (400+ values)
├── Country → Region mapping table
├── Multi-select dropdown component
├── Yes/No/Unsure radio component
└── Consent checkbox pattern

Phase 2B: Form Infrastructure (Week 1-2)
├── "Add another" dynamic form pattern
├── Save draft / resume capability
├── Progress indicator
└── Paginated form sections

Phase 2C: Annual Survey Sections (Week 2-3)
├── Section 1: Organization Data (ADMIN-ONLY?)
├── Section 2: Personal Data (profile update)
├── Section 3: Practitioners (with add-another)
├── Section 4: Resources (with add-another)
└── Section 5: Collective Insights (8 questions)

Phase 2D: Gate Logic (Week 3)
├── Check annual survey completion
├── Block platform access if incomplete
├── "Your contributions" summary
└── Completion timestamp tracking

Phase 3: CRED Processing (Future)
├── LLM analysis of 8 insight questions
├── Adaptive taxonomy classification
├── Regional aggregation dashboard
└── Year-over-year comparison
```

---

## Critical Questions for Ale (Wednesday Check-in)

### Survey Structure
1. **Is Organization Data admin-only?**
   > You wrote "I don't think this should be in the annual survey for all, just for admins" - should we make this a separate admin-only form?

2. **How many practitioners/resources can they add?**
   > You asked "what if they want to add more than 1" - is there a limit? 3? 5? Unlimited?

3. **Which fields are required vs optional?**
   > Can users skip sections they don't want to contribute to? (e.g., no practitioner to recommend this year)

4. **Save progress?**
   > 60+ fields is a lot - can users save draft and return later? Or must complete in one session?

### Data & Privacy
5. **Store personal nationality?**
   > Is this sensitive data we should aggregate immediately, or keep individually?

6. **Resource visibility default?**
   > Should new resources default to "Public" or "Private"?

7. **What about "Global"?**
   > For orgs/resources with no specific geographic context, how do we handle Region/Country fields?

### Consent & Legal
8. **Practitioner consent wording?**
   > "This practitioner agreed to be recommended or contacted" - is this the final legal wording? Need legal review?

9. **Resource consent wording?**
   > "I confirm this resource is available for sharing and does not violate copyright or consent" - final wording?

### UX & Timing
10. **When is "annual"?**
    > Calendar year? Fiscal year? Rolling 12 months from last completion?

11. **Survey closing date?**
    > You mentioned wanting closing dates - when does this year's annual survey close?

12. **"Magic moment" content?**
    > What exactly shows when they complete? Last year's aggregate? Their contribution count?

### Taxonomy
13. **Can users suggest new taxonomy items?**
    > What if a specialty or modality isn't in the list? "Other" field? Request process?

14. **Spelling/grammar concerns?**
    > You asked "How do we ensure correct spelling?" many times - is this a blocker for Phase 2, or address later?

---

## Recommended Priorities

### Must Have for Phase 2 (5-person test)
1. ✅ TWP taxonomy imported
2. ✅ Multi-select component
3. ✅ Basic annual survey form (all 5 sections)
4. ✅ Consent checkboxes
5. ✅ Gate logic (block until complete)

### Should Have (nice for 5-person test)
1. "Add another" for practitioners (at least 1-3)
2. "Add another" for resources (at least 1-3)
3. Progress indicator
4. Basic validation

### Can Wait for Phase 3 (30-person pilot)
1. Save draft / resume
2. Spelling/grammar AI assist
3. CRED processing
4. Full analytics dashboard
5. Country → Region auto-population

---

## Summary: What Changed

| Aspect | Jan 9 Expectation | Post-Spreadsheet Reality |
|--------|-------------------|--------------------------|
| **Scope** | Simple onboarding | Comprehensive 60+ field survey |
| **Complexity** | Low-medium | Medium-high |
| **Timeline impact** | 1-2 weeks | 2-3 weeks |
| **New components needed** | 1-2 | 4-5 |
| **Questions to resolve** | ~5 | ~14 |

**Bottom Line:** The spreadsheet is great - Ale delivered exactly what was promised (taxonomies, survey structure). But it's more comprehensive than the Jan 9 conversation implied. Need to clarify scope for Phase 2 5-person test vs. Phase 3 30-person pilot.
