'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RESEARCH_TAGS, RESEARCH_TOPICS, RESEARCH_TYPES } from '@/utils/constants/research'

type Organization = {
  id: string
  name: string
  slug: string
}

type Props = {
  userId: string
  organizations: Organization[]
}

export default function ResearchUploadForm({ userId, organizations }: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Form state
  const [organizationId, setOrganizationId] = useState(organizations[0]?.id || '')
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [publicationYear, setPublicationYear] = useState('')
  const [authors, setAuthors] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [researchType, setResearchType] = useState('')
  const [visibilityLevel, setVisibilityLevel] = useState<'private' | 'network'>('network')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      if (selectedFile.type !== 'application/pdf') {
        setError('Only PDF files are allowed')
        setFile(null)
        return
      }
      // Validate file size (max 50MB)
      if (selectedFile.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB')
        setFile(null)
        return
      }
      setFile(selectedFile)
      setError(null)
    }
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!file) {
      setError('Please select a PDF file to upload')
      return
    }
    if (!title.trim()) {
      setError('Please enter a title')
      return
    }
    if (!organizationId) {
      setError('Please select an organization')
      return
    }

    setIsSubmitting(true)
    setUploadProgress(0)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', title.trim())
      formData.append('description', description.trim())
      formData.append('organizationId', organizationId)
      formData.append('userId', userId)
      formData.append('visibilityLevel', visibilityLevel)

      if (publicationYear) {
        formData.append('publicationYear', publicationYear)
      }
      if (authors.trim()) {
        // Parse comma-separated authors
        const authorList = authors.split(',').map(a => a.trim()).filter(Boolean)
        formData.append('authors', JSON.stringify(authorList))
      }
      if (selectedTags.length > 0) {
        formData.append('tags', JSON.stringify(selectedTags))
      }
      if (selectedTopics.length > 0) {
        formData.append('topics', JSON.stringify(selectedTopics))
      }
      if (researchType) {
        formData.append('researchType', researchType)
      }

      // Upload with progress tracking
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100)
          setUploadProgress(progress)
        }
      })

      const uploadPromise = new Promise((resolve, reject) => {
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText))
          } else {
            reject(new Error(xhr.responseText || 'Upload failed'))
          }
        })
        xhr.addEventListener('error', () => reject(new Error('Network error')))
        xhr.open('POST', '/api/research')
        xhr.send(formData)
      })

      const result = await uploadPromise as { documentId: string }

      // Redirect to document page
      router.push(`/research/${result.documentId}`)
      router.refresh()
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Failed to upload research')
      setIsSubmitting(false)
      setUploadProgress(0)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Organization Selection */}
      {organizations.length > 1 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Organization *
          </label>
          <select
            value={organizationId}
            onChange={(e) => setOrganizationId(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          >
            {organizations.map(org => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          PDF Document *
        </label>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-medium
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          required
        />
        {file && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
          </p>
        )}
      </div>

      {/* Upload Progress */}
      {isSubmitting && uploadProgress > 0 && (
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Brief summary of the research and its relevance..."
        />
      </div>

      {/* Authors */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Authors
        </label>
        <input
          type="text"
          value={authors}
          onChange={(e) => setAuthors(e.target.value)}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Comma-separated: Jane Smith, John Doe"
        />
      </div>

      {/* Publication Year */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Publication Year
        </label>
        <input
          type="number"
          value={publicationYear}
          onChange={(e) => setPublicationYear(e.target.value)}
          min="1900"
          max={new Date().getFullYear()}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder={new Date().getFullYear().toString()}
        />
      </div>

      {/* Research Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Research Type
        </label>
        <select
          value={researchType}
          onChange={(e) => setResearchType(e.target.value)}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Select type...</option>
          {RESEARCH_TYPES.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {RESEARCH_TAGS.map(tag => (
            <label
              key={tag}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded px-2 py-1"
            >
              <input
                type="checkbox"
                checked={selectedTags.includes(tag)}
                onChange={() => toggleTag(tag)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{tag}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Topics */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Topics
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {RESEARCH_TOPICS.map(topic => (
            <label
              key={topic}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded px-2 py-1"
            >
              <input
                type="checkbox"
                checked={selectedTopics.includes(topic)}
                onChange={() => toggleTopic(topic)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{topic}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Visibility Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Visibility *
        </label>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              value="private"
              checked={visibilityLevel === 'private'}
              onChange={(e) => setVisibilityLevel(e.target.value as 'private')}
              className="border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Private</span>
              <p className="text-xs text-gray-500">Only visible to your organization</p>
            </div>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              value="network"
              checked={visibilityLevel === 'network'}
              onChange={(e) => setVisibilityLevel(e.target.value as 'network')}
              className="border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Network</span>
              <p className="text-xs text-gray-500">Visible to all organizations in the network</p>
            </div>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !file}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Uploading...' : 'Upload Research'}
        </button>
      </div>
    </form>
  )
}
