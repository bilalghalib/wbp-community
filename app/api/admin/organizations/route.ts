import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { isSuperAdmin } from '@/lib/utils/admin';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if WBP Admin
    const { data: userProfile } = await supabase
      .from('users')
      .select('email')
      .eq('id', user.id)
      .single();

    if (!isSuperAdmin(userProfile?.email)) {
      return NextResponse.json(
        { error: 'Only WBP administrators can create organizations' },
        { status: 403 }
      );
    }

    const { name, slug, description, website_url } = await request.json();

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const { data: existingOrg } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existingOrg) {
      return NextResponse.json(
        { error: 'An organization with this slug already exists' },
        { status: 400 }
      );
    }

    // Create the organization
    const { data: organization, error: insertError } = await supabase
      .from('organizations')
      .insert({
        name,
        slug,
        description,
        website_url,
        is_active: true,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating organization:', insertError);
      return NextResponse.json(
        { error: 'Failed to create organization' },
        { status: 500 }
      );
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      organization_id: organization.id,
      action_type: 'organization.created',
      resource_type: 'organization',
      details: { name, slug },
    });

    return NextResponse.json({
      success: true,
      organization
    });
  } catch (error) {
    console.error('Error in POST /api/admin/organizations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
