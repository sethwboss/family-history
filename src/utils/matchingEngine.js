import { extractMonth } from './gedcomParser'

/**
 * Ancestor Matching Engine
 * Computes compatibility scores between user selections and real GEDCOM data:
 * 1. Geographic Roots / Homelands (Places)
 * 2. Birth Month / Birthday Twin (Dates)
 * 3. Generation & Historical Era (Birth Years)
 * 4. Longevity & Global Milestones (Lifespans & Migration)
 */

export const REGION_DEFINITIONS = [
  { id: 'utah', label: 'Utah Pioneer Corridor', keywords: ['utah', 'american fork', 'logan', 'garland', 'thatcher', 'spanish fork', 'salt lake', 'box elder', 'cache'] },
  { id: 'scandinavia', label: 'Scandinavia (Denmark)', keywords: ['denmark', 'norway', 'sweden', 'randers', 'kristrup', 'aalborg', 'svendborg', 'danmark'] },
  { id: 'switzerland', label: 'Switzerland', keywords: ['switzerland', 'bern', 'gündlischwand', 'swiss', 'alps'] },
  { id: 'britain', label: 'Great Britain (England)', keywords: ['england', 'scotland', 'wales', 'great britain', 'uk', 'lancashire', 'yorkshire'] },
  { id: 'idaho', label: 'Idaho / Snake River', keywords: ['idaho', 'bear lake', 'bingham', 'presto', 'menan', 'cassia'] },
  { id: 'canada', label: 'Canada (Alberta)', keywords: ['canada', 'alberta', 'raymond', 'lethbridge'] },
  { id: 'california', label: 'California & Pacific', keywords: ['california', 'san bernardino', 'los angeles', 'tulare'] }
]

export const ERA_OPTIONS = [
  { id: 'century20', label: '20th Century (1900+)' },
  { id: 'pioneer', label: 'Pioneer Era (1840–1899)' },
  { id: 'frontier', label: 'Early Frontiers (Pre-1840)' },
  { id: 'direct', label: 'Immediate Lineage (Gen 1–3)' }
]

export const MILESTONE_OPTIONS = [
  { id: 'immigrant', label: 'Global Immigrants (Born Abroad)' },
  { id: 'longevity', label: 'Remarkable Longevity (75+ Years)' },
  { id: 'young_builder', label: 'Young Pioneers & Builders' }
]

export const MONTH_OPTIONS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

function isBornAbroad(ancestor) {
  const text = `${ancestor.birthPlace || ''} ${ancestor.birthRegion || ''}`.toLowerCase()
  const foreignLands = ['denmark', 'switzerland', 'england', 'britain', 'canada', 'scotland', 'wales', 'germany', 'sweden', 'norway', 'danmark']
  return foreignLands.some(land => text.includes(land))
}

export function calculateAncestorMatches(userProfile, ancestors) {
  if (!ancestors || ancestors.length === 0) return []

  const {
    birthMonth = null,
    regions = [],
    era = null,
    milestones = []
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

      const ancestorText = [
        ancestor.name,
        ancestor.birthPlace || '',
        ancestor.birthRegion || '',
        ancestor.deathPlace || ''
      ].join(' ').toLowerCase()

      // 1. Birth Month / Birthday Twin (+30 pts)
      if (birthMonth && ancestorMonth) {
        if (birthMonth.toLowerCase() === ancestorMonth.toLowerCase()) {
          score += 30
          matchReasons.push(`Birthday Twin: Born in ${ancestorMonth} (shares your birth month)`)
        }
      }

      // 2. Geographic Roots (+24 pts per matched region)
      regions.forEach((regionId) => {
        const def = REGION_DEFINITIONS.find((r) => r.id === regionId)
        if (def) {
          const matchedKw = def.keywords.some((kw) => ancestorText.includes(kw))
          if (matchedKw) {
            score += 24
            const placeSnippet = ancestor.birthRegion || ancestor.birthPlace || def.label
            matchReasons.push(`Shared roots connected to ${def.label} (${placeSnippet})`)
          }
        }
      })

      // 3. Historical Era / Generation (+20 pts)
      if (era) {
        if (era === 'century20' && ancestor.birthYear && ancestor.birthYear >= 1900) {
          score += 20
          matchReasons.push(`20th Century Era: Born in ${ancestor.birthYear}`)
        } else if (era === 'pioneer' && ancestor.birthYear && ancestor.birthYear >= 1840 && ancestor.birthYear < 1900) {
          score += 20
          matchReasons.push(`Pioneer Era: Born in ${ancestor.birthYear}`)
        } else if (era === 'frontier' && ancestor.birthYear && ancestor.birthYear < 1840) {
          score += 20
          matchReasons.push(`Early Frontier Era: Born in ${ancestor.birthYear}`)
        } else if (era === 'direct' && ancestor.generation && ancestor.generation <= 3) {
          score += 20
          matchReasons.push(`Direct Lineage: ${ancestor.relationship || `Generation ${ancestor.generation}`}`)
        }
      }

      // 4. Life Milestones & Journey (+16 pts per milestone)
      milestones.forEach((mId) => {
        if (mId === 'immigrant' && isBornAbroad(ancestor)) {
          score += 16
          matchReasons.push(`Global Immigrant: Journeyed to the West from ${ancestor.birthRegion || ancestor.birthPlace || 'abroad'}`)
        }
        if (mId === 'longevity' && ancestorLifespan && ancestorLifespan >= 75) {
          score += 16
          matchReasons.push(`Remarkable Longevity: Lived a full, enduring life of ${ancestorLifespan} years`)
        }
        if (mId === 'young_builder') {
          const hasEarlyMilestone = ancestor.milestones && ancestor.milestones.some(m => m.age && m.age <= 24)
          if (hasEarlyMilestone || (ancestor.birthYear && ancestor.birthYear >= 1910 && ancestor.generation <= 4)) {
            score += 16
            matchReasons.push(`Young Pioneer: Established home, trade, or family in their early twenties`)
          }
        }
      })

      // Normalize score between 64% and 98%
      const finalPercentage = Math.min(98, Math.max(64, Math.round(score)))

      // Fallback reasons if no selections matched
      if (matchReasons.length === 0) {
        if (ancestor.birthPlace) {
          matchReasons.push(`Ancestral roots in ${ancestor.birthPlace}`)
        } else if (ancestor.birthYear) {
          matchReasons.push(`Born in ${ancestor.birthYear} (Gen ${ancestor.generation || 1})`)
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
