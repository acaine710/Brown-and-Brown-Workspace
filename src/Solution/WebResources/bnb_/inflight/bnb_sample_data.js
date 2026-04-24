/**
 * Brown & Brown Insurance – In-Flight Quotes Workspace
 * Fake / Demo Sample Data
 * Loaded by the web resource when Dynamics data is unavailable (dev/demo mode).
 *
 * Contains:
 *  - BNB_CARRIERS      – 12 major carrier records
 *  - BNB_PRODUCERS     – 15 B&B producers across offices
 *  - BNB_QUOTES        – 60 in-flight quote records across all 7 segments
 *  - BNB_HIT_RATIOS    – 28 hit-ratio snapshot rows
 *  - BNB_SLA_RULES     – 7 SLA rules (one per segment)
 */

// ─── CARRIERS ────────────────────────────────────────────────────────────────
const BNB_CARRIERS = [
  { id: "C001", name: "The Hartford",           naic: "29424", amBest: "A+",  avgTurnaround: 3,  preferred: true,  portal: "https://agents.thehartford.com",       segments: ["P&C Small Commercial","P&C Mid-Market Commercial","Employee Benefits"] },
  { id: "C002", name: "Travelers",              naic: "25658", amBest: "A+",  avgTurnaround: 4,  preferred: true,  portal: "https://travelers.com/agents",         segments: ["P&C Small Commercial","P&C Mid-Market Commercial","P&C Large Commercial"] },
  { id: "C003", name: "Chubb",                  naic: "20281", amBest: "A++", avgTurnaround: 5,  preferred: true,  portal: "https://agents.chubb.com",             segments: ["P&C Large Commercial","P&C Mid-Market Commercial","Personal Lines"] },
  { id: "C004", name: "Liberty Mutual",         naic: "23043", amBest: "A",   avgTurnaround: 4,  preferred: true,  portal: "https://agents.libertymutual.com",     segments: ["P&C Small Commercial","Personal Lines","Dealer Services"] },
  { id: "C005", name: "Nationwide",             naic: "23787", amBest: "A+",  avgTurnaround: 3,  preferred: false, portal: "https://nationwide.com/agents",         segments: ["P&C Small Commercial","Personal Lines","Dealer Services"] },
  { id: "C006", name: "Berkley One",            naic: "34363", amBest: "A+",  avgTurnaround: 6,  preferred: false, portal: "https://berkleyone.com",               segments: ["Personal Lines"] },
  { id: "C007", name: "Employers Holdings",     naic: "31127", amBest: "A-",  avgTurnaround: 2,  preferred: false, portal: "https://employers.com/agents",         segments: ["P&C Small Commercial"] },
  { id: "C008", name: "Zurich North America",   naic: "16535", amBest: "A+",  avgTurnaround: 7,  preferred: true,  portal: "https://zurichna.com",                segments: ["P&C Large Commercial","P&C Mid-Market Commercial"] },
  { id: "C009", name: "CNA Financial",          naic: "20443", amBest: "A",   avgTurnaround: 5,  preferred: true,  portal: "https://cna.com/agent",               segments: ["P&C Mid-Market Commercial","P&C Large Commercial","Employee Benefits"] },
  { id: "C010", name: "Tokio Marine HCC",       naic: "25402", amBest: "A++", avgTurnaround: 6,  preferred: false, portal: "https://tmhcc.com",                   segments: ["Surety / Bonds","P&C Large Commercial"] },
  { id: "C011", name: "Anthem / BCBS",          naic: "60052", amBest: "A",   avgTurnaround: 7,  preferred: true,  portal: "https://anthembroker.com",            segments: ["Employee Benefits"] },
  { id: "C012", name: "Zurich Surety",          naic: "16535", amBest: "A+",  avgTurnaround: 5,  preferred: true,  portal: "https://zurichna.com/surety",         segments: ["Surety / Bonds"] },
];

// ─── PRODUCERS ────────────────────────────────────────────────────────────────
const BNB_PRODUCERS = [
  { code: "P001", name: "Alex Rivera",       office: "Tampa, FL",        region: "Southeast", segment: "P&C Mid-Market Commercial",   ytdSubmissions: 42, ytdBound: 27 },
  { code: "P002", name: "Jordan Holt",       office: "Atlanta, GA",      region: "Southeast", segment: "P&C Small Commercial",         ytdSubmissions: 68, ytdBound: 39 },
  { code: "P003", name: "Morgan Ellis",      office: "Dallas, TX",        region: "South Central", segment: "P&C Large Commercial",    ytdSubmissions: 21, ytdBound: 11 },
  { code: "P004", name: "Taylor Nguyen",     office: "Chicago, IL",       region: "Midwest",   segment: "Employee Benefits",           ytdSubmissions: 55, ytdBound: 34 },
  { code: "P005", name: "Jamie Larson",      office: "Denver, CO",        region: "Mountain",  segment: "Personal Lines",              ytdSubmissions: 90, ytdBound: 63 },
  { code: "P006", name: "Casey Patel",       office: "Charlotte, NC",     region: "Southeast", segment: "P&C Mid-Market Commercial",   ytdSubmissions: 33, ytdBound: 18 },
  { code: "P007", name: "Drew Simmons",      office: "Irvine, CA",        region: "West",      segment: "Dealer Services",             ytdSubmissions: 29, ytdBound: 19 },
  { code: "P008", name: "Quinn Barrett",     office: "Seattle, WA",       region: "West",      segment: "Surety / Bonds",              ytdSubmissions: 18, ytdBound: 12 },
  { code: "P009", name: "Sam Kowalski",      office: "New York, NY",      region: "Northeast", segment: "P&C Large Commercial",        ytdSubmissions: 15, ytdBound: 7  },
  { code: "P010", name: "Avery Thompson",    office: "Nashville, TN",     region: "Southeast", segment: "Employee Benefits",           ytdSubmissions: 48, ytdBound: 31 },
  { code: "P011", name: "Riley Foster",      office: "Phoenix, AZ",       region: "West",      segment: "P&C Small Commercial",        ytdSubmissions: 74, ytdBound: 47 },
  { code: "P012", name: "Dana Cruz",         office: "Houston, TX",       region: "South Central", segment: "P&C Mid-Market Commercial", ytdSubmissions: 38, ytdBound: 22 },
  { code: "P013", name: "Skyler Nguyen",     office: "Boston, MA",        region: "Northeast", segment: "Employee Benefits",           ytdSubmissions: 27, ytdBound: 17 },
  { code: "P014", name: "Parker Reed",       office: "Orlando, FL",       region: "Southeast", segment: "Personal Lines",              ytdSubmissions: 112, ytdBound: 78 },
  { code: "P015", name: "Finley Grant",      office: "Minneapolis, MN",   region: "Midwest",   segment: "Surety / Bonds",              ytdSubmissions: 14, ytdBound: 9  },
];

