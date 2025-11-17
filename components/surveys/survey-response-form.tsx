'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SurveyQuestion } from '@/utils/constants/surveys'

type Props = {
  deploymentId: string
  userId: string
  questions: SurveyQuestion[]
  templateId: string
}

export default function SurveyResponseForm({
  deploymentId,
  userId,
  questions,
  templateId,
}: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Store answers as { questionId: answer }
  const [answers, setAnswers] = useState<Record<string, any>>({})

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate required questions
    const missingRequired = questions
      .filter(q => q.required && !answers[q.id])
      .map(q => q.text)

    if (missingRequired.length > 0) {
      setError(`Please answer all required questions (${missingRequired.length} remaining)`)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/surveys/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deploymentId,
          answers,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit survey')
      }

      // Redirect to confirmation page
      router.push(`/surveys/respond/${deploymentId}/thanks`)
      router.refresh()
    } catch (err) {
      console.error('Submission error:', err)
      setError(err instanceof Error ? err.message : 'Failed to submit survey')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Questions */}
      {questions.map((question, index) => (
        <div key={question.id} className="border-b border-gray-200 pb-6 last:border-0">
          <label className="block text-sm font-medium text-gray-900 mb-3">
            {index + 1}. {question.text}
            {question.required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {/* Scale Question */}
          {question.type === 'scale' && question.scale && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{question.scale.minLabel || question.scale.min}</span>
                <span>{question.scale.maxLabel || question.scale.max}</span>
              </div>
              <div className="flex items-center space-x-2">
                {Array.from(
                  { length: question.scale.max - question.scale.min + 1 },
                  (_, i) => i + question.scale!.min
                ).map(value => (
                  <label
                    key={value}
                    className="flex-1 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={value}
                      checked={answers[question.id] === value}
                      onChange={() => handleAnswerChange(question.id, value)}
                      className="sr-only"
                      disabled={isSubmitting}
                    />
                    <div
                      className={`
                        border-2 rounded-md py-3 text-center font-medium transition-colors
                        ${answers[question.id] === value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400 text-gray-700'
                        }
                      `}
                    >
                      {value}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Multiple Choice Question */}
          {question.type === 'multiple_choice' && question.options && (
            <div className="space-y-2">
              {question.options.map(option => (
                <label
                  key={option}
                  className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={answers[question.id] === option}
                    onChange={() => handleAnswerChange(question.id, option)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    disabled={isSubmitting}
                  />
                  <span className="ml-3 text-sm text-gray-900">{option}</span>
                </label>
              ))}
            </div>
          )}

          {/* Yes/No Question */}
          {question.type === 'yes_no' && (
            <div className="flex space-x-4">
              {['Yes', 'No'].map(option => (
                <label
                  key={option}
                  className="flex-1 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={answers[question.id] === option}
                    onChange={() => handleAnswerChange(question.id, option)}
                    className="sr-only"
                    disabled={isSubmitting}
                  />
                  <div
                    className={`
                      border-2 rounded-md py-3 text-center font-medium transition-colors
                      ${answers[question.id] === option
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400 text-gray-700'
                      }
                    `}
                  >
                    {option}
                  </div>
                </label>
              ))}
            </div>
          )}

          {/* Text Question */}
          {question.type === 'text' && (
            <textarea
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              rows={4}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Your answer..."
              disabled={isSubmitting}
            />
          )}
        </div>
      ))}

      {/* Progress Indicator */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>
            {Object.keys(answers).length} / {questions.filter(q => q.required).length} required
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(Object.keys(answers).length / questions.filter(q => q.required).length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Survey'}
        </button>
      </div>
    </form>
  )
}
