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
      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-400">
        <FileText size={40} className="mx-auto mb-3 opacity-40" />
        <p className="text-lg font-medium">No quotes match your filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
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
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {quotes.map((q) => {
              const slaDays = getDaysUntilSla(q.slaDeadline);
              const slaColor = getSlaColor(slaDays);
              return (
                <tr
                  key={q.id}
                  onClick={() => onSelect(q)}
                  className={`cursor-pointer hover:bg-blue-50 transition-colors ${
                    q.isStalled ? 'bg-red-50/40' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{q.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 whitespace-nowrap">{q.insuredName}</div>
                    {q.industry && (
                      <div className="text-xs text-gray-400">{q.industry}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-base mr-1">{getBusinessLineIcon(q.businessLine)}</span>
                    <span className="text-gray-600">{q.businessLine}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
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
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{q.producer}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">
                    {formatCurrency(q.estimatedPremium)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{q.carriers.length} / quoted</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${slaColor}`}
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
                      <span className="inline-flex items-center gap-1 text-xs text-red-600 font-medium">
                        <AlertTriangle size={12} />
                        {q.stalledDays}d
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
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
