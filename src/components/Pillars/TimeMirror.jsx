import React, { useState, useMemo } from 'react'
import Avatar from '../Common/Avatar'
import FamilySearchButton from '../Common/FamilySearchButton'
import './TimeMirror.css'

export default function TimeMirror({ ancestors, onSelectPerson }) {
  const [selectedAge, setSelectedAge] = useState(20)

  const agePresets = [16, 18, 20, 22, 25, 30, 35, 40]

  // Find ancestors with milestones or notable life stages around this age
  const ageStories = useMemo(() => {
    if (!ancestors || ancestors.length === 0) return []

    const results = []

    ancestors.forEach((person) => {
      // 1. Check exact milestones
      if (person.milestones && person.milestones.length > 0) {
        person.milestones.forEach((m) => {
          if (m.age != null && Math.abs(m.age - selectedAge) <= 2) {
            results.push({
              person,
              exactAge: m.age,
              event: m.event,
              year: person.birthYear ? person.birthYear + m.age : null,
              category: 'milestone'
            })
          }
        })
      }

      // 2. If no exact milestone but we have birthYear, estimate historical context at that age
      if (person.birthYear && results.filter(r => r.person.id === person.id).length === 0) {
        const historicalYear = person.birthYear + selectedAge
        const isAlive = (!person.deathYear || person.deathYear >= historicalYear)

        if (isAlive && selectedAge >= 14 && selectedAge <= 70) {
          const occ = (person.occupations && person.occupations[0]) || 'Homesteader & Craftsperson'
          const region = person.birthRegion || 'the American Frontier'
          results.push({
            person,
            exactAge: selectedAge,
            event: `Living in ${region}, working as a ${occ} around the year ${historicalYear}`,
            year: historicalYear,
            category: 'lifestyle'
          })
        }
      }
    })

    return results.slice(0, 10)
  }, [ancestors, selectedAge])

  return (
    <div className="pillar-container timemirror-pillar">
      {/* Age Control Header without redundant badge */}
      <section className="mirror-hero-card">
        <h2>What Were Your Ancestors Doing at Your Age?</h2>
        <p>
          Slide or select an age to synchronize across generations and discover what your relatives experienced when they were in your exact shoes.
        </p>

        <div className="age-selector-box">
          <div className="age-display-row">
            <span className="age-large">Age {selectedAge}</span>
            <span className="age-subtext">Synchronizing across 7 generations</span>
          </div>

          <div className="slider-wrap">
            <input
              type="range"
              min="14"
              max="65"
              value={selectedAge}
              onChange={(e) => setSelectedAge(parseInt(e.target.value, 10))}
              className="age-slider"
              id="age-range-slider"
            />
            <div className="slider-labels">
              <span>Youth (14)</span>
              <span>Young Adult (20)</span>
              <span>Mid Career (35)</span>
              <span>Elder (65)</span>
            </div>
          </div>

          <div className="presets-row">
            <span className="presets-label">Quick Ages:</span>
            {agePresets.map((age) => (
              <button
                key={age}
                type="button"
                className={`preset-btn ${selectedAge === age ? 'active' : ''}`}
                onClick={() => setSelectedAge(age)}
              >
                {age}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stories Timeline */}
      <section className="mirror-results-section">
        <div className="results-header">
          <h3>Ancestors at Age {selectedAge}</h3>
        </div>

        <div className="timeline-cards-list">
          {ageStories.map((item, idx) => {
            const { person, exactAge, event, year, category } = item
            return (
              <div key={idx} className="timeline-card">
                <div className="timeline-left">
                  <div className="timeline-age-badge">
                    Age {exactAge}
                  </div>
                  {year && <span className="timeline-year">Year ~{year}</span>}
                </div>

                <div className="timeline-body">
                  <div className="timeline-person-info">
                    <Avatar gender={person.gender} size="sm" />
                    <div>
                      <h4 className="timeline-name">{person.name}</h4>
                      <p className="timeline-rel">
                        {person.relationship || `Generation ${person.generation || '?'}`}
                        {person.birthPlace && ` • Born in ${person.birthPlace}`}
                      </p>
                    </div>
                  </div>

                  <p className="timeline-event-text">
                    {category === 'milestone' ? '🌟 ' : '🧭 '}
                    {event}
                  </p>

                  <div className="timeline-actions">
                    <button
                      type="button"
                      className="btn-timeline-detail"
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
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
