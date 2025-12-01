import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SurveyDeploymentForm from '@/components/surveys/survey-deployment-form'
import { SURVEY_TEMPLATES, getSurveyTemplate } from '@/utils/constants/surveys'

type PageProps = {
  searchParams: { template?: string }
}

export default async function DeploySurveyPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check user has admin role in at least one organization
  const { data: adminMemberships } = await supabase
    .from('organization_memberships')
    .select('id, role, organization:organizations(id, name, slug)')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .in('role', ['primary_admin', 'backup_admin'])

  if (!adminMemberships || adminMemberships.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Restricted</h1>
          <p className="mt-2 text-gray-600">
            You must be an admin to deploy surveys.
          </p>
          <Link href="/surveys" className="mt-4 inline-block text-blue-600 hover:text-blue-500">
            Return to Surveys
          </Link>
        </div>
      </div>
    )
  }

  const organizations = adminMemberships
    .map((m) => m.organization?.[0])
    .filter((org): org is { id: string; name: string; slug: string } => Boolean(org))
    .map((org) => ({
      id: org.id,
      name: org.name,
      slug: org.slug,
    }))

  // Get selected template if provided
  const selectedTemplate = searchParams.template
    ? getSurveyTemplate(searchParams.template as any)
    : undefined

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Deploy Survey</h1>
          <p className="mt-2 text-gray-600">
            Send a wellbeing assessment to your organization members
          </p>
        </div>

        {selectedTemplate ? (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900">{selectedTemplate.title}</h3>
            <p className="text-sm text-blue-700 mt-1">{selectedTemplate.description}</p>
            <p className="text-xs text-blue-600 mt-2">
              {selectedTemplate.questions.length} questions • ~{selectedTemplate.estimatedMinutes} minutes • {selectedTemplate.category}
            </p>
          </div>
        ) : (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              No template selected. Choose a template below to continue.
            </p>
          </div>
        )}

        <SurveyDeploymentForm
          userId={user.id}
          organizations={organizations}
          selectedTemplateId={selectedTemplate?.id}
          templates={SURVEY_TEMPLATES}
        />
      </main>
    </div>
  )
}
