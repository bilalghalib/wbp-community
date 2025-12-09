import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')?.trim() || ''

    if (!query || query.length < 2) {
      return NextResponse.json({
        research: [],
        providers: [],
        surveys: [],
        deployments: [],
      })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check user is a network member
    const { data: membership } = await supabase
      .from('organization_memberships')
      .select('id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'Not a network member' }, { status: 403 })
    }

    // Get user's organizations for survey deployments
    const { data: userMemberships } = await supabase
      .from('organization_memberships')
      .select('organization_id')
      .eq('user_id', user.id)
      .eq('is_active', true)

    const orgIds = userMemberships?.map((m) => m.organization_id) || []

    // Search Research Documents (full-text search)
    const { data: researchResults } = await supabase
      .from('research_documents')
      .select(`
        id,
        title,
        description,
        organization:organizations(name, slug)
      `)
      .in('visibility_level', ['network', 'public'])
      .textSearch('tsv', query)
      .order('created_at', { ascending: false })
      .limit(5)

    // Search Service Providers (full-text search)
    const { data: providerResults } = await supabase
      .from('service_providers')
      .select(`
        id,
        full_name,
        bio,
        specialties
      `)
      .eq('is_visible', true)
      .textSearch('tsv', query)
      .order('full_name')
      .limit(5)

    // Search Surveys (pattern matching)
    const { data: surveyResults } = await supabase
      .from('surveys')
      .select(`
        id,
        title,
        description
      `)
      .eq('is_active', true)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(5)

    // Search Survey Deployments
    const { data: deploymentResults } = await supabase
      .from('survey_deployments')
      .select(`
        id,
        title,
        organization:organizations(name, slug)
      `)
      .in('organization_id', orgIds)
      .ilike('title', `%${query}%`)
      .order('created_at', { ascending: false })
      .limit(5)

    return NextResponse.json({
      research: researchResults || [],
      providers: providerResults || [],
      surveys: surveyResults || [],
      deployments: deploymentResults || [],
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}

