import React, { useState, useMemo } from 'react'
import Avatar from '../Common/Avatar'
import FamilySearchButton from '../Common/FamilySearchButton'
import { isBornAbroad } from '../../utils/matchingEngine'
import './HeritageConstellation.css'

// Helper to classify ancestor trades from GEDCOM OCCU or notes
function classifyTrade(person) {
  const text = [
    ...(person.occupations || []),
    ...(person.interests || []),
    person.bioSnippet || '',
    ...(person.notes || [])
  ].join(' ').toLowerCase()

  if (/builder|carpenter|blacksmith|mason|craft|woodwork|tailor|shoemaker|weaver|joiner|wheelwright|cooper|miller|mechanic|stone|iron|smith/.test(text)) {
    return 'Building & Crafts'
  }
  if (/farmer|farming|rancher|agriculture|gardener|yeoman|husbandman|laborer|shepherd|dairyman|homestead|land|orchard/.test(text)) {
    return 'Farming & Agriculture'
  }
  if (/teacher|teaching|school|homemaker|mother|housewife|nurse|caregiver|midwife|domestic|full-time mother/.test(text)) {
    return 'Homemaking & Care'
  }
  if (/merchant|clerk|store|shop|grocer|manager|sales|innkeeper|business|leader|postmaster|mayor|agent/.test(text)) {
    return 'Commerce & Leadership'
  }
  if (/engineer|computer|science|scientist|developer|software|technology|problem solver|technician|inventor|coding/.test(text)) {
    return 'Science & Engineering'
  }
  return null
}

function getLifespanBracket(person) {
  const span = person.lifespan || (
    person.birthYear && person.deathYear && person.deathYear >= person.birthYear
      ? person.deathYear - person.birthYear
      : null
  )
  if (!span) return null
  if (span >= 80) return '80+ Years'
  if (span >= 60) return '60–79 Years'
  if (span >= 40) return '40–59 Years'
  return 'Under 40 Years'
}

