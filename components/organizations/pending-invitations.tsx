'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Invitation = {
  id: string
  email: string
  full_name: string
  role: string
  token: string
  expires_at: string
  accepted_at: string | null
  revoked_at: string | null
  created_at: string
  last_sent_at: string
  send_count: number
  invited_by: { full_name: string } | { full_name: string }[]
}

type InvitationsData = {
  pending: Invitation[]
  expired: Invitation[]
  accepted: Invitation[]
  revoked: Invitation[]
}

type Props = {
  organizationId: string
}

export default function PendingInvitations({ organizationId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [invitations, setInvitations] = useState<InvitationsData | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    fetchInvitations()
  }, [organizationId])

  const fetchInvitations = async () => {
    try {
      const res = await fetch(`/api/organizations/members/invite?organizationId=${organizationId}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch invitations')
      }

      setInvitations(data.invitations)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (invitationId: string, action: 'resend' | 'revoke') => {
    setActionLoading(invitationId)

    try {
      const res = await fetch('/api/organizations/members/invite', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationId, action }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || `Failed to ${action} invitation`)
      }

      // If resend, show the URL temporarily
      if (action === 'resend' && data.acceptUrl) {
        await navigator.clipboard.writeText(data.acceptUrl)
        setCopiedId(invitationId)
        setTimeout(() => setCopiedId(null), 3000)
      }

      // Refresh invitations
      fetchInvitations()
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setActionLoading(null)
    }
  }

  const copyInviteLink = async (token: string, invitationId: string) => {
    const url = `${window.location.origin}/accept-invite?token=${token}`
    await navigator.clipboard.writeText(url)
    setCopiedId(invitationId)
    setTimeout(() => setCopiedId(null), 3000)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const formatRole = (role: string) => {
    return role.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())
  }

  const getInvitedByName = (invitedBy: { full_name: string } | { full_name: string }[]) => {
    if (Array.isArray(invitedBy)) {
      return invitedBy[0]?.full_name || 'Unknown'
    }
    return invitedBy?.full_name || 'Unknown'
  }

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading invitations...
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-800 text-sm rounded-lg">
        {error}
      </div>
    )
  }

  const pendingCount = invitations?.pending.length || 0
  const expiredCount = invitations?.expired.length || 0

  return (
    <div className="space-y-4">
      {/* Pending Invitations */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Pending Invitations ({pendingCount})
        </h3>

        {pendingCount === 0 ? (
          <p className="text-sm text-gray-500 py-2">No pending invitations</p>
        ) : (
          <div className="space-y-2">
            {invitations?.pending.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {inv.full_name}
                    </p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {formatRole(inv.role)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{inv.email}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Invited {formatDate(inv.created_at)}
                    {inv.send_count > 1 && ` • Resent ${inv.send_count - 1}x`}
                  </p>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => copyInviteLink(inv.token, inv.id)}
                    className="px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                  >
                    {copiedId === inv.id ? '✓ Copied!' : 'Copy Link'}
                  </button>
                  <button
                    onClick={() => handleAction(inv.id, 'resend')}
                    disabled={actionLoading === inv.id}
                    className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded disabled:opacity-50"
                  >
                    {actionLoading === inv.id ? '...' : 'Resend'}
                  </button>
                  <button
                    onClick={() => handleAction(inv.id, 'revoke')}
                    disabled={actionLoading === inv.id}
                    className="px-2 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded disabled:opacity-50"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expired Invitations */}
      {expiredCount > 0 && (
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Expired Invitations ({expiredCount})
          </h3>
          <div className="space-y-2">
            {invitations?.expired.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {inv.full_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{inv.email}</p>
                  <p className="text-xs text-yellow-700">
                    Expired {formatDate(inv.expires_at)}
                  </p>
                </div>
                <button
                  onClick={() => handleAction(inv.id, 'resend')}
                  disabled={actionLoading === inv.id}
                  className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 hover:bg-yellow-200 rounded disabled:opacity-50"
                >
                  {actionLoading === inv.id ? '...' : 'Resend'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Toggle */}
      {(invitations?.accepted.length || 0) + (invitations?.revoked.length || 0) > 0 && (
        <div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            {showHistory ? '▼' : '▶'} Invitation History ({(invitations?.accepted.length || 0) + (invitations?.revoked.length || 0)})
          </button>

          {showHistory && (
            <div className="mt-3 space-y-2">
              {invitations?.accepted.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{inv.full_name}</p>
                    <p className="text-xs text-green-700">
                      Accepted {formatDate(inv.accepted_at!)}
                    </p>
                  </div>
                  <span className="text-xs text-green-600">✓ Joined</span>
                </div>
              ))}
              {invitations?.revoked.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-500 line-through">{inv.full_name}</p>
                    <p className="text-xs text-gray-400">
                      Revoked {formatDate(inv.revoked_at!)}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">Cancelled</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
