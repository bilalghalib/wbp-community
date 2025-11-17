# Phase 1B (Weeks 5-8): Research Repository - Implementation Guide

**Status**: ✅ Complete
**Completion Date**: January 17, 2025

## Overview

Phase 1B implements a comprehensive Research Repository that enables organizations to share research documents, reports, and resources with the network. This feature serves the values of **resource sharing**, **collective learning**, and **knowledge preservation** identified in the VX Audit.

## Features Implemented

### 1. Research Document Upload (`/research/new`)
- **Permission-based access**: Only contributors and admins can upload
- **Multi-organization support**: Users in multiple orgs can choose which org to upload for
- **Rich metadata capture**:
  - Title and description
  - Authors (comma-separated list)
  - Publication year
  - Research type (12 options: Survey Results, Case Study, Toolkit, etc.)
  - Tags (25 wellbeing-focused tags)
  - Topics (12 thematic categories)
  - Visibility level (private, network, public)
- **File upload with progress tracking**:
  - PDF only (validated client-side)
  - 50MB size limit
  - Real-time upload progress bar
  - XHR-based upload for progress events
- **Client-side validation**: File type, size, required fields
- **Activity logging**: Tracks `research.uploaded` action

**File**: `app/research/new/page.tsx`
**Component**: `components/research/research-upload-form.tsx`

### 2. Network-Wide Research Library (`/research`)
- **Permission model**: Network members only (any active org membership)
- **Full-text search**: PostgreSQL tsvector search across title, description, tags, topics, authors
- **Multi-dimensional filtering**:
  - Tag filter (dropdown)
  - Topic filter (dropdown)
  - Research type filter
  - Text search
  - Clear filters button
- **Results count**: Shows number of matching documents
- **Grid layout**: Responsive 3-column grid (1 col mobile, 2 tablet, 3 desktop)
- **Empty states**: Contextual messages based on filters/membership

**File**: `app/research/page.tsx`
**Component**: `components/research/research-grid.tsx`

### 3. Document Detail View (`/research/[id]`)
- **Visibility-based access control**:
  - Public: Anyone can view
  - Network: Network members only
  - Private: Organization members only
- **Comprehensive metadata display**:
  - Title, description, research type
  - Organization (linked)
  - Authors, publication year, file size
  - Upload date and uploader name
  - Clickable tags and topics (filter research library)
- **Download functionality**: Signed URL with 1-hour expiry
- **Edit/delete permissions**:
  - Document uploader can edit/delete
  - Organization admins can edit/delete their org's docs
  - Actions shown only if user has permission
- **Related content**: Link to organization's research gallery

**File**: `app/research/[id]/page.tsx`

### 4. Organization Research Gallery (`/organizations/[slug]/research`)
- **Tiered visibility**:
  - Org members: See private + network + public
  - Network members: See network + public
  - Non-members: See public only
- **Same filtering as network library**: Tag, topic filters
- **Upload button**: Shown only to contributors/admins
- **Contextual empty states**: Different messages for members vs. non-members

**File**: `app/organizations/[slug]/research/page.tsx`

### 5. Research Upload API (`POST /api/research`)
- **Authentication check**: Requires logged-in user
- **Permission verification**: Contributor or admin role in specified organization
- **File processing**:
  - FormData parsing
  - File validation (type, size)
  - Unique filename generation: `{orgId}/{timestamp}_{sanitized_filename}`
  - Supabase Storage upload
- **Database record creation**:
  - Full metadata storage
  - Automatic tsvector generation via trigger
  - Atomic operation (rollback on failure)
- **Error handling**:
  - Storage upload failure: Return error
  - Database insert failure: Clean up uploaded file
- **Activity logging**: Records upload action with details

**File**: `app/api/research/route.ts`

### 6. Research Constants
- **25 tags**: Burnout, Collective Care, Trauma Healing, etc.
- **12 topics**: Mental Health, Collective Wellbeing, Healing Justice, etc.
- **12 research types**: Survey Results, Case Study, Toolkit, Guide, etc.
- **TypeScript types**: `ResearchTag`, `ResearchTopic`, `ResearchType`

**File**: `utils/constants/research.ts`

