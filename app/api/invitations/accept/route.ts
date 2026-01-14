import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token) {
      return NextResponse.json({ error: 'Invitation token required' }, { status: 400 })
    }

    if (!password || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const supabase = await createClient()

    // Validate the invitation token
    const { data: validationResult, error: validationError } = await supabase
      .rpc('check_invitation_token', { token_param: token })

    if (validationError) {
      console.error('Error validating token:', validationError)
      return NextResponse.json({ error: 'Failed to validate invitation' }, { status: 500 })
    }

    const validation = validationResult?.[0]

    if (!validation?.is_valid) {
      return NextResponse.json({
        error: validation?.error_message || 'Invalid invitation'
      }, { status: 400 })
    }

    // Get the full invitation details
    const { data: invitation } = await supabase
      .from('invitation_tokens')
      .select('*')
      .eq('id', validation.invitation_id)
      .single()

    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 })
    }

    // Create user in Supabase Auth using admin client
    let adminClient
    try {
      adminClient = createAdminClient()
    } catch (error) {
      console.error('Failed to create admin client:', error)
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Check if user already exists
    const { data: existingAuthUsers } = await adminClient.auth.admin.listUsers()
    const existingAuthUser = existingAuthUsers?.users.find(u => u.email === invitation.email)

    let userId: string

    if (existingAuthUser) {
      // User exists in auth - just update their password
      const { error: updateError } = await adminClient.auth.admin.updateUserById(
        existingAuthUser.id,
        { password }
      )

      if (updateError) {
        console.error('Error updating user password:', updateError)
        return NextResponse.json({ error: 'Failed to set password' }, { status: 500 })
      }

      userId = existingAuthUser.id

      // Ensure user profile exists
      const { data: existingProfile } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single()

      if (!existingProfile) {
        await supabase.from('users').insert({
          id: userId,
          email: invitation.email,
          full_name: invitation.full_name,
          email_confirmed_at: new Date().toISOString(),
        })
      }
    } else {
      // Create new user
      const { data: newAuthUser, error: authError } = await adminClient.auth.admin.createUser({
        email: invitation.email,
        password,
        email_confirm: true,
        user_metadata: { full_name: invitation.full_name },
      })

      if (authError || !newAuthUser.user) {
        console.error('Error creating user:', authError)
        return NextResponse.json({
          error: authError?.message || 'Failed to create account'
        }, { status: 500 })
      }

      userId = newAuthUser.user.id

      // Create user profile
      await supabase.from('users').insert({
        id: userId,
        email: invitation.email,
        full_name: invitation.full_name,
        email_confirmed_at: new Date().toISOString(),
      })
    }

    // Create organization membership
    const { error: membershipError } = await supabase
      .from('organization_memberships')
      .insert({
        organization_id: invitation.organization_id,
        user_id: userId,
        role: invitation.role,
        invited_by_user_id: invitation.invited_by_user_id,
        invitation_accepted_at: new Date().toISOString(),
      })

    if (membershipError) {
      // Check if it's a duplicate
      if (membershipError.code === '23505') {
        // Already a member - just update
        await supabase
          .from('organization_memberships')
          .update({
            is_active: true,
            role: invitation.role,
            invitation_accepted_at: new Date().toISOString(),
          })
          .eq('organization_id', invitation.organization_id)
          .eq('user_id', userId)
      } else {
        console.error('Error creating membership:', membershipError)
        return NextResponse.json({ error: 'Failed to join organization' }, { status: 500 })
      }
    }

    // Mark invitation as accepted
    await supabase
      .from('invitation_tokens')
      .update({ accepted_at: new Date().toISOString() })
      .eq('id', invitation.id)

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: userId,
      organization_id: invitation.organization_id,
      action_type: 'invitation.accepted',
      resource_type: 'invitation_token',
      resource_id: invitation.id,
    })

    return NextResponse.json({
      success: true,
      organizationSlug: validation.organization_slug,
      isAdmin: invitation.role === 'primary_admin' || invitation.role === 'backup_admin',
    })
  } catch (error) {
    console.error('Error in POST /api/invitations/accept:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET to validate a token without accepting
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: validationResult, error } = await supabase
      .rpc('check_invitation_token', { token_param: token })

    if (error) {
      console.error('Error validating token:', error)
      return NextResponse.json({ error: 'Failed to validate invitation' }, { status: 500 })
    }

    const validation = validationResult?.[0]

    return NextResponse.json({
      isValid: validation?.is_valid || false,
      email: validation?.email,
      fullName: validation?.full_name,
      organizationName: validation?.organization_name,
      role: validation?.role,
      errorMessage: validation?.error_message,
    })
  } catch (error) {
    console.error('Error in GET /api/invitations/accept:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
