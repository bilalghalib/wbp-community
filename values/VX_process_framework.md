# Values Experience (VX) Process Framework
## Defining VX in Relation to Product Development

### What is VX? (Our Definition)

**Values Experience (VX)** is the layer between research and UX that translates discovered values/ways of being into architectural affordances that enable those values to be lived.

**The Full Stack:**
```
Research/Interviews (What people value)
        ↓
VX (How to enable those values architecturally)
        ↓
Information Architecture (System structure)
        ↓
UX (User flows & interactions)
        ↓
UI (Visual & interaction design)
        ↓
Implementation (Code/build)
        ↓
Testing (Does it enable the values?)
        ↓
Research (Loop back - are values being lived?)
```

### VX vs. Traditional UX

| Traditional UX | Values Experience (VX) |
|---------------|----------------------|
| "Make it easy to find a coach" | "Enable discernment of practice depth" |
| User journey maps | Values-to-affordances maps |
| Pain point reduction | Values enablement |
| Efficiency optimization | Intentional friction where values require |
| Feature lists | Must Do / Mustn't Do constraints |
| User needs | Constitutive attentional policies |
| Personas (demographic) | Personas (ways of being) |

### VX in Design Thinking Alternative

Traditional Design Thinking:
1. Empathize
2. Define
3. Ideate
4. Prototype
5. Test

**Values-First Design (VX Process):**
1. **Discover Values** (not just empathy - what do people value as ends in themselves?)
2. **Map Blocks & Enablers** (what prevents/allows these values to be lived?)
3. **Define Affordances** (architectural decisions that enable values)
4. **Translate to Architecture** (system rules, database schema, constraints)
5. **Design Flows** (UX that embodies affordances)
6. **Validate Against Values** (does it enable ways of being?)
7. **Iterate** (loop back to values when design conflicts arise)

### Why VX Matters for This Project

Aaron doesn't want "a platform" - he wants a springboard. This is a **VX distinction**, not a UX distinction.

**Platform (anti-value):**
- Ongoing engagement
- Social dynamics
- Attention capture
- Growth metrics

**Springboard (value):**
- One-time use
- Get what you need, leave
- No engagement hooks
- Utility metrics

Traditional UX would optimize for engagement. VX says: **the value is NON-engagement**.

## VX Process for Wellbeing Registry

### Phase 1: Values Discovery (Weeks 1-3)

**Goal:** Extract constitutive attentional policies from stakeholders

**Method:** Semi-structured interviews using CAP framework

**Output:** Values cards for each persona

**Activities:**

#### 1A. Coordinator Interviews (2-3 people)
**Who:** Aaron, WHEN network coordinators
**Duration:** 60-90 minutes each
**Focus:** Strategic values - what makes this a springboard not a platform?

**Interview Structure:**
```
Part 1: Current State (15 min)
- Walk me through how you currently help a campus find a coach
- What frustrates you about current systems/tools?
- When have you seen something work really well?

Part 2: Values Extraction (30-40 min)
Use our 15 CAP questions:
- What moments in your work feel intrinsically meaningful?
- What do you pay attention to when making recommendations?
- What ways of being do you value in practitioners?
- [etc. - use questions from our .txt file]

Part 3: Springboard Vision (15 min)
- What does "use once and leave" mean to you?
- What would make this feel extractive vs. supportive?
- What must this NOT become?

Part 4: Validation (10 min)
- Show values card draft
- "Does this capture what matters to you?"
```

#### 1B. Wellbeing Coordinator Interviews (5-7 people)
**Who:** Campus coordinators, student affairs directors
**Duration:** 60 minutes each
**Focus:** User values - what makes discernment possible?

