---
title: "Attribution Setup Guide"
description: "Step-by-step HubSpot tracking and attribution implementation for multi-brand, multi-market structures."
tags: ["analytics", "attribution", "hubspot", "active"]
last_updated: "2025-01-01"
---

# Attribution Setup Guide

**Timeline:** Months 1-3 (Critical Priority)  
**Owner:** Marketing Lead (Strategy), Technical Vendor (Implementation)

**Goal:** Know which ads produce qualified leads and at what cost.

---

## Why This Comes First

> "Everything else depends on knowing which ads produce qualified leads and at what cost."

Without attribution:
- Can't optimize spend allocation
- Don't know which channels are worth scaling
- CAC targets ($1,500) are guesswork
- No baseline for measuring improvement

**This unlocks everything else in the playbook.**

---

## Month 1: HubSpot Tracking Audit & Setup

### Week 1: Install Tracking Code

**Tasks:**
- [ ] Install HubSpot tracking code on all website pages
- [ ] Verify tracking code fires on every page (use HubSpot debugger)
- [ ] Test cross-domain tracking if applicable

**Technical requirements:**
- HubSpot tracking code in `<head>` tag
- Fires before other analytics (Google Tag Manager, etc.)
- Works across all subdomains (yourcompany.com, etc.)

### Week 2: UTM Parameter Setup

**Tasks:**
- [ ] Define UTM parameter structure for all channels
- [ ] Create UTM conventions document for team
- [ ] Build UTM templates for each paid channel

**UTM Structure:**

| Channel | utm_source | utm_medium | utm_campaign | utm_content |
|---------|------------|------------|--------------|-------------|
| Google Search | google | cpc | `[brand]-[service]-[market]` | `[ad-group]` |
| LSA | google | lsa | `[brand]-[market]` | n/a |
| Meta Ads | facebook | paid-social | `[brand]-[objective]-[market]` | `[ad-creative-id]` |
| Billboards | billboard | offline | `[location]-[quarter]` | `[design-variant]` |
| Mailers | direct-mail | offline | `[neighborhood]-[quarter]` | `[offer-type]` |

**Example Google Search UTM:**
```
utm_source=google
utm_medium=cpc
utm_campaign=avl-remodeling-kitchen
utm_content=granite-countertop-ad
```

### Week 3: Custom Properties Setup

**Tasks:**
- [ ] Create custom contact properties in HubSpot
- [ ] Create custom deal properties
- [ ] Map form fields to properties

**Custom Contact Properties:**
- `Brand/Service Line` (dropdown): [Your Brand(s), e.g., Primary Remodeling, Restoration Division, Market 2]
- `Market` (dropdown): [Your Markets, e.g., Primary Market, Secondary Market]
- `Project Type` (dropdown): Kitchen, Bathroom, Whole-Home, Storm Damage, etc.
- `Funding Source` (dropdown): Cash, Insurance, Financing
- `Lead Source - First Touch` (auto-populated from UTM)
- `Lead Source - Last Touch` (auto-populated from UTM)

**Custom Deal Properties:**
- `Project Value Estimate` (number)
- `Close Probability` (percentage)
- `Consultation Date` (date)

### Week 4: Form Submission Configuration

**Tasks:**
- [ ] Configure all website forms to capture lead source
- [ ] Test form submissions from each channel
- [ ] Verify data flows into HubSpot correctly

**Forms to configure:**
- Contact form (main website)
- Consultation request form
- Project quote request
- Newsletter signup
- Downloadable content forms (if applicable)

---

## Months 1-2: Google Ads + LSA Integration

### Google Ads Integration

**Tasks:**
- [ ] Connect Google Ads account to HubSpot (native integration)
- [ ] Enable auto-tagging (GCLID parameters)
- [ ] Map Google Ads campaigns to HubSpot campaigns
- [ ] Verify click data flows into HubSpot

**HubSpot Settings:**
- Navigate to Settings > Marketing > Ads > Google Ads
- Authenticate Google Ads account
- Select campaigns to track
- Enable "Import offline conversions"

