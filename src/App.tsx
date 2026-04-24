import { useMemo, useState } from 'react';

type Carrier =
  | 'Liberty Mutual'
  | 'Travelers'
  | 'Hartford'
  | 'Chubb'
  | 'Nationwide';

type Segment =
  | "Workers' Comp"
  | 'Commercial Auto'
  | 'General Liability'
  | 'Property'
  | 'Professional Liability';

type QuoteStatus =
  | 'In Review'
  | 'Quoted'
  | 'Negotiation'
  | 'Awaiting Client'
  | 'Bound'
  | 'Lost';

type Tab = 'pipeline' | 'analytics';

interface Quote {
  id: string;
  clientName: string;
  producer: string;
  accountExecutive: string;
  carrier: Carrier;
  segment: Segment;
  status: QuoteStatus;
  stageNote: string;
  receivedDate: string;
  effectiveDate: string;
  expirationDate: string;
  annualPremium: number;
  revenueOpportunity: number;
  coverage: string[];
  brokerNotes: string;
  competitor: string;
  hitProbability: number;
}

const carriers: Carrier[] = [
  'Liberty Mutual',
  'Travelers',
  'Hartford',
  'Chubb',
  'Nationwide',
];

const segments: Segment[] = [
  "Workers' Comp",
  'Commercial Auto',
  'General Liability',
  'Property',
  'Professional Liability',
];

