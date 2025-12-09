# Wellbeing Registry Questions - Revised for Springboard Model

## What Changed

### Before (Initial Analysis)
- Focused on HOW PRACTITIONERS experience their work internally
- Designed for ongoing community engagement and collaboration
- Included features like entry prompts, reflection rituals, collaborative annotation
- Assumed practitioners would be active users of the platform

### After (Aligned with Aaron's Vision)
- Focused on WHAT ORGANIZATIONS need to discern about practitioners
- Designed for one-time use ("springboard" - use once and leave)
- Removed all social/engagement features per Aaron's explicit boundaries
- Practitioners are listed resources, not active platform users

## Aaron's Actual Goals

**Primary Use Cases:**
1. Organizations finding vetted coaches/therapists quickly
2. Organizations accessing shared research from trusted network
3. Organizations deploying validated wellbeing surveys

**Key Quotes from Aaron:**
- "It's not a platform. It's a springboard. You come there so you can spring off and do something else better."
- "We want to avoid this being a platform, avoid this being an iPhone."
- "The community creating value for itself that the community can tap into whenever they need."
- "NOT a social network. NO direct messaging between organizations."

## What the Questions Now Extract

### HIGH Priority (Core Pilot)
1. **How practitioners practice presence** - helps orgs tell deep from surface engagement
2. **How they sustain practice beyond emotions** - avoids inspiration-dependent practitioners  
3. **Specific methods/techniques** - concrete, evaluable approaches
4. **Boundaries and limitations** - sets realistic expectations
5. **Surface vs deep engagement** - assesses depth of practice

### MEDIUM Priority (Valuable Context)
6. **Power/structural awareness** - shows systems thinking
7. **Service delivery vs co-creation model** - clarifies expectations
8. **What distinguishes their approach** - unique value proposition
9. **Cross-disciplinary frameworks** - reveals integrative approaches
10. **Transformation vs information focus** - change-oriented vs knowledge-delivery
11. **Empathy vs compassion distinctions** - sustainability of approach
12. **Collective vs individual orientation** - group/systems capacity

### LOW Priority (Nice to Have)
13. **Their own trust criteria** - meta-level practitioner discernment
14. **Field-wide challenges they identify** - contextual awareness
15. **Their own wellbeing practices** - modeling/sustainability signal

## Database Schema Implications

### Practitioner Profile Structure
```
practitioner
├── name
├── contact_info (external - no platform messaging)
├── how_i_practice (rich text, 2000 chars)
├── specific_methods (array of strings)
├── boundaries_statement (text, 500 chars)
├── power_awareness_statement (text, 500 chars, optional)
├── disciplines_and_frameworks (array of strings)
└── recommended_by (org IDs who vouched for them)
```

### What's NOT in the Schema
- No user account for practitioners
- No ratings/reviews
- No messaging system
- No activity feeds
- No "followers" or social graph
- No profile photos or personal details beyond professional practice

## How Organizations Use This

1. **Org logs in** (organizational credentials, not individual)
2. **Searches practitioners** by:
   - Methods/techniques
   - Practice approach keywords
   - Boundaries/availability
   - Power awareness (if relevant)
3. **Reads rich profiles** with "how they practice" descriptions
4. **Contacts externally** via email/website listed
5. **Logs out** - doesn't return until next need

## Alignment with Values Cards

The values cards revealed what organizations SHOULD BE ABLE TO DISCERN:

- **Rukudzo's card** → Can org tell if practitioner "stops fully to listen" vs "quick check-ins"?
- **Justin's card** → Can org tell if practitioner works beyond emotional ups/downs?
- **Barry's card** → Can org see specific techniques like "half-step back from empathy"?
- **Yazmany's card** → Can org tell if practitioner co-creates vs delivers services?
- **Deepa's card** → Can org see if practitioner attends to power/structural factors?

## What We Removed (Misaligned with Springboard)

### ❌ Removed: Engagement Features
- Entry prompts ("What are you feeling right now?")
- Reflection rituals before searching
- Required pauses/friction
- Profile completeness gamification

**Why:** Aaron doesn't want ongoing engagement. Use once and leave.

### ❌ Removed: Social Features  
- Collaborative annotation of resources
- Community-defined tagging
- Commenting/discussion
- Profile "likes" or endorsements
- Activity feeds

**Why:** Aaron explicitly said "NOT a social network"

### ❌ Removed: Platform-as-Process
- Tools for questioning professional norms
- Collective pattern discovery interfaces
- Category evolution systems
- "Challenges I'm working with" vulnerability sharing

**Why:** This is a resource directory, not a community transformation tool

## Next Steps

1. **Run extraction** on the 5 wellbeing practitioner interviews using these 15 questions
2. **Populate test database** with extracted profile information
3. **Show Aaron** what a "rich practitioner profile" looks like vs. traditional directory listing
4. **Get feedback** on whether this level of detail is useful or overwhelming
5. **Refine questions** based on what organizations actually need to discern

## Files Generated

- `wellbeing_registry_questions.csv` - For review/editing in spreadsheet
- `wellbeing_registry_questions.json` - For programmatic processing
- `revised_approach_summary.md` - This document

---

**Key Insight:** The values cards are still valuable - they reveal what organizations NEED TO KNOW about practitioners. But the platform itself stays simple: a searchable directory with rich profiles, not a social community.
