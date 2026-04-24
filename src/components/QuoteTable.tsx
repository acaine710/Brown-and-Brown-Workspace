import { AlertTriangle, ChevronRight, Clock, FileText } from 'lucide-react';
import type { Quote } from '../types';
import {
  formatCurrency,
  getDaysUntilSla,
  getSlaColor,
  getStatusColor,
  getPriorityColor,
  getBusinessLineIcon,
} from '../hooks/useQuotes';

interface Props {
  quotes: Quote[];
  onSelect: (q: Quote) => void;
}

export default function QuoteTable({ quotes, onSelect }: Props) {
  if (quotes.length === 0) {
    return (
      <div className="bg-white border border-[#D0DAE8] rounded-lg p-12 text-center text-[#7A95AB]">
        <FileText size={40} className="mx-auto mb-3 opacity-40" />
        <p className="text-lg font-medium">No quotes match your filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#D0DAE8] rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#EBF0F8] border-b border-[#D0DAE8]">
            <tr>
              {[
                'Quote ID',
                'Insured',
                'Line',
                'Status',
                'Priority',
                'Producer',
                'Est. Premium',
                'Carriers',
                'SLA',
                'Stalled',
                '',
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-[#7A95AB] uppercase tracking-wide whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EBF0F8]">
            {quotes.map((q) => {
              const slaDays = getDaysUntilSla(q.slaDeadline);
              const slaColor = getSlaColor(slaDays);
              return (
                <tr
                  key={q.id}
                  onClick={() => onSelect(q)}
                  className={`cursor-pointer hover:bg-[#EDF5FF] transition-colors ${
                    q.isStalled ? 'bg-[#FDE7E9]/30' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-xs text-[#7A95AB]">{q.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-[#1A2B3C] whitespace-nowrap">{q.insuredName}</div>
                    {q.industry && (
                      <div className="text-xs text-[#7A95AB]">{q.industry}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-base mr-1">{getBusinessLineIcon(q.businessLine)}</span>
                    <span className="text-[#4A5E70]">{q.businessLine}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(
                        q.status
                      )}`}
                    >
                      {q.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold text-xs ${getPriorityColor(q.priority)}`}>
                      {q.priority === 'High' ? '▲' : q.priority === 'Medium' ? '■' : '▼'}{' '}
                      {q.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#4A5E70] whitespace-nowrap">{q.producer}</td>
                  <td className="px-4 py-3 font-semibold text-[#1A2B3C] whitespace-nowrap">
                    {formatCurrency(q.estimatedPremium)}
                  </td>
                  <td className="px-4 py-3 text-[#4A5E70]">{q.carriers.length} / quoted</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${slaColor}`}
                    >
                      <Clock size={11} />
                      {slaDays < 0
                        ? `${Math.abs(slaDays)}d overdue`
                        : slaDays === 0
                        ? 'Today'
                        : `${slaDays}d`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {q.isStalled && (
                      <span className="inline-flex items-center gap-1 text-xs text-[#A4262C] font-medium">
                        <AlertTriangle size={12} />
                        {q.stalledDays}d
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#B0C4D4]">
                    <ChevronRight size={16} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
