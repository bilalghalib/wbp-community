'use client'

import { useRouter } from 'next/navigation'
import { SPECIALTIES, MODALITIES, LANGUAGES } from '@/utils/constants/specialties'

type FilterProps = {
  currentFilters: {
    specialty?: string
    modality?: string
    language?: string
    location?: string
    accepting?: string
  }
}

export default function ProviderSearch({ currentFilters }: FilterProps) {
  const router = useRouter()

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams()

    // Keep existing filters
    Object.entries(currentFilters).forEach(([k, v]) => {
      if (v && k !== key) {
        params.set(k, v)
      }
    })

    // Add/update new filter
    if (value) {
      params.set(key, value)
    }

    router.push(`/service-providers?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/service-providers')
  }

  const hasActiveFilters = Object.values(currentFilters).some(v => v)

  return (
    <div className="bg-white rounded-lg shadow p-6 sticky top-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Location Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            placeholder="City or region"
            defaultValue={currentFilters.location || ''}
            onChange={(e) => {
              const value = e.target.value
              // Debounce would be better, but keeping simple for MVP
              if (value.length > 2 || value.length === 0) {
                handleFilterChange('location', value)
              }
            }}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Specialty Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specialty
          </label>
          <select
            value={currentFilters.specialty || ''}
            onChange={(e) => handleFilterChange('specialty', e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All specialties</option>
            {SPECIALTIES.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>

        {/* Modality Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modality
          </label>
          <select
            value={currentFilters.modality || ''}
            onChange={(e) => handleFilterChange('modality', e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All modalities</option>
            {MODALITIES.map((modality) => (
              <option key={modality} value={modality}>
                {modality}
              </option>
            ))}
          </select>
        </div>

        {/* Language Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            value={currentFilters.language || ''}
            onChange={(e) => handleFilterChange('language', e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All languages</option>
            {LANGUAGES.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>

        {/* Accepting Clients Filter */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={currentFilters.accepting === 'true'}
              onChange={(e) => handleFilterChange('accepting', e.target.checked ? 'true' : '')}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              Accepting new clients
            </span>
          </label>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Service providers are recommended by organizations in the Wellbeing Project network.
        </p>
      </div>
    </div>
  )
}
