---
title: "HubSpot Pipelines Setup"
description: "Brand-specific deal pipelines for Asheville Remodeling, Asheville Restorations, and Greenville Remodeling."
tags: ["systems", "hubspot", "pipelines", "active"]
last_updated: "2025-01-01"
---

# HubSpot Pipelines Setup

**Timeline:** Months 2-3  
**Owner:** MM (Configuration), RJ (Sales Process Input)

**Why separate pipelines:** Each brand has different sales processes, timelines, and close rates. Track them separately for accurate forecasting.

---

## Three-Pipeline Structure

### Pipeline 1: Asheville Remodeling

**Focus:** Kitchen, bathroom, whole-home remodels in Western North Carolina

**Deal Stages:**

1. **Suspect** (New Lead)
   - Probability: 10%
   - Description: Inquiry received, not yet qualified
   - Action: Initial response, qualify via phone/email

2. **Qualified Lead**
   - Probability: 20%
   - Description: Budget confirmed ($50k+), timeline realistic, in service area
   - Action: Schedule in-home consultation

3. **Consultation Scheduled**
   - Probability: 40%
   - Description: Appointment on calendar
   - Action: Send Assignment Selling content (process video, pricing guide)

4. **Proposal Sent**
   - Probability: 60%
   - Description: Detailed proposal delivered
   - Action: Follow-up within 48 hours, address objections

5. **Negotiation/Review**
   - Probability: 75%
   - Description: Discussing terms, timeline, scope adjustments
   - Action: Finalize contract details

6. **Closed Won** ✅
   - Probability: 100%
   - Description: Contract signed, deposit received
   - Action: Hand off to project management

7. **Closed Lost** ❌
   - Probability: 0%
   - Description: Lost to competitor, budget, timing, or other reason
   - Action: Log lost reason, add to nurture campaign

**Average Deal Size:** $80,000  
**Average Sales Cycle:** 45-60 days

---

### Pipeline 2: Asheville Restorations

**Focus:** Storm damage, water damage, mold remediation (insurance-funded projects)

**Deal Stages:**

1. **Suspect** (Emergency Inquiry)
   - Probability: 15%
   - Description: Storm damage or emergency situation
   - Action: Rapid response (within 2 hours)

2. **Qualified Lead**
   - Probability: 25%
   - Description: Insurance claim viable, damage assessment complete
   - Action: Coordinate with insurance adjuster

3. **Consultation Scheduled**
   - Probability: 50%
   - Description: Site inspection scheduled
   - Action: Document damage, prepare scope

4. **Proposal Sent (to Homeowner + Adjuster)**
   - Probability: 65%
   - Description: Estimate submitted to insurance and homeowner
   - Action: Follow up with adjuster, address homeowner concerns

5. **Insurance Approved**
   - Probability: 80%
   - Description: Insurance claim approved, scope agreed
   - Action: Finalize contract with homeowner

6. **Closed Won** ✅
   - Probability: 100%
   - Description: Contract signed, work order issued
   - Action: Begin restoration work

7. **Closed Lost** ❌
   - Probability: 0%
   - Description: Insurance denied, homeowner chose DIY, competitor won
   - Action: Log reason, maintain relationship for future claims

**Average Deal Size:** $60,000  
**Average Sales Cycle:** 30-45 days (faster due to urgency)

---

### Pipeline 3: Greenville Remodeling

**Focus:** Expansion market - kitchen, bathroom, whole-home remodels in Greenville, SC

**Deal Stages:**

1. **Suspect** (New Market Lead)
   - Probability: 10%
   - Description: Inquiry from Greenville market
   - Action: Qualify aggressively (brand awareness lower in new market)

2. **Qualified Lead**
   - Probability: 20%
   - Description: Budget confirmed, timeline realistic, understands Semper Fi value
   - Action: Schedule consultation, emphasize reputation and process

3. **Consultation Scheduled**
   - Probability: 35%
   - Description: Appointment on calendar
   - Action: Send Assignment Selling content + case studies from AVL market

4. **Proposal Sent**
   - Probability: 55%
   - Description: Detailed proposal delivered
   - Action: Address "Why choose Semper Fi over local competitors?"

5. **Negotiation/Review**
   - Probability: 70%
   - Description: Discussing terms
   - Action: Leverage AVL testimonials, emphasize process

6. **Closed Won** ✅
   - Probability: 100%
   - Description: Contract signed
   - Action: Use as case study for future GVL marketing

7. **Closed Lost** ❌
   - Probability: 0%
   - Description: Lost to local competitor, brand unfamiliarity, budget
   - Action: Log reason, add to long-term nurture (GVL awareness building)

**Average Deal Size:** $75,000 (slightly lower than AVL while building market presence)  
**Average Sales Cycle:** 60-75 days (longer in new market)

---

## Deal Properties (All Pipelines)

### Required Deal Properties

**Financial:**
- `Project Value Estimate` (number): Initial estimate range
- `Final Contract Value` (number): Actual signed contract amount
- `Deposit Amount` (number): Upfront payment received

**Project Details:**
- `Project Type` (dropdown): Kitchen, Bathroom, Whole-Home, Storm Damage, etc.
- `Funding Source` (dropdown): Cash, Insurance, Financing, Mixed
- `Referral Partner Name` (text): If referred by designer, architect, realtor, adjuster

