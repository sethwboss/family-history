import { useEffect, useState } from 'react'
import Header from '../Navigation/Header'
import Footer from '../Navigation/Footer'
import './AnimationTestPage.css'

const leaves = [
  [6, 16, -2, 15, 0], [19, 12, -8, 19, 1], [31, 22, -5, 13, 2],
  [44, 10, -11, 21, 3], [57, 18, -3, 16, 4], [69, 14, -9, 18, 5],
  [81, 25, -6, 14, 6], [93, 11, -13, 20, 7], [13, 28, -17, 17, 8],
  [38, 8, -20, 23, 9], [63, 31, -15, 12, 10], [88, 20, -22, 16, 11],
  [25, 35, -27, 19, 12], [74, 6, -24, 22, 13], [50, 26, -30, 15, 14],
  [4, 42, -34, 24, 15], [97, 32, -37, 18, 16], [35, 18, -40, 20, 17],
]
const smallOrbs = [
  { left: '24%', top: '24%', size: 560, delay: '-2s', duration: '12s' },
  { left: '68%', top: '30%', size: 460, delay: '-7s', duration: '16s' },
  { left: '76%', top: '72%', size: 680, delay: '-10s', duration: '14s' },
  { left: '34%', top: '76%', size: 400, delay: '-5s', duration: '18s' },
]

