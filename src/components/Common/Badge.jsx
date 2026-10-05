import React from 'react'
import './Badge.css'

export default function Badge({
  children,
  variant = 'default', // 'score', 'fsid', 'relationship', 'generation', 'trade', 'region'
  className = ''
}) {
  return (
    <span className={`common-badge badge-${variant} ${className}`}>
      {children}
    </span>
  )
}
