import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const providerId = params.id
    console.log('PATCH request for provider:', providerId)

    // Fetch the provider to verify ownership
    const { data: provider, error: fetchError } = await supabase
      .from('service_providers')
      .select('created_by_user_id')
      .eq('id', providerId)
      .single()

    console.log('Provider fetch result:', { provider, fetchError })

    if (fetchError || !provider) {
      console.error('Provider not found:', fetchError)
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      )
    }

    // Check if user is the one who added this provider
    if (provider.created_by_user_id !== user.id) {
      console.log('Permission denied:', { provider_creator: provider.created_by_user_id, current_user: user.id })
      return NextResponse.json(
        { error: 'You can only edit providers you have added' },
        { status: 403 }
      )
    }

    const body = await request.json()
    console.log('Update body:', body)
    const {
      full_name,
      email,
      phone,
      website_url,
      photo_url,
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
    } = body

    // Update provider
    console.log('Attempting update...')
    const { error: updateError } = await supabase
      .from('service_providers')
      .update({
        full_name,
        email: email || null,
        phone: phone || null,
        website_url: website_url || null,
        photo_url: photo_url || null,
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
        last_edited_by_user_id: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', providerId)

    console.log('Update result:', { updateError })

    if (updateError) {
      console.error('Error updating provider:', updateError)
      return NextResponse.json(
        { error: 'Failed to update provider' },
        { status: 500 }
      )
    }

    // Log activity (get user's first active organization for context)
    const { data: userOrg } = await supabase
      .from('organization_memberships')
      .select('organization_id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .limit(1)
      .single()

    if (userOrg) {
      await supabase.from('activity_logs').insert({
        user_id: user.id,
        organization_id: userOrg.organization_id,
        action_type: 'service_provider.updated',
        resource_type: 'service_provider',
        resource_id: providerId,
        details: {
          provider_name: full_name,
        },
      })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error in service provider PATCH API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
