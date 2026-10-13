# Project & Development Guidelines

This document outlines the operational and architectural principles for developing and maintaining the Family History Website.

---

## 1. Testing Policy & Command Execution
- **No Self-Testing by AI:** Do NOT attempt to test features or browser pages yourself (e.g., running browser subagents, headless test runners, or simulated click flows).
- **User Performs Manual Testing:** Once code changes are written and saved, leave all testing to the user to test manually in their browser via the live local dev server.
- **Minimize Command Execution:** Avoid running shell or terminal commands unless strictly necessary.
- **AFK / Non-Interactive Friendly:** The developer/user may be away from the keyboard (AFK) and unable to manually approve prompted terminal commands. 
- **Prefer Direct File Operations:** Prefer reading, creating, and modifying code files directly using standard file tools rather than triggering terminal builds, script executions, or CLI scaffolding commands when alternatives exist.
- **Batch Necessary Commands:** If running commands becomes truly unavoidable (e.g., critical dependency installations or production builds), consolidate them and keep interactive prompts to zero.

---

## 2. Technology Stack & Lifecycle Commands
- **Framework:** React 19 Single Page Application (SPA)
- **Tooling & Bundler:** Vite with `@vitejs/plugin-react`
- **Styling:** Vanilla CSS with centralized CSS variables / design tokens
- **Key Commands:**
  - `npm run dev`: Launch local Vite dev server with Hot Module Replacement (`http://localhost:5173/`)
  - `npm run build`: Compile and minify production bundle into `dist/`
  - `npm run preview`: Preview production build locally
  - `npm run lint`: Run code linter

---

## 3. Core Software Engineering Principles

### A. Don't Repeat Yourself (DRY)
- Centralize shared logic, constants, formatters, and utility functions in dedicated utility modules.
- Avoid duplicating markup, data structures, or styling rules across multiple files.

### B. Single Responsibility & Modularity
- Each component, module, or function should do one thing well.
- Break large, monolithic files into small, focused, and testable modules.

### C. Clean, Readable, and Self-Documenting Code
- Use expressive, intentional naming for functions, variables, components, and CSS classes.
- Include comments for non-obvious logic, business rules, or complex data transformations. Preserve existing documentation.

---

## 4. Directory & File Organization
Keep files organized within dedicated, purpose-driven folders. Avoid placing loose logic or components directly in the root directory:

```text
src/
├── assets/          # Static media, icons, and fonts
├── components/      # Reusable UI components (each with its own folder if multi-file)
│   ├── Common/      # Buttons, inputs, modals, cards
│   ├── Navigation/  # Header, footer, breadcrumbs
│   └── Tree/        # Genealogy tree visualizations
├── styles/          # Global styles, CSS variables, and design tokens
├── utils/           # Helper functions, date parsers, GEDCOM utilities
├── data/            # Local data files, schemas, and mock records
└── pages/ or views/ # Top-level page views and routes
```

- **Folder-per-component (when applicable):** Complex components should live in their own folder alongside their specific styles or subcomponents (e.g., `components/PersonCard/PersonCard.jsx`, `components/PersonCard/PersonCard.css`).

---

## 5. Theming, Variables, and Reusability

To ensure the website's theme, colors, typography, and spacing can be easily adapted or overhauled:

### A. Centralized Design Tokens (CSS Variables)
- Define all colors, typography scales, spacing, border radii, shadows, and transitions as CSS variables (e.g., in a `styles/variables.css` or `tokens.css` file).
- **Never hardcode hex colors or raw pixel values** directly in component styles. Always reference CSS variables:
  ```css
  :root {
    --color-primary: #5c4033;
    --color-surface: #fdfbf7;
    --color-text-main: #2b2b2b;
    --font-heading: 'Merriweather', serif;
    --font-body: 'Inter', sans-serif;
    --spacing-md: 16px;
    --radius-md: 8px;
  }

  .card {
    background-color: var(--color-surface);
    color: var(--color-text-main);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
  }
  ```

### B. Highly Reusable UI Components
- Design UI elements (buttons, cards, banners, modal dialogues, person nodes) to be modular and parameter-driven.
- Components should accept props/arguments for customization rather than hardcoding specific text, variants, or layouts.

---

## 6. Summary Checklist for Code Changes
- [ ] Did I avoid testing things myself and leave verification for the user to manually test?
- [ ] Did I avoid triggering unnecessary terminal commands?
- [ ] Are styles using CSS variables instead of hardcoded colors/dimensions?
- [ ] Is this new code placed in its appropriate folder?
- [ ] Can this component or utility be reused instead of copy-pasted?
- [ ] Is the code clear, well-named, and maintainable?
