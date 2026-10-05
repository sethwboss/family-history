import React, { useState, useRef } from 'react'
import { extractGedcomFromZip } from '../../utils/zipReader'
import './OnboardingModal.css'
import './WelcomeHero.css'

export default function OnboardingModal({ 
  isOpen, 
  onClose, 
  onFileLoaded, 
  onLoadSample 
}) {
  const [activeGuideTab, setActiveGuideTab] = useState('ancestry')
  const [isGuideOpen, setIsGuideOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const fileInputRef = useRef(null)

  if (!isOpen) return null

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleProcessFile = async (file) => {
    setErrorMsg(null)
    if (!file) return

    const lowerName = file.name.toLowerCase()

    // Case 1: ZIP Archive (e.g. from Ancestry)
    if (lowerName.endsWith('.zip')) {
      setIsProcessing(true)
      try {
        const { fileName, content } = await extractGedcomFromZip(file)
        setIsProcessing(false)
        onFileLoaded(content, fileName || file.name)
        onClose()
      } catch (err) {
        setIsProcessing(false)
        setErrorMsg('Could not read .ged inside this zip. Try extracting it first.')
      }
      return
    }

    // Case 2: Direct GEDCOM or TXT
    if (lowerName.endsWith('.ged') || lowerName.endsWith('.txt')) {
      setIsProcessing(true)
      const reader = new FileReader()
      reader.onload = (e) => {
        setIsProcessing(false)
        onFileLoaded(e.target.result, file.name)
        onClose()
      }
      reader.onerror = () => {
        setIsProcessing(false)
        setErrorMsg('Failed to read the file.')
      }
      reader.readAsText(file)
      return
    }

    setErrorMsg('Please select a valid .zip or .ged (GEDCOM) file.')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0])
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="onboarding-modal" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button 
          type="button" 
          className="modal-close-btn" 
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        {/* Header */}
        <div className="welcome-header">
          <div className="header-icon-folder">📁</div>
          <h2>Load Your Family Tree</h2>
          <p className="welcome-lead">
            Upload your Ancestry <strong>.zip</strong> download or direct <strong>.ged</strong> file to explore your personalized matches and timelines.
          </p>
        </div>

        {errorMsg && (
          <div className="upload-alert error">
            ⚠️ {errorMsg}
          </div>
        )}

        {isProcessing && (
          <div className="upload-alert info">
            ⏳ Unpacking your file in the browser...
          </div>
        )}

        {/* 1. Large Drag & Drop Box */}
        <div
          className={`main-dropzone ${isDragging ? 'dragover' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleProcessFile(e.target.files[0])}
            accept=".zip,.ged,.txt"
            style={{ display: 'none' }}
            id="modal-gedcom-file-input"
          />

          <div className="dropzone-content">
            <span className="drop-icon">📦</span>
            <h3>Drag &amp; Drop your <code>.zip</code> or <code>.ged</code> file here</h3>
            <p>or click to browse from your computer</p>
          </div>
        </div>

        {/* 2. Dropdown: "How to get your file" (Closed by default, right below dropzone) */}
        <div className={`guide-dropdown-wrapper ${isGuideOpen ? 'expanded' : ''}`}>
          <button
            type="button"
            className="guide-dropdown-toggle"
            onClick={() => setIsGuideOpen(!isGuideOpen)}
            aria-expanded={isGuideOpen}
            id="modal-how-to-get-file-btn"
          >
            <span className="toggle-text">How to get your file</span>
            <span className={`toggle-chevron ${isGuideOpen ? 'open' : ''}`}>
              ▼
            </span>
          </button>

          {isGuideOpen && (
            <div className="guide-dropdown-content">
              <div className="guide-buttons-row">
                <button
                  type="button"
                  className={`guide-choice-btn ${activeGuideTab === 'ancestry' ? 'active' : ''}`}
                  onClick={() => setActiveGuideTab('ancestry')}
                >
                  Ancestry.com (Recommended)
                </button>
                <button
                  type="button"
                  className={`guide-choice-btn ${activeGuideTab === 'familysearch' ? 'active' : ''}`}
                  onClick={() => setActiveGuideTab('familysearch')}
                >
                  FamilySearch (RootsMagic)
                </button>
              </div>

              <div className="guide-steps-list">
                {activeGuideTab === 'ancestry' ? (
                  <>
                    <div className="guide-step-row">
                      <span className="step-num">1</span>
                      <div className="step-content">
                        <strong>Open your tree:</strong> Go directly to <a href="https://www.ancestry.com/family-tree/trees" target="_blank" rel="noopener noreferrer" className="guide-step-link">Ancestry Trees (ancestry.com/family-tree/trees) ↗</a>, open your tree, and click <em>Tree Settings → Export tree</em>.
                      </div>
                    </div>
                    <div className="guide-step-row">
                      <span className="step-num">2</span>
                      <div className="step-content">
                        <strong>Click "Download your GEDCOM file":</strong> Ancestry prepares your file and downloads a <code>.zip</code> file (like <code>Boss Family Tree.zip</code>).
                        <div className="guide-step-img-wrapper">
                          <img
                            src={`${import.meta.env.BASE_URL}instructions_ancestry.com.png`}
                            alt="Ancestry Download your GEDCOM file prompt"
                            className="guide-step-img"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="guide-step-row">
                      <span className="step-num">3</span>
                      <div className="step-content">
                        <strong>Drop it right here:</strong> You do <strong>NOT</strong> need to unzip it! Just drag the <code>.zip</code> file directly into the box above.
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="guide-step-row">
                      <span className="step-num">1</span>
                      <div className="step-content">
                        <strong>Get free RootsMagic:</strong> Download <a href="https://www.rootsmagic.com/try/" target="_blank" rel="noopener noreferrer" className="guide-step-link">RootsMagic Essentials (rootsmagic.com/try) ↗</a>. Once open, click <em>Download a Tree → FamilySearch Family Tree</em>.
                      </div>
                    </div>
                    <div className="guide-step-row">
                      <span className="step-num">2</span>
                      <div className="step-content">
                        <strong>Import 6–7 Generations:</strong> Sign in with FamilySearch and download your ancestors.
                      </div>
                    </div>
                    <div className="guide-step-row">
                      <span className="step-num">3</span>
                      <div className="step-content">
                        <strong>Export to GEDCOM:</strong> Click <em>File → Export Data → GEDCOM</em> and drop the file in the box above.
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 3. Sample Tree Box */}
        <div className="sample-card">
          <div className="sample-card-text">
            <strong>Don't have your file ready?</strong>
            <p>Test all features instantly with our pre-loaded 7-generation Boss-Jensen pioneer lineage.</p>
          </div>
          <button
            type="button"
            className="btn-play-sample"
            onClick={() => {
              onLoadSample()
              onClose()
            }}
            id="modal-play-sample-tree-btn"
          >
            🌟 Play with Sample Tree
          </button>
        </div>

      </div>
    </div>
  )
}
