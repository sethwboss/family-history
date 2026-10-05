import React, { useState, useMemo } from 'react'
import Avatar from '../Common/Avatar'
import FamilySearchButton from '../Common/FamilySearchButton'
import Badge from '../Common/Badge'
import './HeritageConstellation.css'

export default function HeritageConstellation({ ancestors, onSelectPerson }) {
  const [selectedFilter, setSelectedFilter] = useState('ALL')
  const [filterType, setFilterType] = useState('all') // 'trade', 'region', or 'all'

  // Extract unique trades
  const tradeStats = useMemo(() => {
    const counts = {}
    ancestors.forEach((p) => {
      if (p.occupations) {
        p.occupations.forEach((occ) => {
          counts[occ] = (counts[occ] || 0) + 1
        })
      }
    })
    return Object.entries(counts)
      .map(([trade, count]) => ({ trade, count }))
      .sort((a, b) => b.count - a.count)
  }, [ancestors])

  // Extract unique regions
  const regionStats = useMemo(() => {
    const counts = {}
    ancestors.forEach((p) => {
      const region = p.birthRegion || (p.birthPlace ? p.birthPlace.split(',').pop().trim() : 'Unknown')
      if (region && region !== 'Unknown') {
        counts[region] = (counts[region] || 0) + 1
      }
    })
    return Object.entries(counts)
      .map(([region, count]) => ({ region, count }))
      .sort((a, b) => b.count - a.count)
  }, [ancestors])

  // Filtered ancestors
  const filteredAncestors = useMemo(() => {
    if (selectedFilter === 'ALL') return ancestors

    if (filterType === 'trade') {
      return ancestors.filter(
        (p) => p.occupations && p.occupations.includes(selectedFilter)
      )
    }

    if (filterType === 'region') {
      return ancestors.filter((p) => {
        const region = p.birthRegion || (p.birthPlace ? p.birthPlace.split(',').pop().trim() : '')
        return region.toLowerCase().includes(selectedFilter.toLowerCase())
      })
    }

    return ancestors
  }, [ancestors, selectedFilter, filterType])

  return (
    <div className="pillar-container constellation-pillar">
      {/* Overview Intro without redundant badge */}
      <section className="constellation-hero-card">
        <h2>The Trades, Crafts &amp; Roots of Your Lineage</h2>
        <p>
          Explore the skills that sustained your ancestors across generations—from Danish blacksmiths and sea navigators to frontier teachers and builders.
        </p>

        <div className="stats-row">
          <div className="stat-box">
            <span className="stat-number">{ancestors.length}</span>
            <span className="stat-label">Ancestors Documented</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">{tradeStats.length || '12+'}</span>
            <span className="stat-label">Distinct Trades &amp; Crafts</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">{regionStats.length || '8+'}</span>
            <span className="stat-label">Global Homeland Regions</span>
          </div>
        </div>
      </section>

      {/* Interactive Filter Hub */}
      <section className="filter-hub">
        <div className="filter-block">
          <div className="filter-block-header">
            <h4>⚒️ Filter by Profession or Craft</h4>
            {selectedFilter !== 'ALL' && (
              <button 
                type="button" 
                className="btn-clear-filter"
                onClick={() => {
                  setSelectedFilter('ALL')
                  setFilterType('all')
                }}
              >
                Clear Filter ✕
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
                  className={`cluster-tag ${isSelected ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedFilter(trade)
                    setFilterType('trade')
                  }}
                >
                  <span className="tag-name">{trade}</span>
                  <span className="tag-count">{count}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="filter-block">
          <div className="filter-block-header">
            <h4>🗺️ Filter by Geographic Roots</h4>
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
      </section>

      {/* Filtered Grid */}
      <section className="constellation-grid-section">
        <div className="results-header">
          <h3>
            {selectedFilter === 'ALL'
              ? 'All Lineage Relatives'
              : `Ancestors with ${filterType === 'trade' ? 'Trade' : 'Roots'}: "${selectedFilter}"`}
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
                  </p>
                  <p className="card-origin">
                    📍 {person.birthPlace || person.birthRegion || 'Origin recorded in tree'}
                  </p>
                </div>
              </div>

              {person.occupations && person.occupations.length > 0 && (
                <div className="card-tags">
                  {person.occupations.map((occ, oIdx) => (
                    <Badge key={oIdx} variant="trade">
                      ⚒️ {occ}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="card-actions-row">
                <button
                  type="button"
                  className="btn-card-inspect"
                  onClick={() => onSelectPerson(person)}
                >
                  View Details
                </button>
                <FamilySearchButton
                  url={person.familySearchUrl}
                  variant="subtle"
                  size="sm"
                  label="FS Profile ↗"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
