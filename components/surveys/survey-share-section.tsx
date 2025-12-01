'use client'

import { useState } from 'react'

type Props = {
  deploymentId: string
  surveyTitle: string
}

export default function SurveyShareSection({ deploymentId, surveyTitle }: Props) {
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [emails, setEmails] = useState('')
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  const surveyUrl = `${window.location.origin}/surveys/respond/${deploymentId}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(surveyUrl)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleSendEmails = async () => {
    setIsSending(true)
    try {
      const emailList = emails.split(',').map(e => e.trim()).filter(Boolean)

      if (emailList.length === 0) {
        alert('Please enter at least one email address')
        setIsSending(false)
        return
      }

      const response = await fetch('/api/surveys/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deploymentId,
          emails: emailList,
          message: message.trim() || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send invitations')
      }

      const result = await response.json()

      // Show appropriate message based on whether email is configured
      if (result.note) {
        alert(`${result.message}\n\nNote: ${result.note}\n\nFor now, share the survey link manually with your invitees.`)
      } else {
        alert(`Invitations sent to ${emailList.length} email(s)!`)
      }

      setEmails('')
      setMessage('')
      setShowEmailForm(false)
    } catch (error) {
      console.error('Error sending invitations:', error)
      alert('Failed to send invitations. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Share Survey
          </h3>
          <p className="text-sm text-gray-600">
            Invite people to respond to this survey
          </p>
        </div>
        <a
          href={surveyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Take Survey
        </a>
      </div>

      <div className="space-y-3">
        {/* Survey URL */}
        <div className="bg-white rounded-md p-3 border border-gray-200">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Survey Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={surveyUrl}
              readOnly
              className="flex-1 text-sm text-gray-600 bg-gray-50 border-0 focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              {copySuccess ? (
                <>
                  <svg className="h-4 w-4 mr-1.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Link
                </>
              )}
            </button>
          </div>
        </div>

        {/* Email Invitation Toggle */}
        {!showEmailForm ? (
          <button
            onClick={() => setShowEmailForm(true)}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Send Email Invitations
          </button>
        ) : (
          <div className="bg-white rounded-md p-4 border border-gray-200 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Addresses
              </label>
              <textarea
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                placeholder="email1@example.com, email2@example.com, email3@example.com"
                rows={3}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter comma-separated email addresses
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Personal Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a personal message to the invitation..."
                rows={2}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSendEmails}
                disabled={isSending}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? 'Sending...' : 'Send Invitations'}
              </button>
              <button
                onClick={() => setShowEmailForm(false)}
                disabled={isSending}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
