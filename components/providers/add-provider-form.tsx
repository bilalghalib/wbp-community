'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SPECIALTIES, MODALITIES, LANGUAGES } from '@/utils/constants/specialties'
import PhotoUpload from './photo-upload'

type Organization = {
  id: string
  name: string
  slug: string
}

type Props = {
  userId: string
  organizations: Organization[]
  existingProvider?: any
  isEditing?: boolean
}

export default function AddProviderForm({ userId, organizations, existingProvider, isEditing = false }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    // Organization making recommendation
    organizationId: existingProvider?.added_by_organization_id || organizations[0]?.id || '',

    // Provider details
    full_name: existingProvider?.full_name || '',
    email: existingProvider?.email || '',
    phone: existingProvider?.phone || '',
    website_url: existingProvider?.website_url || '',
    photo_url: existingProvider?.photo_url || '',
    bio: existingProvider?.bio || '',
    specialties: existingProvider?.specialties || ([] as string[]),
    modalities: existingProvider?.modalities || ([] as string[]),
    languages: existingProvider?.languages || (['English'] as string[]),

    // Location
    location_city: existingProvider?.location_city || '',
    location_region: existingProvider?.location_region || '',
    location_country: existingProvider?.location_country || 'United States',
    timezone: existingProvider?.timezone || '',

    // Availability
    offers_remote: existingProvider?.offers_remote ?? true,
    offers_in_person: existingProvider?.offers_in_person ?? false,
    is_accepting_clients: existingProvider?.is_accepting_clients ?? true,

    // Recommendation details (not used in edit mode)
    relationship_note: '',
    would_recommend_for: [] as string[],
  })

  const handleArrayChange = (field: 'specialties' | 'modalities' | 'languages' | 'would_recommend_for', value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isEditing && existingProvider) {
        // Update existing provider
        const res = await fetch(`/api/service-providers/${existingProvider.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Failed to update provider')
        }

        // Redirect back to provider page
        router.push(`/service-providers/${existingProvider.id}`)
      } else {
        // Create new provider
        const res = await fetch('/api/service-providers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            userId,
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Failed to add provider')
        }

        // Redirect to the new provider's page
        router.push(`/service-providers/${data.providerId}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Organization Selection */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommending Organization</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Which organization are you recommending on behalf of?
          </label>
          <select
            value={formData.organizationId}
            onChange={(e) => setFormData({ ...formData, organizationId: e.target.value })}
            required
            className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Provider Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Dr. Jane Smith"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="jane@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              value={formData.website_url}
              onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="https://example.com"
            />
          </div>

          <PhotoUpload
            currentPhotoUrl={formData.photo_url}
            onPhotoChange={(url) => setFormData({ ...formData, photo_url: url })}
            userId={userId}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Brief description of their practice and approach..."
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              value={formData.location_city}
              onChange={(e) => setFormData({ ...formData, location_city: e.target.value })}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Oakland"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State/Region</label>
            <input
              type="text"
              value={formData.location_region}
              onChange={(e) => setFormData({ ...formData, location_region: e.target.value })}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="California"
            />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.offers_remote}
              onChange={(e) => setFormData({ ...formData, offers_remote: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Offers remote sessions</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.offers_in_person}
              onChange={(e) => setFormData({ ...formData, offers_in_person: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Offers in-person sessions</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_accepting_clients}
              onChange={(e) => setFormData({ ...formData, is_accepting_clients: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Currently accepting new clients</span>
          </label>
        </div>
      </div>

      {/* Specialties */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Specialties</h2>
        <p className="text-sm text-gray-600 mb-4">Select all that apply</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {SPECIALTIES.map((specialty) => (
            <label key={specialty} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.specialties.includes(specialty)}
                onChange={() => handleArrayChange('specialties', specialty)}
                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">{specialty}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Modalities */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Modalities & Approaches</h2>
        <p className="text-sm text-gray-600 mb-4">Select all that apply</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {MODALITIES.map((modality) => (
            <label key={modality} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.modalities.includes(modality)}
                onChange={() => handleArrayChange('modalities', modality)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{modality}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Languages</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {LANGUAGES.map((language) => (
            <label key={language} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.languages.includes(language)}
                onChange={() => handleArrayChange('languages', language)}
                className="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
              />
              <span className="ml-2 text-sm text-gray-700">{language}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Recommendation Details - Only show when creating new provider */}
      {!isEditing && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Recommendation (Optional)</h2>
          <p className="text-sm text-gray-700 mb-4">
            Share context about your organization's relationship with this provider. This helps others understand why you're recommending them.
          </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relationship Note
            </label>
            <textarea
              value={formData.relationship_note}
              onChange={(e) => setFormData({ ...formData, relationship_note: e.target.value })}
              rows={3}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="e.g., 'Worked with our team for 6 months on burnout recovery. Culturally responsive, trauma-informed approach.'"
            />
            <p className="mt-1 text-xs text-gray-500">
              Visible to other organizations as a trust signal
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Would Recommend For (select from specialties above)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {formData.specialties.map((specialty) => (
                <label key={specialty} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.would_recommend_for.includes(specialty)}
                    onChange={() => handleArrayChange('would_recommend_for', specialty)}
                    className="h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{specialty}</span>
                </label>
              ))}
            </div>
            {formData.specialties.length === 0 && (
              <p className="text-sm text-gray-500 italic">
                Select specialties above first
              </p>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Submit */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.push('/service-providers')}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? (isEditing ? 'Saving...' : 'Adding Provider...')
            : (isEditing ? 'Save Changes' : 'Add Provider')}
        </button>
      </div>
    </form>
  )
}
