import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

type PageProps = {
  params: { id: string }
}

export default async function SurveyThanksPage({ params }: PageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get deployment info
  const { data: deployment } = await supabase
    .from('survey_deployments')
    .select(`
      id,
      title,
      organization:organizations(name, slug)
    `)
    .eq('id', params.id)
    .single()

  const organization = Array.isArray(deployment?.organization)
    ? deployment.organization[0]
    : deployment?.organization

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Thank You Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Thank You!
        </h1>
        <p className="text-gray-600 mb-6">
          Your survey response has been submitted successfully.
        </p>

        {/* Privacy Reminder */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 text-left">
          <div className="flex">
            <svg className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-blue-900">Your responses are private</h3>
              <p className="mt-1 text-sm text-blue-700">
                Your individual answers are anonymous and can never be viewed by anyone.
                Only aggregate statistics are shared with organization admins.
              </p>
            </div>
          </div>
        </div>

        {/* Survey Info */}
        {deployment && (
          <div className="text-sm text-gray-600 mb-6">
            Survey: <span className="font-medium text-gray-900">{deployment.title}</span>
            <br />
            Organization: <span className="font-medium text-gray-900">{organization?.name || 'Organization'}</span>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/surveys"
            className="block w-full px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Return to Surveys
          </Link>
          <Link
            href="/dashboard"
            className="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
