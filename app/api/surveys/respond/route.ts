import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { getSurveyTemplate } from '@/utils/constants/surveys'

// Calculate scores from answers based on template
function calculateScores(
  answers: Record<string, any>,
  templateId: string
): Record<string, number> {
  const template = getSurveyTemplate(templateId as any)
  if (!template) return {}

  const scores: Record<string, number> = {}

  // For each question with a scoreKey, record the score
  template.questions.forEach(question => {
    if (question.scoreKey && answers[question.id] !== undefined) {
      scores[question.scoreKey] = Number(answers[question.id])
    }
  })

  // Calculate aggregate metrics based on template
  // Burnout Assessment
  if (templateId === 'burnout-assessment') {
    const exhaustion = [
      scores.exhaustion_1,
      scores.exhaustion_2,
      scores.exhaustion_3,
    ].filter(Boolean)
    const cynicism = [scores.cynicism_1, scores.cynicism_2].filter(Boolean)
    const efficacy = [scores.efficacy_1, scores.efficacy_2, scores.efficacy_3].filter(Boolean)

    if (exhaustion.length > 0) {
      scores.exhaustion = exhaustion.reduce((a, b) => a + b, 0) / exhaustion.length
    }
    if (cynicism.length > 0) {
      scores.cynicism = cynicism.reduce((a, b) => a + b, 0) / cynicism.length
    }
    if (efficacy.length > 0) {
      scores.efficacy = efficacy.reduce((a, b) => a + b, 0) / efficacy.length
    }

    // Burnout risk: high exhaustion + high cynicism + low efficacy
    if (scores.exhaustion && scores.cynicism && scores.efficacy) {
      scores.burnout_risk = (scores.exhaustion + scores.cynicism + (6 - scores.efficacy)) / 3
    }
  }

  // Team Wellbeing Check
  if (templateId === 'team-wellbeing-check') {
    const safety = [scores.safety_1, scores.safety_2, scores.safety_3].filter(Boolean)
    const support = [scores.support_1, scores.support_2].filter(Boolean)
    const joy = [scores.joy_1, scores.joy_2].filter(Boolean)

    if (safety.length > 0) {
      scores.psychological_safety = safety.reduce((a, b) => a + b, 0) / safety.length
    }
    if (support.length > 0) {
      scores.team_support = support.reduce((a, b) => a + b, 0) / support.length
    }
    if (joy.length > 0) {
      scores.collective_joy = joy.reduce((a, b) => a + b, 0) / joy.length
    }
  }

  // Organizational Health
  if (templateId === 'organizational-health') {
    const culture = [scores.culture_1, scores.culture_2, scores.culture_3].filter(Boolean)
    const resources = [scores.resources_1].filter(Boolean)
    const leadership = [scores.leadership_1, scores.leadership_2].filter(Boolean)
    const sustainability = [scores.sustainability_1].filter(Boolean)

    if (culture.length > 0) {
      scores.wellbeing_culture = culture.reduce((a, b) => a + b, 0) / culture.length
    }
    if (resources.length > 0) {
      scores.resource_adequacy = resources.reduce((a, b) => a + b, 0) / resources.length
    }
    if (leadership.length > 0) {
      scores.leadership_support = leadership.reduce((a, b) => a + b, 0) / leadership.length
    }
    if (sustainability.length > 0) {
      scores.work_sustainability = sustainability.reduce((a, b) => a + b, 0) / sustainability.length
    }
  }

  // Movement Sustainability
  if (templateId === 'movement-sustainability') {
    const hope = [scores.hope_1, scores.hope_2].filter(Boolean)
    const capacity = [scores.capacity_1].filter(Boolean)
    const resilience = [scores.resilience_1].filter(Boolean)
    const connection = [scores.connection_1].filter(Boolean)
    const sustainability = [scores.sustainability_1].filter(Boolean)

    if (hope.length > 0) {
      scores.hope = hope.reduce((a, b) => a + b, 0) / hope.length
    }
    if (capacity.length > 0) {
      scores.capacity = capacity.reduce((a, b) => a + b, 0) / capacity.length
    }
    if (resilience.length > 0) {
      scores.resilience = resilience.reduce((a, b) => a + b, 0) / resilience.length
    }
    if (connection.length > 0) {
      scores.connection = connection.reduce((a, b) => a + b, 0) / connection.length
    }
    if (sustainability.length > 0) {
      scores.sustainability_score = sustainability.reduce((a, b) => a + b, 0) / sustainability.length
    }
  }

  return scores
}

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
    const { deploymentId, answers } = body

    if (!deploymentId || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get deployment and verify access
    const { data: deployment, error: deploymentError } = await supabase
      .from('survey_deployments')
      .select(`
        id,
        organization_id,
        closes_at,
        survey:surveys(id, template_id)
      `)
      .eq('id', deploymentId)
      .single()

    if (deploymentError || !deployment) {
      return NextResponse.json(
        { error: 'Deployment not found' },
        { status: 404 }
      )
    }

    // Verify user is member of organization
    const { data: membership } = await supabase
      .from('organization_memberships')
      .select('id')
      .eq('user_id', user.id)
      .eq('organization_id', deployment.organization_id)
      .eq('is_active', true)
      .single()

    if (!membership) {
      return NextResponse.json(
        { error: 'You are not a member of this organization' },
        { status: 403 }
      )
    }

    // Check if deployment is still open
    if (new Date(deployment.closes_at) < new Date()) {
      return NextResponse.json(
        { error: 'This survey is closed' },
        { status: 400 }
      )
    }

    // Check if user already responded
    const { data: existingResponse } = await supabase
      .from('survey_responses')
      .select('id')
      .eq('survey_deployment_id', deploymentId)
      .eq('respondent_id', user.id)
      .single()

    if (existingResponse) {
      return NextResponse.json(
        { error: 'You have already responded to this survey' },
        { status: 400 }
      )
    }

    // Calculate scores based on template
    const scores = calculateScores(answers, deployment.survey.template_id)

    // Insert response
    const { data: response, error: responseError } = await supabase
      .from('survey_responses')
      .insert({
        survey_deployment_id: deploymentId,
        respondent_id: user.id,
        answers,
        scores,
      })
      .select('id')
      .single()

    if (responseError) {
      console.error('Error creating response:', responseError)
      return NextResponse.json(
        { error: 'Failed to submit survey response' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      responseId: response.id,
    })
  } catch (error) {
    console.error('Survey response error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
