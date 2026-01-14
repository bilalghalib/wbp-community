/**
 * Super Admin Configuration
 *
 * Super admins have full platform access including:
 * - /admin dashboard and all sub-pages
 * - Creating organizations
 * - Managing survey seasons
 * - Viewing all activity logs
 *
 * Add emails here to grant super-admin access.
 */

const SUPER_ADMIN_EMAILS = [
  'bg@bilalghalib.com',
  // Add more developer/admin emails as needed
];

const SUPER_ADMIN_DOMAINS = [
  '@wellbeingproject.org',
];

/**
 * Check if an email has super-admin privileges
 */
export function isSuperAdmin(email: string | null | undefined): boolean {
  if (!email) return false;

  // Check specific emails
  if (SUPER_ADMIN_EMAILS.includes(email.toLowerCase())) {
    return true;
  }

  // Check domain patterns
  for (const domain of SUPER_ADMIN_DOMAINS) {
    if (email.toLowerCase().endsWith(domain)) {
      return true;
    }
  }

  return false;
}

/**
 * Get list of super admin emails (for display purposes)
 */
export function getSuperAdminConfig() {
  return {
    emails: SUPER_ADMIN_EMAILS,
    domains: SUPER_ADMIN_DOMAINS,
  };
}
