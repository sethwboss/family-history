import React, { useState } from 'react'
import './ActivityChooser.css'

export default function ActivityChooser({ ancestorsCount, treeName, onSelectActivity }) {
  const [expandedCards, setExpandedCards] = useState({})

  const toggleDescription = (id, e) => {
    e.stopPropagation()
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const activities = [
    {
      id: 'matchmaker',
      icon: '✨',
      title: 'Ancestor Matchmaker',
      subtitle: 'Personality & Passions',
      description: 'Who do you take after? Select your personal hobbies, craft orientations, and ancestral homelands to reveal which ancestor you resemble most through compatibility scoring.',
      buttonText: 'Start Matchmaker →'
    },
    {
      id: 'timemirror',
      icon: '⏳',
      title: "Time-Traveler's Mirror",
      subtitle: 'Milestones at Your Exact Age',
      description: 'Enter your current age (or any milestone year) to see what your ancestors were experiencing, where they lived, and what life was like for them at that exact stage.',
      buttonText: "Open Time Mirror →"
    },
    {
      id: 'constellation',
      icon: '🗺️',
      title: 'Heritage Constellation',
      subtitle: 'Trades, Crafts & Origins',
      description: 'Explore the occupations, artisan trades, and geographic migration pathways that shaped your lineage across generations.',
      buttonText: 'Explore Constellation →'
    }
  ]

  return (
    <div className="activity-chooser-container">
      <div className="activity-chooser-header">
        <h2>What would you like to explore first?</h2>
        <p>
          Your tree with <strong>{ancestorsCount} ancestors</strong> is loaded. Choose an activity below to begin:
        </p>
      </div>

      <div className="activity-cards-grid">
        {activities.map((act) => {
          const isOpen = Boolean(expandedCards[act.id])
          return (
            <div
              key={act.id}
              className="activity-card"
              onClick={() => onSelectActivity(act.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelectActivity(act.id)}
              id={`choose-activity-${act.id}`}
            >
              <div className="activity-card-top">
                <span className="activity-icon">{act.icon}</span>
              </div>

              <h3 className="activity-title">{act.title}</h3>
              <span className="activity-subtitle">{act.subtitle}</span>

              {/* Collapsible description dropdown */}
              <div className="activity-desc-section">
                <button
                  type="button"
                  className="activity-desc-toggle"
                  onClick={(e) => toggleDescription(act.id, e)}
                  aria-expanded={isOpen}
                >
                  <span>How it works</span>
                  <span className={`desc-chevron ${isOpen ? 'open' : ''}`}>▼</span>
                </button>

                {isOpen && (
                  <div className="activity-desc-dropdown">
                    <p>{act.description}</p>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="btn-start-activity"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectActivity(act.id)
                }}
              >
                {act.buttonText}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
