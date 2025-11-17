import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getSurveyTemplate } from '@/utils/constants/surveys'

type PageProps = {
  params: { slug: string }
}

export default async function OrganizationSurveysPage({ params }: PageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get organization
  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('id, name, slug')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single()

  if (orgError || !organization) {
    notFound()
  }

  // Check user is admin of this organization
  const { data: membership } = await supabase
    .from('organization_memberships')
    .select('role')
    .eq('user_id', user.id)
    .eq('organization_id', organization.id)
    .eq('is_active', true)
    .in('role', ['primary_admin', 'backup_admin'])
    .single()

  if (!membership) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Restricted</h1>
          <p className="mt-2 text-gray-600">
            Only organization admins can view survey history.
          </p>
          <Link href={`/organizations/${params.slug}`} className="mt-4 inline-block text-blue-600 hover:text-blue-500">
            Return to Organization
          </Link>
        </div>
      </div>
    )
  }

  // Get all deployments for this organization
  const { data: deployments } = await supabase
    .from('survey_deployments')
    .select(`
      id,
      title,
      created_at,
      closes_at,
      survey:surveys(id, template_id, title, category)
    `)
    .eq('organization_id', organization.id)
    .order('created_at', { ascending: false })

  // Get response counts for each deployment
  const deploymentsWithStats = await Promise.all(
    (deployments || []).map(async (deployment: any) => {
      const { count } = await supabase
        .from('survey_responses')
        .select('*', { count: 'exact', head: true })
        .eq('deployment_id', deployment.id)

      return {
        ...deployment,
        response_count: count || 0,
      }
    })
  )

  // Group by survey template for time-series view
  const surveyGroups = deploymentsWithStats.reduce((acc: any, deployment: any) => {
    const templateId = deployment.survey.template_id
    if (!acc[templateId]) {
      acc[templateId] = {
        template_id: templateId,
        template_title: deployment.survey.title,
        category: deployment.survey.category,
        deployments: [],
      }
    }
    acc[templateId].deployments.push(deployment)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href={`/organizations/${params.slug}`} className="text-sm text-gray-700 hover:text-gray-900">
              ← {organization.name}
            </Link>
            <Link
              href="/surveys/deploy"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Deploy Survey
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Survey History</h1>
          <p className="mt-2 text-gray-600">
            View past assessments and track wellbeing trends over time
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Total Deployments
            </h3>
            <p className="text-3xl font-bold text-gray-900">{deploymentsWithStats.length}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Total Responses
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {deploymentsWithStats.reduce((sum, d) => sum + d.response_count, 0)}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Survey Types
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {Object.keys(surveyGroups).length}
            </p>
          </div>
        </div>

        {/* Grouped by Survey Template */}
        {Object.values(surveyGroups).length > 0 ? (
          <div className="space-y-8">
            {Object.values(surveyGroups).map((group: any) => {
              const template = getSurveyTemplate(group.template_id)
              return (
                <div key={group.template_id} className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          {group.template_title}
                        </h2>
                        <p className="text-sm text-gray-600 capitalize">
                          {group.category} • {group.deployments.length} deployment{group.deployments.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <Link
                        href={`/surveys/deploy?template=${group.template_id}`}
                        className="text-sm text-blue-600 hover:text-blue-500"
                      >
                        Deploy Again →
                      </Link>
                    </div>
                  </div>

                  {/* Time-series chart placeholder */}
                  {template && group.deployments.filter((d: any) => d.response_count >= 3).length > 1 && (
                    <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
                      <p className="text-sm text-blue-800">
                        📊 {group.deployments.filter((d: any) => d.response_count >= 3).length} deployments with sufficient data for trend analysis
                      </p>
                    </div>
                  )}

                  {/* Deployment list */}
                  <div className="divide-y divide-gray-200">
                    {group.deployments.map((deployment: any) => {
                      const isOpen = new Date(deployment.closes_at) > new Date()
                      return (
                        <Link
                          key={deployment.id}
                          href={`/surveys/results/${deployment.id}`}
                          className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {deployment.title}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                Deployed {new Date(deployment.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                                {' • '}
                                Closes {new Date(deployment.closes_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900">
                                  {deployment.response_count}
                                </p>
                                <p className="text-xs text-gray-500">
                                  response{deployment.response_count !== 1 ? 's' : ''}
                                </p>
                              </div>
                              <div>
                                {isOpen ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Open
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    Closed
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No surveys deployed</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by deploying your first wellbeing assessment.
            </p>
            <div className="mt-6">
              <Link
                href="/surveys/deploy"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Deploy Survey
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
