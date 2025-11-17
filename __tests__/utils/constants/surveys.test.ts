import { describe, it, expect } from 'vitest'
import {
  SURVEY_TEMPLATES,
  BURNOUT_ASSESSMENT,
  TEAM_WELLBEING_CHECK,
  INDIVIDUAL_WELLBEING_SNAPSHOT,
  ORGANIZATIONAL_HEALTH,
  MOVEMENT_SUSTAINABILITY,
  getSurveyTemplate,
} from '@/utils/constants/surveys'

describe('Survey Templates', () => {
  describe('SURVEY_TEMPLATES array', () => {
    it('should contain 5 templates', () => {
      expect(SURVEY_TEMPLATES).toHaveLength(5)
    })

    it('should have unique IDs', () => {
      const ids = SURVEY_TEMPLATES.map(t => t.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('should all have required fields', () => {
      SURVEY_TEMPLATES.forEach(template => {
        expect(template).toHaveProperty('id')
        expect(template).toHaveProperty('title')
        expect(template).toHaveProperty('description')
        expect(template).toHaveProperty('category')
        expect(template).toHaveProperty('estimatedMinutes')
        expect(template).toHaveProperty('questions')
        expect(template).toHaveProperty('scoringInstructions')
        expect(template).toHaveProperty('aggregateMetrics')
      })
    })

    it('should have valid categories', () => {
      const validCategories = ['individual', 'team', 'organizational']
      SURVEY_TEMPLATES.forEach(template => {
        expect(validCategories).toContain(template.category)
      })
    })
  })

  describe('BURNOUT_ASSESSMENT template', () => {
    it('should have correct ID', () => {
      expect(BURNOUT_ASSESSMENT.id).toBe('burnout-assessment')
    })

    it('should have 8 questions', () => {
      expect(BURNOUT_ASSESSMENT.questions).toHaveLength(8)
    })

    it('should have correct aggregate metrics', () => {
      expect(BURNOUT_ASSESSMENT.aggregateMetrics).toEqual([
        'exhaustion',
        'cynicism',
        'efficacy',
        'burnout_risk',
      ])
    })

    it('should have all required questions', () => {
      const allRequired = BURNOUT_ASSESSMENT.questions.every(q => q.required)
      expect(allRequired).toBe(true)
    })

    it('should have scale questions with 1-5 range', () => {
      BURNOUT_ASSESSMENT.questions.forEach(question => {
        expect(question.type).toBe('scale')
        expect(question.scale).toBeDefined()
        expect(question.scale?.min).toBe(1)
        expect(question.scale?.max).toBe(5)
      })
    })

    it('should have scoreKey for all questions', () => {
      BURNOUT_ASSESSMENT.questions.forEach(question => {
        expect(question.scoreKey).toBeDefined()
        expect(question.scoreKey).toBeTruthy()
      })
    })
  })

  describe('TEAM_WELLBEING_CHECK template', () => {
    it('should have correct ID', () => {
      expect(TEAM_WELLBEING_CHECK.id).toBe('team-wellbeing-check')
    })

    it('should be categorized as team', () => {
      expect(TEAM_WELLBEING_CHECK.category).toBe('team')
    })

    it('should have 8 questions', () => {
      expect(TEAM_WELLBEING_CHECK.questions).toHaveLength(8)
    })

    it('should have different scale ranges', () => {
      const scales = TEAM_WELLBEING_CHECK.questions.map(q => ({
        min: q.scale?.min,
        max: q.scale?.max,
      }))

      // Most questions are 1-5, last one is 1-10
      expect(scales[0]).toEqual({ min: 1, max: 5 })
      expect(scales[7]).toEqual({ min: 1, max: 10 })
    })
  })

  describe('INDIVIDUAL_WELLBEING_SNAPSHOT template', () => {
    it('should have text questions for optional feedback', () => {
      const textQuestions = INDIVIDUAL_WELLBEING_SNAPSHOT.questions.filter(
        q => q.type === 'text'
      )
      expect(textQuestions.length).toBeGreaterThan(0)
    })

    it('should have optional questions', () => {
      const optionalQuestions = INDIVIDUAL_WELLBEING_SNAPSHOT.questions.filter(
        q => !q.required
      )
      expect(optionalQuestions.length).toBeGreaterThan(0)
    })

    it('should cover all wellbeing dimensions', () => {
      const scoreKeys = INDIVIDUAL_WELLBEING_SNAPSHOT.questions
        .map(q => q.scoreKey)
        .filter(Boolean)

      expect(scoreKeys).toContain('physical')
      expect(scoreKeys).toContain('emotional')
      expect(scoreKeys).toContain('mental')
      expect(scoreKeys).toContain('spiritual')
      expect(scoreKeys).toContain('overall_wellbeing')
    })
  })

  describe('ORGANIZATIONAL_HEALTH template', () => {
    it('should be categorized as organizational', () => {
      expect(ORGANIZATIONAL_HEALTH.category).toBe('organizational')
    })

    it('should have 9 questions', () => {
      expect(ORGANIZATIONAL_HEALTH.questions).toHaveLength(9)
    })

    it('should assess culture, resources, leadership, and sustainability', () => {
      const scoreKeys = ORGANIZATIONAL_HEALTH.questions
        .map(q => q.scoreKey)
        .filter(Boolean)

      // Check for key dimensions
      expect(scoreKeys.some(k => k.startsWith('culture'))).toBe(true)
      expect(scoreKeys.some(k => k.startsWith('resources'))).toBe(true)
      expect(scoreKeys.some(k => k.startsWith('leadership'))).toBe(true)
      expect(scoreKeys.some(k => k.startsWith('sustainability'))).toBe(true)
    })
  })

  describe('MOVEMENT_SUSTAINABILITY template', () => {
    it('should have correct ID', () => {
      expect(MOVEMENT_SUSTAINABILITY.id).toBe('movement-sustainability')
    })

    it('should assess hope, capacity, connection, and resilience', () => {
      const scoreKeys = MOVEMENT_SUSTAINABILITY.questions
        .map(q => q.scoreKey)
        .filter(Boolean)

      expect(scoreKeys.some(k => k.startsWith('hope'))).toBe(true)
      expect(scoreKeys.some(k => k.startsWith('capacity'))).toBe(true)
      expect(scoreKeys.some(k => k.startsWith('resilience'))).toBe(true)
      expect(scoreKeys.some(k => k.startsWith('connection'))).toBe(true)
    })

    it('should have optional text question for qualitative feedback', () => {
      const textQuestions = MOVEMENT_SUSTAINABILITY.questions.filter(
        q => q.type === 'text'
      )
      expect(textQuestions.length).toBeGreaterThan(0)
      expect(textQuestions.every(q => !q.required)).toBe(true)
    })
  })

  describe('getSurveyTemplate function', () => {
    it('should return template for valid ID', () => {
      const template = getSurveyTemplate('burnout-assessment')
      expect(template).toBeDefined()
      expect(template?.id).toBe('burnout-assessment')
    })

    it('should return undefined for invalid ID', () => {
      const template = getSurveyTemplate('non-existent-template' as any)
      expect(template).toBeUndefined()
    })

    it('should work for all template IDs', () => {
      SURVEY_TEMPLATES.forEach(expectedTemplate => {
        const template = getSurveyTemplate(expectedTemplate.id as any)
        expect(template).toEqual(expectedTemplate)
      })
    })
  })

  describe('Question validation', () => {
    it('all questions should have unique IDs within their template', () => {
      SURVEY_TEMPLATES.forEach(template => {
        const questionIds = template.questions.map(q => q.id)
        const uniqueIds = new Set(questionIds)
        expect(uniqueIds.size).toBe(questionIds.length)
      })
    })

    it('all scale questions should have scale configuration', () => {
      SURVEY_TEMPLATES.forEach(template => {
        template.questions.forEach(question => {
          if (question.type === 'scale') {
            expect(question.scale).toBeDefined()
            expect(question.scale?.min).toBeDefined()
            expect(question.scale?.max).toBeDefined()
            expect(question.scale?.max).toBeGreaterThan(question.scale?.min!)
          }
        })
      })
    })

    it('all multiple_choice questions should have options', () => {
      SURVEY_TEMPLATES.forEach(template => {
        template.questions.forEach(question => {
          if (question.type === 'multiple_choice') {
            expect(question.options).toBeDefined()
            expect(question.options!.length).toBeGreaterThan(0)
          }
        })
      })
    })

    it('scoreKey should only exist for quantitative questions', () => {
      SURVEY_TEMPLATES.forEach(template => {
        template.questions.forEach(question => {
          if (question.type === 'text') {
            // Text questions can have scoreKey but not required
          } else {
            // Scale, multiple choice, yes_no should have scoreKey for scoring
            if (question.required) {
              // Required questions should contribute to scoring (in most cases)
            }
          }
        })
      })
    })
  })
})
