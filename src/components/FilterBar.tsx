import { Search, SlidersHorizontal } from 'lucide-react';
import type { FilterState, BusinessLine, QuoteStatus, Priority } from '../types';
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

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap gap-3 items-center shadow-sm">
      <SlidersHorizontal size={16} className="text-gray-400 shrink-0" />

      {/* Search */}
      <div className="relative flex-1 min-w-[180px]">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search insured, ID, producer…"
          value={filters.searchTerm}
          onChange={(e) => set({ searchTerm: e.target.value })}
          className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Business Line */}
      <select
        value={filters.businessLine}
        onChange={(e) => set({ businessLine: e.target.value as BusinessLine | 'All' })}
        className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        {BUSINESS_LINES.map((bl) => (
          <option key={bl} value={bl}>
            {bl === 'All' ? '🗂 All Lines' : bl}
          </option>
        ))}
      </select>

      {/* Status */}
      <select
        value={filters.status}
        onChange={(e) => set({ status: e.target.value as QuoteStatus | 'All' })}
        className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s === 'All' ? 'All Statuses' : s}
          </option>
        ))}
      </select>

      {/* Priority */}
      <select
        value={filters.priority}
        onChange={(e) => set({ priority: e.target.value as Priority | 'All' })}
        className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p === 'All' ? 'All Priorities' : `${p} Priority`}
          </option>
        ))}
      </select>

      {/* Producer */}
      <select
        value={filters.producer}
        onChange={(e) => set({ producer: e.target.value })}
        className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <option value="">All Producers</option>
        {PRODUCERS.map((p) => (
          <option key={p.id} value={p.name}>
            {p.name}
          </option>
        ))}
      </select>

      {/* Date Range */}
      <select
        value={filters.dateRange}
        onChange={(e) =>
          set({ dateRange: e.target.value as FilterState['dateRange'] })
        }
        className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <option value="all">All Time</option>
        <option value="90d">Last 90 Days</option>
        <option value="30d">Last 30 Days</option>
        <option value="7d">Last 7 Days</option>
      </select>

      {/* Reset */}
      <button
        onClick={() =>
          onChange({
            businessLine: 'All',
            status: 'All',
            producer: '',
            carrier: '',
            priority: 'All',
            searchTerm: '',
            dateRange: 'all',
          })
        }
        className="text-xs text-blue-600 hover:text-blue-800 underline whitespace-nowrap"
      >
        Reset
      </button>
    </div>
  );
}