export default function HeritageConstellation({ ancestors, onSelectPerson }) {
  const [selectedFilter, setSelectedFilter] = useState('ALL')
  const [filterType, setFilterType] = useState('all') // 'trade', 'voyage', 'longevity', 'region', 'generation', 'era', or 'all'

  // Extract Trade Stats
  const tradeStats = useMemo(() => {
    const counts = {}
    ancestors.forEach((p) => {
      const trade = classifyTrade(p)
      if (trade) {
        counts[trade] = (counts[trade] || 0) + 1
      }
    })
    return Object.entries(counts)
      .map(([trade, count]) => ({ trade, count }))
      .sort((a, b) => b.count - a.count)
  }, [ancestors])

  // Extract Voyage & Migration Stats
  const voyageStats = useMemo(() => {
    let immigrantCount = 0
    let nativeCount = 0
    ancestors.forEach((p) => {
      const isImmigrant = isBornAbroad(p) || (p.milestones && p.milestones.some(m => m.type === 'EMIG' || m.type === 'IMMI'))
      if (isImmigrant) immigrantCount++
      else nativeCount++
    })
    const list = []
    if (immigrantCount > 0) list.push({ label: 'Immigrants', count: immigrantCount, key: 'immigrant' })
    if (nativeCount > 0) list.push({ label: 'Non-Immigrants', count: nativeCount, key: 'native' })
    return list
  }, [ancestors])

  // Extract Longevity Stats
  const longevityStats = useMemo(() => {
    const counts = {}
    ancestors.forEach((p) => {
      const bracket = getLifespanBracket(p)
      if (bracket) {
        counts[bracket] = (counts[bracket] || 0) + 1
      }
    })
    const order = [
      '80+ Years',
      '60–79 Years',
      '40–59 Years',
      'Under 40 Years'
    ]
    return order
      .filter(bracket => counts[bracket] > 0)
      .map(bracket => ({ bracket, count: counts[bracket] }))
  }, [ancestors])

  // Extract unique regions with ancestor counts
  const regionStats = useMemo(() => {
    const counts = {}
    ancestors.forEach((p) => {
      const region = p.birthRegion || (p.birthPlace ? p.birthPlace.split(',').slice(-2).join(', ').trim() : 'Unknown')
      if (region && region !== 'Unknown') {
        counts[region] = (counts[region] || 0) + 1
      }
    })
    return Object.entries(counts)
      .map(([region, count]) => ({ region, count }))
      .sort((a, b) => b.count - a.count)
  }, [ancestors])

  // Extract generation stats
  const generationStats = useMemo(() => {
    const counts = {}
    ancestors.forEach((p) => {
      const gen = p.generation || 1
      const genLabel = gen <= 2 ? 'Gen 1–2' : gen === 3 ? 'Gen 3' : gen === 4 ? 'Gen 4' : `Gen ${gen}+`
      counts[genLabel] = (counts[genLabel] || 0) + 1
    })
    return Object.entries(counts).map(([genLabel, count]) => ({ genLabel, count }))
  }, [ancestors])

  // Extract era stats
  const eraStats = useMemo(() => {
    const counts = {
      '1900+': 0,
      '1840–1899': 0,
      'Pre-1840': 0
    }
    ancestors.forEach((p) => {
      if (p.birthYear) {
        if (p.birthYear >= 1900) counts['1900+']++
        else if (p.birthYear >= 1840) counts['1840–1899']++
        else counts['Pre-1840']++
      }
    })
    return Object.entries(counts)
      .filter(([_, count]) => count > 0)
      .map(([era, count]) => ({ era, count }))
  }, [ancestors])

  const maxGeneration = useMemo(() => {
    return Math.max(...ancestors.map((p) => p.generation || 1), 1)
  }, [ancestors])

  const immigrantTotal = useMemo(() => {
    return ancestors.filter(p => isBornAbroad(p) || (p.milestones && p.milestones.some(m => m.type === 'EMIG' || m.type === 'IMMI'))).length
  }, [ancestors])

  // Filtered ancestors
  const filteredAncestors = useMemo(() => {
    if (selectedFilter === 'ALL') return ancestors

    if (filterType === 'trade') {
      return ancestors.filter((p) => classifyTrade(p) === selectedFilter)
    }

    if (filterType === 'voyage') {
      return ancestors.filter((p) => {
        const isImmigrant = isBornAbroad(p) || (p.milestones && p.milestones.some(m => m.type === 'EMIG' || m.type === 'IMMI'))
        return selectedFilter === 'Immigrants' ? isImmigrant : !isImmigrant
      })
    }

    if (filterType === 'longevity') {
      return ancestors.filter((p) => getLifespanBracket(p) === selectedFilter)
    }

    if (filterType === 'region') {
      return ancestors.filter((p) => {
        const text = `${p.birthPlace || ''} ${p.birthRegion || ''}`.toLowerCase()
        return text.includes(selectedFilter.toLowerCase())
      })
    }

    if (filterType === 'generation') {
      return ancestors.filter((p) => {
        const gen = p.generation || 1
        const genLabel = gen <= 2 ? 'Gen 1–2' : gen === 3 ? 'Gen 3' : gen === 4 ? 'Gen 4' : `Gen ${gen}+`
        return genLabel === selectedFilter
      })
    }

    if (filterType === 'era') {
      return ancestors.filter((p) => {
        if (!p.birthYear) return false
        if (selectedFilter === '1900+') return p.birthYear >= 1900
        if (selectedFilter === '1840–1899') return p.birthYear >= 1840 && p.birthYear < 1900
        if (selectedFilter === 'Pre-1840') return p.birthYear < 1840
        return true
      })
    }

    return ancestors
  }, [ancestors, selectedFilter, filterType])

  return (
    <div className="pillar-container constellation-pillar">
      {/* Overview Intro */}
      <section className="constellation-hero-card">
        <h2>Constellation</h2>
        <p>
          Filter your family tree by trade, migration, lifespan, region, and generation.
        </p>

        <div className="stats-row">
          <div className="stat-box">
            <span className="stat-number">{ancestors.length}</span>
            <span className="stat-label">Ancestors</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">{tradeStats.length}</span>
            <span className="stat-label">Trades</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">{immigrantTotal}</span>
            <span className="stat-label">Immigrants</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">{regionStats.length}</span>
            <span className="stat-label">Regions</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">{maxGeneration}</span>
            <span className="stat-label">Generations</span>
          </div>
        </div>
      </section>

      {/* Interactive Filter Hub */}
      <section className="filter-hub">
        {/* Filter by Trades */}
        {tradeStats.length > 0 && (
          <div className="filter-block">
            <div className="filter-block-header">
              <h4>Filter by Trade</h4>
              {selectedFilter !== 'ALL' && (
                <button 
                  type="button" 
                  className="btn-clear-filter"
                  onClick={() => {
                    setSelectedFilter('ALL')
                    setFilterType('all')
                  }}
                >
                  Clear Filter ×
                </button>
              )}
            </div>
            <div className="cluster-tags">
              {tradeStats.map(({ trade, count }) => {
                const isSelected = selectedFilter === trade
                return (
                  <button
                    key={trade}
                    type="button"
                    className={`cluster-tag trade-tag ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedFilter(trade)
                      setFilterType('trade')
                    }}
                  >
                    <span className="tag-name">🔨 {trade}</span>
                    <span className="tag-count">{count}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Filter by Immigration */}
        {voyageStats.length > 0 && (
          <div className="filter-block">
            <div className="filter-block-header">
              <h4>Filter by Immigration</h4>
            </div>
            <div className="cluster-tags">
              {voyageStats.map(({ label, count }) => {
                const isSelected = selectedFilter === label
                return (
                  <button
                    key={label}
                    type="button"
                    className={`cluster-tag voyage-tag ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedFilter(label)
                      setFilterType('voyage')
                    }}
                  >
                    <span className="tag-name">🚢 {label}</span>
                    <span className="tag-count">{count}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Filter by Lifespan */}
        {longevityStats.length > 0 && (
          <div className="filter-block">
            <div className="filter-block-header">
              <h4>Filter by Lifespan</h4>
            </div>
            <div className="cluster-tags">
              {longevityStats.map(({ bracket, count }) => {
                const isSelected = selectedFilter === bracket
                return (
                  <button
                    key={bracket}
                    type="button"
                    className={`cluster-tag longevity-tag ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedFilter(bracket)
                      setFilterType('longevity')
                    }}
                  >
                    <span className="tag-name">⏳ {bracket}</span>
                    <span className="tag-count">{count}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Filter by Region */}
        <div className="filter-block">
          <div className="filter-block-header">
            <h4>Filter by Region</h4>
          </div>
          <div className="cluster-tags">
            {regionStats.map(({ region, count }) => {
              const isSelected = selectedFilter === region
              return (
                <button
                  key={region}
                  type="button"
                  className={`cluster-tag region-tag ${isSelected ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedFilter(region)
                    setFilterType('region')
                  }}
                >
                  <span className="tag-name">📍 {region}</span>
                  <span className="tag-count">{count}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Filter by Generation */}
        <div className="filter-block">
          <div className="filter-block-header">
            <h4>Filter by Generation</h4>
          </div>
          <div className="cluster-tags">
            {generationStats.map(({ genLabel, count }) => {
              const isSelected = selectedFilter === genLabel
              return (
                <button
                  key={genLabel}
                  type="button"
                  className={`cluster-tag ${isSelected ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedFilter(genLabel)
                    setFilterType('generation')
                  }}
                >
                  <span className="tag-name">{genLabel}</span>
                  <span className="tag-count">{count}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Filter by Era */}
        <div className="filter-block">
          <div className="filter-block-header">
            <h4>Filter by Era</h4>
          </div>
          <div className="cluster-tags">
            {eraStats.map(({ era, count }) => {
              const isSelected = selectedFilter === era
              return (
                <button
                  key={era}
                  type="button"
                  className={`cluster-tag ${isSelected ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedFilter(era)
                    setFilterType('era')
                  }}
                >
                  <span className="tag-name">{era}</span>
                  <span className="tag-count">{count}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Filtered Grid */}
      <section className="constellation-grid-section">
        <div className="results-header">
          <h3>
            {selectedFilter === 'ALL'
              ? 'All Ancestors'
              : `Filter: "${selectedFilter}"`}
          </h3>
          <span className="showing-count">Showing {filteredAncestors.length} of {ancestors.length}</span>
        </div>

        <div className="ancestor-grid">
          {filteredAncestors.map((person, idx) => {
            const trade = classifyTrade(person)
            const isImmigrant = isBornAbroad(person) || (person.milestones && person.milestones.some(m => m.type === 'EMIG' || m.type === 'IMMI'))
            const lifespan = person.lifespan || (
              person.birthYear && person.deathYear && person.deathYear >= person.birthYear
                ? person.deathYear - person.birthYear
                : null
            )
            const mainOccu = (person.occupations && person.occupations.length > 0) ? person.occupations[0] : trade

            return (
              <div key={person.id || idx} className="ancestor-card">
                <div className="card-top-row">
                  <Avatar gender={person.gender} size="sm" />
                  <div className="card-info">
                    <h4 className="card-name">{person.name}</h4>
                    <p className="card-lifespan">
                      {person.birthYear ? `b. ${person.birthYear}` : 'Birth unlisted'}
                      {person.deathYear ? ` – d. ${person.deathYear}` : ''}
                      {person.relationship && ` • ${person.relationship}`}
                    </p>
                    <p className="card-origin">
                      📍 {person.birthPlace || person.birthRegion || 'Origin in family tree'}
                    </p>
                  </div>
                </div>

                {/* Badges for Trade, Voyager & Longevity */}
                {(mainOccu || isImmigrant || lifespan) && (
                  <div className="card-tags">
                    {mainOccu && (
                      <span className="mini-pill occ-pill" title={person.occupations?.join(', ')}>
                        🔨 {mainOccu}
                      </span>
                    )}
                    {isImmigrant && (
                      <span className="mini-pill voyage-pill">
                        🚢 Immigrant
                      </span>
                    )}
                    {lifespan && (
                      <span className="mini-pill lifespan-pill">
                        ⏳ {lifespan} yrs
                      </span>
                    )}
                  </div>
                )}

                <div className="card-actions-row">
                  <button
                    type="button"
                    className="btn-card-inspect"
                    onClick={() => onSelectPerson(person)}
                  >
                    View Ancestor Profile
                  </button>
                  <FamilySearchButton
                    url={person.familySearchUrl}
                    variant="outline"
                    size="sm"
                    label="FamilySearch Record ↗"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