export default function AnimationTestPage() {
  const [isMotionEnabled, setIsMotionEnabled] = useState(true)
  const [activeConcept, setActiveConcept] = useState('timetraveler')
  const [hourglassPhase, setHourglassPhase] = useState('filling')
  const [hourglassCycle, setHourglassCycle] = useState(0)

  useEffect(() => {
    if (activeConcept !== 'timetraveler') return undefined

    const timer = window.setTimeout(() => {
      if (hourglassPhase === 'filling') {
        setHourglassPhase('flipping')
      } else {
        setHourglassPhase('filling')
        setHourglassCycle((cycle) => cycle + 1)
      }
    }, hourglassPhase === 'filling' ? 14000 : 900)

    return () => window.clearTimeout(timer)
  }, [activeConcept, hourglassPhase])

  return (
    <div className={`animation-test-shell concept-${activeConcept}`}>
      <Header onGoHome={() => { window.location.href = import.meta.env.BASE_URL }} />
      <main className={`animation-test-page ${isMotionEnabled ? '' : 'motion-paused'}`}>
      <div className="test-background-orb orb-one" aria-hidden="true" />
      <div className="test-background-orb orb-two" aria-hidden="true" />
      <div className="test-small-orbs" aria-hidden="true">
        {smallOrbs.map((orb, index) => (
          <span
            key={index}
            style={{
              '--orb-left': orb.left,
              '--orb-top': orb.top,
              '--orb-size': `${orb.size}px`,
              '--orb-delay': orb.delay,
              '--orb-duration': orb.duration,
            }}
          />
        ))}
      </div>
      <div className="test-leaves" aria-hidden="true">
        {leaves.map(([left, size, delay, duration, index]) => (
          <span
            key={index}
            style={{
              '--leaf-left': `${left}%`,
              '--leaf-size': `${size}px`,
              '--leaf-delay': `${delay}s`,
              '--leaf-duration': `${duration}s`,
            }}
          />
        ))}
      </div>

      <section className="animation-test-intro">
        <span className="test-eyebrow">Design playground</span>
        <h1>MemoryLink motion experiments</h1>
        <p>
          This private test page is a safe place to try gentle movement and texture
          before bringing a favorite idea to the main experience.
        </p>
        <button
          type="button"
          className="motion-toggle"
          onClick={() => setIsMotionEnabled((enabled) => !enabled)}
          aria-pressed={isMotionEnabled}
        >
          {isMotionEnabled ? 'Pause motion' : 'Play motion'}
        </button>
      </section>

      <section className="animation-test-cards" aria-label="Game animation concepts">
        <button
          type="button"
          className={`animation-test-card game-animation-card ${activeConcept === 'timetraveler' ? 'active' : ''}`}
          onClick={() => setActiveConcept('timetraveler')}
          aria-pressed={activeConcept === 'timetraveler'}
        >
          <div className="concept-icon concept-icon-drift" aria-hidden="true">✦</div>
          <div>
            <h2>Time-Traveler — Time Ribbon</h2>
            <p>A flowing timeline with milestone pulses moving through the years.</p>
          </div>
        </button>
        <button
          type="button"
          className={`animation-test-card game-animation-card ${activeConcept === 'matchmaker' ? 'active' : ''}`}
          onClick={() => setActiveConcept('matchmaker')}
          aria-pressed={activeConcept === 'matchmaker'}
        >
          <div className="concept-icon concept-icon-glow" aria-hidden="true">✺</div>
          <div>
            <h2>Matchmaker — Connection Web</h2>
            <p>Profile nodes gently connect and illuminate as matches are discovered.</p>
          </div>
        </button>
        <button
          type="button"
          className={`animation-test-card game-animation-card ${activeConcept === 'constellation' ? 'active' : ''}`}
          onClick={() => setActiveConcept('constellation')}
          aria-pressed={activeConcept === 'constellation'}
        >
          <div className="concept-icon concept-icon-pulse" aria-hidden="true">↗</div>
          <div>
            <h2>Constellation — Living Star Map</h2>
            <p>A quiet star map forms and glows as family connections come into view.</p>
          </div>
        </button>
      </section>

      {activeConcept === 'timetraveler' && (
        <section className="game-animation-preview" aria-label="Time-Traveler animation preview">
          <svg key={hourglassCycle} className={`time-glass-svg ${hourglassPhase === 'flipping' ? 'is-flipping' : 'is-filling'}`} viewBox="0 0 300 320" role="img" aria-label="Animated hourglass with falling sand">
            <defs>
              <clipPath id="time-glass-top-clip">
                <path d="M87 30 C87 96 114 118 150 160 C186 118 213 96 213 30 Z" />
              </clipPath>
              <clipPath id="time-glass-bottom-clip">
                <path d="M87 284 C87 224 114 202 150 160 C186 202 213 224 213 284 Z" />
              </clipPath>
            </defs>
            <path className="time-glass-frame" d="M66 30 H234 M66 290 H234" />
            <path className="time-glass-outline" d="M84 30 C84 96 113 118 150 160 C187 118 216 96 216 30 M84 284 C84 224 113 202 150 160 C187 202 216 224 216 284" />
            <rect className="time-glass-sand time-glass-sand-top" x="84" y="38" width="132" height="132" clipPath="url(#time-glass-top-clip)">
              <animate attributeName="y" dur="14s" repeatCount="1" fill="freeze" calcMode="linear" values="38;159" keyTimes="0;1" />
            </rect>
            <rect className="time-glass-sand time-glass-sand-bottom" x="84" y="282" width="132" height="132" clipPath="url(#time-glass-bottom-clip)">
              <animate attributeName="y" dur="14s" repeatCount="1" fill="freeze" calcMode="linear" values="282;160" keyTimes="0;1" />
            </rect>
            <ellipse className="time-glass-sand time-glass-mound" cx="150" cy="274" rx="0" ry="0" clipPath="url(#time-glass-bottom-clip)">
              <animate attributeName="cy" dur="14s" repeatCount="1" fill="freeze" calcMode="linear" values="274;208" keyTimes="0;1" />
              <animate attributeName="rx" dur="14s" repeatCount="1" fill="freeze" calcMode="linear" values="0;54" keyTimes="0;1" />
              <animate attributeName="ry" dur="14s" repeatCount="1" fill="freeze" calcMode="linear" values="0;20" keyTimes="0;1" />
            </ellipse>
            <path className="time-glass-stream" d="M150 158 V274">
              <animate attributeName="d" dur="14s" repeatCount="1" fill="freeze" calcMode="linear" values="M150 158 V274;M150 158 V212" keyTimes="0;1" />
              <animate attributeName="opacity" dur="14s" repeatCount="1" fill="freeze" values="1;1" keyTimes="0;1" />
            </path>
          </svg>
        </section>
      )}
      </main>
      <Footer className="animation-test-footer" />
    </div>
  )
}