**Interview Structure:**
```
Part 1: Story Elicitation (20 min)
- Tell me about a time you found the perfect practitioner for your campus
- What made them right? How did you know?
- Tell me about a time you got burned by a bad referral
- What were the warning signs you missed?

Part 2: Current Workarounds (15 min)
- Walk me through your actual process for finding coaches now
- What information sources do you trust? Why?
- What makes you decide NOT to use someone?

Part 3: CAP Questions (20 min)
Focus on these from our list:
- How do you discern depth vs. surface in a practitioner?
- What tells you someone practices in alignment with your values?
- What makes a recommendation trustworthy?
- What boundaries/privacy concerns do you have?

Part 4: Scenarios (5 min)
- "If you could search by X, would that help?"
- Show mock profile fields
- "What's missing here?"
```

#### 1C. Practitioner Interviews (We already have 5)
**Who:** Use existing transcripts (Rukudzo, Justin, Yazmany, Barry, Deepa)
**Duration:** Already done
**Focus:** What information helps orgs discern fit?

**Process:**
- Run transcripts through extraction tool with our 15 questions
- Generate practitioner values cards
- Identify what information would help coordinators decide

### Phase 2: Values Mapping (Week 4)

**Goal:** Translate values into design constraints

**Method:** Structured analysis session

**Output:** VX documentation (like what we started to create)

**Process:**

#### 2A. Create Values Cards
For each persona (Coordinators, Campus Users, Practitioners):
- Constitutive attentional policies (from interviews)
- Current blocks (what prevents these values)
- Current enablers (what allows these values)

#### 2B. Map Must Do / Mustn't Do
From values cards, extract:
- **Must Do:** Required affordances to enable values
- **Mustn't Do:** Anti-patterns that would block values
- **Scope Decisions:** Pilot / Future / Never

#### 2C. Identify Tensions
Where do values conflict?
- Sharing vs. competition (universities)
- Depth vs. efficiency (coordinators need both)
- Privacy vs. discovery (how to search while protecting)

**Tension Resolution Framework:**
```
Tension: X value vs. Y value
Option A: Prioritize X (consequence for Y)
Option B: Prioritize Y (consequence for X)  
Option C: Architectural solution that honors both
Option D: Defer decision, make visible in pilot
```

### Phase 3: Affordance Design (Week 5)

**Goal:** Translate Must Do/Mustn't Do into architectural decisions

**Method:** Affordance mapping workshop

**Output:** System constraints document + preliminary IA

**Process:**

#### 3A. Database Schema from Values
For each "Must Do" affordance:
```
Value: Organizations need to discern depth of practice
Affordance: Rich "how I practice" field
Schema Decision:
  - practitioners.how_i_practice (TEXT, 2000 chars)
  - No dropdown/categories
  - Free-form, user's own words
  - Required field (can't submit profile without it)
```

#### 3B. System Rules from Values
For each "Mustn't Do":
```
Anti-Value: Platform with ongoing engagement
System Rules:
  - No real-time features
  - No notifications
  - No activity feeds
  - No "last seen" timestamps
  - Async-only contact requests
```

#### 3C. Information Architecture
Based on affordances:
```
Entry Point: Organization login (not individual)
Primary Actions:
  1. Find practitioners
  2. Access research
  3. Deploy surveys

Search Architecture:
  - Keyword search in "how I practice"
  - Filter by methods/techniques
  - Filter by boundaries/availability
  - NO popularity/rating filters

Profile Architecture:
  - Name + external contact (email/website)
  - how_i_practice (rich text)
  - specific_methods (list)
  - boundaries_statement (text)
  - [additional fields per schema]
```

### Phase 4: UX Translation (Week 6)

**Goal:** Turn affordances into specific user flows

**Method:** Story mapping + wireframes

**Output:** User flows that embody values

**Process:**

