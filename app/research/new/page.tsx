import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ResearchUploadForm from '@/components/research/research-upload-form'

export default async function NewResearchPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check user has contributor or admin role in at least one organization
  const { data: memberships } = await supabase
    .from('organization_memberships')
    .select('id, role, organization:organizations(id, name, slug)')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .in('role', ['contributor', 'primary_admin', 'backup_admin'])

  if (!memberships || memberships.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Restricted</h1>
          <p className="mt-2 text-gray-600">
            You must be a contributor or admin in an organization to upload resources.
          </p>
          <Link href="/research" className="mt-4 inline-block text-blue-600 hover:text-blue-500">
              Return to Resources
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <Link href="/research" className="text-sm text-gray-700 hover:text-gray-900">
              ← Resources
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload Resource</h1>
          <p className="mt-2 text-gray-600">
            Share resources, reports, or documents with the network
          </p>
        </div>

        <ResearchUploadForm
          userId={user.id}
          organizations={memberships
            .map((m) => m.organization?.[0])
            .filter((org): org is { id: string; name: string; slug: string } => Boolean(org))
            .map((org) => ({
              id: org.id,
              name: org.name,
              slug: org.slug,
            }))}
        />
      </main>
    </div>
  )
}
