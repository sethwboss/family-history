import React from 'react'
import './Header.css'

export default function Header({ onGoHome }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <button
          type="button"
          className="brand-group-btn"
          onClick={onGoHome}
          title="Return to MemoryLink Home"
          aria-label="Return to MemoryLink Home"
        >
          <span className="brand-logo-mark" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22v-9" />
              <path d="M12 13a5 5 0 0 0 5-5V4a2 2 0 0 0-2-2h-3a5 5 0 0 0-5 5v1" />
              <path d="M12 17a4 4 0 0 1-4-4V9" />
            </svg>
          </span>
          <span className="brand-name">MemoryLink</span>
        </button>
      </div>
    </header>
  )
}
