
# Wellbeing Project “Hearth” App  
## Design Rationale & Research Notes (v0.1)

Audience: Aaron + Wellbeing Project core team (and any research partners).  
Purpose: Explain *why* we’re making certain design choices, grounded in evidence and in the values of the Wellbeing Project.

---

## 1. High-level Intent

We are **not** building a generic community platform.

We are building a **trusted resource layer** for the Wellbeing Project ecosystem – something people visit when they need support, connection, or a recommendation – that:

- Feels like a **hearth**, not a dashboard.
- Lightens the load on a few central people (“Who do you know…?” requests).
- Lets members **trust‑fall** into a wider movement: “When I lean back, this community has my back.”
- Respects people’s limited time and attention, using **tiny but meaningful touchpoints** over time instead of heavy forms.

The app should be:

> **A quiet memory and matchmaking layer for the ecosystem – not a new place where everyone has to “hang out”.**

---

## 2. Core Design Principles

These principles come from both Bilal’s values and the Wellbeing Project’s ethos.

1. **Generosity over extraction**  
   - Profiles and updates are framed as *gifts* (stories, practices, connections, time) – never as “complete your data so we can analyse you.”

2. **Relationships over artifacts**  
   - The most meaningful “data” comes from relationships (peer interviews, gratitude, introductions), not just self-entered fields.

3. **Trust-fall reliability over feature richness**  
   - Better to have a small number of functions that work every time (e.g. “find a therapist,” “find someone to talk to about X”) than a complex social platform.

4. **Paced realism over idealistic overload**  
   - No big, one-off, 45‑minute “profile assignment.”  
   - Instead: small steps that fit into real lives – especially seasonal micro check-ins and simple profiles.

5. **Embarrassment reduction & social safety**  
   - The system quietly helps people remember names, partners, kids, context – to reduce social anxiety, not increase exposure.

6. **Analogue texture in a digital shell**  
   - Photos, music, workshop artifacts, letters – the app honours what already happens in the Heart Summits and gatherings, rather than forcing everyone into rigid forms.

7. **Resource, not platform**  
   - The primary job of the app is to help people **find people and practices** – not to replace the WhatsApp groups, Zoom calls, or in-person circles.

---

## 3. Key Decisions & the Research Behind Them

Below are the main design decisions, each with a short “because research…” note.

### 3.1 Seasonal micro check-ins (3–4 per year)

**Design**  
- Members can **opt in** to receive short check-ins 3–4 times per year (via SMS, WhatsApp, or email).  
- Each check-in is:
  - 1 quick rating (e.g. “How resourced do you feel right now? 1–5”)  
  - Optional one-sentence reflection (“What’s most alive in your inner life this season?”)

**Why we’re doing this**  
- Research on **ecological momentary assessment (EMA)** and experience sampling shows that repeated, short assessments over time give a more realistic picture of wellbeing than big, one-off questionnaires – and are often better tolerated.  
- Studies on **participant burden** in EMA consistently find that **questionnaire length** is more harmful than moderate frequency: one or two items is usually fine; long surveys drive people away.  
- This matches our value of **paced realism** and keeps the check-ins feeling like a gift (“they remembered me”) rather than an exam.

**What this enables**  
- Each person gets a small **time-series** of how “resourced / stretched / overwhelmed” they feel across the year.  
- The Wellbeing Project can (if desired and consented) see **aggregated seasonal patterns** (e.g. “many in the ecosystem feel ‘wobbly’ this season”), without looking at individual trajectories.

---

### 3.2 Single-item or ultra-short scales (instead of big batteries)

**Design**  
- Seasonal check-ins use **1 core item** plus 0–1 optional extra items.  
- Example:  
  - “Right now I feel…” (1–5, from “grounded & resourced” to “overwhelmed / close to the edge”).  
  - Optional: “I feel I can access support if I need it” (agree–disagree).

**Why we’re doing this**  
- Large, multi-sample studies show that **single-item life satisfaction and happiness measures** can be surprisingly reliable and valid, correlating strongly with longer scales and behaving similarly across time and countries.  
- This means we can **keep questions tiny** and still have scientifically defensible signals for people like Richard Davidson’s team.  
- Fewer items respects attention and aligns with EMA best practices.

**What this enables**  
- Very low friction: people can respond in seconds.  
- We can still meaningfully talk about “changes in wellbeing” over time at both personal and aggregated levels.

---

### 3.3 Few, spaced pulses instead of frequent tracking

**Design**  
- Default: **3–4 pulses per year**, plus one gentle yearly profile refresh.  
- No weekly nagging unless someone explicitly opts into a more intensive track.

**Why we’re doing this**  
- Longitudinal wellbeing research shows that you can estimate *stable* aspects of wellbeing with **relatively few** repeated measures, as long as they’re not all taken in one emotional moment.  
- Digital mental health studies also show that too many prompts and too much “homework” drive dropout; our population is already busy and highly committed elsewhere.  
- We prefer **fewer, well-chosen touchpoints** that people actually engage with over years.

**What this enables**  
- People feel invited rather than harassed.  
- The data are still rich enough to see personal and collective shifts over time.

---

### 3.4 Keep forms very short; put depth into optional rituals

**Design**  
- Standard “profile” is intentionally simple:  
  - Who you are (identity, region, time zone).  
  - 2–3 **gifts / offers** you’d gladly give (e.g. “I can host a circle on X” or “I can talk your head off about Y”).  
  - 1–2 **current edges / needs**.  
  - A small **ways-of-being constellation** (“lived in me now” vs “growing into this”).  
- Deeper engagement happens in **optional rituals**:  
  - A yearly “Hearth Letter” (written or audio) for those who want it.  
  - Peer interviews where someone else mirrors your gifts back to you.  
  - Uploading photos or artifacts from gatherings.

