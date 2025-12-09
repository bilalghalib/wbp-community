# Values → Affordances → UX Mapping
## Wellbeing Registry VX Design

---

## The VX Framework

```
ORGANIZATIONAL VALUES (what coordinators care about)
    ↓
CONSTITUTIVE AFFORDANCES (what system must enable)
    ↓
ARCHITECTURAL DECISIONS (how system enables it)
    ↓
UX PATTERNS (what users experience)
```

---

## 1. ORGANIZATIONAL VALUE: Discernment Over Speed

### What Coordinators Value
**"I need to tell if someone will actually be good, not just qualified on paper"**

**Moments of this value:**
- Reading between lines of practitioner descriptions
- Noticing specific language that signals depth
- Comparing "how they practice" vs. "what they practice"
- Trusting gut feeling informed by details

**Current blocks:**
- Directory listings with just credentials
- No way to see HOW someone works
- Having to schedule discovery calls for basic info
- Risk of bringing wrong person to campus

### Affordances That Enable This Value

#### MUST DO: Rich Practice Descriptions
**Architectural decision:**
- `how_i_practice` field = 2000 characters of practitioner's own words
- Free text, not dropdown/categories
- Prominently displayed, not buried

**What this enables:**
- Coordinators can READ how someone describes their approach
- Language itself becomes signal (jargon vs. plain speech)
- Depth visible through specificity of examples

#### MUST DO: Specific Methods Listed
**Architectural decision:**
- `specific_methods` = array of concrete techniques
- Not generic ("mindfulness") but specific ("half-step back from empathy")
- Practitioner-defined, not platform taxonomy

**What this enables:**
- Coordinators can evaluate concrete approaches
- Can match methods to campus needs
- Can Google unfamiliar techniques

#### MUST DO: Boundaries Stated
**Architectural decision:**
- `boundaries_statement` = what practitioner doesn't do
- Required field (no one works with everyone)
- Visible upfront, not hidden

**What this enables:**
- Realistic expectations set
- Red flags if boundaries are vague/absent
- Respect for practitioner's own limits

#### MUSTN'T DO: Quick-Scan Profiles
**Architectural decision:**
- NO profile photos (focus on practice, not appearance)
- NO bullet-point bios (requires reading full text)
- NO "at a glance" summaries

**What this prevents:**
- Snap judgments based on surface
- Efficiency that sacrifices discernment
- Pattern-matching to familiar faces/styles

### UX Patterns

**Search Results Page:**
```
NO ratings, NO photos, NO "top picks"

Instead:
─────────────────────────────────────────
Dr. Rukudzo Masande
Psychiatrist & Family Constellation Facilitator
Contact: [email] [website]

"I stop fully to hear what lies beneath someone's
usual answer. This is different from the quick 
'hi how are you' while walking away..."

Methods: Family constellation therapy, holistic 
mental health assessment, spiritual wellbeing integration

Boundaries: I don't work Saturdays. I don't do 
brief consultations - I need time to truly listen.

[Read full practice description →]
─────────────────────────────────────────
```

**Full Profile Page:**
```
Dr. Rukudzo Masande

HOW I PRACTICE
[Full 2000-character description]
[Practitioner's voice, unedited]

SPECIFIC METHODS I USE
• [Method 1 with brief description]
• [Method 2 with brief description]
• [Method 3 with brief description]

WHAT I DON'T DO
[Boundaries statement]

TRADITIONS INFORMING MY WORK
• Medical psychiatry
• Family constellation therapy
• Spiritual wellbeing practices

CONTACT
Email: [email]
Website: [website]
[External contact - no platform messaging]

RECOMMENDED BY
• Georgetown University Wellbeing Office
• High Point University Student Affairs
```

**Design Principle:** Friction as feature. Reading takes time. That's the point.

---

## 2. ORGANIZATIONAL VALUE: Trust Through Network Vouching

### What Coordinators Value
**"If Georgetown trusts them, I trust them - but I need to know WHY Georgetown trusts them"**

