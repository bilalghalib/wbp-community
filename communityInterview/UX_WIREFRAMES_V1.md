# Springboard Registry - UX Wireframes V1

**Created**: January 24, 2025
**Status**: Draft for Review
**Next**: Validate with Aaron, Ale, then build

---

## Design Principles (From Values)

Before wireframes, let's establish principles that should be visible in EVERY screen:

### 1. **Springboard, Not Platform**
- **Feels like**: You came to launch, not to hang out
- **UI manifestation**: Clear CTAs ("Find Coach" → "Contact" → "Done"), no endless scroll
- **Anti-pattern**: Sticky nav encouraging exploration, "Discover" tabs, social features

### 2. **Coordination as Care** (pao's value)
- **Feels like**: System is rooting for you, not demanding from you
- **UI manifestation**: "No worries if you skip this" copy, warm colors, helpful not corporate
- **Anti-pattern**: "Action Required!" red badges, guilt-inducing incomplete profile bars

### 3. **Privacy is Protection, Not Secrecy** (Aaron's constraint)
- **Feels like**: Safe to be vulnerable, not paranoid
- **UI manifestation**: Visible locks 🔒 with explanatory tooltips ("Only your org sees this")
- **Anti-pattern**: Hidden privacy, legalese, "Trust us"

### 4. **Context Over Credentials** (Multiple CAPs)
- **Feels like**: System understands YOUR situation
- **UI manifestation**: Filters for "Political pressure" not just "Burnout specialty"
- **Anti-pattern**: Generic dropdowns, star ratings without context

---

## Core User Flows (Prioritized)

### Flow 1: First Login & Onboarding ⭐⭐⭐ (MOST CRITICAL)
### Flow 2: Finding a Coach ⭐⭐⭐
### Flow 3: Closing a Gratitude Loop ⭐⭐
### Flow 4: Responding to Political Alert ⭐⭐
### Flow 5: Uploading Research with Protocol ⭐⭐
### Flow 6: Taking Moral Injury Survey ⭐
### Flow 7: Accessing Youth Resources ⭐

Let's start with Flow 1...

---

## FLOW 1: First Login & Onboarding

