import { AlertTriangle, Clock, Building2, DollarSign, ChevronRight } from 'lucide-react';
import type { Quote, InsuranceSegment } from '../types';
import {
  formatCurrency,
  getDaysUntilSla,
  getStatusColor,
  getPriorityColor,
} from '../hooks/useQuotes';

interface Props {
  quotes: Quote[];
  onSelect: (q: Quote) => void;
}

const SEGMENT_ICONS: Record<InsuranceSegment, string> = {
  "Workers' Comp": '🦺',
  'Commercial Auto': '🚚',
  'General Liability': '🛡️',
  'Property': '🏢',
  'Professional Liability': '⚖️',
};

// Blue-grey segment colour palette
const SEGMENT_COLORS: Record<InsuranceSegment, { bg: string; border: string; badge: string; accent: string }> = {
  "Workers' Comp":       { bg: 'bg-[#EDF5FF]', border: 'border-[#B3D0F2]', badge: 'bg-[#B3D0F2] text-[#0078D4]',  accent: '#0078D4' },
  'Commercial Auto':     { bg: 'bg-[#E8F0FB]', border: 'border-[#8DB8E8]', badge: 'bg-[#8DB8E8] text-[#1B5FA8]',  accent: '#106EBE' },
  'General Liability':   { bg: 'bg-[#E4EDF7]', border: 'border-[#7A9CC6]', badge: 'bg-[#7A9CC6] text-[#1A3F6E]',  accent: '#2B6CB0' },
  'Property':            { bg: 'bg-[#E0EAF5]', border: 'border-[#6B8DB5]', badge: 'bg-[#6B8DB5] text-[#0C2340]',  accent: '#4B6EAF' },
  'Professional Liability': { bg: 'bg-[#DDE6F2]', border: 'border-[#5A7EA8]', badge: 'bg-[#5A7EA8] text-[#0F2D52]', accent: '#1B4F8C' },
};

const SEGMENTS: InsuranceSegment[] = [
  "Workers' Comp",
  'Commercial Auto',
  'General Liability',
  'Property',
  'Professional Liability',
];

function QuoteCard({ quote, onSelect }: { quote: Quote; onSelect: (q: Quote) => void }) {
  const slaDays = getDaysUntilSla(quote.slaDeadline);
  const colors = SEGMENT_COLORS[quote.segment];
  const isActive = ['Open', 'Submitted', 'Quoted', 'Stalled'].includes(quote.status);

  return (
    <div
      onClick={() => onSelect(quote)}
      className={`rounded-lg border ${colors.border} ${isActive ? colors.bg : 'bg-[#EBF0F8] border-[#D0DAE8]'} p-4 cursor-pointer hover:shadow-md transition-shadow group relative`}
    >
      {/* Stalled indicator */}
      {quote.isStalled && (
        <div className="absolute top-3 right-3">
          <AlertTriangle size={14} className="text-[#A4262C]" />
        </div>
      )}

      <div className="flex items-start justify-between mb-2 pr-5">
        <div>
          <div className="font-semibold text-[#1A2B3C] text-sm leading-tight">{quote.insuredName}</div>
          <div className="text-xs text-[#7A95AB] mt-0.5 font-mono">{quote.id}</div>
        </div>
      </div>

      {/* Status + Priority */}
      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(quote.status)}`}>
          {quote.status}
        </span>
        <span className={`text-xs font-semibold ${getPriorityColor(quote.priority)}`}>
          {quote.priority}
        </span>
      </div>

      {/* Carrier pills */}
      {quote.carriers.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {quote.carriers.slice(0, 3).map((c) => (
            <span key={c.carrierId} className="text-xs bg-white border border-[#D0DAE8] rounded px-1.5 py-0.5 text-[#4A5E70]">
              {c.carrierName}
            </span>
          ))}
          {quote.carriers.length > 3 && (
            <span className="text-xs text-[#7A95AB]">+{quote.carriers.length - 3}</span>
          )}
        </div>
      )}
      {quote.carriers.length === 0 && (
        <div className="text-xs text-[#7A95AB] italic mb-3">Awaiting submissions</div>
      )}

      {/* Bottom row */}
      <div className="flex items-center justify-between text-xs text-[#4A5E70]">
        <div className="flex items-center gap-1">
          <DollarSign size={12} />
          <span className="font-semibold text-[#1A2B3C]">{formatCurrency(quote.estimatedPremium)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={12} />
          <span className={slaDays < 0 ? 'text-[#A4262C] font-semibold' : slaDays <= 3 ? 'text-[#CA5010] font-semibold' : ''}>
            {slaDays < 0 ? `SLA ${Math.abs(slaDays)}d overdue` : `SLA ${slaDays}d`}
          </span>
        </div>
        <ChevronRight size={12} className="text-[#B0C4D4] group-hover:text-[#4A5E70] transition-colors" />
      </div>

      {/* Producer */}
      <div className="flex items-center gap-1 mt-2 text-xs text-[#7A95AB]">
        <Building2 size={11} />
        <span>{quote.producer}</span>
        {quote.location && <span>· {quote.location}</span>}
      </div>
    </div>
  );
}

function SegmentColumn({
  segment,
  quotes,
  onSelect,
}: {
  segment: InsuranceSegment;
  quotes: Quote[];
  onSelect: (q: Quote) => void;
}) {
  const colors = SEGMENT_COLORS[segment];
  const totalPremium = quotes
    .filter((q) => ['Open', 'Submitted', 'Quoted', 'Stalled'].includes(q.status))
    .reduce((sum, q) => sum + q.estimatedPremium, 0);
  const activeCount = quotes.filter((q) =>
    ['Open', 'Submitted', 'Quoted', 'Stalled'].includes(q.status)
  ).length;

  return (
    <div className="flex flex-col min-w-[280px] max-w-[300px]">
      {/* Column header */}
      <div className={`rounded-t-lg border-x border-t ${colors.border} ${colors.bg} px-4 py-3`}
           style={{ borderTop: `3px solid ${colors.accent}` }}>
        <div className="flex items-center gap-2">
          <span className="text-xl">{SEGMENT_ICONS[segment]}</span>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-[#1A2B3C] text-sm">{segment}</div>
            <div className="text-xs text-[#4A5E70] mt-0.5">
              {activeCount} active · {formatCurrency(totalPremium)}
            </div>
          </div>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>
            {quotes.length}
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className={`flex-1 border-x border-b ${colors.border} rounded-b-lg bg-white/70 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-320px)]`}>
        {quotes.length === 0 ? (
          <div className="text-center text-sm text-[#7A95AB] italic py-8">No quotes in this segment</div>
        ) : (
          quotes.map((q) => (
            <QuoteCard key={q.id} quote={q} onSelect={onSelect} />
          ))
        )}
      </div>
    </div>
  );
}

export default function QuotePipelineCards({ quotes, onSelect }: Props) {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 pb-4" style={{ minWidth: 'max-content' }}>
        {SEGMENTS.map((segment) => (
          <SegmentColumn
            key={segment}
            segment={segment}
            quotes={quotes.filter((q) => q.segment === segment)}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
