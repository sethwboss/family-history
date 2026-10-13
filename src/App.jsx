import { useState, useCallback, useEffect, useRef } from 'react'
import Header from './components/Navigation/Header'
import TabBar from './components/Navigation/TabBar'
import ActivityChooser from './components/Navigation/ActivityChooser'
import WelcomeHero from './components/Onboarding/WelcomeHero'
import OnboardingModal from './components/Onboarding/OnboardingModal'
import PersonDetailModal from './components/Common/PersonDetailModal'
import Matchmaker from './components/Pillars/Matchmaker'
import TimeMirror from './components/Pillars/TimeMirror'
import HeritageConstellation from './components/Pillars/HeritageConstellation'
import { SAMPLE_ANCESTORS } from './data/sampleAncestors'
import { parseGedcom } from './utils/gedcomParser'
import './App.css'

export default function App() {
  // Start with no pre-loaded tree so the user lands on the clean onboarding guide!
  const [ancestors, setAncestors] = useState(null)
  const [treeName, setTreeName] = useState('')
  const [isSample, setIsSample] = useState(false)
  const [activeTab, setActiveTab] = useState(null) // Starts null so user can choose between the 3 modes!
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState(null)
  const [notification, setNotification] = useState(null)
  const [isNotificationExiting, setIsNotificationExiting] = useState(false)

  // Auto-dismiss notification after 5 seconds with smooth slide away
  useEffect(() => {
    if (!notification) {
      setIsNotificationExiting(false)
      return
    }

    const timer = setTimeout(() => {
      setIsNotificationExiting(true)
      const removeTimer = setTimeout(() => {
        setNotification(null)
        setIsNotificationExiting(false)
      }, 400) // matches slideUp animation
      return () => clearTimeout(removeTimer)
    }, 5000)

    return () => clearTimeout(timer)
  }, [notification])

  const handleCloseNotification = () => {
    setIsNotificationExiting(true)
    setTimeout(() => {
      setNotification(null)
      setIsNotificationExiting(false)
    }, 400)
  }

  // Handle GEDCOM or ZIP file parsed in browser
  const handleFileLoaded = useCallback((content, fileName) => {
    try {
      const parsed = parseGedcom(content)
      if (parsed.length === 0) {
        setNotification({
          message: 'No individual records found in the uploaded file.',
          type: 'error'
        })
        return
      }

      setAncestors(parsed)
      const cleanName = fileName.replace(/\.ged$/i, '').replace(/\.zip$/i, '').replace(/_/g, ' ')
      setTreeName(cleanName)
      setIsSample(false)
      setActiveTab(null)
      setNotification({
        message: `Successfully imported ${cleanName} with ${parsed.length} ancestors.`,
        type: 'success'
      })
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 50)
    } catch (err) {
      setNotification({
        message: 'Error parsing file. Please make sure it is a valid .zip or .ged export.',
        type: 'error'
      })
    }
  }, [])

  // Load sample tree on demand
  const handleLoadSample = useCallback(() => {
    setAncestors(SAMPLE_ANCESTORS)
    setTreeName('Boss-Jensen Pioneer Lineage')
    setIsSample(true)
    setActiveTab(null)
    setNotification({
      message: 'Switched to demo tree. Choose an activity below to begin.',
      type: 'info'
    })
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 50)
  }, [])

  // Reset to home page on brand click
  const handleGoHome = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setAncestors(null)
    setTreeName('')
    setIsSample(false)
    setActiveTab(null)
  }, [])

  const hasTreeLoaded = ancestors && ancestors.length > 0

  return (
    <div className="app-root">
      {/* Clean Minimalist Clickable Header */}
      <Header onGoHome={handleGoHome} />

      {/* Notification Toast */}
      {notification && (
        <aside
          className={`notification-bar ${notification.type} ${isNotificationExiting ? 'slide-out' : ''}`}
          aria-live="polite"
        >
          <div className="notification-content">
            <span>{notification.message}</span>
            <button
              type="button"
              className="notification-close"
              onClick={handleCloseNotification}
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        </aside>
      )}

      {/* STATE 1: First-Time User Landing with Step-by-Step Instructions & Dropzone */}
      {!hasTreeLoaded && (
        <main className="app-main-content">
          <WelcomeHero
            onFileLoaded={handleFileLoaded}
            onLoadSample={handleLoadSample}
          />
        </main>
      )}

      {/* STATE 2: A Tree is Loaded -> The Full Discovery Hub */}
      {hasTreeLoaded && (
        <>
          {/* Active Tree Status Bar */}
          <div className="active-tree-banner">
            <div className="active-tree-inner">
              <div className="active-tree-left">
                <span className="active-dot" aria-hidden="true"></span>
                <strong className="active-name">{treeName}</strong>
                <span className="active-count">({ancestors.length} ancestors)</span>
              </div>

              <div className="active-tree-actions">
                <button
                  type="button"
                  className="btn-change-tree"
                  onClick={handleGoHome}
                >
                  Change Tree
                </button>
              </div>
            </div>
          </div>

          {/* Activity Navigation Bar */}
          {activeTab && (
            <TabBar
              activeTab={activeTab}
              onSelectTab={setActiveTab}
            />
          )}

          {/* Dynamic Pillar Content */}
          <main className="app-main-content">
            {/* 1. Mode Chooser: Shown when tree is loaded before picking a game */}
            {!activeTab && (
              <ActivityChooser
                ancestorsCount={ancestors.length}
                treeName={treeName}
                onSelectActivity={(tabId) => {
                  setActiveTab(tabId)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              />
            )}

            {/* 2. Interactive Modes */}
            {activeTab === 'matchmaker' && (
              <Matchmaker
                ancestors={ancestors}
                onSelectPerson={(person) => setSelectedPerson(person)}
              />
            )}

            {activeTab === 'timemirror' && (
              <TimeMirror
                ancestors={ancestors}
                onSelectPerson={(person) => setSelectedPerson(person)}
              />
            )}

            {activeTab === 'constellation' && (
              <HeritageConstellation
                ancestors={ancestors}
                onSelectPerson={(person) => setSelectedPerson(person)}
              />
            )}
          </main>
        </>
      )}

      {/* Person Detail & Story Modal */}
      {selectedPerson && (
        <PersonDetailModal
          ancestor={selectedPerson}
          onClose={() => setSelectedPerson(null)}
        />
      )}

      {/* Export Instructions & Help Modal */}
      <OnboardingModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        onFileLoaded={handleFileLoaded}
        onLoadSample={handleLoadSample}
      />

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-logo">MemoryLink</span>
            <p>Connecting you with the lives, traits, and milestones of your ancestors.</p>
          </div>
          <div className="footer-links">
            <span>Private &amp; Secure &bull; All data processed in your browser</span>
            <span>&bull;</span>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => setIsHelpModalOpen(true)}
            >
              Export Instructions &amp; Help
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
