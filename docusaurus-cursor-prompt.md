# Docusaurus Site Setup Prompt for Cursor

## PROJECT OVERVIEW
Build a **Docusaurus v3** docs-only knowledge base for construction marketing clients. Priorities: **scannable content**, **clean navigation**, and **easy markdown updates**.

## REPO + DEPLOYMENT TARGET
- **Repo name**: `rowan-playbook` (fresh start)
- **Deploy via Vercel to**: `https://rowan.build/playboook/remodeler/` (confirm spelling; `baseUrl` must end with `/`)
- **Docs live at the site root** (no `/docs` path)

## SCOPE (DO / DON’T)
### Do
- **Docusaurus v3.x** (latest stable)
- **Responsive** (mobile / tablet / desktop)
- **Sidebar**: auto-generated from the `docs/` folder structure
- **Collapsible sections**: use HTML `<details>` in markdown
- **Markdown stays portable**: minimal frontmatter, standard markdown links

### Don’t (for now)
- Dark mode / theme toggle
- Blog
- Search
- AI / chatbot
- CTAs
- Heavy theming or complex styling

## REQUIRED BRANDING (NO LOGO IMAGE)
- **Navbar title text**: `ROWAN REMODELER PLAYBOOK`
- **Title font (navbar title only)**: `South Korea Serif`
  - **Fallbacks**: `"Times New Roman"`, `Merriweather`, `serif`
- **Site icon (favicon)**: `rowan-favicon.png`
- **Remove GitHub “edit” links** in docs pages (no `editUrl`)

## FOLDER STRUCTURE + PLACEHOLDERS
Create a basic folder structure (a **template**; real markdown will be imported later). Placeholder content should be short—just enough to prove structure.

```
rowan-playbook/
├── docs/
│   ├── intro.md
│   ├── fundamentals/
│   │   ├── intro.md
│   │   ├── high-level-overview.md
│   │   └── core-principles.md
│   ├── tasks/
│   │   ├── intro.md
│   │   ├── task-category-1/
│   │   │   ├── intro.md
│   │   │   └── example-task.md
│   │   └── task-category-2/
│   │       ├── intro.md
│   │       └── example-task.md
│   ├── examples-references/
│   │   ├── intro.md
│   │   ├── case-study-1.md
│   │   └── reference-websites.md
│   └── resources/
│       ├── intro.md
│       └── glossary.md
├── static/
│   ├── img/
│   │   └── rowan-favicon.png
│   └── fonts/
│       └── south-korea-serif.woff2  # use the provided font file (filename may differ)
├── src/
│   └── css/
│       └── custom.css
├── docusaurus.config.js
├── sidebars.js
├── package.json
└── README.md
```

## IMPLEMENTATION CHOICES (KEEP IT SIMPLE)
- Use **JavaScript** (not TypeScript)
- Use **npm**
- Use **Node 18+** (prefer latest LTS)

## CONFIGURATION DETAILS

### `docusaurus.config.js` (key settings)
- **URL**: `https://rowan.build`
- **Base URL**: `/playboook/remodeler/`
- **Title**: `ROWAN REMODELER PLAYBOOK`
- **Favicon**: `img/rowan-favicon.png`
- **Docs at site root**: set `routeBasePath: '/'`
- **Sidebar**: auto-generate from folder structure
- **Color mode**: force light mode / disable theme toggle
- **No edit links**: do not set `editUrl`
- **Footer**: include a minimal footer

### Navbar title font (ONLY the title)
In `src/css/custom.css`:
- Add `@font-face` for **South Korea Serif** (host the provided font file in `static/fonts/`)
- Apply the font stack only to the navbar title (e.g., `.navbar__title`)

## MARKDOWN CONVENTIONS
- Keep frontmatter minimal:

```markdown
---
title: Page Title
description: Brief description
---
```

- Use standard markdown for links (normal `[text](https://...)`).
- Use `<details>` for collapsible sections:

```markdown
<details>
<summary>Click to expand</summary>

Content here...

</details>
```

## GIT + HANDOFF
- Initialize git in the project root and create an initial commit:
  - Commit message: `Initial Docusaurus setup with placeholder content`
- Do **not** push to GitHub (user will add remote + push after review)
- `README.md` includes:
  - local dev commands
  - brief notes for connecting Vercel + setting the domain

## DONE WHEN
- Docusaurus v3 runs locally
- Docs render at the site root under the configured `baseUrl`
- Sidebar auto-generates and is usable on mobile/tablet
- Navbar shows `ROWAN REMODELER PLAYBOOK` with the **South Korea Serif** font applied only to that title text
- Favicon uses `rowan-favicon.png`
- Footer exists (minimal)
- Placeholder docs exist and demonstrate organization
- Git is initialized with a single initial commit

---

**Status:** Ready to paste into Cursor. Ensure `static/img/rowan-favicon.png` and the “South Korea Serif” font file exist before setup.

