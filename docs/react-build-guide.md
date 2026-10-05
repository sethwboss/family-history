# React Architecture & Build Guide

This document outlines the architecture, setup, and build procedures for developing the Family History Website using **React & Vite** instead of a traditional static HTML/CSS/JS document.

---

## 1. Why React Over Static HTML/CSS/JS?

While a static HTML/CSS/JS site is simple to start, this project requires dynamic, multi-layered features that benefit significantly from a modern reactive component framework:

| Dimension | Static HTML / CSS / Vanilla JS | React + Vite Single-Page App |
| :--- | :--- | :--- |
| **Component Architecture** | Manually cloning `<template>` tags or concatenating `innerHTML` strings (error-prone, XSS risks). | Reusable, modular JSX components (`PersonCard`, `Badge`, `TabNavigation`) with declarative props. |
| **State Management** | Global mutable variables scattered across `window` or script files; manual DOM manipulation on every change. | Declarative, reactive state via React hooks (`useState`, `useMemo`). When tree data or quiz answers update, UI synchronizes automatically. |
| **Quiz & Dynamic Matching** | Manually showing/hiding DOM sections, keeping track of form inputs across questions. | Componentized quiz steps with instant score calculation and reactive filtered lists. |
| **Performance & DX** | Manual asset bundling; full page refreshes during local edits. | Lightning-fast **Vite Hot Module Replacement (HMR)** with instantaneous feedback upon editing files. |
| **Code Organization** | Bloated monolithic scripts or cumbersome script tag order in HTML. | Modern ES modules, clean folder hierarchy, scoped CSS variables, and clean dependency management. |

---

## 2. Technology Stack Overview

- **Core Framework:** React 19 (JSX)
- **Build Tool & Dev Server:** [Vite](https://vite.dev/) (Fast ESM bundling and instantaneous hot-reloading)
- **Styling:** Pure Vanilla CSS using Centralized CSS Custom Properties / Design Tokens (no heavy CSS framework dependencies)
- **Typography:** Google Fonts (`Merriweather` serif for headers, `Inter` sans-serif for UI/body)
- **Data Engine:** Client-side GEDCOM parser (`.ged` file upload) + Pre-loaded JSON sample datasets (`ancestors.json`)
- **Package Manager:** `npm` (Node.js v20+)

---

## 3. Project Directory Architecture

The codebase follows the modular structure specified in our development guidelines:

```text
family-history/
├── index.html                  # HTML entry point (font imports, #root mount)
├── vite.config.js              # Vite bundler configuration (@vitejs/plugin-react)
├── package.json                # Project dependencies and lifecycle scripts
├── public/                     # Static public assets (favicon.svg, icons)
├── data/                       # Raw genealogy data (e.g. sample GEDCOM files)
├── docs/                       # Project plans, feasibility studies, and design system specs
├── scripts/                    # Helper analysis scripts (e.g. analyze.ps1)
└── src/                        # React application source code
    ├── main.jsx                # React DOM mount entry point
    ├── App.jsx                 # Top-level application shell and state orchestrator
    ├── App.css                 # Main application shell styling
    ├── index.css               # Global baseline styles and resets
    ├── assets/                 # SVGs, images, and static graphics
    ├── styles/                 # Design token system
    │   └── variables.css       # Centralized CSS variables (colors, fonts, radii, shadows)
    ├── components/             # Reusable UI component library
    │   ├── Common/             # Buttons, Cards, Badges, Modals, Dropzones
    │   ├── Navigation/         # Top navbar, state switcher, discovery tabs
    │   └── Tree/               # PersonCard, MatchCard, Timeline, Constellation
    ├── utils/                  # Pure utility functions
    │   ├── gedcomParser.js     # Parses uploaded .ged files into structured JSON
    │   ├── matchEngine.js      # Computes compatibility percentages for Pillar 1
    │   └── milestoneHelpers.js # Calculates ancestor ages and milestones for Pillar 2
    └── data/                   # Fallback sample datasets and quiz config
        ├── sampleAncestors.json# Curated 7-generation pioneer family dataset
        └── quizTraits.json     # Questions, categories, and weighting criteria
```

---

## 4. Single-Page Reactive State Flow

All 3 core pillars run seamlessly on a single page with zero page reloads:

```
[ Active Dataset State ] (sampleAncestors.json OR User's uploaded .ged)
         │
         ├──► [ Active Tab: "Matchmaker" ]
         │       └── User Quiz Selections ──► matchEngine() ──► Ranked Match Cards
         │
         ├──► [ Active Tab: "Time-Traveler's Mirror" ]
         │       └── Current Age Slider (e.g. 21) ──► milestoneHelpers() ──► Age Timeline
         │
         └──► [ Active Tab: "Heritage Constellation" ]
                 └── Selected Trade / Craft ──► Branch Filter ──► Visual Cluster
```

---

## 5. Development Workflow & Commands

### Prerequisites
- Node.js (v18 or v20+)
- npm (v9 or v10+)

### Setup Commands
To install project dependencies:
```bash
npm install
```

### Running Locally (Development Mode)
Start the local Vite development server with instant Hot Module Replacement (HMR):
```bash
npm run dev
```
By default, the application runs at `http://localhost:5173/`. Any edits saved to `.jsx` or `.css` files update immediately in your browser without losing state.

### Production Build
To create an optimized, minified production bundle in the `dist/` directory:
```bash
npm run build
```

### Preview Production Build
To test the built production bundle locally prior to deployment:
```bash
npm run preview
```

### Linting
To check code cleanliness and syntax:
```bash
npm run lint
```

---

## 6. Deployment Strategy

Because the React app is bundled into static JavaScript, HTML, and CSS assets by Vite:
- **GitHub Pages:** Can be deployed effortlessly via GitHub Actions (building to `dist`).
- **Vercel / Netlify:** Connect the Git repository and set the build command to `npm run build` with output directory `dist`.
- **Zero Backend Required:** All parsing and computation happen directly in the user's browser, ensuring privacy and eliminating server hosting costs.
