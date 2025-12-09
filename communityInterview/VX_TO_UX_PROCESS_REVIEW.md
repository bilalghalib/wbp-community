# VX → Affordances → UX Process Review

**Date**: January 24, 2025
**Project**: Springboard Registry (Wellbeing Project)
**Framework**: Joe Edelman's VX (Value eXperience) Design Process

---

## The VX Process (Ideal Flow)

```
VALUES (sources of meaning, attention policies)
    ↓
DATABASE (schema that honors values)
    ↓
AFFORDANCES (what actions become possible)
    ↓
UX (how it feels to take those actions)
    ↓
UI (what it looks like)
    ↓
CODE (technical implementation)
```

**Core Principle**: Start with what people find meaningful, then design technology that makes those experiences more available. NOT: "What can we build?" but "What do people care about?"

---

## Where We Are: Process Audit

### ✅ **STAGE 1: VALUES (Complete)**

**What We Did:**
1. **Individual Interviews** (5 transcripts analyzed)
   - Deepa: Liberation through collective power
   - Justin: Grounding commitment beyond emotion
   - Barry: Sustainable compassion without burnout
   - Rukudzo: Authentic presence across divides
   - Yazmany: Opening to be changed by others

2. **Community Chat** (979 WhatsApp messages analyzed)
   - pao: Holding space as infrastructure
   - Lyndon: Naming what's coming before it arrives
   - Mala: Praying with the water we are
   - Mays: Transforming moral injury into springboard
   - Deborah: Gratitude as practice not sentiment
   - Daniel: Measuring what matters while staying in heart

3. **Aaron's Constraints** (Springboard vision)
   - NOT a platform, IS a springboard
   - NOT social network, NO cross-org messaging
   - Security-first (state actors, burnout data risk)
   - 10-30 org pilot

**Output Documents:**
- `VALUES_CARDS_ANALYSIS.md` (individual interviews)
- `VALUES_AND_PRINCIPLES.md` (10 core principles with quotes)
- `WHEN_CHAT_VALUES_ANALYSIS.md` (community analysis)
- `SPRINGBOARD_REDESIGN_FROM_WHEN.md` (synthesis)

**Quality Assessment:**
- ✅ **Deep CAP extraction**: Specific attention policies identified (e.g., "MOMENTS when vulnerability becomes strength")
- ✅ **Direct quotes**: Values grounded in actual language used by community
- ✅ **Context understanding**: Political hostility, moral injury, indigenous protocols
- ⚠️  **Stakeholder validation**: Need to interview Lyndon, Mala, Mays to confirm CAPs

---

### 🟡 **STAGE 2: DATABASE (Partially Complete)**

**What We Did:**
Created schema for 7 core affordances:

1. **Political Environment Dashboard**
   ```sql
   CREATE TABLE policy_events (
     event_type TEXT, -- 'dei_ban', 'funding_threat'
     region TEXT,
     adversary_logic TEXT, -- Lyndon's style
     protective_measures TEXT[]
   );
   ```

2. **Moral Injury Assessment**
   ```sql
   CREATE TABLE moral_injury_responses (
     -- RLS policy: Individual responses NEVER accessible
     injury_severity_score FLOAT, -- Aggregate only
     renewal_capacity_score FLOAT
   );
   ```

3. **Gratitude Loop Infrastructure**
   ```sql
   CREATE TABLE gratitude_loops (
     from_organization_id UUID,
     to_entity_type TEXT, -- 'coach', 'researcher'
     opened_at TIMESTAMPTZ, -- When resource used
     closed_at TIMESTAMPTZ, -- When thanks sent
     emoji_used TEXT[] -- ['🙏', '💗']
   );
   ```

4. **Indigenous Protocol Honoring**
   ```sql
   CREATE TABLE research_documents (
     origin_culture TEXT[], -- ['Maori', 'Lakota']
     protocol_requirements TEXT,
     non_human_relations TEXT[] -- ['water', 'ancestors']
   );
   ```

5. **Youth Development Hub**
   ```sql
   CREATE TABLE youth_development_resources (
     resource_type TEXT, -- 'training', 'scholarship'
     collaboration_type TEXT -- 'student_research'
   );
   ```

