import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      userId,
      organizationId,
      full_name,
      email,
      phone,
      website_url,
      bio,
      specialties,
      modalities,
      languages,
      location_city,
      location_region,
      location_country,
      timezone,
      offers_remote,
      offers_in_person,
      is_accepting_clients,
      relationship_note,
      would_recommend_for,
    } = body

    // Verify user has permission
    const { data: membership } = await supabase
      .from('organization_memberships')
      .select('role, permissions')
      .eq('user_id', userId)
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .single()

    if (!membership) {
      return NextResponse.json(
        { error: 'You are not a member of this organization' },
        { status: 403 }
      )
    }

    const isAdmin = membership.role === 'primary_admin' || membership.role === 'backup_admin'
    const hasPermission = membership.permissions?.can_add_service_providers === true
    const isContributor = membership.role === 'contributor'

    if (!isAdmin && !hasPermission && !isContributor) {
      return NextResponse.json(
        { error: 'You do not have permission to add service providers' },
        { status: 403 }
      )
    }

    // Check if provider already exists (by email)
    let providerId: string | null = null

    if (email) {
      const { data: existingProvider } = await supabase
        .from('service_providers')
        .select('id')
        .eq('email', email)
        .single()

      if (existingProvider) {
        providerId = existingProvider.id

        // Check if this org already recommended this provider
        const { data: existingRec } = await supabase
          .from('service_provider_recommendations')
          .select('id')
          .eq('service_provider_id', providerId)
          .eq('organization_id', organizationId)
          .single()

        if (existingRec) {
          return NextResponse.json(
            { error: 'Your organization has already recommended this provider' },
            { status: 400 }
          )
        }
      }
    }

    // Create provider if doesn't exist
    if (!providerId) {
      const { data: newProvider, error: providerError } = await supabase
        .from('service_providers')
        .insert({
          full_name,
          email: email || null,
          phone: phone || null,
          website_url: website_url || null,
          bio: bio || null,
          specialties,
          modalities,
          languages,
          location_city: location_city || null,
          location_region: location_region || null,
          location_country: location_country || null,
          timezone: timezone || null,
          offers_remote,
          offers_in_person,
          is_accepting_clients,
          is_visible: true,
          created_by_user_id: userId,
          last_edited_by_user_id: userId,
        })
        .select('id')
        .single()

      if (providerError) {
        console.error('Error creating provider:', providerError)
        return NextResponse.json(
          { error: 'Failed to create provider' },
          { status: 500 }
        )
      }

      providerId = newProvider.id
    }

    // Create recommendation
    const { error: recError } = await supabase
      .from('service_provider_recommendations')
      .insert({
        service_provider_id: providerId,
        organization_id: organizationId,
        recommended_by_user_id: userId,
        relationship_note: relationship_note || null,
        would_recommend_for,
      })

    if (recError) {
      console.error('Error creating recommendation:', recError)
      return NextResponse.json(
        { error: 'Failed to create recommendation' },
        { status: 500 }
      )
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: userId,
      organization_id: organizationId,
      action_type: 'service_provider.recommended',
      resource_type: 'service_provider',
      resource_id: providerId,
      details: {
        provider_name: full_name,
        has_relationship_note: !!relationship_note,
      },
    })

    return NextResponse.json({ providerId }, { status: 201 })
  } catch (error) {
    console.error('Error in service provider API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
