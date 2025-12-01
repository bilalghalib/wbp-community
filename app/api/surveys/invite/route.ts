import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

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
    const { deploymentId, emails, message } = body

    // Validation
    if (!deploymentId || !emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get deployment to verify permissions
    const { data: deployment, error: deploymentError } = await supabase
      .from('survey_deployments')
      .select(`
        id,
        title,
        organization_id,
        closes_at,
        survey:surveys(title, description)
      `)
      .eq('id', deploymentId)
      .single()

    if (deploymentError || !deployment) {
      return NextResponse.json(
        { error: 'Deployment not found' },
        { status: 404 }
      )
    }

    // Verify user is admin of the organization
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
        { error: 'You do not have permission to send invitations for this organization' },
        { status: 403 }
      )
    }

    // Get survey response URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const surveyUrl = `${appUrl}/surveys/respond/${deploymentId}`

    // Format closing date
    const closingDate = new Date(deployment.closes_at).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })

    // TODO: In production, you would use a proper email service (SendGrid, Resend, etc.)
    // For now, we'll just log the invitation details
    console.log('Survey invitation requested:', {
      deploymentId,
      surveyTitle: deployment.title,
      recipients: emails,
      surveyUrl,
      closingDate,
      customMessage: message,
    })

    // In a real implementation, you would:
    // 1. Use an email service API to send emails
    // 2. Track invitation sends in a database table
    // 3. Include unsubscribe links and proper email templates

    // Example with a hypothetical email service:
    /*
    for (const email of emails) {
      await emailService.send({
        to: email,
        subject: `Survey Invitation: ${deployment.title}`,
        html: generateEmailTemplate({
          surveyTitle: deployment.title,
          surveyDescription: deployment.survey.description,
          surveyUrl,
          closingDate,
          customMessage: message,
        }),
      })
    }
    */

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      organization_id: deployment.organization_id,
      action_type: 'survey.invites_sent',
      details: {
        deployment_id: deploymentId,
        recipient_count: emails.length,
      },
    })

    return NextResponse.json({
      success: true,
      message: `Invitations logged for ${emails.length} email(s). Email sending not yet implemented.`,
      note: 'Email functionality requires configuration of an email service provider.',
    })
  } catch (error) {
    console.error('Survey invitation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
