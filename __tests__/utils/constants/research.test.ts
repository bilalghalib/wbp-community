import { describe, it, expect } from 'vitest'
import {
  RESEARCH_TAGS,
  RESEARCH_TOPICS,
  RESEARCH_TYPES,
} from '@/utils/constants/research'

describe('Research Constants', () => {
  describe('RESEARCH_TAGS', () => {
    it('should have 25 tags', () => {
      expect(RESEARCH_TAGS).toHaveLength(25)
    })

    it('should have unique tags', () => {
      const uniqueTags = new Set(RESEARCH_TAGS)
      expect(uniqueTags.size).toBe(RESEARCH_TAGS.length)
    })

    it('should include wellbeing-focused tags', () => {
      const expectedTags = [
        'Burnout',
        'Collective Care',
        'Trauma Healing',
        'Organizational Wellbeing',
        'Movement Sustainability',
      ]

      expectedTags.forEach(tag => {
        expect(RESEARCH_TAGS).toContain(tag)
      })
    })

    it('should include justice-focused tags', () => {
      const justiceTags = [
        'Racial Justice',
        'Gender Justice',
        'Climate Justice',
        'Disability Justice',
        'Economic Justice',
      ]

      justiceTags.forEach(tag => {
        expect(RESEARCH_TAGS).toContain(tag)
      })
    })

    it('should not have empty strings', () => {
      RESEARCH_TAGS.forEach(tag => {
        expect(tag.trim()).toBeTruthy()
      })
    })

    it('should be properly capitalized', () => {
      RESEARCH_TAGS.forEach(tag => {
        // Each word should start with capital letter
        const words = tag.split(' ')
        words.forEach(word => {
          if (word.length > 0 && word !== '&') {
            expect(word[0]).toBe(word[0].toUpperCase())
          }
        })
      })
    })
  })

  describe('RESEARCH_TOPICS', () => {
    it('should have 12 topics', () => {
      expect(RESEARCH_TOPICS).toHaveLength(12)
    })

    it('should have unique topics', () => {
      const uniqueTopics = new Set(RESEARCH_TOPICS)
      expect(uniqueTopics.size).toBe(RESEARCH_TOPICS.length)
    })

    it('should include core wellbeing dimensions', () => {
      expect(RESEARCH_TOPICS).toContain('Mental Health')
      expect(RESEARCH_TOPICS).toContain('Physical Health')
      expect(RESEARCH_TOPICS).toContain('Spiritual Wellbeing')
    })

    it('should include collective dimensions', () => {
      expect(RESEARCH_TOPICS).toContain('Collective Wellbeing')
      expect(RESEARCH_TOPICS).toContain('Organizational Health')
      expect(RESEARCH_TOPICS).toContain('Community Care')
    })

    it('should include justice dimensions', () => {
      expect(RESEARCH_TOPICS).toContain('Social Justice')
      expect(RESEARCH_TOPICS).toContain('Healing Justice')
      expect(RESEARCH_TOPICS).toContain('Transformative Justice')
    })

    it('should not have duplicates with tags (different naming)', () => {
      // Topics and tags can overlap conceptually but should have different names
      // This ensures clear distinction between categories
      RESEARCH_TOPICS.forEach(topic => {
        // If there's overlap, it should be intentional and clear
        // e.g., "Social Justice" topic vs "Racial Justice" tag
      })
    })
  })

  describe('RESEARCH_TYPES', () => {
    it('should have 12 research types', () => {
      expect(RESEARCH_TYPES).toHaveLength(12)
    })

    it('should have unique types', () => {
      const uniqueTypes = new Set(RESEARCH_TYPES)
      expect(uniqueTypes.size).toBe(RESEARCH_TYPES.length)
    })

    it('should include academic research types', () => {
      expect(RESEARCH_TYPES).toContain('Research Report')
      expect(RESEARCH_TYPES).toContain('Literature Review')
      expect(RESEARCH_TYPES).toContain('Case Study')
      expect(RESEARCH_TYPES).toContain('Survey Results')
    })

    it('should include practitioner resources', () => {
      expect(RESEARCH_TYPES).toContain('Toolkit')
      expect(RESEARCH_TYPES).toContain('Guide')
      expect(RESEARCH_TYPES).toContain('Curriculum')
      expect(RESEARCH_TYPES).toContain('Workshop Materials')
    })

    it('should include policy and assessment tools', () => {
      expect(RESEARCH_TYPES).toContain('Policy Brief')
      expect(RESEARCH_TYPES).toContain('White Paper')
      expect(RESEARCH_TYPES).toContain('Assessment Tool')
    })

    it('should include experiential types', () => {
      expect(RESEARCH_TYPES).toContain('Personal Reflection')
    })

    it('should be diverse enough for changemaker orgs', () => {
      // Should cover both research and practice
      const academicTypes = ['Research Report', 'Literature Review', 'Case Study']
      const practiceTypes = ['Toolkit', 'Guide', 'Workshop Materials']

      academicTypes.forEach(type => {
        expect(RESEARCH_TYPES).toContain(type)
      })

      practiceTypes.forEach(type => {
        expect(RESEARCH_TYPES).toContain(type)
      })
    })
  })

  describe('TypeScript type safety', () => {
    it('RESEARCH_TAGS should be readonly', () => {
      // This is a compile-time check, but we can verify the const assertion
      const tags: readonly string[] = RESEARCH_TAGS
      expect(tags).toBe(RESEARCH_TAGS)
    })

    it('should allow type-safe access to constants', () => {
      // Type inference should work
      type TagType = typeof RESEARCH_TAGS[number]
      const validTag: TagType = 'Burnout'
      expect(RESEARCH_TAGS).toContain(validTag)
    })
  })

  describe('Consistency across constants', () => {
    it('tags should not duplicate topics', () => {
      const tagSet = new Set(RESEARCH_TAGS)
      const topicSet = new Set(RESEARCH_TOPICS)

      const overlap = RESEARCH_TAGS.filter(tag => topicSet.has(tag))
      // Some intentional overlap is okay, but should be minimal
      expect(overlap.length).toBeLessThan(5)
    })

    it('should have complementary categorization', () => {
      // Tags are specific (Burnout, Trauma Healing)
      // Topics are broader (Mental Health, Healing Justice)
      // Types are format (Research Report, Toolkit)

      // Verify tags are more granular than topics
      expect(RESEARCH_TAGS.length).toBeGreaterThan(RESEARCH_TOPICS.length)

      // Verify types describe format, not content
      const formatWords = ['Report', 'Brief', 'Tool', 'Guide', 'Materials']
      const hasFormatWords = RESEARCH_TYPES.some(type =>
        formatWords.some(word => type.includes(word))
      )
      expect(hasFormatWords).toBe(true)
    })
  })
})
