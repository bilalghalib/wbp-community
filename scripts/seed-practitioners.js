#!/usr/bin/env node

/**
 * Seed script to populate service_providers table with sample practitioners
 * Run with: node scripts/seed-practitioners.js
 */

const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

// Load .env.local manually
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found')
    process.exit(1)
  }

  const envContent = fs.readFileSync(envPath, 'utf8')
  const envVars = {}

  envContent.split('\n').forEach((line) => {
    line = line.trim()
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=')
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim()
        envVars[key.trim()] = value.replace(/^["']|["']$/g, '')
      }
    }
  })

  Object.assign(process.env, envVars)
}

loadEnvFile()

const practitioners = [
  {
    full_name: 'Dr. Maria Rodriguez',
    email: 'maria.rodriguez@therapy.com',
    phone: '+1-510-555-0123',
    website_url: 'https://mariarodriguez.com',
    bio: 'Licensed therapist specializing in trauma healing and racial justice work. Over 15 years of experience supporting activists and organizers in social justice movements.',
    specialties: ['Trauma Healing', 'Racial Justice', 'Burnout', 'Collective Care'],
    modalities: ['Somatic Therapy', 'EMDR', 'Narrative Therapy', 'Group Therapy'],
    languages: ['English', 'Spanish'],
    location_city: 'Oakland',
    location_region: 'California',
    location_country: 'United States',
    timezone: 'America/Los_Angeles',
    offers_remote: true,
    offers_in_person: true,
    is_accepting_clients: true,
    is_visible: true,
    availability_note: 'Currently accepting new clients. Sliding scale available for organizers.',
  },
  {
    full_name: 'James Chen, LCSW',
    email: 'james.chen@wellbeing.org',
    phone: '+1-415-555-0456',
    website_url: 'https://jameschencounseling.com',
    bio: 'Social worker and therapist focused on supporting BIPOC communities, LGBTQ+ individuals, and movement workers. Specializes in addressing intergenerational trauma and building resilience.',
    specialties: ['Trauma Healing', 'LGBTQ+ Support', 'Racial Justice', 'Youth Wellbeing'],
    modalities: ['Cognitive Behavioral Therapy', 'Trauma-Informed Care', 'Mindfulness', 'Family Therapy'],
    languages: ['English', 'Mandarin'],
    location_city: 'San Francisco',
    location_region: 'California',
    location_country: 'United States',
    timezone: 'America/Los_Angeles',
    offers_remote: true,
    offers_in_person: true,
    is_accepting_clients: true,
    is_visible: true,
    availability_note: 'Evening and weekend appointments available.',
  },
  {
    full_name: 'Aisha Williams, LMFT',
    email: 'aisha.williams@healingcollective.org',
    phone: '+1-312-555-0789',
    website_url: null,
    bio: 'Marriage and family therapist with expertise in community healing, grief work, and supporting caregivers. Works extensively with Black communities and movement organizations.',
    specialties: ['Grief Work', 'Community Healing', 'Caregiver Support', 'Collective Care'],
    modalities: ['Family Systems Therapy', 'Grief Counseling', 'Group Therapy', 'Somatic Practices'],
    languages: ['English'],
    location_city: 'Chicago',
    location_region: 'Illinois',
    location_country: 'United States',
    timezone: 'America/Chicago',
    offers_remote: true,
    offers_in_person: true,
    is_accepting_clients: true,
    is_visible: true,
    availability_note: 'Specializes in group healing circles for organizations.',
  },
  {
    full_name: 'Dr. Priya Patel',
    email: 'priya.patel@mindfulhealing.com',
    phone: '+1-646-555-0321',
    website_url: 'https://priyapateltherapy.com',
    bio: 'Clinical psychologist specializing in mindfulness-based interventions, stress management, and supporting South Asian communities. Experienced in working with activists experiencing burnout.',
    specialties: ['Burnout', 'Mindfulness', 'Stress Management', 'Organizational Wellbeing'],
    modalities: ['Mindfulness-Based Therapy', 'Acceptance and Commitment Therapy', 'Meditation', 'Yoga Therapy'],
    languages: ['English', 'Hindi', 'Gujarati'],
    location_city: 'New York',
    location_region: 'New York',
    location_country: 'United States',
    timezone: 'America/New_York',
    offers_remote: true,
    offers_in_person: true,
    is_accepting_clients: true,
    is_visible: true,
    availability_note: 'Offers workshops on mindfulness for organizations.',
  },
  {
    full_name: 'Michael Thompson, LPC',
    email: 'michael.thompson@resiliencecounseling.com',
    phone: '+1-404-555-0654',
    website_url: null,
    bio: 'Licensed professional counselor focused on supporting men in social justice work, addressing toxic masculinity, and building healthy relationships. Works with individuals and groups.',
    specialties: ['Men\'s Mental Health', 'Relationship Counseling', 'Movement Sustainability', 'Leadership Development'],
    modalities: ['Individual Therapy', 'Group Therapy', 'Men\'s Circles', 'Coaching'],
    languages: ['English'],
    location_city: 'Atlanta',
    location_region: 'Georgia',
    location_country: 'United States',
    timezone: 'America/New_York',
    offers_remote: true,
    offers_in_person: false,
    is_accepting_clients: true,
    is_visible: true,
    availability_note: 'Remote only. Specializes in supporting male leaders in social justice organizations.',
  },
  {
    full_name: 'Sofia Martinez, LMHC',
    email: 'sofia.martinez@bilingualtherapy.org',
    phone: '+1-713-555-0987',
    website_url: 'https://sofiamartinezcounseling.com',
    bio: 'Bilingual mental health counselor serving Latinx communities. Specializes in immigration trauma, family separation, and supporting undocumented individuals and families.',
    specialties: ['Immigration Trauma', 'Family Therapy', 'Trauma Healing', 'Community Healing'],
    modalities: ['Trauma-Informed Care', 'Family Systems Therapy', 'Play Therapy', 'Art Therapy'],
    languages: ['English', 'Spanish'],
    location_city: 'Houston',
    location_region: 'Texas',
    location_country: 'United States',
    timezone: 'America/Chicago',
    offers_remote: true,
    offers_in_person: true,
    is_accepting_clients: true,
    is_visible: true,
    availability_note: 'Sliding scale available. Specializes in supporting immigrant communities.',
  },
  {
    full_name: 'Dr. Keiko Tanaka',
    email: 'keiko.tanaka@wellbeingcenter.org',
    phone: '+1-206-555-0147',
    website_url: null,
    bio: 'Psychologist and somatic therapist with expertise in Asian American mental health, intergenerational trauma, and supporting AAPI communities. Combines Western and Eastern healing approaches.',
    specialties: ['Intergenerational Trauma', 'AAPI Mental Health', 'Somatic Practices', 'Cultural Healing'],
    modalities: ['Somatic Therapy', 'Internal Family Systems', 'Mindfulness', 'Bodywork'],
    languages: ['English', 'Japanese'],
    location_city: 'Seattle',
    location_region: 'Washington',
    location_country: 'United States',
    timezone: 'America/Los_Angeles',
    offers_remote: true,
    offers_in_person: true,
    is_accepting_clients: true,
    is_visible: true,
    availability_note: 'Offers workshops on intergenerational healing.',
  },
  {
    full_name: 'Rashid Johnson, LCSW',
    email: 'rashid.johnson@communitycare.org',
    phone: '+1-215-555-0369',
    website_url: 'https://rashidjohnsoncounseling.com',
    bio: 'Social worker and community organizer turned therapist. Specializes in supporting Black men, addressing racial trauma, and building community resilience. Works with individuals and groups.',
    specialties: ['Racial Trauma', 'Men\'s Mental Health', 'Community Healing', 'Movement Building'],
    modalities: ['Group Therapy', 'Community Circles', 'Individual Therapy', 'Coaching'],
    languages: ['English'],
    location_city: 'Philadelphia',
    location_region: 'Pennsylvania',
    location_country: 'United States',
    timezone: 'America/New_York',
    offers_remote: true,
    offers_in_person: true,
    is_accepting_clients: true,
    is_visible: true,
    availability_note: 'Facilitates healing circles for Black men in organizing spaces.',
  },
  {
    full_name: 'Dr. Sarah Kim, PsyD',
    email: 'sarah.kim@traumarecovery.com',
    phone: '+1-503-555-0258',
    website_url: null,
    bio: 'Clinical psychologist specializing in complex trauma, dissociation, and supporting survivors of violence. Works extensively with activists and organizers who have experienced state violence.',
    specialties: ['Complex Trauma', 'Dissociation', 'Survivor Support', 'Trauma Healing'],
    modalities: ['EMDR', 'Somatic Experiencing', 'Internal Family Systems', 'Trauma-Informed Care'],
    languages: ['English', 'Korean'],
    location_city: 'Portland',
    location_region: 'Oregon',
    location_country: 'United States',
    timezone: 'America/Los_Angeles',
    offers_remote: true,
    offers_in_person: true,
    is_accepting_clients: false,
    is_visible: true,
    availability_note: 'Currently at capacity. Waitlist available for fall 2025.',
  },
  {
    full_name: 'Elena Vasquez, LMFT',
    email: 'elena.vasquez@familyhealing.org',
    phone: '+1-602-555-0741',
    website_url: 'https://elenavasquez.com',
    bio: 'Marriage and family therapist specializing in supporting families in social justice movements, addressing secondary trauma in children of activists, and building family resilience.',
    specialties: ['Family Therapy', 'Youth Wellbeing', 'Secondary Trauma', 'Collective Care'],
    modalities: ['Family Systems Therapy', 'Play Therapy', 'Art Therapy', 'Group Therapy'],
    languages: ['English', 'Spanish'],
    location_city: 'Phoenix',
    location_region: 'Arizona',
    location_country: 'United States',
    timezone: 'America/Phoenix',
    offers_remote: true,
    offers_in_person: true,
    is_accepting_clients: true,
    is_visible: true,
    availability_note: 'Specializes in supporting families of organizers and activists.',
  },
  {
    full_name: 'David Park, LPC',
    email: 'david.park@mindfulcounseling.com',
    phone: '+1-303-555-0582',
    website_url: null,
    bio: 'Licensed professional counselor and meditation teacher. Combines therapy with contemplative practices to support activists, organizers, and movement workers in maintaining sustainable practices.',
    specialties: ['Mindfulness', 'Burnout', 'Contemplative Practice', 'Movement Sustainability'],
    modalities: ['Mindfulness-Based Therapy', 'Meditation', 'Individual Therapy', 'Retreats'],
    languages: ['English'],
    location_city: 'Denver',
    location_region: 'Colorado',
    location_country: 'United States',
    timezone: 'America/Denver',
    offers_remote: true,
    offers_in_person: true,
    is_accepting_clients: true,
    is_visible: true,
    availability_note: 'Offers meditation groups for activists and organizers.',
  },
  {
    full_name: 'Dr. Amara Okafor',
    email: 'amara.okafor@healingjustice.org',
    phone: '+1-510-555-0963',
    website_url: 'https://amaraokafor.com',
    bio: 'Therapist and healing justice practitioner. Specializes in supporting Black women, addressing racial and gender-based trauma, and building collective healing practices in movement spaces.',
    specialties: ['Healing Justice', 'Racial Justice', 'Gender Justice', 'Collective Care'],
    modalities: ['Somatic Therapy', 'Group Therapy', 'Healing Circles', 'Community Healing'],
    languages: ['English'],
    location_city: 'Oakland',
    location_region: 'California',
    location_country: 'United States',
    timezone: 'America/Los_Angeles',
    offers_remote: true,
    offers_in_person: true,
    is_accepting_clients: true,
    is_visible: true,
    availability_note: 'Facilitates healing justice circles for Black women in organizing.',
  },
]

