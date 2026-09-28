# Family History Website — Master Plan & Architecture

## 1. Vision & Core Philosophy
A fast, engaging, and interactive web application designed to help users discover meaningful personal connections to their ancestors. Instead of dry lists of birth and death dates, the site brings ancestors to life by uncovering shared passions, trades, and life experiences across 6–7 generations.

---

## 2. The Three Core Pillars (All 3 Planned for Implementation)

The project will be built as a multi-feature web app combining three synergistic discovery tools:

### Pillar 1: "Who Do You Take After?" (Ancestor Matchmaker) — *Phase 1 / MVP*
- **User Input:** Quick, fun interactive quiz where the user selects:
  - Hobbies & passions (e.g., woodworking, baking, gardening, music, sailing).
  - Career / field of study (e.g., engineering, teaching, healthcare, craftsmanship, agriculture).
  - Geographic roots (hometown or places lived).
  - Personal traits or life experiences (e.g., military service, immigration, big families).
- **Matching Engine:** Computes a compatibility percentage based on weighted criteria (shared occupations, hobbies, locations, and life milestones).
- **Results Card Display:**
  - Ranked ancestor matches with match score badges (e.g., *"94% Match: John Henderson"*).
  - Explanatory callouts (e.g., *"Both loved woodworking; both lived in Ohio"*).
  - Direct button: *"View Memories & Records on FamilySearch / Ancestry"*.

### Pillar 2: "Time-Traveler's Mirror" (Age & Life-Stage Synchronizer) — *Phase 2*
- **User Input:** User inputs their current age (e.g., 20) and optional milestone.
- **Engine:** Queries the 6–7 generation dataset for events that occurred when ancestors were that exact age.
- **Display:**
  - *"At age 20, your 3x great-grandfather immigrated across the Atlantic."*
  - *"At age 20, your great-grandmother began teaching in a one-room schoolhouse."*
  - Side-by-side timeline comparison between the modern user and historical family members.

### Pillar 3: "Heritage Constellation & Trade Map" (Trade & Skill Network) — *Phase 3*
- **Visual Explorer:** Interactive category / tag cluster highlighting the diverse trades, professions, and hobbies found across the family tree (e.g., Blacksmiths, Seamstresses, Farmers, Educators, Musicians).
- **Filtering:** Clicking any trade or skill filters the family tree to reveal which family branches excelled in that craft.
- **Connection Mode:** Allows the user to select their own field to see ancestral lineage patterns.

---

## 3. Data Strategy: What's in a GEDCOM (.ged) File?

A standard `.ged` (GEDCOM 5.5.1 / 7.0) file is a universal, plain-text genealogy format. It contains **everything needed** to power all 3 pillars:

| GEDCOM Tag | Data Content | How It Powers Our Features |
| :--- | :--- | :--- |
| `NAME` | Full name (Given, Surname) | Displays ancestor identity on cards & badges. |
| `BIRT` & `DEAT` | Birth & death dates and places (`DATE`, `PLAC`) | Powers timeline calculations and geographic origin matching. |
| `OCCU` | Occupations (*Blacksmith, Teacher, Coal Miner, Sailor*) | **Powers Pillar 1 (Matchmaker) & Pillar 3 (Trade Constellation)!** |
| `NOTE` | Freeform text, biographical sketches, memoirs | Keywords searched for hobbies, passions, stories. |
| `RESI` | Census residences & historical locations | Matches user's hometown or dream destinations. |
| `EVEN` / `FACT` | Milestones (immigration, military service, marriage) | **Powers Pillar 2 (Age Synchronizer)**: e.g., Event Year minus Birth Year = Age at Milestone! |
| `_FSFTID` / `REFN` | FamilySearch Person ID (often preserved in exports) | Direct deep-linking to FamilySearch. |

---

## 4. User Tree Ingestion & Class Access Strategy

Since the student and classmates have **free Ancestry accounts**, we provide a universal multi-source strategy:

### Option A: Ancestry.com 1-Click Export (Primary for Classmates)
- **Why Ancestry is ideal:** Ancestry accounts allow users to export their entire tree as a `.ged` file in 10 seconds:
  - *Steps:* `Ancestry.com` $\rightarrow$ `Tree Settings` $\rightarrow$ `Export Tree` $\rightarrow$ Downloads `.ged`.