// ─── IN-FLIGHT QUOTES ─────────────────────────────────────────────────────────
// Status codes: "open", "submitted", "received", "presented", "bound", "lost", "expired", "stalled"
const BNB_QUOTES = [
  // ── PERSONAL LINES ──────────────────────────────────────────────────────────
  {
    id:"Q-2024-00101", account:"Martinez Family Trust",       producer:"P005", segment:"Personal Lines",
    carrier:"C003", product:"HO-3 Homeowners",    status:"received",  quotedPremium:4120,  expiringPremium:3850,
    submissionDate:"2026-03-28", slaDueDate:"2026-04-04", effectiveDate:"2026-05-01",
    daysOpen:26, slaBreached:false, office:"Denver, CO", region:"Mountain",
    competitorCarriers:"Nationwide,Liberty Mutual",
    notes:"Client requesting higher jewelry rider. Chubb response is +7% vs expiring.",
    source:"EPIC"
  },
  {
    id:"Q-2024-00102", account:"Johnson, Robert & Linda",     producer:"P014", segment:"Personal Lines",
    carrier:"C004", product:"Personal Auto Bundle",   status:"stalled",   quotedPremium:2890,  expiringPremium:2750,
    submissionDate:"2026-03-10", slaDueDate:"2026-03-17", effectiveDate:"2026-04-15",
    daysOpen:44, slaBreached:true, office:"Orlando, FL", region:"Southeast",
    competitorCarriers:"GEICO,Progressive",
    notes:"Client has not responded to calls or emails since 3/12. Stalled alert sent.",
    source:"AMS360"
  },
  {
    id:"Q-2024-00103", account:"Chen, Wei",                    producer:"P014", segment:"Personal Lines",
    carrier:"C005", product:"Umbrella",              status:"presented",  quotedPremium:750,   expiringPremium:700,
    submissionDate:"2026-04-05", slaDueDate:"2026-04-12", effectiveDate:"2026-05-15",
    daysOpen:18, slaBreached:false, office:"Orlando, FL", region:"Southeast",
    competitorCarriers:"Chubb",
    notes:"Nationwide umbrella competitive at $750/$1M. Following up Friday.",
    source:"AMS360"
  },
  {
    id:"Q-2024-00104", account:"O'Brien, Patrick",             producer:"P005", segment:"Personal Lines",
    carrier:"C006", product:"High-Value Home",       status:"open",      quotedPremium:null,  expiringPremium:6100,
    submissionDate:"2026-04-15", slaDueDate:"2026-04-22", effectiveDate:"2026-06-01",
    daysOpen:8, slaBreached:false, office:"Denver, CO", region:"Mountain",
    competitorCarriers:"AIG Private Client",
    notes:"Berkley One requested 3-yr loss runs. Sent 4/16.",
    source:"EPIC"
  },
  {
    id:"Q-2024-00105", account:"Ramirez, Sofia",               producer:"P014", segment:"Personal Lines",
    carrier:"C004", product:"HO-5 Homeowners",      status:"bound",     quotedPremium:3340,  expiringPremium:3100, boundPremium:3340,
    submissionDate:"2026-03-01", slaDueDate:"2026-03-08", effectiveDate:"2026-04-01",
    daysOpen:0, slaBreached:false, office:"Orlando, FL", region:"Southeast",
    competitorCarriers:"State Farm",
    notes:"BOUND 3/25. Liberty Mutual won. Client retained.",
    source:"AMS360"
  },

  // ── P&C SMALL COMMERCIAL ────────────────────────────────────────────────────
  {
    id:"Q-2024-00201", account:"Sunrise Bakery LLC",            producer:"P002", segment:"P&C Small Commercial",
    carrier:"C001", product:"BOP",                  status:"received",  quotedPremium:8450,  expiringPremium:7900,
    submissionDate:"2026-04-01", slaDueDate:"2026-04-06", effectiveDate:"2026-05-01",
    daysOpen:22, slaBreached:false, office:"Atlanta, GA", region:"Southeast",
    competitorCarriers:"Travelers,Nationwide",
    notes:"Hartford BOP competitive. Waiting on client decision by 4/28.",
    source:"AMS360"
  },
  {
    id:"Q-2024-00202", account:"Greenfield Landscaping Co",     producer:"P011", segment:"P&C Small Commercial",
    carrier:"C005", product:"GL + Workers Comp",    status:"stalled",   quotedPremium:12300, expiringPremium:11800,
    submissionDate:"2026-03-18", slaDueDate:"2026-03-25", effectiveDate:"2026-04-15",
    daysOpen:36, slaBreached:true, office:"Phoenix, AZ", region:"West",
    competitorCarriers:"Employers Holdings",
    notes:"Owner traveling. Assistant unresponsive. Escalated to Sales Leader.",
    source:"AMS360"
  },
  {
    id:"Q-2024-00203", account:"Apex Plumbing Services Inc",    producer:"P002", segment:"P&C Small Commercial",
    carrier:"C007", product:"Workers Comp",         status:"submitted", quotedPremium:null,  expiringPremium:9200,
    submissionDate:"2026-04-18", slaDueDate:"2026-04-21", effectiveDate:"2026-05-01",
    daysOpen:5, slaBreached:false, office:"Atlanta, GA", region:"Southeast",
    competitorCarriers:"Travelers",
    notes:"Employers turnaround expected within 2 business days.",
    source:"EPIC"
  },
  {
    id:"Q-2024-00204", account:"Blue Ridge Auto Repair",         producer:"P011", segment:"P&C Small Commercial",
    carrier:"C004", product:"BOP",                  status:"lost",      quotedPremium:6800,  expiringPremium:6400,
    submissionDate:"2026-02-20", slaDueDate:"2026-02-27", effectiveDate:"2026-03-15",
    daysOpen:0, slaBreached:false, office:"Phoenix, AZ", region:"West",
    competitorCarriers:"State Farm",
    notes:"Lost to State Farm – lower premium by $400. Client cited agent relationship.",
    source:"AMS360"
  },
  {
    id:"Q-2024-00205", account:"Coastal Yoga Studio",            producer:"P002", segment:"P&C Small Commercial",
    carrier:"C001", product:"BOP + Cyber",          status:"presented",  quotedPremium:4200,  expiringPremium:3900,
    submissionDate:"2026-04-08", slaDueDate:"2026-04-15", effectiveDate:"2026-05-15",
    daysOpen:15, slaBreached:false, office:"Atlanta, GA", region:"Southeast",
    competitorCarriers:"Nationwide",
    notes:"Added cyber endorsement per client request. Decision expected EOW.",
    source:"AMS360"
  },
  {
    id:"Q-2024-00206", account:"Summit Tech Staffing LLC",       producer:"P011", segment:"P&C Small Commercial",
    carrier:"C007", product:"GL + WC + EPL",        status:"open",      quotedPremium:null,  expiringPremium:14500,
    submissionDate:"2026-04-20", slaDueDate:"2026-04-24", effectiveDate:"2026-05-01",
    daysOpen:3, slaBreached:false, office:"Phoenix, AZ", region:"West",
    competitorCarriers:"Liberty Mutual",
    notes:"Complex staffing class. Underwriter reviewing payroll detail.",
    source:"EPIC"
  },

  // ── P&C MID-MARKET COMMERCIAL ───────────────────────────────────────────────
  {
    id:"Q-2024-00301", account:"Keystone Manufacturing Corp",   producer:"P001", segment:"P&C Mid-Market Commercial",
    carrier:"C002", product:"GL + Property + WC",   status:"received",  quotedPremium:87500, expiringPremium:81000,
    submissionDate:"2026-03-25", slaDueDate:"2026-04-04", effectiveDate:"2026-05-01",
    daysOpen:29, slaBreached:false, office:"Tampa, FL", region:"Southeast",
    competitorCarriers:"Zurich North America,CNA Financial",
    notes:"Travelers came in at $87.5K vs Zurich $93K and CNA $91K. Presenting Monday.",
    source:"AMS360"
  },
  {
    id:"Q-2024-00302", account:"Pinnacle Real Estate Partners",  producer:"P006", segment:"P&C Mid-Market Commercial",
    carrier:"C009", product:"Property + Crime",     status:"stalled",   quotedPremium:52000, expiringPremium:48500,
    submissionDate:"2026-03-14", slaDueDate:"2026-03-21", effectiveDate:"2026-04-01",
    daysOpen:40, slaBreached:true, office:"Charlotte, NC", region:"Southeast",
    competitorCarriers:"Travelers",
    notes:"Client CFO changed – new contact not engaged. Casey escalating today.",
    source:"Sagitta"
  },
  {
    id:"Q-2024-00303", account:"NovaCare Health Systems",        producer:"P001", segment:"P&C Mid-Market Commercial",
    carrier:"C009", product:"Healthcare GL + D&O",  status:"submitted", quotedPremium:null,  expiringPremium:105000,
    submissionDate:"2026-04-16", slaDueDate:"2026-04-23", effectiveDate:"2026-06-01",
    daysOpen:7, slaBreached:false, office:"Tampa, FL", region:"Southeast",
    competitorCarriers:"Chubb,Zurich North America",
    notes:"Submission included 5-year loss runs and OSHA log. CNA reviewing.",
    source:"EPIC"
  },
  {
    id:"Q-2024-00304", account:"Harbor Freight Logistics Inc",   producer:"P012", segment:"P&C Mid-Market Commercial",
    carrier:"C002", product:"Cargo + Property",     status:"presented",  quotedPremium:68000, expiringPremium:64000,
    submissionDate:"2026-04-02", slaDueDate:"2026-04-09", effectiveDate:"2026-05-01",
    daysOpen:21, slaBreached:false, office:"Houston, TX", region:"South Central",
    competitorCarriers:"Chubb",
    notes:"Travelers favorable on cargo class. Client comparing coverage breadth.",
    source:"AMS360"
  },
  {
    id:"Q-2024-00305", account:"Meridian Hospitality Group",     producer:"P006", segment:"P&C Mid-Market Commercial",
    carrier:"C003", product:"Hotel Package",        status:"bound",     quotedPremium:125000,expiringPremium:118000, boundPremium:122000,
    submissionDate:"2026-02-28", slaDueDate:"2026-03-07", effectiveDate:"2026-04-01",
    daysOpen:0, slaBreached:false, office:"Charlotte, NC", region:"Southeast",
    competitorCarriers:"Zurich North America",
    notes:"BOUND 3/30 at $122K. Chubb negotiated $3K discount. Client pleased.",
    source:"Sagitta"
  },
  {
    id:"Q-2024-00306", account:"Cardinal Distributors LLC",      producer:"P012", segment:"P&C Mid-Market Commercial",
    carrier:"C008", product:"Property + Inland Marine", status:"open",  quotedPremium:null,  expiringPremium:73000,
    submissionDate:"2026-04-19", slaDueDate:"2026-04-26", effectiveDate:"2026-05-15",
    daysOpen:4, slaBreached:false, office:"Houston, TX", region:"South Central",
    competitorCarriers:"Travelers,CNA Financial",
    notes:"Zurich reviewing large schedule of equipment. Values statement sent.",
    source:"AMS360"
  },

  // ── P&C LARGE COMMERCIAL ────────────────────────────────────────────────────
  {
    id:"Q-2024-00401", account:"Titan Aerospace Industries",     producer:"P003", segment:"P&C Large Commercial",
    carrier:"C008", product:"Property + GL + Aviation", status:"submitted", quotedPremium:null, expiringPremium:485000,
    submissionDate:"2026-04-10", slaDueDate:"2026-04-24", effectiveDate:"2026-07-01",
    daysOpen:13, slaBreached:false, office:"Dallas, TX", region:"South Central",
    competitorCarriers:"Chubb,AIG",
    notes:"Zurich capacity up to $250M TIV. Aviation endorsement requires separate underwriter sign-off.",
    source:"Sagitta"
  },
  {
    id:"Q-2024-00402", account:"Westbrook Energy Partners LP",   producer:"P009", segment:"P&C Large Commercial",
    carrier:"C002", product:"E&P Liability + Control of Well", status:"open", quotedPremium:null, expiringPremium:620000,
    submissionDate:"2026-04-17", slaDueDate:"2026-05-01", effectiveDate:"2026-07-01",
    daysOpen:6, slaBreached:false, office:"New York, NY", region:"Northeast",
    competitorCarriers:"Zurich North America,Tokio Marine HCC",
    notes:"Awaiting engineer's report on well control exposures.",
    source:"Submission Log"
  },
  {
    id:"Q-2024-00403", account:"Granite Construction Holdings",  producer:"P003", segment:"P&C Large Commercial",
    carrier:"C003", product:"Wrap-Up (OCIP)",       status:"received",  quotedPremium:1240000,expiringPremium:1180000,
    submissionDate:"2026-03-20", slaDueDate:"2026-04-03", effectiveDate:"2026-06-01",
    daysOpen:34, slaBreached:false, office:"Dallas, TX", region:"South Central",
    competitorCarriers:"Zurich North America,Travelers",
    notes:"Chubb OCIP quote received 4/10. Competitive vs prior year. Finalist meeting 4/30.",
    source:"Sagitta"
  },
  {
    id:"Q-2024-00404", account:"Pacific Rim Container Corp",     producer:"P009", segment:"P&C Large Commercial",
    carrier:"C008", product:"Marine + Property",    status:"stalled",   quotedPremium:395000,expiringPremium:370000,
    submissionDate:"2026-03-05", slaDueDate:"2026-03-19", effectiveDate:"2026-05-01",
    daysOpen:49, slaBreached:true, office:"New York, NY", region:"Northeast",
    competitorCarriers:"CNA Financial,Tokio Marine HCC",
    notes:"Client's risk manager on medical leave. Deputy needs Board approval to bind. Stalled 49 days.",
    source:"Sagitta"
  },
  {
    id:"Q-2024-00405", account:"American Health Network Inc",    producer:"P003", segment:"P&C Large Commercial",
    carrier:"C009", product:"Healthcare Sys + D&O + EPL", status:"bound", quotedPremium:780000, expiringPremium:725000, boundPremium:765000,
    submissionDate:"2026-02-15", slaDueDate:"2026-03-01", effectiveDate:"2026-04-01",
    daysOpen:0, slaBreached:false, office:"Dallas, TX", region:"South Central",
    competitorCarriers:"Chubb,Zurich North America",
    notes:"BOUND 3/28 at $765K. Saved $15K through deductible restructure.",
    source:"Sagitta"
  },

  // ── EMPLOYEE BENEFITS ────────────────────────────────────────────────────────
  {
    id:"Q-2024-00501", account:"Brookfield School District",     producer:"P004", segment:"Employee Benefits",
    carrier:"C011", product:"Group Medical (BCBS)",  status:"presented",  quotedPremium:1425000,expiringPremium:1310000,
    submissionDate:"2026-03-15", slaDueDate:"2026-04-05", effectiveDate:"2026-07-01",
    daysOpen:39, slaBreached:false, office:"Chicago, IL", region:"Midwest",
    competitorCarriers:"Aetna,United Healthcare",
    notes:"Anthem/BCBS renewal at +8.8%. Client wants additional dental/vision bundle quote.",
    source:"BenefitPoint"
  },
  {
    id:"Q-2024-00502", account:"Sterling Financial Group",       producer:"P010", segment:"Employee Benefits",
    carrier:"C009", product:"Group Life + STD + LTD", status:"received",  quotedPremium:85000, expiringPremium:81000,
    submissionDate:"2026-04-07", slaDueDate:"2026-04-14", effectiveDate:"2026-06-01",
    daysOpen:16, slaBreached:false, office:"Nashville, TN", region:"Southeast",
    competitorCarriers:"Lincoln Financial,Sun Life",
    notes:"CNA competitive on LTD class definitions. Presenting Thursday.",
    source:"BenefitPoint"
  },
  {
    id:"Q-2024-00503", account:"Valley View Hospitals",          producer:"P013", segment:"Employee Benefits",
    carrier:"C011", product:"Group Medical + Dental + Vision", status:"open", quotedPremium:null, expiringPremium:4200000,
    submissionDate:"2026-04-14", slaDueDate:"2026-04-28", effectiveDate:"2026-07-01",
    daysOpen:9, slaBreached:false, office:"Boston, MA", region:"Northeast",
    competitorCarriers:"Aetna,Cigna",
    notes:"Self-funded vs fully-insured analysis underway. Census data uploaded 4/14.",
    source:"BenefitPoint"
  },
  {
    id:"Q-2024-00504", account:"ProLogix Warehouse Corp",        producer:"P004", segment:"Employee Benefits",
    carrier:"C009", product:"Group Medical",         status:"stalled",   quotedPremium:320000,expiringPremium:295000,
    submissionDate:"2026-03-22", slaDueDate:"2026-04-05", effectiveDate:"2026-05-01",
    daysOpen:32, slaBreached:true, office:"Chicago, IL", region:"Midwest",
    competitorCarriers:"United Healthcare",
    notes:"HR Director resigned. New CHRO unfamiliar with renewal timeline. Stalled.",
    source:"BenefitPoint"
  },
  {
    id:"Q-2024-00505", account:"Midwest Automotive Group",       producer:"P010", segment:"Employee Benefits",
    carrier:"C011", product:"Group Medical + Dental", status:"bound",   quotedPremium:540000, expiringPremium:510000, boundPremium:538000,
    submissionDate:"2026-02-20", slaDueDate:"2026-03-06", effectiveDate:"2026-04-01",
    daysOpen:0, slaBreached:false, office:"Nashville, TN", region:"Southeast",
    competitorCarriers:"Cigna",
    notes:"BOUND 3/22 at $538K. Saved $2K through pharmacy carve-out.",
    source:"BenefitPoint"
  },

  // ── DEALER SERVICES ──────────────────────────────────────────────────────────
  {
    id:"Q-2024-00601", account:"Prestige Auto Group (Ft. Myers)", producer:"P007", segment:"Dealer Services",
    carrier:"C004", product:"Dealers Open Lot + Garage",status:"received",  quotedPremium:32500, expiringPremium:30000,
    submissionDate:"2026-03-30", slaDueDate:"2026-04-06", effectiveDate:"2026-05-01",
    daysOpen:24, slaBreached:false, office:"Irvine, CA", region:"West",
    competitorCarriers:"Nationwide,Zurich North America",
    notes:"Liberty Mutual Dealer endorsed program. Lot value increased to $8.2M.",
    source:"EPIC"
  },
  {
    id:"Q-2024-00602", account:"Southern Star Powersports",      producer:"P007", segment:"Dealer Services",
    carrier:"C005", product:"Dealers Open Lot",       status:"stalled",   quotedPremium:18200, expiringPremium:17000,
    submissionDate:"2026-03-12", slaDueDate:"2026-03-19", effectiveDate:"2026-04-01",
    daysOpen:42, slaBreached:true, office:"Irvine, CA", region:"West",
    competitorCarriers:"Progressive Commercial",
    notes:"Owner disputing current year claim. Stalled pending claim resolution.",
    source:"EPIC"
  },
  {
    id:"Q-2024-00603", account:"Desert Sun Auto Mall",            producer:"P007", segment:"Dealer Services",
    carrier:"C004", product:"Dealers Open Lot + Cyber + Crime", status:"submitted", quotedPremium:null, expiringPremium:41000,
    submissionDate:"2026-04-19", slaDueDate:"2026-04-23", effectiveDate:"2026-06-01",
    daysOpen:4, slaBreached:false, office:"Irvine, CA", region:"West",
    competitorCarriers:"Nationwide",
    notes:"Added cyber/crime per client request after neighboring dealer breach.",
    source:"EPIC"
  },

  // ── SURETY / BONDS ───────────────────────────────────────────────────────────
  {
    id:"Q-2024-00701", account:"Apex Bridge Constructors Inc",   producer:"P008", segment:"Surety / Bonds",
    carrier:"C010", product:"Contract Surety – Performance",   status:"received",  quotedPremium:28000, expiringPremium:25000,
    submissionDate:"2026-04-03", slaDueDate:"2026-04-10", effectiveDate:"2026-05-01",
    daysOpen:20, slaBreached:false, office:"Seattle, WA", region:"West",
    competitorCarriers:"Zurich Surety,Travelers",
    notes:"Tokio Marine issued $10M performance bond. Client comparing premium rates.",
    source:"Submission Log"
  },
  {
    id:"Q-2024-00702", account:"Western Pipeline Solutions LLC",  producer:"P015", segment:"Surety / Bonds",
    carrier:"C012", product:"License & Permit Bonds",  status:"bound",   quotedPremium:4200,  expiringPremium:4000, boundPremium:4200,
    submissionDate:"2026-04-01", slaDueDate:"2026-04-06", effectiveDate:"2026-04-15",
    daysOpen:0, slaBreached:false, office:"Minneapolis, MN", region:"Midwest",
    competitorCarriers:"Tokio Marine HCC",
    notes:"BOUND 4/8. Zurich Surety license bond package. Client satisfied.",
    source:"Submission Log"
  },
  {
    id:"Q-2024-00703", account:"Horizon Infrastructure Partners",producer:"P008", segment:"Surety / Bonds",
    carrier:"C010", product:"Subdivision + Completion Bond",status:"open",   quotedPremium:null,  expiringPremium:38000,
    submissionDate:"2026-04-20", slaDueDate:"2026-04-27", effectiveDate:"2026-06-01",
    daysOpen:3, slaBreached:false, office:"Seattle, WA", region:"West",
    competitorCarriers:"Zurich Surety",
    notes:"Underwriting requested project financial statements. Sent 4/21.",
    source:"Submission Log"
  },
  {
    id:"Q-2024-00704", account:"Capitol Builders Group",          producer:"P015", segment:"Surety / Bonds",
    carrier:"C012", product:"Performance + Payment Bond",  status:"stalled",   quotedPremium:52000, expiringPremium:49000,
    submissionDate:"2026-03-08", slaDueDate:"2026-03-15", effectiveDate:"2026-04-01",
    daysOpen:46, slaBreached:true, office:"Minneapolis, MN", region:"Midwest",
    competitorCarriers:"Tokio Marine HCC,Travelers",
    notes:"Client disputing contract terms with project owner. Bond not needed until dispute resolved.",
    source:"Submission Log"
  },

  // ── ADDITIONAL OPEN QUOTES (variety) ─────────────────────────────────────────
  {
    id:"Q-2024-00801", account:"GreenPath Solar LLC",             producer:"P003", segment:"P&C Mid-Market Commercial",
    carrier:"C002", product:"Contractors + Inland Marine", status:"open",  quotedPremium:null,  expiringPremium:55000,
    submissionDate:"2026-04-21", slaDueDate:"2026-04-28", effectiveDate:"2026-06-01",
    daysOpen:2, slaBreached:false, office:"Dallas, TX", region:"South Central",
    competitorCarriers:"Chubb",
    notes:"New submission. Travelers reviewing contractor schedule.",
    source:"EPIC"
  },
  {
    id:"Q-2024-00802", account:"Mountain West Hospital System",   producer:"P004", segment:"Employee Benefits",
    carrier:"C011", product:"Group Medical – Fully Insured",status:"submitted", quotedPremium:null, expiringPremium:2100000,
    submissionDate:"2026-04-18", slaDueDate:"2026-05-02", effectiveDate:"2026-07-01",
    daysOpen:5, slaBreached:false, office:"Chicago, IL", region:"Midwest",
    competitorCarriers:"Aetna,United Healthcare",
    notes:"Large group 750 lives. BCBS submitted 4/18. RFP closes 5/15.",
    source:"BenefitPoint"
  },
  {
    id:"Q-2024-00803", account:"Lakefront Marina & Storage",      producer:"P011", segment:"P&C Small Commercial",
    carrier:"C001", product:"Marine Dealer + Property",status:"received",  quotedPremium:22000, expiringPremium:20500,
    submissionDate:"2026-04-05", slaDueDate:"2026-04-12", effectiveDate:"2026-05-01",
    daysOpen:18, slaBreached:false, office:"Phoenix, AZ", region:"West",
    competitorCarriers:"Travelers",
    notes:"Hartford competitive. Small marine exposure easily packaged.",
    source:"AMS360"
  },
  {
    id:"Q-2024-00804", account:"Century 21 Franchise Group",      producer:"P006", segment:"P&C Mid-Market Commercial",
    carrier:"C009", product:"E&O + Cyber",            status:"presented",  quotedPremium:48000, expiringPremium:44000,
    submissionDate:"2026-04-09", slaDueDate:"2026-04-16", effectiveDate:"2026-05-15",
    daysOpen:14, slaBreached:false, office:"Charlotte, NC", region:"Southeast",
    competitorCarriers:"Chubb",
    notes:"CNA E&O proposal includes 3-year rate lock option. Client reviewing.",
    source:"Sagitta"
  },
  {
    id:"Q-2024-00805", account:"Eagle Ridge Country Club",         producer:"P005", segment:"Personal Lines",
    carrier:"C006", product:"Private Client / Excess",status:"open",      quotedPremium:null,  expiringPremium:9800,
    submissionDate:"2026-04-22", slaDueDate:"2026-04-29", effectiveDate:"2026-06-01",
    daysOpen:1, slaBreached:false, office:"Denver, CO", region:"Mountain",
    competitorCarriers:"AIG Private Client",
    notes:"New client referral. Bermuda form Berkley One submission in progress.",
    source:"EPIC"
  },
];

