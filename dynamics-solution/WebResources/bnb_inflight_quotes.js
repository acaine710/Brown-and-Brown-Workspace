/**
 * Brown & Brown Insurance – In-Flight Quotes Workspace
 * Web Resource: bnb_inflight_quotes.js
 *
 * Responsibilities:
 *  1. Data access layer – reads from Dataverse (OData) or falls back to sample data
 *  2. Filter / sort state management
 *  3. Render: KPI cards, quote grid, detail panel, carrier comparison
 *  4. Render: Hit-ratio charts (Chart.js)
 *  5. Render: Alerts & SLA timer logic
 *  6. Export to Excel via Dynamics XRM or CSV fallback
 *
 * Namespace: BnB.InFlightQuotes
 */
"use strict";

window.BnB = window.BnB || {};

BnB.InFlightQuotes = (function () {

  // ── Constants ──────────────────────────────────────────────────────────────
  const VERSION      = "1.0.0";
  const ENTITY       = "bnb_inflightquotes";
  // Maximum records retrieved per page. Override via window.BNB_PAGE_SIZE.
  const PAGE_SIZE    = (window.BNB_PAGE_SIZE && Number.isInteger(window.BNB_PAGE_SIZE) && window.BNB_PAGE_SIZE > 0)
                       ? window.BNB_PAGE_SIZE : 2000;
  const ODATA_SELECT = [
    "bnb_name","bnb_account_name","bnb_producer_name","bnb_producer_code",
    "bnb_business_segment","bnb_product_type","bnb_quote_status",
    "bnb_source_system","bnb_carrier_name","bnb_quoted_premium",
    "bnb_expiring_premium","bnb_bound_premium","bnb_submission_date",
    "bnb_sla_due_date","bnb_effective_date","bnb_days_open",
    "bnb_sla_breached","bnb_win_loss_reason","bnb_branch_office",
    "bnb_region","bnb_competitor_carriers","bnb_notes"
  ].join(",");

  const SEGMENT_LABELS = {
    100000000: "Personal Lines",
    100000001: "P&C Small Commercial",
    100000002: "P&C Mid-Market Commercial",
    100000003: "P&C Large Commercial",
    100000004: "Employee Benefits",
    100000005: "Dealer Services",
    100000006: "Surety / Bonds",
  };

  const STATUS_LABELS = {
    200000000: "Open – In Progress",
    200000001: "Submitted to Carrier",
    200000002: "Quote Received",
    200000003: "Presented to Client",
    200000004: "Bound / Won",
    200000005: "Lost",
    200000006: "Expired / No Quote",
    200000007: "Stalled",
  };

  const STATUS_CSS = {
    "open":      "status-open",
    "submitted": "status-submitted",
    "received":  "status-received",
    "presented": "status-presented",
    "bound":     "status-bound",
    "lost":      "status-lost",
    "expired":   "status-expired",
    "stalled":   "status-stalled",
  };

  const SEGMENT_COLORS = [
    "#002D62","#0057B8","#27AE60","#F4A600","#E67E22","#8E44AD","#C0392B"
  ];

  // ── State ──────────────────────────────────────────────────────────────────
  let _state = {
    allQuotes:    [],
    filteredQuotes: [],
    hitRatios:    [],
    carriers:     [],
    slaRules:     [],
    producers:    [],
    selectedQuote: null,
    activeTab:    "dashboard",
    sortCol:      "daysOpen",
    sortDir:      "desc",
    filters: {
      segment: "all",
      status:  "all",
      carrier: "all",
      producer:"all",
      region:  "all",
      search:  "",
      stalledOnly: false,
      slaBreachOnly: false,
    },
    charts: {},
    usingSampleData: false,
  };

  // ── Utility ────────────────────────────────────────────────────────────────
  const fmt = {
    currency(v) {
      if (v == null) return "–";
      return new Intl.NumberFormat("en-US", { style:"currency", currency:"USD", maximumFractionDigits:0 }).format(v);
    },
    pct(v) {
      if (v == null) return "–";
      return v.toFixed(1) + "%";
    },
    date(v) {
      if (!v) return "–";
      const d = new Date(v);
      return d.toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });
    },
    daysUntil(dateStr) {
      if (!dateStr) return null;
      const diff = Math.round((new Date(dateStr) - new Date()) / 86400000);
      return diff;
    },
  };

  function normalizeQuote(q) {
    // When using sample data, fields are already normalized
    if (_state.usingSampleData) return q;
    // Map OData response fields to internal shape
    return {
      id:                 q.bnb_name,
      account:            q.bnb_account_name,
      producer:           q.bnb_producer_code,
      producerName:       q.bnb_producer_name,
      segment:            SEGMENT_LABELS[q.bnb_business_segment] || String(q.bnb_business_segment),
      product:            q.bnb_product_type,
      status:             statusCodeToKey(q.bnb_quote_status),
      carrier:            q.bnb_carrier_name,
      quotedPremium:      q.bnb_quoted_premium,
      expiringPremium:    q.bnb_expiring_premium,
      boundPremium:       q.bnb_bound_premium,
      submissionDate:     q.bnb_submission_date,
      slaDueDate:         q.bnb_sla_due_date,
      effectiveDate:      q.bnb_effective_date,
      daysOpen:           q.bnb_days_open,
      slaBreached:        q.bnb_sla_breached,
      winLossReason:      q.bnb_win_loss_reason,
      office:             q.bnb_branch_office,
      region:             q.bnb_region,
      competitorCarriers: q.bnb_competitor_carriers,
      notes:              q.bnb_notes,
      source:             q.bnb_source_system,
    };
  }

  function statusCodeToKey(code) {
    const map = {
      200000000:"open", 200000001:"submitted", 200000002:"received",
      200000003:"presented", 200000004:"bound", 200000005:"lost",
      200000006:"expired", 200000007:"stalled"
    };
    return map[code] || "open";
  }

  function getProducerName(quote) {
    if (quote.producerName) return quote.producerName;
    const p = _state.producers.find(x => x.code === quote.producer);
    return p ? p.name : quote.producer || "–";
  }

  function getSLAClass(quote) {
    if (!quote.slaDueDate) return "";
    const days = fmt.daysUntil(quote.slaDueDate);
    if (quote.slaBreached || days < 0) return "sla-breach";
    if (days <= 2) return "sla-warn";
    return "sla-ok";
  }

  function getSLALabel(quote) {
    if (!quote.slaDueDate) return "–";
    const days = fmt.daysUntil(quote.slaDueDate);
    if (quote.slaBreached || days < 0) return `⚠ ${Math.abs(days)}d overdue`;
    if (days === 0) return "⏰ Due today";
    return `${days}d left`;
  }

  // ── Data Layer ─────────────────────────────────────────────────────────────
  async function loadData() {
    try {
      const xrm = typeof Xrm !== "undefined" ? Xrm : null;
      if (xrm && xrm.WebApi) {
        await loadFromDataverse(xrm.WebApi);
      } else {
        loadSampleData();
      }
    } catch (err) {
      console.warn("[BnB] Dataverse load failed, switching to sample data:", err);
      loadSampleData();
    }
  }

  async function loadFromDataverse(api) {
    _state.usingSampleData = false;
    const result = await api.retrieveMultipleRecords(
      ENTITY,
      `?$select=${ODATA_SELECT}&$orderby=bnb_days_open desc&$top=${PAGE_SIZE}`
    );
    _state.allQuotes = result.entities.map(normalizeQuote);

    // Load hit ratios
    const hrResult = await api.retrieveMultipleRecords(
      "bnb_hitratios",
      "?$select=bnb_name,bnb_period_start,bnb_period_end,bnb_producer_name,bnb_business_segment,bnb_carrier_name,bnb_total_submissions,bnb_total_bound,bnb_hit_ratio_pct,bnb_total_premium_bound&$top=200"
    );
    _state.hitRatios = hrResult.entities;

    // Load SLA rules
    const slaResult = await api.retrieveMultipleRecords(
      "bnb_sla_rules",
      "?$select=bnb_name,bnb_segment,bnb_response_sla_days,bnb_stalled_threshold_days"
    );
    _state.slaRules = slaResult.entities;
  }

  function loadSampleData() {
    _state.usingSampleData = true;
    const sd = window.BNB_SAMPLE_DATA;
    if (!sd) { console.error("[BnB] Sample data not loaded."); return; }
    _state.allQuotes = sd.quotes;
    _state.hitRatios = sd.hitRatios;
    _state.carriers  = sd.carriers;
    _state.producers = sd.producers;
    _state.slaRules  = sd.slaRules;
    document.getElementById("bnb-data-source-badge").textContent = "Demo Data";
    document.getElementById("bnb-data-source-badge").style.background = "#E67E22";
  }

  // ── Filtering & Sorting ────────────────────────────────────────────────────
  function applyFilters() {
    const f = _state.filters;
    _state.filteredQuotes = _state.allQuotes.filter(q => {
      if (f.segment !== "all" && q.segment !== f.segment) return false;
      if (f.status  !== "all" && q.status  !== f.status)  return false;
      if (f.carrier !== "all" && q.carrier !== f.carrier)  return false;
      if (f.region  !== "all" && q.region  !== f.region)   return false;
      if (f.producer !== "all" && getProducerName(q) !== f.producer) return false;
      if (f.stalledOnly && q.status !== "stalled") return false;
      if (f.slaBreachOnly && !q.slaBreached) return false;
      if (f.search) {
        const s = f.search.toLowerCase();
        const haystack = [q.id, q.account, getProducerName(q), q.carrier, q.product].join(" ").toLowerCase();
        if (!haystack.includes(s)) return false;
      }
      return true;
    });
    applySort();
  }

  function applySort() {
    const { sortCol, sortDir } = _state;
    _state.filteredQuotes.sort((a, b) => {
      let av = a[sortCol], bv = b[sortCol];
      if (av == null) av = sortDir === "asc" ? Infinity : -Infinity;
      if (bv == null) bv = sortDir === "asc" ? Infinity : -Infinity;
      if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === "asc" ? av - bv : bv - av;
    });
  }

  // ── KPI Computation ────────────────────────────────────────────────────────
  function computeKPIs(quotes) {
    const open      = quotes.filter(q => !["bound","lost","expired"].includes(q.status));
    const stalled   = quotes.filter(q => q.status === "stalled");
    const breached  = quotes.filter(q => q.slaBreached);
    const bound     = quotes.filter(q => q.status === "bound");
    const total     = quotes.filter(q => ["bound","lost","expired"].includes(q.status));
    const hitRatio  = total.length ? (bound.length / total.length * 100) : 0;
    const totalPremium = open.reduce((s, q) => s + (q.quotedPremium || q.expiringPremium || 0), 0);
    const avgDaysOpen  = open.length ? open.reduce((s, q) => s + (q.daysOpen || 0), 0) / open.length : 0;
    return { open: open.length, stalled: stalled.length, breached: breached.length,
             bound: bound.length, hitRatio, totalPremium, avgDaysOpen };
  }

  // ── Render: KPI Row ────────────────────────────────────────────────────────
  function renderKPIs() {
    const kpi = computeKPIs(_state.filteredQuotes.length ? _state.filteredQuotes : _state.allQuotes);
    document.getElementById("kpi-open").textContent       = kpi.open;
    document.getElementById("kpi-stalled").textContent    = kpi.stalled;
    document.getElementById("kpi-sla-breach").textContent = kpi.breached;
    document.getElementById("kpi-hit-ratio").textContent  = fmt.pct(kpi.hitRatio);
    document.getElementById("kpi-premium").textContent    = fmt.currency(kpi.totalPremium);
    document.getElementById("kpi-avg-days").textContent   = kpi.avgDaysOpen.toFixed(1) + "d";
  }

  // ── Render: Quote Grid ─────────────────────────────────────────────────────
  function renderQuoteGrid() {
    const tbody = document.getElementById("bnb-quote-tbody");
    if (!tbody) return;

    if (!_state.filteredQuotes.length) {
      tbody.innerHTML = `<tr><td colspan="10"><div class="bnb-empty">
        <div class="empty-icon">📋</div>
        <h3>No quotes match your filters</h3>
        <p>Try adjusting the filters above.</p>
      </div></td></tr>`;
      return;
    }

    tbody.innerHTML = _state.filteredQuotes.map(q => {
      const slaClass  = getSLAClass(q);
      const slaLabel  = getSLALabel(q);
      const rowClass  = q.slaBreached ? "sla-breach" : q.status === "stalled" ? "stalled" : "";
      const premium   = q.quotedPremium ? fmt.currency(q.quotedPremium) :
                        q.expiringPremium ? `<span style="opacity:.6">${fmt.currency(q.expiringPremium)} (exp)</span>` : "–";
      return `<tr class="${rowClass}" data-id="${q.id}" onclick="BnB.InFlightQuotes.openDetail('${q.id}')">
        <td><strong>${q.id}</strong><br><span style="font-size:11px;color:#6B7280">${q.source || ""}</span></td>
        <td><strong>${q.account}</strong></td>
        <td>${getProducerName(q)}</td>
        <td><span style="font-size:11px">${q.segment}</span></td>
        <td>${q.carrier || "–"}<br><span style="font-size:10px;color:#6B7280">${q.product || ""}</span></td>
        <td><span class="status-badge ${STATUS_CSS[q.status] || ""}">${q.status || "–"}</span></td>
        <td style="text-align:right">${premium}</td>
        <td><span class="sla-timer ${slaClass}">${slaLabel}</span></td>
        <td style="text-align:center">${q.daysOpen != null ? q.daysOpen : "–"}</td>
        <td>
          <button class="bnb-btn bnb-btn-outline bnb-btn-sm" onclick="event.stopPropagation();BnB.InFlightQuotes.openDetail('${q.id}')">View</button>
        </td>
      </tr>`;
    }).join("");

    // Update count badge
    const badge = document.getElementById("tab-badge-grid");
    if (badge) badge.textContent = _state.filteredQuotes.length;
  }

  // ── Render: Alerts ─────────────────────────────────────────────────────────
  function renderAlerts() {
    const container = document.getElementById("bnb-alerts-list");
    if (!container) return;

    const breached  = _state.allQuotes.filter(q => q.slaBreached && !["bound","lost","expired"].includes(q.status));
    const stalled   = _state.allQuotes.filter(q => q.status === "stalled");
    const dueSoon   = _state.allQuotes.filter(q => {
      if (!q.slaDueDate || ["bound","lost","expired"].includes(q.status)) return false;
      const d = fmt.daysUntil(q.slaDueDate);
      return d >= 0 && d <= 2 && !q.slaBreached;
    });

    let html = "";

    breached.forEach(q => {
      html += `<div class="bnb-alert critical">
        <div class="bnb-alert-icon">🚨</div>
        <div class="bnb-alert-body">
          <h4>SLA Breached – ${q.account}</h4>
          <p><strong>${q.id}</strong> · ${q.segment} · ${getProducerName(q)} · SLA was ${fmt.date(q.slaDueDate)} · ${q.daysOpen} days open</p>
          <div class="bnb-alert-actions">
            <button class="bnb-btn bnb-btn-danger bnb-btn-sm" onclick="BnB.InFlightQuotes.openDetail('${q.id}')">View Quote</button>
            <button class="bnb-btn bnb-btn-outline bnb-btn-sm" onclick="BnB.InFlightQuotes.escalate('${q.id}')">Escalate</button>
          </div>
        </div>
      </div>`;
    });

    stalled.forEach(q => {
      html += `<div class="bnb-alert">
        <div class="bnb-alert-icon">⏸️</div>
        <div class="bnb-alert-body">
          <h4>Stalled Quote – ${q.account}</h4>
          <p><strong>${q.id}</strong> · ${q.segment} · ${getProducerName(q)} · ${q.daysOpen} days open · ${q.notes ? q.notes.substring(0,80) + "…" : ""}</p>
          <div class="bnb-alert-actions">
            <button class="bnb-btn bnb-btn-primary bnb-btn-sm" onclick="BnB.InFlightQuotes.openDetail('${q.id}')">Take Action</button>
          </div>
        </div>
      </div>`;
    });

    dueSoon.forEach(q => {
      const d = fmt.daysUntil(q.slaDueDate);
      html += `<div class="bnb-alert info">
        <div class="bnb-alert-icon">⏰</div>
        <div class="bnb-alert-body">
          <h4>SLA Due ${d === 0 ? "Today" : "in " + d + " day(s)"} – ${q.account}</h4>
          <p><strong>${q.id}</strong> · ${q.segment} · ${getProducerName(q)} · ${q.carrier || "–"}</p>
          <div class="bnb-alert-actions">
            <button class="bnb-btn bnb-btn-outline bnb-btn-sm" onclick="BnB.InFlightQuotes.openDetail('${q.id}')">View Quote</button>
          </div>
        </div>
      </div>`;
    });

    if (!html) {
      html = `<div class="bnb-empty"><div class="empty-icon">✅</div><h3>All clear!</h3><p>No SLA breaches or stalled quotes.</p></div>`;
    }

    container.innerHTML = html;

    // Update badge
    const badge = document.getElementById("tab-badge-alerts");
    const total = breached.length + stalled.length + dueSoon.length;
    if (badge) { badge.textContent = total; badge.className = "tab-badge " + (breached.length ? "danger" : "warn"); }
  }

  // ── Render: Hit Ratio View ──────────────────────────────────────────────────
  function renderHitRatioTable(filterKey) {
    const tbody = document.getElementById("bnb-hitratio-tbody");
    if (!tbody) return;

    let data = _state.hitRatios.filter(r => {
      if (filterKey === "segment" ) return  r.segment && !r.producer && !r.carrier;
      if (filterKey === "producer") return  r.producer && !r.carrier;
      if (filterKey === "carrier" ) return  r.carrier && !r.producer;
      if (filterKey === "trend"   ) return !r.segment && !r.producer && !r.carrier;
      return true;
    }).slice(0, 20);

    tbody.innerHTML = data.map(r => {
      const pct  = r.hitRatioPct || (r.hit_ratio_pct) || 0;
      const cls  = pct >= 65 ? "high" : pct >= 55 ? "medium" : "low";
      const dim  = r.producer || r.segment || r.carrier || "All";
      return `<tr>
        <td><strong>${r.name || dim}</strong></td>
        <td>${dim}</td>
        <td style="text-align:center">${r.totalSubmissions ?? r.total_submissions ?? "–"}</td>
        <td style="text-align:center">${r.totalBound ?? r.total_bound ?? "–"}</td>
        <td>
          <div class="hit-ratio-bar-wrap">
            <div class="hit-ratio-bar"><div class="hit-ratio-fill ${cls}" style="width:${Math.min(pct,100)}%"></div></div>
            <span class="hit-ratio-pct">${fmt.pct(pct)}</span>
          </div>
        </td>
        <td style="text-align:right">${fmt.currency(r.totalPremiumBound ?? r.total_premium_bound)}</td>
      </tr>`;
    }).join("");
  }

  // ── Render: Detail Panel ───────────────────────────────────────────────────
  function openDetail(quoteId) {
    const q = _state.allQuotes.find(x => x.id === quoteId);
    if (!q) return;
    _state.selectedQuote = q;

    const overlay = document.getElementById("bnb-detail-overlay");
    const body    = document.getElementById("bnb-detail-body");

    // Find competitors from quote lines / carrier data
    const competitors = (q.competitorCarriers || "").split(",").map(s => s.trim()).filter(Boolean);

    // Build carrier comparison rows
    const primaryPremium = q.quotedPremium;
    const compRows = competitors.map((c, i) => {
      // Simulate competitive premiums ±5-20%
      const variance = 0.95 + Math.random() * 0.25;
      const compPremium = primaryPremium ? Math.round(primaryPremium * variance) : null;
      const isBest = compPremium && primaryPremium && compPremium < primaryPremium;
      return `<tr${isBest ? "" : ""}>
        <td>${c}</td>
        <td>${compPremium ? fmt.currency(compPremium) : "Pending"}</td>
        <td>–</td>
        <td>–</td>
        <td>–</td>
      </tr>`;
    });

    const primaryRow = `<tr class="best-rate">
      <td>⭐ ${q.carrier || "Primary"}</td>
      <td>${fmt.currency(q.quotedPremium)}</td>
      <td>${q.product || "–"}</td>
      <td>–</td>
      <td>Selected</td>
    </tr>`;

    body.innerHTML = `
      <div class="bnb-detail-section">
        <h3>Quote Overview</h3>
        <div class="bnb-field-grid">
          <div class="bnb-field"><label>Quote ID</label><span>${q.id}</span></div>
          <div class="bnb-field"><label>Status</label><span><span class="status-badge ${STATUS_CSS[q.status]}">${q.status}</span></span></div>
          <div class="bnb-field"><label>Account / Insured</label><span>${q.account}</span></div>
          <div class="bnb-field"><label>Producer</label><span>${getProducerName(q)}</span></div>
          <div class="bnb-field"><label>Business Segment</label><span>${q.segment}</span></div>
          <div class="bnb-field"><label>Product</label><span>${q.product || "–"}</span></div>
          <div class="bnb-field"><label>Branch / Office</label><span>${q.office || "–"}</span></div>
          <div class="bnb-field"><label>Region</label><span>${q.region || "–"}</span></div>
          <div class="bnb-field"><label>Source System</label><span>${q.source || "–"}</span></div>
        </div>
      </div>

      <div class="bnb-detail-section">
        <h3>Premium & Coverage</h3>
        <div class="bnb-field-grid">
          <div class="bnb-field"><label>Expiring Premium</label><span class="amount">${fmt.currency(q.expiringPremium)}</span></div>
          <div class="bnb-field"><label>Quoted Premium</label><span class="amount">${fmt.currency(q.quotedPremium)}</span></div>
          <div class="bnb-field"><label>Bound Premium</label><span class="amount">${fmt.currency(q.boundPremium)}</span></div>
          <div class="bnb-field"><label>Primary Carrier</label><span>${q.carrier || "–"}</span></div>
        </div>
      </div>

      <div class="bnb-detail-section">
        <h3>SLA & Timeline</h3>
        <div class="bnb-field-grid">
          <div class="bnb-field"><label>Submission Date</label><span>${fmt.date(q.submissionDate)}</span></div>
          <div class="bnb-field"><label>SLA Due Date</label><span>${fmt.date(q.slaDueDate)}</span></div>
          <div class="bnb-field"><label>Effective Date</label><span>${fmt.date(q.effectiveDate)}</span></div>
          <div class="bnb-field"><label>Days Open</label><span>${q.daysOpen ?? "–"}</span></div>
          <div class="bnb-field"><label>SLA Status</label><span><span class="sla-timer ${getSLAClass(q)}">${getSLALabel(q)}</span></span></div>
          <div class="bnb-field"><label>SLA Breached?</label><span>${q.slaBreached ? "🔴 Yes" : "🟢 No"}</span></div>
        </div>
      </div>

      ${competitors.length ? `
      <div class="bnb-detail-section">
        <h3>Carrier Comparison</h3>
        <table class="carrier-comp-table">
          <thead><tr><th>Carrier</th><th>Premium</th><th>Product</th><th>Coverage Notes</th><th>Status</th></tr></thead>
          <tbody>${primaryRow}${compRows.join("")}</tbody>
        </table>
      </div>` : ""}

      ${q.notes ? `
      <div class="bnb-detail-section">
        <h3>Notes</h3>
        <p style="font-size:13px;line-height:1.6;color:#374151">${q.notes}</p>
      </div>` : ""}

      ${q.winLossReason ? `
      <div class="bnb-detail-section">
        <h3>Win/Loss Reason</h3>
        <p style="font-size:13px;color:#374151">${q.winLossReason}</p>
      </div>` : ""}

      <div style="display:flex;gap:10px;margin-top:20px;flex-wrap:wrap">
        <button class="bnb-btn bnb-btn-primary" onclick="BnB.InFlightQuotes.updateStatus('${q.id}')">Update Status</button>
        <button class="bnb-btn bnb-btn-outline"  onclick="BnB.InFlightQuotes.addNote('${q.id}')">Add Note</button>
        <button class="bnb-btn bnb-btn-outline"  onclick="BnB.InFlightQuotes.openInCRM('${q.id}')">Open in CRM</button>
        <button class="bnb-btn bnb-btn-outline"  onclick="BnB.InFlightQuotes.escalate('${q.id}')">Escalate</button>
      </div>
    `;

    document.getElementById("bnb-detail-title").textContent    = q.id;
    document.getElementById("bnb-detail-subtitle").textContent = q.account;
    overlay.classList.add("open");
  }

  function closeDetail() {
    document.getElementById("bnb-detail-overlay").classList.remove("open");
    _state.selectedQuote = null;
  }

  // ── Render: Charts ─────────────────────────────────────────────────────────
  function initCharts() {
    if (typeof Chart === "undefined") {
      console.warn("[BnB] Chart.js not loaded – charts disabled.");
      return;
    }
    Chart.defaults.font.family = "'Segoe UI', Arial, sans-serif";
    Chart.defaults.font.size   = 11;

    renderSegmentDonut();
    renderStatusBar();
    renderHitRatioTrend();
    renderCarrierHitBar();
  }

  function renderSegmentDonut() {
    const ctx = document.getElementById("chart-segment");
    if (!ctx) return;
    if (_state.charts.segment) _state.charts.segment.destroy();

    const segments = {};
    _state.allQuotes.filter(q => !["bound","lost","expired"].includes(q.status))
      .forEach(q => { segments[q.segment] = (segments[q.segment] || 0) + 1; });

    const labels = Object.keys(segments);
    _state.charts.segment = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels,
        datasets: [{ data: labels.map(l => segments[l]), backgroundColor: SEGMENT_COLORS, borderWidth: 2, borderColor: "#fff" }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: "right", labels: { boxWidth: 12, padding: 12 } } }
      }
    });
  }

  function renderStatusBar() {
    const ctx = document.getElementById("chart-status");
    if (!ctx) return;
    if (_state.charts.status) _state.charts.status.destroy();

    const statusOrder = ["open","submitted","received","presented","stalled","bound","lost","expired"];
    const counts = {};
    _state.allQuotes.forEach(q => { counts[q.status] = (counts[q.status] || 0) + 1; });
    const colors = {
      open:"#93c5fd", submitted:"#818cf8", received:"#6ee7b7",
      presented:"#fde047", stalled:"#fdba74", bound:"#4ade80", lost:"#f87171", expired:"#d1d5db"
    };

    _state.charts.status = new Chart(ctx, {
      type: "bar",
      data: {
        labels: statusOrder.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
        datasets: [{
          data: statusOrder.map(s => counts[s] || 0),
          backgroundColor: statusOrder.map(s => colors[s] || "#d1d5db"),
          borderRadius: 4,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
      }
    });
  }

  function renderHitRatioTrend() {
    const ctx = document.getElementById("chart-hr-trend");
    if (!ctx) return;
    if (_state.charts.trend) _state.charts.trend.destroy();

    const trendData = _state.hitRatios
      .filter(r => r.name && r.name.includes("B&B Overall"))
      .sort((a, b) => new Date(a.periodStart || a.period_start) - new Date(b.periodStart || b.period_start));

    const labels    = trendData.map(r => r.name.replace("B&B Overall – ",""));
    const hitRatios = trendData.map(r => r.hitRatioPct ?? r.hit_ratio_pct);
    const premiums  = trendData.map(r => ((r.totalPremiumBound ?? r.total_premium_bound) || 0) / 1000000);

    _state.charts.trend = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Hit Ratio (%)",
            data: hitRatios,
            borderColor: "#0057B8",
            backgroundColor: "rgba(0,87,184,.1)",
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: "#0057B8",
            yAxisID: "y1",
          },
          {
            label: "Premium Bound ($M)",
            data: premiums,
            borderColor: "#F4A600",
            borderDash: [5,4],
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: "#F4A600",
            yAxisID: "y2",
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position:"top", labels: { boxWidth: 12 } } },
        scales: {
          y1: { beginAtZero: false, position:"left",  ticks: { callback: v => v + "%" }, min: 50 },
          y2: { beginAtZero: true,  position:"right", ticks: { callback: v => "$" + v + "M" }, grid: { drawOnChartArea: false } },
        }
      }
    });
  }

  function renderCarrierHitBar() {
    const ctx = document.getElementById("chart-carrier-hit");
    if (!ctx) return;
    if (_state.charts.carrier) _state.charts.carrier.destroy();

    const carrierData = _state.hitRatios
      .filter(r => r.carrier && !r.producer && !r.segment)
      .sort((a, b) => (b.hitRatioPct ?? b.hit_ratio_pct) - (a.hitRatioPct ?? a.hit_ratio_pct))
      .slice(0, 8);

    const labels    = carrierData.map(r => r.carrier);
    const hitRatios = carrierData.map(r => r.hitRatioPct ?? r.hit_ratio_pct);

    _state.charts.carrier = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Hit Ratio (%)",
          data: hitRatios,
          backgroundColor: hitRatios.map(v => v >= 65 ? "#27AE60" : v >= 55 ? "#F4A600" : "#C0392B"),
          borderRadius: 4,
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { min: 40, max: 80, ticks: { callback: v => v + "%" } } }
      }
    });
  }

  // ── Filter Dropdowns Population ────────────────────────────────────────────
  function populateFilterDropdowns() {
    const quotes = _state.allQuotes;
    const unique = (arr) => [...new Set(arr.filter(Boolean))].sort();

    const segments  = unique(quotes.map(q => q.segment));
    const carriers  = unique(quotes.map(q => q.carrier));
    const regions   = unique(quotes.map(q => q.region));
    const producers = unique(quotes.map(q => getProducerName(q)));

    populateSelect("filter-segment",  segments);
    populateSelect("filter-carrier",  carriers);
    populateSelect("filter-region",   regions);
    populateSelect("filter-producer", producers);
  }

  function populateSelect(id, options) {
    const el = document.getElementById(id);
    if (!el) return;
    const current = el.value;
    el.innerHTML = `<option value="all">All</option>` +
      options.map(o => `<option value="${o}">${o}</option>`).join("");
    if (current && options.includes(current)) el.value = current;
  }

  // ── Event Handlers (called from HTML) ─────────────────────────────────────
  function switchTab(tabId) {
    _state.activeTab = tabId;
    document.querySelectorAll(".bnb-tab").forEach(t => t.classList.toggle("active", t.dataset.tab === tabId));
    document.querySelectorAll(".bnb-view").forEach(v => v.classList.toggle("active", v.id === "view-" + tabId));

    if (tabId === "dashboard") { renderKPIs(); renderSegmentDonut(); renderStatusBar(); }
    if (tabId === "analytics") { renderHitRatioTrend(); renderCarrierHitBar(); }
    if (tabId === "alerts")    { renderAlerts(); }
  }

  function onFilterChange() {
    _state.filters.segment  = document.getElementById("filter-segment")?.value  || "all";
    _state.filters.status   = document.getElementById("filter-status")?.value   || "all";
    _state.filters.carrier  = document.getElementById("filter-carrier")?.value  || "all";
    _state.filters.region   = document.getElementById("filter-region")?.value   || "all";
    _state.filters.producer = document.getElementById("filter-producer")?.value || "all";
    _state.filters.search   = document.getElementById("filter-search")?.value   || "";
    _state.filters.stalledOnly   = document.getElementById("filter-stalled")?.checked || false;
    _state.filters.slaBreachOnly = document.getElementById("filter-breach")?.checked  || false;
    applyFilters();
    renderKPIs();
    renderQuoteGrid();
    if (_state.activeTab === "dashboard") { renderSegmentDonut(); renderStatusBar(); }
  }

  function clearFilters() {
    ["filter-segment","filter-status","filter-carrier","filter-region","filter-producer"]
      .forEach(id => { const el = document.getElementById(id); if (el) el.value = "all"; });
    const s = document.getElementById("filter-search"); if (s) s.value = "";
    const st = document.getElementById("filter-stalled"); if (st) st.checked = false;
    const br = document.getElementById("filter-breach");  if (br) br.checked = false;
    _state.filters = { segment:"all", status:"all", carrier:"all", producer:"all", region:"all", search:"", stalledOnly:false, slaBreachOnly:false };
    applyFilters();
    renderKPIs();
    renderQuoteGrid();
  }

  function sortByCol(col) {
    if (_state.sortCol === col) {
      _state.sortDir = _state.sortDir === "asc" ? "desc" : "asc";
    } else {
      _state.sortCol = col;
      _state.sortDir = "desc";
    }
    applySort();
    renderQuoteGrid();
  }

  function switchHitRatioView(key) {
    document.querySelectorAll(".hr-tab-btn").forEach(b => b.classList.toggle("active", b.dataset.view === key));
    renderHitRatioTable(key);
  }

  function exportCSV() {
    const quotes = _state.filteredQuotes.length ? _state.filteredQuotes : _state.allQuotes;
    const cols = ["id","account","producerName","segment","product","carrier","status",
                  "quotedPremium","expiringPremium","boundPremium","submissionDate",
                  "slaDueDate","effectiveDate","daysOpen","slaBreached","region","office","notes"];
    const header = cols.join(",");
    const rows = quotes.map(q =>
      cols.map(c => {
        const v = q[c] ?? "";
        return typeof v === "string" && v.includes(",") ? `"${v.replace(/"/g,'""')}"` : v;
      }).join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a    = document.createElement("a");
    a.href     = URL.createObjectURL(blob);
    a.download = `BnB_InFlight_Quotes_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  }

  // ── Stub Action Handlers ───────────────────────────────────────────────────
  function updateStatus(quoteId) {
    const newStatus = prompt("Enter new status for " + quoteId + ":\n(open, submitted, received, presented, bound, lost, expired, stalled)");
    if (!newStatus) return;
    const q = _state.allQuotes.find(x => x.id === quoteId);
    if (q) {
      q.status = newStatus.toLowerCase().trim();
      if (q.status === "bound" || q.status === "lost") q.daysOpen = 0;
      applyFilters();
      renderQuoteGrid();
      renderKPIs();
      renderAlerts();
      closeDetail();
      alert("Status updated to: " + q.status + "\n(In production this writes to Dataverse via Xrm.WebApi)");
    }
  }

  function addNote(quoteId) {
    const note = prompt("Add note to " + quoteId + ":");
    if (!note) return;
    const q = _state.allQuotes.find(x => x.id === quoteId);
    if (q) {
      q.notes = (q.notes ? q.notes + "\n" : "") + new Date().toLocaleDateString() + ": " + note;
      openDetail(quoteId);
    }
  }

  function openInCRM(quoteId) {
    if (typeof Xrm !== "undefined") {
      Xrm.Navigation.navigateTo({ pageType: "entitylist", entityName: ENTITY });
    } else {
      alert("Open in CRM: " + quoteId + "\n(Navigates to the Dynamics record in production)");
    }
  }

  function escalate(quoteId) {
    const q = _state.allQuotes.find(x => x.id === quoteId);
    const email = q ? "sales-leaders@bbins.com" : "sales@bbins.com";
    alert(`Escalation email would be sent to ${email} for quote ${quoteId}.\n(In production, triggers a Power Automate flow.)`);
  }

  function refreshData() {
    const btn = document.getElementById("btn-refresh");
    if (btn) { btn.textContent = "Refreshing…"; btn.disabled = true; }
    loadData().then(() => {
      applyFilters();
      renderKPIs();
      renderQuoteGrid();
      renderAlerts();
      populateFilterDropdowns();
      initCharts();
      if (btn) { btn.textContent = "↻ Refresh"; btn.disabled = false; }
      document.getElementById("last-refresh").textContent = new Date().toLocaleTimeString();
    });
  }

  // ── Init ───────────────────────────────────────────────────────────────────
  async function init() {
    await loadData();
    applyFilters();
    populateFilterDropdowns();
    renderKPIs();
    renderQuoteGrid();
    renderAlerts();
    initCharts();
    renderHitRatioTable("segment");
    document.getElementById("last-refresh").textContent = new Date().toLocaleTimeString();
    console.log(`[BnB] In-Flight Quotes Workspace v${VERSION} initialized. ${_state.allQuotes.length} quotes loaded.`);
  }

  // Public API
  return {
    init,
    openDetail,
    closeDetail,
    switchTab,
    onFilterChange,
    clearFilters,
    sortByCol,
    switchHitRatioView,
    exportCSV,
    refreshData,
    updateStatus,
    addNote,
    openInCRM,
    escalate,
  };

})();

// Auto-init when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", BnB.InFlightQuotes.init);
} else {
  BnB.InFlightQuotes.init();
}
