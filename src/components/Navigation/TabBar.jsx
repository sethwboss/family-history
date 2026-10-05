import React from 'react'
import './TabBar.css'

export default function TabBar({ activeTab, onSelectTab, onBackToOverview }) {
  const tabs = [
    {
      id: 'matchmaker',
      title: 'Ancestor Matchmaker',
      icon: '✨',
      desc: 'Who do you take after? Discover shared hobbies & traits'
    },
    {
      id: 'timemirror',
      title: "Time-Traveler's Mirror",
      icon: '⏳',
      desc: 'See what your ancestors did at your exact age'
    },
    {
      id: 'constellation',
      title: 'Heritage Constellation',
      icon: '🗺️',
      desc: 'Explore crafts, professions, and migration routes'
    }
  ]

  return (
    <nav className="tab-bar-container" aria-label="Discovery Pillars">
      {onBackToOverview && (
        <div className="tab-bar-header">
          <button
            type="button"
            className="btn-back-to-activities"
            onClick={onBackToOverview}
            id="back-to-activities-btn"
          >
            ← Choose Different Activity
          </button>
          <span className="tab-bar-hint">Switch between activities anytime:</span>
        </div>
      )}

      <div className="tab-bar-inner">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              className={`discovery-tab ${isActive ? 'active' : ''}`}
              onClick={() => onSelectTab(tab.id)}
              id={`tab-btn-${tab.id}`}
            >
              <div className="tab-top">
                <span className="tab-icon">{tab.icon}</span>
              </div>
              <h2 className="tab-title">{tab.title}</h2>
              <p className="tab-desc">{tab.desc}</p>
              {isActive && <div className="tab-active-indicator" />}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
