import React, { useState, useRef } from 'react'
import { extractGedcomFromZip } from '../../utils/zipReader'
import './InlineDropzone.css'

export default function InlineDropzone({ onFileLoaded, onLoadSample, isCompact = false }) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const fileInputRef = useRef(null)

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

    // ZIP Archive
    if (lowerName.endsWith('.zip')) {
      setIsProcessing(true)
      try {
        const { fileName, content } = await extractGedcomFromZip(file)
        setIsProcessing(false)
        onFileLoaded(content, fileName || file.name)
      } catch (err) {
        setIsProcessing(false)
        setErrorMsg('Could not read .ged inside this zip. Try extracting it first.')
      }
      return
    }

    // Direct GEDCOM or TXT
    if (lowerName.endsWith('.ged') || lowerName.endsWith('.txt')) {
      setIsProcessing(true)
      const reader = new FileReader()
      reader.onload = (e) => {
        setIsProcessing(false)
        onFileLoaded(e.target.result, file.name)
      }
      reader.onerror = () => {
        setIsProcessing(false)
        setErrorMsg('Failed to read the file.')
      }
      reader.readAsText(file)
      return
    }

    setErrorMsg('Please drop an Ancestry .zip download or .ged file.')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0])
    }
  }

  return (
    <div className={`inline-dropzone-wrapper ${isCompact ? 'compact' : ''}`}>
      <div
        className={`inline-dropzone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        id="main-drag-drop-zone"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => e.target.files?.[0] && handleProcessFile(e.target.files[0])}
          accept=".zip,.ged,.txt"
          style={{ display: 'none' }}
        />

        <div className="dropzone-inner">
          <span className="dropzone-icon" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </span>
          <div className="dropzone-text">
            <strong>
              {isProcessing
                ? 'Unpacking & Reading Tree...'
                : 'Drag & Drop your .zip or .ged file here'}
            </strong>
            <p>or click to browse from your computer</p>
          </div>
        </div>
      </div>

      {errorMsg && <div className="inline-drop-error">{errorMsg}</div>}
    </div>
  )
}
