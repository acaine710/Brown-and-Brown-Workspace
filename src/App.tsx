import { useState } from 'react';
import Sidebar from './components/Sidebar';
import StatsBar from './components/StatsBar';
import FilterBar from './components/FilterBar';
import QuoteTable from './components/QuoteTable';
import QuoteDetailPanel from './components/QuoteDetailPanel';
import AnalyticsPanel from './components/AnalyticsPanel';
import AlertsPanel from './components/AlertsPanel';
import CarrierPanel from './components/CarrierPanel';
import type { FilterState, Quote } from './types';
import { useDashboardStats, useQuotes, getDaysUntilSla } from './hooks/useQuotes';
import { QUOTES } from './data/fakeData';

type Tab = 'dashboard' | 'quotes' | 'analytics' | 'alerts' | 'carriers';

const DEFAULT_FILTERS: FilterState = {
  businessLine: 'All',
  status: 'All',
  producer: '',
  carrier: '',
  priority: 'All',
  searchTerm: '',
  dateRange: 'all',
};

function getAlertCount(): number {
  return QUOTES.filter((q) => {
    if (['Won', 'Lost', 'Declined'].includes(q.status)) return false;
    return q.isStalled || getDaysUntilSla(q.slaDeadline) <= 3;
  }).length;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  const stats = useDashboardStats();
  const filteredQuotes = useQuotes(filters);
  const alertCount = getAlertCount();

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSelectedQuote(null);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} onChange={handleTabChange} alertCount={alertCount} />

      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-base font-bold text-gray-900">
              {activeTab === 'dashboard' && 'In-Flight Quotes — Dashboard'}
              {activeTab === 'quotes' && 'All Open Quotes'}
              {activeTab === 'alerts' && 'Alerts & Notifications'}
              {activeTab === 'analytics' && 'Analytics & Hit Ratios'}
              {activeTab === 'carriers' && 'Carrier Directory'}
            </h1>
            <p className="text-xs text-gray-400">
              Brown &amp; Brown Insurance · As of April 23, 2025 · Demo Mode
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1 font-medium">
              🔗 Microsoft Dynamics 365 Connected
            </span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
              BB
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {activeTab === 'dashboard' && (
            <>
              <StatsBar stats={stats} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 space-y-4">
                  <h2 className="font-semibold text-gray-700">🚨 Needs Attention</h2>
                  <QuoteTable
                    quotes={filteredQuotes
                      .filter((q) => q.isStalled || getDaysUntilSla(q.slaDeadline) <= 3)
                      .slice(0, 8)}
                    onSelect={setSelectedQuote}
                  />
                </div>
                <div className="space-y-4">
                  <h2 className="font-semibold text-gray-700">⚡ Active Alerts</h2>
                  <AlertsPanel />
                </div>
              </div>
            </>
          )}

          {activeTab === 'quotes' && (
            <>
              <FilterBar filters={filters} onChange={setFilters} />
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing <strong>{filteredQuotes.length}</strong> quotes
                </p>
                <span className="text-xs text-gray-400">
                  Sources: AMS360 · Sagitta · BenefitPoint · EPIC · Email Ingestion
                </span>
              </div>
              <QuoteTable quotes={filteredQuotes} onSelect={setSelectedQuote} />
            </>
          )}

          {activeTab === 'alerts' && <AlertsPanel />}
          {activeTab === 'analytics' && <AnalyticsPanel />}
          {activeTab === 'carriers' && <CarrierPanel />}
        </div>
      </main>

      {selectedQuote && (
        <QuoteDetailPanel
          quote={selectedQuote}
          onClose={() => setSelectedQuote(null)}
        />
      )}
    </div>
  );
}
