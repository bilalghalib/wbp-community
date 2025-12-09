# Springboard Registry: Complete UX Design
**For Review with Aaron Tanaka & Ale Garza**
**Created**: January 24, 2025
**By**: Bilal (with Claude)

---

## Executive Summary

We've completed **full UX design** for the Springboard Registry pilot, grounded in:
- 10 community interviews (VALUES_CARDS_ANALYSIS.md)
- 979 WHEN WhatsApp messages (WHEN_CHAT_VALUES_ANALYSIS.md)
- Your springboard vision (not a platform, not social network)

**What's ready**: 7 complete user flows with ASCII wireframes
**What's needed**: Your decisions on 7 critical questions before we build

---

## The "Springboard" Metaphor in Action

**You said**: "It's not a platform. It's a springboard. You come there so you can spring off and do something else better."

**How we translated this to UX**:

✅ **Clear entry/exit points**: Dashboard shows "Recent Launches" (what you jumped into) + "Open Loops" (return to close)
✅ **No endless scroll**: Every page has action buttons ("Find Coach" → "Contact" → "Thank Later" → Done)
✅ **Return for refueling**: Political alerts, new research, gratitude reminders bring you back
✅ **NOT a hangout**: No chat, no social feed, no "What's everyone thinking?"

---

## The 7 Core User Flows

### **Flow 1: First Login & Onboarding** ⭐⭐⭐ (MOST CRITICAL)