#### 4A. Story Mapping
Map the "use once and leave" value:
```
Actor: Campus Wellbeing Coordinator

Trigger: Need to find trauma-informed coach for BIPOC students

Journey:
1. Log in with institutional credentials
2. [VX MOMENT: Entry prompt - "What are you seeking support with?"]
   - Purpose: Slow down, clarify intent
   - Anti-pattern: Immediately showing results
3. Search: "trauma-informed" + "BIPOC" + "higher ed"
4. See 5 rich profiles with "how they practice"
5. [VX MOMENT: Read full "how I practice" statements]
   - Purpose: Enable depth discernment
   - Anti-pattern: Quick ratings/reviews
6. Open 2 profiles in tabs, read carefully
7. [VX MOMENT: Contact externally via email/website]
   - Purpose: No platform messaging
   - Anti-pattern: In-app chat
8. Log out
9. Don't return until next need (weeks/months later)
```

#### 4B. Wireframes
Low-fidelity sketches showing:
- What information appears where
- What interactions are possible (and NOT possible)
- How values are embodied in layout

**Wireframe Reviews:**
For each screen, ask:
- Does this enable the value we identified?
- Does this avoid the anti-pattern?
- What's the "values litmus test"?

### Phase 5: Validation (Week 7)

**Goal:** Test if design actually enables values

**Method:** Values-based usability testing

**Output:** Refinements + confidence in pilot scope

**Process:**

#### 5A. Validation Interviews (3-5 coordinators)
**Not** traditional usability testing. **Values validation:**

```
Setup: Show wireframes/prototype

Questions:
- "Would this help you discern depth vs. surface?"
- "What's missing that you'd need to trust a recommendation?"
- "Does this feel extractive or supportive to you?"
- "Would you use this once and leave, or would it pull you back in?"
- "What makes you trust that your data is protected?"

Scenarios:
- "Show me how you'd find someone who practices like [X]"
- "What would make you NOT contact this practitioner?"
- "How would you know if this person is right for your campus?"
```

#### 5B. Red Team Exercise
**Challenge:** Try to use the design AGAINST the values

Examples:
- Can we make this addictive? (Should be no)
- Can we extract more data than orgs want to share? (Should be no)
- Can we create competitive dynamics? (Should be no)
- Can we make orgs feel inadequate? (Should be no)

If we CAN do these things, the architecture needs revision.

### Phase 6: Documentation (Week 8)

**Goal:** Articulate values-driven decisions for Aaron/team

**Method:** Write design rationale

