import React from 'react'
import './Avatar.css'

export default function Avatar({ gender = 'M', size = 'md', className = '' }) {
  const icon = gender === 'F' ? '👵' : '👴'
  return (
    <div className={`common-avatar avatar-${size} ${className}`} aria-hidden="true">
      {icon}
    </div>
  )
}
