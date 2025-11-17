import { vi } from 'vitest'

/**
 * Mock Supabase client for testing
 * Provides chainable methods that mimic Supabase client API
 */
export function createMockSupabaseClient(mockData: any = {}) {
  const mockSelect = vi.fn().mockReturnThis()
  const mockInsert = vi.fn().mockReturnThis()
  const mockUpdate = vi.fn().mockReturnThis()
  const mockDelete = vi.fn().mockReturnThis()
  const mockEq = vi.fn().mockReturnThis()
  const mockIn = vi.fn().mockReturnThis()
  const mockContains = vi.fn().mockReturnThis()
  const mockOrder = vi.fn().mockReturnThis()
  const mockSingle = vi.fn().mockResolvedValue({ data: mockData, error: null })
  const mockLimit = vi.fn().mockReturnThis()
  const mockRange = vi.fn().mockReturnThis()

  const mockFrom = vi.fn((table: string) => ({
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
    eq: mockEq,
    in: mockIn,
    contains: mockContains,
    order: mockOrder,
    single: mockSingle,
    limit: mockLimit,
    range: mockRange,
  }))

  return {
    from: mockFrom,
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: mockData.user || null },
        error: null,
      }),
      getSession: vi.fn().mockResolvedValue({
        data: { session: mockData.session || null },
        error: null,
      }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
    storage: {
      from: vi.fn((bucket: string) => ({
        upload: vi.fn().mockResolvedValue({ data: { path: 'test-path' }, error: null }),
        getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'https://example.com/test.pdf' } })),
        createSignedUrl: vi.fn().mockResolvedValue({ data: { signedUrl: 'https://example.com/signed' }, error: null }),
        remove: vi.fn().mockResolvedValue({ data: null, error: null }),
      })),
    },
    rpc: vi.fn().mockResolvedValue({ data: mockData.rpcData || {}, error: null }),
    mockSelect,
    mockInsert,
    mockUpdate,
    mockDelete,
    mockEq,
    mockIn,
    mockContains,
    mockOrder,
    mockSingle,
    mockLimit,
    mockRange,
    mockFrom,
  }
}

/**
 * Mock user for testing
 */
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  full_name: 'Test User',
  created_at: '2025-01-01T00:00:00Z',
}

/**
 * Mock organization for testing
 */
export const mockOrganization = {
  id: 'test-org-id',
  name: 'Test Organization',
  slug: 'test-org',
  is_active: true,
  created_at: '2025-01-01T00:00:00Z',
}

/**
 * Mock membership for testing
 */
export const mockMembership = {
  id: 'test-membership-id',
  user_id: mockUser.id,
  organization_id: mockOrganization.id,
  role: 'primary_admin',
  is_active: true,
  created_at: '2025-01-01T00:00:00Z',
}

/**
 * Mock service provider for testing
 */
export const mockServiceProvider = {
  id: 'test-provider-id',
  full_name: 'Dr. Jane Smith',
  specialties: ['Trauma Healing', 'Burnout'],
  modalities: ['Somatic Therapy', 'EMDR'],
  languages: ['English', 'Spanish'],
  is_accepting_clients: true,
  is_visible: true,
  contact_email: 'jane@example.com',
  created_at: '2025-01-01T00:00:00Z',
}

/**
 * Mock research document for testing
 */
export const mockResearchDocument = {
  id: 'test-doc-id',
  title: 'Burnout in Social Justice Organizations',
  description: 'A comprehensive study...',
  file_name: 'burnout-study.pdf',
  file_path: 'org-id/123_burnout-study.pdf',
  file_size_bytes: 1024000,
  publication_year: 2024,
  authors: ['Dr. Smith', 'Dr. Jones'],
  tags: ['Burnout', 'Collective Care'],
  topics: ['Mental Health', 'Organizational Health'],
  research_type: 'Research Report',
  visibility_level: 'network',
  organization_id: mockOrganization.id,
  uploaded_by_user_id: mockUser.id,
  created_at: '2025-01-01T00:00:00Z',
}

/**
 * Mock survey deployment for testing
 */
export const mockSurveyDeployment = {
  id: 'test-deployment-id',
  title: 'Q1 2025 Burnout Check',
  survey_id: 'test-survey-id',
  organization_id: mockOrganization.id,
  deployed_by_user_id: mockUser.id,
  closes_at: '2025-12-31T00:00:00Z',
  created_at: '2025-01-01T00:00:00Z',
}

/**
 * Mock survey response for testing
 */
export const mockSurveyResponse = {
  id: 'test-response-id',
  deployment_id: mockSurveyDeployment.id,
  user_id: mockUser.id,
  answers: {
    b1: 3,
    b2: 4,
    b3: 3,
    b4: 2,
    b5: 2,
    b6: 4,
    b7: 4,
    b8: 5,
  },
  scores: {
    exhaustion: 3.3,
    cynicism: 2.0,
    efficacy: 4.3,
    burnout_risk: 2.3,
  },
  created_at: '2025-01-02T00:00:00Z',
}
