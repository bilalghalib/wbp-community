import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import ResearchGrid from '@/components/research/research-grid'

type PageProps = {
  params: { slug: string }
  searchParams: { tag?: string; topic?: string; type?: string }
}

export default async function OrganizationResearchPage({ params, searchParams }: PageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get organization
  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('id, name, slug')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single()

  if (orgError || !organization) {
    notFound()
  }

  // Check user's membership in this organization
  const { data: userMembership } = await supabase
    .from('organization_memberships')
    .select('id, role')
    .eq('user_id', user.id)
    .eq('organization_id', organization.id)
    .eq('is_active', true)
    .single()

  // Check if user is in any organization (for network access)
  const { data: anyMembership } = await supabase
    .from('organization_memberships')
    .select('id')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single()

  const isMember = !!userMembership
  const canUpload = userMembership && ['contributor', 'primary_admin', 'backup_admin'].includes(userMembership.role)

  // Build query - show based on visibility and membership
  let query = supabase
    .from('research_documents')
    .select(`
      *,
      organization:organizations(name, slug)
    `)
    .eq('organization_id', organization.id)
    .order('created_at', { ascending: false })

  // Filter by visibility
  if (isMember) {
    // Members can see private, network, and public
    query = query.in('visibility_level', ['private', 'network', 'public'])
  } else if (anyMembership) {
    // Network members can see network and public
    query = query.in('visibility_level', ['network', 'public'])
  } else {
    // Non-members can only see public
    query = query.eq('visibility_level', 'public')
  }

  // Apply filters
  if (searchParams.tag) {
    query = query.contains('tags', [searchParams.tag])
  }
  if (searchParams.topic) {
    query = query.contains('topics', [searchParams.topic])
  }
  if (searchParams.type) {
    query = query.eq('research_type', searchParams.type)
  }

  const { data: documents } = await query

  // Get unique tags and topics for filters
  const allTags = documents
    ? Array.from(new Set(documents.flatMap((d: any) => d.tags || [])))
    : []
  const allTopics = documents
    ? Array.from(new Set(documents.flatMap((d: any) => d.topics || [])))
    : []

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center">
              <Link href={`/organizations/${params.slug}`} className="text-sm text-gray-700 hover:text-gray-900">
                ← {organization.name}
              </Link>
            </div>
            {canUpload && (
              <Link
                href="/research/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                + Upload Research
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {organization.name} Research
          </h1>
          <p className="mt-2 text-gray-600">
            Research, reports, and resources shared by this organization
          </p>
        </div>

        {/* Filters */}
        {(allTags.length > 0 || allTopics.length > 0) && (
          <div className="mb-6 flex flex-wrap gap-4">
            {/* Tag Filter */}
            {allTags.length > 0 && (
              <div>
                <select
                  value={searchParams.tag || ''}
                  onChange={(e) => {
                    const urlParams = new URLSearchParams(searchParams as any)
                    if (e.target.value) {
                      urlParams.set('tag', e.target.value)
                    } else {
                      urlParams.delete('tag')
                    }
                    window.location.href = `/organizations/${params.slug}/research?${urlParams.toString()}`
                  }}
                  className="block rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All tags</option>
                  {allTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Topic Filter */}
            {allTopics.length > 0 && (
              <div>
                <select
                  value={searchParams.topic || ''}
                  onChange={(e) => {
                    const urlParams = new URLSearchParams(searchParams as any)
                    if (e.target.value) {
                      urlParams.set('topic', e.target.value)
                    } else {
                      urlParams.delete('topic')
                    }
                    window.location.href = `/organizations/${params.slug}/research?${urlParams.toString()}`
                  }}
                  className="block rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All topics</option>
                  {allTopics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Clear Filters */}
            {(searchParams.tag || searchParams.topic || searchParams.type) && (
              <Link
                href={`/organizations/${params.slug}/research`}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Clear filters
              </Link>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {documents?.length || 0} document{documents?.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Research Grid */}
        {documents && documents.length > 0 ? (
          <ResearchGrid documents={documents} />
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No research found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchParams.tag || searchParams.topic
                ? 'Try adjusting your filters.'
                : isMember
                ? 'Be the first to share research from your organization.'
                : 'This organization has not shared any research yet.'}
            </p>
            {canUpload && (
              <div className="mt-6">
                <Link
                  href="/research/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  + Upload Research
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