- The website will feature a helpful direct link: *"How to export your free Ancestry tree in 3 clicks"*.

### Option B: FamilySearch Export via Free Certified Tools
Because FamilySearch is a shared global tree without a direct 1-click web export button, users can use these **3 free certified companion tools**:
1. **RootsMagic Essentials (Free):** Connects to FamilySearch with your login, downloads 6–7 generations in ~2 minutes, and exports a standard `.ged` file.
2. **Ancestral Quest Basics (Free):** Free certified FamilySearch partner with built-in tree download & GEDCOM export.
3. **Legacy Family Tree Standard (Free):** Free edition with direct FamilySearch sync and GEDCOM generation.

### Option C: Instant "Sample Family" (Pre-loaded 6–7 Generations)
- Graders, professors, or visitors without a file can click:
  - `[ 🌟 Load Sample Family: The Pioneer Builders (7 Generations) ]`
  - Instantly loads complete mock/curated data so the site can be graded without requiring any file upload.

---

## 5. FamilySearch vs. Ancestry: What Does Each Have?

| Feature / Resource | FamilySearch | Ancestry |
| :--- | :--- | :--- |
| **Tree Structure** | 1 Single, shared "World Tree" (crowdsourced). | Private, separate trees for each user account. |
| **Exporting Trees** | No direct web export button (requires companion tool like RootsMagic). | **1-Click direct `.ged` file download** under Tree Settings. |
| **Memories & Stories** | **Massive crowd-sourced memories tab** (photos, audio voice recordings, handwritten letters). | Gallery for photos & attached records. |
| **Record Types** | Church records, international microfilms, pioneer trek records. | US/UK censuses, yearbooks, military draft cards, passenger lists. |
| **Unique Identifiers** | Public, universal Person IDs (e.g. `KWQS-XYZ`) with public URLs. | Tree-specific record IDs. |

---

## 6. Phased Implementation Roadmap (10-Hour Budget)

```text
[ Phase 1: Foundation & Matchmaker (0 - 4.5 hrs) ]
  ├── Client-side GEDCOM parser + fallback sample dataset (ancestors.json)
  ├── CSS token design system (variables for colors, fonts, spacing)
  ├── Quiz UI & Multi-factor matching scoring algorithm
  └── Result cards with % match badges & direct FamilySearch/Ancestry links

[ Phase 2: Time-Traveler's Mirror (4.5 - 7.0 hrs) ]
  ├── Calculate milestone age (Event Year - Birth Year)
  ├── Interactive "At Your Age" timeline comparison component
  └── Navigation bar linking all tools

[ Phase 3: Trade Constellation & Skill Map (7.0 - 9.0 hrs) ]
  ├── Aggregate OCCU tags into interactive trade clusters
  ├── Filterable branch explorer
  └── Polish micro-interactions & responsive mobile layouts

[ Phase 4: Final Polish & Deployment (9.0 - 10.0 hrs) ]
  ├── Theming switcher / quick variables check
  └── Deploy to GitHub Pages or Vercel
```

---

## 7. Data Schema Blueprint (`ancestors.json` / Parsed Output)
```json
[
  {
    "id": "KWQS-123",
    "name": "William Harrison",
    "relationship": "3x Great-Grandfather",
    "generation": 5,
    "birthYear": 1842,
    "deathYear": 1918,
    "birthPlace": "Yorkshire, England",
    "residences": ["Yorkshire, England", "Nauvoo, Illinois", "Salt Lake City, Utah"],
    "occupations": ["Blacksmith", "Woodworker", "Farmer"],
    "interests": ["Music", "Woodworking", "Storytelling"],
    "milestones": [
      { "age": 18, "event": "Completed blacksmith apprenticeship in England" },
      { "age": 22, "event": "Boarded ship to cross the Atlantic" },
      { "age": 27, "event": "Built family homestead and workshop" }
    ],
    "bioSnippet": "Known for his remarkable ironwork and fiddle playing at community gatherings.",
    "familySearchUrl": "https://www.familysearch.org/tree/person/details/KWQS-123",
    "memoriesUrl": "https://www.familysearch.org/tree/person/memories/KWQS-123"
  }
]
```