**Moments of this value:**
- Asking "Who referred you to this person?"
- Trusting peer judgment over generic reviews
- Wanting context: "good for what kind of campus?"
- Believing "vetted by our network" more than "5-star rating"

**Current blocks:**
- Anonymous ratings from strangers
- No context on who's recommending
- Can't tell if recommender has similar needs
- Popular ≠ right for your context

### Affordances That Enable This Value

#### MUST DO: Institutional Vouching System
**Architectural decision:**
- `recommended_by` = array of org_ids
- Only network member institutions can vouch
- Institutional account required to add practitioner
- Shows which institutions vouch, not how many people

**What this enables:**
- Peer-to-peer institutional trust
- Context of recommendation (which type of campus)
- Accountability (institutions stand behind recommendations)

#### MUST DO: Qualitative Recommendation Notes
**Architectural decision:**
- Institutions can add brief note on why they recommend
- Not a review (no rating, no "this person is great!")
- Just context: "We brought them for faculty resilience training"

**What this enables:**
- Understanding fit for specific use cases
- Learning from peer experience
- Pattern recognition across institutions

#### MUSTN'T DO: Anonymous Reviews
**Architectural decision:**
- NO star ratings
- NO upvotes/downvotes
- NO "most popular" sorting
- NO reviews from individuals

**What this prevents:**
- Gaming the system
- Popularity contests
- Anonymous complaints
- Disconnected-from-context feedback

#### MUSTN'T DO: Cross-Institutional Visibility
**Architectural decision:**
- Org A can see "3 institutions recommend this person"
- Org A CANNOT see which specific institutions (unless they choose to share)
- Privacy-protected vouching

**What this prevents:**
- Competitive dynamics between universities
- Judgment about who's using what resources
- Surveillance of institutional needs/gaps

### UX Patterns

**In Search Results:**
```
Dr. Rukudzo Masande
...

Recommended by 3 institutions in WHEN network
• Georgetown University: "Faculty resilience training"
• [Institution name hidden]: "Holistic mental health approach"
• High Point: "Spiritual dimension of wellbeing"

[Read recommendations →]
```

**On Recommendation Page:**
```
WHY INSTITUTIONS RECOMMEND DR. MASANDE

Georgetown University Wellbeing Office
Added: Jan 2025
"We brought Dr. Masande for a faculty resilience 
workshop. Her approach to stopping fully and listening 
was exactly what our burned-out professors needed. 
Not a quick fix, but deep work."

[Institution Name]
Added: Dec 2024
Context: Holistic mental health approach for student services
[Note: This institution chose to remain anonymous]

High Point University
Added: Nov 2024
"Dr. Masande's integration of spiritual wellbeing with
clinical practice filled a gap in our student support 
services. She helped us think beyond medicalization."
```

**Design Principle:** Trust is contextual, not numerical.

---

## 3. ORGANIZATIONAL VALUE: Protection from Surveillance

### What Coordinators Value
**"I need to search for support without everyone knowing my campus is struggling"**

**Moments of this value:**
- Not wanting to publicly admit gaps
- Protecting student/staff privacy
- Avoiding reputation risk
- Safe to explore without judgment

**Current blocks:**
- LinkedIn-style "who viewed your profile"
- Activity feeds showing what you're searching
- Public data on institutional needs
- Competitive visibility

### Affordances That Enable This Value

#### MUST DO: Institutional Account Model
**Architectural decision:**
- One institutional login (not individual accounts)
- Credentials shared within org as they choose
- No personal profiles for coordinators
- No "last login" timestamps

**What this enables:**
- Privacy for individuals within institution
- Seamless handoff when coordinators change
- No personal data attached to institutional needs

#### MUST DO: Search Privacy
**Architectural decision:**
- NO search history tracking
- NO "recently viewed" feeds
- NO "coordinators who searched X also searched Y"
- NO visibility of what other institutions are searching

**What this enables:**
- Safe exploration of sensitive topics
- No shame about needs/gaps
- Protection from competitive intelligence gathering