// ─── HIT RATIO SNAPSHOTS ──────────────────────────────────────────────────────
const BNB_HIT_RATIOS = [
  // By Segment – Q1 2026
  { id:"HR-001", name:"Personal Lines – Q1 2026",          periodStart:"2026-01-01", periodEnd:"2026-03-31", producer:null, segment:"Personal Lines",           carrier:null, totalSubmissions:48, totalBound:32, hitRatioPct:66.7, totalPremiumBound:310000 },
  { id:"HR-002", name:"P&C Small Commercial – Q1 2026",    periodStart:"2026-01-01", periodEnd:"2026-03-31", producer:null, segment:"P&C Small Commercial",     carrier:null, totalSubmissions:62, totalBound:38, hitRatioPct:61.3, totalPremiumBound:720000 },
  { id:"HR-003", name:"P&C Mid-Market – Q1 2026",          periodStart:"2026-01-01", periodEnd:"2026-03-31", producer:null, segment:"P&C Mid-Market Commercial", carrier:null, totalSubmissions:29, totalBound:17, hitRatioPct:58.6, totalPremiumBound:3850000 },
  { id:"HR-004", name:"P&C Large Commercial – Q1 2026",    periodStart:"2026-01-01", periodEnd:"2026-03-31", producer:null, segment:"P&C Large Commercial",     carrier:null, totalSubmissions:12, totalBound:6,  hitRatioPct:50.0, totalPremiumBound:8200000 },
  { id:"HR-005", name:"Employee Benefits – Q1 2026",       periodStart:"2026-01-01", periodEnd:"2026-03-31", producer:null, segment:"Employee Benefits",         carrier:null, totalSubmissions:35, totalBound:22, hitRatioPct:62.9, totalPremiumBound:9400000 },
  { id:"HR-006", name:"Dealer Services – Q1 2026",         periodStart:"2026-01-01", periodEnd:"2026-03-31", producer:null, segment:"Dealer Services",           carrier:null, totalSubmissions:18, totalBound:12, hitRatioPct:66.7, totalPremiumBound:450000 },
  { id:"HR-007", name:"Surety / Bonds – Q1 2026",          periodStart:"2026-01-01", periodEnd:"2026-03-31", producer:null, segment:"Surety / Bonds",            carrier:null, totalSubmissions:11, totalBound:8,  hitRatioPct:72.7, totalPremiumBound:320000 },

  // By Producer – Q1 2026 (top producers)
  { id:"HR-101", name:"Alex Rivera – Q1 2026",             periodStart:"2026-01-01", periodEnd:"2026-03-31", producer:"Alex Rivera",    segment:null, carrier:null, totalSubmissions:15, totalBound:10, hitRatioPct:66.7, totalPremiumBound:2100000 },
  { id:"HR-102", name:"Jordan Holt – Q1 2026",             periodStart:"2026-01-01", periodEnd:"2026-03-31", producer:"Jordan Holt",    segment:null, carrier:null, totalSubmissions:22, totalBound:15, hitRatioPct:68.2, totalPremiumBound:380000 },
  { id:"HR-103", name:"Riley Foster – Q1 2026",            periodStart:"2026-01-01", periodEnd:"2026-03-31", producer:"Riley Foster",   segment:null, carrier:null, totalSubmissions:25, totalBound:16, hitRatioPct:64.0, totalPremiumBound:295000 },
  { id:"HR-104", name:"Parker Reed – Q1 2026",             periodStart:"2026-01-01", periodEnd:"2026-03-31", producer:"Parker Reed",    segment:null, carrier:null, totalSubmissions:38, totalBound:27, hitRatioPct:71.1, totalPremiumBound:265000 },
  { id:"HR-105", name:"Taylor Nguyen – Q1 2026",           periodStart:"2026-01-01", periodEnd:"2026-03-31", producer:"Taylor Nguyen",  segment:null, carrier:null, totalSubmissions:18, totalBound:11, hitRatioPct:61.1, totalPremiumBound:4800000 },
  { id:"HR-106", name:"Morgan Ellis – Q1 2026",            periodStart:"2026-01-01", periodEnd:"2026-03-31", producer:"Morgan Ellis",   segment:null, carrier:null, totalSubmissions:7,  totalBound:4,  hitRatioPct:57.1, totalPremiumBound:5400000 },
  { id:"HR-107", name:"Sam Kowalski – Q1 2026",            periodStart:"2026-01-01", periodEnd:"2026-03-31", producer:"Sam Kowalski",   segment:null, carrier:null, totalSubmissions:5,  totalBound:2,  hitRatioPct:40.0, totalPremiumBound:1750000 },

  // By Carrier – Q1 2026
  { id:"HR-201", name:"The Hartford – Q1 2026",            periodStart:"2026-01-01", periodEnd:"2026-03-31", producer:null, segment:null, carrier:"The Hartford",          totalSubmissions:45, totalBound:31, hitRatioPct:68.9, totalPremiumBound:1250000 },
  { id:"HR-202", name:"Travelers – Q1 2026",               periodStart:"2026-01-01", periodEnd:"2026-03-31", producer:null, segment:null, carrier:"Travelers",             totalSubmissions:52, totalBound:33, hitRatioPct:63.5, totalPremiumBound:4200000 },
  { id:"HR-203", name:"Chubb – Q1 2026",                   periodStart:"2026-01-01", periodEnd:"2026-03-31", producer:null, segment:null, carrier:"Chubb",                 totalSubmissions:28, totalBound:16, hitRatioPct:57.1, totalPremiumBound:5800000 },
  { id:"HR-204", name:"Liberty Mutual – Q1 2026",          periodStart:"2026-01-01", periodEnd:"2026-03-31", producer:null, segment:null, carrier:"Liberty Mutual",        totalSubmissions:38, totalBound:24, hitRatioPct:63.2, totalPremiumBound:890000 },
  { id:"HR-205", name:"Nationwide – Q1 2026",              periodStart:"2026-01-01", periodEnd:"2026-03-31", producer:null, segment:null, carrier:"Nationwide",            totalSubmissions:30, totalBound:18, hitRatioPct:60.0, totalPremiumBound:520000 },
  { id:"HR-206", name:"Zurich North America – Q1 2026",    periodStart:"2026-01-01", periodEnd:"2026-03-31", producer:null, segment:null, carrier:"Zurich North America",  totalSubmissions:18, totalBound:9,  hitRatioPct:50.0, totalPremiumBound:6300000 },
  { id:"HR-207", name:"CNA Financial – Q1 2026",           periodStart:"2026-01-01", periodEnd:"2026-03-31", producer:null, segment:null, carrier:"CNA Financial",         totalSubmissions:22, totalBound:13, hitRatioPct:59.1, totalPremiumBound:3100000 },
  { id:"HR-208", name:"Anthem / BCBS – Q1 2026",           periodStart:"2026-01-01", periodEnd:"2026-03-31", producer:null, segment:null, carrier:"Anthem / BCBS",        totalSubmissions:15, totalBound:10, hitRatioPct:66.7, totalPremiumBound:7500000 },

  // Trending – last 4 quarters (overall firm)
  { id:"HR-T01", name:"B&B Overall – Q2 2025",             periodStart:"2025-04-01", periodEnd:"2025-06-30", producer:null, segment:null, carrier:null, totalSubmissions:195, totalBound:118, hitRatioPct:60.5, totalPremiumBound:18200000 },
  { id:"HR-T02", name:"B&B Overall – Q3 2025",             periodStart:"2025-07-01", periodEnd:"2025-09-30", producer:null, segment:null, carrier:null, totalSubmissions:211, totalBound:131, hitRatioPct:62.1, totalPremiumBound:19800000 },
  { id:"HR-T03", name:"B&B Overall – Q4 2025",             periodStart:"2025-10-01", periodEnd:"2025-12-31", producer:null, segment:null, carrier:null, totalSubmissions:228, totalBound:143, hitRatioPct:62.7, totalPremiumBound:22400000 },
  { id:"HR-T04", name:"B&B Overall – Q1 2026",             periodStart:"2026-01-01", periodEnd:"2026-03-31", producer:null, segment:null, carrier:null, totalSubmissions:215, totalBound:133, hitRatioPct:61.9, totalPremiumBound:23300000 },
  // Q2 2026 forecast
  { id:"HR-T05", name:"B&B Overall – Q2 2026 (Forecast)",  periodStart:"2026-04-01", periodEnd:"2026-06-30", producer:null, segment:null, carrier:null, totalSubmissions:235, totalBound:148, hitRatioPct:63.0, totalPremiumBound:25100000 },
];

