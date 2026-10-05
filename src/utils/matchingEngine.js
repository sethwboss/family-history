/**
 * Ancestor Matching Engine
 * Computes multi-dimensional compatibility scores between the user's
 * quiz selections and ancestors in the active tree.
 */

export function calculateAncestorMatches(userProfile, ancestors) {
  if (!ancestors || ancestors.length === 0) return []

  const {
    interests = [],
    career = '',
    regions = [],
    traits = []
  } = userProfile

  // Career to trade keywords map
  const careerKeywords = {
    'tech': ['computer', 'engineer', 'technology', 'problem solver', 'machinist'],
    'trades': ['craftsman', 'builder', 'carpenter', 'blacksmith', 'ironworker', 'surveyor', 'machinist'],
    'education': ['educator', 'schoolteacher', 'teacher', 'writer', 'historian'],
    'agriculture': ['farmer', 'rancher', 'agriculture', 'homesteader', 'orchard'],
    'healthcare': ['nurse', 'herbalist', 'midwife', 'caregiver', 'doctor'],
    'arts': ['pianist', 'organist', 'musician', 'fiddle', 'weaver', 'seamstress', 'poetry'],
    'adventure': ['scout', 'sea captain', 'navigator', 'explorer', 'veteran', 'colonizer']
  }

  // Region keyword map
  const regionKeywords = {
    'utah': ['utah', 'american fork', 'logan', 'garland', 'thatcher', 'spanish fork', 'salt lake'],
    'denmark': ['denmark', 'randers', 'kristrup', 'aalborg', 'svendborg'],
    'england': ['england', 'lancashire', 'yorkshire', 'great britain', 'uk'],
    'idaho': ['idaho', 'bingham', 'presto'],
    'california': ['california', 'san bernardino']
  }

  return ancestors
    .map((ancestor) => {
      let score = 50 // baseline score
      const matchReasons = []

      const allAncestorText = [
        ancestor.name,
        ...(ancestor.occupations || []),
        ...(ancestor.interests || []),
        ancestor.birthPlace || '',
        ancestor.birthRegion || '',
        ancestor.bioSnippet || '',
        ...(ancestor.notes || [])
      ].join(' ').toLowerCase()

      // 1. Shared Interests Matching (+12 pts per match)
      interests.forEach((interest) => {
        const lowerInterest = interest.toLowerCase()
        if (allAncestorText.includes(lowerInterest)) {
          score += 12
          matchReasons.push(`Shared interest in ${interest}`)
        }
      })

      // 2. Career & Trade Alignment (+15 pts)
      if (career && careerKeywords[career]) {
        const keywords = careerKeywords[career]
        const matchedKw = keywords.find((kw) => allAncestorText.includes(kw))
        if (matchedKw) {
          score += 15
          matchReasons.push(`Aligned in craftsmanship/career path (${matchedKw})`)
        }
      }

      // 3. Geographic & Heritage Origins (+10 pts per region)
      regions.forEach((region) => {
        const kws = regionKeywords[region] || [region.toLowerCase()]
        const matchedPlace = kws.find((kw) => allAncestorText.includes(kw))
        if (matchedPlace) {
          score += 10
          matchReasons.push(`Shared roots connected to ${region.toUpperCase()}`)
        }
      })

      // 4. Trait & Life Milestone Alignment (+8 pts)
      traits.forEach((trait) => {
        if (allAncestorText.includes(trait.toLowerCase())) {
          score += 8
          matchReasons.push(`Exemplified trait: ${trait}`)
        }
      })

      // Normalize score between 62% and 98% for realistic feel
      const finalPercentage = Math.min(98, Math.max(62, Math.round(score)))

      // Ensure at least one nice reason if list is empty
      if (matchReasons.length === 0) {
        if (ancestor.birthRegion) {
          matchReasons.push(`Ancestral roots in ${ancestor.birthRegion}`)
        } else {
          matchReasons.push(`Direct ancestral lineage connection`)
        }
      }

      return {
        ...ancestor,
        matchPercentage: finalPercentage,
        matchReasons: matchReasons.slice(0, 3)
      }
    })
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
}
