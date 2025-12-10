-- Seed script to populate service_providers table with sample practitioners
-- Run this in Supabase SQL Editor
-- 
-- Note: Replace 'YOUR_USER_ID_HERE' with an actual user ID from your users table
-- You can find it by running: SELECT id, email FROM users LIMIT 1;

-- First, get a user ID to use as created_by
-- Uncomment and run this to find a user ID:
-- SELECT id, email, full_name FROM users LIMIT 1;

-- Replace this UUID with your actual user ID
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get the first user ID (or specify a specific user)
  SELECT id INTO v_user_id FROM users LIMIT 1;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No users found. Please create at least one user first.';
  END IF;

  -- Insert practitioners
  INSERT INTO service_providers (
    full_name, email, phone, website_url, bio,
    specialties, modalities, languages,
    location_city, location_region, location_country, timezone,
    offers_remote, offers_in_person,
    is_accepting_clients, is_visible, availability_note,
    created_by_user_id, last_edited_by_user_id
  ) VALUES
  (
    'Dr. Maria Rodriguez',
    'maria.rodriguez@therapy.com',
    '+1-510-555-0123',
    'https://mariarodriguez.com',
    'Licensed therapist specializing in trauma healing and racial justice work. Over 15 years of experience supporting activists and organizers in social justice movements.',
    ARRAY['Trauma Healing', 'Racial Justice', 'Burnout', 'Collective Care'],
    ARRAY['Somatic Therapy', 'EMDR', 'Narrative Therapy', 'Group Therapy'],
    ARRAY['English', 'Spanish'],
    'Oakland', 'California', 'United States', 'America/Los_Angeles',
    true, true, true, true,
    'Currently accepting new clients. Sliding scale available for organizers.',
    v_user_id, v_user_id
  ),
  (
    'James Chen, LCSW',
    'james.chen@wellbeing.org',
    '+1-415-555-0456',
    'https://jameschencounseling.com',
    'Social worker and therapist focused on supporting BIPOC communities, LGBTQ+ individuals, and movement workers. Specializes in addressing intergenerational trauma and building resilience.',
    ARRAY['Trauma Healing', 'LGBTQ+ Support', 'Racial Justice', 'Youth Wellbeing'],
    ARRAY['Cognitive Behavioral Therapy', 'Trauma-Informed Care', 'Mindfulness', 'Family Therapy'],
    ARRAY['English', 'Mandarin'],
    'San Francisco', 'California', 'United States', 'America/Los_Angeles',
    true, true, true, true,
    'Evening and weekend appointments available.',
    v_user_id, v_user_id
  ),
  (
    'Aisha Williams, LMFT',
    'aisha.williams@healingcollective.org',
    '+1-312-555-0789',
    NULL,
    'Marriage and family therapist with expertise in community healing, grief work, and supporting caregivers. Works extensively with Black communities and movement organizations.',
    ARRAY['Grief Work', 'Community Healing', 'Caregiver Support', 'Collective Care'],
    ARRAY['Family Systems Therapy', 'Grief Counseling', 'Group Therapy', 'Somatic Practices'],
    ARRAY['English'],
    'Chicago', 'Illinois', 'United States', 'America/Chicago',
    true, true, true, true,
    'Specializes in group healing circles for organizations.',
    v_user_id, v_user_id
  ),
  (
    'Dr. Priya Patel',
    'priya.patel@mindfulhealing.com',
    '+1-646-555-0321',
    'https://priyapateltherapy.com',
    'Clinical psychologist specializing in mindfulness-based interventions, stress management, and supporting South Asian communities. Experienced in working with activists experiencing burnout.',
    ARRAY['Burnout', 'Mindfulness', 'Stress Management', 'Organizational Wellbeing'],
    ARRAY['Mindfulness-Based Therapy', 'Acceptance and Commitment Therapy', 'Meditation', 'Yoga Therapy'],
    ARRAY['English', 'Hindi', 'Gujarati'],
    'New York', 'New York', 'United States', 'America/New_York',
    true, true, true, true,
    'Offers workshops on mindfulness for organizations.',
    v_user_id, v_user_id
  ),
  (
    'Michael Thompson, LPC',
    'michael.thompson@resiliencecounseling.com',
    '+1-404-555-0654',
    NULL,
    'Licensed professional counselor focused on supporting men in social justice work, addressing toxic masculinity, and building healthy relationships. Works with individuals and groups.',
    ARRAY['Men''s Mental Health', 'Relationship Counseling', 'Movement Sustainability', 'Leadership Development'],
    ARRAY['Individual Therapy', 'Group Therapy', 'Men''s Circles', 'Coaching'],
    ARRAY['English'],
    'Atlanta', 'Georgia', 'United States', 'America/New_York',
    true, false, true, true,
    'Remote only. Specializes in supporting male leaders in social justice organizations.',
    v_user_id, v_user_id
  ),
  (
    'Sofia Martinez, LMHC',
    'sofia.martinez@bilingualtherapy.org',
    '+1-713-555-0987',
    'https://sofiamartinezcounseling.com',
    'Bilingual mental health counselor serving Latinx communities. Specializes in immigration trauma, family separation, and supporting undocumented individuals and families.',
    ARRAY['Immigration Trauma', 'Family Therapy', 'Trauma Healing', 'Community Healing'],
    ARRAY['Trauma-Informed Care', 'Family Systems Therapy', 'Play Therapy', 'Art Therapy'],
    ARRAY['English', 'Spanish'],
    'Houston', 'Texas', 'United States', 'America/Chicago',
    true, true, true, true,
    'Sliding scale available. Specializes in supporting immigrant communities.',
    v_user_id, v_user_id
  ),
  (
    'Dr. Keiko Tanaka',
    'keiko.tanaka@wellbeingcenter.org',
    '+1-206-555-0147',
    NULL,
    'Psychologist and somatic therapist with expertise in Asian American mental health, intergenerational trauma, and supporting AAPI communities. Combines Western and Eastern healing approaches.',
    ARRAY['Intergenerational Trauma', 'AAPI Mental Health', 'Somatic Practices', 'Cultural Healing'],
    ARRAY['Somatic Therapy', 'Internal Family Systems', 'Mindfulness', 'Bodywork'],
    ARRAY['English', 'Japanese'],
    'Seattle', 'Washington', 'United States', 'America/Los_Angeles',
    true, true, true, true,
    'Offers workshops on intergenerational healing.',
    v_user_id, v_user_id
  ),
  (
    'Rashid Johnson, LCSW',
    'rashid.johnson@communitycare.org',
    '+1-215-555-0369',
    'https://rashidjohnsoncounseling.com',
    'Social worker and community organizer turned therapist. Specializes in supporting Black men, addressing racial trauma, and building community resilience. Works with individuals and groups.',
    ARRAY['Racial Trauma', 'Men''s Mental Health', 'Community Healing', 'Movement Building'],
    ARRAY['Group Therapy', 'Community Circles', 'Individual Therapy', 'Coaching'],
    ARRAY['English'],
    'Philadelphia', 'Pennsylvania', 'United States', 'America/New_York',
    true, true, true, true,
    'Facilitates healing circles for Black men in organizing spaces.',
    v_user_id, v_user_id
  ),
  (
    'Dr. Sarah Kim, PsyD',
    'sarah.kim@traumarecovery.com',
    '+1-503-555-0258',
    NULL,
    'Clinical psychologist specializing in complex trauma, dissociation, and supporting survivors of violence. Works extensively with activists and organizers who have experienced state violence.',
    ARRAY['Complex Trauma', 'Dissociation', 'Survivor Support', 'Trauma Healing'],
    ARRAY['EMDR', 'Somatic Experiencing', 'Internal Family Systems', 'Trauma-Informed Care'],
    ARRAY['English', 'Korean'],
    'Portland', 'Oregon', 'United States', 'America/Los_Angeles',
    true, true, false, true,
    'Currently at capacity. Waitlist available for fall 2025.',
    v_user_id, v_user_id
  ),
  (
    'Elena Vasquez, LMFT',
    'elena.vasquez@familyhealing.org',
    '+1-602-555-0741',
    'https://elenavasquez.com',
    'Marriage and family therapist specializing in supporting families in social justice movements, addressing secondary trauma in children of activists, and building family resilience.',
    ARRAY['Family Therapy', 'Youth Wellbeing', 'Secondary Trauma', 'Collective Care'],
    ARRAY['Family Systems Therapy', 'Play Therapy', 'Art Therapy', 'Group Therapy'],
    ARRAY['English', 'Spanish'],
    'Phoenix', 'Arizona', 'United States', 'America/Phoenix',
    true, true, true, true,
    'Specializes in supporting families of organizers and activists.',
    v_user_id, v_user_id
  ),
  (
    'David Park, LPC',
    'david.park@mindfulcounseling.com',
    '+1-303-555-0582',
    NULL,
    'Licensed professional counselor and meditation teacher. Combines therapy with contemplative practices to support activists, organizers, and movement workers in maintaining sustainable practices.',
    ARRAY['Mindfulness', 'Burnout', 'Contemplative Practice', 'Movement Sustainability'],
    ARRAY['Mindfulness-Based Therapy', 'Meditation', 'Individual Therapy', 'Retreats'],
    ARRAY['English'],
    'Denver', 'Colorado', 'United States', 'America/Denver',
    true, true, true, true,
    'Offers meditation groups for activists and organizers.',
    v_user_id, v_user_id
  ),
  (
    'Dr. Amara Okafor',
    'amara.okafor@healingjustice.org',
    '+1-510-555-0963',
    'https://amaraokafor.com',
    'Therapist and healing justice practitioner. Specializes in supporting Black women, addressing racial and gender-based trauma, and building collective healing practices in movement spaces.',
    ARRAY['Healing Justice', 'Racial Justice', 'Gender Justice', 'Collective Care'],
    ARRAY['Somatic Therapy', 'Group Therapy', 'Healing Circles', 'Community Healing'],
    ARRAY['English'],
    'Oakland', 'California', 'United States', 'America/Los_Angeles',
    true, true, true, true,
    'Facilitates healing justice circles for Black women in organizing.',
    v_user_id, v_user_id
  )
  ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Successfully inserted practitioners. User ID used: %', v_user_id;
END $$;

-- Verify the insert
SELECT 
  full_name, 
  location_city, 
  location_region,
  array_length(specialties, 1) as specialty_count,
  is_accepting_clients,
  created_at
FROM service_providers
ORDER BY created_at DESC
LIMIT 12;