6. **Coach/Therapist Registry** (enhanced)
   ```sql
   CREATE TABLE service_providers (
     specialties TEXT[], -- 'moral_injury'
     contexts_served TEXT[], -- 'political_pressure'
     openness_to_change BOOLEAN -- Changed by clients
   );
   ```

7. **Research Repository** (enhanced)
   ```sql
   CREATE TABLE research_implementation_reports (
     context_adapted_to TEXT,
     what_worked TEXT,
     protocol_honored_how TEXT
   );
   ```

**Quality Assessment:**
- ✅ **Values embedded**: Each table reflects specific CAPs (gratitude emojis, protocol acknowledgments)
- ✅ **Privacy-first**: RLS policies, aggregate-only access, org-not-individual
- ⚠️  **Missing relations**: How do tables connect? What's the data flow?
- ⚠️  **Missing auth model**: Org login + delegate mechanism not fully specified
- ⚠️  **Missing encryption**: Which fields encrypted? How does TWP admin access work?

---

### 🟡 **STAGE 3: AFFORDANCES (Partially Complete)**

**What We Did:**
Defined 7 core affordances in `SPRINGBOARD_REDESIGN_FROM_WHEN.md`:

#### **1. Political Environment Dashboard**

**Value Traced From**: Lyndon's "Naming What's Coming Before It Arrives"

**Affordance**: Organization can **surface threats relevant to their context** without drowning in all global news

**Specific Actions Enabled**:
- Filter policy events by region + org type
- Read adversary logic explanations (understand strategy, not just react)
- Access protective measures database (what worked for similar orgs)
- Set alerts for specific threat types

