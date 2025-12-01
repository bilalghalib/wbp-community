import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getSurveyTemplate } from '@/utils/constants/surveys'
import SurveyShareSection from '@/components/surveys/survey-share-section'

type PageProps = {
  params: { id: string }
}

export default async function SurveyResultsPage({ params }: PageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get deployment
  const { data: deployment, error } = await supabase
    .from('survey_deployments')
    .select(`
      id,
      title,
      created_at,
      closes_at,
      organization_id,
      deployed_by_user_id,
      organization:organizations(name, slug),
      survey:surveys(id, template_id, title, description, questions)
    `)
    .eq('id', params.id)
    .single()

  if (error || !deployment) {
    console.error('Error fetching deployment:', error)
    notFound()
  }

  // Check user is admin of the organization
  const { data: membership } = await supabase
    .from('organization_memberships')
    .select('role')
    .eq('user_id', user.id)
    .eq('organization_id', deployment.organization_id)
    .eq('is_active', true)
    .in('role', ['primary_admin', 'backup_admin'])
    .single()

  if (!membership) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Restricted</h1>
          <p className="mt-2 text-gray-600">
            Only organization admins can view survey results.
          </p>
          <Link href="/surveys" className="mt-4 inline-block text-blue-600 hover:text-blue-500">
            Return to Surveys
          </Link>
        </div>
      </div>
    )
  }

  // Get response count
  const { count: responseCount } = await supabase
    .from('survey_responses')
    .select('*', { count: 'exact', head: true })
    .eq('survey_deployment_id', deployment.id)

  // Get org member count for response rate
  const { count: memberCount } = await supabase
    .from('organization_memberships')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', deployment.organization_id)
    .eq('is_active', true)

  // Get aggregate statistics
  // This uses ONLY aggregate functions - no individual responses
  const { data: aggregateStats } = await supabase
    .rpc('get_deployment_aggregate_stats', { deployment_id_param: deployment.id })

  // Extract survey and organization from relations
  const survey = Array.isArray(deployment.survey) ? deployment.survey[0] : deployment.survey
  const organization = Array.isArray(deployment.organization) ? deployment.organization[0] : deployment.organization

  // Get template definition using template_id
  const template = survey?.template_id
    ? getSurveyTemplate(survey.template_id)
    : null

  // Calculate aggregate scores for each metric
  const aggregateMetrics: Record<string, { avg: number; min: number; max: number }> = {}

  if (template && responseCount && responseCount >= 3) {
    // Only show aggregate metrics if there are at least 3 responses (privacy threshold)
    for (const metric of template.aggregateMetrics) {
      const { data } = await supabase
        .from('survey_responses')
        .select('scores')
        .eq('survey_deployment_id', deployment.id)

      if (data && data.length >= 3) {
        const values = data
          .map((r: any) => r.scores?.[metric])
          .filter((v): v is number => typeof v === 'number')

        if (values.length > 0) {
          aggregateMetrics[metric] = {
            avg: values.reduce((a, b) => a + b, 0) / values.length,
            min: Math.min(...values),
            max: Math.max(...values),
          }
        }
      }
    }
  }

  const isOpen = new Date(deployment.closes_at) > new Date()
  const responseRate = memberCount ? Math.round((responseCount || 0) / memberCount * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/surveys" className="text-sm text-gray-700 hover:text-gray-900">
              ← Surveys
            </Link>
            <div className="flex items-center space-x-3">
              {responseCount && responseCount >= 3 && (
                <>
                  <a
                    href={`/api/surveys/export/${params.id}?format=csv`}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Export CSV
                  </a>
                  <a
                    href={`/api/surveys/export/${params.id}?format=json`}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Export JSON
                  </a>
                </>
              )}
              {isOpen && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Open
                </span>
              )}
              {!isOpen && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  Closed
                </span>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{deployment.title}</h1>
          <p className="mt-2 text-gray-600">{survey?.description}</p>
          <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
            <span>{organization?.name}</span>
            <span>•</span>
            <span>Deployed {new Date(deployment.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}</span>
            <span>•</span>
            <span>Closes {new Date(deployment.closes_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}</span>
          </div>
        </div>

        {/* Share Survey */}
        {isOpen && (
          <SurveyShareSection
            deploymentId={deployment.id}
            surveyTitle={deployment.title}
          />
        )}

        {/* Response Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Responses
            </h3>
            <p className="text-3xl font-bold text-gray-900">{responseCount || 0}</p>
            <p className="text-sm text-gray-600 mt-1">
              of {memberCount || 0} members
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Response Rate
            </h3>
            <p className="text-3xl font-bold text-gray-900">{responseRate}%</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${responseRate}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Status
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {isOpen ? 'Open' : 'Closed'}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {isOpen
                ? `${Math.ceil((new Date(deployment.closes_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left`
                : 'Survey ended'
              }
            </p>
          </div>
        </div>

        {/* Privacy Notice */}
        {(!responseCount || responseCount < 3) && (
          <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex">
              <svg className="h-5 w-5 text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-semibold text-yellow-900">Waiting for more responses</h3>
                <p className="mt-1 text-sm text-yellow-700">
                  To protect individual privacy, aggregate statistics are only shown when there are
                  at least 3 responses. Currently: {responseCount || 0} response{responseCount !== 1 ? 's' : ''}.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Aggregate Metrics */}
        {responseCount && responseCount >= 3 && template && Object.keys(aggregateMetrics).length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Aggregate Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(aggregateMetrics).map(([metric, stats]) => (
                <div key={metric} className="border border-gray-200 rounded-md p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3 capitalize">
                    {metric.replace(/_/g, ' ')}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-gray-500">Average</span>
                      <span className="text-2xl font-bold text-gray-900">
                        {stats.avg.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Min: {stats.min.toFixed(1)}</span>
                      <span>Max: {stats.max.toFixed(1)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(stats.avg / (template.questions.find(q => q.scoreKey?.includes(metric.split('_')[0]))?.scale?.max || 10)) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Survey Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Survey Details</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Template</h3>
              <p className="text-sm text-gray-900">{survey?.title}</p>
              <p className="text-xs text-gray-500 mt-1">{template?.category} • {survey?.questions.length} questions</p>
            </div>
            {template && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Scoring</h3>
                <p className="text-sm text-gray-600">{template.scoringInstructions}</p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Privacy</h3>
              <p className="text-sm text-gray-600">
                Individual responses are completely anonymous and cannot be viewed.
                Only aggregate statistics (averages, mins, maxes) are displayed, and only when there are at least 3 responses.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
