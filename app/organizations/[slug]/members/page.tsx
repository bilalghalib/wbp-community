import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import MemberList from '@/components/organizations/member-list'
import InviteMemberForm from '@/components/organizations/invite-member-form'
import PendingInvitations from '@/components/organizations/pending-invitations'

export default async function MembersPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch organization
  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!org) {
    notFound()
  }

  // Check user's membership
  const { data: userMembership } = await supabase
    .from('organization_memberships')
    .select('role, permissions')
    .eq('organization_id', org.id)
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single()

  if (!userMembership) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Restricted</h1>
          <p className="mt-2 text-gray-600">
            You are not a member of this organization.
          </p>
        </div>
      </div>
    )
  }

  // Fetch all members
  const { data: members } = await supabase
    .from('organization_memberships')
    .select(`
      *,
      user:users(id, full_name, email, avatar_url)
    `)
    .eq('organization_id', org.id)
    .order('joined_at', { ascending: false })

  const isAdmin = userMembership.role === 'primary_admin' || userMembership.role === 'backup_admin'

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <Link href={`/organizations/${org.slug}`} className="text-sm text-gray-700 hover:text-gray-900">
              ← {org.name}
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
          <p className="mt-2 text-gray-600">
            Manage who has access to {org.name}&apos;s resources and what they can do.
          </p>
        </div>

        {/* Invite New Member (Admin Only) */}
        {isAdmin && (
          <div className="bg-white rounded-lg shadow mb-8 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Invite New Member</h2>
            <InviteMemberForm organizationId={org.id} organizationName={org.name} />
          </div>
        )}

        {/* Pending Invitations (Admin Only) */}
        {isAdmin && (
          <div className="bg-white rounded-lg shadow mb-8 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Invitations</h2>
            <PendingInvitations organizationId={org.id} />
          </div>
        )}

        {/* Members List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Current Members ({members?.filter(m => m.is_active).length || 0})
            </h2>
          </div>
          <MemberList
            members={members || []}
            organizationId={org.id}
            currentUserId={user.id}
            isAdmin={isAdmin}
          />
        </div>

        {/* Role Explanations */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-3">Role Permissions</h3>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="font-medium text-blue-900">Primary Admin</dt>
              <dd className="text-blue-700">Full control - can manage all members, delete organization</dd>
            </div>
            <div>
              <dt className="font-medium text-blue-900">Backup Admin</dt>
              <dd className="text-blue-700">Same as primary admin - ensures continuity if primary admin leaves</dd>
            </div>
            <div>
              <dt className="font-medium text-blue-900">Contributor</dt>
              <dd className="text-blue-700">Can add service providers, upload resources, deploy surveys</dd>
            </div>
            <div>
              <dt className="font-medium text-blue-900">Viewer</dt>
              <dd className="text-blue-700">Read-only access - can view but not modify organization data</dd>
            </div>
          </dl>
        </div>
      </main>
    </div>
  )
}