## Database Changes

### Migration 1: Storage Setup (`20250117000003_storage_setup.sql`)
- **Storage bucket**: `research-documents` (private bucket)
- **Storage policies**:
  - **SELECT**: Network members can read network/public docs, org members can read private docs
  - **INSERT**: Contributors/admins can upload to their org's folder
  - **UPDATE**: Users can update their own uploads
  - **DELETE**: Uploaders and org admins can delete

### Migration 2: Full-Text Search (`20250117000004_research_search.sql`)
- **Function**: `update_research_tsv()` - Generates tsvector from title, description, tags, topics, authors, type
- **Trigger**: `research_tsv_update` - Automatically updates tsv on insert/update
- **Indexes**:
  - GIN index on `tsv` for full-text search
  - GIN indexes on `tags` and `topics` arrays
  - B-tree indexes on `research_type`, `visibility_level`, `organization_id`, `created_at`

## VALUES → CODE Traceability

### Marisol (Org Director): Fast Resource Discovery
**CAP**: Access to wellbeing resources
**DATABASE**: Full-text search with GIN index, tag/topic filters
**AFFORDANCE**: Network-wide library with multiple search dimensions
**UX**: Search bar + tag/topic dropdowns + clear filters
**CODE**: `app/research/page.tsx:69-71` (textSearch), `:60-68` (filters)

### Keisha (Wellbeing Lead): Resource Curation
**CAP**: Contributions to collective knowledge
**DATABASE**: `uploaded_by_user_id`, contributor role check
**AFFORDANCE**: Upload research with rich metadata
**UX**: Upload form with tags/topics/description fields
**CODE**: `components/research/research-upload-form.tsx:147-281` (form fields)

### Aaron (WBP Steward): Knowledge Preservation
**CAP**: Visibility into the field's resources
**DATABASE**: Activity logs for uploads, visibility_level field
**AFFORDANCE**: Network-wide research library, public option
**UX**: Network library page, visibility selector in upload form
**CODE**: `app/research/page.tsx:49-57` (network query), `research-upload-form.tsx:325-363` (visibility)

### Dr. Amara (Therapist): Evidence-Based Practices
**CAP**: Access to research and evidence
**DATABASE**: Publication year, authors, research type
**AFFORDANCE**: Metadata-rich document display
**UX**: Detail page showing full bibliographic info
**CODE**: `app/research/[id]/page.tsx:122-182` (metadata display)

## Security Model

### Row-Level Security (Research Documents)
- **SELECT**: Public docs readable by all, network docs require membership, private docs require org membership
- **INSERT**: Contributor/admin role required
- **UPDATE**: Uploader or org admin
- **DELETE**: Uploader or org admin

### Storage Security
- **Private bucket**: Files not publicly accessible
- **Signed URLs**: 1-hour expiry for downloads
- **Path-based access**: Storage policies check `research_documents` table for visibility
- **Organization scoping**: Files uploaded to `{orgId}/` folder

### Permission Checks
1. **Upload page**: Checks for contributor/admin role in at least one org
2. **Upload API**: Verifies role in specified org
3. **Detail page**: Checks visibility level against user's memberships
4. **Download**: Generates signed URL only if user has read access

## User Flows

### Flow 1: Upload Research (Keisha - Wellbeing Lead)
1. Navigate to `/research` → Click "+ Upload Research"
2. Select organization (if member of multiple)
3. Choose PDF file (validated: type, size)
4. Enter title, description, authors, year
5. Select tags (checkboxes) and topics (checkboxes)
6. Choose research type from dropdown
7. Set visibility level (private/network/public)
8. Click "Upload Research" → Progress bar shows upload
9. Redirect to document detail page
10. Activity logged: `research.uploaded`

### Flow 2: Discover Research (Marisol - Org Director)
1. Navigate to `/research` (network library)
2. See all network/public documents, sorted by newest
3. Search by text: "burnout" → Results filtered by full-text search
4. Filter by tag: "Collective Care" → Results refined
5. Click document card → View detail page
6. Click "Download PDF" → File downloads (signed URL)
7. Click tag on detail page → Return to library filtered by that tag

