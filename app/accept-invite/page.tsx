'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AcceptInvitePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [invitation, setInvitation] = useState<{
    isValid: boolean
    email: string
    fullName: string
    organizationName: string
    role: string
    errorMessage?: string
  } | null>(null)

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    if (!token) {
      setError('No invitation token provided')
      setLoading(false)
      return
    }

    // Validate the token
    fetch(`/api/invitations/accept?token=${encodeURIComponent(token)}`)
      .then(res => res.json())
      .then(data => {
        if (data.isValid) {
          setInvitation(data)
        } else {
          setError(data.errorMessage || 'Invalid invitation')
        }
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to validate invitation')
        setLoading(false)
      })
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch('/api/invitations/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to accept invitation')
      }

      // Redirect based on role
      if (data.isAdmin) {
        router.push(`/welcome-admin?org=${data.organizationSlug}`)
      } else {
        router.push('/login?message=Account created! Please log in.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFC] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C3E50] mx-auto mb-4"></div>
          <p className="text-gray-500">Validating invitation...</p>
        </div>
      </div>
    )
  }

  if (error && !invitation) {
    return (
      <div className="min-h-screen bg-[#FBFBFC] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-serif text-[#2C3E50] mb-2">Invitation Invalid</h1>
            <p className="text-gray-500 mb-6">{error}</p>
            <Link
              href="/login"
              className="inline-flex items-center px-6 py-3 bg-[#2C3E50] text-white rounded-xl hover:bg-[#1a252f] transition-colors"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FBFBFC] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-[#2C3E50] mb-2">Welcome to Springboard</h1>
          <p className="text-gray-500">
            You&apos;ve been invited to join <span className="font-semibold text-[#2C3E50]">{invitation?.organizationName}</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="mb-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Hi {invitation?.fullName}!</span>
              <br />
              You&apos;ll be joining as a <span className="font-medium capitalize">{invitation?.role?.replace('_', ' ')}</span>.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-800 text-sm rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={invitation?.email || ''}
                disabled
                className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm bg-gray-50 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Create Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#2C3E50] focus:outline-none focus:ring-1 focus:ring-[#2C3E50]"
                placeholder="At least 8 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#2C3E50] focus:outline-none focus:ring-1 focus:ring-[#2C3E50]"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 bg-[#2C3E50] text-white rounded-xl hover:bg-[#1a252f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {submitting ? 'Creating Account...' : 'Accept Invitation'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            By accepting, you agree to the platform&apos;s terms of use and privacy policy.
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-[#2C3E50] hover:underline font-medium">
            Log in instead
          </Link>
        </p>
      </div>
    </div>
  )
}
