import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProviderSearch from '@/components/providers/provider-search'
import ProviderList from '@/components/providers/provider-list'

type SearchParams = {
  specialty?: string
  location?: string
  language?: string
  modality?: string
  accepting?: string
  search?: string
}

export default async function ServiceProvidersPage({
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
            You must be a member of an organization to view service providers.
          </p>
          <a href="/dashboard" className="mt-4 inline-block text-blue-600 hover:text-blue-500">
            Return to Dashboard
          </a>
        </div>
      </div>
    )
  }

  // Build query
  let query = supabase
    .from('service_providers')
    .select(`
      *,
      recommendations:service_provider_recommendations(
        id,
        relationship_note,
        would_recommend_for,
        organization:organizations(name, slug)
      )
    `)
    .eq('is_visible', true)
    .order('full_name')

  // Apply text search (full-text search using tsv)
  if (searchParams.search) {
    query = query.textSearch('tsv', searchParams.search)
  }

  // Apply filters
  if (searchParams.specialty) {
    query = query.contains('specialties', [searchParams.specialty])
  }
  if (searchParams.modality) {
    query = query.contains('modalities', [searchParams.modality])
  }
  if (searchParams.language) {
    query = query.contains('languages', [searchParams.language])
  }
  if (searchParams.location) {
    query = query.or(`location_city.ilike.%${searchParams.location}%,location_region.ilike.%${searchParams.location}%`)
  }
  if (searchParams.accepting === 'true') {
    query = query.eq('is_accepting_clients', true)
  }

  const { data: providers, error } = await query

  if (error) {
    console.error('Error fetching providers:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <a href="/dashboard" className="text-xl font-bold text-gray-900">
                Springboard
              </a>
              <span className="ml-4 text-gray-400">/</span>
              <span className="ml-4 text-gray-700">Service Providers</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Service Providers</h1>
          <p className="mt-2 text-gray-600">
            Find trusted therapists, coaches, and facilitators recommended by organizations in the network.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <ProviderSearch currentFilters={searchParams} />
          </aside>

          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                {providers?.length || 0} provider{providers?.length !== 1 ? 's' : ''} found
              </p>
              <a
                href="/service-providers/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                + Add Provider
              </a>
            </div>

            {providers && providers.length > 0 ? (
              <ProviderList providers={providers} />
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-500">
                  No providers found matching your filters.
                </p>
                <a
                  href="/service-providers"
                  className="mt-4 inline-block text-blue-600 hover:text-blue-500"
                >
                  Clear filters
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