**Timeline:**
- `Consultation Date` (date): Scheduled or completed in-home visit
- `Proposal Sent Date` (date): When estimate was delivered
- `Expected Close Date` (date): Projected contract signing
- `Project Start Date` (date): Planned construction start

**Lead Source:**
- `Original Lead Source` (auto-populated from contact): First touch attribution
- `Lead Source Campaign` (text): Specific campaign/ad that generated lead

**Quality & Notes:**
- `Lead Quality Score` (dropdown): A (hot), B (warm), C (cold)
- `Lost Reason` (dropdown): Price, Timeline, Competitor, Not Ready, Other
- `Sales Notes` (long text): RJ's notes on objections, concerns, preferences

---

## Automated Workflows by Pipeline

### Asheville Remodeling Workflows

**1. New Lead → Assign & Notify**
- Trigger: Deal enters "Suspect" stage
- Actions:
  - Assign deal to RJ Craig
  - Send email notification to RJ
  - Create task: "Qualify lead within 24 hours"

**2. Consultation Scheduled → Send Assignment Selling Content**
- Trigger: Deal moves to "Consultation Scheduled"
- Actions:
  - Send email sequence with:
    - Process video ("What to Expect: Kitchen Remodel")
    - Pricing guide
    - Team bio video
  - Create task for RJ: "Review content consumption before consultation"

**3. Proposal Sent → Follow-Up Reminder**
- Trigger: Deal moves to "Proposal Sent"
- Actions:
  - Wait 48 hours
  - Create task for RJ: "Follow up on proposal"
  - Send homeowner email: "Questions about your proposal?"

**4. Closed Won → Hand Off to Production**
- Trigger: Deal marked "Closed Won"
- Actions:
  - Notify project management team
  - Create project folder in shared drive
  - Send offline conversion to Google Ads (for attribution)

### Asheville Restorations Workflows

**1. Emergency Lead → Rapid Response**
- Trigger: Deal enters pipeline (restoration)
- Actions:
  - High-priority notification to RJ (SMS + email)
  - Auto-reply to homeowner: "Emergency response team notified"
  - Create task: "Respond within 2 hours"

**2. Insurance Approved → Contract Prep**
- Trigger: Deal moves to "Insurance Approved"
- Actions:
  - Send contract template to RJ
  - Notify homeowner: "Insurance approved, let's finalize"
  - Create task: "Finalize contract within 3 days"

### Greenville Remodeling Workflows

**1. New GVL Lead → Qualify Aggressively**
- Trigger: Deal enters "Suspect" (Greenville)
- Actions:
  - Assign to [GVL Sales Rep]
  - Send assignment selling content immediately (brand awareness lower)
  - Create task: "Qualify within 12 hours (new market)"

**2. Closed Won → Case Study Trigger**
- Trigger: Deal marked "Closed Won" (Greenville)
- Actions:
  - Notify MM (marketing): "New GVL project for case study"
  - Tag deal: "GVL Case Study Candidate"
  - Schedule follow-up for testimonial video request

---

## Reporting by Pipeline

### Weekly Sales Meeting Reports

**For each pipeline, track:**
- New deals added this week
- Deals moved to "Consultation Scheduled"
- Deals moved to "Proposal Sent"
- Deals won/lost this week
- Average time in each stage

### Monthly Pipeline Health

**Metrics to review:**
- Win rate by pipeline (won deals ÷ total closed deals)
- Average deal size by pipeline
- Average sales cycle length
- Lost reasons (top 3 per pipeline)
- Pipeline value (weighted by probability)

**Target:** 40+ leads/month total across all three pipelines, 25-35% close rate

---

## Setup Instructions

### Step 1: Create Pipelines in HubSpot

1. Navigate to: Settings > Objects > Deals > Pipelines
2. Click "Create Pipeline"
3. Name: "Asheville Remodeling"
4. Add deal stages (as listed above)
5. Set probability % for each stage
6. Repeat for "Asheville Restorations" and "Greenville Remodeling"

### Step 2: Configure Deal Properties

1. Navigate to: Settings > Properties > Deal Properties
2. Create custom properties (listed above)
3. Make required fields mandatory for stage progression

### Step 3: Set Up Automation Workflows

1. Navigate to: Automation > Workflows
2. Create workflows (as listed above)
3. Test with sample deals before going live

### Step 4: Train Sales Team

- Walk RJ through each pipeline
- Practice moving deals between stages
- Review automation triggers and what happens at each stage
- Establish weekly pipeline review cadence

---

## Common Questions

**Q: Why not use one pipeline for all brands?**
A: Each brand has different close rates, timelines, and processes. Separate pipelines provide accurate forecasting.

**Q: Can a deal move between pipelines?**
A: Rarely. If a remodeling inquiry turns into a restoration project, create a new deal in the correct pipeline.

**Q: How do we handle deals with multiple project types (e.g., kitchen + bathroom)?**
A: Use the primary project type for categorization, note secondary work in Sales Notes field.

**Q: What if Greenville close rates improve?**
A: Update stage probabilities quarterly based on actual data.

---

## Next Steps

Once pipelines are live:
- Month 3-4: Establish weekly pipeline review meeting
- Month 6: Audit stage probabilities vs. actual close rates
- Month 12: Refine stages based on one year of data

**See:** [Handoffs and Follow-Up](05-handoffs-and-follow-up) for sales/marketing alignment

---

*Separate pipelines by brand = accurate forecasting. Track what's different, optimize what matters.*