async function seedPractitioners() {
  console.log('🌱 Seeding service providers...\n')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !secretKey) {
    console.error('❌ Missing required environment variables')
    console.error('   Need: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY')
    process.exit(1)
  }

  // Create admin client that bypasses RLS
  const supabase = createClient(supabaseUrl, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'apikey': secretKey,
        'Authorization': `Bearer ${secretKey}`,
      },
    },
  })

  // Get a user ID to use as created_by (we'll use the first admin user we find)
  const { data: users } = await supabase.auth.admin.listUsers({ limit: 1 })
  const adminUserId = users?.users?.[0]?.id

  if (!adminUserId) {
    console.error('❌ No users found. Please create at least one user first.')
    process.exit(1)
  }

  // Get user's organization membership to satisfy RLS
  const { data: memberships } = await supabase
    .from('organization_memberships')
    .select('organization_id, role')
    .eq('user_id', adminUserId)
    .eq('is_active', true)
    .limit(1)

  if (!memberships || memberships.length === 0) {
    console.error('❌ Admin user is not a member of any organization.')
    console.error('   The secret key should bypass RLS, but if it doesn\'t, we need a user with membership.')
    console.error('   Trying to create providers anyway with admin privileges...\n')
  } else {
    const membership = memberships[0]
    console.log(`📝 Using admin user ID: ${adminUserId}`)
    console.log(`📝 User is ${membership.role} of organization: ${membership.organization_id}\n`)
  }

  // Create a session for the admin user to satisfy RLS policies
  // The secret key should bypass RLS, but if it doesn't, we'll use a user session
  let userClient = supabase
  let useUserSession = false

  if (memberships && memberships.length > 0) {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.admin.createSession({
        user_id: adminUserId,
      })

      if (!sessionError && sessionData?.session) {
        // Create a client with the user's session
        userClient = createClient(supabaseUrl, secretKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
          global: {
            headers: {
              Authorization: `Bearer ${sessionData.session.access_token}`,
            },
          },
        })
        useUserSession = true
        console.log('✅ Created user session for RLS compliance\n')
      }
    } catch (error) {
      console.log('⚠️  Could not create user session, using admin client directly\n')
    }
  }

  let successCount = 0
  let errorCount = 0

  for (const practitioner of practitioners) {
    try {
      // Check if practitioner already exists (by email)
      if (practitioner.email) {
        const { data: existing } = await supabase
          .from('service_providers')
          .select('id, full_name')
          .eq('email', practitioner.email)
          .single()

        if (existing) {
          console.log(`⏭️  Skipping ${practitioner.full_name} (already exists)`)
          continue
        }
      }

      // Use the appropriate client (user session if available, otherwise admin)
      const { data, error } = await userClient
        .from('service_providers')
        .insert({
          ...practitioner,
          created_by_user_id: adminUserId,
          last_edited_by_user_id: adminUserId,
        })
        .select('id, full_name')
        .single()

      if (error) {
        console.error(`❌ Error inserting ${practitioner.full_name}:`, error.message)
        errorCount++
      } else {
        console.log(`✅ Created: ${practitioner.full_name} (${practitioner.location_city}, ${practitioner.location_region})`)
        successCount++
      }
    } catch (error) {
      console.error(`❌ Unexpected error for ${practitioner.full_name}:`, error.message)
      errorCount++
    }
  }

  console.log('\n📊 Summary:')
  console.log(`  ✅ Successfully created: ${successCount} practitioners`)
  console.log(`  ❌ Errors: ${errorCount}`)
  console.log(`  📝 Total practitioners in database: ${successCount + practitioners.length - successCount}`)
}

seedPractitioners().catch((error) => {
  console.error('\n❌ Seed script failed:', error)
  process.exit(1)
})