**Why we’re doing this**  
- EMA and burden studies show that **long questionnaires** are experienced as heavy and reduce participation and data quality more than modestly increased frequency does.  
- Work comparing global, retrospective wellbeing reports to experiential or episode-based measures (e.g. Day Reconstruction Method) suggests that rich, narrative data are meaningful – but are best used as *occasional, intentional rituals*, not as standard intake for everyone.

**What this enables**  
- The **baseline experience is light** and accessible to everyone.  
- People who want depth and reflection have clear **opt-in pathways** that feel like sitting by a hearth, not filling out more admin.

---

### 3.5 Optional seasonal SMS / WhatsApp check-ins (opt-in only)

**Design**  
- At sign-up, members choose whether they want to receive seasonal reflections via SMS / WhatsApp / email.  
- Each message is a short, human-feeling note, e.g.:

> “Hearth check-in 🌱  
> Where is your inner life right now?  
> Reply with a number:  
> 1 – Grounded & resourced  
> 2 – Mostly okay, some edges  
> 3 – Wobbly / stretched  
> 4 – Overwhelmed / close to the edge  
> 5 – I don’t know / prefer not to say”

- Optional follow-up:  
  > “If you’d like, reply with one short sentence about what’s most alive for you. You can also skip.”

**Why we’re doing this**  
- Trials of simple **text-message / low-intensity digital interventions** show that gentle, periodic messages can support wellbeing and self-reflection, especially when they’re brief and easy to respond to, and not daily.  
- Our use is even lighter: the messages are primarily **check-in + reflection**, not therapy in themselves.

**What this enables**  
- People get **moments of rememberedness** (“they checked on me”) without the pressure of a full program.  
- The small time-series can gently update their profile and support self-understanding.

---

### 3.6 Aggregated, not individual analytics (for trust)

**Design**  
- Each person can see their **own** timeline and patterns.  
- The Wellbeing Project team sees **aggregated patterns only** by default – e.g. by season, and optionally by broad region.  
- Any use of individual-level data for outreach, matching, or research is **always opt-in and clearly communicated.**

**Why we’re doing this**  
- Reviews of digital mental health tools highlight **privacy and surveillance concerns** as serious risks to trust, uptake, and long-term engagement.  
- To support a “trust‑fall” with the community, we’d rather err on the side of **under‑using** data than over‑using it.

**What this enables**  
- The app feels like a **supportive memory**, not a monitoring system.  
- The Wellbeing Project can still sense the “temperature” of the field and adjust programming accordingly.

---

## 4. What the “Profile” Actually Is (in v1)

Putting this together, a v1 profile for a person in the ecosystem looks like:

1. **Presence & identity**
   - Name, pronouns (optional), photo.
   - City/region & time zone.
   - Primary organisation & role.

2. **Relational memory (embarrassment reduction)**
   - Optional: partner name; kids; “people I’d love you to remember in my life.”  
   - Who introduced me to the Wellbeing Project.  
   - “Someone in this network who recently supported my wellbeing and how” (builds gratitude + network-weaver visibility).

3. **Gifts / offers (resource-first)**
   - 2–3 things I’d gladly offer in the next 6–12 months, e.g.:  
     - “I can host an online circle about…”  
     - “I can speak for an hour about…”  
     - “I can help orient you in [place/context].”  
   - Format (call, in-person, email) + typical length.

4. **Current edges / needs**
   - 1–2 short statements of what I’m exploring / struggling with in my wellbeing, and what support I might seek.

5. **Ways-of-being constellation**
   - A small set of statements under:
     - “This feels lived in me now.”  
     - “I’m growing into this.”  
   - Some pre-curated (rest, boundaries, joy, receiving support, etc.), plus space to add my own.

6. **Light time-series**
   - Seasonal pulses stored in the background.  
   - Visible to me as a simple “seasons wheel” or line over time; visible to the org only in aggregate.

7. **Optional deeper layers**
   - Hearth Letters, peer interviews, artifacts (photos, music, workshop notes) – all strictly opt-in and framed as rituals, not requirements.

---

## 5. How This Serves Aaron’s Original Pain Points

**Aaron’s pain:**  
> “I’m tired of always answering ‘Who do you know…?’ and being the bottleneck for finding therapists / practitioners / people.”

How the Hearth app helps:

- **Self-serve, trusted directory**  
  - Members can search for therapists, facilitators, and peers by modality, language, region, ways-of-being, and offers – without going through Aaron each time.

- **Remembered relationships**  
  - The app quietly remembers who introduced whom, who has helped whom, and who has capacity – so stewardship is shared across the network, not sitting on one person’s shoulders.

- **Lightweight wellbeing sensing**  
  - Seasonal pulses and simple analytics give the team an honest feel for how the ecosystem is doing, without a heavy research burden on participants.

- **Aligned with research & values**  
  - The design choices are backed by current wellbeing and measurement research, and deeply aligned with the Wellbeing Project’s emphasis on inner work, trust, and care.

---

## 6. Open Questions for the Team

Some things we’ll still want to decide together:

1. **Exact pulse rhythm**  
   - 3 vs 4 pulses per year; aligning with event cycles or seasons.

2. **Which rituals to pilot first**  
   - Hearth Letter vs peer interviews vs artifacts – which is most realistic in year 1?

3. **How “deep” the organisational analytics should go**  
   - Start with seasonal aggregates and only later add regional breakdowns?

4. **How this links to organisational assessments (e.g. Davidson’s work)**  
   - Do we connect this layer loosely (e.g. through shared IDs) or tightly (e.g. integrated dashboards)?

This document is meant as a **starting point**: a way to show that the design is not random, but grounded in both **research** and **the hearth-like way of being** that the Wellbeing Project is inviting into the world.
