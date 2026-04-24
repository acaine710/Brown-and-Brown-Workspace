import { useState } from 'react';

type QuoteStatus = 'In Review' | 'Quoted' | 'Awaiting Client' | 'Bound' | 'Lost';

interface Quote {
  id: string;
  clientName: string;
  producer: string;
  carrier: string;
  segment: string;
  status: QuoteStatus;
  premium: number;
  revenue: number;
  effectiveDate: string;
  note: string;
}

const quotesSeed: Quote[] = [
  {
    id: 'Q-10482',
    clientName: 'Blue Harbor Logistics',
    producer: 'Avery Collins',
    carrier: 'Travelers',
    segment: 'Commercial Auto',
    status: 'In Review',
    premium: 284000,
    revenue: 42500,
    effectiveDate: '2026-04-30',
    note: 'Waiting on final pricing update.',
  },
  {
    id: 'Q-10471',
    clientName: 'West Ridge Manufacturing',
    producer: 'Jordan Ellis',
    carrier: 'Liberty Mutual',
    segment: "Workers' Comp",
    status: 'Quoted',
    premium: 362500,
    revenue: 51800,
    effectiveDate: '2026-04-29',
    note: 'Proposal is ready for producer review.',
  },
  {
    id: 'Q-10458',
    clientName: 'Lakeview Medical Group',
    producer: 'Avery Collins',
    carrier: 'Chubb',
    segment: 'Professional Liability',
    status: 'In Review',
    premium: 198400,
    revenue: 29700,
    effectiveDate: '2026-05-02',
    note: 'Carrier needs a telehealth exposure answer.',
  },
  {
    id: 'Q-10437',
    clientName: 'Northline Hospitality',
    producer: 'Maya Turner',
    carrier: 'Hartford',
    segment: 'Property',
    status: 'Awaiting Client',
    premium: 421900,
    revenue: 60400,
    effectiveDate: '2026-04-27',
    note: 'Client is reviewing the final proposal.',
  },
  {
    id: 'Q-10398',
    clientName: 'Summit Retail Partners',
    producer: 'Maya Turner',
    carrier: 'Travelers',
    segment: 'Property',
    status: 'Bound',
    premium: 309200,
    revenue: 44800,
    effectiveDate: '2026-04-25',
    note: 'Bound after deductible negotiation.',
  },
  {
    id: 'Q-10377',
    clientName: 'Granite Fleet Services',
    producer: 'Avery Collins',
    carrier: 'Hartford',
    segment: 'Commercial Auto',
    status: 'Lost',
    premium: 256300,
    revenue: 38400,
    effectiveDate: '2026-04-18',
    note: 'Client stayed with incumbent carrier.',
  },
];

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const activeStatuses: QuoteStatus[] = ['In Review', 'Quoted', 'Awaiting Client'];

