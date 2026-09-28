# Website Layout Architecture & Design System

This document specifies the single-page layout structure, component state flow, and centralized green/white design system for the Family History Website.

---

## 1. Single-Page Application (SPA) Architecture

To keep the experience fast, fluid, and intuitive, **all features and flows will live on a single page**—there will be **no child pages or page reloads**. 

Navigation and state transitions happen smoothly via dynamic section visibility and tabs.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TOP NAVBAR / HEADER                             │
│  [🌿 AncestorLink]             [Active Tree: Boss Family (103)] [Change]│
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  STATE 1: HERO LANDING & ONBOARDING (If no tree loaded)                │
│  • Inspiring Hero Headline & Subtitle                                  │
│  • [Get Started] Button                                                │
│  • Step-by-Step Guided Wizard (Ancestry export instructions)           │
│  • Drag-and-Drop .ged Dropzone + [Browse File] Button                  │
│  • One-Click Fallback: [🌟 Play with Sample Pioneer Tree]             │
│                                                                        │
│  ────────────────────────────────────────────────────────────────────  │
│                                                                        │
│  STATE 2: THE DISCOVERY HUB (Once a tree is loaded)                    │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  [ Tab 1: Who Do You Take After? ] [ Tab 2: Age Mirror ] [ Tab 3 ]│  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  • Tab 1 (Matchmaker):                                                 │
│      - 1-minute visual trait quiz (interests, hometown, skills)        │
│      - Match cards with % badges & "View on FamilySearch" links        │
│                                                                        │
│  • Tab 2 (Time-Traveler's Mirror):                                     │
│      - Interactive Age Slider (e.g., Age 20)                           │
│      - "What your ancestors were doing at your exact age" timeline     │
│                                                                        │
│  • Tab 3 (Heritage Constellation):                                     │
│      - Visual cluster of trades (Blacksmiths, Farmers, Teachers)       │
│      - Interactive geographic origins and migration branches           │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│                         FOOTER & CONTROLS                              │
│  • Quick Theme Switcher preview • Privacy notice • BYU-I Project credits│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Onboarding Flow (Landing $\rightarrow$ File Upload)

When a new user clicks **"Get Started"**, an interactive stepped guide guides them through:

1. **Step 1: The Quick Check (Ancestry.com)**
   - *"Do you already have a tree on Ancestry?"*
   - Yes $\rightarrow$ 3-click guide to export (`Tree Settings` $\rightarrow$ `Export Tree`).
   - No $\rightarrow$ *"Click 'Import tree from FamilySearch' on Ancestry first."*
2. **Step 2: Upload Dropzone**
   - Sleek drag-and-drop box accepting `.ged` files.
   - Shows instant progress bar and parses the file in milliseconds.
3. **Step 3: Instant Fallback Button**
   - Prominently displays: **`[ 🌟 Don't have a file right now? Click to test with sample data ]`** so professors or casual users can instantly interact with the full app.

---

## 3. Green & White Design System (Ancestry / FamilySearch Aesthetic)

The aesthetic is inspired by Ancestry and FamilySearch: clean, trustworthy, organic greens, crisp whites, and warm archival neutrals.

### A. Centralized Design Tokens (CSS Custom Properties)
All colors, fonts, spacing, shadows, and radii are defined in `:root` CSS variables. **Component files must never use hardcoded hex codes or pixel sizes**, allowing the entire site theme to be changed in seconds by tweaking this single block:

```css
:root {
  /* ================= Brand Palette (Green & White) ================= */
  --color-primary: #235c2b;          /* Deep Forest Green (Trust, Heritage) */
  --color-primary-hover: #1b4721;    /* Darkened forest green for buttons/hovers */
  --color-primary-light: #e8f5e9;    /* Soft mint tint for highlights and badges */
  --color-accent: #388e3c;           /* Fresh Leaf Green for CTA buttons */
  --color-accent-hover: #2e7d32;     /* Darker leaf green */
  --color-accent-subtle: #f1f8e9;    /* Very soft green background tint */

  /* ================= Neutrals & Surfaces ================= */
  --color-bg: #f8faf8;               /* Clean warm off-white canvas */
  --color-surface: #ffffff;          /* Pure crisp white for cards and modals */
  --color-surface-alt: #f1f5f1;      /* Secondary surface / pill button background */
  --color-border: #dce5dc;           /* Subtle soft green-gray divider border */
  --color-border-focus: #2e7d32;     /* Active focus border */

  /* ================= Typography & Text ================= */
  --color-text-primary: #122114;     /* High-contrast deep slate green for body */
  --color-text-secondary: #4a5d4d;   /* Muted leafy gray for labels and dates */
  --color-text-muted: #718774;       /* Subtle helper text */
  --color-text-inverse: #ffffff;     /* White text on dark green buttons */

  /* ================= Fonts ================= */
  --font-heading: 'Merriweather', 'Georgia', serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;

  /* ================= Spacing & Sizing Scale ================= */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;

  /* ================= Border Radii ================= */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-full: 9999px;             /* Pill badges and round buttons */

  /* ================= Elevation & Shadows ================= */
  --shadow-sm: 0 1px 3px rgba(18, 33, 20, 0.08);
  --shadow-md: 0 4px 12px rgba(18, 33, 20, 0.1);
  --shadow-lg: 0 12px 28px rgba(18, 33, 20, 0.14);

  /* ================= Transitions ================= */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.25s ease;
}
```

---

## 4. UI Components & Reusability Rules

1. **Button Component (`.btn`):**
   - `.btn-primary`: Solid forest green with white text, smooth hover lift.
   - `.btn-secondary`: White surface with green border and green text.
   - `.btn-accent`: Bright leaf green for key call-to-actions.
   - `.btn-sample`: Distinctive badge button for instant sample tree loading.
2. **Card Component (`.card`):**
   - Clean white background (`--color-surface`), soft border (`--color-border`), rounded corners (`--radius-lg`), and subtle shadow.
3. **Badge Component (`.badge`):**
   - Pill-shaped (`--radius-full`) tags for Match % (e.g. `94% Match`), generations (`4th Gen`), and occupations (`Woodworker`).
4. **FamilySearch Direct Link (`.btn-fs`):**
   - Styled with FamilySearch tree icon and direct link styling, opening in a clean new tab.

---

## 5. Summary Checklist for Implementation
- [x] All interactions occur on the same single page (no child routing).
- [x] Onboarding guides users through the quick Ancestry export.
- [x] Fallback sample tree button is available at all times.
- [x] Color palette uses clean green & white tokens.
- [x] All typography, colors, and radii use CSS variables for instant theming.
