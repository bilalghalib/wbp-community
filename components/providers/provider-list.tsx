import Image from 'next/image'
import Link from 'next/link'

type Provider = {
  id: string
  full_name: string
  bio: string | null
  specialties: string[]
  modalities: string[]
  languages: string[]
  location_city: string | null
  location_region: string | null
  location_country: string | null
  offers_remote: boolean
  offers_in_person: boolean
  is_accepting_clients: boolean
  photo_url: string | null
  recommendations: {
    id: string
    relationship_note: string | null
    would_recommend_for: string[]
    organization: {
      name: string
      slug: string
    } | null
  }[]
}

export default function ProviderList({ providers }: { providers: Provider[] }) {
  return (
    <div className="space-y-4">
      {providers.map((provider) => (
        <Link
          key={provider.id}
          href={`/service-providers/${provider.id}`}
          className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
        >
          <div className="flex gap-6">
            {/* Photo */}
            <div className="flex-shrink-0">
              {provider.photo_url ? (
                <Image
                  src={provider.photo_url}
                  alt={provider.full_name}
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-3xl text-gray-400">
                    {provider.full_name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {provider.full_name}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                    {provider.location_city && provider.location_region && (
                      <span>
                        {provider.location_city}, {provider.location_region}
                      </span>
                    )}
                    {provider.offers_remote && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        Remote
                      </span>
                    )}
                    {provider.offers_in_person && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        In-person
                      </span>
                    )}
                  </div>
                </div>

                {/* Availability Badge */}
                {provider.is_accepting_clients ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Accepting clients
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    At capacity
                  </span>
                )}
              </div>

              {/* Bio excerpt */}
              {provider.bio && (
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {provider.bio}
                </p>
              )}

              {/* Specialties */}
              {provider.specialties.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {provider.specialties.slice(0, 4).map((specialty) => (
                    <span
                      key={specialty}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-100 text-purple-800"
                    >
                      {specialty}
                    </span>
                  ))}
                  {provider.specialties.length > 4 && (
                    <span className="text-xs text-gray-500">
                      +{provider.specialties.length - 4} more
                    </span>
                  )}
                </div>
              )}

              {/* Trust Signal - Recommended by */}
              {provider.recommendations.length > 0 && (
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-700">
                  <svg
                    className="h-5 w-5 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-medium">
                    Recommended by {provider.recommendations.length} organization
                    {provider.recommendations.length !== 1 ? 's' : ''}
                  </span>
                  {provider.recommendations.length > 0 && (
                    <span className="text-gray-500">
                      including {provider.recommendations[0].organization?.name}
                      {provider.recommendations.length > 1 &&
                        ` and ${provider.recommendations.length - 1} other${
                          provider.recommendations.length > 2 ? 's' : ''
                        }`}
                    </span>
                  )}
                </div>
              )}

              {/* Languages */}
              {provider.languages.length > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  Languages: {provider.languages.join(', ')}
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