#### MUSTN'T DO: Activity Visibility
**Architectural decision:**
- NO "Georgetown just added a practitioner"
- NO "5 institutions searched for trauma support this week"
- NO institutional comparison metrics
- NO leaderboards or participation metrics

**What this prevents:**
- Surveillance capitalism dynamics
- Competitive comparison between institutions
- Pressure to perform activity
- Exposure of institutional vulnerabilities

### UX Patterns

**Login Page:**
```
WHEN Network Resource Registry

Institution Login
Email: [institutional email]
Password: [shared credential]

[Login]

Privacy: Your searches and views are not tracked
or shared with other institutions. This is a tool
for your use, not a platform for engagement.
```

**After Login:**
```
Welcome, Georgetown University

SEARCH RESOURCES

[Search box]

Your searches are private. Other institutions 
cannot see what you're looking for.

Last Updated: [Date of last practitioner addition to registry]
```

**NO:**
- "Last active"
- "Georgetown is currently online"
- "5 coordinators from your network searched this week"
- "Trending searches"

**Design Principle:** Invisibility as safety.

---

## 4. ORGANIZATIONAL VALUE: Respect for Time/Boundaries

### What Coordinators Value
**"I need this tool when I need it, then I need it to leave me alone"**

**Moments of this value:**
- Searching only when specific need arises
- Not wanting to "keep up" with platform
- Resenting notification fatigue
- Valuing tools that don't demand attention

**Current blocks:**
- Platforms that email constantly
- "Your profile is incomplete" nagging
- "You haven't logged in in 30 days!"
- Gamification of participation

### Affordances That Enable This Value

#### MUST DO: Zero Engagement Requirements
**Architectural decision:**
- NO notifications (ever)
- NO emails (except explicit requests)
- NO profile completion pressure
- NO "community participation" expectations

**What this enables:**
- Use when needed, ignore otherwise
- No guilt about "not being active"
- Tool serves user, not vice versa

#### MUST DO: External Contact Model
**Architectural decision:**
- All practitioner contact happens via email/website
- NO in-platform messaging
- NO "reply within 24 hours" expectations
- Relationship moves off platform immediately

**What this enables:**
- Platform as directory, not mediator
- Real relationship happens elsewhere
- No ongoing platform dependency

#### MUSTN'T DO: Engagement Hooks
**Architectural decision:**
- NO "Georgetown, you might like..."
- NO "Complete your profile"
- NO "Share your experience"
- NO "New practitioners added - check them out!"

**What this prevents:**
- Attention economy dynamics
- Addictive design patterns
- Making work of using the tool
- Platform as attention sink

### UX Patterns

**Email Strategy:**
```
ONLY emails allowed:
1. Password reset (if requested)
2. Practitioner contact confirmation (optional setting)
3. [Nothing else]

Default: NO emails, ever
```

**No Homepage "Feed":**
```
After login, you see:

SEARCH [box]

[That's it. No feed, no updates, no suggestions.]
```

**Contact Flow:**
```
[User clicks email link on practitioner profile]
↓
Opens their email client (mailto: link)
↓
They write their own email
↓
Send directly to practitioner
↓
[Platform is not involved]
```

**Design Principle:** The best platform is the one you can ignore.

---

## 5. PRACTITIONER VALUE: Enabling Depth Through Profile Design

### Translating Practitioner Values → Org Discernment

This is where the VALUES CARDS from practitioners become DESIGN DECISIONS:

#### Rukudzo: "True Presence Beyond Medical Distance"

**Organizational need:** Tell if practitioner does quick check-ins vs. stops fully to listen

**Affordance:** 
- Profile question: "How do you practice presence with clients/communities?"
- Rich text field for description
- NO time-per-session metrics (depth ≠ duration)

**UX:**
```
HOW I PRACTICE PRESENCE

"I stop fully to hear what lies beneath someone's
usual answer. This is different from the 'hi how 
are you' people say while walking away. Stopping 
fully means I don't have my hand on the doorknob,
I'm not checking my watch, I'm not thinking about
the next person. I'm here with this person right now."
```