**Goal**: Org understands what springboard IS (and isn't) in first 60 seconds

**Key Screens**:
1. Login (with security reassurance: "🔒 Your data is encrypted")
2. Welcome (explicit: "This is NOT a social network. This IS a springboard.")
3. Dashboard (3 sections):
   - **Your Activity**: Recent launches + open gratitude loops
   - **Network Activity**: Alerts (2 new) + new research + new coaches
   - **Quick Actions**: [Find Coach] [Browse Research] [Take Survey]

**Design Principle**: pao's "Coordination as Care"
- "No worries if you skip this" 🫶🏼
- Warm colors, helpful tone (not corporate demands)

---

### **Flow 2: Finding a Coach** ⭐⭐⭐

**Goal**: Match by context (political pressure + moral injury + Global South), not just "any therapist"

**Key Innovation**: Recommendations WITH context
- Not "5 stars ⭐⭐⭐⭐⭐"
- But "Helped us name moral injury after DEI defunding" (actual quote from org)

**Filters**:
- What are you dealing with? [Moral injury ▼]
- What's your context? [Political pressure ▼]
- Your region/culture? [Global South ▼]

**Coach Profile Shows**:
- Specialties (moral injury, burnout, trauma)
- Approach (liberation psychology, somatic healing)
- "I work well with..." (political crisis, economic constraints)
- **"Openness to change"**: Checkbox showing "I'm changed by clients" (Yazmany's value)

**Contact**: Email visible immediately (no booking system, no platform chat)

---

### **Flow 3: Closing Gratitude Loop** ⭐⭐

**Goal**: System prompts you to thank (doesn't rely on memory), thanking feels meaningful

**How it works**:
1. You contact Coach Maria on Jan 20
2. System tracks as "open loop"
3. Dashboard shows (Feb 3): "You haven't thanked Maria yet"
4. You click, write thank you + emojis 🙏💗🫶🏼 + check contexts where she helped
5. Maria gets email
6. Your recommendation becomes searchable for next org

**Why it matters**: Prevents "take take take" extraction, creates energy circulation (Deborah's value)

---

### **Flow 4: Political Alert** ⭐⭐

**Goal**: Know what's coming (DEI bans, funding threats) without panic

**Structure** (Lyndon's three-part framing):
1. **What happened**: DEI ban passed in [Your Region], takes effect March 1
2. **Adversary logic**: "They see DEI as 'woke indoctrination.' Quote: 'Glorification of victimhood is bad for civilization.'"
3. **Protective measures**: What worked for 5 other universities
   - Strategy 1: Reframed as "Student Success" (passed)
   - Strategy 2: Moved to private foundation (survives, but access reduced)
   - Strategy 3: Legal challenge (TBD, expensive, risky)
   - ⚠️ What DIDN'T work: Quiet resistance (lost 10% funding)

**Tone**: ⚠️ but not 🚨 (informative urgency, not red panic)

---

### **Flow 5: Research Upload with Protocol** ⭐⭐

**Goal**: Sharing research builds collective knowledge, Indigenous protocols honored (mandatory)

**Key Section**:
```
🌊 Does this research involve Indigenous or traditional knowledge?
☐ Yes, Indigenous knowledge
☐ Yes, traditional/ancestral practices
☐ No, Western/academic research only

IF YES:
- Which culture(s)? [Maori, Lakota, Yoruba...]
- Who should be contacted? [Knowledge keeper email]
- What acknowledgment required? [Free text: "Please contact X before adapting..."]

💡 Why we ask: "We honor origin protocols to prevent extraction and
whitewashing. This protects knowledge keepers and maintains relationships."
— Mala Kapadia
```

**Download Experience**:
- Modal blocks download until protocol acknowledged
- Two checkboxes:
  1. "I acknowledge this protocol and will honor it"
  2. "I understand violating protocol harms relationships and perpetuates extraction"
- 🔒 "Tracked but anonymous—not to police you, to show knowledge keepers their work is honored"

---

### **Flow 6: Moral Injury Survey** ⭐

**Goal**: Assess structural wounds (not just burnout symptoms)

**Key Difference** (Mays' framing):
- NOT: "Are you tired? Rate your exhaustion 1-10."
- BUT: "In the past year, has your organization had to compromise its ethical commitments to secure funding?"

**Results Screen**:
```
Your Score: 6.8 / 10 (Moderate-High)
Sector Average: 5.2 / 10
Similar Orgs (US public universities): 7.1 / 10

What this means:
Your organization is experiencing significant moral injury—structural harm to
your ethical core. This is HIGHER than sector average but SIMILAR to other
public universities facing political pressure.

This is not your fault. It's a systemic pattern.
```

**Next Steps**:
- [Search Coaches] (pre-filtered: "Moral injury + Political crisis")
- [Read Research]: "Moral Injury in Higher Ed" by Dr. Mays
- [View Case Studies]: 5 orgs with similar profiles navigated renewal

---

### **Flow 7: Youth Resources** ⭐

**Goal**: Alternatives to formal education (when universities cut DEI/SEL programs)

**Four Categories**:
- 🎓 Training Programs (Ubuntu Leadership Academy)
- 💰 Scholarships (PEC-PG Brazil, 6 spots for Global South)
- 🤝 Collaboration Models (Student trauma podcast template)
- 🗺️ Alternative Spaces (Where youth dev happens now)

**Example** (Ubuntu):
```
Ubuntu Leadership Academy
Type: Training Program
Region: US (available globally)

Alternative to SEL programs being cut from US schools. Teaches empathy,
inclusion, conflict resolution through South African Ubuntu philosophy.

✅ Used by 7 WHEN organizations
💬 "Helped us launch program after DEI elimination"

Contact: Lyndon Rego (lyndonrego@gmail.com)
[View Details] [Share Success Story]
```

---

## Values Embedded in UX

Every screen traces to specific community values:

| **Value** | **UX Manifestation** | **From Whom** |
|-----------|---------------------|--------------|
| Coordination as care | "No worries if you skip" 🫶🏼, warm tone | pao |
| Naming what's coming | Political alerts with adversary logic | Lyndon |
| Gratitude as practice | Emoji picker 🙏💗, dashboard prominence | Deborah |
| Protocol honoring | Modal blocks download until acknowledged | Mala |
| Moral injury framing | "Did you compromise?" not "Are you tired?" | Mays |
| Context over credentials | "Political pressure + Global South" filters | Multiple |
| Mutual transformation | "Openness to change" checkbox for coaches | Yazmany |
| Youth as battlefield | Resources hub "outside formal education" | Lyndon |

---

## 7 Critical Decisions You Need to Make

### **🔥 MUST DECIDE BEFORE BUILDING:**

**1. Gratitude Loop Placement**
- **Option A**: Top of dashboard (gentle obligation, high visibility)
- **Option B**: Middle (optional, less pressure)
- **Recommendation**: TOP (closing loops = high value, prevents extraction)

**2. Political Dashboard: Core or Optional?**
- **Option A**: Core feature in pilot (alerts visible in nav, dashboard)
- **Option B**: "Nice to have" for Phase 2
- **Recommendation**: CORE (WHEN shows hostile context is reality, not optional)
- **BUT**: Who curates content? (Lyndon? TWP staff? Budget?)

**3. Survey Tool: TWP-Managed or Org-Deployed?**
- **Option A**: TWP deploys survey, holds data, orgs receive results
- **Option B**: Orgs get tool to deploy themselves
- **Recommendation**: TWP-managed (fewer attack surfaces, consistent privacy)

**4. Security in Pilot or "Phase 2"?**
- **Option A**: Full encryption, RLS policies, org-not-individual login from day 1
- **Option B**: Start simple, harden later
- **Recommendation**: MUST BE DAY 1 (Columbia gave 160 names to feds—this is real risk)

---

### **🟡 CAN DECIDE AS WE BUILD:**

**5. Mobile Strategy**
- **Option A**: Responsive from day 1 (more dev time, better UX)
- **Option B**: Desktop-only pilot, mobile Phase 2 (faster, cheaper)
- **Recommendation**: DESKTOP pilot (faster, most orgs use desktop for work tools)

**6. Coach Email Visibility**
- **Option A**: Show email immediately in search results
- **Option B**: Require "View Profile" click first
- **Recommendation**: SHOW immediately (org already logged in = trusted, reduces friction)

**7. Protocol Acknowledgment UX**
- **Option A**: Two-checkbox modal (blocks download)
- **Option B**: Inline checkbox (easier to skip)
- **Recommendation**: MODAL (Mala's requirement, can't be optional)

---

## Budget & Timeline Implications

**Your note**: "There is a budget... non-profit rates"

**What "non-profit rates" can build**:

| **Phase** | **Scope** | **Hours** | **Cost** @ $75-100/hr |
|-----------|-----------|-----------|----------------------|
| **Phase 1A** | 10 orgs, 6 weeks, core features | ~270 hrs | $20-27K |
| **Phase 1B** | Feedback, iteration, RAG | ~100 hrs | $7-10K |
| **Phase 1C** | Scale to 30 orgs, all 7 flows | ~130 hrs | $10-13K |
| **TOTAL** | Full Phase 1 (16 weeks) | ~500 hrs | **$37-50K** |

**What's NOT included**:
- Content curation (political alerts, coach vetting, protocol tagging)
- White-hat security testing
- Design/UI mockups (assuming Tailwind defaults)
- Bilal's "rabbit hole" time (he tends to explore beyond scope 😅)

**Phase 1A Core Features** (Minimum Viable):
✅ Org-based auth (login, delegate mechanism, TWP admin view)
✅ Coach registry (context matching, recommendations, contact)
✅ Political dashboard (manual curation initially)
✅ Gratitude system (manual Padlet creation)
✅ Research repo (upload, protocol tagging, download)

**Deferred to 1B/1C**:
- Moral injury survey (can pilot with existing burnout baseline first)
- Youth resources hub (can start as "resources" page)
- RAG/AI search (test value before building)
- Protocol enforcement automation (manual checking initially)

---

## Next Steps (Your Choice)

### **Option 1: Green Light Phase 1A** 🚀
- Clarify budget ($25K for 1A only? Or $50K for full Phase 1?)
- Who curates political alerts? (In budget? Volunteer?)
- Start build next week (3 weeks to core features)

### **Option 2: Validate with WHEN Members First** 🔍
- Show wireframes to Lyndon, Mala, Mays
- Get feedback: "Would this actually help you?"
- Iterate UX, THEN build

### **Option 3: Visual Mockups Before Code** 🎨
- Take ASCII wireframes → Figma mockups
- See what it actually looks like
- User test with 3-5 orgs
- THEN build

---

## What We're Asking From You

**To move forward, we need**:

1. **Budget clarity**: $25K? $50K? Or something else?
2. **Political dashboard decision**: Core or optional? Who curates?
3. **Survey tool scope**: TWP-managed or org-deployed?
4. **Content curation plan**: Who writes alerts? Vets coaches? Tags protocols?
5. **Timeline pressure**: When do you need pilot launched? Q1? Q2?

**Without these, we can't**:
- Commit to fixed scope
- Estimate timeline accurately
- Start development confidently

---

## Why This Design Works

### **1. Values-First Process Actually Worked**

We didn't start with "Let's build a coach directory."
We started with: "What do Lyndon, Mala, Mays, Deepa, Justin, Barry, Rukudzo, Yazmany care about?"
Features emerged FROM values, not imposed ON them.

### **2. Aaron's Constraints Honored Throughout**

✅ NOT a social network (no cross-org messaging, no chat)
✅ NOT a platform (clear springboard in/out, no endless scroll)
✅ Privacy-first (RLS policies, encryption, org-not-individual login)
✅ Security baked in (not "phase 2")

### **3. WHEN Reality Integrated**

Your pilot will serve orgs navigating:
- DEI bans (political alerts)
- Moral injury (not just burnout surveys)
- Indigenous knowledge (protocol honoring)
- Youth program cuts (alternative resources)

If we built "simple coach directory," we'd miss what's actually happening.

---

## Documents You Can Review

All analysis/design docs saved in:
`/Users/bilalghalib/Projects/scripts/wbp-community/communityInterview/`

1. **VALUES_CARDS_ANALYSIS.md** - 5 individual interview CAPs
2. **WHEN_CHAT_VALUES_ANALYSIS.md** - 979 WhatsApp messages analyzed
3. **VALUES_AND_PRINCIPLES.md** - 10 core principles with quotes
4. **SPRINGBOARD_REDESIGN_FROM_WHEN.md** - How WHEN insights reshape your vision
5. **VX_TO_UX_PROCESS_REVIEW.md** - Process audit (what's working, what's missing)
6. **UX_WIREFRAMES_V1.md** - All 7 flows with ASCII wireframes
7. **AARON_PRESENTATION.md** - This document

---

## Let's Talk

**Bilal is ready to**:
- Walk through wireframes screen-by-screen
- Answer technical questions
- Revise based on your feedback
- Start Phase 1A if you're ready

**Bilal needs from you**:
- Budget/timeline clarity
- Content curation plan
- Decision on 7 critical questions above

**Suggested next meeting agenda**:
1. Review wireframes together (30 min)
2. Discuss critical decisions (20 min)
3. Clarify budget/content plan (10 min)
4. Decide: Build? Validate first? Mockups?

---

**Ready when you are.** 🌊

*P.S. About "responsive day 1" — that means the site works on phone/tablet/desktop from launch. We recommend desktop-only for pilot (faster/cheaper), but can do responsive if mobile access is critical for your pilot orgs.*