### Offline Conversion Tracking

**Why this matters:** Tells Google Ads which clicks actually closed into projects.

**Tasks:**
- [ ] Create conversion actions in Google Ads (Lead, Consultation Scheduled, Won Deal)
- [ ] Set up HubSpot workflow to send deal "Won" events back to Google Ads
- [ ] Test conversion tracking with sample data
- [ ] Monitor conversion lag time (time from click to close)

**HubSpot Workflow:**
1. Trigger: Deal stage changes to "Closed Won"
2. Action: Send offline conversion to Google Ads
3. Include: Deal value, original GCLID, conversion timestamp

### LSA (Local Services Ads) Attribution

**Tasks:**
- [ ] Tag all LSA leads with `utm_source=google&utm_medium=lsa`
- [ ] Create LSA-specific contact property
- [ ] Track LSA lead volume and conversion separately

**Manual process:**
- When LSA lead comes in (phone call, message), manually tag in HubSpot
- Use workflow automation to assign LSA source if phone number matches LSA tracking number

---

## Month 2: Meta Ads Integration

### Facebook/Instagram Connection

**Tasks:**
- [ ] Connect Facebook Business Manager to HubSpot
- [ ] Link Instagram account
- [ ] Enable Meta lead ads integration (if using lead forms)
- [ ] Map Meta campaigns to HubSpot campaigns

**HubSpot Settings:**
- Navigate to Settings > Marketing > Ads > Facebook
- Authenticate Facebook Business Manager
- Select Ad Accounts to track
- Configure lead sync settings

### Lead Forms (If Using)

**Tasks:**
- [ ] Set up Meta lead forms to flow directly into HubSpot
- [ ] Test lead form submission
- [ ] Verify instant sync (should be under 5 minutes)

### UTM Tracking for Traffic Campaigns

**Tasks:**
- [ ] Apply UTM parameters to all Meta ad creative
- [ ] Test UTM tracking with sample clicks
- [ ] Verify landing page tracking

### Custom Audiences & Retargeting Setup

**Tasks:**
- [ ] Create HubSpot lists for retargeting (website visitors, form abandoners)
- [ ] Sync lists to Meta as custom audiences
- [ ] Set up retargeting campaigns

