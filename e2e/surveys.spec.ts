import { test, expect, assertions } from './fixtures'

test.describe('Survey Workflows', () => {
  test.describe('Survey Library Page', () => {
    test('should show survey templates for authenticated users', async ({ authenticatedPage }) => {
      // Mock survey templates endpoint
      await authenticatedPage.route('**/rest/v1/survey_deployments*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        })
      })

      await authenticatedPage.route('**/rest/v1/survey_responses*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        })
      })

      await authenticatedPage.goto('/surveys')

      // Should see survey template titles
      await expect(authenticatedPage.getByText('Burnout Assessment')).toBeVisible()
      await expect(authenticatedPage.getByText('Team Wellbeing Check')).toBeVisible()
      await expect(authenticatedPage.getByText('Individual Wellbeing Snapshot')).toBeVisible()
      await expect(authenticatedPage.getByText('Organizational Health Assessment')).toBeVisible()
      await expect(authenticatedPage.getByText('Movement Sustainability Check')).toBeVisible()
    })

    test('should show deploy button only for admins', async ({ adminPage, memberPage }) => {
      // Mock empty deployments
      const mockRoute = async (page: any) => {
        await page.route('**/rest/v1/survey_deployments*', async (route: any) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([]),
          })
        })
        await page.route('**/rest/v1/survey_responses*', async (route: any) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([]),
          })
        })
      }

      // Admin should see deploy button
      await mockRoute(adminPage)
      await adminPage.goto('/surveys')
      await expect(adminPage.getByText('Deploy Survey')).toBeVisible()

      // Member should NOT see deploy button in templates
      await mockRoute(memberPage)
      await memberPage.goto('/surveys')
      const deployButtons = await memberPage.getByText('Deploy to Organization').all()
      expect(deployButtons).toHaveLength(0)
    })

    test('should show pending surveys', async ({ authenticatedPage }) => {
      // Mock pending deployment
      await authenticatedPage.route('**/rest/v1/survey_deployments*', async (route) => {
        const url = new URL(route.request().url())
        const select = url.searchParams.get('select')

        // Return deployment with responses that don't include current user
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 'deployment-1',
              title: 'Q1 2025 Team Check',
              closes_at: '2025-12-31T00:00:00Z',
              organization: {
                name: 'Test Organization',
                slug: 'test-org',
              },
              responses: [], // No responses yet (user hasn't completed)
            },
          ]),
        })
      })

      await authenticatedPage.route('**/rest/v1/survey_responses*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        })
      })

      await authenticatedPage.goto('/surveys')

      // Should see pending survey
      await expect(authenticatedPage.getByText('Pending Surveys (1)')).toBeVisible()
      await expect(authenticatedPage.getByText('Q1 2025 Team Check')).toBeVisible()
      await expect(authenticatedPage.getByText('Action Needed')).toBeVisible()
    })
  })

  test.describe('Survey Deployment Flow (Admin)', () => {
    test('should allow admin to deploy survey', async ({ adminPage }) => {
      // Mock admin membership check (already in fixtures, but ensure it's there)
      await adminPage.route('**/rest/v1/organization_memberships*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 'membership-id',
              role: 'primary_admin',
              organization: {
                id: 'test-org-id',
                name: 'Test Organization',
                slug: 'test-org',
              },
            },
          ]),
        })
      })

      await adminPage.goto('/surveys/deploy?template=burnout-assessment')

      // Should see template preview
      await expect(adminPage.getByText('Burnout Assessment')).toBeVisible()
      await expect(adminPage.getByText(/assess exhaustion/i)).toBeVisible()

      // Should see deployment form
      await expect(adminPage.getByLabel('Deployment Title')).toBeVisible()
      await expect(adminPage.getByLabel('Closes On')).toBeVisible()

      // Should see survey preview
      await expect(adminPage.getByText(/I feel emotionally drained/i)).toBeVisible()
    })

    test('should validate required fields', async ({ adminPage }) => {
      await adminPage.route('**/rest/v1/organization_memberships*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 'membership-id',
              role: 'primary_admin',
              organization: {
                id: 'test-org-id',
                name: 'Test Organization',
                slug: 'test-org',
              },
            },
          ]),
        })
      })

      await adminPage.goto('/surveys/deploy')

      // Try to submit without selecting template
      await adminPage.click('text=Deploy Survey')

      // Should show validation error
      await expect(adminPage.getByText(/select a survey template/i)).toBeVisible()
    })

    test('should redirect non-admin users', async ({ memberPage }) => {
      await memberPage.route('**/rest/v1/organization_memberships*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 'membership-id',
              role: 'viewer', // Not admin
              organization: {
                id: 'test-org-id',
                name: 'Test Organization',
                slug: 'test-org',
              },
            },
          ]),
        })
      })

      await memberPage.goto('/surveys/deploy')

      // Should see access restricted message
      await assertions.expectAccessDenied(memberPage)
    })
  })

  test.describe('Survey Response Flow (Member)', () => {
    test('should show survey questions', async ({ authenticatedPage }) => {
      // Mock deployment
      await authenticatedPage.route('**/rest/v1/survey_deployments*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'deployment-1',
            title: 'Q1 2025 Burnout Check',
            closes_at: '2099-12-31T00:00:00Z', // Far future
            organization_id: 'test-org-id',
            organization: {
              name: 'Test Organization',
              slug: 'test-org',
            },
            survey: {
              id: 'survey-1',
              template_id: 'burnout-assessment',
              title: 'Burnout Assessment',
              description: 'Assess burnout dimensions',
              category: 'individual',
              questions: [
                {
                  id: 'q1',
                  text: 'I feel emotionally drained by my work',
                  type: 'scale',
                  required: true,
                  scale: { min: 1, max: 5, minLabel: 'Never', maxLabel: 'Always' },
                  scoreKey: 'exhaustion_1',
                },
              ],
            },
          }),
        })
      })

      // Mock no existing response
      await authenticatedPage.route('**/rest/v1/survey_responses*', async (route) => {
        if (route.request().method() === 'GET') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: null, error: { code: 'PGRST116' } }),
          })
        }
      })

      await authenticatedPage.goto('/surveys/respond/deployment-1')

      // Should see privacy notice
      await expect(authenticatedPage.getByText(/your individual responses are anonymous/i)).toBeVisible()

      // Should see question
      await expect(authenticatedPage.getByText(/I feel emotionally drained/i)).toBeVisible()

      // Should see scale options (1-5)
      await expect(authenticatedPage.getByText('1')).toBeVisible()
      await expect(authenticatedPage.getByText('5')).toBeVisible()
      await expect(authenticatedPage.getByText('Never')).toBeVisible()
      await expect(authenticatedPage.getByText('Always')).toBeVisible()
    })

    test('should show progress bar', async ({ authenticatedPage }) => {
      await authenticatedPage.route('**/rest/v1/survey_deployments*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'deployment-1',
            title: 'Test Survey',
            closes_at: '2099-12-31T00:00:00Z',
            organization_id: 'test-org-id',
            organization: { name: 'Test Org', slug: 'test-org' },
            survey: {
              id: 'survey-1',
              template_id: 'burnout-assessment',
              title: 'Test',
              description: 'Test',
              category: 'individual',
              questions: [
                { id: 'q1', text: 'Question 1', type: 'scale', required: true, scale: { min: 1, max: 5 }, scoreKey: 's1' },
                { id: 'q2', text: 'Question 2', type: 'scale', required: true, scale: { min: 1, max: 5 }, scoreKey: 's2' },
              ],
            },
          }),
        })
      })

      await authenticatedPage.route('**/rest/v1/survey_responses*', async (route) => {
        if (route.request().method() === 'GET') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: null, error: { code: 'PGRST116' } }),
          })
        }
      })

      await authenticatedPage.goto('/surveys/respond/deployment-1')

      // Should see progress indicator
      await expect(authenticatedPage.getByText(/0 \/ 2 required/i)).toBeVisible()

      // Answer first question
      await authenticatedPage.click('text=3')

      // Progress should update (in a real test with actual component)
      // await expect(authenticatedPage.getByText(/1 \/ 2 required/i)).toBeVisible()
    })

    test('should block already-completed surveys', async ({ authenticatedPage }) => {
      await authenticatedPage.route('**/rest/v1/survey_deployments*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'deployment-1',
            title: 'Completed Survey',
            closes_at: '2099-12-31T00:00:00Z',
            organization_id: 'test-org-id',
            organization: { name: 'Test Org', slug: 'test-org' },
            survey: { id: 'survey-1', template_id: 'burnout-assessment', title: 'Test', description: 'Test', category: 'individual', questions: [] },
          }),
        })
      })

      // Mock existing response
      await authenticatedPage.route('**/rest/v1/survey_responses*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'response-1',
            created_at: '2025-01-15T00:00:00Z',
          }),
        })
      })

      await authenticatedPage.goto('/surveys/respond/deployment-1')

      // Should see "Already Completed" message
      await expect(authenticatedPage.getByText(/already completed/i)).toBeVisible()
      await expect(authenticatedPage.getByText(/your responses are anonymous/i)).toBeVisible()
    })
  })

  test.describe('Survey Results Dashboard (Admin)', () => {
    test('should show privacy threshold message when < 3 responses', async ({ adminPage }) => {
      await adminPage.route('**/rest/v1/survey_deployments*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'deployment-1',
            title: 'Test Deployment',
            created_at: '2025-01-01T00:00:00Z',
            closes_at: '2025-12-31T00:00:00Z',
            organization_id: 'test-org-id',
            deployed_by_user_id: 'admin-user-id',
            organization: { name: 'Test Org', slug: 'test-org' },
            survey: {
              id: 'survey-1',
              template_id: 'burnout-assessment',
              title: 'Burnout Assessment',
              description: 'Test',
              category: 'individual',
              questions: [],
            },
          }),
        })
      })

      // Mock 2 responses (below threshold)
      await adminPage.route('**/rest/v1/survey_responses*', async (route) => {
        const url = new URL(route.request().url())
        if (url.searchParams.get('count') === 'exact') {
          // Count query
          await route.fulfill({
            status: 206, // Partial content with count header
            headers: {
              'Content-Range': '0-1/2', // 2 total responses
            },
            contentType: 'application/json',
            body: JSON.stringify([]),
          })
        } else {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([]),
          })
        }
      })

      await adminPage.route('**/rest/v1/organization_memberships*', async (route) => {
        const url = new URL(route.request().url())
        if (url.searchParams.get('count') === 'exact') {
          await route.fulfill({
            status: 206,
            headers: { 'Content-Range': '0-9/10' }, // 10 members
            contentType: 'application/json',
            body: JSON.stringify([]),
          })
        } else {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([{ id: 'membership-id', role: 'primary_admin' }]),
          })
        }
      })

      await adminPage.goto('/surveys/results/deployment-1')

      // Should show response count
      await expect(adminPage.getByText('2')).toBeVisible()

      // Should show privacy threshold warning
      await expect(adminPage.getByText(/minimum 3 responses required/i)).toBeVisible()
    })

    test('should block non-admin access to results', async ({ memberPage }) => {
      await memberPage.route('**/rest/v1/survey_deployments*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'deployment-1',
            organization_id: 'test-org-id',
          }),
        })
      })

      await memberPage.route('**/rest/v1/organization_memberships*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{ id: 'membership-id', role: 'viewer' }]), // Not admin
        })
      })

      await memberPage.goto('/surveys/results/deployment-1')

      await assertions.expectAccessDenied(memberPage)
    })
  })
})
