// Survey templates for wellbeing assessments
// Designed for social justice / changemaker organizations

export type QuestionType = 'scale' | 'multiple_choice' | 'text' | 'yes_no'

export type SurveyQuestion = {
  id: string
  text: string
  type: QuestionType
  required: boolean
  options?: string[]  // For multiple_choice
  scale?: {
    min: number
    max: number
    minLabel?: string
    maxLabel?: string
  }
  scoreKey?: string  // Key to use in scores JSONB (e.g., 'exhaustion', 'cynicism')
}

export type SurveyTemplate = {
  id: string
  title: string
  description: string
  category: 'individual' | 'team' | 'organizational'
  estimatedMinutes: number
  questions: SurveyQuestion[]
  scoringInstructions: string
  aggregateMetrics: string[]  // Which score keys to aggregate
}

// Burnout Assessment (based on Maslach Burnout Inventory dimensions)
export const BURNOUT_ASSESSMENT: SurveyTemplate = {
  id: 'burnout-assessment',
  title: 'Burnout Assessment',
  description: 'Assess exhaustion, cynicism, and professional efficacy to identify burnout risk',
  category: 'individual',
  estimatedMinutes: 5,
  scoringInstructions: 'Higher exhaustion and cynicism with lower efficacy indicates burnout',
  aggregateMetrics: ['exhaustion', 'cynicism', 'efficacy', 'burnout_risk'],
  questions: [
    {
      id: 'b1',
      text: 'I feel emotionally drained by my work',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 5, minLabel: 'Never', maxLabel: 'Always' },
      scoreKey: 'exhaustion_1',
    },
    {
      id: 'b2',
      text: 'I feel used up at the end of the workday',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 5, minLabel: 'Never', maxLabel: 'Always' },
      scoreKey: 'exhaustion_2',
    },
    {
      id: 'b3',
      text: 'I feel tired when I get up in the morning and have to face another day',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 5, minLabel: 'Never', maxLabel: 'Always' },
      scoreKey: 'exhaustion_3',
    },
    {
      id: 'b4',
      text: 'I have become more callous toward people since I took this work',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 5, minLabel: 'Never', maxLabel: 'Always' },
      scoreKey: 'cynicism_1',
    },
    {
      id: 'b5',
      text: 'I doubt the significance of my work',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 5, minLabel: 'Never', maxLabel: 'Always' },
      scoreKey: 'cynicism_2',
    },
    {
      id: 'b6',
      text: 'I can effectively solve problems that arise in my work',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 5, minLabel: 'Never', maxLabel: 'Always' },
      scoreKey: 'efficacy_1',
    },
    {
      id: 'b7',
      text: 'I feel I am making an effective contribution to my organization',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 5, minLabel: 'Never', maxLabel: 'Always' },
      scoreKey: 'efficacy_2',
    },
    {
      id: 'b8',
      text: 'I have accomplished many worthwhile things in this work',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 5, minLabel: 'Never', maxLabel: 'Always' },
      scoreKey: 'efficacy_3',
    },
  ],
}

// Team Wellbeing Check
export const TEAM_WELLBEING_CHECK: SurveyTemplate = {
  id: 'team-wellbeing-check',
  title: 'Team Wellbeing Check',
  description: 'Assess collective wellbeing, psychological safety, and team support',
  category: 'team',
  estimatedMinutes: 7,
  scoringInstructions: 'Higher scores indicate healthier team dynamics and collective wellbeing',
  aggregateMetrics: ['psychological_safety', 'team_support', 'collective_joy', 'overall_team_wellbeing'],
  questions: [
    {
      id: 't1',
      text: 'I feel safe sharing my struggles with my team',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 5, minLabel: 'Strongly Disagree', maxLabel: 'Strongly Agree' },
      scoreKey: 'safety_1',
    },
    {
      id: 't2',
      text: 'My team respects my boundaries around work time',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 5, minLabel: 'Strongly Disagree', maxLabel: 'Strongly Agree' },
      scoreKey: 'safety_2',
    },
    {
      id: 't3',
      text: 'I can be honest about my capacity without fear of judgment',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 5, minLabel: 'Strongly Disagree', maxLabel: 'Strongly Agree' },
      scoreKey: 'safety_3',
    },
    {
      id: 't4',
      text: 'My teammates actively support each other\'s wellbeing',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 5, minLabel: 'Strongly Disagree', maxLabel: 'Strongly Agree' },
      scoreKey: 'support_1',
    },
    {
      id: 't5',
      text: 'We have practices in place for collective care',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 5, minLabel: 'Strongly Disagree', maxLabel: 'Strongly Agree' },
      scoreKey: 'support_2',
    },
    {
      id: 't6',
      text: 'We make time to celebrate wins and acknowledge each other',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 5, minLabel: 'Strongly Disagree', maxLabel: 'Strongly Agree' },
      scoreKey: 'joy_1',
    },
    {
      id: 't7',
      text: 'I experience joy and laughter with my team',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 5, minLabel: 'Strongly Disagree', maxLabel: 'Strongly Agree' },
      scoreKey: 'joy_2',
    },
    {
      id: 't8',
      text: 'Overall, how would you rate your team\'s collective wellbeing?',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 10, minLabel: 'Very Poor', maxLabel: 'Excellent' },
      scoreKey: 'overall_team_wellbeing',
    },
  ],
}

