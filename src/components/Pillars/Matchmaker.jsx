import React, { useState, useMemo, useRef } from 'react'
import {
  calculateAncestorMatches,
  REGION_DEFINITIONS,
  ERA_OPTIONS,
  MILESTONE_OPTIONS,
  MONTH_OPTIONS
} from '../../utils/matchingEngine'
import Avatar from '../Common/Avatar'
import FamilySearchButton from '../Common/FamilySearchButton'
import Badge from '../Common/Badge'
import './Matchmaker.css'

export default function Matchmaker({ ancestors, onSelectPerson }) {
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [selectedRegions, setSelectedRegions] = useState([])
  const [selectedEra, setSelectedEra] = useState(null)
  const [selectedMilestones, setSelectedMilestones] = useState([])
  const [hasSubmittedQuiz, setHasSubmittedQuiz] = useState(false)
  const resultsRef = useRef(null)

  const toggleRegion = (regionId) => {
    setSelectedRegions((prev) =>
      prev.includes(regionId)
        ? prev.filter((r) => r !== regionId)
        : [...prev, regionId]
    )
  }

  const toggleMilestone = (milestoneId) => {
    setSelectedMilestones((prev) =>
      prev.includes(milestoneId)
        ? prev.filter((m) => m !== milestoneId)
        : [...prev, milestoneId]
    )
  }

  // Calculate top matches based on authentic GEDCOM attributes
  const matches = useMemo(() => {
    return calculateAncestorMatches(
      {
        birthMonth: selectedMonth,
        regions: selectedRegions,
        era: selectedEra,
        milestones: selectedMilestones
      },
      ancestors
    )
  }, [selectedMonth, selectedRegions, selectedEra, selectedMilestones, ancestors])

  const topMatches = matches.slice(0, 6)

  const handleCalculate = () => {
    setHasSubmittedQuiz(true)
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <div className="pillar-container matchmaker-pillar">
      {/* Quiz Card */}
      <section className="quiz-card">
        <div className="quiz-header">
          <h2>Discover Your Heritage Twins &amp; Ancestral Roots</h2>
          <p>
            Match with ancestors across authentic historical records—your birth month, ancestral homelands, generational eras, and life milestones.
          </p>
        </div>

        <div className="quiz-grid">
          {/* 1. Birth Month / Birthday Twin */}
          <div className="quiz-field">
            <label className="field-label">
              <span>1. Your Birth Month (Find Your Birthday Twin)</span>
              {selectedMonth && <span className="selection-count">Selected: {selectedMonth}</span>}
            </label>
            <div className="chips-wrap">
              {MONTH_OPTIONS.map((month) => {
                const isSelected = selectedMonth === month
                const shortLabel = month.slice(0, 3)
                return (
                  <button
                    key={month}
                    type="button"
                    className={`chip ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedMonth(prev => prev === month ? null : month)}
                    title={`Match ancestors born in ${month}`}
                  >
                    <span>{shortLabel}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 2. Geographic Roots & Homelands */}
          <div className="quiz-field">
            <label className="field-label">
              <span>2. Geographic Roots &amp; Homelands</span>
              {selectedRegions.length > 0 && (
                <span className="selection-count">{selectedRegions.length} selected</span>
              )}
            </label>
            <div className="chips-wrap">
              {REGION_DEFINITIONS.map((reg) => {
                const isSelected = selectedRegions.includes(reg.id)
                return (
                  <button
                    key={reg.id}
                    type="button"
                    className={`chip ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleRegion(reg.id)}
                  >
                    <span>{reg.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 3. Historical Era / Generation */}
          <div className="quiz-field">
            <label className="field-label">
              <span>3. Historical Era &amp; Lineage</span>
              {selectedEra && (
                <span className="selection-count">
                  {ERA_OPTIONS.find(e => e.id === selectedEra)?.label}
                </span>
              )}
            </label>
            <div className="chips-wrap">
              {ERA_OPTIONS.map((era) => {
                const isSelected = selectedEra === era.id
                return (
                  <button
                    key={era.id}
                    type="button"
                    className={`chip radio-chip ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedEra(prev => prev === era.id ? null : era.id)}
                  >
                    <span>{era.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 4. Life Milestones & Journey */}
          <div className="quiz-field">
            <label className="field-label">
              <span>4. Life Journey &amp; Milestones</span>
              {selectedMilestones.length > 0 && (
                <span className="selection-count">{selectedMilestones.length} selected</span>
              )}
            </label>
            <div className="chips-wrap">
              {MILESTONE_OPTIONS.map((m) => {
                const isSelected = selectedMilestones.includes(m.id)
                return (
                  <button
                    key={m.id}
                    type="button"
                    className={`chip ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleMilestone(m.id)}
                  >
                    <span>{m.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Action Row */}
          <div className="quiz-action-row">
            <button
              type="button"
              className="btn-submit-quiz"
              onClick={handleCalculate}
              id="calculate-matches-btn"
            >
              {hasSubmittedQuiz ? 'Update Matches' : 'Find Matching Ancestors'}
            </button>
            {!hasSubmittedQuiz && (
              <span className="quiz-hint-text">
                Scan your tree for shared birthdays, homelands, and generations
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Results Section ONLY displayed once the user clicks Calculate */}
      {hasSubmittedQuiz && (
        <section className="results-section" ref={resultsRef}>
          <div className="results-header">
            <div>
              <h3>Your Top Ancestor Matches</h3>
              <p>Ranked by verified connections in your tree: birth months, ancestral homelands, eras, and longevity.</p>
            </div>
          </div>

          <div className="matches-grid">
            {topMatches.map((person, index) => {
              const isTop = index === 0
              return (
                <div 
                  key={person.id || index} 
                  className={`match-card ${isTop ? 'top-match' : ''}`}
                >
                  {isTop && <div className="crown-badge">Top Match</div>}

                  <div className="match-card-top">
                    <Avatar gender={person.gender} size="md" />
                    <div className="match-meta">
                      <div className="match-header-row">
                        <h4 className="match-name">{person.name}</h4>
                        <Badge variant="score">
                          {person.matchPercentage}% Match
                        </Badge>
                      </div>
                      <p className="match-dates">
                        {person.birthYear ? `b. ${person.birthYear}` : 'Year unrecorded'}
                        {person.deathYear ? ` – d. ${person.deathYear}` : ''}
                        {person.relationship && ` • ${person.relationship}`}
                      </p>
                      {person.birthPlace && (
                        <p className="match-origin-text">
                          📍 {person.birthPlace}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Match Reasons */}
                  <div className="reasons-list">
                    <span className="reasons-title">Why you connect with them:</span>
                    {person.matchReasons && person.matchReasons.map((reason, idx) => (
                      <div key={idx} className="reason-item">
                        <span className="reason-check">✓</span>
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>

                  {/* Card Actions */}
                  <div className="match-actions">
                    <button
                      type="button"
                      className="btn-details"
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
      )}
    </div>
  )
}
