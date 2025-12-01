'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Props = {
  currentPhotoUrl?: string | null
  onPhotoChange: (url: string) => void
  userId: string
}

export default function PhotoUpload({ currentPhotoUrl, onPhotoChange, userId }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(currentPhotoUrl || null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be less than 2MB')
      return
    }

    setError(null)
    setUploading(true)

    try {
      const supabase = createClient()

      // Create unique filename: userId/timestamp_originalname
      const timestamp = Date.now()
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const fileName = `${userId}/${timestamp}_${sanitizedName}`

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName)

      // Update preview and notify parent
      setPreview(publicUrl)
      onPhotoChange(publicUrl)
    } catch (err) {
      console.error('Error uploading photo:', err)
      setError(err instanceof Error ? err.message : 'Failed to upload photo')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onPhotoChange('')
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Profile Photo
      </label>

      <div className="flex items-start gap-4">
        {/* Preview */}
        {preview && (
          <div className="relative flex-shrink-0">
            <img
              src={preview}
              alt="Profile preview"
              className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              title="Remove photo"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Upload */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <label className="relative cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              <span>{uploading ? 'Uploading...' : preview ? 'Change Photo' : 'Upload Photo'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="sr-only"
              />
            </label>
            {preview && (
              <button
                type="button"
                onClick={handleRemove}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            JPG, PNG, or GIF. Max 2MB.
          </p>
          {error && (
            <p className="mt-1 text-xs text-red-600">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
