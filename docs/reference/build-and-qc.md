---
title: "Build, QC, and Future Content"
description: "How to verify the playbook, run builds, and what content to add next (per Organization-prd)."
tags: ["reference", "qc", "process"]
---

# Build, QC, and Future Content

Reference: Organization-prd.md (repo root)

## Build & QC Steps
- Run `npm run build` (checks broken links; converts CSV dashboards to MD). Optional: `npm run start` to spot-check sidebar/nav and DocCard rendering.
- If links break, update paths to new locations (strategy templates under `templates/strategy/`, dashboards under `09-analytics/dashboards/`, onboarding under `templates/getting-started/`, offline under `06-paid-media/`).
- Confirm numbering in `05-content/proof-and-credibility/` remains sequential (00–11).
- Log fixes/changes in `reference/changelog.md` when substantive content is added.

## Future Content to Add (per PRD)
- Foundations: why-builders-are-different, revenue-team-model, ai-in-marketing.
- Trust & Relationships: why-relationships-win, client-experience, community-and-associations, reactivation-campaigns.
- Strategy: positioning-statement, differentiation (expand if thin).
- Content (root): content-philosophy, answering-hard-questions, content-repurposing, ai-content-workflows.
- Buyer Resources: journey-mapping, pricing-transparency-tools, educational-content, self-service-tools, ai-powered-experiences, lead-magnets.
- Proof & Credibility: portfolio-strategy, project-documentation, client-stories, awards-and-recognition, crisis-response.
- Paid Media: paid-media-philosophy, performance-creative, retargeting.
- Sales Enablement: sales-marketing-alignment, objection-handling, proposal-and-pricing.
- Systems & Automation (root): systems-philosophy, lead-qualification, handoffs-and-follow-up, vendor-selection.
- Automation subfolder: automation-philosophy, email-sequences, lead-nurturing, personalization-at-scale, trigger-based-workflows.
- Analytics: kpis-that-matter, tracking-setup.
- Reference: glossary, recommended-reading, industry-benchmarks, changelog (keep logging updates).

## Templates Still Needed
- `templates/content/` – add concrete content templates (blog, social, video, email).
- `templates/measurement/` – add reporting/KPI templates.
- `templates/sales/` – add sales enablement templates (discovery, proposals, objections).

## Handoff Notes
- Placeholders exist across new docs; replace with substantive content using PRD voice: lead with why, then how, keep trust-critical tone for builders/remodelers.
- Keep internal ops (e.g., offboarding) outside the client playbook; links should not point to internal SOPs.
- After adding content, rerun `npm run build` and update `reference/changelog.md` with what changed.

