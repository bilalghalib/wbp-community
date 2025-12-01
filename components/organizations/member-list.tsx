'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Member = {
  id: string
  role: string
  permissions: any
  joined_at: string
  is_active: boolean
  user: {
    id: string
    full_name: string
    email: string
    avatar_url: string | null
  } | null
}

type Props = {
  members: Member[]
  organizationId: string
  currentUserId: string
  isAdmin: boolean
}

export default function MemberList({ members, organizationId, currentUserId, isAdmin }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleRoleChange = async (membershipId: string, newRole: string) => {
    setLoading(membershipId)
    setError(null)

    try {
      const res = await fetch('/api/organizations/members', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          membershipId,
          role: newRole,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update role')
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(null)
    }
  }

  const handleRemoveMember = async (membershipId: string, memberName: string) => {
    if (!confirm(`Remove ${memberName} from this organization?`)) {
      return
    }

    setLoading(membershipId)
    setError(null)

    try {
      const res = await fetch('/api/organizations/members', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membershipId }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to remove member')
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div>
      {error && (
        <div className="px-6 py-4 bg-red-50 border-b border-red-200">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <ul className="divide-y divide-gray-200">
        {members.map((member) => {
          const isCurrentUser = member.user?.id === currentUserId
          const canEdit = isAdmin && !isCurrentUser

          return (
            <li key={member.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1 min-w-0">
                  {/* Avatar */}
                  {member.user?.avatar_url ? (
                    <Image
                      src={member.user.avatar_url}
                      alt={member.user.full_name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-lg text-gray-600">
                        {member.user?.full_name?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}

                  {/* Info */}
                  <div className="ml-4 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {member.user?.full_name || 'Unknown'}
                      </p>
                      {isCurrentUser && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          You
                        </span>
                      )}
                      {!member.is_active && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{member.user?.email}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Joined {new Date(member.joined_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Role & Actions */}
                <div className="ml-4 flex items-center gap-3">
                  {canEdit ? (
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value)}
                      disabled={loading === member.id}
                      className="block rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                    >
                      <option value="primary_admin">Primary Admin</option>
                      <option value="backup_admin">Backup Admin</option>
                      <option value="contributor">Contributor</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                      {member.role.replace('_', ' ')}
                    </span>
                  )}

                  {canEdit && (
                    <button
                      onClick={() => handleRemoveMember(member.id, member.user?.full_name || 'this member')}
                      disabled={loading === member.id}
                      className="text-red-600 hover:text-red-700 disabled:opacity-50"
                      title="Remove member"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </li>
          )
        })}

        {members.length === 0 && (
          <li className="px-6 py-12 text-center text-gray-500">
            No members found.
          </li>
        )}
      </ul>
    </div>
  )
}
