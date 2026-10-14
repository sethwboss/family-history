import { extractMonth } from './gedcomParser'

/**
 * Ancestor Matching Engine
 * 100% User-Focused Profile:
 * 1. Your Birth Month (Find your Birthday Twin)
 * 2. Your Home or Dream Travel Region (Homeland roots)
 * 3. Your Calling, Skills & Passions (Trade & craft heritage)
 * 4. Your Life Spirit & Journey (Personal values & lifestyle)
 */

export const MONTH_OPTIONS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export const HOMELAND_OPTIONS = [
  {
    id: 'utah_west',
    label: 'American West',
    keywords: ['utah', 'american fork', 'logan', 'garland', 'thatcher', 'spanish fork', 'salt lake', 'box elder', 'cache', 'idaho', 'bear lake', 'bingham', 'presto', 'menan', 'cassia', 'wyoming', 'colorado']
  },
  {
    id: 'britain',
    label: 'Great Britain',
    keywords: ['england', 'scotland', 'wales', 'great britain', 'uk', 'lancashire', 'yorkshire', 'london', 'liverpool', 'manchester']
  },
  {
    id: 'scandinavia',
    label: 'Scandinavia',
    keywords: ['denmark', 'norway', 'sweden', 'randers', 'kristrup', 'aalborg', 'svendborg', 'danmark', 'copenhagen']
  },
  {
    id: 'central_europe',
    label: 'Central Europe',
    keywords: ['switzerland', 'bern', 'gündlischwand', 'swiss', 'alps', 'germany', 'deutschland', 'france']
  },
  {
    id: 'pacific',
    label: 'West Coast',
    keywords: ['california', 'san bernardino', 'los angeles', 'tulare', 'oregon', 'washington', 'pacific']
  },
  {
    id: 'canada',
    label: 'Canada',
    keywords: ['canada', 'alberta', 'raymond', 'lethbridge', 'ontario']
  },
  {
    id: 'eastern_us',
    label: 'Eastern & Midwest US',
    keywords: ['ohio', 'new york', 'pennsylvania', 'illinois', 'massachusetts', 'virginia', 'missouri', 'iowa']
  }
]

export const CALLING_OPTIONS = [
  {
    id: 'building_crafts',
    label: 'Building & Crafts',
    badge: 'Building & Crafts',
    keywords: ['builder', 'carpenter', 'blacksmith', 'mason', 'craft', 'woodwork', 'tailor', 'shoemaker', 'weaver', 'joiner', 'wheelwright', 'cooper', 'miller', 'mechanic', 'stone', 'iron', 'smith']
  },
  {
    id: 'farming_nature',
    label: 'Farming & Outdoors',
    badge: 'Farming & Outdoors',
    keywords: ['farmer', 'farming', 'rancher', 'agriculture', 'gardener', 'yeoman', 'husbandman', 'laborer', 'shepherd', 'dairyman', 'homestead', 'land', 'orchard']
  },
  {
    id: 'care_teaching',
    label: 'Teaching & Homemaking',
    badge: 'Teaching & Homemaking',
    keywords: ['teacher', 'teaching', 'school', 'homemaker', 'mother', 'housewife', 'nurse', 'caregiver', 'midwife', 'domestic', 'family', 'full-time mother']
  },
  {
    id: 'business_leadership',
    label: 'Business & Trade',
    badge: 'Business & Trade',
    keywords: ['merchant', 'clerk', 'store', 'shop', 'grocer', 'manager', 'sales', 'innkeeper', 'business', 'leader', 'postmaster', 'mayor', 'agent', 'project manager', 'problem solver']
  },
  {
    id: 'tech_science',
    label: 'Science & Tech',
    badge: 'Science & Tech',
    keywords: ['engineer', 'computer', 'science', 'scientist', 'developer', 'software', 'technology', 'problem solver', 'technician', 'inventor', 'coding']
  }
]

export const SPIRIT_OPTIONS = [
  {
    id: 'voyager',
    label: 'The Voyager',
    subtitle: 'Moved far from home / loves travel & new horizons'
  },
  {
    id: 'family_anchor',
    label: 'The Family Anchor',
    subtitle: 'Values large families, reunions & deep generational roots'
  },
  {
    id: 'resilient',
    label: 'The Resilient',
    subtitle: 'Dedicated to endurance, long life & healthy living'
  },
  {
    id: 'trailblazer',
    label: 'The Trailblazer',
    subtitle: 'Started career, craft, or family milestones young'
  }
]

// Backward-compatible alias for existing imports
export const REGION_DEFINITIONS = HOMELAND_OPTIONS
export const ERA_OPTIONS = []
export const MILESTONE_OPTIONS = SPIRIT_OPTIONS

export function isBornAbroad(ancestor) {
  const text = `${ancestor.birthPlace || ''} ${ancestor.birthRegion || ''}`.toLowerCase()
  const foreignLands = ['denmark', 'switzerland', 'england', 'britain', 'canada', 'scotland', 'wales', 'germany', 'sweden', 'norway', 'danmark']
  return foreignLands.some(land => text.includes(land))
}

