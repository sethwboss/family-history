import React from 'react'
import './TabBar.css'

export default function TabBar({ activeTab, onSelectTab }) {
  const tabs = [
    { id: 'matchmaker', title: 'Ancestor Matchmaker' },
    { id: 'timemirror', title: "Time-Traveler's Mirror" },
    { id: 'constellation', title: 'Constellation' }
  ]

  return (
    <nav className="tab-bar-container" aria-label="Discovery Activities">
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
              <span className="tab-title">{tab.title}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