// Individual Wellbeing Snapshot
export const INDIVIDUAL_WELLBEING_SNAPSHOT: SurveyTemplate = {
  id: 'individual-wellbeing-snapshot',
  title: 'Individual Wellbeing Snapshot',
  description: 'Quick check-in across physical, emotional, mental, and spiritual dimensions',
  category: 'individual',
  estimatedMinutes: 4,
  scoringInstructions: 'Scores across four dimensions of wellbeing (physical, emotional, mental, spiritual)',
  aggregateMetrics: ['physical', 'emotional', 'mental', 'spiritual', 'overall_wellbeing'],
  questions: [
    {
      id: 'i1',
      text: 'How would you rate your physical wellbeing? (energy, sleep, health)',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 10, minLabel: 'Very Poor', maxLabel: 'Excellent' },
      scoreKey: 'physical',
    },
    {
      id: 'i2',
      text: 'How would you rate your emotional wellbeing? (feelings, processing, regulation)',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 10, minLabel: 'Very Poor', maxLabel: 'Excellent' },
      scoreKey: 'emotional',
    },
    {
      id: 'i3',
      text: 'How would you rate your mental wellbeing? (clarity, focus, peace of mind)',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 10, minLabel: 'Very Poor', maxLabel: 'Excellent' },
      scoreKey: 'mental',
    },
    {
      id: 'i4',
      text: 'How would you rate your spiritual wellbeing? (meaning, purpose, connection)',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 10, minLabel: 'Very Poor', maxLabel: 'Excellent' },
      scoreKey: 'spiritual',
    },
    {
      id: 'i5',
      text: 'Overall, how would you rate your wellbeing right now?',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 10, minLabel: 'Very Poor', maxLabel: 'Excellent' },
      scoreKey: 'overall_wellbeing',
    },
    {
      id: 'i6',
      text: 'What is supporting your wellbeing right now? (Optional)',
      type: 'text',
      required: false,
    },
    {
      id: 'i7',
      text: 'What is challenging your wellbeing right now? (Optional)',
      type: 'text',
      required: false,
    },
  ],
}

