# Brown & Brown Insurance – In-Flight Quotes Workspace
## Microsoft Dynamics 365 Solution

> **Solution Name:** `BnBInFlightQuotes` · **Version:** 1.0.0  
> **Publisher:** Brown & Brown Insurance · `customization_prefix: bnb`

---

## Overview

The **In-Flight Quotes Workspace** is a Dynamics 365 web resource solution that gives producers, account executives, and sales leaders a **single pane of glass** for every open quote across all carriers and business segments.

### Key Capabilities

| Capability | Description |
|---|---|
| **Unified Quote Grid** | All open quotes across 7 business lines and all carrier sources in one filterable view |
| **SLA Timers & Alerts** | Per-segment SLA rules with color-coded countdown, daily breach detection, and escalation emails |
| **Stalled Quote Detection** | Automatic "Stalled" flagging when quotes exceed inactivity thresholds by segment |
| **Competitive Analysis** | Carrier-vs-carrier pricing, hit ratios, AM Best ratings, turnaround benchmarks |
| **Hit Ratio Dashboard** | By segment, producer, carrier, and product with quarterly trend and Q2 forecast |
| **Power Automate Automation** | Three production-ready flows: SLA breach alerts, stalled detection, monthly snapshots |

### Business Segments in Scope

1. Personal Lines  
2. P&C Small Commercial  
3. P&C Mid-Market Commercial  
4. P&C Large Commercial  
5. Employee Benefits  
6. Dealer Services  
7. Surety / Bonds

### Data Sources

AMS360 · Sagitta · BenefitPoint · EPIC · Carrier Portals · Email Ingestion · Submission Logs

---

## Repository Structure

```
dynamics-solution/
├── [Content_Types].xml           – Solution package MIME types
├── solution.xml                  – Solution manifest (publisher, components)
├── Entities/
│   └── customizations.xml        – All 5 Dataverse table definitions
├── WebResources/
│   ├── bnb_inflight_quotes_main.html  – Main workspace UI (web resource)
│   ├── bnb_inflight_quotes.js         – Business logic & Dataverse access
│   ├── bnb_inflight_quotes.css        – Styles (B&B brand colors)
│   └── bnb_sample_data.js             – Fake B&B demo data (60 quotes, 15 producers, 12 carriers)
└── Workflows/
    ├── sla_breach_alert_flow.json          – Daily SLA breach alert (PA flow)
    ├── stalled_quote_detection_flow.json   – Daily stalled detection (PA flow)
    └── hit_ratio_monthly_snapshot_flow.json – Monthly hit ratio snapshot (PA flow)
```

---

## Prerequisites

| Requirement | Details |
|---|---|
| Dynamics 365 | Customer Engagement (Sales) **or** Power Platform (with Dataverse) |
| License | Power Apps per-app or per-user plan |
| Roles | System Customizer (import), System Administrator (security roles) |
| Power Automate | Per-flow or per-user plan for the three automation flows |
| Browser | Edge, Chrome, or Firefox (for the web resource) |

---

## Step-by-Step Deployment

### Step 1 – Package the Solution

The solution is provided as source files. To create an importable `.zip`:

```bash
# Option A: Use the Power Platform CLI
pac solution pack --zipfile BnBInFlightQuotes_1.0.0.zip --folder ./dynamics-solution

# Option B: Manual zip (Windows/Mac)
# Zip the contents of /dynamics-solution/ (not the folder itself)
# The zip root must contain solution.xml and [Content_Types].xml
```

> **Tip:** Install the Power Platform CLI:  
> `npm install -g @microsoft/powerplatform-cli`

### Step 2 – Import into Dynamics 365

1. Navigate to **Settings → Solutions** (or **make.powerapps.com → Solutions**).
2. Click **Import Solution**.
3. Upload `BnBInFlightQuotes_1.0.0.zip`.
4. Accept defaults and click **Import**. Wait ~2 minutes.

### Step 3 – Publish Web Resources

After import:

1. **Settings → Customizations → Publish All Customizations** (or click the Publish button in the solution).
2. Verify the three web resources appear under  
   `bnb_/inflight/` in the Web Resources grid.

### Step 4 – Add to App Navigation

In the **Model-Driven App Designer**:

1. Open your sales app (or create a new one named "B&B Producer Workspace").
2. In the **Sitemap**, add a new **Subarea** under the Sales group:
   - **Type:** Web Resource  
   - **URL:** `$webresource:bnb_/inflight/bnb_inflight_quotes_main.html`  
   - **Title:** In-Flight Quotes  
   - **Icon:** `WebResources/bnb_quotes_icon.svg` (optional)
3. Save and publish the app.

### Step 5 – Configure Security Roles

Create or update the following security roles:

| Role | Access |
|---|---|
| **BnB Producer** | Read/Write `bnb_inflightquote`, Read `bnb_carrier`, `bnb_hitratio` |
| **BnB Sales Leader** | Full access all `bnb_*` tables |
| **BnB Segment Lead** | Read all, Write own segment's quotes |

Apply roles at **Settings → Security → Security Roles**.

### Step 6 – Configure SLA Rules

Populate the `bnb_sla_rule` table with your segment thresholds:

| Segment | Response SLA | Stalled Threshold | Escalation Email |
|---|---|---|---|
| Personal Lines | 3 days | 10 days | sales-se@bbins.com |
| P&C Small Commercial | 5 days | 14 days | sales-se@bbins.com |
| P&C Mid-Market Commercial | 10 days | 21 days | sales-leaders@bbins.com |
| P&C Large Commercial | 14 days | 30 days | sales-leaders@bbins.com |
| Employee Benefits | 10 days | 21 days | eb-leaders@bbins.com |
| Dealer Services | 5 days | 14 days | dealer-svcs@bbins.com |
| Surety / Bonds | 7 days | 21 days | surety@bbins.com |

### Step 7 – Import Power Automate Flows

1. In **Power Automate** (make.powerautomate.com), click **Import → Import Package**.
2. Upload each JSON flow from `Workflows/`:
   - `sla_breach_alert_flow.json`
   - `stalled_quote_detection_flow.json`
   - `hit_ratio_monthly_snapshot_flow.json`
3. For each flow:
   - Connect your **Dataverse** connection (must have System User access).
   - Connect your **Office 365 Outlook** connection (for email alerts).
   - Update the `SALES_LEADER_EMAIL` and `TEAMS_WEBHOOK_URL` variables.
   - Replace `YOUR_ORG` in email body links with your org's Dynamics URL.
4. Turn each flow **ON**.

### Step 8 – Data Integration (AMS360 / EPIC / Sagitta)

In production, populate `bnb_inflightquote` records via:

**Option A – Power Automate API Integration (Recommended)**  
- Build a Power Automate flow triggered by AMS360/Sagitta webhooks.
- Map source fields to `bnb_inflightquote` columns using the field reference below.

**Option B – Azure Logic Apps with SQL Connector**  
- Connect to AMS360 SQL database → transform → upsert to Dataverse.

**Option C – Dataverse Dataflows (Power Query)**  
- Use the built-in Dataverse Dataflows to pull from OData or SQL sources.

**Option D – Demo / Testing Mode**  
- The workspace auto-detects if `Xrm.WebApi` is unavailable and falls back to `bnb_sample_data.js`.
- 60 fake B&B quotes, 15 producers, 12 carriers, and 28 hit-ratio snapshots are included.

---

## Dataverse Table Reference

### `bnb_inflightquote` — Key Fields

| Column | Type | Description |
|---|---|---|
| `bnb_name` | Text | Quote number (e.g., Q-2024-00301) |
| `bnb_account_name` | Text | Insured / account name |
| `bnb_producer_name` | Text | Producer full name |
| `bnb_producercode` | Text | Producer code (links to CRM user) |
| `bnb_business_segment` | Choice | Segment (Personal Lines … Surety) |
| `bnb_product_type` | Text | Product (BOP, GL, Workers Comp, etc.) |
| `bnb_quote_status` | Choice | Status (Open, Submitted, Bound, etc.) |
| `bnb_carrier_name` | Text | Primary carrier |
| `bnb_quoted_premium` | Currency | Most recent quoted premium |
| `bnb_expiring_premium` | Currency | Prior policy premium |
| `bnb_bound_premium` | Currency | Bound premium (if won) |
| `bnb_submission_date` | Date | Date submitted to carrier |
| `bnb_sla_due_date` | Date | Computed SLA deadline |
| `bnb_sla_breached` | Yes/No | Set to Yes by daily flow |
| `bnb_days_open` | Integer | Updated daily by recurrence flow |
| `bnb_competitor_carriers` | Text | Comma-sep list of competing carriers |
| `bnb_source_system` | Choice | AMS360, Sagitta, BenefitPoint, EPIC, etc. |
| `bnb_branch_office` | Text | Office location |
| `bnb_region` | Text | Geographic region |
| `bnb_notes` | Memo | Producer notes |
| `bnb_win_loss_reason` | Text | Why won/lost |

