import React from 'react'
import './Header.css'

export default function Header({ onGoHome, className = '' }) {
  return (
    <header className={`app-header ${className}`.trim()}>
      <div className="header-inner">
        <button
          type="button"
          className="brand-group-btn"
          onClick={onGoHome}
          title="Return to MemoryLink Home"
          aria-label="Return to MemoryLink Home"
        >
          <img className="brand-logo-mark" src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" />
          <span className="brand-name">MemoryLink</span>
        </button>
      </div>
    </header>
  )
}