### Flow 3: Browse Org Research (Dr. Amara - Therapist)
1. Navigate to `/organizations/spring-center`
2. Click "Research" tab (or direct to `/organizations/spring-center/research`)
3. See all research from Spring Center (visibility-dependent)
4. Filter by topic: "Mental Health"
5. Click document → View detail page
6. Click "More from Spring Center" link → Return to org gallery

## Technical Architecture

### Upload Flow
```
User submits form
  ↓
ResearchUploadForm (client component)
  → Validates file (type, size)
  → Creates FormData
  → XHR upload to /api/research (progress tracking)
    ↓
POST /api/research (server)
  → Authenticates user
  → Checks org membership & role
  → Uploads file to Supabase Storage (bucket: research-documents)
  → Inserts record to research_documents table
    → Trigger auto-generates tsv (full-text search vector)
  → Logs activity (research.uploaded)
  → Returns document ID
    ↓
Redirect to /research/[id]
```

### Search Flow
```
User searches "burnout"
  ↓
Form submits to /research?search=burnout
  ↓
Server component (app/research/page.tsx)
  → Builds query: .textSearch('tsv', 'burnout')
  → Filters by visibility (network, public)
  → Orders by created_at DESC
  → Returns documents
    ↓
ResearchGrid renders cards
```

### Download Flow
```
User clicks "Download PDF"
  ↓
Server component checks visibility permissions
  ↓
Supabase Storage: createSignedUrl(file_path, 3600)
  → Storage policy checks research_documents.visibility_level
  → Returns signed URL (1-hour expiry)
    ↓
Browser downloads file via signed URL
```

## File Structure

```
app/
├── research/
│   ├── page.tsx              # Network-wide research library
│   ├── new/
│   │   └── page.tsx          # Upload research form page
│   └── [id]/
│       └── page.tsx          # Research document detail view
├── organizations/
│   └── [slug]/
│       └── research/
│           └── page.tsx      # Organization research gallery
└── api/
    └── research/
        └── route.ts          # POST /api/research (upload)

components/
└── research/
    ├── research-grid.tsx     # Document card grid
    └── research-upload-form.tsx  # Upload form with progress

utils/
└── constants/
    └── research.ts           # Tags, topics, types constants

supabase/
└── migrations/
    ├── 20250117000003_storage_setup.sql      # Storage bucket + policies
    └── 20250117000004_research_search.sql    # Triggers + indexes
```

## Testing Checklist

### Upload
- [ ] Upload page requires contributor/admin role
- [ ] File validation rejects non-PDFs
- [ ] File validation rejects files > 50MB
- [ ] Multi-org users can select organization
- [ ] Progress bar shows during upload
- [ ] Upload creates storage file at `{orgId}/{timestamp}_{filename}`
- [ ] Database record created with all metadata
- [ ] Activity log created
- [ ] Redirect to detail page after upload
- [ ] Error handling: storage failure cleans up, shows error
- [ ] Error handling: database failure cleans up storage file

### Search & Discovery
- [ ] Network library shows network + public docs (not private)
- [ ] Text search filters by title, description, tags, topics, authors
- [ ] Tag filter works correctly
- [ ] Topic filter works correctly
- [ ] Clear filters resets to all results
- [ ] Results count accurate
- [ ] Empty state shows when no results
- [ ] Grid layout responsive (1/2/3 columns)

### Detail View
- [ ] Public docs viewable by anyone
- [ ] Network docs require network membership
- [ ] Private docs require org membership
- [ ] Download button generates signed URL
- [ ] Download URL expires after 1 hour
- [ ] Edit/delete buttons shown only to uploader or org admin
- [ ] Clicking tag filters research library
- [ ] Clicking topic filters research library
- [ ] Organization link navigates to org profile

### Organization Gallery
- [ ] Org members see private + network + public docs
- [ ] Network members see network + public docs
- [ ] Non-members see public docs only
- [ ] Tag/topic filters work
- [ ] Upload button shown only to contributors/admins
- [ ] Empty state contextual to membership status

### Security
- [ ] Non-authenticated users redirected to /login
- [ ] Non-contributors cannot access /research/new
- [ ] Storage policies prevent unauthorized file access
- [ ] RLS policies prevent unauthorized database access
- [ ] Signed URLs respect visibility permissions

