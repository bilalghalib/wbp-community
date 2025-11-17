import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'

export default async function ProviderDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch provider with recommendations
  const { data: provider, error } = await supabase
    .from('service_providers')
    .select(`
      *,
      recommendations:service_provider_recommendations(
        id,
        relationship_note,
        would_recommend_for,
        created_at,
        organization:organizations(name, slug),
        recommended_by:users!service_provider_recommendations_recommended_by_user_id_fkey(full_name)
      )
    `)
    .eq('id', params.id)
    .eq('is_visible', true)
    .single()

  if (error || !provider) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <a href="/service-providers" className="text-sm text-gray-700 hover:text-gray-900">
              ← Back to providers
            </a>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex gap-6">
            {provider.photo_url ? (
              <img
                src={provider.photo_url}
                alt={provider.full_name}
                className="h-32 w-32 rounded-full object-cover"
              />
            ) : (
              <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-5xl text-gray-400">
                  {provider.full_name.charAt(0)}
                </span>
              </div>
            )}

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{provider.full_name}</h1>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                {provider.location_city && provider.location_region && (
                  <div className="flex items-center text-gray-600">
                    <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {provider.location_city}, {provider.location_region}
                  </div>
                )}

                {provider.offers_remote && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Remote sessions
                  </span>
                )}
                {provider.offers_in_person && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    In-person sessions
                  </span>
                )}
              </div>

              <div className="mt-4">
                {provider.is_accepting_clients ? (
                  <div className="flex items-center text-green-700">
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Accepting new clients</span>
                  </div>
                ) : (
                  <div className="flex items-center text-gray-600">
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Not accepting new clients at this time</span>
                  </div>
                )}
                {provider.availability_note && (
                  <p className="mt-1 text-sm text-gray-600">{provider.availability_note}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Trust Signals - Recommendations */}
        {provider.recommendations && provider.recommendations.length > 0 && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start">
              <svg className="h-6 w-6 text-yellow-600 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recommended by {provider.recommendations.length} organization
                  {provider.recommendations.length !== 1 ? 's' : ''}
                </h3>
                <p className="mt-1 text-sm text-gray-700">
                  These organizations have worked with {provider.full_name.split(' ')[0]} and recommend their services.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bio */}
        {provider.bio && (
          <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
              {provider.bio}
            </div>
          </div>
        )}

        {/* Specialties */}
        {provider.specialties && provider.specialties.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Specialties</h2>
            <div className="flex flex-wrap gap-2">
              {provider.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-purple-100 text-purple-800"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Modalities */}
        {provider.modalities && provider.modalities.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Modalities & Approaches</h2>
            <div className="flex flex-wrap gap-2">
              {provider.modalities.map((modality) => (
                <span
                  key={modality}
                  className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {modality}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {provider.languages && provider.languages.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Languages</h2>
            <div className="flex flex-wrap gap-2">
              {provider.languages.map((language) => (
                <span
                  key={language}
                  className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Recommendations */}
        {provider.recommendations && provider.recommendations.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h2>
            <div className="space-y-4">
              {provider.recommendations.map((rec: any) => (
                <div key={rec.id} className="border-l-4 border-yellow-400 pl-4 py-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      {rec.organization?.name || 'Organization'}
                    </span>
                    <span className="text-sm text-gray-500">
                      • {new Date(rec.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                    </span>
                  </div>
                  {rec.relationship_note && (
                    <p className="mt-1 text-sm text-gray-700">{rec.relationship_note}</p>
                  )}
                  {rec.would_recommend_for && rec.would_recommend_for.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs text-gray-600">Recommended for: </span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {rec.would_recommend_for.map((specialty: string) => (
                          <span
                            key={specialty}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact</h2>
          <div className="space-y-3">
            {provider.email && (
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${provider.email}`} className="text-blue-600 hover:text-blue-500">
                  {provider.email}
                </a>
              </div>
            )}
            {provider.phone && (
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${provider.phone}`} className="text-blue-600 hover:text-blue-500">
                  {provider.phone}
                </a>
              </div>
            )}
            {provider.website_url && (
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <a
                  href={provider.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-500"
                >
                  {provider.website_url}
                </a>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              Contact information is provided for direct outreach. Please mention you found them through the Wellbeing Project Springboard platform.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
