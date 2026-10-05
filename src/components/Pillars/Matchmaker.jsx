import React, { useState, useMemo, useRef } from 'react'
import { calculateAncestorMatches } from '../../utils/matchingEngine'
import Avatar from '../Common/Avatar'
import FamilySearchButton from '../Common/FamilySearchButton'
import Badge from '../Common/Badge'
import './Matchmaker.css'

export default function Matchmaker({ ancestors, onSelectPerson }) {
  // Quiz state: start unselected so user chooses their real passions
  const [selectedInterests, setSelectedInterests] = useState([])
  const [selectedCareer, setSelectedCareer] = useState(null)
  const [selectedRegions, setSelectedRegions] = useState([])
  const [hasSubmittedQuiz, setHasSubmittedQuiz] = useState(false)
  const resultsRef = useRef(null)

  const interestOptions = [
    { label: 'Coding & Tech', icon: '💻' },
    { label: 'Woodworking & Crafts', icon: '🪵' },
    { label: 'Music & Instruments', icon: '🎻' },
    { label: 'Gardening & Plants', icon: '🌱' },
    { label: 'Baking & Cooking', icon: '🍞' },
    { label: 'Sewing & Quilting', icon: '🧵' },
    { label: 'Storytelling & Writing', icon: '📖' },
    { label: 'Outdoor Adventure', icon: '🏕️' },
    { label: 'Teaching & Mentoring', icon: '🎓' },
    { label: 'Horses & Animals', icon: '🐎' }
  ]

  const careerOptions = [
    { id: 'tech', label: 'Tech & Engineering', icon: '⚙️' },
    { id: 'trades', label: 'Crafts & Trades', icon: '⚒️' },
    { id: 'education', label: 'Education & Literature', icon: '📚' },
    { id: 'agriculture', label: 'Agriculture & Homesteading', icon: '🌾' },
    { id: 'healthcare', label: 'Healthcare & Nursing', icon: '🩺' },
    { id: 'arts', label: 'Music & Fine Arts', icon: '🎨' },
    { id: 'adventure', label: 'Pioneer & Maritime Scout', icon: '⛵' }
  ]

  const regionOptions = [
    { id: 'utah', label: 'Utah & Mountain West', icon: '🏔️' },
    { id: 'denmark', label: 'Denmark & Scandinavia', icon: '🇩🇰' },
    { id: 'england', label: 'England & Great Britain', icon: '🇬🇧' },
    { id: 'idaho', label: 'Idaho Frontier', icon: '🌲' },
    { id: 'california', label: 'California Coast', icon: '🌊' }
  ]

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    )
  }

  const toggleRegion = (regionId) => {
    setSelectedRegions((prev) =>
      prev.includes(regionId)
        ? prev.filter((r) => r !== regionId)
        : [...prev, regionId]
    )
  }

  // Calculate top matches
  const matches = useMemo(() => {
    return calculateAncestorMatches(
      {
        interests: selectedInterests,
        career: selectedCareer,
        regions: selectedRegions
      },
      ancestors
    )
  }, [selectedInterests, selectedCareer, selectedRegions, ancestors])

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
          <h2>Select Your Personal Passions &amp; Roots</h2>
          <p>
            Choose what you enjoy doing and where your interests lie. When you're ready, click calculate to reveal which ancestor you resemble most!
          </p>
        </div>

        <div className="quiz-grid">
          {/* Interests */}
          <div className="quiz-field">
            <label className="field-label">
              <span>1. Your Hobbies &amp; Interests</span>
              <span className="selection-count">({selectedInterests.length} selected)</span>
            </label>
            <div className="chips-wrap">
              {interestOptions.map((opt) => {
                const isSelected = selectedInterests.includes(opt.label)
                return (
                  <button
                    key={opt.label}
                    type="button"
                    className={`chip ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleInterest(opt.label)}
                  >
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Career Path */}
          <div className="quiz-field">
            <label className="field-label">
              <span>2. Career / Craft Orientation</span>
            </label>
            <div className="chips-wrap">
              {careerOptions.map((opt) => {
                const isSelected = selectedCareer === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`chip radio-chip ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedCareer(prev => prev === opt.id ? null : opt.id)}
                  >
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Heritage Origins */}
          <div className="quiz-field">
            <label className="field-label">
              <span>3. Roots &amp; Dream Destinations</span>
            </label>
            <div className="chips-wrap">
              {regionOptions.map((opt) => {
                const isSelected = selectedRegions.includes(opt.id)
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`chip ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleRegion(opt.id)}
                  >
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Action Row: Don't show matches until button is clicked */}
          <div className="quiz-action-row">
            <button
              type="button"
              className="btn-submit-quiz"
              onClick={handleCalculate}
              id="calculate-matches-btn"
            >
              {hasSubmittedQuiz ? '🔄 Update My Ancestor Matches' : '✨ Find My Closest Ancestor Matches'}
            </button>
            {!hasSubmittedQuiz && (
              <span className="quiz-hint-text">
                Click to scan all {ancestors.length} ancestors in your tree
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
              <p>Ranked by alignment across shared trades, hobbies, and historical origins.</p>
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
                  {isTop && <div className="crown-badge">🏆 #1 Closest Match</div>}

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
                    </div>
                  </div>

                  {person.bioSnippet && (
                    <p className="match-bio-preview">"{person.bioSnippet}"</p>
                  )}

                  {/* Match Reasons */}
                  <div className="reasons-list">
                    <span className="reasons-title">Why you take after them:</span>
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
                      📖 Read Story &amp; Timeline
                    </button>
                    <FamilySearchButton
                      url={person.familySearchUrl}
                      variant="solid"
                      size="sm"
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