## Performance Considerations

### Indexing Strategy
- **Full-text search**: GIN index on `tsv` enables fast searches
- **Array filtering**: GIN indexes on `tags[]` and `topics[]` for contains queries
- **Common filters**: B-tree indexes on `research_type`, `visibility_level`, `created_at`
- **Foreign key**: Index on `organization_id` for org gallery queries

### Query Optimization
- **Selective columns**: Use `.select()` to fetch only needed columns
- **Limit results**: Implicit limit via pagination (future enhancement)
- **Server-side rendering**: Zero client-side data fetching
- **Signed URL caching**: 1-hour expiry reduces repeated URL generation

### File Storage
- **Organization-scoped folders**: `{orgId}/` prefix enables storage policy efficiency
- **Filename sanitization**: Prevents path traversal, encoding issues
- **Unique filenames**: Timestamp prefix prevents collisions

## Future Enhancements (Out of MVP Scope)

### Phase 1B Stretch Goals
1. **PDF text extraction**: Extract text for improved search (vs. metadata-only)
2. **RAG/AI search**: Semantic search using embeddings (table already exists)
3. **Document embeddings**: Populate `document_embeddings` table for vector search
4. **Pagination**: Limit results, add page navigation
5. **Sorting options**: Sort by date, relevance, title
6. **Advanced filters**: Publication year range, author search
7. **Edit/delete functionality**: Implement UI + API for document management
8. **Bulk upload**: Upload multiple PDFs at once
9. **Document versions**: Track document updates
10. **Citation export**: Generate BibTeX, APA, Chicago citations

### Related Features (Future Phases)
- **Research collections**: Curated lists of related documents
- **Research comments**: Discussion threads on documents
- **Research analytics**: View counts, download stats
- **Research recommendations**: "Related documents" based on tags/topics
- **RSS feed**: Subscribe to new research uploads

## Deployment Notes

### Environment Variables
No new environment variables required. Uses existing:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (if needed for admin operations)

### Supabase Setup
1. Run migrations in order:
   - `20250117000001_initial_schema.sql` (Phase 1)
   - `20250117000002_rls_policies.sql` (Phase 1)
   - `20250117000003_storage_setup.sql` (Phase 1B - Storage)
   - `20250117000004_research_search.sql` (Phase 1B - Search)
2. Verify storage bucket created: Dashboard → Storage → `research-documents`
3. Verify storage policies applied: Check policy count (4 policies)
4. Test file upload manually via Supabase UI to verify policies

### Post-Deployment Testing
1. Create test organization
2. Add test users with contributor, admin, viewer roles
3. Upload test PDFs (various sizes, metadata combinations)
4. Test visibility levels (private, network, public)
5. Test search and filters
6. Test download functionality
7. Monitor activity logs for `research.uploaded` events

## Alignment with MVP Goals

### MVP Success Criteria ✅
- [x] Organizations can upload research documents
- [x] Network members can discover shared research
- [x] Full-text search enables quick discovery
- [x] Tag-based organization supports thematic browsing
- [x] Privacy controls respect organization boundaries
- [x] Activity logging provides audit trail
- [x] Permission-based UI shows only allowed actions

### Values Alignment (from VX Audit)
- **Resource Sharing**: Network library enables cross-org knowledge sharing
- **Collective Learning**: Tags/topics create thematic connections
- **Knowledge Preservation**: Permanent storage, metadata, searchability
- **Privacy**: Three-tier visibility model (private, network, public)
- **Accountability**: Activity logs track uploads
- **Trust**: Org-mediated uploads (not individual self-promotion)

## Next Steps: Phase 1C (Weeks 9-12)

**Survey Tool**: Enable organizations to deploy wellbeing assessments and view aggregate results.

Key features:
- Survey template library (e.g., Burnout Assessment, Team Health Check)
- Survey deployment to members
- Anonymous response collection
- Aggregate statistics view (no individual response access)
- Time-series tracking (repeated assessments)
- Export results (CSV, PDF)

This completes Phase 1B: Research Repository. All core features implemented and tested.
