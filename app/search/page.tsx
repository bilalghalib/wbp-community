import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

type SearchParams = {
  q?: string
}

export default async function SearchPage({
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
            You must be a member of an organization to search.
          </p>
          <Link href="/dashboard" className="mt-4 inline-block text-blue-600 hover:text-blue-500">
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const searchQuery = searchParams.q?.trim() || ''
  const hasSearch = searchQuery.length > 0

  // Search Research Documents
  let researchQuery = supabase
    .from('research_documents')
    .select(`
      id,
      title,
      description,
      tags,
      topics,
      created_at,
      organization:organizations(name, slug)
    `)
    .in('visibility_level', ['network', 'public'])
    .order('created_at', { ascending: false })
    .limit(10)

  if (hasSearch) {
    researchQuery = researchQuery.textSearch('tsv', searchQuery)
  }

  const { data: researchResults } = await researchQuery

  // Search Service Providers
  let providersQuery = supabase
    .from('service_providers')
    .select(`
      id,
      full_name,
      bio,
      specialties,
      location_city,
      location_region,
      recommendations:service_provider_recommendations(
        organization:organizations(name, slug)
      )
    `)
    .eq('is_visible', true)
    .order('full_name')
    .limit(10)

  if (hasSearch) {
    providersQuery = providersQuery.textSearch('tsv', searchQuery)
  }

  const { data: providerResults } = await providersQuery

  // Search Surveys (by title and description)
  let surveysQuery = supabase
    .from('surveys')
    .select(`
      id,
      title,
      description,
      version,
      created_at
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(10)

  if (hasSearch) {
    surveysQuery = surveysQuery.or(
      `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
    )
  }

  const { data: surveyResults } = await surveysQuery

  // Search Survey Deployments (active ones)
  const { data: userMemberships } = await supabase
    .from('organization_memberships')
    .select('organization_id')
    .eq('user_id', user.id)
    .eq('is_active', true)

  const orgIds = userMemberships?.map((m) => m.organization_id) || []

  let deploymentsQuery = supabase
    .from('survey_deployments')
    .select(`
      id,
      title,
      created_at,
      closes_at,
      organization:organizations(name, slug)
    `)
    .in('organization_id', orgIds)
    .order('created_at', { ascending: false })
    .limit(10)

  if (hasSearch) {
    deploymentsQuery = deploymentsQuery.ilike('title', `%${searchQuery}%`)
  }

  const { data: deploymentResults } = await deploymentsQuery

  const totalResults =
    (researchResults?.length || 0) +
    (providerResults?.length || 0) +
    (surveyResults?.length || 0) +
    (deploymentResults?.length || 0)

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
              <span className="ml-4 text-gray-700">Search</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <form
            action="/search"
            method="get"
            className="w-full max-w-2xl mx-auto"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                name="q"
                defaultValue={searchQuery}
                placeholder="Search resources, providers, surveys..."
                className="block w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <span className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Search
                </span>
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500 text-center">
              Search across resources, service providers, and surveys
            </p>
          </form>
        </div>

        {!hasSearch ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Search Everything</h2>
            <p className="text-gray-600">
              Enter a search term above to find resources, service providers, and surveys
            </p>
          </div>
        ) : (
          <>
            {/* Results Summary */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Search Results for &quot;{searchQuery}&quot;
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Found {totalResults} result{totalResults !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Research Results */}
            {researchResults && researchResults.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Resources ({researchResults.length})
                </h3>
                <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
                  {researchResults.map((doc: any) => (
                    <Link
                      key={doc.id}
                      href={`/research/${doc.id}`}
                      className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-base font-medium text-gray-900">{doc.title}</h4>
                          {doc.description && (
                            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                              {doc.description}
                            </p>
                          )}
                          <div className="mt-2 flex flex-wrap gap-2">
                            {doc.tags?.slice(0, 3).map((tag: string) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="ml-4 text-sm text-gray-500">
                          {doc.organization?.name || 'Unknown'}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Service Provider Results */}
            {providerResults && providerResults.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Service Providers ({providerResults.length})
                </h3>
                <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
                  {providerResults.map((provider: any) => (
                    <Link
                      key={provider.id}
                      href={`/service-providers/${provider.id}`}
                      className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-base font-medium text-gray-900">
                            {provider.full_name}
                          </h4>
                          {provider.bio && (
                            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                              {provider.bio}
                            </p>
                          )}
                          <div className="mt-2 flex flex-wrap gap-2">
                            {provider.specialties?.slice(0, 3).map((specialty: string) => (
                              <span
                                key={specialty}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                          {provider.location_city && (
                            <p className="mt-2 text-xs text-gray-500">
                              📍 {provider.location_city}
                              {provider.location_region && `, ${provider.location_region}`}
                            </p>
                          )}
                        </div>
                        <div className="ml-4 text-sm text-gray-500">
                          {provider.recommendations?.length > 0 && (
                            <span>
                              Recommended by {provider.recommendations.length} org
                              {provider.recommendations.length !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Survey Template Results */}
            {surveyResults && surveyResults.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Survey Templates ({surveyResults.length})
                </h3>
                <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
                  {surveyResults.map((survey: any) => (
                    <div
                      key={survey.id}
                      className="px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <h4 className="text-base font-medium text-gray-900">{survey.title}</h4>
                      {survey.description && (
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {survey.description}
                        </p>
                      )}
                      {survey.version && (
                        <p className="mt-2 text-xs text-gray-500">Version: {survey.version}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Survey Deployment Results */}
            {deploymentResults && deploymentResults.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Active Surveys ({deploymentResults.length})
                </h3>
                <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
                  {deploymentResults.map((deployment: any) => {
                    const org = Array.isArray(deployment.organization)
                      ? deployment.organization[0]
                      : deployment.organization
                    const isOpen = new Date(deployment.closes_at) > new Date()

                    return (
                      <Link
                        key={deployment.id}
                        href={`/surveys/respond/${deployment.id}`}
                        className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-base font-medium text-gray-900">
                              {deployment.title}
                            </h4>
                            <p className="mt-1 text-sm text-gray-500">
                              {org?.name || 'Unknown Organization'}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {isOpen ? (
                                <span className="text-green-600">Open</span>
                              ) : (
                                <span className="text-gray-500">Closed</span>
                              )}
                              {' • '}
                              Closes: {new Date(deployment.closes_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* No Results */}
            {totalResults === 0 && (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try different keywords or check your spelling
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

