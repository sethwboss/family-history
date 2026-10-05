# Family History Explorer (AncestorLink)

An interactive, single-page web application designed to help users discover meaningful personal connections to their ancestors through trait matching, age synchronization, and heritage skill constellation maps.

Built with **React 19**, **Vite**, and a **Vanilla CSS Design Token System** inspired by FamilySearch and Ancestry aesthetics.

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open your browser to [http://localhost:5173/](http://localhost:5173/) to view the running app with instant Hot Module Replacement (HMR).

### 3. Production Build
```bash
npm run build
```

---

## Documentation & Architecture Guides

Detailed documentation is available in the [`docs/`](file:///c:/dev/family-history/docs) folder:
- [React Architecture & Build Guide](file:///c:/dev/family-history/docs/react-build-guide.md): Why React is used over static HTML/CSS/JS, Vite configuration, and build processes.
- [Project & Development Guidelines](file:///c:/dev/family-history/docs/development-guidelines.md): Software engineering principles, command execution policy, and folder organization.
- [Master Plan & Architecture](file:///c:/dev/family-history/docs/website-plan.md): The three core discovery pillars, GEDCOM data strategy, and 10-hour implementation roadmap.
- [Website Layout & Design System](file:///c:/dev/family-history/docs/website-layout-and-design-system.md): Component layout specifications and green/white CSS token system.
- [Feasibility & Brainstorming](file:///c:/dev/family-history/docs/feasibility-and-brainstorming.md): Strategic choices, avoiding FamilySearch sandbox bottlenecks, and export options.
- [Tree Export Instructions](file:///c:/dev/family-history/docs/export-instructions.md): Step-by-step instructions for exporting GEDCOM files from Ancestry and FamilySearch.

---

## Project Structure
```text
family-history/
├── index.html                  # HTML entry point (Merriweather & Inter fonts)
├── vite.config.js              # Vite React configuration
├── package.json                # Project dependencies and scripts
├── public/                     # Static media & favicon.svg
├── data/                       # Raw genealogy data (.ged files)
├── docs/                       # Architectural and technical documentation
├── scripts/                    # Utility scripts
└── src/                        # React application source code
    ├── main.jsx                # DOM mounting
    ├── App.jsx                 # Main application shell
    ├── App.css                 # Application shell styling
    ├── index.css               # Global CSS resets
    ├── styles/                 # Design token system (variables.css)
    ├── components/             # Reusable UI components
    │   ├── Common/             # Buttons, Cards, Badges, Modals
    │   ├── Navigation/         # Top navbar, state switcher, discovery tabs
    │   └── Tree/               # PersonCard, MatchCard, Timeline, Constellation
    ├── utils/                  # Pure utility functions (gedcomParser, matchEngine)
    └── data/                   # Fallback sample datasets and quiz traits
```