**What This Makes Possible** (that wasn't before):
- Asymmetric information warfare becomes symmetric (shared awareness)
- Preparation instead of panic
- Strategic response instead of reactive scrambling

**Missing**:
- How is content curated? (Who writes adversary logic? How often updated?)
- What triggers an alert? (All events? Only high-severity?)
- Can orgs contribute protective measures? (Crowdsourced or TWP-only?)

---

#### **2. Moral Injury Assessment**

**Value Traced From**: Mays' "Transforming Moral Injury Into Springboard"

**Affordance**: Organization can **name structural wounds** instead of just measuring burnout symptoms

**Specific Actions Enabled**:
- Take survey asking "Where has your org compromised ethical core?"
- Compare results to sector baseline (not just their own data)
- Filter coaches by "works with moral injury" (not just "treats burnout")
- Track injury → renewal cycles over time

**What This Makes Possible**:
- Legitimize structural harm (not just "you're stressed")
- Find appropriate help (moral injury needs different approach than burnout)
- Measure renewal (not just problem persistence)

**Missing**:
- What are actual survey questions? (Need to draft with Mays)
- How is "renewal" measured? (What counts as springboard moment?)
- Can orgs see anonymous quotes from others? (Build solidarity without exposing individuals)

---

#### **3. Gratitude Loop Infrastructure**

**Value Traced From**: Deborah's "Gratitude as Practice Not Sentiment"

**Affordance**: Organization can **close appreciation circles** without manual reminder systems

**Specific Actions Enabled**:
- System auto-generates Padlet after resource use (coach session, research download)
- Dashboard shows "unclosed loops" (not as shame, as gentle reminder)
- Org can add emoji + text thank you
- Coach/researcher receives notification (off-platform, via email)

**What This Makes Possible**:
- Gratitude becomes infrastructure, not extra work
- Energy circulates (coaches feel appreciated, stay in network)
- Transactional relationships become relational

**Missing**:
- When does loop "open"? (Download? Email exchange? Session booking?)
- Who sees closed loops? (Just participants? Whole network? Public?)
- What if org doesn't close loop? (Escalation? Access restriction? Just visibility?)

---

#### **4. Indigenous Protocol Honoring**

**Value Traced From**: Mala's "Praying With The Water We Are"

**Affordance**: Organization can **honor origin protocols** without manual research into proper acknowledgment

**Specific Actions Enabled**:
- Upload research WITH protocol tagging (system prompts: "Indigenous knowledge involved?")
- Download research ONLY AFTER acknowledging protocol
- Track: "12 downloads, 10 protocol acknowledgments" (shame the 2 who didn't)
- Share implementation report: "How we honored protocol in our context"

**What This Makes Possible**:
- Extraction becomes relationship (you can't take without acknowledging)
- Knowledge keepers visible (not erased in citation lists)
- Accountability at scale (system enforces what culture should)

**Missing**:
- Who validates protocol tagging? (Honor system? Knowledge keeper review?)
- What if org violates protocol? (Warning? Ban? Just public visibility?)
- Can knowledge keepers update protocols? (Living document vs static tag)

---

#### **5. Youth Development Hub**

**Value Traced From**: Lyndon's "Battle Over Young People's Formation"

**Affordance**: Organization can **access youth programs** when formal education eliminates them

**Specific Actions Enabled**:
- Search: "Ubuntu Leadership training in US" (post-SEL ban)
- Filter scholarships by Global South region
- Access student collaboration models (Kaddyjatou's podcast template)
- Add new resources discovered (crowdsourced curation with vetting)

**What This Makes Possible**:
- Alternative formation pathways (when universities cut programs)
- Global South access (scholarships visible, not hidden in email lists)
- Student agency (collaboration models center students, not just serve them)

**Missing**:
- Who vets resources? (Any org can add? TWP approves? Peer review?)
- How are outcomes tracked? (Did Ubuntu training actually work?)
- What about minors' privacy? (If resources involve <18, what protections?)

---

#### **6. Coach/Therapist Registry (Enhanced)**

**Value Traced From**: Multiple CAPs (Rukudzo's context, Justin's inner work, Barry's sustainable compassion)

**Affordance**: Organization can **find contextually-appropriate help** instead of just "any therapist"

**Specific Actions Enabled**:
- Filter by context: "Moral injury + political pressure + Global South"
- See recommendations WITH context: "Helped us name wound after Harvard settlement"
- Contact coach off-platform (email visible to org, not all users)
- Share recommendation back (close loop, feed next org's search)

**What This Makes Possible**:
- Match quality (context matters more than credentials alone)
- Trust signals (org vouches based on actual experience)
- Contextual wisdom preserved (not just star ratings)

**Missing**:
- How do coaches join? (Invitation-only? Self-register then vet?)
- What if coach gets bad recommendation? (Dispute process? Just more data?)
- How is "openness to change" assessed? (Self-reported? Org feedback?)

---

#### **7. Research Repository (Enhanced)**

**Value Traced From**: Yazmany's "Being Changed By Others" + Mala's protocols

**Affordance**: Organization can **learn from implementations** instead of just reading abstracts

**Specific Actions Enabled**:
- RAG search: "Trauma-informed pedagogy for political crisis"
- Results include: PDF + protocol + implementation reports
- Read: "We tried this in Bangladesh shutdown, here's what worked"
- Add own implementation report (feeds collective learning)

**What This Makes Possible**:
- Research becomes living (not static PDFs)
- Context-specific wisdom (not just universal claims)
- Failure visible (what didn't work is as valuable as what did)

**Missing**:
- How long do PDFs stay? (Storage limits? Archival after X years?)
- Can orgs edit implementation reports? (Or frozen once submitted?)
- What if research contradicts protocol? (Western science vs Indigenous knowledge—who wins?)

---

### 🔴 **STAGE 4: UX (Mostly Missing)**

**What We Have:**
- High-level flows described in affordances
- pao-style care layer mentioned ("no worries" tone, emoji, warmth)
- Springboard metaphor guiding navigation (jump → land → return)

**What We're Missing:**

#### **Critical UX Questions:**

1. **Onboarding Flow**
   - How does org first login?
   - What do they see on day 1? (Empty dashboard? Pre-loaded example data?)
   - How do they add their first coach recommendation? (Form? Import? Interview?)
   - When do they encounter political dashboard? (Immediate alert? Opt-in?)

2. **Navigation Mental Model**
   - Is there a persistent nav bar? (Home / Coaches / Research / Gratitude / Alerts)
   - Or is it task-based? ("I need help" → guided flow)
   - How do they return after jumping? (Same entry point? Different landing?)

3. **Information Density**
   - Political dashboard: How many alerts shown at once? (1? 5? 20?)
   - Coach registry: List view? Card view? Table?
   - Research repo: How are protocols displayed? (Inline? Modal? Separate page?)

4. **Interaction Patterns**
   - Gratitude: Click "Thank" button → inline text box? → Separate Padlet?
   - Protocol acknowledgment: Checkbox? Modal with full text? Signature?
   - Implementation report: Inline form? Separate page? Guided wizard?

5. **Emotional Tone**
   - How does warmth translate to UI? (Color palette? Illustration? Copy?)
   - How does security/privacy FEEL? (Reassuring? Clinical? Invisible?)
   - How does "springboard" manifest visually? (Metaphor in design? Literal imagery?)

6. **Feedback Loops**
   - When org closes gratitude loop, what happens? (Confirmation? Email to coach?)
   - When org violates protocol, what happens? (Warning banner? Email? Account flag?)
   - When org is mentioned in alert, what happens? (Notification? Email? Just dashboard update?)

7. **Error States**
   - What if no coaches match context? ("None found" vs "Broaden search"?)
   - What if RAG search returns nothing? ("Try different terms" vs "Add research yourself"?)
   - What if protocol acknowledgment times out? (Can't download? Grace period?)

8. **Mobile Experience**
   - Is this mobile-friendly? (Responsive? Native app? Desktop-only for pilot?)
   - Which affordances work on mobile? (Alerts yes, survey maybe, RAG probably not?)
   - How does gratitude work on phone? (Emoji picker? Voice-to-text thank you?)

9. **Accessibility**
   - Screen reader support for political alerts? (How is severity conveyed?)
   - Colorblind-friendly emoji? (Text alternatives?)
   - Keyboard navigation for all flows?

10. **Time/Rhythm**
    - How often should org return? (Daily alerts? Weekly newsletter? Monthly survey?)
    - How long should flows take? (2-min gratitude? 15-min coach search? 45-min survey?)
    - When do prompts arrive? (Immediate? Batched? User-configured?)

---

### 🔴 **STAGE 5: UI (Not Started)**

**What We Need:**

1. **Wireframes** (even sketches)
   - Dashboard layout
   - Coach profile page
   - Research search results
   - Gratitude Padlet interface
   - Protocol acknowledgment modal

2. **Visual System**
   - Color palette (warmth, security, trust)
   - Typography (accessible, warm, professional)
   - Iconography (springboard metaphor? Abstract? Literal?)
   - Emoji library (beyond standard Unicode—custom for CAPs?)

3. **Component Library**
   - Buttons (primary, secondary, danger)
   - Forms (with pao-style help text: "no worries if you skip this")
   - Cards (coach profiles, research items, alerts)
   - Modals (protocol acknowledgment, gratitude prompts)

4. **Responsive Breakpoints**
   - Desktop (primary for pilot?)
   - Tablet (maybe)
   - Mobile (alerts + gratitude only? Or full experience?)

---

### 🔴 **STAGE 6: CODE (Not Started)**

**What We Need:**

1. **Tech Stack Decision**
   - Frontend: Next.js 14 + App Router (confirmed in CLAUDE.md)
   - Database: Supabase (PostgreSQL + Auth + Storage)
   - Styling: Tailwind CSS
   - AI/RAG: OpenAI embeddings + vector search? Or Supabase pgvector?

2. **Auth Implementation**
   - Org-based login (not individual)
   - Delegate mechanism (continuity when people leave)
   - TWP admin view (encrypted access to backend)

3. **Encryption Strategy**
   - Which fields encrypted? (moral injury responses, org vulnerabilities)
   - Who can decrypt? (TWP admins? Never? Only aggregate functions?)
   - Key management (where stored? rotated how often?)

4. **Deployment**
   - Hosting: Vercel (Next.js optimized)
   - Database: Supabase cloud (or self-hosted for security?)
   - Monitoring: Error tracking, performance, security alerts

---

## Process Quality Assessment

### ✅ **What's Working:**

1. **Values → Affordances Traceability**
   - Every affordance traces to specific CAP
   - Example: Gratitude loops ← Deborah's "closing appreciation circles"
   - Not arbitrary features, grounded in community needs

2. **Constraint Integration**
   - Aaron's "not a social network" honored throughout
   - Security requirements (RLS, encryption) designed into database
   - Pilot scope (10-30 orgs) shapes feature prioritization

3. **Stakeholder Diversity**
   - Individual interviews (transformation focus)
   - Community chat (coordination focus)
   - Founder vision (business constraints)
   - All three synthesized, tensions named

4. **Documentation Depth**
   - Values cards with direct quotes
   - Database schema with comments explaining CAP connection
   - Affordances with "what this makes possible" clarity

### ⚠️  **What's Weak:**

1. **Stakeholder Validation Gap**
   - Haven't interviewed Lyndon, Mala, Mays to confirm CAPs
   - Aaron hasn't approved political dashboard as core
   - Ale's usability concerns ("old interface" trauma) not addressed yet

2. **UX Layer Missing**
   - Jumped from affordances → database
   - No wireframes, no interaction specs, no error states
   - Risk: Build features no one can actually use

3. **Content Curation Unspecified**
   - Who writes political alerts? (Staff? AI? Volunteers?)
   - Who vets coaches? (TWP? Peer review? Algorithmic?)
   - Who tags indigenous protocols? (Uploaders? Knowledge keepers?)

4. **Success Metrics Undefined**
   - "Springboard health dashboard" proposed but not implemented
   - What's minimum viable success for pilot? (X% gratitude closure? Y political alerts → protective action?)
   - How do we know if moral injury frame works better than burnout?

---

## Open-Ended Questions (Prioritized)

### 🔥 **CRITICAL** (Block Development)

1. **Budget & Timeline Clarity**
   - Is budget $25K (Phase 1A only) or $50K (full Phase 1)?
   - When does Aaron need pilot launched? (Q1 2025? Q2?)
   - Who's responsible for content curation? (In budget? Volunteer?)

2. **Security Architecture Approval**
   - Does Aaron accept: Security must be in pilot, not "phase 2"?
   - What's the threat model? (State actors? Hackers? Curious researchers?)
   - Who at TWP can access encrypted data? (Aaron? Ale? IT staff?)

3. **Survey Tool Scope**
   - Does Aaron accept: TWP-managed deployment vs org-deployed?
   - What's relationship to Richie's State of Wellbeing baseline?
   - Can we pilot with existing burnout survey, add moral injury Q2?

4. **Political Dashboard Buy-In**
   - Does Aaron see this as core or "nice to have"?
   - If core, who curates content? (Lyndon? TWP staff? Volunteer network?)
   - If not core, can we pilot with 1-2 manual alerts to test value?

### 🟡 **HIGH** (Shape UX)

5. **Onboarding Flow Design**
   - What does org see on day 1? (Empty? Pre-populated examples?)
   - How do they add first coach? (Form? Wizard? Video tutorial?)
   - When do they encounter alerts? (Immediate? After profile complete?)

6. **Gratitude Loop Mechanics**
   - When does loop "open"? (Download? Email? Session booking?)
   - What triggers closure prompt? (2 weeks auto? Manual?)
   - Can coaches opt out of gratitude notifications? (Email fatigue)

7. **Protocol Acknowledgment UX**
   - Checkbox? Full modal with text? Digital signature?
   - Can you download first, acknowledge later? (Or blocked until ack?)
   - What happens if you violate protocol? (Warning? Ban? Public note?)

8. **Coach Contact Method**
   - Email visible to all orgs? (Privacy risk for coaches)
   - Contact form that forwards? (More clicks, less spam)
   - "Request intro" button? (TWP facilitates, off-platform)

### 🟢 **MEDIUM** (Refine Features)

9. **Youth Hub Vetting Process**
   - Who approves resources? (TWP? Peer review? Algorithmic?)
   - What if resource gets bad feedback? (Remove? Flag? Just data?)
   - Can students submit resources? (Or org-only?)

10. **Research Implementation Reports**
    - How long? (Tweet-length? Paragraph? Full case study?)
    - Required fields? (Context, what worked, protocol honored)
    - Can orgs edit after submission? (Or frozen?)

11. **Political Alert Frequency**
    - Daily? Weekly? Only high-severity?
    - User-configurable? (Opt-in for daily, default weekly)
    - Push notifications? (Email? SMS? In-app only?)

12. **Moral Injury Survey Questions**
    - Need to draft with Mays (her expertise)
    - How many questions? (8 like burnout? 15? 30?)
    - Likert scale? Open-ended? Mix?

### 🔵 **LOW** (Polish)

13. **Emoji Library Customization**
    - Beyond Unicode? (Custom CAP-specific emoji?)
    - Cultural appropriateness? (Some emoji mean different things)
    - Emoji analytics? (Which ones used most? Inform culture?)

14. **Mobile Experience Scope**
    - Pilot desktop-only? (Easier, faster)
    - Or responsive from day 1? (Better UX, more dev time)
    - Which features work mobile? (Alerts yes, RAG search harder)

15. **Accessibility Baseline**
    - WCAG AA compliance? (Standard)
    - Or AAA for pilot? (Ambitious, shows values)
    - Screen reader testing budget? (User testing with blind users)

16. **Visual Metaphor Strategy**
    - Literal springboard imagery? (Diving board icon, jump animations)
    - Abstract? (Colors, shapes that evoke launching)
    - Avoid entirely? (Just clean UI, let language carry metaphor)

---

## Recommended Next Steps (Process)

### **Week 1: Validate Values**

1. **Interview Lyndon** (45 min)
   - Confirm CAPs: "Naming what's coming"
   - Test political dashboard concept
   - Ask: What alerts would have helped you last year?

2. **Interview Mala** (45 min)
   - Confirm CAPs: "Praying with water"
   - Test protocol acknowledgment UX
   - Ask: What makes protocol honoring real vs performative?

3. **Interview Mays** (45 min)
   - Confirm CAPs: "Moral injury → springboard"
   - Draft moral injury survey questions together
   - Ask: How do you measure renewal (not just wound)?

4. **Present to Aaron** (60 min)
   - Show `SPRINGBOARD_REDESIGN_FROM_WHEN.md`
   - Get buy-in: Political dashboard core? Security in pilot?
   - Clarify: Budget ($25K or $50K)? Timeline? Content curation?

### **Week 2: Design UX Flows**

5. **Onboarding Wireframes**
   - Day 1 experience (empty vs pre-populated)
   - First coach recommendation flow
   - Political alert first exposure

6. **Core Interaction Specs**
   - Gratitude loop mechanics (open → prompt → close)
   - Protocol acknowledgment (checkbox → modal → signature?)
   - Coach search (filters → results → contact)

7. **Error State Inventory**
   - No coaches match context
   - RAG search returns nothing
   - Protocol violation detected
   - (etc.)

8. **Mobile vs Desktop Triage**
   - Which affordances mobile-friendly?
   - Which desktop-only for pilot?
   - Responsive strategy (or defer to Phase 2?)

### **Week 3: Build Phase 1A (If Aaron Approves)**

9. **Database Schema Implementation**
   - Supabase tables + RLS policies
   - Test encryption (can TWP admin access? Can orgs access each other?)
   - Seed data (example coaches, alerts, research)

10. **Auth System**
    - Org-based login
    - Delegate mechanism
    - TWP admin view

11. **Core Affordances (Minimal)**
    - Political dashboard (manual curation)
    - Coach registry (basic search)
    - Gratitude system (manual Padlet creation)
    - Research repo (PDF upload + protocol tag)

12. **Test with 3-5 Orgs**
    - Invite WHEN members? (Mala's org, Daniel's, Mays'?)
    - Watch them use it (screen share sessions)
    - Iterate based on confusion points

---

## Process Gaps Summary

### **What We Did Well:**
- ✅ Deep values extraction (CAPs with direct quotes)
- ✅ Affordances traced to values (every feature justified)
- ✅ Database schema honors privacy (RLS, encryption)
- ✅ Tensions named (Aaron's vision vs WHEN reality)

### **What We Skipped:**
- ⚠️  Stakeholder validation (interviews pending)
- ⚠️  UX layer (wireframes, flows, error states)
- ⚠️  Content curation plan (who writes alerts?)
- ⚠️  Success metrics (how do we know if it works?)

### **What We Need to Decide:**
- 🔥 Budget & timeline clarity (from Aaron)
- 🔥 Security architecture approval (from Aaron)
- 🔥 Survey tool scope (TWP-managed vs org-deployed)
- 🔥 Political dashboard buy-in (core vs optional)

---

## Meta-Reflection: Is This Process Working?

### **Strengths:**

1. **Values-First Actually Happened**
   - We didn't start with "let's build a coach directory"
   - We started with: "What do people care about?" (Lyndon's political analysis, Mala's protocols, etc.)
   - Features emerged FROM values, not imposed ON them

2. **Constraints Integrated Early**
   - Aaron's "not a social network" shaped affordances (no cross-org messaging)
   - Security requirements shaped database (RLS, encryption)
   - Not "build then retrofit" — designed in from start

3. **Tensions Named, Not Resolved Prematurely**
   - Aaron wants "simple pilot" vs WHEN needs "hostile context support"
   - Both valid, both documented, decision punted to stakeholder conversation
   - Better than choosing in vacuum

### **Weaknesses:**

1. **UX Gap is Risky**
   - We have values ✅
   - We have database ✅
   - We have affordances ✅
   - We DON'T have wireframes ❌
   - Risk: Build perfect backend no one can use

2. **Validation Delayed Too Long**
   - Should have interviewed Lyndon/Mala/Mays BEFORE designing affordances
   - Now we have 7 features designed, need to validate, might need to redesign
   - Better: Validate CAPs → Design affordances → Re-validate

3. **Content Curation Punted**
   - "Who writes political alerts?" is not a "phase 2" question
   - It's a "can this affordance exist?" question
   - If answer is "no one / no budget", then dashboard is vaporware

### **Process Improvements for Next Project:**

1. **Stakeholder Interview Loop**
   - VALUES extraction → Draft CAPs → Validate with stakeholders → Finalize CAPs
   - NOT: Extract values → Design everything → Hope it's right

2. **UX Before Database**
   - VALUES → Sketch UX flows → THEN design database to support flows
   - NOT: VALUES → Database → Oops, now how do we make this usable?

3. **Content Feasibility Check**
   - For each affordance: "Who creates this content? Is that realistic?"
   - NOT: Design feature → Assume content will magically appear

4. **Pilot Success Metrics First**
   - Before building: "How will we know if this worked?"
   - NOT: Build → Launch → Guess if it's working

---

## Conclusion: Where We Stand

**We're at 60% through VX process:**

```
VALUES ████████████████████ 100% ✅
    ↓
DATABASE ███████████████░░░░░ 75% 🟡 (schema done, relations/encryption gaps)
    ↓
AFFORDANCES ██████████████░░░░░░ 70% 🟡 (defined but not validated)
    ↓
UX ████░░░░░░░░░░░░░░░░ 20% 🔴 (concepts only, no wireframes)
    ↓
UI ░░░░░░░░░░░░░░░░░░░░ 0% 🔴 (not started)
    ↓
CODE ░░░░░░░░░░░░░░░░░░░░ 0% 🔴 (not started)
```

**Good news:**
- Values work is deep and documented
- Affordances trace clearly to values
- Database schema honors privacy from start

**Bad news:**
- Can't build until UX designed
- Can't design UX until Aaron approves vision
- Can't approve vision until Lyndon/Mala/Mays validate CAPs

**Next critical path:**
1. Interview 3 stakeholders (validate CAPs)
2. Present to Aaron (get buy-in + budget)
3. Design UX flows (wireframes, error states)
4. THEN start Phase 1A build

**Estimated timeline to build-ready:**
- 1 week: Stakeholder interviews
- 1 week: Aaron presentation + iteration
- 1 week: UX design
- **= 3 weeks before code starts**

That's actually good. Better to get design right than rush into wrong build.
