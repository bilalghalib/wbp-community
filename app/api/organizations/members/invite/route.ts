import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { organizationId, organizationName, email, full_name, role } = await request.json()

    // Verify current user is admin of this org
    const { data: currentUserMembership } = await supabase
      .from('organization_memberships')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    const isAdmin = currentUserMembership?.role === 'primary_admin' || currentUserMembership?.role === 'backup_admin'

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Only admins can invite members' },
        { status: 403 }
      )
    }

    // Use admin client for auth operations
    const adminClient = createAdminClient()
    
    // Check if user already exists in auth.users
    const { data: existingAuthUser } = await adminClient.auth.admin.listUsers()
    const authUser = existingAuthUser?.users.find(u => u.email === email)

    let userId: string

    if (authUser) {
      // User exists - check if already a member of this org
      const { data: existingMembership } = await supabase
        .from('organization_memberships')
        .select('id, is_active')
        .eq('organization_id', organizationId)
        .eq('user_id', authUser.id)
        .single()

      if (existingMembership && existingMembership.is_active) {
        return NextResponse.json(
          { error: 'This person is already a member of this organization' },
          { status: 400 }
        )
      }

      // Reactivate if previously removed
      if (existingMembership && !existingMembership.is_active) {
        await supabase
          .from('organization_memberships')
          .update({ is_active: true, role })
          .eq('id', existingMembership.id)

        return NextResponse.json({ success: true, message: 'Member reactivated' })
      }

      userId = authUser.id

      // Create user profile if doesn't exist
      const { data: existingProfile } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single()

      if (!existingProfile) {
        await supabase.from('users').insert({
          id: userId,
          email,
          full_name,
          email_confirmed_at: authUser.email_confirmed_at,
        })
      }
    } else {
      // Create new user in Supabase Auth
      // Note: In production, you'd send an invitation email instead
      // For now, creating a user with a temporary password they'll need to reset
      const { data: newAuthUser, error: authError } = await adminClient.auth.admin.createUser({
        email,
        email_confirm: true, // Auto-confirm for MVP
        user_metadata: { full_name },
      })

      if (authError || !newAuthUser.user) {
        console.error('Error creating auth user:', authError)
        return NextResponse.json(
          { error: 'Failed to create user account' },
          { status: 500 }
        )
      }

      userId = newAuthUser.user.id

      // Create user profile
      await supabase.from('users').insert({
        id: userId,
        email,
        full_name,
        email_confirmed_at: new Date().toISOString(),
      })
    }

    // Create organization membership
    const { error: membershipError } = await supabase
      .from('organization_memberships')
      .insert({
        organization_id: organizationId,
        user_id: userId,
        role,
        invited_by_user_id: user.id,
        invitation_accepted_at: authUser ? new Date().toISOString() : null, // Auto-accept if existing user
      })

    if (membershipError) {
      console.error('Error creating membership:', membershipError)
      return NextResponse.json(
        { error: 'Failed to create membership' },
        { status: 500 }
      )
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      organization_id: organizationId,
      action_type: 'member.invited',
      resource_type: 'organization_membership',
      details: { invited_email: email, role },
    })

    // TODO: In production, send invitation email here
    // For now, user is auto-added

    return NextResponse.json({
      success: true,
      message: authUser ? 'Member added successfully' : 'Invitation sent',
    })
  } catch (error) {
    console.error('Error in POST /api/organizations/members/invite:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
