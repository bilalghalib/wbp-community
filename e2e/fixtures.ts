import { test as base, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

/**
 * Extended test fixtures with authentication helpers
 * This allows us to bypass login and set authenticated state directly
 */

type AuthFixtures = {
  authenticatedPage: Page
  adminPage: Page
  memberPage: Page
}

/**
 * Mock user data for testing
 */
export const testUsers = {
  admin: {
    id: 'admin-user-id',
    email: 'admin@testorg.com',
    full_name: 'Admin User',
    role: 'primary_admin',
  },
  contributor: {
    id: 'contributor-user-id',
    email: 'contributor@testorg.com',
    full_name: 'Contributor User',
    role: 'contributor',
  },
  viewer: {
    id: 'viewer-user-id',
    email: 'viewer@testorg.com',
    full_name: 'Viewer User',
    role: 'viewer',
  },
  wbpAdmin: {
    id: 'wbp-admin-id',
    email: 'admin@wellbeingproject.org',
    full_name: 'WBP Admin',
    role: 'primary_admin',
  },
}

export const testOrganization = {
  id: 'test-org-id',
  name: 'Test Organization',
  slug: 'test-org',
  is_active: true,
}

/**
 * Set authentication state in browser
 * This bypasses the login flow by directly setting session cookies/localStorage
 */
async function setAuthState(page: Page, user: typeof testUsers.admin) {
  // Set mock auth session in localStorage (Supabase auth)
  await page.addInitScript((userData) => {
    const session = {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      expires_at: Date.now() + 3600000,
      user: {
        id: userData.id,
        email: userData.email,
        app_metadata: {},
        user_metadata: {
          full_name: userData.full_name,
        },
      },
    }

    // Set Supabase session in localStorage
    localStorage.setItem(
      'sb-localhost-auth-token',
      JSON.stringify(session)
    )
  }, user)

  // Intercept Supabase API calls and return mock data
  await page.route('**/auth/v1/user', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: user.id,
        email: user.email,
        app_metadata: {},
        user_metadata: {
          full_name: user.full_name,
        },
      }),
    })
  })

  // Mock organization membership check
  await page.route('**/rest/v1/organization_memberships*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: 'membership-id',
          user_id: user.id,
          organization_id: testOrganization.id,
          role: user.role,
          is_active: true,
          organization: testOrganization,
        },
      ]),
    })
  })
}

/**
 * Extended test with authentication fixtures
 */
export const test = base.extend<AuthFixtures>({
  /**
   * Authenticated page with basic user
   */
  authenticatedPage: async ({ page }, use) => {
    await setAuthState(page, testUsers.contributor)
    await use(page)
  },

  /**
   * Page authenticated as organization admin
   */
  adminPage: async ({ page }, use) => {
    await setAuthState(page, testUsers.admin)
    await use(page)
  },

  /**
   * Page authenticated as regular member
   */
  memberPage: async ({ page }, use) => {
    await setAuthState(page, testUsers.viewer)
    await use(page)
  },
})

export { expect }

/**
 * Custom matchers for common assertions
 */
export const assertions = {
  /**
   * Assert user is redirected to login
   */
  async expectLoginRedirect(page: Page) {
    await expect(page).toHaveURL(/\/login/)
  },

  /**
   * Assert access denied message is shown
   */
  async expectAccessDenied(page: Page) {
    await expect(page.getByText(/access restricted/i)).toBeVisible()
  },

  /**
   * Assert successful form submission
   */
  async expectFormSuccess(page: Page) {
    await expect(page.getByText(/success|created|submitted/i)).toBeVisible()
  },

  /**
   * Assert error message is shown
   */
  async expectError(page: Page, message?: string) {
    if (message) {
      await expect(page.getByText(new RegExp(message, 'i'))).toBeVisible()
    } else {
      await expect(page.getByText(/error|failed/i)).toBeVisible()
    }
  },
}
