import { useState } from 'react';
import Sidebar from './components/Sidebar';
import StatsBar from './components/StatsBar';
import FilterBar from './components/FilterBar';
import QuoteTable from './components/QuoteTable';
import QuotePipelineCards from './components/QuotePipelineCards';
import QuoteDetailPanel from './components/QuoteDetailPanel';
import AnalyticsPanel from './components/AnalyticsPanel';
import AlertsPanel from './components/AlertsPanel';
import CarrierPanel from './components/CarrierPanel';
import AIAssistant from './components/AIAssistant';
import type { FilterState, Quote, QuoteStatus } from './types';
import { useDashboardStats, useQuotes, getDaysUntilSla } from './hooks/useQuotes';
import { QUOTES as INITIAL_QUOTES } from './data/fakeData';

type Tab = 'dashboard' | 'pipeline' | 'analytics' | 'alerts' | 'carriers' | 'ai';

const DEFAULT_FILTERS: FilterState = {
  businessLine: 'All',
  segment: 'All',
  status: 'All',
  producer: '',
  carrier: '',
  priority: 'All',
  searchTerm: '',
  dateRange: 'all',
};

function getAlertCount(quotes: Quote[]): number {
  return quotes.filter((q) => {
    if (['Won', 'Lost', 'Declined'].includes(q.status)) return false;
    return q.isStalled || getDaysUntilSla(q.slaDeadline) <= 3;
  }).length;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('pipeline');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>(INITIAL_QUOTES);

  const stats = useDashboardStats(quotes);
  const filteredQuotes = useQuotes(filters, quotes);
  const alertCount = getAlertCount(quotes);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSelectedQuote(null);
  };

  const handleUpdateStatus = (id: string, status: QuoteStatus) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status } : q))
    );
  };

  const headerTitle: Record<Tab, string> = {
    dashboard: 'In-Flight Quotes — Dashboard',
    pipeline: 'Quote Pipeline',
    alerts: 'Alerts & Notifications',
    analytics: 'Analytics & Hit Ratios',
    carriers: 'Carrier Directory',
    ai: 'AI Assistant',
  };

  return (
    <div className="flex h-screen bg-[#F4F7FA] overflow-hidden">
      <Sidebar activeTab={activeTab} onChange={handleTabChange} alertCount={alertCount} />

      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-20 bg-white border-b border-[#D0DAE8] px-6 py-3 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-base font-semibold text-[#1A2B3C]">{headerTitle[activeTab]}</h1>
            <p className="text-xs text-[#7A95AB]">
              Brown &amp; Brown Insurance · As of April 23, 2025 · Demo Mode
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-[#EDF5FF] text-[#0078D4] border border-[#B3D0F2] rounded-full px-3 py-1 font-medium">
              🔗 Microsoft Dynamics 365 Connected
            </span>
            <div className="w-8 h-8 rounded-full bg-[#0078D4] flex items-center justify-center text-white text-xs font-bold">
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
                  <h2 className="font-semibold text-[#1A2B3C]">🚨 Needs Attention</h2>
                  <QuoteTable
                    quotes={filteredQuotes
                      .filter((q) => q.isStalled || getDaysUntilSla(q.slaDeadline) <= 3)
                      .slice(0, 8)}
                    onSelect={setSelectedQuote}
                  />
                </div>
                <div className="space-y-4">
                  <h2 className="font-semibold text-[#1A2B3C]">⚡ Active Alerts</h2>
                  <AlertsPanel />
                </div>
              </div>
            </>
          )}

          {activeTab === 'pipeline' && (
            <>
              <StatsBar stats={stats} />
              <FilterBar filters={filters} onChange={setFilters} />
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#4A5E70]">
                  Showing <strong>{filteredQuotes.length}</strong> quotes across 5 segments · 5 carriers
                </p>
                <span className="text-xs text-[#7A95AB]">
                  Sources: AMS360 · Sagitta · BenefitPoint · EPIC · Email Ingestion
                </span>
              </div>
              <QuotePipelineCards quotes={filteredQuotes} onSelect={setSelectedQuote} />
            </>
          )}

          {activeTab === 'alerts' && <AlertsPanel />}
          {activeTab === 'analytics' && <AnalyticsPanel />}
          {activeTab === 'carriers' && <CarrierPanel />}
          {activeTab === 'ai' && <AIAssistant />}
        </div>
      </main>

      {selectedQuote && (
        <QuoteDetailPanel
          quote={selectedQuote}
          onClose={() => setSelectedQuote(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}