### Goals:
- Org admin feels welcomed (not overwhelmed)
- Understands what springboard IS (and isn't)
- Can take ONE meaningful action in first session
- Returns because value was immediate

### Key Decisions:
- ❓ Empty state vs pre-populated examples?
- ❓ Guided tour vs self-exploration?
- ❓ Required profile vs optional?

### Wireframe: Login Screen

```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║                     🌊 Springboard                         ║
║              Network Operations for Wellbeing              ║
║                                                            ║
║   ┌──────────────────────────────────────────────────┐   ║
║   │  Organization Login                              │   ║
║   │                                                  │   ║
║   │  Email: [_________________________________]      │   ║
║   │                                                  │   ║
║   │  Password: [_________________________________]   │   ║
║   │                                                  │   ║
║   │  🔒 Your data is encrypted. Only your org and   │   ║
║   │  the Wellbeing Project can access it.           │   ║
║   │                                                  │   ║
║   │  [        Login as Organization        ]        │   ║
║   │                                                  │   ║
║   │  Forgot password? Contact: support@wbp.org      │   ║
║   └──────────────────────────────────────────────────┘   ║
║                                                            ║
║   New organization? Request access: register@wbp.org      ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

**Design Notes:**
- 🔒 Lock icon + plain language (not legalese)
- "Login as Organization" (not "Login" - reinforces mental model)
- No self-registration (pilot is invitation-only)
- support@ and register@ emails visible (human contact, not forms)

---

### Wireframe: Welcome Screen (First-Time Only)

```
╔════════════════════════════════════════════════════════════════════╗
║  🌊 Springboard     [Search] [Alerts: 2] [Profile ▼]  [Logout]   ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  Welcome to Springboard, [Organization Name]! 💛                  ║
║                                                                    ║
║  ┌──────────────────────────────────────────────────────────────┐ ║
║  │  This is NOT a social network. This IS a springboard.        │ ║
║  │                                                              │ ║
║  │  You come here when you need:                               │ ║
║  │  • Vetted coaches/therapists (context-matched, not generic) │ ║
║  │  • Research with implementation stories (not just PDFs)     │ ║
║  │  • Political alerts (know what's coming, prepare together)  │ ║
║  │  • Youth programs (when universities cut funding)           │ ║
║  │                                                              │ ║
║  │  You spring into action, then return to close gratitude     │ ║
║  │  loops and share what worked.                               │ ║
║  │                                                              │ ║
║  │  [  Got it, let's explore  ]   [  Skip, show me dashboard ] │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
║  ┌─────────────────────  Quick Start  ─────────────────────────┐ ║
║  │                                                              │ ║
║  │  ① Check Alerts                                             │ ║
║  │  ⚠️  2 new policy changes may affect your region            │ ║
║  │  [View Alerts →]                                            │ ║
║  │                                                              │ ║
║  │  ② Find a Coach                                             │ ║
║  │  Search by context: "Moral injury + political pressure"     │ ║
║  │  [Search Coaches →]                                         │ ║
║  │                                                              │ ║
║  │  ③ Explore Research                                         │ ║
║  │  23 documents shared by network (with protocols honored)    │ ║
║  │  [Browse Research →]                                        │ ║
║  │                                                              │ ║
║  │  No worries if you skip these—you can always come back 🫶🏼  │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

**Design Notes:**
- Explicit anti-definition: "NOT a social network"
- 4 core use cases listed (coach, research, alerts, youth)
- "Spring into action, return to close loops" = mental model
- Quick Start with gentle CTAs (not REQUIRED)
- pao-style reassurance: "No worries if you skip" 🫶🏼
- Alert badge (2) visible in nav (creates urgency without panic)

---

### Wireframe: Dashboard (Post-Onboarding, Regular View)

```
╔════════════════════════════════════════════════════════════════════╗
║  🌊 Springboard     [Search] [Alerts: 2] [Profile ▼]  [Logout]   ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  Dashboard — [Organization Name]                                  ║
║                                                                    ║
║  ┌─────────────────  Your Springboard Status  ──────────────────┐ ║
║  │                                                               │ ║
║  │  🚀 Recent Launches                                          │ ║
║  │  • Contacted Coach Maria (Jan 20) → 🙏 Close gratitude loop │ ║
║  │  • Downloaded "Trauma-Informed Pedagogy" (Jan 18)           │ ║
║  │    Protocol acknowledged ✅ → Share implementation?          │ ║
║  │  • Accessed Ubuntu training resources (Jan 15)              │ ║
║  │                                                               │ ║
║  │  📬 Open Gratitude Loops (2)                                 │ ║
║  │  You received help and haven't closed the loop yet.          │ ║
║  │  [View & Thank →]                                            │ ║
║  │                                                               │ ║
║  └───────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
║  ┌──────────────────  Network Activity  ────────────────────────┐ ║
║  │                                                               │ ║
║  │  ⚠️  Political Alerts (2 new)                                │ ║
║  │  • DEI ban passed in [Your Region] - Protective measures → │ ║
║  │  • Federal funding threat to public universities            │ ║
║  │  [View All Alerts →]                                         │ ║
║  │                                                               │ ║
║  │  📚 Recently Added Research (5 new)                          │ ║
║  │  • "Moral Injury in Higher Ed" by Mays (HEARTH)             │ ║
║  │  • "Contemplative Pedagogy Toolkit" by Daniel Plá           │ ║
║  │  [Browse Research →]                                         │ ║
║  │                                                               │ ║
║  │  👥 New Coaches Available (3)                                │ ║
║  │  • Specializing in: Political crisis, Global South context  │ ║
║  │  [View Coaches →]                                            │ ║
║  │                                                               │ ║
║  └───────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
║  ┌──────────────  What You Can Do Now  ─────────────────────────┐ ║
║  │                                                               │ ║
║  │  [🔍 Search Coaches]  [📖 Browse Research]  [📊 Take Survey] │ ║
║  │  [🎓 Youth Resources] [💬 Close Gratitude Loops]             │ ║
║  │                                                               │ ║
║  └───────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

**Design Notes:**
- **Top section**: YOUR activity (launches, open loops) = personal
- **Middle section**: NETWORK activity (alerts, new research, coaches) = collective
- **Bottom section**: CTAs (actions you can take) = springboard
- Gratitude loops prominent (not buried in settings)
- Alerts with ⚠️ but not red/panic (informative urgency)
- "Recently Added" (not "Popular") - values recency over likes

**Key UX Decision**:
- ❓ Should "Open Gratitude Loops" be TOP of dashboard (guilt/obligation) or MIDDLE (gentle reminder)?
- **Recommendation**: TOP, because completing loops is higher value than consuming new content

---

## FLOW 2: Finding a Coach

### Goals:
- Org finds contextually-appropriate coach (not just "any therapist")
- Sees trust signals (recommendations with context, not star ratings)
- Can contact off-platform (email visible, no booking system)
- Remembers to close gratitude loop later

### Wireframe: Coach Search

```
╔════════════════════════════════════════════════════════════════════╗
║  🌊 Springboard     [Search] [Alerts: 2] [Profile ▼]  [Logout]   ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  Find a Coach or Therapist                                        ║
║                                                                    ║
║  ┌──────────────────────────────────────────────────────────────┐ ║
║  │  Search by your context (not just symptoms)                  │ ║
║  │                                                              │ ║
║  │  What are you dealing with?                                 │ ║
║  │  [Moral injury        ▼] (dropdown: burnout, grief, etc.)   │ ║
║  │                                                              │ ║
║  │  What's your context?                                       │ ║
║  │  [Political pressure  ▼] (dropdown: economic, cultural...)  │ ║
║  │                                                              │ ║
║  │  Your region/culture:                                       │ ║
║  │  [Global South       ▼] (dropdown: US, Europe, MENA...)     │ ║
║  │                                                              │ ║
║  │  [        Search Coaches        ]                           │ ║
║  │                                                              │ ║
║  │  💡 Tip: Context matters more than credentials. We match    │ ║
║  │  based on who's worked with similar situations.             │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
║  ┌──────────────  Results (8 coaches match)  ───────────────────┐ ║
║  │                                                               │ ║
║  │  ┌─────────────────────────────────────────────────────────┐ │ ║
║  │  │  Dr. Maria Santos                                       │ │ ║
║  │  │  Specialties: Moral injury, Political crisis           │ │ ║
║  │  │  Approach: Liberation psychology, Somatic healing      │ │ ║
║  │  │  Contexts served: Global South, University faculty     │ │ ║
║  │  │  Languages: English, Spanish, Portuguese               │ │ ║
║  │  │                                                         │ │ ║
║  │  │  💬 Recommended by 3 organizations:                    │ │ ║
║  │  │  "Helped us name moral injury after funding cuts"      │ │ ║
║  │  │  "Understands political pressure in Latin America"     │ │ ║
║  │  │  "Somatic approach helped when talk therapy wasn't..." │ │ ║
║  │  │                                                         │ │ ║
║  │  │  ✅ Currently accepting clients                        │ │ ║
║  │  │  📧 maria.santos@example.com                           │ │ ║
║  │  │                                                         │ │ ║
║  │  │  [  View Full Profile  ]    [  Copy Email  ]          │ │ ║
║  │  └─────────────────────────────────────────────────────────┘ │ ║
║  │                                                               │ ║
║  │  ┌─────────────────────────────────────────────────────────┐ │ ║
║  │  │  James Kim, LCSW                                        │ │ ║
║  │  │  Specialties: Burnout, Organizational trauma           │ │ ║
║  │  │  Approach: Systems thinking, Narrative therapy         │ │ ║
║  │  │  ... (similar structure)                               │ │ ║
║  │  └─────────────────────────────────────────────────────────┘ │ ║
║  │                                                               │ ║
║  │  [Load More Results...]                                      │ ║
║  │                                                               │ ║
║  └───────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

**Design Notes:**
- **Context-first filters**: "What are you dealing with?" not "What specialty?"
- **Recommendations with context**: Not star ratings, actual quotes
- **Email visible**: No booking system, no chat (off-platform contact)
- **"Copy Email" button**: Reduces friction (don't make them type)
- **Visual trust signals**: ✅ accepting clients, 💬 recommendations

**Key UX Decision**:
- ❓ Show email immediately or require "View Full Profile" click first?
- **Recommendation**: Show immediately (reduces clicks, org already logged in = trusted)

---

### Wireframe: Coach Profile (Full)

```
╔════════════════════════════════════════════════════════════════════╗
║  🌊 Springboard     [Search] [Alerts: 2] [Profile ▼]  [Logout]   ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  ← Back to Results                                                ║
║                                                                    ║
║  Dr. Maria Santos                                                 ║
║                                                                    ║
║  ┌──────────────────────────────────────────────────────────────┐ ║
║  │  About                                                        │ ║
║  │                                                              │ ║
║  │  I work with organizations experiencing moral injury from    │ ║
║  │  systemic oppression. My approach combines liberation        │ ║
║  │  psychology (Paulo Freire, Ignacio Martín-Baró) with        │ ║
║  │  somatic practices for collective healing.                   │ ║
║  │                                                              │ ║
║  │  I'm based in São Paulo, Brazil, and have worked with       │ ║
║  │  universities, NGOs, and grassroots movements across         │ ║
║  │  Latin America navigating political repression.              │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
║  ┌──────────────────────────────────────────────────────────────┐ ║
║  │  Specialties & Approach                                      │ ║
║  │                                                              │ ║
║  │  I help with:                                                │ ║
║  │  • Moral injury (structural harm to ethical core)           │ ║
║  │  • Political crisis (funding cuts, government pressure)     │ ║
║  │  • Collective trauma (organizational wounds)                │ ║
║  │                                                              │ ║
║  │  My approach:                                                │ ║
║  │  • Liberation psychology (structural analysis + healing)    │ ║
║  │  • Somatic practices (body-based trauma release)            │ ║
║  │  • Group facilitation (collective processing)               │ ║
║  │                                                              │ ║
║  │  I work well with:                                           │ ║
║  │  • University faculty under political pressure              │ ║
║  │  • Global South organizations (economic constraints)        │ ║
║  │  • Social justice movements (activist burnout)              │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
║  ┌──────────────────────────────────────────────────────────────┐ ║
║  │  Recommendations (3 organizations)                           │ ║
║  │                                                              │ ║
║  │  💬 "Maria helped us name the moral injury we felt after    │ ║
║  │  our DEI program was defunded. She didn't just treat our    │ ║
║  │  symptoms—she helped us understand the structural violence  │ ║
║  │  and find ways to resist while protecting our wellbeing."   │ ║
║  │  — University in Mexico (Jan 2025)                          │ ║
║  │                                                              │ ║
║  │  💬 "As a Global South organization, we appreciated that    │ ║
║  │  Maria understands economic constraints AND political       │ ║
║  │  repression. Her somatic practices worked even when we      │ ║
║  │  couldn't afford ongoing talk therapy."                     │ ║
║  │  — NGO in Argentina (Dec 2024)                              │ ║
║  │                                                              │ ║
║  │  💬 "Maria was changed by our work together—not just        │ ║
║  │  'expert helping broken clients.' She brought practices,    │ ║
║  │  we brought context, and we co-created healing rituals      │ ║
║  │  that fit our community."                                   │ ║
║  │  — Grassroots collective in Brazil (Nov 2024)              │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
║  ┌──────────────────────────────────────────────────────────────┐ ║
║  │  Practical Details                                           │ ║
║  │                                                              │ ║
║  │  ✅ Currently accepting new clients                         │ ║
║  │  💰 Sliding scale available (Global South rates)            │ ║
║  │  🌍 Languages: Portuguese, Spanish, English                 │ ║
║  │  📧 Contact: maria.santos@example.com                       │ ║
║  │  🔗 Website: marialiberationpsych.com                       │ ║
║  │                                                              │ ║
║  │  [   Copy Email   ]    [   Visit Website   ]               │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
║  ┌──────────────────────────────────────────────────────────────┐ ║
║  │  📝 After you work with Maria, please close the gratitude   │ ║
║  │  loop! Your feedback helps other organizations find the     │ ║
║  │  right match.                                                │ ║
║  │                                                              │ ║
║  │  We'll remind you in 2 weeks 🫶🏼                             │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

**Design Notes:**
- **Bio in first person**: "I work with..." (humanizes, not clinical)
- **Context-specific recommendations**: Not "5 stars", actual experiences
- **"She was changed by our work"**: Yazmany's value (mutual transformation)
- **Sliding scale visible**: Economic context matters (Rukudzo's value)
- **Gratitude loop prompt**: Primes org to remember to thank later
- **pao's emoji**: 🫶🏼 at end of reminder (warmth, not demand)

---

## FLOW 3: Closing a Gratitude Loop

### Goals:
- Org remembers to thank (system prompts, doesn't rely on memory)
- Thanking feels meaningful (not perfunctory checkbox)
- Coach receives notification (off-platform, via email)
- Future orgs benefit (recommendation becomes searchable)

### Wireframe: Gratitude Dashboard

```
╔════════════════════════════════════════════════════════════════════╗
║  🌊 Springboard     [Search] [Alerts: 2] [Profile ▼]  [Logout]   ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  Your Gratitude Loops                                             ║
║                                                                    ║
║  ┌──────────────────────────────────────────────────────────────┐ ║
║  │  You've received help from 3 people in the last month.       │ ║
║  │  2 loops are still open—closing them helps the network! 🙏   │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
║  ┌─────────────────  Open Loops (2)  ─────────────────────────┐ ║
║  │                                                               │ ║
║  │  ┌──────────────────────────────────────────────────────────┐│ ║
║  │  │  Dr. Maria Santos (Coach)                                ││ ║
║  │  │  You contacted her on Jan 20, 2025 (15 days ago)        ││ ║
║  │  │                                                          ││ ║
║  │  │  How did it go? Share your experience:                  ││ ║
║  │  │  ┌────────────────────────────────────────────────────┐ ││ ║
║  │  │  │ Maria helped us name the moral injury we felt     │ ││ ║
║  │  │  │ after our DEI program was defunded. Her somatic   │ ││ ║
║  │  │  │ practices were powerful...                        │ ││ ║
║  │  │  │                                                    │ ││ ║
║  │  │  │                                                    │ ││ ║
║  │  │  └────────────────────────────────────────────────────┘ ││ ║
║  │  │                                                          ││ ║
║  │  │  Would you recommend Maria for:                         ││ ║
║  │  │  ☑ Moral injury                                         ││ ║
║  │  │  ☑ Political crisis                                     ││ ║
║  │  │  ☐ Burnout                                              ││ ║
║  │  │  ☐ Grief                                                ││ ║
║  │  │                                                          ││ ║
║  │  │  Add emoji (optional): 🙏 💗 🫶🏼 ✨ 🌊 [+ more...]      ││ ║
║  │  │                                                          ││ ║
║  │  │  🔒 Your feedback helps match future orgs, but your     ││ ║
║  │  │  identity stays private (shown as "University in [Region]")││
║  │  │                                                          ││ ║
║  │  │  [  Send Thanks & Close Loop  ]   [  Skip for now  ]   ││ ║
║  │  └──────────────────────────────────────────────────────────┘│ ║
║  │                                                               │ ║
║  │  ┌──────────────────────────────────────────────────────────┐│ ║
║  │  │  "Trauma-Informed Pedagogy" (Research by Mays)          ││ ║
║  │  │  You downloaded on Jan 18, 2025 (17 days ago)          ││ ║
║  │  │                                                          ││ ║
║  │  │  Did you implement this research?                       ││ ║
║  │  │  ⚪ Yes, and I want to share what worked                ││ ║
║  │  │  ⚪ Yes, but not ready to share yet                     ││ ║
║  │  │  ⚪ Not yet, still reading                              ││ ║
║  │  │  ⚪ No, wasn't relevant to our context                  ││ ║
║  │  │                                                          ││ ║
║  │  │  [  Share Implementation Report  ]   [  Close Loop  ]  ││ ║
║  │  └──────────────────────────────────────────────────────────┘│ ║
║  │                                                               │ ║
║  └───────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
║  ┌─────────────────  Closed Loops (1)  ────────────────────────┐ ║
║  │                                                               │ ║
║  │  ✅ Ubuntu Leadership Training (Youth Resource)              │ ║
║  │  Thanked on Jan 16, 2025                                     │ ║
║  │  Your feedback: "Helped us launch program after SEL cuts"   │ ║
║  │                                                               │ ║
║  └───────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

**Design Notes:**
- **Open loops prominent**: Top of page (gentle pressure to complete)
- **Two types of loops**: Coach (text + checkboxes) vs Research (implementation report)
- **Emoji picker**: Deborah's value (gratitude as practice, not just text)
- **Privacy reassurance**: "Identity stays private" (reduces fear of exposure)
- **"Skip for now" option**: pao's value (no guilt, just reminder)
- **Closed loops visible**: Positive reinforcement (you did it!)

---

### Wireframe: After Closing Loop (Confirmation)

```
╔════════════════════════════════════════════════════════════════════╗
║  🌊 Springboard     [Search] [Alerts: 2] [Profile ▼]  [Logout]   ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  ┌──────────────────────────────────────────────────────────────┐ ║
║  │                                                              │ ║
║  │                 ✨ Gratitude Loop Closed! ✨                  │ ║
║  │                                                              │ ║
║  │  Your thanks has been sent to Dr. Maria Santos.             │ ║
║  │                                                              │ ║
║  │  Your feedback will help other organizations find the       │ ║
║  │  right coach for their context. 🙏                           │ ║
║  │                                                              │ ║
║  │  [  Return to Dashboard  ]                                  │ ║
║  │                                                              │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

**Design Notes:**
- **Celebration**: ✨ emoji (positive reinforcement)
- **Social benefit stated**: "Helps other organizations" (values beyond self)
- **Clear next step**: Return to dashboard (not stuck on success page)

---

## FLOW 4: Responding to Political Alert

### Goals:
- Org learns about threat without panic
- Understands adversary logic (Lyndon's value)
- Accesses protective measures (what worked for others)
- Can share own protective measures back

### Wireframe: Political Alerts Dashboard

```
╔════════════════════════════════════════════════════════════════════╗
║  🌊 Springboard     [Search] [Alerts: 2] [Profile ▼]  [Logout]   ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  Political Environment Alerts                                     ║
║                                                                    ║
║  ┌──────────────────────────────────────────────────────────────┐ ║
║  │  ⚠️  These alerts help you prepare, not panic.               │ ║
║  │                                                              │ ║
║  │  We track policy shifts that may affect wellbeing work in   │ ║
║  │  higher education. Each alert includes:                     │ ║
║  │  • What happened (factual summary)                          │ ║
║  │  • Why it's happening (adversary logic)                     │ ║
║  │  • What's worked (protective measures from other orgs)      │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
║  ┌─────────  Alerts for Your Context (2 new)  ─────────────────┐ ║
║  │                                                               │ ║
║  │  ⚠️  HIGH PRIORITY                                           │ ║
║  │  DEI Program Defunding - [Your Region]                       │ ║
║  │  Posted: Jan 22, 2025                                        │ ║
║  │                                                               │ ║
║  │  What happened:                                              │ ║
║  │  State legislature passed bill eliminating DEI funding for   │ ║
║  │  public universities. Takes effect March 1, 2025.            │ ║
║  │                                                               │ ║
║  │  Adversary logic (why they're doing this):                   │ ║
║  │  They see DEI as "indoctrination" creating "woke" voters.    │ ║
║  │  Quote from bill sponsor: "Universities should educate,      │ ║
║  │  not advocate." Strategy: Frame as neutrality, not harm.     │ ║
║  │                                                               │ ║
║  │  Protective measures (what's worked):                        │ ║
║  │  • 3 universities reframed DEI as "student success" (passed)│ ║
║  │  • 2 moved programs to private foundation funding          │ ║
║  │  • 1 renamed "Cultural Competence" (less targeted)         │ ║
║  │                                                               │ ║
║  │  [  View Full Alert  ]    [  Share Your Response  ]         │ ║
║  │                                                               │ ║
║  ├───────────────────────────────────────────────────────────────┤ ║
║  │                                                               │ ║
║  │  ⚠️  MEDIUM PRIORITY                                         │ ║
║  │  Federal Research Funding Delays                             │ ║
║  │  Posted: Jan 20, 2025                                        │ ║
║  │                                                               │ ║
║  │  What happened:                                              │ ║
║  │  NIH/NSF grants delayed 3-6 months for "review." Affects    │ ║
║  │  social science, mental health research.                     │ ║
║  │                                                               │ ║
║  │  Adversary logic: (click to expand)                          │ ║
║  │  Protective measures: (click to expand)                      │ ║
║  │                                                               │ ║
║  │  [  View Full Alert  ]                                       │ ║
║  │                                                               │ ║
║  └───────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
║  ┌─────────────  Other Recent Alerts  ──────────────────────────┐ ║
║  │  (List of older alerts for different regions/contexts)       │ ║
║  └───────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

**Design Notes:**
- **Reassurance first**: "Prepare, not panic" (Lyndon's framing)
- **Three-part structure**: What / Why / What Worked (clear, actionable)
- **Adversary logic explicit**: Not "evil people," but "here's their strategy"
- **Protective measures concrete**: Specific tactics, not vague "resist"
- **Priority levels**: HIGH/MEDIUM (not red/yellow—less panic-inducing)
- **"Share Your Response"**: Crowdsource wisdom, close loop

---

### Wireframe: Full Alert View

```
╔════════════════════════════════════════════════════════════════════╗
║  🌊 Springboard     [Search] [Alerts: 2] [Profile ▼]  [Logout]   ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  ← Back to Alerts                                                 ║
║                                                                    ║
║  ⚠️  DEI Program Defunding - [Your Region]                        ║
║  Posted: Jan 22, 2025 | Priority: HIGH                           ║
║                                                                    ║
║  ┌──────────────────  What Happened  ──────────────────────────┐ ║
║  │                                                               │ ║
║  │  On January 20, 2025, [State] legislature passed HB 1234     │ ║
║  │  eliminating state funding for Diversity, Equity, and        │ ║
║  │  Inclusion programs at public universities.                  │ ║
║  │                                                               │ ║
║  │  Key details:                                                │ ║
║  │  • Takes effect: March 1, 2025                               │ ║
║  │  • Affects: All public universities in [State]               │ ║
║  │  • Penalty: Loss of 10% state funding if non-compliant      │ ║
║  │  • Scope: DEI offices, training, hiring practices           │ ║
║  │                                                               │ ║
║  │  Source: [Link to bill text] [Link to news article]         │ ║
║  └───────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
║  ┌─────────────  Adversary Logic (Why This Is Happening) ───────┐ ║
║  │                                                               │ ║
║  │  Understanding their strategy helps you respond effectively. │ ║
║  │                                                               │ ║
║  │  Their frame:                                                │ ║
║  │  "DEI programs are political indoctrination that create      │ ║
║  │  'woke' activists instead of educating students. We need     │ ║
║  │  viewpoint neutrality."                                      │ ║
║  │                                                               │ ║
║  │  Their goal:                                                 │ ║
║  │  Reduce diversity initiatives across all institutions,       │ ║
║  │  starting with public universities (most vulnerable to       │ ║
║  │  funding threats).                                           │ ║
║  │                                                               │ ║
║  │  Quote from bill sponsor (May Mailman):                      │ ║
║  │  "The glorification of victimhood is ultimately bad for      │ ║
║  │  Western civilization. Universities should teach skills,     │ ║
║  │  not activism."                                              │ ║
║  │                                                               │ ║
║  │  Wider pattern:                                              │ ║
║  │  Similar bills passed in 8 states in past year. Spreading   │ ║
║  │  rapidly through model legislation.                          │ ║
║  │                                                               │ ║
║  │  📖 Learn more: [Link to Lyndon's analysis article]         │ ║
║  └───────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
║  ┌─────────  Protective Measures (What's Worked)  ──────────────┐ ║
║  │                                                               │ ║
║  │  From 5 universities that navigated similar threats:         │ ║
║  │                                                               │ ║
║  │  ✅ Strategy 1: Reframe as "Student Success"                │ ║
║  │  • University A renamed DEI office "Student Success Center" │ ║
║  │  • Kept same staff, same work, different branding           │ ║
║  │  • Result: Bill sponsor agreed "student success isn't DEI"  │ ║
║  │  • Risk: Can feel like capitulation, demoralizing           │ ║
║  │                                                               │ ║
║  │  ✅ Strategy 2: Move to Private Foundation                  │ ║
║  │  • University B spun off DEI to affiliated nonprofit        │ ║
║  │  • No state funds = bill doesn't apply                      │ ║
║  │  • Result: Program survives, but access may reduce          │ ║
║  │  • Risk: Creates two-tier system (rich schools keep it)     │ ║
║  │                                                               │ ║
║  │  ✅ Strategy 3: Legal Challenge                             │ ║
║  │  • University C sued, claiming First Amendment violation    │ ║
║  │  • Result: TBD (case pending)                               │ ║
║  │  • Risk: Expensive, may lose, retaliation from legislature  │ ║
║  │                                                               │ ║
║  │  ⚠️  Strategy that DIDN'T work:                             │ ║
║  │  • University D tried "quiet resistance" (ignored bill)     │ ║
║  │  • Result: Lost 10% state funding, forced compliance        │ ║
║  │                                                               │ ║
║  └───────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
║  ┌─────────────  Share Your Response  ───────────────────────────┐║
║  │                                                               │ ║
║  │  If your organization is responding to this threat, please   │ ║
║  │  share what you're trying. It helps others prepare.          │ ║
║  │                                                               │ ║
║  │  [  Add Your Strategy  ]  (opens form)                       │ ║
║  │                                                               │ ║
║  │  🔒 Your identity stays private unless you choose to share  │ ║
║  └───────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

**Design Notes:**
- **Lyndon's three-part structure**: What / Why / What Worked
- **Adversary logic WITH quote**: Not speculation, actual words
- **Multiple strategies**: Not prescriptive, shows options + tradeoffs
- **Failed strategy visible**: Learn from mistakes too
- **Crowdsource wisdom**: "Share Your Response" closes loop
- **Privacy toggle**: Can share anonymously or publicly

**Key UX Decision**:
- ❓ Should "Share Your Response" be separate page or inline form?
- **Recommendation**: Separate page (reduces intimidation, can save drafts)

---

---

## FLOW 5: Uploading Research with Protocol

### Goals:
- Org shares research (builds collective knowledge)
- Protocol honoring is mandatory, not optional (Mala's value)
- Tagging is easy (not bureaucratic)
- Research becomes searchable WITH context

### Wireframe: Upload Research

```
╔════════════════════════════════════════════════════════════════════╗
║  🌊 Springboard     [Search] [Alerts: 2] [Profile ▼]  [Logout]   ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  Share Research                                                   ║
║                                                                    ║
║  ┌──────────────────────────────────────────────────────────────┐ ║
║  │  📚 Help the network by sharing research that's been useful  │ ║
║  │  to you. Your contribution helps others find relevant work.  │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
║  ┌──────────────────  Basic Information  ──────────────────────┐ ║
║  │                                                              │ ║
║  │  Title:                                                      │ ║
║  │  [_______________________________________________]           │ ║
║  │                                                              │ ║
║  │  Author(s):                                                  │ ║
║  │  [_______________________________________________]           │ ║
║  │                                                              │ ║
║  │  Publication Date:                                           │ ║
║  │  [____] / [____] / [________]  (MM / DD / YYYY)            │ ║
║  │                                                              │ ║
║  │  Source/Publisher:                                           │ ║
║  │  [_______________________________________________]           │ ║
║  │                                                              │ ║
║  │  Upload PDF:                                                 │ ║
║  │  [  Choose File  ]  No file chosen                          │ ║
║  │  (Max 25 MB)                                                 │ ║
║  │                                                              │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
║  ┌──────────────  Indigenous & Traditional Knowledge  ──────────┐ ║
║  │                                                              │ ║
║  │  🌊 Does this research involve Indigenous or traditional    │ ║
║  │  knowledge? (Check all that apply)                          │ ║
║  │                                                              │ ║
║  │  ☐ Yes, Indigenous knowledge                                │ ║
║  │  ☐ Yes, traditional/ancestral practices                     │ ║
║  │  ☐ Yes, sacred/ceremonial content                           │ ║
║  │  ☐ No, Western/academic research only                       │ ║
║  │                                                              │ ║
║  │  ─────────────────────────────────────────────────────────  │ ║
║  │  IF YES:                                                     │ ║
║  │                                                              │ ║
║  │  Which culture(s)/people(s)?                                │ ║
║  │  [_______________________________________________]           │ ║
║  │  Example: Maori, Lakota, Yoruba, Aboriginal Australian     │ ║
║  │                                                              │ ║
║  │  Who should be contacted before adapting this work?         │ ║
║  │  [_______________________________________________]           │ ║
║  │  Example: Dr. [Name], [Organization], [email]              │ ║
║  │                                                              │ ║
║  │  What acknowledgment/protocol is required?                  │ ║
║  │  ┌────────────────────────────────────────────────────────┐│ ║
║  │  │ Please contact [Knowledge Keeper] before adapting.     ││ ║
║  │  │ Credit must include: [Culture name] + [Practice name]. ││ ║
║  │  │ Ceremonial content not for commercial use.             ││ ║
║  │  │                                                         ││ ║
║  │  └────────────────────────────────────────────────────────┘│ ║
║  │                                                              │ ║
║  │  💡 Why we ask: We honor origin protocols to prevent        │ ║
║  │  extraction and whitewashing. This protects knowledge       │ ║
║  │  keepers and maintains relationships. — Mala Kapadia        │ ║
║  │                                                              │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
║  ┌─────────────────  Topics & Tags  ────────────────────────────┐ ║
║  │                                                              │ ║
║  │  What is this research about? (Select all that apply)       │ ║
║  │                                                              │ ║
║  │  ☐ Burnout               ☐ Moral injury                     │ ║
║  │  ☐ Trauma-informed care  ☐ Contemplative pedagogy           │ ║
║  │  ☐ Political crisis      ☐ Ecological grief                 │ ║
║  │  ☐ Youth development     ☐ Liberation psychology            │ ║
║  │  ☐ Collective healing    ☐ Somatic practices                │ ║
║  │                                                              │ ║
║  │  Context/Region:                                             │ ║
║  │  ☐ Global South  ☐ US  ☐ Europe  ☐ MENA  ☐ Asia-Pacific    │ ║
║  │                                                              │ ║
║  │  Add custom tags:                                            │ ║
║  │  [__________________]  [+ Add]                              │ ║
║  │                                                              │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
║  ┌──────────────  Your Implementation (Optional)  ──────────────┐ ║
║  │                                                              │ ║
║  │  Have you implemented this research in your context?        │ ║
║  │  Sharing what worked helps others adapt it effectively.     │ ║
║  │                                                              │ ║
║  │  Context where you used it:                                 │ ║
║  │  [_______________________________________________]           │ ║
║  │  Example: "Political crisis, Bangladesh, university shutdown"│ ║
║  │                                                              │ ║
║  │  What worked:                                                │ ║
║  │  ┌────────────────────────────────────────────────────────┐│ ║
║  │  │                                                         ││ ║
║  │  │                                                         ││ ║
║  │  └────────────────────────────────────────────────────────┘│ ║
║  │                                                              │ ║
║  │  What didn't work:                                           │ ║
║  │  ┌────────────────────────────────────────────────────────┐│ ║
║  │  │                                                         ││ ║
║  │  │                                                         ││ ║
║  │  └────────────────────────────────────────────────────────┘│ ║
║  │                                                              │ ║
║  │  How you honored protocol (if applicable):                  │ ║
║  │  ┌────────────────────────────────────────────────────────┐│ ║
║  │  │ We contacted the knowledge keeper, shared our findings ││ ║
║  │  │ back with the community, and credited properly.        ││ ║
║  │  └────────────────────────────────────────────────────────┘│ ║
║  │                                                              │ ║
║  │  [Skip for now]  (You can add implementation later)         │ ║
║  │                                                              │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
║  ┌──────────────────────────────────────────────────────────────┐ ║
║  │  🔒 Privacy: Your organization name will be visible to      │ ║
║  │  network members. Implementation details can be anonymous.  │ ║
║  │                                                              │ ║
║  │  [  Cancel  ]              [  Upload & Share Research  ]    │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

**Design Notes:**
- **Protocol section prominent**: Can't skip if Indigenous knowledge involved
- **Mala's quote inline**: "Why we ask" (values visible, not hidden in FAQ)
- **Implementation optional**: Reduces barrier to sharing (can add later)
- **Custom tags allowed**: System learns from community language
- **Privacy toggle**: Org name visible, implementation can be anonymous

---

### Wireframe: Research Download with Protocol Acknowledgment

```
╔════════════════════════════════════════════════════════════════════╗
║  🌊 Springboard     [Search] [Alerts: 2] [Profile ▼]  [Logout]   ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  ┌──────────────────────────────────────────────────────────────┐ ║
║  │                                                              │ ║
║  │  🌊 Protocol Acknowledgment Required                         │ ║
║  │                                                              │ ║
║  │  This research involves Indigenous knowledge and requires    │ ║
║  │  you to acknowledge origin protocols before downloading.     │ ║
║  │                                                              │ ║
║  │  ─────────────────────────────────────────────────────────  │ ║
║  │                                                              │ ║
║  │  Knowledge system: Maori healing practices                   │ ║
║  │                                                              │ ║
║  │  Protocol:                                                   │ ║
║  │  Please contact Dr. [Name] at [email] before adapting       │ ║
║  │  these practices to your context. Credit must include:       │ ║
║  │  "Maori healing traditions, shared by [Community name]."     │ ║
║  │  Ceremonial content not for commercial use.                  │ ║
║  │                                                              │ ║
║  │  ─────────────────────────────────────────────────────────  │ ║
║  │                                                              │ ║
║  │  ☐ I acknowledge this protocol and will honor it in my use  │ ║
║  │    of this research.                                         │ ║
║  │                                                              │ ║
║  │  ☐ I understand that violating protocol harms relationships │ ║
║  │    and perpetuates extraction/colonization.                  │ ║
║  │                                                              │ ║
║  │  🔒 This acknowledgment is tracked but your identity stays   │ ║
║  │  private. We track to show knowledge keepers their work is  │ ║
║  │  being honored, not to police you.                           │ ║
║  │                                                              │ ║
║  │  [  Cancel  ]           [  Acknowledge & Download  ]         │ ║
║  │                                                              │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

**Design Notes:**
- **Modal blocks download**: Can't skip (Mala's requirement)
- **Two checkboxes**: First = practical, second = moral reasoning
- **Privacy reassurance**: Tracked but anonymous (not punitive)
- **"Harms relationships"**: Not "it's illegal" (relational framing)

---

## FLOW 6: Taking Moral Injury Survey

### Goals:
- Org assesses structural wounds (not just burnout symptoms)
- Questions feel different (Mays' framing: "Where did you compromise?")
- Results show aggregate comparison (not individual diagnosis)
- Leads to contextual coach recommendations

### Wireframe: Survey Landing

```
╔════════════════════════════════════════════════════════════════════╗
║  🌊 Springboard     [Search] [Alerts: 2] [Profile ▼]  [Logout]   ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  Organizational Wellbeing Assessment                              ║
║                                                                    ║
║  ┌──────────────────────────────────────────────────────────────┐ ║
║  │  This assessment helps you understand where your             │ ║
║  │  organization may be experiencing structural harm—what       │ ║
║  │  we call "moral injury."                                     │ ║
║  │                                                              │ ║
║  │  This is different from burnout surveys. We're not asking:   │ ║
║  │  "Are you tired?" We're asking: "Where did your org have    │ ║
║  │  to compromise its ethical core to survive?"                 │ ║
║  │                                                              │ ║
║  │  — Inspired by Dr. Mays (HEARTH Iraqi)                       │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
║  ┌──────────────────  What You'll Get  ─────────────────────────┐ ║
║  │                                                              │ ║
║  │  ✅ Your organization's moral injury assessment              │ ║
║  │  ✅ Comparison to sector baseline (similar orgs, regions)    │ ║
║  │  ✅ Recommendations for coaches who work with moral injury   │ ║
║  │  ✅ Resources on "injury → renewal" pathways                 │ ║
║  │                                                              │ ║
║  │  🔒 Privacy: Your individual responses are NEVER accessible. │ ║
║  │  Only aggregate data (avg, min, max) is visible to you and  │ ║
║  │  sector-wide patterns to TWP for research.                   │ ║
║  │                                                              │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
║  ┌──────────────────────────────────────────────────────────────┐ ║
║  │  Time: ~15 minutes                                           │ ║
║  │  Questions: 12 (mix of scales + open-ended)                 │ ║
║  │                                                              │ ║
║  │  You can save progress and return later 🫶🏼                  │ ║
║  │                                                              │ ║
║  │  [  Start Assessment  ]                                      │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

**Design Notes:**
- **Mays' framing front-and-center**: "Moral injury" not "burnout"
- **Privacy bold**: RLS policy explained in plain language
- **pao's care**: "Save progress and return later" 🫶🏼
- **Time estimate**: Respects people's capacity

---

### Wireframe: Survey Questions (Sample)

```
╔════════════════════════════════════════════════════════════════════╗
║  🌊 Springboard     [Search] [Alerts: 2] [Profile ▼]  [Logout]   ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  Organizational Wellbeing Assessment                              ║
║  Progress: [████████░░░░░░] Question 6 of 12                      ║
║                                                                    ║
║  ┌──────────────────────────────────────────────────────────────┐ ║
║  │  In the past year, has your organization had to compromise   │ ║
║  │  its ethical commitments to secure funding or avoid penalties?│
║  │                                                              │ ║
║  │  ⚪ No, we've maintained our commitments                      │ ║
║  │  ⚪ Rarely (1-2 times)                                        │ ║
║  │  ⚪ Sometimes (3-5 times)                                     │ ║
║  │  ⚪ Often (6+ times)                                          │ ║
║  │  ⚪ Constantly (it's the norm now)                            │ ║
║  │                                                              │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
║  ┌──────────────────────────────────────────────────────────────┐ ║
║  │  If you selected "Sometimes" or more, can you describe one   │ ║
║  │  example? (Optional, but helps us understand patterns)       │ ║
║  │                                                              │ ║
║  │  ┌────────────────────────────────────────────────────────┐ │ ║
║  │  │ We had to eliminate our DEI program to keep state      │ │ ║
║  │  │ funding. We believe in that work, but couldn't afford  │ │ ║
║  │  │ to lose 10% of our budget.                             │ │ ║
║  │  │                                                         │ │ ║
║  │  └────────────────────────────────────────────────────────┘ │ ║
║  │                                                              │ ║
║  │  🔒 Your text response is encrypted and only visible as     │ ║
║  │  anonymized themes in aggregate reports ("X% mentioned      │ ║
║  │  funding threats").                                          │ ║
║  │                                                              │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
║  [  ← Previous  ]    [  Skip Question  ]    [  Next →  ]         ║
║                                                                    ║
║  [  Save & Exit  ]  (Resume anytime from dashboard)              ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

**Design Notes:**
- **Mays' questions**: Not "Are you burned out?" but "Did you compromise?"
- **Scale + open-ended**: Quantitative (for baseline) + qualitative (for understanding)
- **Privacy per question**: Not just at start (builds trust throughout)
- **Skip option**: Reduces pressure (pao's care)
- **Save & exit**: Long surveys need this (accessibility)

---

### Wireframe: Survey Results

```
╔════════════════════════════════════════════════════════════════════╗
║  🌊 Springboard     [Search] [Alerts: 2] [Profile ▼]  [Logout]   ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  Your Organizational Wellbeing Assessment Results                 ║
║                                                                    ║
║  ┌──────────────────────────────────────────────────────────────┐ ║
║  │  Thank you for completing the assessment. Here's what we     │ ║
║  │  learned about your organization's wellbeing and how you     │ ║
║  │  compare to similar organizations.                           │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
║  ┌──────────────  Moral Injury Assessment  ──────────────────────┐║
║  │                                                              │ ║
║  │  Your Score: 6.8 / 10 (Moderate-High)                       │ ║
║  │  Sector Average: 5.2 / 10                                   │ ║
║  │  Similar Orgs (US public universities): 7.1 / 10            │ ║
║  │                                                              │ ║
║  │  [Chart: Bar graph showing you vs sector vs similar]        │ ║
║  │                                                              │ ║
║  │  What this means:                                            │ ║
║  │  Your organization is experiencing significant moral injury— │ ║
║  │  structural harm to your ethical core. This is HIGHER than  │ ║
║  │  the sector average but SIMILAR to other public universities │ ║
║  │  in the US facing political pressure.                        │ ║
║  │                                                              │ ║
║  │  This is not your fault. It's a systemic pattern.           │ ║
║  │                                                              │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
║  ┌─────────────  Key Patterns We See  ──────────────────────────┐ ║
║  │                                                              │ ║
║  │  Based on your responses:                                    │ ║
║  │                                                              │ ║
║  │  ⚠️  HIGH: Ethical compromises due to funding threats       │ ║
║  │  ⚠️  HIGH: Staff burnout from moral injury (not just work)  │ ║
║  │  🟡 MODERATE: Ability to name wounds openly                 │ ║
║  │  ✅ STRENGTH: Leadership acknowledges structural harm       │ ║
║  │                                                              │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
║  ┌──────────────  Recommended Next Steps  ───────────────────────┐║
║  │                                                              │ ║
║  │  🩺 Find a Coach                                            │ ║
║  │  We recommend coaches specializing in:                       │ ║
║  │  • Moral injury (not just burnout)                          │ ║
║  │  • Political crisis contexts                                │ ║
║  │  • Organizational trauma                                     │ ║
║  │                                                              │ ║
║  │  [  Search Coaches  ]  (pre-filtered for your needs)        │ ║
║  │                                                              │ ║
║  │  📚 Read Research                                           │ ║
║  │  • "Moral Injury in Higher Ed" by Dr. Mays                  │ ║
║  │  • "From Injury to Renewal" toolkit                         │ ║
║  │                                                              │ ║
║  │  [  Browse Resources  ]                                      │ ║
║  │                                                              │ ║
║  │  🤝 Connect with Similar Orgs                               │ ║
║  │  5 other organizations with similar profiles have           │ ║
║  │  successfully navigated renewal. Their implementation       │ ║
║  │  reports are available (anonymized).                         │ ║
║  │                                                              │ ║
║  │  [  View Case Studies  ]                                     │ ║
║  │                                                              │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
║  ┌──────────────────────────────────────────────────────────────┐ ║
║  │  📊 Download Full Report (PDF)                              │ ║
║  │  Share with leadership, board, or planning committee.        │ ║
║  │  [  Download Report  ]                                       │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

**Design Notes:**
- **"This is not your fault"**: Depathologizes (systemic, not individual)
- **Comparison to similar orgs**: Context matters (not just sector average)
- **Strengths visible**: Not just problems (asset-based)
- **CTAs contextual**: Pre-filtered coach search, relevant research
- **PDF export**: Leadership needs to share (board meetings, etc.)

---

## FLOW 7: Accessing Youth Resources

### Goals:
- Org finds alternatives to formal education (Lyndon's battle)
- Resources vetted (not random internet finds)
- Success stories visible (builds confidence)
- Can contribute new resources (crowdsourced)

### Wireframe: Youth Development Hub

```
╔════════════════════════════════════════════════════════════════════╗
║  🌊 Springboard     [Search] [Alerts: 2] [Profile ▼]  [Logout]   ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  Youth Development Resources                                      ║
║                                                                    ║
║  ┌──────────────────────────────────────────────────────────────┐ ║
║  │  As universities cut DEI, SEL, and wellbeing programs,       │ ║
║  │  youth development increasingly happens OUTSIDE formal        │ ║
║  │  education. These resources help you create alternative      │ ║
║  │  pathways for young people.                                  │ ║
║  │                                                              │ ║
║  │  — Based on analysis by Lyndon Rego (WHEN member)           │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
║  ┌──────────────  Browse by Type  ──────────────────────────────┐ ║
║  │                                                              │ ║
║  │  [🎓 Training Programs]  (Ubuntu, SEL alternatives...)       │ ║
║  │  [💰 Scholarships]  (Global South, first-gen students...)    │ ║
║  │  [🤝 Collaboration Models]  (Student research, podcasts...)  │ ║
║  │  [🗺️  Alternative Spaces]  (Where youth dev happens now)     │ ║
║  │                                                              │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
║  ┌───────────────  Featured Resources  ─────────────────────────┐ ║
║  │                                                              │ ║
║  │  ┌──────────────────────────────────────────────────────────┐│ ║
║  │  │  🎓 Ubuntu Leadership Academy                           ││ ║
║  │  │  Type: Training Program                                 ││ ║
║  │  │  Region: US (available globally)                        ││ ║
║  │  │                                                         ││ ║
║  │  │  Alternative to SEL programs being cut from US schools. ││ ║
║  │  │  Teaches: Empathy, inclusion, conflict resolution       ││ ║
║  │  │  through South African Ubuntu philosophy ("I am because ││ ║
║  │  │  we are").                                              ││ ║
║  │  │                                                         ││ ║
║  │  │  ✅ Used by 7 WHEN organizations                       ││ ║
║  │  │  💬 "Helped us launch program after DEI elimination"   ││ ║
║  │  │                                                         ││ ║
║  │  │  Contact: Lyndon Rego (lyndonrego@gmail.com)           ││ ║
║  │  │  Website: [Link to Ubuntu Leadership Network]          ││ ║
║  │  │                                                         ││ ║
║  │  │  [  View Details  ]    [  Share Success Story  ]       ││ ║
║  │  └──────────────────────────────────────────────────────────┘│ ║
║  │                                                              │ ║
║  │  ┌──────────────────────────────────────────────────────────┐│ ║
║  │  │  💰 PEC-PG Scholarship (Brazil)                         ││ ║
║  │  │  Type: Graduate Scholarship                             ││ ║
║  │  │  Region: Global South → Brazil                          ││ ║
║  │  │                                                         ││ ║
║  │  │  6 spots available for master's students from Global    ││ ║
║  │  │  South. Focus: Performing Arts, Education.              ││ ║
║  │  │                                                         ││ ║
║  │  │  Deadline: [Date]                                       ││ ║
║  │  │  Contact: Daniel Plá (daniel.pla@ufsm.br)              ││ ║
║  │  │                                                         ││ ║
║  │  │  [  View Details  ]    [  Apply  ]                     ││ ║
║  │  └──────────────────────────────────────────────────────────┘│ ║
║  │                                                              │ ║
║  │  ┌──────────────────────────────────────────────────────────┐│ ║
║  │  │  🤝 Student Trauma-Informed Podcast Model              ││ ║
║  │  │  Type: Collaboration Template                           ││ ║
║  │  │  Region: Adaptable                                      ││ ║
║  │  │                                                         ││ ║
║  │  │  Student Kaddyjatou Marong created podcast on trauma-   ││ ║
║  │  │  informed care for parents/teachers (with Dr. Mays).    ││ ║
║  │  │  Template shows how to co-create with students (not FOR ││ ║
║  │  │  them).                                                 ││ ║
║  │  │                                                         ││ ║
║  │  │  ✅ Used by 3 organizations                            ││ ║
║  │  │  💬 "Students led, we supported—powerful shift"        ││ ║
║  │  │                                                         ││ ║
║  │  │  [  View Template  ]    [  Listen to Podcast  ]        ││ ║
║  │  └──────────────────────────────────────────────────────────┘│ ║
║  │                                                              │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
║  ┌──────────────────────────────────────────────────────────────┐ ║
║  │  📌 Add a Resource                                          │ ║
║  │  Found a youth program that works? Share it with the network│ ║
║  │  [  Submit Resource  ]                                       │ ║
║  └──────────────────────────────────────────────────────────────┘ ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

**Design Notes:**
- **Lyndon's framing**: "Outside formal education" (names reality)
- **Four categories**: Training, scholarships, models, spaces
- **Real examples from WHEN**: Ubuntu (Lyndon), Brazil (Daniel), Podcast (Mays)
- **Success stories prominent**: "7 orgs use this" (social proof)
- **Crowdsourced**: "Submit Resource" (community curation)
- **Contact names visible**: Human connection (not impersonal platform)

---

## Summary of All 7 Flows

Now we have complete UX for:

✅ **Flow 1**: First login & onboarding (springboard mental model)
✅ **Flow 2**: Finding a coach (context over credentials)
✅ **Flow 3**: Closing gratitude loop (energy circulation)
✅ **Flow 4**: Political alert (prepare, not panic)
✅ **Flow 5**: Research upload with protocol (Mala's requirement)
✅ **Flow 6**: Moral injury survey (Mays' framing)
✅ **Flow 7**: Youth resources (Lyndon's battle)

---

## Summary of Key UX Decisions Needed

Before we continue, let's get clarity on these:

### **CRITICAL** (Need Aaron/Ale Input):

1. **Gratitude Loop Prominence**
   - Top of dashboard (gentle obligation) or middle (optional)?
   - **Recommendation**: TOP (completing loops = high value)

2. **Coach Email Visibility**
   - Show immediately or behind "View Profile" click?
   - **Recommendation**: Show immediately (reduces friction)

3. **Political Alert Curation**
   - Who writes these? (Lyndon? TWP staff? AI summary + human edit?)
   - **Recommendation**: Need budget clarity before deciding

4. **Mobile Strategy**
   - Responsive from day 1 or desktop-only pilot?
   - **Recommendation**: Desktop pilot (faster), mobile Phase 2

### **HIGH** (Can Decide as We Build):

5. **Empty State vs Examples**
   - First-time dashboard empty or pre-populated with sample data?
   - **Recommendation**: 2-3 example coaches/research (not empty, not overwhelming)

6. **Protocol Acknowledgment UX**
   - Checkbox? Modal? Digital signature?
   - **Recommendation**: Modal with full protocol text + checkbox (can't skip)

7. **Implementation Report Length**
   - Tweet-length? Paragraph? Full case study?
   - **Recommendation**: Optional structured form (Context / What Worked / Protocol Honored)

---

## Next Steps

**Option A: Continue Wireframing** (Flows 5-7)
- Research upload with protocol
- Moral injury survey
- Youth resources hub

**Option B: Get Feedback First**
- Show these 4 flows to Aaron, Ale
- Validate assumptions before continuing

**Option C: Jump to Visual Design**
- Take these wireframes → Create actual UI mockups
- (Would need Figma or similar)

**What do you want to do next?**
