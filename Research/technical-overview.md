# Technical Overview - Wellbeing Project Resource

## Core Data Model

### User Profile (Main Entity)
```
Profile {
  id: uuid
  user_id: uuid (auth)
  created_at: timestamp
  updated_at: timestamp
  version: int (yearly snapshots)
  
  // Core Identity
  name: string
  pronouns: string
  photo_url: string
  bio: text (optional narrative)
  
  // Location & Networks
  primary_location: string (city/region)
  timezone: string
  experience_locations: array<string> (places they know well)
  
  // Gifts & Needs
  gifts: array<Gift>
  needs: array<Need>
  willing_for_call: boolean
  booking_url: string (Calendly, etc)
  
  // Ways of Being
  current_ways: array<string> (3-5 values/practices)
  growing_into: array<string> (growth edges)
  
  // Provenance
  introduced_by: string (name)
  introduction_story: text (brief)
  last_meaningful_connection: text (optional)
  
  // Organization
  organization: string
  colleagues: array<user_id> (invited connections)
  
  // Metadata
  communities: array<string> (WBP sub-communities)
  last_login: timestamp
  profile_complete: boolean
}

Gift {
  title: string
  description: text
  category: string (expertise/hosting/resource/other)
}

Need {
  description: text
  urgency: enum (low/medium/high)
  fulfilled: boolean
}
```

### History Tracking (Simple Versioning)
```
ProfileVersion {
  id: uuid
  profile_id: uuid
  version_number: int
  snapshot_date: timestamp
  snapshot_data: jsonb (full profile at that point)
  
  // Enables "how has this person grown" queries
}
```

### Peer Interview (Optional Feature)
```
Interview {
  id: uuid
  interviewee_id: uuid
  interviewer_id: uuid
  created_at: timestamp
  notes: text (interviewer's observations)
  gifts_surfaced: array<string>
  approved: boolean (interviewee must approve)
}
```

### Seasonal Check-in (Phase 2)
```
PulseCheck {
  id: uuid
  user_id: uuid
  sent_at: timestamp
  responded_at: timestamp
  responses: jsonb (question/answer pairs)
  season: enum (spring/summer/fall/winter)
  year: int
}
```

## Architecture Options

### Option 1: Minimal (Fastest Launch)
**Stack:** Airtable + Custom Form + Zapier  
**Timeline:** 2-4 weeks  
**Cost:** $50-100/month  
**Pros:** Fast, no code, easy updates  
**Cons:** Limited customization, not beautiful, scaling costs  

**Good if:** Testing concept, low budget, fast launch needed

---

### Option 2: Lightweight Custom (Recommended)
**Stack:** Next.js + Supabase + Resend (emails)  
**Timeline:** 6-8 weeks  
**Cost:** ~$300/month (hosting + email)  
**Pros:** Full control, beautiful UX, scales well, modern auth  
**Cons:** Requires developer, maintenance overhead  

**Good if:** Want this to last, care about experience, have budget

**Why this stack:**
- Next.js: Fast, modern, great for forms and profiles
- Supabase: Postgres + auth + real-time built-in
- Resend: Simple email API for seasonal pulses

---

### Option 3: Platform Hybrid
**Stack:** Mighty Networks + Custom Integration  
**Timeline:** 4 weeks (configuration)  
**Cost:** $100-400/month  
**Pros:** Community features included, less dev work  
**Cons:** Platform lock-in, less flexible, "just another platform" feel  

**Good if:** Actually want platform features (forums, events, etc)

---

## My Recommendation: Option 2 (Lightweight Custom)

### Phase 1 MVP: Core Directory
- Auth (email/password, maybe Google SSO)
- Profile form with all core fields
- Public directory (searchable/filterable)
- Simple admin panel for Aaron

**Features to skip in MVP:**
- Peer interviews (manual process first)
- Seasonal pulses (do manually via email first)
- AI anything
- Complex matching

### Phase 2: Rituals & Automation
- Automated seasonal check-ins
- Peer interview workflow
- Profile versioning/history view
- Member spotlights

### Tech Decisions

**Why Supabase over custom backend:**
- Built-in auth (saves 2 weeks)
- Row-level security (privacy by default)
- Real-time if we want it later
- Easy to migrate off if needed

**Why Next.js over React SPA:**
- Better SEO for public profiles
- Server actions for forms (simpler)
- Built-in API routes
- Vercel deployment (easy)

**Data privacy approach:**
- Opt-in for public visibility (per field)
- Default: visible only to logged-in members
- "Ways of being" private by default
- Admin can't see private fields

## Development Timeline (Realistic)

**Week 1-2:** Auth + basic profile form  
**Week 3-4:** Directory + search/filter  
**Week 5-6:** Polish + admin tools  
**Week 7-8:** Testing + bug fixes  

**Post-launch:** Monthly 5-10hr maintenance for features/support

## Critical Technical Questions

1. **Single sign-on needed?** (integrate with existing auth?)
2. **Email provider?** (for seasonal pulses - Resend vs Sendgrid vs Postmark)
3. **Image hosting?** (Cloudinary vs Supabase storage)
4. **Analytics?** (track usage without being creepy - PostHog? Plausible?)
5. **Mobile app or web-only?** (recommendation: web-only for MVP, responsive design)

---

*Tech choices optimized for: speed to launch, low maintenance, beautiful experience, privacy-first*