#### Justin: "Commitment Beyond Emotional Weather"

**Organizational need:** Avoid practitioners who only work when feeling hopeful

**Affordance:**
- Profile question: "How do you sustain your practice when emotions shift?"
- Space for describing consistency practices
- NO "currently available" status updates

**UX:**
```
SUSTAINING MY PRACTICE

"I don't ground my work in hope or despair - those
change daily. Instead, I ground in what's possible
when we commit to inner transformation. On hard days,
I return to the practice itself, not the outcomes."
```

#### Barry: "Transforming Rather Than Suppressing"

**Organizational need:** See specific techniques, not just philosophy

**Affordance:**
- Required field: "Specific methods you teach"
- Concrete techniques, not abstract values
- Examples encouraged

**UX:**
```
SPECIFIC METHODS I TEACH

• The half-step back from empathy
  Learning to maintain perspective while keeping
  the heart open, preventing emotional overwhelm

• Compassion vs. empathy distinction
  How to care without taking on others' pain

• Somatic awareness practices
  Noticing body signals before burnout happens
```

#### Yazmany: "Opening to Be Changed by Others"

**Organizational need:** Understand if practitioner delivers vs. co-creates

**Affordance:**
- Profile describes engagement model
- Clear about who does what
- Expectations around collaboration

**UX:**
```
MY APPROACH TO COLLABORATION

I don't deliver a pre-packaged workshop and leave.
I come in, meet your community where they are, and
we co-create what's needed. This means I need:
• Time for listening before designing
• Willingness for iterative process
• Trust that community knows itself
```

#### Deepa: "Questioning the 'Should' That Constrains Us"

**Organizational need:** See if practitioner attends to power/structural factors

**Affordance:**
- Optional field: "How do you attend to power dynamics?"
- Space for systems thinking
- Not required (not all contexts need this)

**UX:**
```
POWER DYNAMICS IN MY WORK

I pay attention to how economic constraints shape
mental health access. I notice when "individual
resilience" is asked for in lieu of structural change.
I help groups see their collective power beyond what
individuals can do alone.
```

---

## 6. CROSS-CUTTING ARCHITECTURAL DECISIONS

### Database Schema (Final)

```sql
-- ORGANIZATIONS
CREATE TABLE organizations (
    org_id UUID PRIMARY KEY,
    org_name TEXT NOT NULL,
    network TEXT, -- 'WHEN', 'WellbeingProject', etc.
    login_email TEXT UNIQUE,
    created_at TIMESTAMP,
    -- NO individual user profiles
    -- NO activity tracking
    -- NO last_login timestamp
);

-- PRACTITIONERS (Not users - just profiles)
CREATE TABLE practitioners (
    practitioner_id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    website TEXT,
    
    -- RICH PROFILE FIELDS
    how_i_practice TEXT(2000), -- Core: how they show up
    specific_methods JSONB, -- Array of {method, description}
    boundaries_statement TEXT(500), -- What they don't do
    
    -- OPTIONAL DEPTH
    power_awareness TEXT(500) NULL,
    disciplines_and_frameworks JSONB NULL,
    
    -- METADATA
    added_by UUID REFERENCES organizations(org_id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
    
    -- NO password (not a user)
    -- NO profile_photo
    -- NO last_active
    -- NO rating_avg
);

-- RECOMMENDATIONS (Institutional Vouching)
CREATE TABLE recommendations (
    rec_id UUID PRIMARY KEY,
    practitioner_id UUID REFERENCES practitioners,
    recommending_org_id UUID REFERENCES organizations,
    context_note TEXT(500), -- "We used them for X"
    created_at TIMESTAMP,
    
    public_visibility BOOLEAN, -- Can hide org name
    
    -- NO star_rating
    -- NO helpful_count
    -- NO reviewer_name
);

-- SEARCHES (Minimal Logging for System Health Only)
CREATE TABLE search_logs (
    search_id UUID PRIMARY KEY,
    org_id UUID REFERENCES organizations,
    search_query TEXT,
    timestamp TIMESTAMP,
    
    -- Aggregate-only visibility
    -- Individual searches NEVER exposed
    -- Used only for: "5 searches this week" (network-wide)
);

-- RESEARCH REPOSITORY
CREATE TABLE research_items (
    item_id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    file_url TEXT,
    description TEXT,
    submitted_by UUID REFERENCES organizations,
    tags JSONB,
    visible_to_network BOOLEAN, -- vs. institution-only
    created_at TIMESTAMP
    
    -- NO download_count (could reveal institutional interests)
    -- NO ratings
    -- NO comments
);

-- SURVEY TEMPLATES
CREATE TABLE survey_templates (
    survey_id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    questions JSONB, -- Array of question objects
    created_by UUID REFERENCES organizations,
    baseline_data JSONB NULL, -- Aggregated, anonymized
    visible_to_network BOOLEAN,
    created_at TIMESTAMP
    
    -- NO completion_rate (could reveal institutional issues)
    -- NO institution-level results (unless explicitly shared)
);
```

