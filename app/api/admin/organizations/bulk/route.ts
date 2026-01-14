import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { isSuperAdmin } from '@/lib/utils/admin'
import crypto from 'crypto'

const INVITATION_EXPIRY_DAYS = 7

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify super admin
    const { data: userProfile } = await supabase
      .from('users')
      .select('email')
      .eq('id', user.id)
      .single()

    if (!isSuperAdmin(userProfile?.email)) {
      return NextResponse.json({ error: 'Super admin access required' }, { status: 403 })
    }

    const { org_name, org_slug, admin_email, admin_name, website } = await request.json()

    // Validate required fields
    if (!org_name || !admin_email || !admin_name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if slug already exists
    const { data: existingOrg } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', org_slug)
      .single()

    if (existingOrg) {
      return NextResponse.json({ error: 'Organization slug already exists' }, { status: 400 })
    }

    // Create organization
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: org_name,
        slug: org_slug,
        website_url: website || null,
        created_by_user_id: user.id,
      })
      .select()
      .single()

    if (orgError) {
      console.error('Error creating organization:', orgError)
      return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 })
    }

    // Check if admin user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', admin_email.toLowerCase())
      .single()

    if (existingUser) {
      // Create membership directly
      const { error: membershipError } = await supabase
        .from('organization_memberships')
        .insert({
          organization_id: org.id,
          user_id: existingUser.id,
          role: 'primary_admin',
          invited_by_user_id: user.id,
          invitation_accepted_at: new Date().toISOString(),
        })

      if (membershipError) {
        console.error('Error creating membership:', membershipError)
        // Don't fail - org was created
      }
    } else {
      // Create invitation token for new user
      const token = crypto.randomBytes(32).toString('base64url')
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + INVITATION_EXPIRY_DAYS)

      const { error: inviteError } = await supabase
        .from('invitation_tokens')
        .insert({
          email: admin_email.toLowerCase(),
          full_name: admin_name,
          organization_id: org.id,
          role: 'primary_admin',
          token,
          expires_at: expiresAt.toISOString(),
          invited_by_user_id: user.id,
        })

      if (inviteError) {
        console.error('Error creating invitation:', inviteError)
        // Don't fail - org was created
      }
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      organization_id: org.id,
      action_type: 'organization.created_bulk',
      resource_type: 'organization',
      resource_id: org.id,
      details: {
        org_name,
        admin_email,
        method: 'bulk_import',
      },
    })

    return NextResponse.json({
      success: true,
      organization: { id: org.id, slug: org.slug },
    })
  } catch (error) {
    console.error('Error in POST /api/admin/organizations/bulk:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
