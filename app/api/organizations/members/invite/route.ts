import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

// Default invitation expiry: 7 days
const INVITATION_EXPIRY_DAYS = 7

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

    // Check if user already has an active membership
    const { data: existingMembership } = await supabase
      .from('organization_memberships')
      .select(`
        id,
        is_active,
        user:users(email)
      `)
      .eq('organization_id', organizationId)
      .single()

    // Check via email in users table
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single()

    if (existingUser) {
      // Check if this user is already a member
      const { data: membership } = await supabase
        .from('organization_memberships')
        .select('id, is_active')
        .eq('organization_id', organizationId)
        .eq('user_id', existingUser.id)
        .single()

      if (membership?.is_active) {
        return NextResponse.json(
          { error: 'This person is already a member of this organization' },
          { status: 400 }
        )
      }

      // Reactivate if previously removed
      if (membership && !membership.is_active) {
        await supabase
          .from('organization_memberships')
          .update({ is_active: true, role })
          .eq('id', membership.id)

        await supabase.from('activity_logs').insert({
          user_id: user.id,
          organization_id: organizationId,
          action_type: 'member.reactivated',
          resource_type: 'organization_membership',
          details: { invited_email: email, role },
        })

        return NextResponse.json({ success: true, message: 'Member reactivated' })
      }
    }

    // Check if there's already a pending invitation for this email
    const { data: existingInvitation } = await supabase
      .from('invitation_tokens')
      .select('id, expires_at')
      .eq('organization_id', organizationId)
      .eq('email', email.toLowerCase())
      .is('accepted_at', null)
      .is('revoked_at', null)
      .single()

    if (existingInvitation) {
      // Check if it's still valid
      if (new Date(existingInvitation.expires_at) > new Date()) {
        return NextResponse.json(
          { error: 'An invitation is already pending for this email. You can resend it from the Pending Invitations list.' },
          { status: 400 }
        )
      }
      // If expired, we'll revoke it and create a new one
      await supabase
        .from('invitation_tokens')
        .update({ revoked_at: new Date().toISOString() })
        .eq('id', existingInvitation.id)
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('base64url')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + INVITATION_EXPIRY_DAYS)

    // Create invitation token
    const { data: invitation, error: inviteError } = await supabase
      .from('invitation_tokens')
      .insert({
        email: email.toLowerCase(),
        full_name,
        organization_id: organizationId,
        role,
        token,
        expires_at: expiresAt.toISOString(),
        invited_by_user_id: user.id,
      })
      .select()
      .single()

    if (inviteError) {
      console.error('Error creating invitation:', inviteError)
      return NextResponse.json(
        { error: 'Failed to create invitation' },
        { status: 500 }
      )
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      organization_id: organizationId,
      action_type: 'member.invited',
      resource_type: 'invitation_token',
      resource_id: invitation.id,
      details: { invited_email: email, role },
    })

    // TODO: Send invitation email via Supabase Magic Link or email service
    // For now, return the accept URL for manual sharing
    const acceptUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/accept-invite?token=${token}`

    return NextResponse.json({
      success: true,
      message: 'Invitation created',
      // In production, remove this - email should be sent instead
      acceptUrl,
    })
  } catch (error) {
    console.error('Error in POST /api/organizations/members/invite:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET pending invitations for an organization
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 400 })
    }

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
        { error: 'Only admins can view invitations' },
        { status: 403 }
      )
    }

    // Fetch all invitations (pending and recent)
    const { data: invitations, error } = await supabase
      .from('invitation_tokens')
      .select(`
        id,
        email,
        full_name,
        role,
        token,
        expires_at,
        accepted_at,
        revoked_at,
        created_at,
        last_sent_at,
        send_count,
        invited_by:users!invited_by_user_id(full_name)
      `)
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching invitations:', error)
      return NextResponse.json({ error: 'Failed to fetch invitations' }, { status: 500 })
    }

    // Categorize invitations
    const now = new Date()
    const categorized = {
      pending: invitations?.filter(i => !i.accepted_at && !i.revoked_at && new Date(i.expires_at) > now) || [],
      expired: invitations?.filter(i => !i.accepted_at && !i.revoked_at && new Date(i.expires_at) <= now) || [],
      accepted: invitations?.filter(i => i.accepted_at) || [],
      revoked: invitations?.filter(i => i.revoked_at) || [],
    }

    return NextResponse.json({ invitations: categorized })
  } catch (error) {
    console.error('Error in GET /api/organizations/members/invite:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH to resend invitation
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { invitationId, action } = await request.json()

    // Get the invitation
    const { data: invitation } = await supabase
      .from('invitation_tokens')
      .select('*, organization:organizations(name)')
      .eq('id', invitationId)
      .single()

    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 })
    }

    // Verify current user is admin of this org
    const { data: currentUserMembership } = await supabase
      .from('organization_memberships')
      .select('role')
      .eq('organization_id', invitation.organization_id)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    const isAdmin = currentUserMembership?.role === 'primary_admin' || currentUserMembership?.role === 'backup_admin'

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Only admins can manage invitations' },
        { status: 403 }
      )
    }

    if (action === 'resend') {
      // Generate new token and extend expiry
      const newToken = crypto.randomBytes(32).toString('base64url')
      const newExpiry = new Date()
      newExpiry.setDate(newExpiry.getDate() + INVITATION_EXPIRY_DAYS)

      const { error } = await supabase
        .from('invitation_tokens')
        .update({
          token: newToken,
          expires_at: newExpiry.toISOString(),
          last_sent_at: new Date().toISOString(),
          send_count: invitation.send_count + 1,
        })
        .eq('id', invitationId)

      if (error) {
        return NextResponse.json({ error: 'Failed to resend invitation' }, { status: 500 })
      }

      // TODO: Send email
      const acceptUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/accept-invite?token=${newToken}`

      await supabase.from('activity_logs').insert({
        user_id: user.id,
        organization_id: invitation.organization_id,
        action_type: 'invitation.resent',
        resource_type: 'invitation_token',
        resource_id: invitationId,
        details: { email: invitation.email },
      })

      return NextResponse.json({
        success: true,
        message: 'Invitation resent',
        acceptUrl,
      })
    }

    if (action === 'revoke') {
      const { error } = await supabase
        .from('invitation_tokens')
        .update({ revoked_at: new Date().toISOString() })
        .eq('id', invitationId)

      if (error) {
        return NextResponse.json({ error: 'Failed to revoke invitation' }, { status: 500 })
      }

      await supabase.from('activity_logs').insert({
        user_id: user.id,
        organization_id: invitation.organization_id,
        action_type: 'invitation.revoked',
        resource_type: 'invitation_token',
        resource_id: invitationId,
        details: { email: invitation.email },
      })

      return NextResponse.json({ success: true, message: 'Invitation revoked' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error in PATCH /api/organizations/members/invite:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
