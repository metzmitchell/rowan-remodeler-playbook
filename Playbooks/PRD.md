# Remodeler Playbook PRD

## Final Vision

A Docusaurus doc site that serves as a **marketing tactics menu for design-build remodeler clients**. Used during client calls to walk through and select marketing tactics.

The site will be:
- Organized using the Everspaces playbook template structure (adapted for remodelers)
- Populated with existing SOPs and tactics from source files
- Scrubbed of all client-specific data (names, identifying details)
- Design-build remodeler specific (not coworking, not design-build remodeler)

---

## Reference Documents

These documents provide context for content transformation:

1. **Remodeler vs. Design-Build Remodeler Differences:**  
   `Playbooks/marketing-strategy-analysis-custom-home-builders-vs-design-build-remodelers.md`
   
2. **Marketing Philosophy:**  
   `[Your Consultancy] Processes/shared-context/marketing-philosophy.md`

---

## Category Structure

Use this hierarchy for organizing tactics. The order reflects the natural progression: **"Build the foundation, then expand outward from your home base."**

| # | Category | Description |
|---|----------|-------------|
| 1 | **Onboarding** | Client kickoff, access, initial setup |
| 2 | **Systems & Organization** | CRM, file management, workflows |
| 3 | **Analytics & Tracking** | Measurement setup before spending on marketing |
| 4 | **Strategy & Goals** | Define targets before tactics |
| 5 | **Messaging & Positioning** | Know what to say before you say it |
| 6 | **Platform (Website & GMB)** | Your "home base" - where everything points |
| 7 | **Reputation & Reviews** | Trust signals - critical for remodelers |
| 8 | **Directory Listings & Local SEO** | Get found locally |
| 9 | **Content Marketing** | Blog, video, portfolio updates |
| 10 | **Search Engine Optimization** | Organic visibility |
| 11 | **Advertising** | Paid acquisition |
| 12 | **Traditional/Print/Offline** | Yard signs, home shows, mailers |
| 13 | **Partnerships & Promotions** | Realtor referrals, designer relationships, trade partners |
| 14 | **Sales Strategies** | Proposals, follow-up, closing |
| 15 | **Referrals** | Past client programs, asking for referrals |
| 16 | **Optimization** | Testing, improving what's working |
| 17 | **Recurring Tasks** | Daily, weekly, monthly marketing activities |

**Note:** "Key Priorities" becomes a dashboard/summary page, not a category. "Miscellaneous Projects" content gets distributed into relevant categories. "Software" folds into Systems & Organization.

---

## Content Transformation Rules

### ⚠️ CRITICAL: Minimal Changes Only

**Do NOT:**
- Add generic marketing strategies or "best practices"
- Expand content beyond its original length
- Make assumptions about what should be included
- Add filler or explanatory content that wasn't there before

**DO:**
- Only change what's necessary (coworking → remodeler, client names → placeholders)
- Keep the same length and structure as the original
- Preserve the author's voice and style
- When transforming to remodeler-specific, swap terms 1:1 where possible

**If unsure:** Leave it alone. [Advisor] will review everything after.

---

### Coworking-Specific Content
- **Action:** Replace with remodeler equivalent
- Do not delete—transform to remodeler context
- If no equivalent exists, archive to `Playbooks/Archive/Coworking/`

### Design-Build Remodeler Content
- **Action:** Archive before modifying
- Copy original to `Playbooks/Archive/Custom-Builders/` before any edits
- Much of this content applies to design-build remodelers—adapt the language
- See the marketing strategy analysis document for key differences

### Client Data
- **Action:** Remove all identifying information
- Replace client names with generic placeholders (e.g., "[Client Name]" or "Example Remodeler")
- Remove specific project details that could identify clients

### Generic/Universal Content
- **Action:** Keep as-is
- Tactics like Google Analytics setup, basic SEO, etc. don't need remodeler-specific language
- Only update if clarity improves

---

## Remodeler-Specific Emphasis

These areas need remodeler-specific framing (per the marketing strategy analysis):

