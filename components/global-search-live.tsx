'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

type SearchResult = {
  research: Array<{
    id: string
    title: string
    description?: string
    organization?: { name: string; slug: string }
  }>
  providers: Array<{
    id: string
    full_name: string
    bio?: string
    specialties?: string[]
  }>
  surveys: Array<{
    id: string
    title: string
    description?: string
  }>
  deployments: Array<{
    id: string
    title: string
    organization?: { name: string; slug: string }
  }>
}

export default function GlobalSearchLive() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<SearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounced search
  useEffect(() => {
    if (searchTerm.length < 2) {
      setResults(null)
      setShowDropdown(false)
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/search/live?q=${encodeURIComponent(searchTerm)}`)
        if (response.ok) {
          const data = await response.json()
          setResults(data)
          setShowDropdown(true)
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsLoading(false)
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim().length > 0) {
      setShowDropdown(false)
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  const handleResultClick = (type: string, id: string) => {
    setShowDropdown(false)
    if (type === 'research') {
      router.push(`/research/${id}`)
    } else if (type === 'provider') {
      router.push(`/service-providers/${id}`)
    } else if (type === 'survey') {
      router.push(`/surveys`)
    } else if (type === 'deployment') {
      router.push(`/surveys/respond/${id}`)
    }
  }

  const totalResults =
    (results?.research?.length || 0) +
    (results?.providers?.length || 0) +
    (results?.surveys?.length || 0) +
    (results?.deployments?.length || 0)

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
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
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              if (e.target.value.length >= 2) {
                setShowDropdown(true)
              }
            }}
            onFocus={() => {
              if (searchTerm.length >= 2 && results) {
                setShowDropdown(true)
              }
            }}
            placeholder="Search resources, providers, surveys..."
            className="block w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          {isLoading && (
            <div className="absolute inset-y-0 right-0 pr-12 flex items-center">
              <svg
                className="animate-spin h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          )}
          <button
            type="submit"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <span className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Search
            </span>
          </button>
        </div>
      </form>

      {/* Dropdown Results */}
      {showDropdown && searchTerm.length >= 2 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto"
        >
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : totalResults === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No results found for &quot;{searchTerm}&quot;
            </div>
          ) : (
            <div className="py-2">
              {/* Research Results */}
              {results?.research && results.research.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
                    Resources
                  </div>
                  {results.research.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleResultClick('research', item.id)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-start gap-3"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <svg
                          className="h-5 w-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {item.title}
                        </div>
                        {item.description && (
                          <div className="text-xs text-gray-500 truncate mt-0.5">
                            {item.description}
                          </div>
                        )}
                        {item.organization && (
                          <div className="text-xs text-gray-400 mt-0.5">
                            {item.organization.name}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Provider Results */}
              {results?.providers && results.providers.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
                    Service Providers
                  </div>
                  {results.providers.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleResultClick('provider', item.id)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-start gap-3"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <svg
                          className="h-5 w-5 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {item.full_name}
                        </div>
                        {item.bio && (
                          <div className="text-xs text-gray-500 truncate mt-0.5">
                            {item.bio}
                          </div>
                        )}
                        {item.specialties && item.specialties.length > 0 && (
                          <div className="text-xs text-gray-400 mt-0.5">
                            {item.specialties.slice(0, 2).join(', ')}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Survey Results */}
              {results?.surveys && results.surveys.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
                    Survey Templates
                  </div>
                  {results.surveys.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleResultClick('survey', item.id)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-start gap-3"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <svg
                          className="h-5 w-5 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {item.title}
                        </div>
                        {item.description && (
                          <div className="text-xs text-gray-500 truncate mt-0.5">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Deployment Results */}
              {results?.deployments && results.deployments.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
                    Active Surveys
                  </div>
                  {results.deployments.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleResultClick('deployment', item.id)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-start gap-3"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <svg
                          className="h-5 w-5 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {item.title}
                        </div>
                        {item.organization && (
                          <div className="text-xs text-gray-400 mt-0.5">
                            {item.organization.name}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* View All Results Link */}
              {totalResults > 0 && (
                <div className="border-t border-gray-200 px-4 py-2">
                  <button
                    onClick={handleSubmit}
                    className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium text-center"
                  >
                    View all {totalResults} results →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <p className="mt-2 text-xs text-gray-500 text-center">
        Search across resources, service providers, and surveys
      </p>
    </div>
  )
}

