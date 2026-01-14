import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { isSuperAdmin } from '@/lib/utils/admin'

type PageProps = {
  searchParams: { search?: string; status?: string }
}

export default async function AdminOrganizationsPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user is WBP admin
  const { data: userProfile } = await supabase
    .from('users')
    .select('email')
    .eq('id', user.id)
    .single()

  if (!isSuperAdmin(userProfile?.email)) {
    redirect('/admin')
  }

  // Build query
  let query = supabase
    .from('organizations')
    .select(`
      id,
      name,
      slug,
      created_at,
      is_active,
      memberships:organization_memberships(id, user_id, role, is_active)
    `)
    .order('created_at', { ascending: false })

  // Filter by active status
  if (searchParams.status === 'active') {
    query = query.eq('is_active', true)
  } else if (searchParams.status === 'inactive') {
    query = query.eq('is_active', false)
  }

  // Search using full-text search (tsv) for better performance
  if (searchParams.search) {
    query = query.textSearch('tsv', searchParams.search)
  }

  const { data: organizations } = await query

  // Enhance organizations with stats
  const orgsWithStats = await Promise.all(
    (organizations || []).map(async (org) => {
      // Count active members
      const activeMemberships = org.memberships.filter((m: any) => m.is_active)
      const memberCount = activeMemberships.length

      // Count admins
      const adminCount = activeMemberships.filter(
        (m: any) => m.role === 'primary_admin' || m.role === 'backup_admin'
      ).length

      // Get survey count
      const { count: surveyCount } = await supabase
        .from('survey_deployments')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', org.id)

      // Get research count
      const { count: researchCount } = await supabase
        .from('research_documents')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', org.id)

      // Get most recent activity
      const { data: recentActivity } = await supabase
        .from('activity_logs')
        .select('created_at')
        .eq('organization_id', org.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      return {
        ...org,
        memberCount,
        adminCount,
        surveyCount: surveyCount || 0,
        researchCount: researchCount || 0,
        lastActivity: recentActivity?.created_at || org.created_at,
      }
    })
  )

  // Calculate platform stats
  const totalOrgs = orgsWithStats.length
  const activeOrgs = orgsWithStats.filter(o => o.is_active).length
  const totalMembers = orgsWithStats.reduce((sum, o) => sum + o.memberCount, 0)
  const totalSurveys = orgsWithStats.reduce((sum, o) => sum + o.surveyCount, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <Link href="/admin" className="text-sm text-gray-700 hover:text-gray-900">
              ← Admin Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Organizations</h1>
            <p className="mt-2 text-gray-600">
              Manage and monitor all organizations in the network
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/organizations/import"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Import CSV
            </Link>
            <Link
              href="/admin/organizations/new"
              className="px-4 py-2 bg-[#2C3E50] text-white rounded-lg text-sm font-medium hover:bg-[#1a252f] transition-colors"
            >
              + Add Organization
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Total Organizations</p>
            <p className="text-3xl font-bold text-gray-900">{totalOrgs}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Active Organizations</p>
            <p className="text-3xl font-bold text-green-600">{activeOrgs}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Total Members</p>
            <p className="text-3xl font-bold text-gray-900">{totalMembers}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Surveys Deployed</p>
            <p className="text-3xl font-bold text-blue-600">{totalSurveys}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <form action="/admin/organizations" method="get" className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                name="search"
                defaultValue={searchParams.search || ''}
                placeholder="Search organizations..."
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <select
                name="status"
                defaultValue={searchParams.status || 'all'}
                className="block rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
            {(searchParams.search || searchParams.status) && (
              <Link
                href="/admin/organizations"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Clear
              </Link>
            )}
          </form>
        </div>

        {/* Organizations Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Members
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orgsWithStats.map((org) => (
                <tr key={org.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {org.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          /{org.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {org.memberCount} member{org.memberCount !== 1 ? 's' : ''}
                    </div>
                    <div className="text-xs text-gray-500">
                      {org.adminCount} admin{org.adminCount !== 1 ? 's' : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {org.surveyCount} survey{org.surveyCount !== 1 ? 's' : ''}
                    </div>
                    <div className="text-xs text-gray-500">
                      {org.researchCount} resource{org.researchCount !== 1 ? 's' : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(org.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="text-xs text-gray-500">
                      Last: {new Date(org.lastActivity).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        org.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {org.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/organizations/${org.slug}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      View
                    </Link>
                    <Link
                      href={`/organizations/${org.slug}/members`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Members
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {orgsWithStats.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-500">
              No organizations found
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Organization Management</h3>
          <p className="text-sm text-blue-700">
            This view shows all organizations in the network. Use the search and filters to find specific organizations.
            Click &quot;View&quot; to see the organization&apos;s public profile, or &quot;Members&quot; to manage their membership.
          </p>
        </div>
      </main>
    </div>
  )
}