// Organizational Health Assessment
export const ORGANIZATIONAL_HEALTH: SurveyTemplate = {
  id: 'organizational-health',
  title: 'Organizational Health Assessment',
  description: 'Assess organizational culture, resources, and commitment to wellbeing',
  category: 'organizational',
  estimatedMinutes: 8,
  scoringInstructions: 'Higher scores indicate healthier organizational culture and systems',
  aggregateMetrics: ['wellbeing_culture', 'resource_adequacy', 'leadership_support', 'work_sustainability', 'overall_org_health'],
  questions: [
    {
      id: 'o1',
      text: 'My organization prioritizes wellbeing in decision-making',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 5, minLabel: 'Strongly Disagree', maxLabel: 'Strongly Agree' },
      scoreKey: 'culture_1',
    },
    {
      id: 'o2',
      text: 'Wellbeing is discussed openly and regularly in our organization',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 5, minLabel: 'Strongly Disagree', maxLabel: 'Strongly Agree' },
      scoreKey: 'culture_2',
    },
    {
      id: 'o3',
      text: 'I have access to the resources I need to do my work well',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 5, minLabel: 'Strongly Disagree', maxLabel: 'Strongly Agree' },
      scoreKey: 'resources_1',
    },
    {
      id: 'o4',
      text: 'My workload is sustainable over the long term',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 5, minLabel: 'Strongly Disagree', maxLabel: 'Strongly Agree' },
      scoreKey: 'workload_1',
    },
    {
      id: 'o5',
      text: 'Leadership actively supports staff wellbeing',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 5, minLabel: 'Strongly Disagree', maxLabel: 'Strongly Agree' },
      scoreKey: 'leadership_1',
    },
    {
      id: 'o6',
      text: 'I feel my contributions are valued by the organization',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 5, minLabel: 'Strongly Disagree', maxLabel: 'Strongly Agree' },
      scoreKey: 'leadership_2',
    },
    {
      id: 'o7',
      text: 'Our organization addresses burnout and secondary trauma proactively',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 5, minLabel: 'Strongly Disagree', maxLabel: 'Strongly Agree' },
      scoreKey: 'culture_3',
    },
    {
      id: 'o8',
      text: 'I can see myself staying in this organization long-term',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 5, minLabel: 'Strongly Disagree', maxLabel: 'Strongly Agree' },
      scoreKey: 'sustainability_1',
    },
    {
      id: 'o9',
      text: 'Overall, how would you rate your organization\'s health?',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 10, minLabel: 'Very Poor', maxLabel: 'Excellent' },
      scoreKey: 'overall_org_health',
    },
  ],
}

// Movement Sustainability Check
export const MOVEMENT_SUSTAINABILITY: SurveyTemplate = {
  id: 'movement-sustainability',
  title: 'Movement Sustainability Check',
  description: 'Assess long-term capacity, hope, and resilience for sustained social change work',
  category: 'individual',
  estimatedMinutes: 6,
  scoringInstructions: 'Measures capacity for long-term movement work and sustainable engagement',
  aggregateMetrics: ['hope', 'capacity', 'connection', 'resilience', 'sustainability_score'],
  questions: [
    {
      id: 'm1',
      text: 'I feel hopeful about the impact of our work',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 5, minLabel: 'Strongly Disagree', maxLabel: 'Strongly Agree' },
      scoreKey: 'hope_1',
    },
    {
      id: 'm2',
      text: 'I can see progress toward our movement goals',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 5, minLabel: 'Strongly Disagree', maxLabel: 'Strongly Agree' },
      scoreKey: 'hope_2',
    },
    {
      id: 'm3',
      text: 'I have the energy to sustain this work over the next year',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 5, minLabel: 'Strongly Disagree', maxLabel: 'Strongly Agree' },
      scoreKey: 'capacity_1',
    },
    {
      id: 'm4',
      text: 'I have practices that help me recover from difficult work',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 5, minLabel: 'Strongly Disagree', maxLabel: 'Strongly Agree' },
      scoreKey: 'resilience_1',
    },
    {
      id: 'm5',
      text: 'I feel connected to others doing similar work',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 5, minLabel: 'Strongly Disagree', maxLabel: 'Strongly Agree' },
      scoreKey: 'connection_1',
    },
    {
      id: 'm6',
      text: 'I can imagine staying in this movement for many years',
      type: 'scale',
      required: true,
      scale: { min: 1, max: 5, minLabel: 'Strongly Disagree', maxLabel: 'Strongly Agree' },
      scoreKey: 'sustainability_1',
    },
    {
      id: 'm7',
      text: 'What helps you sustain this work? (Optional)',
      type: 'text',
      required: false,
    },
  ],
}

export const SURVEY_TEMPLATES = [
  BURNOUT_ASSESSMENT,
  TEAM_WELLBEING_CHECK,
  INDIVIDUAL_WELLBEING_SNAPSHOT,
  ORGANIZATIONAL_HEALTH,
  MOVEMENT_SUSTAINABILITY,
] as const

export type SurveyTemplateId = typeof SURVEY_TEMPLATES[number]['id']

export function getSurveyTemplate(id: SurveyTemplateId): SurveyTemplate | undefined {
  return SURVEY_TEMPLATES.find(t => t.id === id)
}