**Key audiences:**
- Website visitors (last 30 days)
- Page viewers (project galleries, pricing pages)
- Form abandoners (started form, didn't submit)

---

## Months 2-3: Offline Attribution

### Billboard Tracking

**Options:**
1. **Unique vanity URLs** (preferred): `YourCompany.com/billboard-west-asheville`
2. **Unique phone numbers:** CallRail or similar for each billboard location
3. **QR codes:** Track scans by location

**Tasks:**
- [ ] Determine tracking method (vanity URL recommended)
- [ ] Create landing pages for each billboard
- [ ] Add UTM parameters to vanity URLs
- [ ] Set up 301 redirects if needed

**UTM Structure:**
```
utm_source=billboard
utm_medium=offline
utm_campaign=west-asheville-q1-2026
utm_content=kitchen-remodel-creative
```

### Direct Mailer Tracking

**Tasks:**
- [ ] Create unique landing page per mailer campaign
- [ ] Add unique offer code or promo code to mailer
- [ ] Configure HubSpot form to capture promo code
- [ ] Track conversions by landing page and promo code

**Example:**
- Neighborhood: Biltmore Forest
- Landing page: `yourcompany.com/neighborhood-spring-offer`
- Promo code: `BILTMORE2026`

### Referral Partner Tracking

**Tasks:**
- [ ] Create "Referral Source" contact property (text field)
- [ ] Train team to ask "How did you hear about us?" and log in HubSpot
- [ ] Create referral partner list (designers, architects, realtors, insurance adjusters)
- [ ] Track referrals by partner name in deal source field

**HubSpot Workflow:**
- When referral source is filled → assign deal source = "Referral - [Partner Name]"
- Monthly report: referrals by partner, close rate, deal value

---

## Month 3-4: Build KPI Dashboard

### Weekly Marketing Dashboard

**HubSpot Reports to Create:**

1. **Lead Volume Report**
   - Leads by source (last 7 days, last 30 days)
   - Leads by brand (if multiple brands/service lines)
   - Leads by market (if multiple markets)

2. **Qualified Leads Report**
   - MQL (Marketing Qualified Lead) by source
   - SQL (Sales Qualified Lead) by brand
   - Lead quality score distribution

3. **CAC by Channel**
   - Ad spend (from Google Ads, Meta Ads) ÷ leads generated
   - Target: $1,500 CAC
   - Identify channels above/below target

4. **Close Rate by Brand**
   - Deals won ÷ total opportunities
   - By brand, by source, by market

5. **Deal Pipeline**
   - Deals by stage (Qualified, Consultation, Proposal, Won/Lost)
   - Weighted pipeline value
   - Average time in each stage

### Dashboard Configuration

**Tasks:**
- [ ] Create HubSpot custom report dashboard
- [ ] Share dashboard with leadership (view-only link)
- [ ] Set up weekly email with dashboard snapshot
- [ ] Schedule monthly in-depth review meeting

**Dashboard URL:** Pin to favorites, share link in Slack

---

## Month 4-6: Baseline Measurement

### Establish Current State

**Tasks:**
- [ ] Document baseline metrics (Q1/Q2 2026)
- [ ] Calculate current CAC by channel
- [ ] Identify channels above $1,500 CAC
- [ ] Flag channels with poor attribution or low lead quality

**Baseline Metrics to Capture:**
- Total leads/month (current state)
- CAC by channel (Google, LSA, Meta, Billboards, Referrals)
- Close rate by brand
- Average deal size
- Content production volume (blog posts, videos, social)

### Baseline Report Structure

```markdown
## Baseline: Q1 2026

**Lead Volume:** [X] leads/month (target: 40)

**CAC by Channel:**
- Google Search: $[X] (target: $1,500)
- LSA: $[X]
- Meta Ads: $[X]
- Billboards: $[X] or "Unable to calculate"
- Referrals: $[X]

**Close Rate:**
- Primary Remodeling: [X]%
- Restoration Division: [X]%
- Secondary Market: [X]%

**Gaps Identified:**
- [Channel] has poor attribution
- [Channel] CAC is above $1,500
- [Brand] conversion rate is low
```

---

## Success Criteria

**End of Month 2:**
- ✓ All digital ad sources flowing into HubSpot with accurate attribution
- ✓ Google Ads and Meta Ads connected
- ✓ UTM parameters standardized and applied

**End of Month 3:**
- ✓ Offline channels trackable (billboards, mailers, referrals)
- ✓ First baseline CAC report by channel completed

**End of Month 4:**
- ✓ Weekly dashboard live and shared with leadership
- ✓ Monthly reporting cadence established
- ✓ Know exactly where you are and what needs to change

---

## Common Pitfalls

1. **Not completing HubSpot setup before launching new campaigns**
   - Fix: Pause new campaigns until tracking is live

2. **Inconsistent UTM usage across team**
   - Fix: Create UTM builder tool, train team, audit monthly

3. **Forgetting to tag offline leads**
   - Fix: Add to intake process, automate where possible

4. **Not sending offline conversions back to Google Ads**
   - Fix: Set up workflow, test with sample data

5. **Dashboard exists but nobody looks at it**
   - Fix: Weekly review in Revenue Team meeting

---

## Next Steps

Once attribution is working:
- **Month 7:** Channel performance audit (see which channels to scale)
- **Month 8:** Budget reallocation based on CAC data
- **Months 8-12:** Conversion rate optimization, A/B testing

**See:** [Optimization Framework](06-optimization-framework) for what to do after attribution is fixed

---

*Attribution is the foundation. Get this right, and every other marketing decision becomes data-driven instead of guesswork.*