### Information Architecture

```
HOME (After Login)
│
├─ FIND PRACTITIONERS
│  ├─ Search
│  ├─ Browse by Method
│  └─ Browse by Discipline
│
├─ ACCESS RESEARCH
│  ├─ Search
│  ├─ Browse by Topic
│  └─ Submit Research
│
├─ WELLBEING SURVEYS
│  ├─ Browse Templates
│  ├─ Deploy Survey
│  └─ Submit Template
│
└─ ACCOUNT
   └─ Change Password
   [That's it - no profile, no settings, no preferences]
```

### Navigation Rules

**MUST:**
- Search is primary action on every page
- All sections accessible from home
- Back button works predictably
- External links open in new tab (preserve search)

**MUSTN'T:**
- No persistent notifications
- No sidebar "activity feed"
- No "recommended for you"
- No breadcrumbs implying exploration depth
- No "continue where you left off"

---

## 7. UX FLOWS (Detailed)

### Flow 1: Finding a Practitioner

```
[Coordinator logs in] →

┌─────────────────────────────────┐
│  WHEN Network Resource Registry │
│                                 │
│  [Search box]                   │
│                                 │
│  Quick Links:                   │
│  • Find Practitioners           │
│  • Access Research              │
│  • Wellbeing Surveys            │
└─────────────────────────────────┘

[Clicks "Find Practitioners"] →

┌─────────────────────────────────┐
│  Find Practitioners             │
│                                 │
│  Search: [trauma-informed    ][→]│
│                                 │
│  Or browse by:                  │
│  • Methods                      │
│  • Disciplines                  │
│  • Traditions/Frameworks        │
└─────────────────────────────────┘

[Searches "trauma-informed"] →

┌─────────────────────────────────┐
│  Search Results                 │
│                                 │
│  5 practitioners match          │
│  "trauma-informed"              │
│                                 │
│  ─────────────────────────────  │
│  Dr. Rukudzo Masande            │
│  Psychiatrist & Family          │
│  Constellation Facilitator      │
│                                 │
│  "I stop fully to hear what     │
│  lies beneath someone's usual...│
│                                 │
│  Methods: Family constellation, │
│  holistic mental health...      │
│                                 │
│  Recommended by 3 institutions  │
│  [Read more →]                  │
│  ─────────────────────────────  │
│                                 │
│  [Next practitioner...]         │
└─────────────────────────────────┘

[Clicks "Read more"] →

┌─────────────────────────────────┐
│  Dr. Rukudzo Masande            │
│                                 │
│  HOW I PRACTICE                 │
│  [Full 2000-char description]   │
│                                 │
│  SPECIFIC METHODS               │
│  • [Method 1]                   │
│  • [Method 2]                   │
│                                 │
│  BOUNDARIES                     │
│  [What I don't do]              │
│                                 │
│  TRADITIONS                     │
│  [Cross-disciplinary work]      │
│                                 │
│  CONTACT                        │
│  Email: name@email.com          │
│  Website: example.com           │
│                                 │
│  RECOMMENDED BY                 │
│  • Georgetown University        │
│    "Faculty resilience..."      │
│  [More recommendations →]       │
└─────────────────────────────────┘

[Clicks email link] →

[Opens user's default email client]
To: name@email.com
From: [user's email]
Subject: [User writes their own subject]

[User writes email]
[User sends email]

[Platform is done - relationship is now external]
```

