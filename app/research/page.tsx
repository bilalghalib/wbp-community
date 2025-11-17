import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ResearchGrid from '@/components/research/research-grid'

type SearchParams = {
  tag?: string
  topic?: string
  type?: string
  search?: string
}

export default async function ResearchLibraryPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check user is a network member
  const { data: membership } = await supabase
    .from('organization_memberships')
    .select('id')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single()

  if (!membership) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Restricted</h1>
          <p className="mt-2 text-gray-600">
            You must be a member of an organization to view research.
          </p>
          <Link href="/dashboard" className="mt-4 inline-block text-blue-600 hover:text-blue-500">
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  // Build query for network-shared and public research
  let query = supabase
    .from('research_documents')
    .select(`
      *,
      organization:organizations(name, slug)
    `)
    .in('visibility_level', ['network', 'public'])
    .order('created_at', { ascending: false })

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
  if (searchParams.search) {
    query = query.textSearch('tsv', searchParams.search)
  }

  const { data: documents, error } = await query

  if (error) {
    console.error('Error fetching research:', error)
  }

  // Get unique tags and topics from all documents for filter UI
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
              <Link href="/dashboard" className="text-xl font-bold text-gray-900">
                Springboard
              </Link>
              <span className="ml-4 text-gray-400">/</span>
              <span className="ml-4 text-gray-700">Research Library</span>
            </div>
            <Link
              href="/research/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              + Upload Research
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Research Library</h1>
          <p className="mt-2 text-gray-600">
            Explore research, reports, and resources shared by organizations in the network.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-64">
            <form action="/research" method="get">
              <input
                type="text"
                name="search"
                defaultValue={searchParams.search}
                placeholder="Search research..."
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </form>
          </div>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div>
              <select
                value={searchParams.tag || ''}
                onChange={(e) => {
                  const params = new URLSearchParams(searchParams as any)
                  if (e.target.value) {
                    params.set('tag', e.target.value)
                  } else {
                    params.delete('tag')
                  }
                  window.location.href = `/research?${params.toString()}`
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
                  const params = new URLSearchParams(searchParams as any)
                  if (e.target.value) {
                    params.set('topic', e.target.value)
                  } else {
                    params.delete('topic')
                  }
                  window.location.href = `/research?${params.toString()}`
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
          {(searchParams.tag || searchParams.topic || searchParams.type || searchParams.search) && (
            <Link
              href="/research"
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Clear filters
            </Link>
          )}
        </div>

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
              {searchParams.tag || searchParams.topic || searchParams.search
                ? 'Try adjusting your filters.'
                : 'Be the first to share research with the network.'}
            </p>
            <div className="mt-6">
              <Link
                href="/research/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                + Upload Research
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
