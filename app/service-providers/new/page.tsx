import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AddProviderForm from '@/components/providers/add-provider-form'

export default async function NewProviderPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user's active organization memberships
  const { data: memberships } = await supabase
    .from('organization_memberships')
    .select(`
      id,
      role,
      permissions,
      organization:organizations(id, name, slug)
    `)
    .eq('user_id', user.id)
    .eq('is_active', true)

  if (!memberships || memberships.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">No Organization Access</h1>
          <p className="mt-2 text-gray-600">
            You must be a member of an organization to add service providers.
          </p>
          <a href="/dashboard" className="mt-4 inline-block text-blue-600 hover:text-blue-500">
            Return to Dashboard
          </a>
        </div>
      </div>
    )
  }

  // Filter to organizations where user can add providers
  const orgsWithPermission = memberships.filter((m: any) => {
    const isAdmin = m.role === 'primary_admin' || m.role === 'backup_admin'
    const hasPermission = m.permissions?.can_add_service_providers === true
    return isAdmin || hasPermission || m.role === 'contributor'
  })

  if (orgsWithPermission.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Permission Required</h1>
          <p className="mt-2 text-gray-600">
            You don't have permission to add service providers. Contact your organization admin.
          </p>
          <a href="/service-providers" className="mt-4 inline-block text-blue-600 hover:text-blue-500">
            Back to Service Providers
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
            <a href="/service-providers" className="text-sm text-gray-700 hover:text-gray-900">
              ← Back to providers
            </a>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add Service Provider</h1>
          <p className="mt-2 text-gray-600">
            Recommend a therapist, coach, or facilitator you've worked with to the WBP network.
          </p>
        </div>

        <AddProviderForm
          userId={user.id}
          organizations={orgsWithPermission.map((m: any) => m.organization)}
        />
      </main>
    </div>
  )
}
