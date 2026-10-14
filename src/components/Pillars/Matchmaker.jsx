import React, { useState, useMemo, useRef } from 'react'
import {
  calculateAncestorMatches,
  HOMELAND_OPTIONS,
  CALLING_OPTIONS,
  SPIRIT_OPTIONS,
  MONTH_OPTIONS
} from '../../utils/matchingEngine'
import Avatar from '../Common/Avatar'
import FamilySearchButton from '../Common/FamilySearchButton'
import Badge from '../Common/Badge'
import './Matchmaker.css'

export default function Matchmaker({ ancestors, onSelectPerson }) {
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [selectedRegions, setSelectedRegions] = useState([])
  const [selectedCallings, setSelectedCallings] = useState([])
  const [selectedSpirits, setSelectedSpirits] = useState([])
  const [hasSubmittedQuiz, setHasSubmittedQuiz] = useState(false)
  const resultsRef = useRef(null)

  const toggleRegion = (regionId) => {
    setSelectedRegions((prev) =>
      prev.includes(regionId)
        ? prev.filter((r) => r !== regionId)
        : [...prev, regionId]
    )
  }

  const toggleCalling = (callingId) => {
    setSelectedCallings((prev) =>
      prev.includes(callingId)
        ? prev.filter((c) => c !== callingId)
        : [...prev, callingId]
    )
  }

  const toggleSpirit = (spiritId) => {
    setSelectedSpirits((prev) =>
      prev.includes(spiritId)
        ? prev.filter((s) => s !== spiritId)
        : [...prev, spiritId]
    )
  }

  // Calculate top matches based on authentic GEDCOM attributes
  const matches = useMemo(() => {
    return calculateAncestorMatches(
      {
        birthMonth: selectedMonth,
        regions: selectedRegions,
        callings: selectedCallings,
        spirits: selectedSpirits
      },
      ancestors
    )
  }, [selectedMonth, selectedRegions, selectedCallings, selectedSpirits, ancestors])

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
            Tell us about <strong>yourself</strong>—your birth month, where you live or dream of traveling, your favorite skills/passions, and your life journey. We'll cross-reference your traits with verified records in your family tree to find your generational matches!
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

          {/* 2. Where You Live or Dream of Traveling */}
          <div className="quiz-field">
            <label className="field-label">
              <span>2. Where You Live or Dream of Traveling (Homeland Roots)</span>
              {selectedRegions.length > 0 && (
                <span className="selection-count">{selectedRegions.length} selected</span>
              )}
            </label>
            <div className="chips-wrap">
              {HOMELAND_OPTIONS.map((reg) => {
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

          {/* 3. Your Calling, Skills & Passions */}
          <div className="quiz-field">
            <label className="field-label">
              <span>3. Your Calling, Skills &amp; Passions (What You Do or Love)</span>
              {selectedCallings.length > 0 && (
                <span className="selection-count">{selectedCallings.length} selected</span>
              )}
            </label>
            <div className="chips-wrap">
              {CALLING_OPTIONS.map((calling) => {
                const isSelected = selectedCallings.includes(calling.id)
                return (
                  <button
                    key={calling.id}
                    type="button"
                    className={`chip ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleCalling(calling.id)}
                  >
                    <span>{calling.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 4. Your Life Spirit & Personal Journey */}
          <div className="quiz-field">
            <label className="field-label">
              <span>4. Your Life Spirit &amp; Journey (Your Personal Values)</span>
              {selectedSpirits.length > 0 && (
                <span className="selection-count">{selectedSpirits.length} selected</span>
              )}
            </label>
            <div className="chips-wrap">
              {SPIRIT_OPTIONS.map((spirit) => {
                const isSelected = selectedSpirits.includes(spirit.id)
                return (
                  <button
                    key={spirit.id}
                    type="button"
                    className={`chip ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleSpirit(spirit.id)}
                    title={spirit.subtitle}
                  >
                    <span><strong>{spirit.label}</strong>: {spirit.subtitle}</span>
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
              {hasSubmittedQuiz ? 'Update My Matches' : 'Find My Ancestor Matches'}
            </button>
            {!hasSubmittedQuiz && (
              <span className="quiz-hint-text">
                Scan your family tree for shared birth months, homelands, trades, and life journeys
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
