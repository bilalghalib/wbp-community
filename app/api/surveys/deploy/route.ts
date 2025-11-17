import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { getSurveyTemplate } from '@/utils/constants/surveys'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { organizationId, templateId, title, closesAt } = body

    // Validation
    if (!organizationId || !templateId || !title || !closesAt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify user is admin in the organization
    const { data: membership } = await supabase
      .from('organization_memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .in('role', ['primary_admin', 'backup_admin'])
      .single()

    if (!membership) {
      return NextResponse.json(
        { error: 'You do not have permission to deploy surveys for this organization' },
        { status: 403 }
      )
    }

    // Get survey template
    const template = getSurveyTemplate(templateId)
    if (!template) {
      return NextResponse.json(
        { error: 'Invalid survey template' },
        { status: 400 }
      )
    }

    // Check if survey template exists in database, create if not
    let { data: survey } = await supabase
      .from('surveys')
      .select('id')
      .eq('template_id', templateId)
      .single()

    if (!survey) {
      const { data: newSurvey, error: surveyError } = await supabase
        .from('surveys')
        .insert({
          template_id: templateId,
          title: template.title,
          description: template.description,
          questions: template.questions,
          category: template.category,
        })
        .select('id')
        .single()

      if (surveyError) {
        console.error('Error creating survey:', surveyError)
        return NextResponse.json(
          { error: 'Failed to create survey template' },
          { status: 500 }
        )
      }
      survey = newSurvey
    }

    // Create deployment
    const { data: deployment, error: deploymentError } = await supabase
      .from('survey_deployments')
      .insert({
        survey_id: survey.id,
        organization_id: organizationId,
        deployed_by_user_id: user.id,
        title,
        closes_at: closesAt,
      })
      .select('id')
      .single()

    if (deploymentError) {
      console.error('Error creating deployment:', deploymentError)
      return NextResponse.json(
        { error: 'Failed to deploy survey' },
        { status: 500 }
      )
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      organization_id: organizationId,
      action_type: 'survey.deployed',
      details: {
        deployment_id: deployment.id,
        survey_id: survey.id,
        template_id: templateId,
        title,
        closes_at: closesAt,
      },
    })

    return NextResponse.json({
      success: true,
      deploymentId: deployment.id,
    })
  } catch (error) {
    console.error('Survey deployment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