// ─── SLA RULES ────────────────────────────────────────────────────────────────
const BNB_SLA_RULES = [
  { id:"SLA-001", segment:"Personal Lines",           responseSLADays:3,  stalledThresholdDays:10, escalationEmail:"sales-se@bbins.com" },
  { id:"SLA-002", segment:"P&C Small Commercial",     responseSLADays:5,  stalledThresholdDays:14, escalationEmail:"sales-se@bbins.com" },
  { id:"SLA-003", segment:"P&C Mid-Market Commercial",responseSLADays:10, stalledThresholdDays:21, escalationEmail:"sales-leaders@bbins.com" },
  { id:"SLA-004", segment:"P&C Large Commercial",     responseSLADays:14, stalledThresholdDays:30, escalationEmail:"sales-leaders@bbins.com" },
  { id:"SLA-005", segment:"Employee Benefits",        responseSLADays:10, stalledThresholdDays:21, escalationEmail:"eb-leaders@bbins.com" },
  { id:"SLA-006", segment:"Dealer Services",          responseSLADays:5,  stalledThresholdDays:14, escalationEmail:"dealer-svcs@bbins.com" },
  { id:"SLA-007", segment:"Surety / Bonds",           responseSLADays:7,  stalledThresholdDays:21, escalationEmail:"surety@bbins.com" },
];

// ─── EXPORT ───────────────────────────────────────────────────────────────────
// Used by bnb_inflight_quotes.js when running in demo/standalone mode
if (typeof window !== "undefined") {
  window.BNB_SAMPLE_DATA = {
    carriers:   BNB_CARRIERS,
    producers:  BNB_PRODUCERS,
    quotes:     BNB_QUOTES,
    hitRatios:  BNB_HIT_RATIOS,
    slaRules:   BNB_SLA_RULES,
  };
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { BNB_CARRIERS, BNB_PRODUCERS, BNB_QUOTES, BNB_HIT_RATIOS, BNB_SLA_RULES };
}