### Flow 2: Browsing Research

```
[From home] →

┌─────────────────────────────────┐
│  Access Research                │
│                                 │
│  Search: [wellbeing assessment]│
│                                 │
│  Browse by topic:               │
│  • Student Wellbeing            │
│  • Faculty/Staff Support        │
│  • Institutional Culture        │
│  • Assessment Tools             │
│  • Program Evaluation           │
└─────────────────────────────────┘

[Searches "wellbeing assessment"] →

┌─────────────────────────────────┐
│  Research Results               │
│                                 │
│  8 items match                  │
│                                 │
│  ─────────────────────────────  │
│  Measuring Wellbeing Across     │
│  Higher Ed: A Mixed-Methods...  │
│                                 │
│  Submitted by: Georgetown       │
│  Date: Jan 2025                 │
│  Type: Research Report (PDF)    │
│                                 │
│  "This study explores..."       │
│                                 │
│  [Download PDF]                 │
│  ─────────────────────────────  │
│                                 │
│  [Next item...]                 │
└─────────────────────────────────┘
```

### Flow 3: Deploying a Survey

```
[From home] →

┌─────────────────────────────────┐
│  Wellbeing Surveys              │
│                                 │
│  Browse validated survey        │
│  templates used by other        │
│  institutions                   │
│                                 │
│  [Browse Templates]             │
│  [Submit Your Own Template]     │
└─────────────────────────────────┘

[Clicks "Browse Templates"] →

┌─────────────────────────────────┐
│  Survey Templates               │
│                                 │
│  5 templates available          │
│                                 │
│  ─────────────────────────────  │
│  Student Wellbeing Baseline     │
│  15 questions | ~5 min          │
│                                 │
│  Used by 8 institutions         │
│  Baseline data available        │
│                                 │
│  [Preview] [Deploy]             │
│  ─────────────────────────────  │
│                                 │
│  [Next template...]             │
└─────────────────────────────────┘

[Clicks "Deploy"] →

┌─────────────────────────────────┐
│  Deploy Survey                  │
│                                 │
│  Survey: Student Wellbeing      │
│  Baseline                       │
│                                 │
│  This will generate a unique    │
│  survey link for your           │
│  institution. Share this link   │
│  with your students/staff.      │
│                                 │
│  Results will be visible only   │
│  to your institution unless     │
│  you choose to share aggregated │
│  data with the network.         │
│                                 │
│  [Generate Survey Link]         │
│  [Cancel]                       │
└─────────────────────────────────┘

[Clicks "Generate"] →

┌─────────────────────────────────┐
│  Survey Link Generated          │
│                                 │
│  Your survey link:              │
│  https://surveys.when.org/gtu45│
│                                 │
│  [Copy Link]                    │
│                                 │
│  Access your results anytime    │
│  at: Account > Active Surveys   │
│                                 │
│  [Done]                         │
└─────────────────────────────────┘
```

---

## 8. DESIGN VALIDATION CRITERIA

### How to Know If This UX Enables Values

For each value, we have a test:

#### Test 1: Discernment Over Speed
**Question:** Can coordinator tell depth from profile alone?
**Success:** They can decide WITHOUT scheduling a call
**Failure:** They say "I'd still need to talk to them first"

#### Test 2: Trust Through Network
**Question:** Does institutional vouching increase confidence?
**Success:** "If Georgetown vouches, that means something to me"
**Failure:** "I don't care who else used them"

#### Test 3: Protection from Surveillance
**Question:** Do coordinators feel safe exploring?
**Success:** They search sensitive topics without hesitation
**Failure:** They worry about "who can see this"

