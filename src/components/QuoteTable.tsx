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
      <div className="bg-white border border-[#EDEBE9] rounded-lg p-12 text-center text-[#A19F9D]">
        <FileText size={40} className="mx-auto mb-3 opacity-40" />
        <p className="text-lg font-medium">No quotes match your filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#EDEBE9] rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#F3F2F1] border-b border-[#EDEBE9]">
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
                  className="px-4 py-3 text-left text-xs font-semibold text-[#A19F9D] uppercase tracking-wide whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3F2F1]">
            {quotes.map((q) => {
              const slaDays = getDaysUntilSla(q.slaDeadline);
              const slaColor = getSlaColor(slaDays);
              return (
                <tr
                  key={q.id}
                  onClick={() => onSelect(q)}
                  className={`cursor-pointer hover:bg-[#EFF6FC] transition-colors ${
                    q.isStalled ? 'bg-[#FDE7E9]/30' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-xs text-[#A19F9D]">{q.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-[#323130] whitespace-nowrap">{q.insuredName}</div>
                    {q.industry && (
                      <div className="text-xs text-[#A19F9D]">{q.industry}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-base mr-1">{getBusinessLineIcon(q.businessLine)}</span>
                    <span className="text-[#605E5C]">{q.businessLine}</span>
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
                  <td className="px-4 py-3 text-[#605E5C] whitespace-nowrap">{q.producer}</td>
                  <td className="px-4 py-3 font-semibold text-[#323130] whitespace-nowrap">
                    {formatCurrency(q.estimatedPremium)}
                  </td>
                  <td className="px-4 py-3 text-[#605E5C]">{q.carriers.length} / quoted</td>
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
                  <td className="px-4 py-3 text-[#C8C6C4]">
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
