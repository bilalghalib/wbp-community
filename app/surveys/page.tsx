import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { SURVEY_TEMPLATES } from '@/utils/constants/surveys'

export default async function SurveysPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check user memberships
  const { data: memberships } = await supabase
    .from('organization_memberships')
    .select('id, role, organization:organizations(id, name, slug)')
    .eq('user_id', user.id)
    .eq('is_active', true)

  if (!memberships || memberships.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Restricted</h1>
          <p className="mt-2 text-gray-600">
            You must be a member of an organization to access surveys.
          </p>
          <Link href="/dashboard" className="mt-4 inline-block text-blue-600 hover:text-blue-500">
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const isAdmin = memberships.some(m =>
    m.role === 'primary_admin' || m.role === 'backup_admin'
  )

  // Get active deployments for user's organizations
  const orgIds = memberships.map(m => m.organization.id)
  const { data: activeDeployments } = await supabase
    .from('survey_deployments')
    .select(`
      id,
      survey_id,
      organization_id,
      title,
      closes_at,
      created_at,
      organization:organizations(name, slug),
      responses:survey_responses(id, respondent_id)
    `)
    .in('organization_id', orgIds)
    .gte('closes_at', new Date().toISOString())
    .order('created_at', { ascending: false })

  // Filter to show only deployments user hasn't completed
  const pendingSurveys = activeDeployments?.filter(d =>
    !d.responses.some((r: any) => r.respondent_id === user.id)
  ) || []

  // Get ALL deployments for admin view (both open and closed)
  let allDeployments: any[] = []
  if (isAdmin) {
    const { data: adminDeployments } = await supabase
      .from('survey_deployments')
      .select(`
        id,
        title,
        closes_at,
        created_at,
        organization_id,
        organization:organizations(name, slug)
      `)
      .in('organization_id', orgIds)
      .order('created_at', { ascending: false })
      .limit(20)

    // Get response counts for each deployment
    if (adminDeployments) {
      allDeployments = await Promise.all(
        adminDeployments.map(async (deployment) => {
          const { count: responseCount } = await supabase
            .from('survey_responses')
            .select('*', { count: 'exact', head: true })
            .eq('survey_deployment_id', deployment.id)

          const { count: memberCount } = await supabase
            .from('organization_memberships')
            .select('*', { count: 'exact', head: true })
            .eq('organization_id', deployment.organization_id)
            .eq('is_active', true)

          const isOpen = new Date(deployment.closes_at) > new Date()
          const responseRate = memberCount ? Math.round((responseCount || 0) / memberCount * 100) : 0

          return {
            ...deployment,
            responseCount: responseCount || 0,
            memberCount: memberCount || 0,
            responseRate,
            isOpen,
          }
        })
      )

      // Sort: open first (by closes_at), then closed (by created_at desc)
      allDeployments.sort((a, b) => {
        if (a.isOpen && !b.isOpen) return -1
        if (!a.isOpen && b.isOpen) return 1
        if (a.isOpen && b.isOpen) {
          return new Date(a.closes_at).getTime() - new Date(b.closes_at).getTime()
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
    }
  }

  // Get completed responses
  const { data: completedResponses } = await supabase
    .from('survey_responses')
    .select(`
      id,
      created_at,
      deployment:survey_deployments(
        id,
        title,
        survey_id,
        organization:organizations(name, slug)
      )
    `)
    .eq('respondent_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-gray-900">
                Springboard
              </Link>
              <span className="ml-4 text-gray-400">/</span>
              <span className="ml-4 text-gray-700">Surveys</span>
            </div>
            {isAdmin && (
              <Link
                href="/surveys/deploy"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Deploy Survey
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin: Manage Deployments */}
        {isAdmin && allDeployments.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Manage Deployments
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allDeployments.map((deployment) => {
                const daysRemaining = deployment.isOpen
                  ? Math.ceil((new Date(deployment.closes_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                  : Math.floor((Date.now() - new Date(deployment.closes_at).getTime()) / (1000 * 60 * 60 * 24))

                return (
                  <div
                    key={deployment.id}
                    className="bg-white rounded-lg shadow-md p-6 flex flex-col"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg flex-1 pr-2">
                        {deployment.title}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          deployment.isOpen
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {deployment.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">
                      {deployment.organization.name}
                    </p>

                    {/* Response Stats */}
                    <div className="mb-4">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-sm text-gray-600">
                          {deployment.responseCount}/{deployment.memberCount} responses
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {deployment.responseRate}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${deployment.responseRate}%` }}
                        />
                      </div>
                    </div>

                    {/* Time Info */}
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {deployment.isOpen ? (
                        <span>
                          {daysRemaining === 0
                            ? 'Closes today'
                            : daysRemaining === 1
                            ? 'Closes tomorrow'
                            : `Closes in ${daysRemaining} days`}
                        </span>
                      ) : (
                        <span>
                          Closed {daysRemaining === 0 ? 'today' : `${daysRemaining} days ago`}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-auto space-y-2">
                      <Link
                        href={`/surveys/results/${deployment.id}`}
                        className="block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                      >
                        View Results
                      </Link>
                      {deployment.isOpen && (
                        <Link
                          href={`/surveys/results/${deployment.id}#share`}
                          className="block w-full text-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                          Share Survey
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Pending Surveys */}
        {pendingSurveys.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Pending Surveys ({pendingSurveys.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingSurveys.map((deployment: any) => (
                <Link
                  key={deployment.id}
                  href={`/surveys/respond/${deployment.id}`}
                  className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 hover:bg-yellow-100 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {deployment.title}
                    </h3>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-200 text-yellow-800">
                      Action Needed
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {deployment.organization.name}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Closes {new Date(deployment.closes_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Survey Templates */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Available Assessments</h2>
            {isAdmin && (
              <p className="text-sm text-gray-600">
                Select a survey to deploy to your organization
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SURVEY_TEMPLATES.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-lg shadow p-6 flex flex-col"
              >
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {template.title}
                    </h3>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {template.description}
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ~{template.estimatedMinutes} minutes
                    <span className="mx-2">•</span>
                    {template.questions.length} questions
                  </div>
                </div>
                {isAdmin ? (
                  <Link
                    href={`/surveys/deploy?template=${template.id}`}
                    className="mt-auto inline-flex items-center justify-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 hover:bg-blue-50"
                  >
                    Deploy to Organization
                  </Link>
                ) : (
                  <div className="mt-auto text-xs text-gray-500 text-center py-2">
                    Contact your admin to deploy
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Recent Completions */}
        {completedResponses && completedResponses.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Recently Completed
            </h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Survey
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completed
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {completedResponses.map((response: any) => (
                    <tr key={response.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {response.deployment?.title || 'Survey'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {response.deployment?.organization?.name || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(response.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