const initialQuotes: Quote[] = [
  {
    id: 'Q-10482',
    clientName: 'Blue Harbor Logistics',
    producer: 'Avery Collins',
    accountExecutive: 'Nia Brooks',
    carrier: 'Travelers',
    segment: 'Commercial Auto',
    status: 'Negotiation',
    stageNote: 'Final pricing requested after loss run review',
    receivedDate: '2026-04-06',
    effectiveDate: '2026-05-15',
    expirationDate: '2026-05-09',
    annualPremium: 284000,
    revenueOpportunity: 42500,
    coverage: ['Auto Liability $2M', 'Physical Damage', 'Hired/Non-Owned Auto'],
    brokerNotes: 'Competitor is pricing aggressively; client values claims support.',
    competitor: 'Progressive',
    hitProbability: 72,
  },
  {
    id: 'Q-10471',
    clientName: 'West Ridge Manufacturing',
    producer: 'Jordan Ellis',
    accountExecutive: 'Lena Patel',
    carrier: 'Liberty Mutual',
    segment: "Workers' Comp",
    status: 'Quoted',
    stageNote: 'Awaiting producer review before client presentation',
    receivedDate: '2026-04-11',
    effectiveDate: '2026-06-01',
    expirationDate: '2026-05-03',
    annualPremium: 362500,
    revenueOpportunity: 51800,
    coverage: ['Statutory WC', 'Employers Liability $1M', 'Waiver of Subrogation'],
    brokerNotes: 'Good experience mod improvement story; focus on dividend option.',
    competitor: 'The Hartford',
    hitProbability: 64,
  },
  {
    id: 'Q-10458',
    clientName: 'Lakeview Medical Group',
    producer: 'Avery Collins',
    accountExecutive: 'Nia Brooks',
    carrier: 'Chubb',
    segment: 'Professional Liability',
    status: 'In Review',
    stageNote: 'Underwriting follow-up on telehealth exposure',
    receivedDate: '2026-04-15',
    effectiveDate: '2026-05-20',
    expirationDate: '2026-05-12',
    annualPremium: 198400,
    revenueOpportunity: 29700,
    coverage: ['Medical PL $5M', 'Cyber Endorsement', 'Defense Outside Limits'],
    brokerNotes: 'Client wants broader cyber language than incumbent renewal.',
    competitor: 'Beazley',
    hitProbability: 58,
  },
  {
    id: 'Q-10437',
    clientName: 'Northline Hospitality',
    producer: 'Maya Turner',
    accountExecutive: 'Chris Walton',
    carrier: 'Hartford',
    segment: 'Property',
    status: 'Awaiting Client',
    stageNote: 'Proposal delivered; waiting on board approval',
    receivedDate: '2026-04-03',
    effectiveDate: '2026-05-05',
    expirationDate: '2026-04-28',
    annualPremium: 421900,
    revenueOpportunity: 60400,
    coverage: ['Blanket Property', 'Equipment Breakdown', 'Business Income 18 months'],
    brokerNotes: 'Speed to bind is key because incumbent gave only a short extension.',
    competitor: 'FM Global',
    hitProbability: 76,
  },
  {
    id: 'Q-10412',
    clientName: 'PeakStone Contractors',
    producer: 'Jordan Ellis',
    accountExecutive: 'Lena Patel',
    carrier: 'Nationwide',
    segment: 'General Liability',
    status: 'Quoted',
    stageNote: 'Need final wrap-up answer for subcontractor controls',
    receivedDate: '2026-04-07',
    effectiveDate: '2026-05-25',
    expirationDate: '2026-05-18',
    annualPremium: 173600,
    revenueOpportunity: 26100,
    coverage: ['GL $2M/$4M', 'Additional Insured', 'Per Project Aggregate'],
    brokerNotes: 'Strong relationship with producer gives us room to win on service.',
    competitor: 'CNA',
    hitProbability: 69,
  },
  {
    id: 'Q-10398',
    clientName: 'Summit Retail Partners',
    producer: 'Maya Turner',
    accountExecutive: 'Chris Walton',
    carrier: 'Travelers',
    segment: 'Property',
    status: 'Bound',
    stageNote: 'Bound this week after catastrophe deductible negotiation',
    receivedDate: '2026-03-29',
    effectiveDate: '2026-04-25',
    expirationDate: '2026-04-25',
    annualPremium: 309200,
    revenueOpportunity: 44800,
    coverage: ['Property All Risk', 'Stock Throughput', 'Ordinance & Law'],
    brokerNotes: 'Won on broader stock language and faster turnaround.',
    competitor: 'Zurich',
    hitProbability: 100,
  },
  {
    id: 'Q-10377',
    clientName: 'Granite Fleet Services',
    producer: 'Avery Collins',
    accountExecutive: 'Nia Brooks',
    carrier: 'Hartford',
    segment: 'Commercial Auto',
    status: 'Lost',
    stageNote: 'Client stayed with incumbent on multi-year rate guarantee',
    receivedDate: '2026-03-21',
    effectiveDate: '2026-04-18',
    expirationDate: '2026-04-18',
    annualPremium: 256300,
    revenueOpportunity: 38400,
    coverage: ['Auto Liability $1M', 'Trailer Interchange', 'MCS-90'],
    brokerNotes: 'Pricing was competitive but incumbent locked in a 24-month deal.',
    competitor: 'Old Republic',
    hitProbability: 0,
  },
  {
    id: 'Q-10364',
    clientName: 'Cobalt Advisory',
    producer: 'Jordan Ellis',
    accountExecutive: 'Lena Patel',
    carrier: 'Chubb',
    segment: 'Professional Liability',
    status: 'Negotiation',
    stageNote: 'Comparing retention options before final recommendation',
    receivedDate: '2026-04-10',
    effectiveDate: '2026-05-30',
    expirationDate: '2026-05-14',
    annualPremium: 144750,
    revenueOpportunity: 21800,
    coverage: ['E&O $3M', 'Privacy Liability', 'Defense in Addition'],
    brokerNotes: 'Competitive analysis favors Chubb if retention can move down.',
    competitor: 'AIG',
    hitProbability: 61,
  },
  {
    id: 'Q-10341',
    clientName: 'Red Cedar Food Group',
    producer: 'Maya Turner',
    accountExecutive: 'Chris Walton',
    carrier: 'Nationwide',
    segment: "Workers' Comp",
    status: 'In Review',
    stageNote: 'Waiting on updated payroll split by class code',
    receivedDate: '2026-04-18',
    effectiveDate: '2026-06-10',
    expirationDate: '2026-05-29',
    annualPremium: 228900,
    revenueOpportunity: 34100,
    coverage: ['Statutory WC', 'Employers Liability $500K', 'Managed Care Option'],
    brokerNotes: 'Need quicker payroll clarification to protect timeline.',
    competitor: 'AmTrust',
    hitProbability: 54,
  },
  {
    id: 'Q-10318',
    clientName: 'Anchor Fitness Holdings',
    producer: 'Avery Collins',
    accountExecutive: 'Nia Brooks',
    carrier: 'Liberty Mutual',
    segment: 'General Liability',
    status: 'Awaiting Client',
    stageNote: 'Client reviewing side-by-side comparison for 14 locations',
    receivedDate: '2026-04-08',
    effectiveDate: '2026-05-22',
    expirationDate: '2026-05-01',
    annualPremium: 191100,
    revenueOpportunity: 28700,
    coverage: ['GL $1M/$2M', 'Abuse & Molestation', 'Participant Legal Liability'],
    brokerNotes: 'Strong fit, but we need to stay responsive on endorsements.',
    competitor: 'Philadelphia',
    hitProbability: 73,
  },
];

