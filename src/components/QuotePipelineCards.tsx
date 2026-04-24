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

// Microsoft-aligned segment colour palette (blue family + semantic green/purple)
const SEGMENT_COLORS: Record<InsuranceSegment, { bg: string; border: string; badge: string; accent: string }> = {
  "Workers' Comp":       { bg: 'bg-[#EFF6FC]', border: 'border-[#C7E0F4]', badge: 'bg-[#C7E0F4] text-[#0078D4]',  accent: '#0078D4' },
  'Commercial Auto':     { bg: 'bg-[#E8F1FA]', border: 'border-[#A9D3F0]', badge: 'bg-[#A9D3F0] text-[#004578]',  accent: '#106EBE' },
  'General Liability':   { bg: 'bg-[#DFF6DD]', border: 'border-[#92C353]', badge: 'bg-[#92C353] text-[#107C10]',  accent: '#107C10' },
  'Property':            { bg: 'bg-[#F4F0FF]', border: 'border-[#B4A0D2]', badge: 'bg-[#B4A0D2] text-[#6B007B]',  accent: '#8764B8' },
  'Professional Liability': { bg: 'bg-[#DEECF9]', border: 'border-[#83BDED]', badge: 'bg-[#83BDED] text-[#004578]', accent: '#005A9E' },
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
      className={`rounded-lg border ${colors.border} ${isActive ? colors.bg : 'bg-[#F3F2F1] border-[#EDEBE9]'} p-4 cursor-pointer hover:shadow-md transition-shadow group relative`}
    >
      {/* Stalled indicator */}
      {quote.isStalled && (
        <div className="absolute top-3 right-3">
          <AlertTriangle size={14} className="text-[#A4262C]" />
        </div>
      )}

      <div className="flex items-start justify-between mb-2 pr-5">
        <div>
          <div className="font-semibold text-[#323130] text-sm leading-tight">{quote.insuredName}</div>
          <div className="text-xs text-[#A19F9D] mt-0.5 font-mono">{quote.id}</div>
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
            <span key={c.carrierId} className="text-xs bg-white border border-[#EDEBE9] rounded px-1.5 py-0.5 text-[#605E5C]">
              {c.carrierName}
            </span>
          ))}
          {quote.carriers.length > 3 && (
            <span className="text-xs text-[#A19F9D]">+{quote.carriers.length - 3}</span>
          )}
        </div>
      )}
      {quote.carriers.length === 0 && (
        <div className="text-xs text-[#A19F9D] italic mb-3">Awaiting submissions</div>
      )}

      {/* Bottom row */}
      <div className="flex items-center justify-between text-xs text-[#605E5C]">
        <div className="flex items-center gap-1">
          <DollarSign size={12} />
          <span className="font-semibold text-[#323130]">{formatCurrency(quote.estimatedPremium)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={12} />
          <span className={slaDays < 0 ? 'text-[#A4262C] font-semibold' : slaDays <= 3 ? 'text-[#CA5010] font-semibold' : ''}>
            {slaDays < 0 ? `SLA ${Math.abs(slaDays)}d overdue` : `SLA ${slaDays}d`}
          </span>
        </div>
        <ChevronRight size={12} className="text-[#C8C6C4] group-hover:text-[#605E5C] transition-colors" />
      </div>

      {/* Producer */}
      <div className="flex items-center gap-1 mt-2 text-xs text-[#A19F9D]">
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
            <div className="font-bold text-[#323130] text-sm">{segment}</div>
            <div className="text-xs text-[#605E5C] mt-0.5">
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
          <div className="text-center text-sm text-[#A19F9D] italic py-8">No quotes in this segment</div>
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