export function calculateAncestorMatches(userProfile, ancestors) {
  if (!ancestors || ancestors.length === 0) return []

  const {
    birthMonth = null,
    regions = [],
    callings = [],
    spirits = []
  } = userProfile

  return ancestors
    .map((ancestor) => {
      let score = 50
      const matchReasons = []

      // Ensure birthMonth and lifespan are derived
      const ancestorMonth = ancestor.birthMonth || extractMonth(ancestor.birthDate)
      const ancestorLifespan = ancestor.lifespan || (
        ancestor.birthYear && ancestor.deathYear && ancestor.deathYear >= ancestor.birthYear
          ? ancestor.deathYear - ancestor.birthYear
          : null
      )

      const ancestorGeoText = [
        ancestor.birthPlace || '',
        ancestor.birthRegion || '',
        ancestor.deathPlace || ''
      ].join(' ').toLowerCase()

      const ancestorCareerText = [
        ancestor.name,
        ...(ancestor.occupations || []),
        ...(ancestor.interests || []),
        ancestor.bioSnippet || '',
        ...(ancestor.notes || [])
      ].join(' ').toLowerCase()

      // 1. Birth Month / Birthday Twin (+30 pts)
      if (birthMonth && ancestorMonth) {
        if (birthMonth.toLowerCase() === ancestorMonth.toLowerCase()) {
          score += 30
          matchReasons.push(`Birthday Twin: Born in ${ancestorMonth} (shares your birth month)`)
        }
      }

      // 2. Geographic Roots & Homelands (+25 pts per matched region)
      regions.forEach((regionId) => {
        const def = HOMELAND_OPTIONS.find((r) => r.id === regionId)
        if (def) {
          const matchedKw = def.keywords.some((kw) => ancestorGeoText.includes(kw))
          if (matchedKw) {
            score += 25
            const placeSnippet = ancestor.birthRegion || ancestor.birthPlace || def.label
            matchReasons.push(`Shared Homeland: Roots connected to ${def.label} (${placeSnippet})`)
          }
        }
      })

      // 3. Calling, Skills & Passions (+25 pts per matched craft)
      callings.forEach((callingId) => {
        const calling = CALLING_OPTIONS.find((c) => c.id === callingId)
        if (calling) {
          const matched = calling.keywords.some((kw) => ancestorCareerText.includes(kw))
          if (matched) {
            score += 25
            const relevantOccu = (ancestor.occupations && ancestor.occupations.length > 0)
              ? ancestor.occupations.join(', ')
              : calling.badge
            matchReasons.push(`Shared Calling: Both passionate about ${calling.badge} (${relevantOccu})`)
          }
        }
      })

      // 4. Life Spirit & Personal Journey (+20 pts per matched spirit)
      spirits.forEach((spiritId) => {
        if (spiritId === 'voyager' && (isBornAbroad(ancestor) || (ancestor.milestones && ancestor.milestones.some(m => m.type === 'EMIG' || m.type === 'IMMI')))) {
          score += 20
          matchReasons.push(`Fellow Voyager: Journeyed across borders/oceans from ${ancestor.birthRegion || ancestor.birthPlace || 'abroad'}`)
        }
        if (spiritId === 'resilient' && ancestorLifespan && ancestorLifespan >= 75) {
          score += 20
          matchReasons.push(`Resilient Spirit: Lived a full, enduring life of ${ancestorLifespan} years`)
        }
        if (spiritId === 'family_anchor') {
          // Check for large family or generations
          if (ancestor.generation >= 2 || (ancestor.bioSnippet && ancestor.bioSnippet.toLowerCase().includes('family'))) {
            score += 20
            matchReasons.push(`Family Pillar: Known for devotion and anchoring generations of family`)
          }
        }
        if (spiritId === 'trailblazer') {
          const hasEarlyMilestone = ancestor.milestones && ancestor.milestones.some(m => m.age && m.age <= 24)
          if (hasEarlyMilestone || (ancestor.birthYear && ancestor.birthYear >= 1910 && ancestor.generation <= 4)) {
            score += 20
            matchReasons.push(`Trailblazer: Stepped out to establish career, home, or milestones in early twenties`)
          }
        }
      })

      // Normalize score between 65% and 98%
      const finalPercentage = Math.min(98, Math.max(65, Math.round(score)))

      // Fallback reasons if no explicit selections matched
      if (matchReasons.length === 0) {
        if (ancestor.occupations && ancestor.occupations.length > 0) {
          matchReasons.push(`Historical profession: ${ancestor.occupations[0]}`)
        } else if (ancestor.birthPlace) {
          matchReasons.push(`Ancestral roots in ${ancestor.birthPlace}`)
        } else if (ancestor.birthYear) {
          matchReasons.push(`Born in ${ancestor.birthYear} (Generation ${ancestor.generation || 1})`)
        } else {
          matchReasons.push(`Direct branch of your family tree`)
        }
      }

      return {
        ...ancestor,
        birthMonth: ancestorMonth,
        lifespan: ancestorLifespan,
        matchPercentage: finalPercentage,
        matchReasons: matchReasons.slice(0, 3)
      }
    })
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
}
