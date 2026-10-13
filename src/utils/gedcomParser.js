/**
 * Client-Side GEDCOM 5.5.1 / 7.0 In-Browser Parser
 * Parses standard .ged files and extracts individuals, families, vitals,
 * occupations, places, and FamilySearch Person IDs.
 */

export function parseGedcom(gedcomText) {
  const lines = gedcomText.split(/\r?\n/)
  const individuals = []
  let currentIndi = null
  let currentEvent = null

  // Helper to safely extract year from date string (e.g. "21 JUN 2004", "1882", "ABT 1845")
  function extractYear(dateStr) {
    if (!dateStr) return null
    const match = dateStr.match(/\b(1\d{3}|20\d{2})\b/)
    return match ? parseInt(match[1], 10) : null
  }

  // Helper to extract country/state from place string (e.g. "American Fork, Utah, Utah" -> "Utah, USA")
  function extractRegion(placeStr) {
    if (!placeStr) return 'Unknown Origin'
    const parts = placeStr.split(',').map((p) => p.trim())
    if (parts.length >= 2) {
      return parts.slice(-2).join(', ')
    }
    return parts[0] || 'Unknown'
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // 0 @ID@ INDI
    const indiMatch = line.match(/^0\s+@([^@]+)@\s+INDI/i)
    if (indiMatch) {
      if (currentIndi) {
        finalizeIndividual(currentIndi)
        individuals.push(currentIndi)
      }
      currentIndi = {
        id: indiMatch[1],
        name: 'Unknown Ancestor',
        givenName: '',
        surname: '',
        gender: 'U',
        birthDate: '',
        birthYear: null,
        birthPlace: '',
        birthRegion: '',
        deathDate: '',
        deathYear: null,
        deathPlace: '',
        occupations: [],
        interests: [],
        milestones: [],
        notes: [],
        familySearchId: null,
        familySearchUrl: null,
        memoriesUrl: null,
        generation: 1
      }
      currentEvent = null
      continue
    }

    // If we hit any other 0 level tag (like 0 @F1@ FAM or 0 TRLR), finalize current
    if (line.match(/^0\s+/)) {
      if (currentIndi) {
        finalizeIndividual(currentIndi)
        individuals.push(currentIndi)
        currentIndi = null
      }
      currentEvent = null
      continue
    }

    if (!currentIndi) continue

    // 1 NAME First /Last/
    const nameMatch = line.match(/^1\s+NAME\s+(.*)/i)
    if (nameMatch) {
      const rawName = nameMatch[1]
      const cleanName = rawName.replace(/\//g, '').trim()
      currentIndi.name = cleanName
      const parts = rawName.split('/')
      if (parts.length >= 2) {
        currentIndi.givenName = parts[0].trim()
        currentIndi.surname = parts[1].trim()
      }
      continue
    }

    // 1 SEX M / F
    const sexMatch = line.match(/^1\s+SEX\s+([MFU])/i)
    if (sexMatch) {
      currentIndi.gender = sexMatch[1].toUpperCase()
      continue
    }

    // 1 _FSID or 1 _FSFTID (FamilySearch Person ID)
    const fsMatch = line.match(/^1\s+(_FSID|_FSFTID)\s+([A-Z0-9]{4}-[A-Z0-9]{3,4})/i)
    if (fsMatch) {
      currentIndi.familySearchId = fsMatch[2].toUpperCase()
      currentIndi.familySearchUrl = `https://www.familysearch.org/tree/person/details/${fsMatch[2]}`
      currentIndi.memoriesUrl = `https://www.familysearch.org/tree/person/memories/${fsMatch[2]}`
      continue
    }

    // 1 OCCU Occupation
    const occuMatch = line.match(/^1\s+OCCU\s*(.*)/i)
    if (occuMatch) {
      const occu = occuMatch[1].trim()
      if (occu) currentIndi.occupations.push(occu)
      currentEvent = 'OCCU'
      continue
    }

    // 1 BIRT
    if (line.match(/^1\s+BIRT/i)) {
      currentEvent = 'BIRT'
      continue
    }

    // 1 DEAT
    if (line.match(/^1\s+DEAT/i)) {
      currentEvent = 'DEAT'
      continue
    }

    // 1 EVEN / 1 RESI
    const eventMatch = line.match(/^1\s+(EVEN|RESI|MARR|EMIG|IMMI|NATU)/i)
    if (eventMatch) {
      currentEvent = eventMatch[1].toUpperCase()
      continue
    }

    // 2 DATE
    const dateMatch = line.match(/^2\s+DATE\s+(.*)/i)
    if (dateMatch && currentEvent) {
      const dateVal = dateMatch[1].trim()
      const year = extractYear(dateVal)
      if (currentEvent === 'BIRT') {
        currentIndi.birthDate = dateVal
        currentIndi.birthYear = year
      } else if (currentEvent === 'DEAT') {
        currentIndi.deathDate = dateVal
        currentIndi.deathYear = year
      } else {
        currentIndi.milestones.push({
          type: currentEvent,
          date: dateVal,
          year: year,
          event: formatEventDescription(currentEvent, dateVal)
        })
      }
      continue
    }

    // 2 PLAC
    const placMatch = line.match(/^2\s+PLAC\s+(.*)/i)
    if (placMatch && currentEvent) {
      const placVal = placMatch[1].trim()
      if (currentEvent === 'BIRT') {
        currentIndi.birthPlace = placVal
        currentIndi.birthRegion = extractRegion(placVal)
      } else if (currentEvent === 'DEAT') {
        currentIndi.deathPlace = placVal
      }
      continue
    }

    // 1 NOTE
    const noteMatch = line.match(/^1\s+NOTE\s*(.*)/i)
    if (noteMatch) {
      const noteText = noteMatch[1].trim()
      if (noteText) currentIndi.notes.push(noteText)
      continue
    }
  }

  if (currentIndi) {
    finalizeIndividual(currentIndi)
    individuals.push(currentIndi)
  }

  return individuals
}

function formatEventDescription(type, date) {
  switch (type) {
    case 'MARR': return `Married (${date})`
    case 'EMIG':
    case 'IMMI': return `Immigrated / Migrated (${date})`
    case 'RESI': return `Resided in community (${date})`
    case 'NATU': return `Naturalized Citizen (${date})`
    default: return `Notable life milestone (${date})`
  }
}

export function extractMonth(dateStr) {
  if (!dateStr) return null
  const months = [
    { num: 1, name: 'January', abbr: 'jan' },
    { num: 2, name: 'February', abbr: 'feb' },
    { num: 3, name: 'March', abbr: 'mar' },
    { num: 4, name: 'April', abbr: 'apr' },
    { num: 5, name: 'May', abbr: 'may' },
    { num: 6, name: 'June', abbr: 'jun' },
    { num: 7, name: 'July', abbr: 'jul' },
    { num: 8, name: 'August', abbr: 'aug' },
    { num: 9, name: 'September', abbr: 'sep' },
    { num: 10, name: 'October', abbr: 'oct' },
    { num: 11, name: 'November', abbr: 'nov' },
    { num: 12, name: 'December', abbr: 'dec' }
  ]
  const lower = dateStr.toLowerCase()
  for (const m of months) {
    if (new RegExp(`\\b${m.abbr}\\b|\\b${m.name.toLowerCase()}\\b`).test(lower) || lower.includes(m.abbr)) {
      return m.name
    }
  }
  const isoMatch = dateStr.match(/^\d{4}-(\d{2})-\d{2}/)
  if (isoMatch) {
    const idx = parseInt(isoMatch[1], 10) - 1
    if (months[idx]) return months[idx].name
  }
  return null
}

function finalizeIndividual(indi) {
  // Infer generation roughly based on birth year if available
  const currentYear = 2026
  if (indi.birthYear) {
    const ageDiff = currentYear - indi.birthYear
    indi.generation = Math.max(1, Math.min(8, Math.round(ageDiff / 28)))
  }

  // Extract birth month and lifespan
  indi.birthMonth = extractMonth(indi.birthDate)
  if (indi.birthYear && indi.deathYear && indi.deathYear >= indi.birthYear) {
    indi.lifespan = indi.deathYear - indi.birthYear
  } else {
    indi.lifespan = null
  }

  // Calculate milestone ages: (milestone.year - birthYear)
  if (indi.birthYear && indi.milestones.length > 0) {
    indi.milestones.forEach((m) => {
      if (m.year && m.year >= indi.birthYear) {
        m.age = m.year - indi.birthYear
      }
    })
  }

  // Default deep links if familySearchId not found
  if (!indi.familySearchUrl && indi.familySearchId) {
    indi.familySearchUrl = `https://www.familysearch.org/tree/person/details/${indi.familySearchId}`
    indi.memoriesUrl = `https://www.familysearch.org/tree/person/memories/${indi.familySearchId}`
  } else if (!indi.familySearchUrl) {
    const query = encodeURIComponent(`${indi.name} ${indi.birthYear || ''}`)
    indi.familySearchUrl = `https://www.familysearch.org/search/tree/results?q.anyGivenName=${encodeURIComponent(indi.givenName)}&q.anySurname=${encodeURIComponent(indi.surname)}&q.birthLikeDate.from=${indi.birthYear ? indi.birthYear - 2 : ''}&q.birthLikeDate.to=${indi.birthYear ? indi.birthYear + 2 : ''}`
  }
}
