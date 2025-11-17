import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Update member role
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { membershipId, role } = await request.json()

    // Get the membership being updated
    const { data: membership } = await supabase
      .from('organization_memberships')
      .select('organization_id, user_id')
      .eq('id', membershipId)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'Membership not found' }, { status: 404 })
    }

    // Verify current user is admin of this org
    const { data: currentUserMembership } = await supabase
      .from('organization_memberships')
      .select('role')
      .eq('organization_id', membership.organization_id)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    const isAdmin = currentUserMembership?.role === 'primary_admin' || currentUserMembership?.role === 'backup_admin'

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Only admins can change member roles' },
        { status: 403 }
      )
    }

    // Update role
    const { error } = await supabase
      .from('organization_memberships')
      .update({ role })
      .eq('id', membershipId)

    if (error) {
      console.error('Error updating role:', error)
      return NextResponse.json({ error: 'Failed to update role' }, { status: 500 })
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      organization_id: membership.organization_id,
      action_type: 'member.role_changed',
      resource_type: 'organization_membership',
      resource_id: membershipId,
      details: { new_role: role },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in PATCH /api/organizations/members:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Remove member (soft delete)
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { membershipId } = await request.json()

    // Get the membership being removed
    const { data: membership } = await supabase
      .from('organization_memberships')
      .select('organization_id, user_id')
      .eq('id', membershipId)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'Membership not found' }, { status: 404 })
    }

    // Verify current user is admin
    const { data: currentUserMembership } = await supabase
      .from('organization_memberships')
      .select('role')
      .eq('organization_id', membership.organization_id)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    const isAdmin = currentUserMembership?.role === 'primary_admin' || currentUserMembership?.role === 'backup_admin'

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Only admins can remove members' },
        { status: 403 }
      )
    }

    // Soft delete (set is_active to false)
    const { error } = await supabase
      .from('organization_memberships')
      .update({ is_active: false })
      .eq('id', membershipId)

    if (error) {
      console.error('Error removing member:', error)
      return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 })
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      organization_id: membership.organization_id,
      action_type: 'member.removed',
      resource_type: 'organization_membership',
      resource_id: membershipId,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/organizations/members:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
