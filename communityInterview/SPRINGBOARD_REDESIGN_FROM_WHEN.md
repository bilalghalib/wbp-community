# Springboard Registry Redesign: From WHEN Chat Insights

**Created**: January 24, 2025
**Based On**:
- Aaron's Springboard vision (pilot transcript)
- WHEN WhatsApp community analysis (979 messages)
- Original VALUES_AND_PRINCIPLES.md

---

## The Core Tension

### Aaron's Vision (From Transcript):
**"It's not a platform. It's a springboard. You come there so you can spring off and do something else better."**

**Key Constraints:**
- NOT a social network
- NO direct cross-org messaging
- NO payment processing
- Login as organization, not individual
- Privacy-first (state actors, burnout data risk)
- 10-30 org pilot
- Three use cases: (1) research sharing, (2) validated survey tool, (3) coach/therapist registry

### WHEN Community Reality (From Chat):
**"Collective coordination as care while navigating hostile political terrain"**

**What They Actually Need:**
- Political context awareness (DEI bans, funding threats, university capitulations)
- Gratitude loops (Padlets for thanking, "deep bow" culture)
- Indigenous/ecological frame (Ho'Oponopono prayers, rights of nature)
- Moral injury naming (not just burnout metrics)
- Youth development resources (Ubuntu, student collaborations)
- Coordination that feels like care (pao's emoji warmth in logistics)

---

## How WHEN Insights Reshape Aaron's "Springboard"

### Metaphor Evolution: From Diving Board to **Launching Pad in Hostile Territory**

Aaron's diving board metaphor assumes:
- Calm water below
- Individual jumpers
- One-time use
- Return when ready

WHEN community shows:
- **Hostile water** (government actors attacking higher ed)
- **Collective launch** (organizations need to know who else is jumping and when)
- **Continuous refueling** (not one-time—people need to return for context updates, gratitude loops)
- **Mid-air coordination** (organizations need to signal distress, celebrate wins, WITHOUT becoming chat platform)

**New Metaphor**: **"Network Operations Center for Organizations Under Siege"**
- You come for situational awareness
- You spring into action with vetted resources
- You return to report success, close gratitude loops
- You DON'T hang out and chat (that's WhatsApp's job)

---

## Redesigned Feature Set: 7 Core Affordances

### 1. **Political Environment Dashboard** (NEW - From Lyndon's Analysis)

**Why Aaron Should Care:**
- Organizations face **asymmetric information warfare** (Harvard settlement, Columbia capitulation, DEI bans spreading)
- Without shared situational awareness, each org thinks they're alone
- This IS security risk mitigation—orgs make better decisions when they know what's coming

**What It Looks Like:**
- **Policy Tracker**: DEI bans, funding threats, curriculum mandates by region
- **Adversary Logic Explainer**: "Here's what they believe and why" (Lyndon's style)
- **Protective Measures Database**: "X university successfully defended by doing Y"
- **Alert System**: "This just passed in Z, may affect your org if..."

**Springboard Alignment:**
- NOT a forum for discussion
- NOT real-time chat about politics
- IS information you grab and spring into action with your team
- Return monthly for updates, not daily scrolling

**Database Schema:**
```sql
CREATE TABLE policy_events (
  id UUID PRIMARY KEY,
  event_type TEXT, -- 'dei_ban', 'funding_threat', 'curriculum_mandate'
  region TEXT,
  date DATE,
  source_url TEXT,
  adversary_logic TEXT, -- Lyndon-style explanation
  protective_measures TEXT[], -- What worked for others
  affected_org_types TEXT[] -- 'public_university', 'private_nonprofit', etc.
);

CREATE TABLE org_vulnerability_assessments (
  organization_id UUID REFERENCES organizations(id),
  vulnerability_type TEXT,
  risk_level TEXT, -- 'low', 'medium', 'high'
  last_updated TIMESTAMPTZ,
  -- Encrypted, only visible to org admins
);
```

---

### 2. **Moral Injury Assessment** (NEW - From Mays' Framing)

**Why Aaron Should Care:**
- His survey tool assumption: "validated survey for burnout baseline"
- WHEN reality: **Burnout tools miss the wound** (moral injury = structural harm to ethical core)
- Mays' article went viral in community—this is THE frame they need

**What It Looks Like:**
- **Survey Section**: "Where has your org compromised its ethical core?"
- **Anonymous Aggregate**: "Sector-wide patterns of moral injury by region/org type"
- **Coach Matching**: "Who helps groups name collective wounds?" (not just "who treats burnout")
- **Springboard Language**: Survey results include "injury → renewal" framing

**Springboard Alignment:**
- Organization takes survey (NOT individuals—Aaron's requirement)
- Results compared to sector baseline (Aaron's goal)
- Springs into action: "We need a coach who does moral injury work, here are 3 vetted by similar orgs"
- Return yearly to reassess, see if renewal happened

**Database Schema:**
```sql
CREATE TABLE moral_injury_responses (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  survey_deployment_id UUID,

  -- Questions (Aaron's "no individual data" requirement)
  ethical_compromises TEXT[], -- Encrypted, aggregate-only
  structural_constraints TEXT[],
  renewal_attempts TEXT[],

  -- Aggregate metrics visible across sector
  injury_severity_score FLOAT,
  renewal_capacity_score FLOAT,

  created_at TIMESTAMPTZ
);

-- RLS policy: Individual responses NEVER accessible
CREATE POLICY "No direct access to responses"
ON moral_injury_responses FOR SELECT
USING (FALSE);

-- Access ONLY via aggregate function
CREATE FUNCTION get_sector_moral_injury_baseline(
  region TEXT,
  org_type TEXT
) RETURNS JSON SECURITY DEFINER;
```

---

### 3. **Gratitude Loop Infrastructure** (NEW - From Deborah's Practice)

**Why Aaron Should Care:**
- His concern: "This could become a social network with chat"
- WHEN reality: **Gratitude PREVENTS burnout** better than surveys measure it
- Transactional platforms fail; gratitude circulates energy

**What It Looks Like:**
- **Post-Event Padlets**: Auto-generated after coaching session, workshop, resource use
- **Closure Prompts**: "You received help 2 weeks ago from Coach X, close the loop?"
- **Dashboard**: "Unclosed gratitude" (not shame—just visibility)
- **Emoji Library**: 🙏💗🧡🫶🏼 (goes beyond corporate 👍)
- **NO CHAT**: This is async, org-to-provider or org-to-research-author, not org-to-org

**Springboard Alignment:**
- You spring into action (use coach, read research)
- You return to close loop (thank coach, rate research)
- System nudges you if loop open >2 weeks
- NOT hanging out, just closing circles

**Database Schema:**
```sql
CREATE TABLE gratitude_loops (
  id UUID PRIMARY KEY,
  from_organization_id UUID REFERENCES organizations(id),
  to_entity_type TEXT, -- 'coach', 'researcher', 'other_org'
  to_entity_id UUID,

  -- Loop state
  opened_at TIMESTAMPTZ, -- When org used resource
  closed_at TIMESTAMPTZ, -- When org sent thanks
  closure_method TEXT, -- 'padlet', 'email', 'phone'

  -- Optional
  gratitude_text TEXT,
  emoji_used TEXT[], -- ['🙏', '💗']

  -- Privacy: Only visible to participants + TWP admins
  visibility TEXT DEFAULT 'private'
);

-- Prompt orgs with open loops >2 weeks
CREATE FUNCTION get_unclosed_gratitude_loops(org_id UUID)
RETURNS TABLE (...);
```

---

### 4. **Indigenous Protocol Honoring** (NEW - From Mala's Work)

**Why Aaron Should Care:**
- His assumption: "Research repository = PDF storage"
- WHEN reality: **Healing includes more-than-human** (water prayers, ancestor protocols, future generations)
- If TWP serves global changemakers, Western-only epistemology fails

**What It Looks Like:**
- **Origin Protocol Tagging**: "This research involves Maori knowledge—contact [X] before adapting"
- **Prayer/Intention Spaces**: Ho'Oponopono templates, not just "resources"
- **Non-Human Intelligence Metadata**: "This research honors water consciousness, tree wisdom"
- **Rights of Nature Integration**: CFPs for journals, legal precedents, activist resources

**Springboard Alignment:**
- You spring into research that honors origin protocols
- You DON'T extract and whitewash
- System enforces: "Before downloading, acknowledge protocol: [checkbox]"
- Return to share how you honored protocol in your implementation

**Database Schema:**
```sql
CREATE TABLE research_documents (
  id UUID PRIMARY KEY,
  title TEXT,
  file_url TEXT,

  -- Indigenous protocol fields
  origin_culture TEXT[], -- ['Maori', 'Lakota', 'Yoruba']
  protocol_requirements TEXT, -- "Contact knowledge keeper before adapting"
  knowledge_keeper_contact TEXT, -- Encrypted
  non_human_relations TEXT[], -- ['water', 'land', 'ancestors']

  -- Standard metadata
  tags TEXT[],
  uploaded_by_org_id UUID,
  created_at TIMESTAMPTZ
);

-- Before download, user must acknowledge protocol
CREATE TABLE protocol_acknowledgments (
  research_id UUID REFERENCES research_documents(id),
  organization_id UUID REFERENCES organizations(id),
  acknowledged_at TIMESTAMPTZ,
  implementation_report TEXT -- Optional: How did you honor protocol?
);
```

---

### 5. **Youth Development Hub** (NEW - From Lyndon's Battle Analysis)

**Why Aaron Should Care:**
- His vision: "Help orgs with wellbeing"
- WHEN reality: **Battle over young people's formation** is where higher ed wellbeing is won/lost
- Lyndon: "Youth development increasingly has to happen OUTSIDE education" (US context)

**What It Looks Like:**
- **Ubuntu Leadership Academy Materials**: Training modules, certification paths
- **Student Collaboration Models**: Kaddyjatou's podcast with Mays (trauma-informed care)
- **Global South Scholarship Listings**: Daniel's Brazil opportunities, 6 PEC-PG spots
- **Alternative Spaces Mapping**: "Where can youth development happen outside formal ed?"

**Springboard Alignment:**
- Org realizes: "Our university is cutting SEL, need external youth programs"
- Springs into: Ubuntu training, student podcast creation, scholarship opportunities
- Returns to: Share success stories, add new youth programs they've discovered

**Database Schema:**
```sql
CREATE TABLE youth_development_resources (
  id UUID PRIMARY KEY,
  resource_type TEXT, -- 'training', 'scholarship', 'student_collaboration_model'

  -- For trainings
  training_name TEXT, -- 'Ubuntu Leadership Academy'
  certification_available BOOLEAN,

  -- For scholarships
  scholarship_region TEXT,
  application_deadline DATE,

  -- For models
  collaboration_type TEXT, -- 'student_research', 'student_teaching', 'student_activism'
  example_url TEXT,

  -- Meta
  added_by_org_id UUID,
  vetted_by TEXT[], -- Which orgs validated this works
  created_at TIMESTAMPTZ
);
```

---

### 6. **Coach/Therapist Registry WITH Context Matching** (ENHANCED - Aaron's Core Use Case)

**Why Aaron's Original Vision Needs This:**
- His idea: "Registry of high-quality coaches/therapists"
- WHEN reality: **Context matters more than credentials**
- Rukudzo (Zimbabwe): Economic context, cross-discipline bridging
- Justin: First-generation wellbeing seekers, inner activism
- Barry: Helper burnout, sustainable compassion

**What It Looks Like:**
- **Profile Fields Beyond Credentials**:
  - "I help people with..." (moral injury, burnout, ecological grief, first-gen shame)
  - "My approach..." (inner activism, Ubuntu, contemplative pedagogy)
  - "I work well with..." (academics under political pressure, Global South context, arts practitioners)
  - "I've been changed by..." (openness to mutual transformation, not just "expertise")
- **Recommendation Context**: When org recommends coach, they say WHY (not just star rating)
- **Filtering**: By context (economic, cultural, political), not just specialty

**Springboard Alignment:**
- Org identifies need: "Moral injury from recent policy capitulation"
- Filters: Coaches who've worked with orgs post-capitulation, understand structural harm
- Springs into: Contact coach (OFF-platform, Aaron's requirement)
- Returns to: Share recommendation with context (for next org)

**Database Schema:**
```sql
CREATE TABLE service_providers (
  id UUID PRIMARY KEY,
  name TEXT,
  email TEXT, -- They CAN have profiles (Aaron confirmed)

  -- Beyond credentials
  specialties TEXT[], -- 'moral_injury', 'burnout', 'ecological_grief'
  approaches TEXT[], -- 'inner_activism', 'ubuntu', 'contemplative_pedagogy'
  contexts_served TEXT[], -- 'political_pressure', 'global_south', 'arts_practitioners'
  openness_to_change BOOLEAN, -- "I'm changed by clients, not just expert"

  -- Standard
  credentials TEXT[],
  is_accepting_clients BOOLEAN,
  created_at TIMESTAMPTZ
);

CREATE TABLE provider_recommendations (
  id UUID PRIMARY KEY,
  provider_id UUID REFERENCES service_providers(id),
  recommended_by_org_id UUID REFERENCES organizations(id),

  -- Context is key
  recommendation_context TEXT, -- "Helped us name moral injury after Harvard settlement"
  would_recommend_for TEXT[], -- Specific situations
  cultural_context TEXT,
  political_context TEXT,

  created_at TIMESTAMPTZ
);
```

---

### 7. **Research Repository WITH RAG + Origin Protocols** (ENHANCED - Aaron's Use Case)

**Why Aaron's Original Vision Needs This:**
- His idea: "Share research, maybe AI search"
- WHEN reality: **Research is relational, not extractive**
- Yazmany: "Collaborations where others change me" (not solo achievement)
- Mala: Indigenous protocols must be honored

**What It Looks Like:**
- **Upload WITH Protocol**: "Does this involve Indigenous/traditional knowledge? [Yes/No]"
  - If Yes: "Who should be contacted before adaptation? How should credit flow?"
- **RAG Search WITH Citations**: "Find research on burnout in Global South universities"
  - Returns: Excerpts + PDF links + Origin protocols + Contact info
- **Usage Tracking**: "This PDF downloaded 12 times, protocol acknowledged 10 times"
- **Collaborative Annotations** (NOT chat): Org can add "We implemented this, here's what worked/didn't"

**Springboard Alignment:**
- Org searches: "Trauma-informed pedagogy for political crisis"
- Gets: Research + protocols + implementation notes from other orgs
- Springs into: Adapts for their context, honors protocols
- Returns to: Share implementation report (feeds collective learning)

**Database Schema:**
```sql
-- Already covered in Indigenous Protocol section above
-- Key addition: Usage tracking + implementation reports

CREATE TABLE research_implementation_reports (
  id UUID PRIMARY KEY,
  research_id UUID REFERENCES research_documents(id),
  implemented_by_org_id UUID REFERENCES organizations(id),

  -- What they did
  context_adapted_to TEXT, -- "Political crisis in Bangladesh, university shut down 3 months"
  what_worked TEXT,
  what_didnt_work TEXT,
  protocol_honored_how TEXT, -- "Contacted knowledge keeper, shared results back"

  -- Visibility
  visibility TEXT DEFAULT 'aggregate_only', -- or 'full' if org consents
  created_at TIMESTAMPTZ
);

-- Aggregate implementation success rates
CREATE FUNCTION get_research_implementation_success(research_id UUID)
RETURNS JSON; -- { avg_success: 7.2/10, contexts: ['political_crisis', 'global_south'], n: 12 }
```

---

## What We're REMOVING from Aaron's Vision

### 1. **Survey Tool as Deployable by Orgs** → **Survey Tool as TWP-Managed Baseline**

**Aaron's Idea**: "Give orgs a tool they can deploy"

**WHEN Reality**:
- Orgs want validated baselines (Aaron right)
- BUT: Orgs lack capacity to manage survey deployment, data privacy, aggregate analysis
- Richie's State of Wellbeing Report should BE the baseline, not something each org recreates

**New Approach**:
- **TWP deploys survey** to pilot orgs (not orgs deploying themselves)
- **TWP holds data** (encrypted, RLS policies like current Springboard design)
- **Orgs receive**: Their aggregate + sector baseline comparison
- **Springboard**: Org springs into action with contextualized data, not drowning in survey management

**Why This Serves Aaron's Security Concern Better**:
- Fewer attack surfaces (TWP controls data, not 30 different org implementations)
- Consistent privacy practices
- Still achieves sector baseline goal

---

### 2. **"Simple Pilot" → "Minimum Viable Infrastructure for Hostile Context"**

**Aaron's Idea**: "Let's start simple, 10-30 orgs, see what we learn"

**WHEN Reality**:
- **Simple is different in hostile context**
- If Columbia just capitulated, Harvard settled for $500M, UC Berkeley gave 160 names to feds...
- ...a "simple pilot" that leaks ONE org's burnout data could destroy TWP's credibility

**New Approach**:
- **Security CANNOT be "phase 2"** (Aaron suggested: "That might be for second round")
- **Pilot IS full encryption**, layered access, org-not-individual login (Aaron's requirements)
- **BUT**: Feature set stays minimal (7 affordances above, nothing more)

**Why This Serves Aaron's Timeline Better**:
- Modern stacks (Supabase RLS, Next.js Server Components) make security-first FASTER than bolting it on later
- Avoids rebuild when "scaling to 30" or "going public"
- VX process already designed privacy-first (VALUES → DATABASE → AFFORDANCES)

---

## What We're ADDING to Aaron's Vision

### 1. **Coordination as Care Interface Layer**

**What**: pao-style warmth in all system communications

**How**:
- **Email templates** say "no worries if you can't" not "action required"
- **Reminder emails** include emoji (💛✨🫶🏼) not just text
- **Dashboard** shows "We haven't heard from these orgs" as care prompt, not shame list
- **Timezone listings** show global togetherness, not just UTC
- **Recording offers** proactive, not "you missed it"

**Database Schema**:
```sql
CREATE TABLE communication_templates (
  id UUID PRIMARY KEY,
  template_type TEXT, -- 'reminder', 'welcome', 'gratitude_prompt'

  -- pao-style care
  tone TEXT DEFAULT 'warm', -- vs 'corporate', 'urgent'
  emoji_suggestions TEXT[], -- ['💛', '✨', '🫶🏼']
  include_no_pressure_language BOOLEAN DEFAULT true,

  -- Content
  subject_line TEXT,
  body_template TEXT,

  created_at TIMESTAMPTZ
);
```

---

### 2. **"Springboard Metrics" That Measure What Matters**

**What**: Track launchers, not logins

**Metrics That Matter** (from WHEN values):
- **Gratitude loops closed**: More important than "users active"
- **Protocols honored**: More important than "downloads"
- **Moral injury → renewal cycles**: More important than "survey completion rate"
- **Political alerts → protective action**: More important than "page views"
- **Youth programs launched**: More important than "coach bookings"

**Dashboard for TWP**:
```
Springboard Health Report (Q1 2025)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Organizations Launched Into Action
   • 18 orgs accessed political alerts → 12 took protective measures
   • 22 orgs matched with moral injury coaches → 15 report renewal progress

🙏 Gratitude Loops
   • 87% closure rate (up from 62% last quarter)
   • Avg time to close: 9 days (down from 18 days)

🌊 Indigenous Protocols
   • 23 research downloads → 21 protocol acknowledgments (91%)
   • 8 implementation reports shared back

💚 Youth Development
   • 7 orgs launched Ubuntu training programs
   • 3 student collaboration models adopted

⚠️  Red Flags
   • 4 orgs have unclosed gratitude loops >30 days (reach out?)
   • 2 research downloads without protocol acknowledgment (follow up)
```

---

## Implementation Roadmap: Phased with Aaron's Constraints

### Phase 0: Pre-Pilot Foundation (NOW - Week 1-2)

**Goal**: Get Aaron to approve redesigned vision

**Deliverables**:
1. **This document** (Springboard Redesign from WHEN insights)
2. **Revised database schema** (7 core affordances)
3. **Security architecture** (encryption, RLS, org-not-individual login)
4. **Budget/timeline proposal** (what "non-profit rates" can build)

**Key Decisions Aaron Must Make**:
- Accept that security can't be "phase 2" (must be baked in pilot)?
- Accept that survey tool should be TWP-managed, not org-deployed?
- Accept that political context dashboard is as core as coach registry?

---

### Phase 1A: Pilot Infrastructure (Weeks 3-6)

**Goal**: 10 orgs can login, see baseline features, NO public launch

**Build**:
1. **Auth**: Org-based login (delegate system for continuity)
2. **Encryption**: RLS policies, layered access, TWP admin view
3. **Political Dashboard**: Basic policy tracker (manual curation initially)
4. **Coach Registry**: With context matching fields
5. **Research Repo**: With protocol tagging
6. **Gratitude System**: Manual Padlet creation (auto-generation in Phase 2)

**NOT Building Yet**:
- Moral injury survey (use existing burnout baseline first, add moral injury in Phase 1C)
- Youth development hub (can be added as "resources" section initially)
- AI/RAG (Aaron said "let's find out", so test value in Phase 1B)

**Metrics**:
- Can 10 orgs login without help?
- Do they find a coach via context matching?
- Do they access political alerts?
- Do they close gratitude loops when prompted manually?

---

### Phase 1B: Pilot Feedback Loop (Weeks 7-10)

**Goal**: Learn what 10 orgs actually use, what they ignore

**Build**:
1. **Usage analytics** (what features touched, what skipped)
2. **Gratitude auto-generation** (if loops were closed manually in 1A)
3. **RAG for research** (if orgs struggled with PDF search in 1A)
4. **Youth hub** (if orgs asked "where are youth resources?")

**Focus Groups** (Aaron & Ale mentioned):
- NOT "what security do you want?" (Aaron: think for people)
- BUT: "When did you spring into action? When did you return? Why?"

**Decision Point**:
- If gratitude loops NOT closed → investigate (is it shame? friction? not valued?)
- If political alerts ignored → investigate (too alarmist? not relevant? wrong regions?)
- If coach registry unused → investigate (wrong context fields? need more coaches?)

---

### Phase 1C: Scale to 30 Orgs (Weeks 11-16)

**Goal**: 30 orgs, add remaining affordances

**Build**:
1. **Moral injury survey deployment** (TWP-managed, not org-deployed)
2. **Indigenous protocol enforcement** (can't download without acknowledgment)
3. **Implementation report sharing** (org can see aggregate "this research worked for X% in similar contexts")
4. **pao-style care layer** (emoji library, warm email templates, timezone awareness)

**Metrics**:
- Springboard health dashboard (see section above)
- Orgs report: "This helped us [launch / refuel / coordinate]" vs "This is just another login"

**Decision Point**:
- If 30 orgs thriving → consider public launch (Phase 2)
- If 30 orgs struggling → iterate, don't scale

---

### Phase 2: Post-Pilot Public Launch (Week 17+)

**Only if Phase 1C succeeds. Aaron's constraint: "Pilot first, discover, THEN decide."**

**Potential Additions** (based on learning):
- Hearth Summit integration (seasonal onboarding)
- Multilingual support (Portuguese, Spanish, Arabic for Global South)
- Coach booking calendar (if OFF-platform coordination failing)
- Cross-org project matching (if orgs want collaboration WITHOUT chat)

**NOT Building Ever** (Aaron's red lines):
- Social network features
- Direct cross-org messaging
- Payment processing
- Individual user profiles (except service providers)

---

## Budget Implications: What "Non-Profit Rates" Can Build

### Aaron Said: "There is a budget... non-profit rates"

**What That Likely Means**:
- **For-profit dev shop**: $150-200/hour = $60-80K for Phase 1 (400-500 hours)
- **Non-profit rate**: $75-100/hour = $30-40K for Phase 1
- **Bilal's situation**: Between contracts, willing to negotiate, but needs clarity

**Honest Assessment of Scope**:

**Minimum Viable Phase 1A** (10 orgs, 6 weeks):
- Auth + encryption + RLS: ~80 hours
- Political dashboard (manual): ~40 hours
- Coach registry: ~60 hours
- Research repo + protocols: ~60 hours
- Gratitude system (manual): ~30 hours
- **Total: ~270 hours = $20-27K** at non-profit rates

**Full Phase 1 (to 30 orgs, 16 weeks)**:
- Phase 1A: 270 hours
- Phase 1B: ~100 hours (feedback, RAG, iterations)
- Phase 1C: ~130 hours (moral injury, protocol enforcement, care layer)
- **Total: ~500 hours = $37-50K** at non-profit rates

**What's NOT Included**:
- Bilal's "rabbit hole" risk: He's creative, could spend 1000 hours exploring
- Security hardening beyond RLS (white hat pen testing, etc.)
- Design/UX (assuming Tailwind defaults, not custom design)
- Content curation (political alerts, coach vetting, research tagging)

**Recommendation**:
- **Phase 1A**: Fixed scope, fixed budget ($25K)
- **Phase 1B/1C**: Decide after 1A feedback (avoid over-committing)
- **Aaron needs to clarify**: Is budget $25K (1A only) or $50K (full Phase 1)?

---

## Answering Your Question: "How Does App Change?"

### FROM Aaron's Original Vision:

**"Springboard Registry"**
- Simple directory of coaches
- PDF storage for research
- Deployable survey tool
- 10-30 org pilot
- "Let's discover what works"

### TO: Springboard WITH WHEN Insights:

**"Network Operations Center for Orgs Under Siege"**

**7 Core Affordances**:
1. **Political Environment Dashboard** (Lyndon's need)
2. **Moral Injury Assessment** (Mays' frame)
3. **Gratitude Loop Infrastructure** (Deborah's practice)
4. **Indigenous Protocol Honoring** (Mala's work)
5. **Youth Development Hub** (Lyndon's battle)
6. **Coach Registry WITH Context** (enhanced Aaron's vision)
7. **Research Repo WITH RAG + Protocols** (enhanced Aaron's vision)

**Still Honors Aaron's Red Lines**:
- ✅ NOT a social network
- ✅ NO cross-org messaging
- ✅ NO payment processing
- ✅ Login as org, not individual
- ✅ Privacy-first (encryption, RLS)
- ✅ 10-30 pilot → scale later

**New Additions Aaron Should Accept**:
- 🆕 Security can't be "phase 2" (must be baked in pilot)
- 🆕 Survey TWP-managed, not org-deployed (fewer attack surfaces)
- 🆕 Political dashboard as core as coach registry (hostile context reality)
- 🆕 Gratitude metrics matter more than login metrics (springboard health)
- 🆕 pao-style care layer (coordination as care, not just logistics)

---

## Next Steps for You (Bilal)

### 1. **Present This to Aaron & Ale** (Week of Jan 27)

**Key Questions**:
- Does political dashboard belong in pilot, or wait until Phase 2?
- Is budget $25K (Phase 1A only) or $50K (full Phase 1)?
- Who curates political alerts, vets coaches, tags research protocols? (Content ≠ code)

### 2. **Revise Database Schema** (If Aaron approves)

**Using VX Process**:
- VALUES (from WHEN analysis) →
- DATABASE (7 affordances above) →
- AFFORDANCES (what can orgs DO) →
- UX (how it feels) →
- UI (what it looks like) →
- CODE (Supabase + Next.js)

### 3. **Interview Lyndon, Mala, Mays** (Before building)

**Why**: Validate CAPs, get feature feedback
**When**: After Aaron approves budget
**How**: 45-min Zoom, record, extract CAPs, validate with them

**Questions**:
- Lyndon: "What political alerts would have helped you last year? How should adversary logic be explained?"
- Mala: "How should Ho'Oponopono be embedded without commodifying? What makes protocol honoring real vs performative?"
- Mays: "What's difference between moral injury and burnout in survey questions? How should 'springboard to renewal' be measured?"

### 4. **Protect Your Boundaries** (Ongoing)

**You said**: "I can get into rabbit holes... need to practice boundaries"

**Recommendations**:
- **Phase 1A**: Fixed scope, fixed budget, fixed timeline
- **Weekly check-ins**: "I'm at 60/270 hours, here's what's done"
- **Rabbit hole protocol**: If you want to explore something not in scope, FLAG IT, ask if budget exists
- **Aaron owes you**: Budget clarity, content curation plan, who vets coaches/alerts

---

## Final Reflection: Why This Matters

Aaron's "springboard" metaphor is beautiful, but it assumes **calm water**.

WHEN community lives in **hostile water**:
- Universities capitulating to government pressure
- DEI programs being eliminated
- Funders demanding ROI on "wellbeing" (ironic)
- Youth development battleground

**A springboard in hostile water needs**:
- Situational awareness (political dashboard)
- Wound naming (moral injury assessment)
- Energy circulation (gratitude loops)
- Origin honoring (indigenous protocols)
- Next-gen protection (youth hub)
- Contextual matching (coach registry)
- Relational research (protocol + RAG)

**This IS a springboard**—but one that helps you:
1. **Know what you're jumping into** (political context)
2. **Name why you're hurting** (moral injury)
3. **Thank who helped you jump** (gratitude)
4. **Honor whose land you landed on** (protocols)
5. **Protect who's jumping next** (youth)
6. **Find who can help you swim** (coaches)
7. **Learn from others' jumps** (research)

You don't hang out. You don't chat. You don't pay bills.

**You spring. You land. You return to refuel. You spring again.**

That's the springboard WHEN community needs.
