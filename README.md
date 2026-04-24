# Brown & Brown Insurance – In-Flight Quotes Workspace (Dynamics 365)

A production-ready Microsoft Dynamics 365 solution that gives Brown & Brown Insurance producers a **single pane of glass** for every open quote across all carriers and business segments.

## What's Inside

| Folder | Contents |
|---|---|
| `dynamics-solution/` | Complete Dynamics 365 solution package |
| `dynamics-solution/Entities/` | 5 Dataverse table definitions (quotes, carriers, hit ratios, SLA rules, quote lines) |
| `dynamics-solution/WebResources/` | Full HTML/JS/CSS workspace UI + fake B&B sample data (60 quotes, 15 producers, 12 carriers) |
| `dynamics-solution/Workflows/` | 3 Power Automate flow templates (SLA alerts, stalled detection, monthly hit-ratio snapshots) |

## Quick Start

```bash
# Preview standalone (no Dynamics required – uses sample data)
cd dynamics-solution/WebResources
npx serve .
# Open http://localhost:3000/bnb_inflight_quotes_main.html
```

See [`dynamics-solution/README.md`](dynamics-solution/README.md) for full deployment instructions.

## Features

- 📊 **Dashboard** – KPI cards, segment/status charts, longest-open quotes
- 📋 **Quote Grid** – All open quotes filterable by segment, carrier, producer, region, SLA status
- 🚨 **Alerts & SLA** – Color-coded SLA timers, stalled alerts, escalation buttons
- 📈 **Hit Ratio Analytics** – Trend charts, by-segment/producer/carrier breakdown, Q2 forecast
- ⚖️ **Competitive Analysis** – Carrier scorecard, win/loss rates, appetite map
- 🤖 **AI Extension Points** – Copilot Studio, Azure OpenAI, ML forecast hooks documented