function App() {
  const [quotes, setQuotes] = useState<Quote[]>(quotesSeed);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | QuoteStatus>('All');
  const [selectedQuoteId, setSelectedQuoteId] = useState(quotesSeed[0]?.id ?? '');

  const filteredQuotes = quotes.filter((quote) => {
    const matchesSearch =
      search.trim() === '' ||
      [quote.id, quote.clientName, quote.producer, quote.carrier, quote.segment]
        .join(' ')
        .toLowerCase()
        .includes(search.trim().toLowerCase());

    const matchesStatus = statusFilter === 'All' || quote.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const selectedQuote =
    filteredQuotes.find((quote) => quote.id === selectedQuoteId) || filteredQuotes[0] || null;

  const activeQuotes = quotes.filter((quote) => activeStatuses.includes(quote.status));
  const closedQuotes = quotes.filter(
    (quote) => quote.status === 'Bound' || quote.status === 'Lost'
  );
  const boundQuotes = quotes.filter((quote) => quote.status === 'Bound');

  const pipelineValue = activeQuotes.reduce((total, quote) => total + quote.premium, 0);
  const winRate = closedQuotes.length === 0 ? 0 : Math.round((boundQuotes.length / closedQuotes.length) * 100);

  function updateQuoteStatus(nextStatus: 'Bound' | 'Lost') {
    if (!selectedQuote) {
      return;
    }

    setQuotes((currentQuotes) =>
      currentQuotes.map((quote) =>
        quote.id === selectedQuote.id
          ? {
              ...quote,
              status: nextStatus,
              note:
                nextStatus === 'Bound'
                  ? 'Marked as bound from the workspace.'
                  : 'Marked as lost from the workspace.',
            }
          : quote
      )
    );
  }

  return (
    <div className="page-shell">
      <div className="app-card">
        <header className="hero">
          <p className="eyebrow">Dynamics 365 quote workspace</p>
          <h1>Simple in-flight quote tracker</h1>
          <p className="hero-copy">
            A lighter React page for Dynamics Gen AI pages with basic filters, summary numbers,
            and quote actions.
          </p>
        </header>

        <section className="summary-grid">
          <div className="summary-card">
            <span className="summary-label">Active quotes</span>
            <strong>{activeQuotes.length}</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">Pipeline value</span>
            <strong>{currency.format(pipelineValue)}</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">Win rate</span>
            <strong>{winRate}%</strong>
          </div>
        </section>

        <section className="panel">
          <div className="filters">
            <label>
              Search
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search client, producer, carrier..."
              />
            </label>

            <label>
              Status
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as 'All' | QuoteStatus)}
              >
                <option value="All">All</option>
                <option value="In Review">In Review</option>
                <option value="Quoted">Quoted</option>
                <option value="Awaiting Client">Awaiting Client</option>
                <option value="Bound">Bound</option>
                <option value="Lost">Lost</option>
              </select>
            </label>
          </div>

          <div className="content-grid">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Quote</th>
                    <th>Carrier</th>
                    <th>Status</th>
                    <th>Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuotes.map((quote) => (
                    <tr
                      key={quote.id}
                      className={selectedQuote?.id === quote.id ? 'row-selected' : ''}
                      onClick={() => setSelectedQuoteId(quote.id)}
                    >
                      <td>
                        <div className="quote-name">{quote.clientName}</div>
                        <div className="quote-meta">
                          {quote.id} · {quote.segment}
                        </div>
                      </td>
                      <td>{quote.carrier}</td>
                      <td>
                        <span className={`status-pill status-${quote.status.toLowerCase().replace(/\s+/g, '-')}`}>
                          {quote.status}
                        </span>
                      </td>
                      <td>{currency.format(quote.premium)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredQuotes.length === 0 && (
                <div className="empty-state">No quotes match the current search.</div>
              )}
            </div>

            <aside className="detail-panel">
              <h2>Quote details</h2>
              {selectedQuote ? (
                <>
                  <dl className="detail-list">
                    <div>
                      <dt>Client</dt>
                      <dd>{selectedQuote.clientName}</dd>
                    </div>
                    <div>
                      <dt>Producer</dt>
                      <dd>{selectedQuote.producer}</dd>
                    </div>
                    <div>
                      <dt>Carrier</dt>
                      <dd>{selectedQuote.carrier}</dd>
                    </div>
                    <div>
                      <dt>Effective date</dt>
                      <dd>{selectedQuote.effectiveDate}</dd>
                    </div>
                    <div>
                      <dt>Revenue</dt>
                      <dd>{currency.format(selectedQuote.revenue)}</dd>
                    </div>
                    <div>
                      <dt>Note</dt>
                      <dd>{selectedQuote.note}</dd>
                    </div>
                  </dl>

                  <div className="action-row">
                    <button className="button button-success" onClick={() => updateQuoteStatus('Bound')}>
                      Mark bound
                    </button>
                    <button className="button button-danger" onClick={() => updateQuoteStatus('Lost')}>
                      Mark lost
                    </button>
                  </div>
                </>
              ) : (
                <p className="empty-state">Select a quote to view details.</p>
              )}
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