---

## AI / GenAI Extension Points

The workspace is designed to be extended with Copilot Studio (formerly PVA) or Azure OpenAI:

### 1. AI Quote Summary (Copilot Sidecar)
Build a **Copilot Studio** bot that:
- Accepts a quote ID as input.
- Retrieves `bnb_inflightquote` via Dataverse action.
- Calls **Azure OpenAI GPT-4o** to generate a 3-sentence executive summary.
- Displays the summary in the detail panel alongside the quote record.

### 2. Win/Loss Reason Classification
Add an **Azure AI Language** custom classifier triggered on `bnb_quote_status` change to "Lost":
- Reads `bnb_notes` and `bnb_win_loss_reason`.
- Classifies into standard categories: Price, Coverage Gap, Relationship, Carrier Appetite, Timeline.
- Writes the category back to a `bnb_win_loss_category` field.

### 3. Competitive Premium Benchmark
Use **Azure Machine Learning** or a **Power Automate + OpenAI prompt** to:
- Given a quote's segment, region, and coverage type, call carrier APIs or a trained benchmark model.
- Predict a competitive market rate and display it in the carrier comparison panel.

### 4. Stalled Quote Recommended Action
In the stalled-quote email, append an AI-generated next-best-action:
- Prompt: *"Given quote {ID} for {Account} in {Segment}, open {N} days, last note: {Notes} — recommend the single most impactful outreach action for the producer."*
- Uses `text-davinci-003` or `gpt-4o-mini` via Azure OpenAI in the Power Automate flow.

### 5. Hit Ratio Forecast (ML)
Replace the static Q2 forecast in the Analytics tab with a **real-time Power BI embedded** report or an **Azure ML inference endpoint** that:
- Inputs: current pipeline size, segment mix, carrier appetite, producer performance.
- Output: predicted hit ratio and premium bound for the next 90 days.

---

## Sample Data Summary (Demo Mode)

| Data Set | Count | Details |
|---|---|---|
| Carriers | 12 | Hartford, Travelers, Chubb, Liberty Mutual, Nationwide, Berkley One, Employers, Zurich, CNA, Tokio Marine, Anthem/BCBS, Zurich Surety |
| Producers | 15 | Across Atlanta, Tampa, Dallas, Chicago, Denver, Charlotte, Irvine, Seattle, NY, Nashville, Phoenix, Houston, Boston, Orlando, Minneapolis |
| In-Flight Quotes | 60 | All 7 segments · statuses: open, submitted, received, presented, bound, lost, stalled |
| Hit Ratio Snapshots | 28 | By segment (7), by producer (7), by carrier (8), trend Q2 2025–Q2 2026 (5) forecast (1) |
| SLA Rules | 7 | One per business segment |

---

## Browser Testing (Standalone)

To preview the workspace without Dynamics:

```bash
# From the /dynamics-solution/WebResources/ directory:
npx serve .
# Then open http://localhost:3000/bnb_inflight_quotes_main.html
```

The page auto-detects the absence of `Xrm` and loads sample data from `bnb_sample_data.js`.

---

## Roadmap / Future Enhancements

- [ ] Power BI embedded dashboard (deeper analytics, drill-through)
- [ ] Copilot Studio chatbot integration (AI quote Q&A)
- [ ] AMS360 → Dataverse real-time webhook connector
- [ ] Sagitta / BenefitPoint scheduled sync via Azure Logic Apps
- [ ] Mobile-responsive PWA wrapper for field producers
- [ ] Carrier portal direct submission via API (Hartford API, Travelers API)
- [ ] Commission tracking (`bnb_commission` table) with forecasting
- [ ] Submission checklist (`bnb_submission_checklist` table) per segment

---

## Support

**Internal IT:** dynamics-support@bbins.com  
**Solution Owner:** Technology & Innovation Team, Brown & Brown Insurance  
**Power Platform Environment:** contact your Dynamics 365 Administrator for environment URLs.
