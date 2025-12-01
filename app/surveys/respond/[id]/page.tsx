import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import SurveyResponseForm from '@/components/surveys/survey-response-form'
import { getSurveyTemplate } from '@/utils/constants/surveys'

type PageProps = {
  params: { id: string }
}

export default async function SurveyResponsePage({ params }: PageProps) {
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
      closes_at,
      organization_id,
      organization:organizations(name, slug),
      survey:surveys(id, template_id, title, description, questions)
    `)
    .eq('id', params.id)
    .single()

  if (error || !deployment) {
    console.error('Error fetching deployment:', error)
    notFound()
  }

  const organization = Array.isArray(deployment.organization)
    ? deployment.organization[0]
    : deployment.organization
  const survey = Array.isArray(deployment.survey)
    ? deployment.survey[0]
    : deployment.survey

  if (!survey) {
    notFound()
  }

  // Check user is member of the organization
  const { data: membership } = await supabase
    .from('organization_memberships')
    .select('id')
    .eq('user_id', user.id)
    .eq('organization_id', deployment.organization_id)
    .eq('is_active', true)
    .single()

  if (!membership) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Restricted</h1>
          <p className="mt-2 text-gray-600">
            This survey is only available to members of {organization?.name || 'this organization'}.
          </p>
          <Link href="/surveys" className="mt-4 inline-block text-blue-600 hover:text-blue-500">
            Return to Surveys
          </Link>
        </div>
      </div>
    )
  }

  // Check if survey is still open
  const closingDate = new Date(deployment.closes_at)
  const isOpen = closingDate > new Date()

  if (!isOpen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Survey Closed</h1>
          <p className="mt-2 text-gray-600">
            This survey closed on {closingDate.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}.
          </p>
          <Link href="/surveys" className="mt-4 inline-block text-blue-600 hover:text-blue-500">
            Return to Surveys
          </Link>
        </div>
      </div>
    )
  }

  // Check if user already responded
  const { data: existingResponse } = await supabase
    .from('survey_responses')
    .select('id, created_at')
    .eq('deployment_id', deployment.id)
    .eq('user_id', user.id)
    .single()

  if (existingResponse) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Already Completed</h1>
          <p className="mt-2 text-gray-600">
            You completed this survey on {new Date(existingResponse.created_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Your responses are anonymous and cannot be viewed individually.
          </p>
          <Link href="/surveys" className="mt-4 inline-block text-blue-600 hover:text-blue-500">
            Return to Surveys
          </Link>
        </div>
      </div>
    )
  }

  // Get template for additional metadata
  const template = getSurveyTemplate(survey.template_id)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <Link href="/surveys" className="text-sm text-gray-700 hover:text-gray-900">
              ← Surveys
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Survey Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{deployment.title}</h1>
          <p className="mt-2 text-gray-600">{survey.description}</p>
          <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
            <span className="inline-flex items-center">
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {organization?.name || 'Organization'}
            </span>
            {template && (
              <>
                <span>•</span>
                <span className="inline-flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  ~{template.estimatedMinutes} minutes
                </span>
              </>
            )}
            <span>•</span>
            <span className="inline-flex items-center">
              Closes {closingDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-blue-900">Your Privacy</h3>
              <p className="mt-1 text-sm text-blue-700">
                Your individual responses are completely anonymous. Only aggregate statistics (averages, counts)
                are visible to organization admins. No one can see your specific answers.
              </p>
            </div>
          </div>
        </div>

        {/* Survey Form */}
        <SurveyResponseForm
          deploymentId={deployment.id}
          userId={user.id}
          questions={survey.questions}
          templateId={survey.template_id}
        />
      </main>
    </div>
  )
}
