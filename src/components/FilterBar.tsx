import { Search, SlidersHorizontal } from 'lucide-react';
import type { FilterState, BusinessLine, QuoteStatus, Priority, InsuranceSegment } from '../types';
import { PRODUCERS } from '../data/fakeData';

const BUSINESS_LINES: (BusinessLine | 'All')[] = [
  'All',
  'Personal Lines',
  'P&C Small Commercial',
  'P&C Mid-Market Commercial',
  'P&C Large Commercial',
  'Employee Benefits',
  'Dealer Services',
  'Surety / Bonds',
];

const SEGMENTS: (InsuranceSegment | 'All')[] = [
  'All',
  "Workers' Comp",
  'Commercial Auto',
  'General Liability',
  'Property',
  'Professional Liability',
];

const CARRIERS = [
  '',
  'Liberty Mutual',
  'Travelers',
  'The Hartford',
  'Chubb',
  'Nationwide',
];

const STATUSES: (QuoteStatus | 'All')[] = [
  'All',
  'Open',
  'Submitted',
  'Quoted',
  'Stalled',
  'Won',
  'Lost',
];

const PRIORITIES: (Priority | 'All')[] = ['All', 'High', 'Medium', 'Low'];

interface Props {
  filters: FilterState;
  onChange: (f: FilterState) => void;
}

export default function FilterBar({ filters, onChange }: Props) {
  const set = (partial: Partial<FilterState>) => onChange({ ...filters, ...partial });

  const selectCls = "text-sm border border-[#EDEBE9] rounded px-2 py-1.5 bg-white text-[#323130] focus:outline-none focus:ring-2 focus:ring-[#0078D4]/40";

  return (
    <div className="bg-white border border-[#EDEBE9] rounded-lg p-4 flex flex-wrap gap-3 items-center shadow-sm">
      <SlidersHorizontal size={16} className="text-[#A19F9D] shrink-0" />

      {/* Search */}
      <div className="relative flex-1 min-w-[180px]">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A19F9D]" />
        <input
          type="text"
          placeholder="Search insured, ID, producer…"
          value={filters.searchTerm}
          onChange={(e) => set({ searchTerm: e.target.value })}
          className={`pl-8 pr-3 py-1.5 text-sm border border-[#EDEBE9] rounded w-full bg-white text-[#323130] placeholder-[#A19F9D] focus:outline-none focus:ring-2 focus:ring-[#0078D4]/40`}
        />
      </div>

      {/* Segment */}
      <select value={filters.segment} onChange={(e) => set({ segment: e.target.value as InsuranceSegment | 'All' })} className={selectCls}>
        {SEGMENTS.map((s) => (
          <option key={s} value={s}>{s === 'All' ? '🗂 All Segments' : s}</option>
        ))}
      </select>

      {/* Carrier */}
      <select value={filters.carrier} onChange={(e) => set({ carrier: e.target.value })} className={selectCls}>
        {CARRIERS.map((c) => (
          <option key={c} value={c}>{c === '' ? 'All Carriers' : c}</option>
        ))}
      </select>

      {/* Status */}
      <select value={filters.status} onChange={(e) => set({ status: e.target.value as QuoteStatus | 'All' })} className={selectCls}>
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
        ))}
      </select>

      {/* Priority */}
      <select value={filters.priority} onChange={(e) => set({ priority: e.target.value as Priority | 'All' })} className={selectCls}>
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>{p === 'All' ? 'All Priorities' : `${p} Priority`}</option>
        ))}
      </select>

      {/* Producer */}
      <select value={filters.producer} onChange={(e) => set({ producer: e.target.value })} className={selectCls}>
        <option value="">All Producers</option>
        {PRODUCERS.map((p) => (
          <option key={p.id} value={p.name}>{p.name}</option>
        ))}
      </select>

      {/* Business Line */}
      <select value={filters.businessLine} onChange={(e) => set({ businessLine: e.target.value as BusinessLine | 'All' })} className={selectCls}>
        {BUSINESS_LINES.map((bl) => (
          <option key={bl} value={bl}>{bl === 'All' ? 'All Lines' : bl}</option>
        ))}
      </select>

      {/* Date Range */}
      <select value={filters.dateRange} onChange={(e) => set({ dateRange: e.target.value as FilterState['dateRange'] })} className={selectCls}>
        <option value="all">All Time</option>
        <option value="90d">Last 90 Days</option>
        <option value="30d">Last 30 Days</option>
        <option value="7d">Last 7 Days</option>
      </select>

      {/* Reset */}
      <button
        onClick={() => onChange({ businessLine: 'All', segment: 'All', status: 'All', producer: '', carrier: '', priority: 'All', searchTerm: '', dateRange: 'all' })}
        className="text-xs text-[#0078D4] hover:text-[#005A9E] underline whitespace-nowrap"
      >
        Reset
      </button>
    </div>
  );
}