const activeStatuses: QuoteStatus[] = ['In Review', 'Quoted', 'Negotiation', 'Awaiting Client'];

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

function daysUntil(date: string) {
  const today = new Date('2026-04-24T00:00:00');
  const target = new Date(date);
  return Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
}

function pillClass(status: QuoteStatus) {
  const map: Record<QuoteStatus, string> = {
    'In Review': 'bg-slate-100 text-slate-700',
    Quoted: 'bg-blue-100 text-blue-700',
    Negotiation: 'bg-indigo-100 text-indigo-700',
    'Awaiting Client': 'bg-amber-100 text-amber-700',
    Bound: 'bg-emerald-100 text-emerald-700',
    Lost: 'bg-rose-100 text-rose-700',
  };

  return map[status];
}

function App() {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [tab, setTab] = useState<Tab>('pipeline');
  const [search, setSearch] = useState('');
  const [selectedCarrier, setSelectedCarrier] = useState<'All' | Carrier>('All');
  const [selectedSegment, setSelectedSegment] = useState<'All' | Segment>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | QuoteStatus>('All');
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);

  const selectedQuote = quotes.find((quote) => quote.id === selectedQuoteId) ?? null;

  const filteredQuotes = useMemo(() => {
    const term = search.trim().toLowerCase();

    return quotes.filter((quote) => {
      const matchesSearch =
        !term ||
        [
          quote.id,
          quote.clientName,
          quote.producer,
          quote.accountExecutive,
          quote.carrier,
          quote.segment,
        ]
          .join(' ')
          .toLowerCase()
          .includes(term);

      const matchesCarrier = selectedCarrier === 'All' || quote.carrier === selectedCarrier;
      const matchesSegment = selectedSegment === 'All' || quote.segment === selectedSegment;
      const matchesStatus = selectedStatus === 'All' || quote.status === selectedStatus;

      return matchesSearch && matchesCarrier && matchesSegment && matchesStatus;
    });
  }, [quotes, search, selectedCarrier, selectedSegment, selectedStatus]);

  const metrics = useMemo(() => {
    const activeQuotes = quotes.filter((quote) => activeStatuses.includes(quote.status));
    const closedQuotes = quotes.filter((quote) => ['Bound', 'Lost'].includes(quote.status));
    const boundQuotes = quotes.filter((quote) => quote.status === 'Bound');
    const expiringSoon = activeQuotes.filter((quote) => daysUntil(quote.expirationDate) <= 14).length;

    return {
      activeQuotes: activeQuotes.length,
      expiringSoon,
      pipelineValue: activeQuotes.reduce((sum, quote) => sum + quote.annualPremium, 0),
      overallHitRatio: closedQuotes.length
        ? Math.round((boundQuotes.length / closedQuotes.length) * 100)
        : 0,
    };
  }, [quotes]);

  const segmentAnalytics = useMemo(() => {
    return segments.map((segment) => {
      const segmentQuotes = quotes.filter((quote) => quote.segment === segment);
      const closedQuotes = segmentQuotes.filter((quote) =>
        ['Bound', 'Lost'].includes(quote.status)
      );
      const boundQuotes = closedQuotes.filter((quote) => quote.status === 'Bound');

      return {
        segment,
        count: segmentQuotes.length,
        hitRatio: closedQuotes.length ? Math.round((boundQuotes.length / closedQuotes.length) * 100) : 0,
      };
    });
  }, [quotes]);

  const carrierAnalytics = useMemo(() => {
    return carriers.map((carrier) => {
      const carrierQuotes = quotes.filter((quote) => quote.carrier === carrier);
      const closedQuotes = carrierQuotes.filter((quote) => ['Bound', 'Lost'].includes(quote.status));
      const wins = closedQuotes.filter((quote) => quote.status === 'Bound').length;

      return {
        carrier,
        winRate: closedQuotes.length ? Math.round((wins / closedQuotes.length) * 100) : 0,
        active: carrierQuotes.filter((quote) => activeStatuses.includes(quote.status)).length,
      };
    });
  }, [quotes]);

  const markQuote = (status: Extract<QuoteStatus, 'Bound' | 'Lost'>) => {
    if (!selectedQuote) return;

    setQuotes((currentQuotes) =>
      currentQuotes.map((quote) =>
        quote.id === selectedQuote.id
          ? { ...quote, status, stageNote: status === 'Bound' ? 'Marked bound from quote details' : 'Marked lost from quote details', hitProbability: status === 'Bound' ? 100 : 0 }
          : quote
      )
    );
    setSelectedQuoteId(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 px-6 py-6 text-white">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-blue-200">
                  Dynamics 365 Quote Workspace
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                  In-flight visibility for producers
                </h1>
                <p className="mt-2 max-w-3xl text-sm text-slate-200">
                  Centralize carrier activity, monitor responsiveness, compare market positioning,
                  and improve hit ratios across the current quote pipeline.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-200 text-lg font-semibold text-slate-900">
                  AC
                </div>
                <div>
                  <div className="text-sm font-semibold">Avery Collins</div>
                  <div className="text-xs text-slate-200">Brown &amp; Brown Insurance Producer</div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  label: 'Active Quotes',
                  value: metrics.activeQuotes.toString(),
                  tone: 'border-blue-300/30 bg-blue-400/10',
                },
                {
                  label: 'Expiring Soon',
                  value: metrics.expiringSoon.toString(),
                  tone: 'border-amber-300/30 bg-amber-400/10',
                },
                {
                  label: 'Pipeline Value',
                  value: currency.format(metrics.pipelineValue),
                  tone: 'border-slate-300/30 bg-slate-200/10',
                },
                {
                  label: 'Overall Hit Ratio',
                  value: `${metrics.overallHitRatio}%`,
                  tone: 'border-emerald-300/30 bg-emerald-400/10',
                },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className={`rounded-2xl border px-4 py-4 shadow-sm ${metric.tone}`}
                >
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-200">
                    {metric.label}
                  </div>
                  <div className="mt-3 text-2xl font-semibold text-white">{metric.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 py-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex rounded-2xl bg-slate-100 p-1">
                {[
                  { key: 'pipeline', label: 'Quote Pipeline' },
                  { key: 'analytics', label: 'Analytics' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setTab(item.key as Tab)}
                    className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                      tab === item.key
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="text-sm text-slate-500">
                5 carriers · 5 segments · live producer-facing quote actions
              </div>
            </div>

            {tab === 'pipeline' && (
              <div className="mt-6 space-y-6">
                <div className="grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 lg:grid-cols-[2fr_repeat(3,1fr)]">
                  <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
                    Search quotes
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search by client, quote ID, producer, carrier..."
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 transition focus:border-blue-500"
                    />
                  </label>

                  <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
                    Carrier
                    <select
                      value={selectedCarrier}
                      onChange={(event) => setSelectedCarrier(event.target.value as 'All' | Carrier)}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500"
                    >
                      <option value="All">All carriers</option>
                      {carriers.map((carrier) => (
                        <option key={carrier} value={carrier}>
                          {carrier}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
                    Segment
                    <select
                      value={selectedSegment}
                      onChange={(event) => setSelectedSegment(event.target.value as 'All' | Segment)}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500"
                    >
                      <option value="All">All segments</option>
                      {segments.map((segment) => (
                        <option key={segment} value={segment}>
                          {segment}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
                    Status
                    <select
                      value={selectedStatus}
                      onChange={(event) =>
                        setSelectedStatus(event.target.value as 'All' | QuoteStatus)
                      }
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500"
                    >
                      <option value="All">All statuses</option>
                      {['In Review', 'Quoted', 'Negotiation', 'Awaiting Client', 'Bound', 'Lost'].map(
                        (status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        )
                      )}
                    </select>
                  </label>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Quote cards</h2>
                    <p className="text-sm text-slate-500">
                      Search and filter in-flight quotes by carrier, segment, and status.
                    </p>
                  </div>
                  <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                    {filteredQuotes.length} visible quotes
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  {filteredQuotes.map((quote) => {
                    const expiryDays = daysUntil(quote.expirationDate);
                    const active = activeStatuses.includes(quote.status);

                    return (
                      <button
                        key={quote.id}
                        type="button"
                        onClick={() => setSelectedQuoteId(quote.id)}
                        className="rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                              {quote.id}
                            </div>
                            <h3 className="mt-2 text-xl font-semibold text-slate-900">
                              {quote.clientName}
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                              {quote.segment} · {quote.carrier}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${pillClass(quote.status)}`}
                          >
                            {quote.status}
                          </span>
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                          <div className="rounded-2xl bg-slate-50 px-4 py-3">
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                              Premium
                            </div>
                            <div className="mt-2 text-lg font-semibold text-slate-900">
                              {currency.format(quote.annualPremium)}
                            </div>
                          </div>
                          <div className="rounded-2xl bg-slate-50 px-4 py-3">
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                              Revenue
                            </div>
                            <div className="mt-2 text-lg font-semibold text-slate-900">
                              {currency.format(quote.revenueOpportunity)}
                            </div>
                          </div>
                          <div className="rounded-2xl bg-slate-50 px-4 py-3">
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                              Expiration
                            </div>
                            <div className="mt-2 text-lg font-semibold text-slate-900">
                              {expiryDays <= 0 ? 'Due now' : `${expiryDays} days`}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {quote.coverage.map((item) => (
                            <span
                              key={item}
                              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                            >
                              {item}
                            </span>
                          ))}
                        </div>

                        <div className="mt-5 flex items-center justify-between gap-3">
                          <div>
                            <div className="text-sm font-medium text-slate-900">
                              {quote.producer} · {quote.accountExecutive}
                            </div>
                            <div className="text-sm text-slate-500">{quote.stageNote}</div>
                          </div>
                          <div className="min-w-28">
                            <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                              <span>Hit chance</span>
                              <span>{quote.hitProbability}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-200">
                              <div
                                className={`h-2 rounded-full ${
                                  active ? 'bg-blue-600' : quote.status === 'Bound' ? 'bg-emerald-500' : 'bg-rose-500'
                                }`}
                                style={{ width: `${quote.hitProbability}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {tab === 'analytics' && (
              <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">Hit ratios by segment</h2>
                      <p className="text-sm text-slate-500">
                        Closed quote performance by insurance segment.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-5">
                    {segmentAnalytics.map((item) => (
                      <div key={item.segment}>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-700">{item.segment}</span>
                          <span className="text-slate-500">
                            {item.hitRatio}% · {item.count} total quotes
                          </span>
                        </div>
                        <div className="h-3 rounded-full bg-slate-100">
                          <div
                            className="h-3 rounded-full bg-gradient-to-r from-slate-700 to-blue-600"
                            style={{ width: `${item.hitRatio}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">Carrier win rates</h2>
                  <p className="text-sm text-slate-500">
                    Competitive analysis across the requested carrier set.
                  </p>

                  <div className="mt-5 space-y-4">
                    {carrierAnalytics.map((item) => (
                      <div
                        key={item.carrier}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="font-semibold text-slate-900">{item.carrier}</div>
                            <div className="text-sm text-slate-500">
                              {item.active} active quote{item.active === 1 ? '' : 's'}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-semibold text-slate-900">
                              {item.winRate}%
                            </div>
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                              win rate
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 h-2 rounded-full bg-white">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-slate-800"
                            style={{ width: `${item.winRate}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
                  <h2 className="text-lg font-semibold text-slate-900">Competitive positioning</h2>
                  <p className="text-sm text-slate-500">
                    Use these indicators to improve responsiveness and guide renewal conversations.
                  </p>

                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl bg-slate-900 p-5 text-white">
                      <div className="text-xs uppercase tracking-[0.24em] text-blue-200">
                        Best momentum
                      </div>
                      <div className="mt-3 text-xl font-semibold">Travelers</div>
                      <p className="mt-2 text-sm text-slate-300">
                        Strong mix of active property and auto opportunities with one recent bind.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-blue-50 p-5">
                      <div className="text-xs uppercase tracking-[0.24em] text-blue-600">
                        Fastest action needed
                      </div>
                      <div className="mt-3 text-xl font-semibold text-slate-900">Property</div>
                      <p className="mt-2 text-sm text-slate-600">
                        Property quotes have the most expirations inside the next two weeks.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-100 p-5">
                      <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
                        Watch list
                      </div>
                      <div className="mt-3 text-xl font-semibold text-slate-900">
                        Professional Liability
                      </div>
                      <p className="mt-2 text-sm text-slate-600">
                        Retention and wording are driving the most competitive pressure right now.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-8 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] bg-white shadow-2xl">
            <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Quote details
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  {selectedQuote.clientName}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedQuote.id} · {selectedQuote.segment} · {selectedQuote.carrier}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedQuoteId(null)}
                className="rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-200"
              >
                Close
              </button>
            </div>

            <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    ['Producer', selectedQuote.producer],
                    ['Account Executive', selectedQuote.accountExecutive],
                    ['Annual Premium', currency.format(selectedQuote.annualPremium)],
                    ['Revenue Opportunity', currency.format(selectedQuote.revenueOpportunity)],
                    ['Effective Date', selectedQuote.effectiveDate],
                    ['Expiration Date', selectedQuote.expirationDate],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl bg-slate-50 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        {label}
                      </div>
                      <div className="mt-2 text-base font-semibold text-slate-900">{value}</div>
                    </div>
                  ))}
                </div>

                <div className="rounded-3xl border border-slate-200 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Coverage
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedQuote.coverage.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Client and competitive notes
                  </h3>
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    <p>{selectedQuote.brokerNotes}</p>
                    <p>
                      <span className="font-semibold text-slate-900">Current stage:</span>{' '}
                      {selectedQuote.stageNote}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-900">Primary competitor:</span>{' '}
                      {selectedQuote.competitor}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-3xl bg-slate-900 p-5 text-white">
                  <div className="text-xs uppercase tracking-[0.24em] text-blue-200">
                    Quote status
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${pillClass(selectedQuote.status)}`}>
                      {selectedQuote.status}
                    </span>
                    <span className="text-sm text-slate-300">
                      Hit chance {selectedQuote.hitProbability}%
                    </span>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-white/15">
                    <div
                      className="h-2 rounded-full bg-blue-400"
                      style={{ width: `${selectedQuote.hitProbability}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Actions
                  </h3>
                  <div className="mt-4 space-y-3">
                    <button
                      type="button"
                      onClick={() => markQuote('Bound')}
                      className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
                    >
                      Mark as Bound
                    </button>
                    <button
                      type="button"
                      onClick={() => markQuote('Lost')}
                      className="w-full rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
                    >
                      Mark as Lost
                    </button>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Timeline
                  </h3>
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    <div className="flex items-center justify-between">
                      <span>Received</span>
                      <span className="font-semibold text-slate-900">{selectedQuote.receivedDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Effective</span>
                      <span className="font-semibold text-slate-900">{selectedQuote.effectiveDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Expiration</span>
                      <span className="font-semibold text-slate-900">{selectedQuote.expirationDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
