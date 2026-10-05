import React from 'react'
import './FamilySearchButton.css'

export default function FamilySearchButton({
  url,
  label = 'View on FamilySearch ↗',
  variant = 'solid', // 'solid', 'outline', or 'subtle'
  size = 'md',       // 'sm', 'md'
  icon = '🌿',
  className = ''
}) {
  if (!url) return null

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn-fs-reusable fs-variant-${variant} fs-size-${size} ${className}`}
    >
      {icon && <span className="fs-btn-icon">{icon}</span>}
      <span className="fs-btn-label">{label}</span>
    </a>
  )
}
