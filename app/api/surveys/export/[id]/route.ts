import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { getSurveyTemplate } from '@/utils/constants/surveys'

type RouteContext = {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const deploymentId = params.id
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'json'

    // Get deployment
    const { data: deployment, error } = await supabase
      .from('survey_deployments')
      .select(`
        id,
        title,
        created_at,
        closes_at,
        organization_id,
        organization:organizations(name, slug),
        survey:surveys(id, template_id, title, description, category)
      `)
      .eq('id', deploymentId)
      .single()

    if (error || !deployment) {
      return NextResponse.json(
        { error: 'Deployment not found' },
        { status: 404 }
      )
    }

    // Verify user is admin
    const { data: membership } = await supabase
      .from('organization_memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', deployment.organization_id)
      .eq('is_active', true)
      .in('role', ['primary_admin', 'backup_admin'])
      .single()

    if (!membership) {
      return NextResponse.json(
        { error: 'You do not have permission to export this survey' },
        { status: 403 }
      )
    }

    // Get response count
    const { count: responseCount } = await supabase
      .from('survey_responses')
      .select('*', { count: 'exact', head: true })
      .eq('deployment_id', deploymentId)

    if (!responseCount || responseCount < 3) {
      return NextResponse.json(
        { error: 'Minimum 3 responses required for export (privacy protection)' },
        { status: 400 }
      )
    }

    // Get aggregate statistics using database function
    const { data: allMetrics } = await supabase
      .rpc('get_all_deployment_metrics', { deployment_id_param: deploymentId })

    const survey = Array.isArray(deployment.survey) ? deployment.survey[0] : deployment.survey
    const template = getSurveyTemplate(survey?.template_id)

    // Build export data
    const exportData = {
      survey: {
        deployment_id: deployment.id,
        title: deployment.title,
        template: survey?.title,
        template_id: survey?.template_id,
        category: survey?.category,
        organization: (Array.isArray(deployment.organization) ? deployment.organization[0] : deployment.organization)?.name,
        deployed_at: deployment.created_at,
        closes_at: deployment.closes_at,
      },
      statistics: {
        total_responses: responseCount,
      },
      aggregate_metrics: allMetrics?.metrics || {},
      privacy_notice: 'Individual responses are never included in exports. Only aggregate statistics are provided to protect respondent privacy.',
      exported_at: new Date().toISOString(),
      exported_by: user.email,
    }

    // Return JSON or CSV based on format
    if (format === 'csv') {
      // Convert metrics to CSV format
      const metrics = allMetrics?.metrics || {}
      const csvRows = [
        ['Metric', 'Average', 'Min', 'Max', 'Count'],
        ...Object.entries(metrics).map(([key, value]: [string, any]) => {
          if (value.error) return null
          return [
            key.replace(/_/g, ' '),
            value.avg?.toFixed(2) || '',
            value.min?.toFixed(2) || '',
            value.max?.toFixed(2) || '',
            value.count || '',
          ]
        }).filter(Boolean),
      ]

      const csv = csvRows.map(row => row!.join(',')).join('\n')

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="survey-results-${deploymentId}.csv"`,
        },
      })
    }

    // Return JSON
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="survey-results-${deploymentId}.json"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