#### Test 4: Respect for Time
**Question:** Can they use once and leave?
**Success:** They close browser and forget about it until next need
**Failure:** They check email for platform updates

#### Test 5: Practitioner Values Visible
**Question:** Can they see HOW practitioner practices?
**Success:** "I can tell she really stops to listen"
**Failure:** "It's still just credentials and buzzwords"

---

## 9. WHAT'S STILL MISSING (Need VX Interviews)

### We Don't Actually Know:

1. **How coordinators currently search**
   - What terms do they use?
   - What order do they evaluate information?
   - What's the decision tree in their head?

2. **What "depth" looks like to them**
   - What specific language signals depth?
   - What makes them trust vs. doubt?
   - How much text is too much?

3. **Their institutional context**
   - Public vs. private university differences?
   - Size matters (large research vs. small liberal arts)?
   - Geographic/cultural factors?

4. **Their risk tolerance**
   - What's a "safe" choice vs. "bold" choice?
   - When do they need admin approval?
   - What happens if it goes wrong?

5. **Their trust criteria**
   - Why would Georgetown's vouching matter?
   - What if they don't know the vouching institution?
   - Do they trust peer recommendations?

### This Means:

The UX above is **informed speculation** based on:
- Aaron's vision (springboard not platform)
- WHEN document (institutional dynamics)
- Practitioner values (what they want orgs to know)

But it's NOT:
- Validated by actual coordinator interviews
- Tested with real search behaviors
- Confirmed to match their mental models

---

## 10. NEXT STEPS: VX Validation

### Immediate: Show This to Aaron

**Questions for Aaron:**

1. **Does this match your springboard vision?**
   - Is this still "not a platform"?
   - Is anything here engaging people too much?

2. **Is the institutional privacy model right?**
   - One institutional login vs. individual accounts?
   - What visibility between institutions?

3. **Is practitioner profile depth right?**
   - 2000 characters too much? Too little?
   - Are we asking the right questions?

4. **Who should we interview first?**
   - Network coordinators or campus users?
   - How many before we can validate?

### Then: VX Interviews (As Designed)

Use the interview script and cheat sheet to talk to:
- 2-3 network coordinators
- 5-7 campus wellbeing coordinators

Extract actual values cards for ORG USERS, not practitioners

### Then: Revise This Document

Based on what we learn:
- Adjust affordances if values don't match
- Redesign UX if flows don't work
- Add/remove features based on Must/Mustn't

### Then: Prototype & Test

Build clickable wireframes and validate:
- Can they discern from profiles?
- Do they trust institutional vouching?
- Do they feel safe searching?
- Can they use once and leave?

---

## METAPHOR FOR THIS WHOLE PROCESS

**VX is like designing a library vs. a social club:**

**Social Club (What we're NOT building):**
- Members hang out
- Activity feeds and events
- You go to see and be seen
- Value comes from participation

**Library (What we ARE building):**
- Come in when you need a book
- Catalog helps you find what you need
- Librarian (network) vouches for quality
- Take book and leave
- Library doesn't email you about new arrivals
- Library doesn't track what you read

**The practitioner profiles are books on the shelf.**
**The institutional vouching is the librarian's recommendation.**
**The search function is the card catalog.**
**The "no notifications" policy is the library's silence.**

Aaron wants a library, not a social club.

This VX document tries to architect that.

---

## FINAL REALITY CHECK

### What's Good About This Design:

âœ… Aligns with Aaron's springboard vision
âœ… Protects institutional privacy
âœ… Enables practitioner depth to be visible
âœ… No engagement hooks or platform capture
âœ… Trusts coordinator discernment

### What's Uncertain:

❓ Is 2000 characters the right length?
❓ Will coordinators actually read that much?
❓ Does institutional vouching matter as much as we think?
❓ Are we protecting the right things?
❓ What are we missing that only interviews will reveal?

### What to Do About Uncertainty:

**Don't build yet.**

**Interview first.**

**Validate values.**

**Then architect.**

**Then UX.**

**Then build.**

That's the VX process.
