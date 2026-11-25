import React from 'react'

export default function Footer({ onOpenHelp, className = '' }) {
  return (
    <footer className={`site-footer ${className}`.trim()}>
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <img className="footer-logo-mark" src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" />
            <span>MemoryLink</span>
          </div>
          <p>Connecting you with the lives, traits, and milestones of your ancestors.</p>
        </div>
        <div className="footer-links">
          <span>Private &amp; Secure &bull; All data processed in your browser</span>
          <span>&bull;</span>
          {/* TEMPORARY TEST LINK: Remove this button when animation testing is complete. */}
          <button
            type="button"
            className="footer-link-btn"
            onClick={() => { window.location.href = `${import.meta.env.BASE_URL}test` }}
            title="Temporary animation test page"
          >
            Test
          </button>
          <span>&bull;</span>
          <button type="button" className="footer-link-btn" onClick={onOpenHelp}>
            Export Instructions &amp; Help
          </button>
        </div>
      </div>
    </footer>
  )
}