1. **Referrals** - Past clients, realtors, interior designers, trade partners (not member-to-member like coworking)
2. **Reviews/Reputation** - Working in people's homes = trust is everything. Houzz, Google, BBB matter.
3. **Portfolio/Case Studies** - Before/after photos, project stories are essential
4. **Sales Process** - In-home consultations, detailed estimates, contract signing
5. **Clean Site/Professionalism** - Addressing the #1 client fear: living through renovation chaos
6. **Single-Point Accountability** - The design-build value proposition

---

## Archive Folder Structure

```
Playbooks/
├── Archive/
│   ├── Custom-Builders/     # Original Design-Build Remodeler content before transformation
│   ├── Coworking/           # Coworking-specific content with no remodeler equivalent
│   └── Raw-Exports/         # Original Notion exports (preserve source)
```

---

## Source Files Inventory

### 1. Everspaces Playbook Template (PRIMARY SOURCE)
**Path:** `Playbooks/Source Files/Playbook Template from Everspaces/`

~94 marketing tactics exported from Notion. These form the backbone of the playbook.

**Examples:** Google My Business setup, Facebook Ads, UTM tracking, CRM usage, referral programs, etc.

**Action:** Sort each tactic into the 16 categories. Transform coworking language to remodeler language.

---

### 2. Recurring Tasks Template
**Path:** `Playbooks/Source Files/Recurring Tasks Template from Everspaces/`

~31 files covering recurring marketing activities (daily, weekly, monthly cadences).

**Action:** → Recurring Tasks category (dedicated folder)

---

### 3. Client Templates
**Path:** `Playbooks/Client Templates/`

Templates and SOPs for client delivery. Key items:

| File | Category Mapping | Notes |
|------|------------------|-------|
| `Marketing Strategy.md` | Strategy & Goals | Strategy framework template |
| `Strategy Call Questionnaire.md` | Onboarding | Discovery questions |
| `Buyer Personas - Sheet1.csv` | Strategy & Goals | Persona template |
| `Content Creation SOP.md` | Content Marketing | How to create/distribute content |
| `Offboarding SOP.md` | Systems & Organization | Client offboarding process |
| `Marketing Dashboard v2.md` | Analytics & Tracking | KPI dashboard setup |
| `Notes About KPIs and Projects.md` | Analytics & Tracking | KPI guidance |
| `LinkedIn Comment Writing Assistant.md` | Content Marketing | LinkedIn engagement |
| `Comment Generation Guidelines for LinkedIn Posts.md` | Content Marketing | LinkedIn comments |
| `Writing for Linkedin.md` | Content Marketing | LinkedIn content |
| `Posting Awards.md` | Reputation & Reviews | How to leverage awards |
| `AI Business Coaching Framework.md` | Strategy & Goals | Coaching framework |
| `Prompt Writing.md` | Systems & Organization | AI prompt templates |
| `Prompt for Creating Context Documents.md` | Onboarding | Context doc creation |

**CSV Templates (keep as downloadable resources):**
- `Allowable CPA.xlsx` → Analytics & Tracking
- `Custom Home Dashboard Template - Basic.csv` → Analytics & Tracking
- `General Business KPI Dashboard Template - Basic.csv` → Analytics & Tracking
- `KPI Dashboard - Remodeling - KPI Dashboard.csv` → Analytics & Tracking
- `Listing Management [Template v2] - Citation_Backlinks.csv` → Directory Listings & Local SEO
- `Marketing Channel Summary Template - Sheet1.csv` → Strategy & Goals
- `Marketing Logins & Passwords - Access Checklist.csv` → Onboarding

---

### 4. Copywriting Guidelines
**Path:** `Playbooks/Client Templates/copywriting/`

Voice and content guidelines. Could become a "Messaging & Positioning" reference section or a separate "Voice Guidelines" resource.

