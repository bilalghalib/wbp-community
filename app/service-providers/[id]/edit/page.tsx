import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import AddProviderForm from '@/components/providers/add-provider-form'

export default async function EditProviderPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch provider
  const { data: provider, error } = await supabase
    .from('service_providers')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !provider) {
    notFound()
  }

  // Check if user is the one who added this provider
  if (provider.created_by_user_id !== user.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="mt-2 text-gray-600">
            You can only edit service providers you've added.
          </p>
          <a href={`/service-providers/${params.id}`} className="mt-4 inline-block text-blue-600 hover:text-blue-500">
            Back to Provider
          </a>
        </div>
      </div>
    )
  }

  // Get user's active organizations for the form
  const { data: memberships } = await supabase
    .from('organization_memberships')
    .select(`
      id,
      role,
      organization:organizations(id, name, slug)
    `)
    .eq('user_id', user.id)
    .eq('is_active', true)

  if (!memberships || memberships.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Organization Access Required</h1>
          <p className="mt-2 text-gray-600">
            You need to be a member of an organization to edit providers.
          </p>
          <a href="/service-providers" className="mt-4 inline-block text-blue-600 hover:text-blue-500">
            Back to Providers
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <a href={`/service-providers/${params.id}`} className="text-sm text-gray-700 hover:text-gray-900">
              ← Back to provider
            </a>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Service Provider</h1>
          <p className="mt-2 text-gray-600">
            Update information for {provider.full_name}
          </p>
        </div>

        <AddProviderForm
          userId={user.id}
          organizations={memberships.map(m => m.organization).filter(Boolean)}
          existingProvider={provider}
          isEditing={true}
        />
      </main>
    </div>
  )
}
