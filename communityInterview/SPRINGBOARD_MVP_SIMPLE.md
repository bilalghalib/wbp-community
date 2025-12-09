# Springboard Registry - MVP Pilot

**For**: Aaron Tanaka, Wellbeing Project
**From**: Bilal
**Date**: January 2025

---

## What Is It?

A **simple, secure registry** where 10-30 organizations can:
1. Find trusted coaches/therapists
2. Share and search research
3. Deploy a validated wellbeing survey

**Not** a social network. **Not** a platform you hang out on.

Think of it like a **springboard** - you come when you need something, get what you need, then go do your work.

---

## Three Core Features

### 1. Coach/Therapist Registry

**What organizations do:**
- Recommend coaches/therapists they've worked with
- Add context: "Helped us navigate funding cuts + political pressure"
- Tag specialties: burnout, moral injury, collective care, etc.

**What users get:**
- Search by context (not just credentials)
- See which orgs recommended them
- Contact coaches directly (off-platform, no payment processing)

**Example:**
```
Dr. Sarah Chen
Recommended by: 3 organizations
Specialties: Burnout, political pressure, Asian-American context
Contact: sarah.chen@example.com

"Helped us name the structural harm, not just symptoms."
— Youth Justice Collective
```

---

### 2. Research Repository

**What organizations do:**
- Upload research PDFs (reports, studies, toolkits)
- Tag topics: burnout, collective care, funding strategies, etc.

**What users get:**
- Search all research (full-text with AI citations)
- Download freely
- See what other orgs are reading/using

**Example search:**
```
User: "How do orgs handle burnout during funding cuts?"

AI: "Here are 3 relevant documents:
1. 'Collective Care During Crisis' (pg 12-14) discusses..."
2. 'Sustainable Organizing' (pg 7) mentions..."
[Direct links to PDF pages]
```

---

### 3. Survey Tool

