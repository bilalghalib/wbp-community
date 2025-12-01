// Common tags and topics for research documents
// Based on wellbeing work in social justice/changemaker contexts

export const RESEARCH_TAGS = [
  'Burnout',
  'Collective Care',
  'Trauma Healing',
  'Organizational Wellbeing',
  'Movement Sustainability',
  'Leadership Development',
  'Somatic Practices',
  'Grief Work',
  'Joy & Play',
  'Rest & Recovery',
  'Compassion Fatigue',
  'Secondary Trauma',
  'Community Healing',
  'Cultural Healing',
  'Youth Wellbeing',
  'Racial Justice',
  'Gender Justice',
  'Climate Justice',
  'Disability Justice',
  'Economic Justice',
  'Mutual Aid',
  'Resilience Building',
  'Mindfulness',
  'Caregiver Support',
  'Workplace Culture',
] as const

export const RESEARCH_TOPICS = [
  'Mental Health',
  'Physical Health',
  'Spiritual Wellbeing',
  'Collective Wellbeing',
  'Organizational Health',
  'Movement Building',
  'Social Justice',
  'Inner Work',
  'Contemplative Practice',
  'Healing Justice',
  'Transformative Justice',
  'Community Care',
] as const

export const RESEARCH_TYPES = [
  'Survey Results',
  'Case Study',
  'Research Report',
  'White Paper',
  'Policy Brief',
  'Toolkit',
  'Guide',
  'Curriculum',
  'Workshop Materials',
  'Assessment Tool',
  'Literature Review',
  'Personal Reflection',
] as const

export type ResearchTag = typeof RESEARCH_TAGS[number]
export type ResearchTopic = typeof RESEARCH_TOPICS[number]
export type ResearchType = typeof RESEARCH_TYPES[number]
