import React from 'react'
import './FamilySearchButton.css'

export default function FamilySearchButton({
  url,
  label = 'View on FamilySearch ↗',
  variant = 'solid', // 'solid', 'outline', or 'subtle'
  size = 'md',       // 'sm', 'md'
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
      <span className="fs-btn-label">{label}</span>
    </a>
  )
}
