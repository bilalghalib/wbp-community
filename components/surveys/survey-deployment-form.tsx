'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SurveyTemplate } from '@/utils/constants/surveys'

type Organization = {
  id: string
  name: string
  slug: string
}

type Props = {
  userId: string
  organizations: Organization[]
  selectedTemplateId?: string
  templates: readonly SurveyTemplate[]
}

export default function SurveyDeploymentForm({
  userId,
  organizations,
  selectedTemplateId,
  templates,
}: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [organizationId, setOrganizationId] = useState(organizations[0]?.id || '')
  const [templateId, setTemplateId] = useState(selectedTemplateId || '')
  const [title, setTitle] = useState('')
  const [closesAt, setClosesAt] = useState('')

  // Set default title when template changes
  const handleTemplateChange = (newTemplateId: string) => {
    setTemplateId(newTemplateId)
    const template = templates.find(t => t.id === newTemplateId)
    if (template && !title) {
      setTitle(template.title)
    }
  }

  // Set default closing date (30 days from now)
  useState(() => {
    const defaultDate = new Date()
    defaultDate.setDate(defaultDate.getDate() + 30)
    setClosesAt(defaultDate.toISOString().split('T')[0])
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!templateId) {
      setError('Please select a survey template')
      return
    }
    if (!title.trim()) {
      setError('Please enter a title')
      return
    }
    if (!closesAt) {
      setError('Please set a closing date')
      return
    }

    const closingDate = new Date(closesAt)
    if (closingDate < new Date()) {
      setError('Closing date must be in the future')
      return
    }

    setIsSubmitting(true)

    try {
      const template = templates.find(t => t.id === templateId)
      if (!template) {
        throw new Error('Template not found')
      }

      const response = await fetch('/api/surveys/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId,
          templateId,
          title: title.trim(),
          closesAt: closingDate.toISOString(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to deploy survey')
      }

      // Redirect to deployment results page
      router.push(`/surveys/results/${data.deploymentId}`)
      router.refresh()
    } catch (err) {
      console.error('Deployment error:', err)
      setError(err instanceof Error ? err.message : 'Failed to deploy survey')
      setIsSubmitting(false)
    }
  }

  const selectedTemplate = templates.find(t => t.id === templateId)

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
            disabled={isSubmitting}
          >
            {organizations.map(org => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Template Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Survey Template *
        </label>
        <select
          value={templateId}
          onChange={(e) => handleTemplateChange(e.target.value)}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
          disabled={isSubmitting}
        >
          <option value="">Select a survey...</option>
          {templates.map(template => (
            <option key={template.id} value={template.id}>
              {template.title} ({template.estimatedMinutes} min, {template.questions.length} questions)
            </option>
          ))}
        </select>
        {selectedTemplate && (
          <p className="mt-2 text-sm text-gray-600">
            {selectedTemplate.description}
          </p>
        )}
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Deployment Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Q1 2025 Team Wellbeing Check"
          className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
          disabled={isSubmitting}
        />
        <p className="mt-1 text-xs text-gray-500">
          Members will see this title when they take the survey
        </p>
      </div>

      {/* Closing Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Closes On *
        </label>
        <input
          type="date"
          value={closesAt}
          onChange={(e) => setClosesAt(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
          disabled={isSubmitting}
        />
        <p className="mt-1 text-xs text-gray-500">
          Members can respond until this date
        </p>
      </div>

      {/* Survey Preview */}
      {selectedTemplate && (
        <div className="border-t pt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Survey Preview
          </h3>
          <div className="bg-gray-50 rounded-md p-4 space-y-3 max-h-96 overflow-y-auto">
            {selectedTemplate.questions.map((q, idx) => (
              <div key={q.id} className="text-sm">
                <p className="font-medium text-gray-700">
                  {idx + 1}. {q.text}
                  {q.required && <span className="text-red-500 ml-1">*</span>}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Type: {q.type}
                  {q.scale && ` (${q.scale.min}-${q.scale.max}${q.scale.minLabel ? `: ${q.scale.minLabel} to ${q.scale.maxLabel}` : ''})`}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-600">
            <strong>Scoring:</strong> {selectedTemplate.scoringInstructions}
          </p>
        </div>
      )}

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
          disabled={isSubmitting || !templateId}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Deploying...' : 'Deploy Survey'}
        </button>
      </div>
    </form>
  )
}
