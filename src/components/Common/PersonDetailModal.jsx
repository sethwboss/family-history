import React from 'react'
import Avatar from './Avatar'
import Badge from './Badge'
import FamilySearchButton from './FamilySearchButton'
import './PersonDetailModal.css'

export default function PersonDetailModal({ ancestor, onClose }) {
  if (!ancestor) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="person-modal" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <button 
          type="button" 
          className="modal-close-btn" 
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        <div className="person-modal-header">
          <Avatar gender={ancestor.gender} size="lg" />
          <div>
            <div className="person-badges">
              {ancestor.relationship && (
                <Badge variant="relationship">{ancestor.relationship}</Badge>
              )}
              {ancestor.generation && (
                <Badge variant="generation">Gen {ancestor.generation}</Badge>
              )}
              {ancestor.familySearchId && (
                <Badge variant="fsid">FS ID: {ancestor.familySearchId}</Badge>
              )}
            </div>
            <h2>{ancestor.name}</h2>
            <p className="lifespan-text">
              {ancestor.birthYear ? `Born ${ancestor.birthYear}` : 'Birth unknown'}
              {ancestor.deathYear ? ` — Passed ${ancestor.deathYear}` : ''}
              {ancestor.birthPlace ? ` • ${ancestor.birthPlace}` : ''}
            </p>
          </div>
        </div>

        <div className="person-modal-body">
          {ancestor.bioSnippet && (
            <div className="detail-section">
              <h4>Biographical Sketch</h4>
              <p className="bio-quote">"{ancestor.bioSnippet}"</p>
            </div>
          )}

          {ancestor.occupations && ancestor.occupations.length > 0 && (
            <div className="detail-section">
              <h4>Trades &amp; Professions</h4>
              <div className="tag-group">
                {ancestor.occupations.map((occ, idx) => (
                  <Badge key={idx} variant="trade">⚒️ {occ}</Badge>
                ))}
              </div>
            </div>
          )}

          {ancestor.interests && ancestor.interests.length > 0 && (
            <div className="detail-section">
              <h4>Interests &amp; Passions</h4>
              <div className="tag-group">
                {ancestor.interests.map((int, idx) => (
                  <span key={idx} className="interest-tag">✨ {int}</span>
                ))}
              </div>
            </div>
          )}

          {ancestor.milestones && ancestor.milestones.length > 0 && (
            <div className="detail-section">
              <h4>Known Life Milestones</h4>
              <ul className="milestone-timeline">
                {ancestor.milestones.map((ms, idx) => (
                  <li key={idx} className="milestone-item">
                    {ms.age != null && <span className="ms-age">Age {ms.age}</span>}
                    <span className="ms-event">{ms.event || ms.type}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* FamilySearch Deep Links */}
          <div className="fs-action-card">
            <div className="fs-card-text">
              <strong>Official FamilySearch Records</strong>
              <p>Explore original census scans, certificates, and community memories submitted by extended relatives.</p>
            </div>
            <div className="fs-card-buttons">
              {ancestor.familySearchUrl && (
                <FamilySearchButton
                  url={ancestor.familySearchUrl}
                  label="View on FamilySearch ↗"
                  variant="solid"
                  size="md"
                />
              )}
              {ancestor.memoriesUrl && (
                <FamilySearchButton
                  url={ancestor.memoriesUrl}
                  label="View Memories & Photos ↗"
                  variant="outline"
                  size="md"
                  icon="🖼️"
                />
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
