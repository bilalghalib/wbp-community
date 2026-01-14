import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import WelcomeChecklist from '@/components/welcome/welcome-checklist'

type PageProps = {
  searchParams: { org?: string }
}

export default async function WelcomeAdminPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile
  const { data: userProfile } = await supabase
    .from('users')
    .select('full_name, has_seen_welcome')
    .eq('id', user.id)
    .single()

  // Find the organization
  let org = null
  let membership = null

  if (searchParams.org) {
    const { data: orgData } = await supabase
      .from('organizations')
      .select('id, name, slug')
      .eq('slug', searchParams.org)
      .single()

    if (orgData) {
      org = orgData

      // Check membership
      const { data: membershipData } = await supabase
        .from('organization_memberships')
        .select('role')
        .eq('organization_id', org.id)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single()

      membership = membershipData
    }
  }

  // If no org specified or user isn't admin, find their admin org
  if (!org || !membership || (membership.role !== 'primary_admin' && membership.role !== 'backup_admin')) {
    const { data: adminMembership } = await supabase
      .from('organization_memberships')
      .select(`
        role,
        organization:organizations(id, name, slug)
      `)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .in('role', ['primary_admin', 'backup_admin'])
      .limit(1)
      .single()

    if (adminMembership?.organization) {
      const orgData = Array.isArray(adminMembership.organization)
        ? adminMembership.organization[0]
        : adminMembership.organization
      org = orgData
      membership = { role: adminMembership.role }
    }
  }

  if (!org) {
    // Not an admin of any organization
    redirect('/dashboard')
  }

  // Get checklist progress data
  const { count: memberCount } = await supabase
    .from('organization_memberships')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', org.id)
    .eq('is_active', true)

  const { count: backupAdminCount } = await supabase
    .from('organization_memberships')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', org.id)
    .eq('role', 'backup_admin')
    .eq('is_active', true)

  const { count: practitionerCount } = await supabase
    .from('service_provider_recommendations')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', org.id)

  const { count: resourceCount } = await supabase
    .from('research_documents')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', org.id)

  const checklistProgress = {
    hasBackupAdmin: (backupAdminCount || 0) > 0,
    hasInvitedTeam: (memberCount || 0) >= 3,
    hasSharedPractitioner: (practitionerCount || 0) > 0,
    hasSharedResource: (resourceCount || 0) > 0,
  }

  const firstName = userProfile?.full_name?.split(' ')[0] || 'there'

  return (
    <div className="min-h-screen bg-[#FBFBFC]">
      <div className="max-w-3xl mx-auto py-16 px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-[#2C3E50] mb-4">
            Welcome to Springboard, {firstName}
          </h1>
          <p className="text-xl text-[#5D6D7E]">
            You&apos;re now the primary admin for <span className="font-semibold text-[#2C3E50]">{org.name}</span>.
          </p>
        </div>

        {/* What you can do */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-lg font-serif text-[#2C3E50] mb-4">As an admin, you can:</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="mt-1 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs">1</span>
              <div>
                <p className="font-medium text-[#2C3E50]">Invite team members</p>
                <p className="text-sm text-gray-500">We recommend adding a backup admin in case you&apos;re unavailable</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs">2</span>
              <div>
                <p className="font-medium text-[#2C3E50]">Share practitioners your team trusts</p>
                <p className="text-sm text-gray-500">Help others find therapists, coaches, and healers</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs">3</span>
              <div>
                <p className="font-medium text-[#2C3E50]">Upload resources that could help others</p>
                <p className="text-sm text-gray-500">Toolkits, guides, research - anything valuable</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs">4</span>
              <div>
                <p className="font-medium text-[#2C3E50]">Deploy wellbeing surveys to your team</p>
                <p className="text-sm text-gray-500">Anonymous assessments with aggregate-only results</p>
              </div>
            </li>
          </ul>
        </div>

        {/* First Steps Checklist */}
        <WelcomeChecklist
          organizationSlug={org.slug}
          progress={checklistProgress}
        />

        {/* Get Started Button */}
        <div className="text-center mt-8">
          <Link
            href={`/organizations/${org.slug}/members`}
            className="inline-flex items-center px-8 py-4 bg-[#2C3E50] text-white rounded-xl hover:bg-[#1a252f] transition-colors font-medium text-lg"
          >
            Get Started
          </Link>
          <p className="mt-4 text-sm text-gray-400">
            You can always return to this page from your dashboard
          </p>
        </div>

        {/* Quote */}
        <div className="mt-16 text-center">
          <blockquote className="text-lg italic text-gray-500 max-w-xl mx-auto">
            &ldquo;We don&apos;t heal in isolation, but in community. When we share what sustains us, we create a reservoir of resilience for the whole.&rdquo;
          </blockquote>
          <p className="mt-2 text-sm text-gray-400">— S. Kelley Harrell</p>
        </div>
      </div>
    </div>
  )
}