**Output:** VX documentation (like what we've been creating)

**Documents:**
1. **Values Cards** (all personas)
2. **Must Do / Mustn't Do** (design constraints)
3. **Affordances Map** (values → architecture)
4. **Decision Log** (why we chose X over Y)
5. **Validation Report** (did testing confirm values are enabled?)
6. **Pilot Scope** (what's in, what's future, what's never)

## Interview Protocol Template

### Pre-Interview (Send 2 days ahead)

**Email:**
```
Hi [Name],

Thanks for agreeing to talk with me about the wellbeing registry project. I'm doing research to understand what would make this truly useful for campus coordinators like you.

This isn't a traditional user interview - I'm less interested in features you want and more interested in what you value about your work. I'll ask about moments that feel meaningful, how you make decisions, and what matters to you beyond just efficiency.

The interview will take about 60 minutes. I'll record it (with your permission) so I can focus on our conversation rather than taking notes.

A few things to think about before we talk:
- A time you found a perfect practitioner/resource for your campus
- A time a referral didn't work out
- What makes you trust a recommendation from a colleague

Looking forward to talking with you,
Bilal
```

### Opening (5 min)

```
Thanks for making time. Let me explain what I'm doing and why.

[Context]
The Wellbeing Project is exploring a resource registry - not a social platform, but a place where campus coordinators can find vetted coaches, access research, and share validated tools. Think of it as a springboard - you come in, get what you need, and leave.

[Your Role]
I'm talking to people like you to understand what would actually be useful, and more importantly, what values should guide how we design this. I'm particularly interested in HOW you make decisions, not just WHAT you decide.

[Format]
I'll ask you to tell me some stories, and then I'll ask follow-up questions. There are no wrong answers - I'm genuinely curious about your experience.

[Permission]
Is it okay if I record this? The recording is just for my analysis - I won't share it without your permission.

Any questions before we start?
```

### Main Interview (45-50 min)

**Section 1: Story Elicitation (15-20 min)**
```
Tell me about a time you were looking for a practitioner or resource for your campus and found someone who was perfect. What made them right?

[Follow-ups]
- How did you find them?
- What information helped you decide?
- What did you notice about them that mattered?
- How did you know they'd be a good fit?

Now tell me about a time it didn't work out - you brought someone in and it wasn't right. What happened?

[Follow-ups]
- What were the warning signs?
- What information did you wish you'd had?
- What would have helped you avoid that?
```

**Section 2: Current Practice (10-15 min)**
```
Walk me through your actual process now when you need to find [coach/resource/research]. What do you do?

[Follow-ups]
- What sources do you trust? Why?
- What makes you skeptical?
- What takes the most time?
- What feels risky?

What makes a recommendation from a colleague trustworthy?

[Follow-ups]
- What do you need to know about the person recommending?
- What do you need to know about the practitioner?
- When do you trust your gut vs. need more info?
```

**Section 3: Values Questions (15-20 min)**

Use our 15 CAP questions, but in conversational form:
```
What are you actually paying attention to when you're deciding if someone is right for your campus?

[If vague, probe:]
- Is it how they describe their practice?
- Is it their credentials?
- Is it something about their presence?
- Is it referrals from others?

How do you tell the difference between someone who's really deep in their practice versus someone who's just using the right language?

[Probe for specifics - what exact signals?]

What makes you feel safe enough to share information about your campus's challenges or data?

[Probe for privacy concerns, trust factors]

What boundaries do you have around your own time and availability? How do platforms violate those?

[Probe for "always-on" fatigue, notification frustration]
```

### Closing (5 min)

```
This has been really helpful. A few last questions:

If this registry existed tomorrow, what's the first thing you'd look for?

What would make you NOT use it?

What would make it feel extractive versus supportive?

Is there anything we haven't talked about that feels important?

Thank you so much. I'll send you a summary of what I learned once I've talked to a few more people. And if you think of anything else, please email me.
```

### Post-Interview

**Within 24 hours:**
1. Transcribe recording
2. Extract quotes related to values
3. Draft preliminary values card
4. Note tensions/conflicts
5. Identify follow-up questions

**After all interviews in a phase:**
1. Compare values cards across interviewees
2. Identify patterns and outliers
3. Map to Must Do / Mustn't Do
4. Document design implications

---

## VX Process Timeline

```
Week 1-2:  Coordinator interviews (2-3)
Week 2-3:  Campus user interviews (5-7)
Week 4:    Values mapping workshop
Week 5:    Affordance design workshop
Week 6:    UX translation + wireframes
Week 7:    Validation interviews (3-5)
Week 8:    Documentation + synthesis
```

**Total: 8 weeks from research to validated design**

## Deliverables

**End of Week 4:**
- Values cards for all personas
- Must Do / Mustn't Do document
- Tension map

**End of Week 6:**
- System constraints document
- Information architecture
- User flow wireframes

**End of Week 8:**
- Complete VX documentation
- Validation report
- Pilot scope recommendation
- Interview with Aaron to review and get buy-in
```

## Next Immediate Actions

1. **Draft outreach email** to WHEN coordinators for interviews
2. **Identify 2-3 coordinators** to start with (via Aaron?)
3. **Schedule first interviews** for Week 1
4. **Set up interview recording/transcription** system
5. **Prepare interview guide** (adapt template above)

---

## Why This Process Matters

Traditional UX would give us a functional registry.

Values-First VX gives us a registry that:
- ✅ Enables coordinators to discern depth, not just find names
- ✅ Protects privacy while enabling discovery
- ✅ Honors "use once and leave" over engagement
- ✅ Aligns with wellbeing values, not tech platform values
- ✅ Can be defended to Aaron with clear rationale

**The difference:** We're not building a directory. We're building an architecture that enables certain ways of being in relation to resources and each other.

That's VX.
