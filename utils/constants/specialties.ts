// Common specialties for service providers
// Based on wellbeing work in social justice/changemaker contexts

export const SPECIALTIES = [
  'Burnout Recovery',
  'Trauma Healing',
  'Racial Trauma',
  'Collective Trauma',
  'Grief Work',
  'Leadership Coaching',
  'Organizational Wellbeing',
  'Somatic Healing',
  'Movement Building',
  'Conflict Transformation',
  'Compassion Fatigue',
  'Secondary Trauma',
  'Cultural Healing',
  'Spiritual Accompaniment',
  'Group Facilitation',
  'Retreat Facilitation',
  'Youth Wellbeing',
  'Family Systems',
  'Addiction Recovery',
  'Anxiety & Depression',
  'PTSD',
  'Vicarious Trauma',
] as const

export const MODALITIES = [
  'Somatic Experiencing',
  'EMDR',
  'Internal Family Systems (IFS)',
  'Cognitive Behavioral Therapy (CBT)',
  'Dialectical Behavior Therapy (DBT)',
  'Narrative Therapy',
  'Psychodynamic Therapy',
  'Mindfulness-Based',
  'Body-Based Practices',
  'Breathwork',
  'Movement Therapy',
  'Art Therapy',
  'Nature-Based Healing',
  'Indigenous Practices',
  'Contemplative Practices',
  'Systems Constellations',
  'Non-Violent Communication (NVC)',
  'Restorative Justice',
  'Coaching',
  'Spiritual Direction',
] as const

export const LANGUAGES = [
  'English',
  'Spanish',
  'Arabic',
  'Mandarin',
  'French',
  'Portuguese',
  'Hindi',
  'Tagalog',
  'Vietnamese',
  'Korean',
  'German',
  'Swahili',
  'Amharic',
  'Sign Language (ASL)',
] as const

export type Specialty = typeof SPECIALTIES[number]
export type Modality = typeof MODALITIES[number]
export type Language = typeof LANGUAGES[number]
