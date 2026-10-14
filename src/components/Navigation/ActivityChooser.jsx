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
      id: 'timemirror',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      title: "Time-Traveler's Mirror",
      description: 'See what your ancestors were doing and where they lived at your exact age.',
      buttonText: 'Open Time Mirror'
    },
    {
      id: 'matchmaker',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      title: 'Ancestor Matchmaker',
      description: 'Find ancestors in your tree who share your birth month, region, or trade.',
      buttonText: 'Open Matchmaker'
    },
    {
      id: 'constellation',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
          <line x1="9" y1="3" x2="9" y2="18" />
          <line x1="15" y1="6" x2="15" y2="21" />
        </svg>
      ),
      title: 'Constellation',
      description: 'Filter your family tree by trade, immigration, lifespan, region, and generation.',
      buttonText: 'Open Constellation'
    }
  ]

  return (
    <div className="activity-chooser-container">
      <div className="activity-chooser-header">
        <h2>What would you like to explore?</h2>
        <p>Select an activity below to get started:</p>
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