| Subfolder | Contents | Category Mapping |
|-----------|----------|------------------|
| `00-CORE-VOICE/` | Marketing rules, voice reference, philosophy | Messaging & Positioning |
| `01-VOICE-BY-CONTEXT/` | Builder industry voice, casual voice | Messaging & Positioning |
| `02-CHANNEL-SPECIFIC/` | Email, LinkedIn, YouTube, scripts | Content Marketing |
| `03-CONTENT-GUIDELINES/` | Content guidelines, video, prompting | Content Marketing |
| Root files | Market research template, content chains | Content Marketing |

---

### 5. KPI Dashboard Generation
**Path:** `Playbooks/Client Templates/Generate KPI Dashboard/`

Prompts and processes for creating KPI dashboards.

**Files:**
- `Generate KPI Dashboard.md`
- `Anaylze CRM Data.md`
- `Full Prompt in 1 (first try).md`

**Action:** → Analytics & Tracking

---

### 6. Onboarding Folder
**Path:** `Playbooks/Onboarding/`

| File | Notes |
|------|-------|
| `Discovery Questionnaire.md` | Client discovery questions |
| `Kevin Onboarding Questions.md` | Additional onboarding questions |
| `Tool Access.md` | Access/login checklist |

**Action:** → Onboarding category

---

### 7. Knowledge Base SOPs
**Path:** `Playbooks/Source Files/sops/Knowledge Base SOPs/`

Meta SOPs about organizing knowledge. Categories include Business, Communication, Sales, Website, Writing.

**Action:** Review for useful tactics to integrate. May be more internal/operational than client-facing.

---

### 8. Standalone Files (Root Level)
**Path:** `Playbooks/`

| File | Category Mapping | Notes |
|------|------------------|-------|
| `Getting Reviews for Builders.md` | Reputation & Reviews | Tactical notes on reviews |
| `marketing-strategy-analysis-custom-home-builders-vs-design-build-remodelers.md` | Reference doc | Keep as reference, don't reorganize |
| `Design-Build Remodeler Playbook.md` | Archive | Currently empty, placeholder |
| `Source Files/Brand Voice Doc.md` | Messaging & Positioning | Brand voice guidelines |

---

## Content Type Guidance

### Tactics (from Everspaces)
- Short, actionable items
- Go directly into category folders
- Clean up Notion export artifacts (hash IDs in filenames)

### SOPs (from Client Templates)
- Step-by-step processes
- May be longer, more detailed
- Place in relevant category or create "How-To" subsections

### Templates (CSVs, frameworks)
- Keep as downloadable resources
- Create a "Templates" or "Resources" subsection
- Reference from relevant tactic pages

### Voice/Copywriting Guidelines
- Consider as a special "Resources" section OR
- Integrate into Messaging & Positioning category
- These inform how to execute other tactics

---

## Scope & Priorities

### This Phase (Document Organization)
- Set up folder structure with correct categories
- Sort existing content into categories
- Archive Design-Build Remodeler content before transforming
- Remove client data
- Adapt language from coworking → remodeler where needed

### NOT This Phase
- Creating new content
- Adding effort/cost/impact metadata to tactics
- Building the actual Docusaurus site (separate prompt exists for that)
- Detailed content editing ([Advisor] will review everything closely after organization)

---

## Success Criteria

### Structure
- [ ] 17 category folders created
- [ ] Archive folder structure in place (Custom-Builders, Coworking, Raw-Exports)
- [ ] Templates/Resources subfolder for downloadable files

### Content Migration
- [ ] All ~94 Everspaces tactics sorted into categories
- [ ] All ~31 Recurring Tasks moved to Recurring Tasks category
- [ ] All Client Templates placed appropriately
- [ ] Copywriting guidelines organized (Messaging & Positioning or Resources)
- [ ] Onboarding docs migrated
- [ ] Standalone files (Getting Reviews, etc.) placed

### Transformation
- [ ] Coworking references replaced with remodeler equivalents
- [ ] Design-Build Remodeler content archived before any modifications
- [ ] Client names/identifying data removed
- [ ] Notion export artifacts cleaned up (hash IDs in filenames)

### Ready for Review
- [ ] No orphan files left in source folders
- [ ] Clear file naming (no Notion hashes)
- [ ] Content is ready for [Advisor]'s detailed review

---
