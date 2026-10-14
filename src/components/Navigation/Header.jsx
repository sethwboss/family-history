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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L12 22" />
              <path d="M12 12C9 9 5 8 2 9C2 14 5 18 12 18" />
              <path d="M12 7C15 4 19 3 22 4C22 9 19 13 12 13" />
            </svg>
          </span>
          <span className="brand-name">MemoryLink</span>
        </button>
      </div>
    </header>
  )
}
