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
          <span className="brand-leaf">🌿</span>
          <h1 className="brand-name">MemoryLink</h1>
        </button>
      </div>
    </header>
  )
}
