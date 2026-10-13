import React, { useState, useMemo } from 'react'
import Avatar from '../Common/Avatar'
import FamilySearchButton from '../Common/FamilySearchButton'
import './HeritageConstellation.css'

export default function HeritageConstellation({ ancestors, onSelectPerson }) {
  const [selectedFilter, setSelectedFilter] = useState('ALL')
  const [filterType, setFilterType] = useState('all') // 'region', 'generation', 'era', or 'all'

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
      const genLabel = gen <= 2 ? 'Gen 1–2 (Immediate)' : gen === 3 ? 'Gen 3 (Grandparents)' : gen === 4 ? 'Gen 4 (Great-Grandparents)' : `Gen ${gen}+ (Ancestors)`
      counts[genLabel] = (counts[genLabel] || 0) + 1
    })
    return Object.entries(counts).map(([genLabel, count]) => ({ genLabel, count }))
  }, [ancestors])

  // Extract era stats
  const eraStats = useMemo(() => {
    const counts = {
      '20th Century & Modern (1900+)': 0,
      'Pioneer Era (1840–1899)': 0,
      'Early Frontiers (Pre-1840)': 0
    }
    ancestors.forEach((p) => {
      if (p.birthYear) {
        if (p.birthYear >= 1900) counts['20th Century & Modern (1900+)']++
        else if (p.birthYear >= 1840) counts['Pioneer Era (1840–1899)']++
        else counts['Early Frontiers (Pre-1840)']++
      }
    })
    return Object.entries(counts)
      .filter(([_, count]) => count > 0)
      .map(([era, count]) => ({ era, count }))
  }, [ancestors])

  const maxGeneration = useMemo(() => {
    return Math.max(...ancestors.map((p) => p.generation || 1), 1)
  }, [ancestors])

  // Filtered ancestors
  const filteredAncestors = useMemo(() => {
    if (selectedFilter === 'ALL') return ancestors

    if (filterType === 'region') {
      return ancestors.filter((p) => {
        const text = `${p.birthPlace || ''} ${p.birthRegion || ''}`.toLowerCase()
        return text.includes(selectedFilter.toLowerCase())
      })
    }

    if (filterType === 'generation') {
      return ancestors.filter((p) => {
        const gen = p.generation || 1
        const genLabel = gen <= 2 ? 'Gen 1–2 (Immediate)' : gen === 3 ? 'Gen 3 (Grandparents)' : gen === 4 ? 'Gen 4 (Great-Grandparents)' : `Gen ${gen}+ (Ancestors)`
        return genLabel === selectedFilter
      })
    }

    if (filterType === 'era') {
      return ancestors.filter((p) => {
        if (!p.birthYear) return false
        if (selectedFilter.includes('1900+')) return p.birthYear >= 1900
        if (selectedFilter.includes('1840–1899')) return p.birthYear >= 1840 && p.birthYear < 1900
        if (selectedFilter.includes('Pre-1840')) return p.birthYear < 1840
        return true
      })
    }

    return ancestors
  }, [ancestors, selectedFilter, filterType])

  return (
    <div className="pillar-container constellation-pillar">
      {/* Overview Intro */}
      <section className="constellation-hero-card">
        <h2>Generations &amp; Homelands of Your Lineage</h2>
        <p>
          Explore the generational branches and migration homelands that shaped your family tree—filter by region, generation, and historical era.
        </p>

        <div className="stats-row">
          <div className="stat-box">
            <span className="stat-number">{ancestors.length}</span>
            <span className="stat-label">Ancestors Documented</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">{regionStats.length}</span>
            <span className="stat-label">Homeland Regions</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">{maxGeneration}</span>
            <span className="stat-label">Generations Spanned</span>
          </div>
        </div>
      </section>

      {/* Interactive Filter Hub */}
      <section className="filter-hub">
        {/* Filter by Region */}
        <div className="filter-block">
          <div className="filter-block-header">
            <h4>Filter by Homeland &amp; Region</h4>
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
                  <span className="tag-name">{region}</span>
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
            <h4>Filter by Historical Era</h4>
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
              ? 'All Lineage Relatives'
              : `Ancestors in: "${selectedFilter}"`}
          </h3>
        </div>

        <div className="ancestor-grid">
          {filteredAncestors.map((person, idx) => (
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
          ))}
        </div>
      </section>
    </div>
  )
}
