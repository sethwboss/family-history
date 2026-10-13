import React from 'react'
import './Avatar.css'

export default function Avatar({ gender = 'M', size = 'md', className = '' }) {
  return (
    <div className={`common-avatar avatar-${size} ${className}`} aria-hidden="true">
      <svg width="55%" height="55%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.75 }}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
  )
}
