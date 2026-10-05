import { useState } from 'react'
import './App.css'

export default function App() {
  const [status] = useState('React Initialized Successfully')

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="brand">
          <span className="brand-icon">🌿</span>
          <span className="brand-title">AncestorLink</span>
        </div>
        <div className="status-badge">{status}</div>
      </header>

      <main className="hero-section">
        <div className="welcome-card">
          <h1>Family History Explorer</h1>
          <p className="subtitle">
            Uncover meaningful connections, shared passions, and life milestones across generations.
          </p>

          <div className="setup-checklist">
            <h3>Initial React Setup Complete</h3>
            <ul>
              <li><span className="check">✓</span> React 19 + Vite initialized</li>
              <li><span className="check">✓</span> Green &amp; white design token system loaded</li>
              <li><span className="check">✓</span> Merriweather &amp; Inter typography configured</li>
              <li><span className="check">✓</span> Project architecture and documentation ready</li>
            </ul>
          </div>

          <p className="ready-note">
            Ready to begin building <strong>Phase 1: Ancestor Matchmaker</strong> when you are!
          </p>
        </div>
      </main>

      <footer className="app-footer">
        <p>BYU-Idaho Family History Technology Project &bull; Built with React &amp; Vite</p>
      </footer>
    </div>
  )
}
