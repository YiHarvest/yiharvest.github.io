# YiHarvest Portfolio Website Design Spec

**Goal:** Build a professional portfolio website for YiHarvest - an AI Agent & Applied Machine Learning Engineer

**Audience:** Technical recruiters, potential collaborators, open-source community

**Design Read:** Minimalist, engineering-focused, content-first. Avoid AI-generated aesthetics.

---

## Tech Stack

- **Framework:** Astro 5.x with TypeScript
- **Styling:** Tailwind CSS 4.x
- **Content:** MDX for project content
- **Deployment:** GitHub Actions + GitHub Pages
- **Domain:** yiharvest.dev (custom domain)

---

## Design System

### Color Palette (Cold Minimalist)

**Light Mode:**
```
Background:     #F6F6F3 (warm grey white)
Card:           #FFFFFF (pure white)
Border:         #EAEAEA (light grey)
Text Primary:   #111111 (near black)
Text Secondary: #666666 (medium grey)
Accent:         #1B4332 (forest green)
```

**Dark Mode:**
```
Background:     #0A0A0A (pure black)
Card:           #171717 (dark grey)
Border:         #262626 (medium dark grey)
Text Primary:   #FAFAFA (near white)
Text Secondary: #A3A3A3 (light grey)
Accent:         #2D6A4F (lighter forest green)
```

### Typography

- **Font Family:** Geist (single family throughout)
- **Hero Title:** 48px / weight 600
- **Section Title:** 32px / weight 600
- **Card Title:** 20px / weight 500
- **Body:** 16px / weight 400 / line-height 1.6
- **Secondary:** 14px / weight 400
- **Label:** 12px / weight 500 (uppercase)

**Forbidden Fonts:** Inter, Roboto, Open Sans, Fraunces, Instrument Serif

### Layout Rules

- Single-column scrolling layout
- Max content width: `max-w-4xl` (896px)
- Section padding: 96px vertical
- Card padding: 24px
- Card border: 1px solid #EAEAEA
- Card radius: 8px

### Animation Rules

- MOTION_INTENSITY: 3 (minimal)
- Only hover micro-animations
- Animate only `transform` and `opacity`
- Duration: 150-200ms
- No scroll animations, no marquee

---

## Page Structure

### Routes

```
/                           - Homepage
/projects                   - Projects listing
/projects/[slug]            - Project detail (MDX-driven)
/about                      - About page
/notes                      - Notes listing
/notes/[slug]               - Note detail (MDX-driven)
```

### Homepage Sections (in order)

1. **Navigation** (fixed top)
   - Logo: YiHarvest
   - Links: Projects, About, Notes
   - Theme toggle (light/dark)

2. **Hero**
   - Title: YiHarvest
   - Subtitle: AI Agent & Applied Machine Learning Engineer
   - One-line: 专注于 AI Agent、MCP 工具、自动化工作流与生物医学机器学习
   - No eyebrow, no scroll cue, no version label

3. **Featured Projects** (3 cards)
   - Search Engine Tool MCP
   - PPT Design
   - HemoPain

4. **Research Interests**
   - Biomedical ML
   - Knowledge Graph
   - Agent Workflows

5. **Contact**
   - Email, GitHub, LinkedIn links
   - Brief personal line

### Project Card Structure

```
┌─────────────────────────────────────┐
│  Project Name                        │
│  One-line description                │
│  · Tag 1 · Tag 2 · Tag 3             │
│  [GitHub] [详情]                      │
└─────────────────────────────────────┘
```

### Project Detail Page Structure

1. Project header (title, description, tags)
2. Links (GitHub, PyPI, etc.)
3. Content sections (MDX):
   - 背景
   - 技术架构
   - 关键特性
   - 成果

---

## Content Requirements

### Featured Projects (3)

**1. Search Engine Tool MCP**
- Slug: `search-engine-tool-mcp`
- Tags: Python, FastMCP, DDGS, SearXNG
- Key points: Multi-provider, SSRF validation, PyPI distribution

**2. PPT Design**
- Slug: `ppt-design`
- Tags: Codex Plugin, HTML Slides, PPTX
- Key points: Animated HTML presentations, editable PowerPoint export

**3. HemoPain**
- Slug: `hemopain`
- Tags: Machine Learning, Biomedical, Bootstrap
- Key points: Pain classification, blood biomarkers, clinical evaluation

### About Page

- Brief bio
- Current focus
- Skills (not badges, just text)
- Timeline (optional)

### Notes

- MDX-based articles
- List view with title, date, excerpt
- Individual note pages

---

## Anti-Patterns to Avoid (from taste-skill)

- No em-dashes (—)
- No "AI purple" gradients
- No neon glows
- No glassmorphism
- No pill-shaped containers
- No three-column equal feature cards
- No fake product screenshots (div-based)
- No scroll cues ("Scroll to explore")
- No filler verbs: "Elevate, Seamless, Unleash"
- No "Quietly trusted by" / "Field notes"
- No decorative colored status dots

---

## File Structure

```
yiharvest-website/
├── src/
│   ├── components/
│   │   ├── Navigation.astro
│   │   ├── Hero.astro
│   │   ├── ProjectCard.astro
│   │   ├── ProjectGrid.astro
│   │   ├── Footer.astro
│   │   ├── ThemeToggle.astro
│   │   └── Badge.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── ProjectLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── projects/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   └── notes/
│   │       ├── index.astro
│   │       └── [slug].astro
│   ├── content/
│   │   ├── projects/
│   │   │   ├── search-engine-tool-mcp.mdx
│   │   │   ├── ppt-design.mdx
│   │   │   └── hemopain.mdx
│   │   └── notes/
│   │       └── .gitkeep
│   └── styles/
│       └── global.css
├── public/
│   ├── images/
│   └── favicon.svg
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
└── .github/
    └── workflows/
        └── deploy.yml
```

---

## Deployment

- Platform: GitHub Pages
- Build: GitHub Actions
- Custom domain: yiharvest.dev
- Branch: main