**What we deploy:**
- Validated wellbeing survey (work with Richie Davidson's team)
- Organizations get link to send to their members

**What organizations get:**
- Their own results
- Comparison to sector baseline
- **Privacy-first**: Individual responses never visible, only aggregates

**Example results:**
```
Your organization:
- Exhaustion: 3.2 / 5.0
- Cynicism: 2.8 / 5.0
- Efficacy: 3.9 / 5.0

Sector baseline:
- Exhaustion: 3.5 / 5.0
- Cynicism: 3.1 / 5.0
- Efficacy: 3.6 / 5.0

[Pre-filtered coach recommendations based on your results]
```

---

## What We're NOT Building

❌ Social network (no cross-org chat/messaging)
❌ Platform you hang out on (clear entry/exit)
❌ Payment processing (contact coaches off-platform)
❌ Calendar/events system
❌ Complex features beyond these 3 use cases

---

## Security & Privacy

**Key concerns** (from your conversation):
- Government actors wanting to know who's organizing
- Burnout data being weaponized
- Protecting individual/organizational identities

**How we handle it:**

1. **Organization login** (not individual)
   - Log in as "Youth Justice Collective," not "Sarah Chen"
   - Back-end knows who admins are, front-end doesn't show

2. **Survey responses encrypted**
   - Individual answers NEVER accessible
   - Only aggregate stats available
   - Database-level blocks (not just UI)

3. **Delegation system**
   - Primary admin + backup admin
   - If someone leaves org, access doesn't leave with them

4. **Research stays private to network**
   - Only member orgs can access
   - No public sharing unless org opts in

---

## Pilot Plan

### Phase 1: Build MVP (6-8 weeks)
- Coach registry (add, search, contact)
- Research upload + search (with RAG)
- Survey deployment + results view
- Organization login + admin controls

### Phase 2: Test with 10 orgs (4 weeks)
- Onboard 10 orgs you trust
- They add coaches, upload research, deploy survey
- Gather feedback: What's useful? What's missing?

### Phase 3: Refine + Scale to 30 (4 weeks)
- Fix usability issues
- Add most-requested features
- Scale to 30 organizations

**Total timeline**: ~4 months to validated pilot with 30 orgs

---

## Technology Stack

**Framework**: Next.js (modern, fast, secure)
**Database**: PostgreSQL with row-level security
**Storage**: Encrypted file storage for PDFs
**AI Search**: RAG (Retrieval-Augmented Generation) with citations
**Styling**: Tailwind (modern, mobile-friendly)

**Why this stack?**
- Modern UX (not "old interface" from previous dev team)
- Security built-in (encryption, access controls)
- Scales easily (10 → 30 → 100 orgs)
- Fast development (reusable components)

---

## Budget Estimate

**Scope**: 3 features, 10-30 org pilot, 4 months

**Estimated effort**:
- MVP build: 200-250 hours
- Testing + iteration: 50-75 hours
- Deployment + support: 25-50 hours

**Total**: 275-375 hours

**At non-profit rates** ($75-100/hr):
- Low estimate: $20,625
- High estimate: $37,500

**Phased payment:**
- Phase 1 (MVP): $15K-25K
- Phase 2 (10 org test): $5K-8K
- Phase 3 (Scale to 30): $3K-5K

---

## Open Questions

### Critical (Need answers before starting):

1. **Budget**: What's the actual budget? $25K? $50K? Helps scope features.

2. **Survey tool**:
   - Do we use Richie's exact survey, or do you have one already?
   - Who manages survey deployments - orgs themselves or TWP admins?

3. **Timeline**:
   - When do you want to launch with 10 orgs?
   - Any deadlines (Hearth Summit, etc.)?

4. **Security level**:
   - How paranoid should we be? (FBI-level encryption vs basic security)
   - Who are the threat actors you're most worried about?

### Medium Priority (Can decide during build):

5. **Coach profiles**:
   - Can coaches log in to edit their own profiles?
   - Or only orgs can add/edit recommendations?

6. **Research visibility**:
   - Everything private to network by default?
   - Can orgs mark research as "public" if they want?

7. **Survey frequency**:
   - One-time baseline or repeated assessments?
   - Do orgs deploy whenever they want, or is it coordinated?

---

## What We Learned from WHEN Chat

I analyzed the WHEN WhatsApp group (979 messages) and found:

**What people actually talk about:**
- Political threats (DEI bans, funding cuts)
- Finding resources fast (coaches, research, allies)
- Coordination under pressure ("Can someone help X org?")
- Gratitude and closing loops ("Thank you for the connection")

**What this means for design:**
- Search needs to be FAST (5 min to find a coach, not 5 days)
- Context matters more than credentials (moral injury > "licensed therapist")
- Trust signals matter ("Recommended by 3 orgs you know")
- Privacy is non-negotiable (burnout data is ammunition)

**Who to validate with** (if you want feedback before building):
- Lyndon Rego (political analysis, youth work)
- Daniel Plá (Brazil perspective, surveys)
- Mala Kapadia (protocols, Ecological Belonging)
- Deborah D-K (Contemplative Pedagogy)
- Dr. Mays (moral injury framing)

---

## Next Steps

### Option 1: Start Building Now
- You approve this scope
- I start with coach registry (simplest feature)
- We iterate as we learn

### Option 2: Validate Design First
- Interview 5 WHEN members (2 weeks)
- Adjust design based on feedback
- Then start building

### Option 3: Prototype First
- Build clickable prototype (no backend)
- Test with 3-5 orgs
- Validate before full build

**My recommendation**: Option 2 (validate first)

Why? You have direct access to your users. 5 interviews = avoid building the wrong thing.

---

## How This Stays Simple

**If we stick to these 3 features, this is:**
- ~300 hours of work
- 3-4 months total
- $25K-35K budget
- Clean, modern, secure

**If we add more** (political alerts, gratitude loops, protocol blocking):
- ~800+ hours
- 8-12 months
- $60K-80K budget
- Feature creep risk

Let's keep it simple. Test value quickly. Iterate from there.

---

## Ready When You Are

I can start whenever you give the green light.

**What I need from you:**
1. Budget confirmation ($25K-50K range?)
2. Timeline (launch by when?)
3. Survey tool clarification (Richie's? TWP's?)
4. Security level (how paranoid?)

Once I have those, I can start building.

**First milestone** (2 weeks): Coach registry working, you can test it.

Let me know what you think.

— Bilal
