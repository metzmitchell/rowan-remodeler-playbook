---
title: "CRM Pipelines Setup"
description: "Template for configuring deal pipelines for remodeling companies with multiple brands, markets, or service lines."
tags: ["systems", "crm", "pipelines", "active"]
last_updated: "2025-01-01"
---

# CRM Pipelines Setup

**Timeline:** Months 2-3  
**Owner:** Marketing Lead (Configuration), Sales Lead (Sales Process Input)

**Why separate pipelines:** Each brand, market, or service line may have different sales processes, timelines, and close rates. Track them separately for accurate forecasting.

---

## Pipeline Structure Options

Choose the structure that fits your business:

### Option A: Single Pipeline (Simpler)
Best for: Single brand, single market, consistent service offerings

### Option B: Multi-Pipeline (Recommended for growth)
Best for: Multiple brands, multiple markets, or distinct service lines (e.g., remodeling + restoration)

---

## Example Multi-Pipeline Structure

### Pipeline 1: Primary Remodeling

**Focus:** Kitchen, bathroom, whole-home remodels in your primary market

**Deal Stages:**

1. **Suspect** (New Lead)
   - Probability: 10%
   - Description: Inquiry received, not yet qualified
   - Action: Initial response, qualify via phone/email

2. **Qualified Lead**
   - Probability: 20%
   - Description: Budget confirmed, timeline realistic, in service area
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

**Typical metrics:** Adjust based on your business
- Average Deal Size: $50,000-$100,000
- Average Sales Cycle: 45-60 days

---

### Pipeline 2: Restoration/Insurance Work (If Applicable)

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

**Typical metrics:**
- Average Deal Size: $40,000-$80,000
- Average Sales Cycle: 30-45 days (faster due to urgency)

---

### Pipeline 3: Expansion Market (If Applicable)

**Focus:** New market with lower brand awareness

**Key differences from primary market:**
- Qualification more aggressive (brand awareness lower)
- Include extra Assignment Selling content early (more education needed)
- Lower probability percentages initially
- Track separately to measure market penetration

**Typical metrics:**
- Average Sales Cycle: 60-75 days (longer in new market)
- Close rate improves as brand awareness grows

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
- `Sales Notes` (long text): Notes on objections, concerns, preferences

---

## Automated Workflows

### Essential Workflows

**1. New Lead → Assign & Notify**
- Trigger: Deal enters "Suspect" stage
- Actions:
  - Assign deal to Sales Lead
  - Send email notification
  - Create task: "Qualify lead within 24 hours"

**2. Consultation Scheduled → Send Assignment Selling Content**
- Trigger: Deal moves to "Consultation Scheduled"
- Actions:
  - Send email sequence with:
    - Process video ("What to Expect")
    - Pricing guide
    - Team bio video
  - Create task: "Review content consumption before consultation"

**3. Proposal Sent → Follow-Up Reminder**
- Trigger: Deal moves to "Proposal Sent"
- Actions:
  - Wait 48 hours
  - Create task: "Follow up on proposal"
  - Send homeowner email: "Questions about your proposal?"

**4. Closed Won → Hand Off to Production**
- Trigger: Deal marked "Closed Won"
- Actions:
  - Notify project management team
  - Create project folder in shared drive
  - Send offline conversion to ad platforms (for attribution)

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

---

## Setup Instructions

### Step 1: Create Pipelines in CRM

1. Navigate to pipeline settings
2. Create pipeline with your brand/market name
3. Add deal stages (as listed above)
4. Set probability % for each stage
5. Repeat for additional pipelines if needed

### Step 2: Configure Deal Properties

1. Navigate to deal property settings
2. Create custom properties (listed above)
3. Make required fields mandatory for stage progression

### Step 3: Set Up Automation Workflows

1. Create workflows based on templates above
2. Test with sample deals before going live

### Step 4: Train Sales Team

- Walk through each pipeline
- Practice moving deals between stages
- Review automation triggers and what happens at each stage
- Establish weekly pipeline review cadence

---

## Common Questions

**Q: Why not use one pipeline for all brands/markets?**
A: Each brand/market may have different close rates, timelines, and processes. Separate pipelines provide accurate forecasting.

**Q: Can a deal move between pipelines?**
A: Rarely. If an inquiry changes type, create a new deal in the correct pipeline.

**Q: What if close rates improve in a new market?**
A: Update stage probabilities quarterly based on actual data.

---

## Next Steps

Once pipelines are live:
- Month 3-4: Establish weekly pipeline review meeting
- Month 6: Audit stage probabilities vs. actual close rates
- Month 12: Refine stages based on one year of data

**See:** [Handoffs and Follow-Up](05-handoffs-and-follow-up) for sales/marketing alignment

---

*Separate pipelines by brand/market = accurate forecasting. Track what's different, optimize what matters.*
