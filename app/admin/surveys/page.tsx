import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { SURVEY_TEMPLATES } from '@/utils/constants/surveys'

export default async function AdminSurveysPage() {
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

  const isWBPAdmin = userProfile?.email.endsWith('@wellbeingproject.org')

  if (!isWBPAdmin) {
    redirect('/admin')
  }

  // Get all deployments
  const { data: allDeployments } = await supabase
    .from('survey_deployments')
    .select(`
      id,
      title,
      created_at,
      closes_at,
      organization_id,
      organization:organizations(name, slug),
      survey:surveys(id, template_id, title)
    `)
    .order('created_at', { ascending: false })

  // Calculate stats
  const totalDeployments = allDeployments?.length || 0
  const openDeployments = allDeployments?.filter(
    d => new Date(d.closes_at) > new Date()
  ).length || 0
  const closedDeployments = totalDeployments - openDeployments

  // Get response counts for all deployments
  const deploymentsWithStats = await Promise.all(
    (allDeployments || []).map(async (deployment) => {
      const { count: responseCount } = await supabase
        .from('survey_responses')
        .select('*', { count: 'exact', head: true })
        .eq('survey_deployment_id', deployment.id)

      const { count: memberCount } = await supabase
        .from('organization_memberships')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', deployment.organization_id)
        .eq('is_active', true)

      const responseRate = memberCount ? Math.round((responseCount || 0) / memberCount * 100) : 0
      const isOpen = new Date(deployment.closes_at) > new Date()

      return {
        ...deployment,
        responseCount: responseCount || 0,
        memberCount: memberCount || 0,
        responseRate,
        isOpen,
      }
    })
  )

  // Calculate network-wide stats
  const totalResponses = deploymentsWithStats.reduce((sum, d) => sum + d.responseCount, 0)
  const totalPotentialResponses = deploymentsWithStats.reduce((sum, d) => sum + d.memberCount, 0)
  const networkResponseRate = totalPotentialResponses
    ? Math.round((totalResponses / totalPotentialResponses) * 100)
    : 0

  // Template usage stats
  const templateUsage = SURVEY_TEMPLATES.map(template => {
    const count = deploymentsWithStats.filter(
      d => d.survey.template_id === template.id
    ).length
    return { template, count }
  }).sort((a, b) => b.count - a.count)

  // Organizations using surveys
  const orgsUsingSurveys = new Set(deploymentsWithStats.map(d => d.organization_id)).size

  // Get count of all active orgs for comparison
  const { count: totalActiveOrgs } = await supabase
    .from('organizations')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  const surveyAdoptionRate = totalActiveOrgs
    ? Math.round((orgsUsingSurveys / totalActiveOrgs) * 100)
    : 0

  // Recent deployments (last 10)
  const recentDeployments = deploymentsWithStats.slice(0, 10)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/admin" className="text-sm text-gray-700 hover:text-gray-900">
              ← Admin Dashboard
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">Survey Analytics</h1>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Network-Wide Survey Analytics</h1>
          <p className="mt-2 text-gray-600">
            Overview of survey activity across all organizations
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Total Deployments</p>
            <p className="text-3xl font-bold text-gray-900">{totalDeployments}</p>
            <p className="text-xs text-gray-500 mt-1">
              {openDeployments} open, {closedDeployments} closed
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Network Response Rate</p>
            <p className="text-3xl font-bold text-blue-600">{networkResponseRate}%</p>
            <p className="text-xs text-gray-500 mt-1">
              {totalResponses} / {totalPotentialResponses} responses
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Organizations Using Surveys</p>
            <p className="text-3xl font-bold text-green-600">{orgsUsingSurveys}</p>
            <p className="text-xs text-gray-500 mt-1">
              {surveyAdoptionRate}% of active orgs
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Most Popular Template</p>
            <p className="text-xl font-bold text-purple-600">
              {templateUsage[0]?.template.title.split(' ')[0] || 'N/A'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {templateUsage[0]?.count || 0} deployment{templateUsage[0]?.count !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Template Usage Breakdown */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Template Usage</h2>
          <div className="space-y-4">
            {templateUsage.map(({ template, count }) => {
              const percentage = totalDeployments
                ? Math.round((count / totalDeployments) * 100)
                : 0
              return (
                <div key={template.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {template.title}
                    </span>
                    <span className="text-sm text-gray-600">
                      {count} deployment{count !== 1 ? 's' : ''} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Deployments */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Deployments</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {recentDeployments.map((deployment) => (
                <div key={deployment.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {deployment.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {deployment.organization.name}
                      </p>
                    </div>
                    <span
                      className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        deployment.isOpen
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {deployment.isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">
                      {deployment.responseCount}/{deployment.memberCount} responses ({deployment.responseRate}%)
                    </span>
                    <span className="text-gray-400">
                      {new Date(deployment.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                    <div
                      className="bg-blue-600 h-1 rounded-full"
                      style={{ width: `${deployment.responseRate}%` }}
                    />
                  </div>
                </div>
              ))}
              {recentDeployments.length === 0 && (
                <div className="px-6 py-12 text-center text-gray-500">
                  No deployments yet
                </div>
              )}
            </div>
          </div>

          {/* Engagement Insights */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Engagement Insights</h2>
            </div>
            <div className="p-6 space-y-6">
              {/* High performers */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  High Response Rates
                </h3>
                {deploymentsWithStats
                  .filter(d => d.responseRate >= 70 && d.responseCount >= 3)
                  .slice(0, 5)
                  .map(d => (
                    <div key={d.id} className="flex items-center justify-between py-2">
                      <div className="flex-1 min-w-0 mr-4">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {d.organization.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{d.title}</p>
                      </div>
                      <span className="text-sm font-semibold text-green-600">
                        {d.responseRate}%
                      </span>
                    </div>
                  ))}
                {deploymentsWithStats.filter(d => d.responseRate >= 70 && d.responseCount >= 3).length === 0 && (
                  <p className="text-sm text-gray-500 py-2">
                    No deployments with 70%+ response rate yet
                  </p>
                )}
              </div>

              {/* Needs attention */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Needs Attention
                </h3>
                {deploymentsWithStats
                  .filter(d => d.isOpen && d.responseRate < 30)
                  .slice(0, 5)
                  .map(d => {
                    const daysLeft = Math.ceil(
                      (new Date(d.closes_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                    )
                    return (
                      <div key={d.id} className="flex items-center justify-between py-2">
                        <div className="flex-1 min-w-0 mr-4">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {d.organization.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {daysLeft} days left
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-yellow-600">
                          {d.responseRate}%
                        </span>
                      </div>
                    )
                  })}
                {deploymentsWithStats.filter(d => d.isOpen && d.responseRate < 30).length === 0 && (
                  <p className="text-sm text-gray-500 py-2">
                    All open surveys are performing well
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex">
            <svg className="h-5 w-5 text-blue-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-blue-900">Privacy-First Analytics</h3>
              <p className="mt-1 text-sm text-blue-700">
                This dashboard shows network-wide aggregate statistics only. Individual survey responses
                remain completely anonymous and are never accessible, even to WBP admins. Organizations
                can only view their own aggregate results (minimum 3 responses required).
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
