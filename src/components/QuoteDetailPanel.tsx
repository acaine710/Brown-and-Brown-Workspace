import { X, AlertTriangle, Clock, Building2, MapPin, Users, DollarSign, CheckCircle2, XCircle } from 'lucide-react';
import type { Quote, QuoteStatus } from '../types';
import {
  formatCurrency,
  getDaysUntilSla,
  getSlaColor,
  getStatusColor,
  getPriorityColor,
  getBusinessLineIcon,
} from '../hooks/useQuotes';

interface Props {
  quote: Quote;
  onClose: () => void;
  onUpdateStatus: (id: string, status: QuoteStatus) => void;
}

function CoverageBar({ score }: { score: number }) {
  const color =
    score >= 90 ? 'bg-emerald-500' : score >= 75 ? 'bg-blue-500' : 'bg-yellow-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-gray-600 w-7 text-right">{score}</span>
    </div>
  );
}

export default function QuoteDetailPanel({ quote, onClose, onUpdateStatus }: Props) {
  const slaDays = getDaysUntilSla(quote.slaDeadline);
  const slaColor = getSlaColor(slaDays);
  const bestCarrier = quote.carriers.reduce(
    (best, c) => (!best || c.coverageScore > best.coverageScore ? c : best),
    null as typeof quote.carriers[0] | null
  );
  const cheapestCarrier = quote.carriers.reduce(
    (best, c) => (!best || c.premium < best.premium ? c : best),
    null as typeof quote.carriers[0] | null
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="flex-1 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="w-full max-w-2xl bg-white shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-start justify-between z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{getBusinessLineIcon(quote.businessLine)}</span>
              <h2 className="text-lg font-bold text-gray-900">{quote.insuredName}</h2>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-xs text-gray-400">{quote.id}</span>
              <span
                className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  quote.status
                )}`}
              >
                {quote.status}
              </span>
              <span className={`text-xs font-semibold ${getPriorityColor(quote.priority)}`}>
                {quote.priority} Priority
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Stalled Warning */}
          {quote.isStalled && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
              <AlertTriangle size={20} className="shrink-0" />
              <div>
                <div className="font-semibold">Stalled – {quote.stalledDays} days with no activity</div>
                <div className="text-sm">Last activity: {quote.lastActivity}. Immediate follow-up required.</div>
              </div>
            </div>
          )}

          {/* SLA Timer */}
          <div className={`flex items-center gap-3 rounded-xl p-4 border ${slaColor}`}>
            <Clock size={20} className="shrink-0" />
            <div>
              <div className="font-semibold">
                {slaDays < 0
                  ? `SLA Overdue by ${Math.abs(slaDays)} days`
                  : slaDays === 0
                  ? 'SLA Due Today'
                  : `SLA: ${slaDays} days remaining`}
              </div>
              <div className="text-sm">Deadline: {quote.slaDeadline}</div>
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Detail icon={<Building2 size={14} />} label="Business Line" value={quote.businessLine} />
              <Detail icon={<Users size={14} />} label="Producer" value={quote.producer} />
              <Detail icon={<Users size={14} />} label="Account Executive" value={quote.accountExecutive} />
              <Detail icon={<DollarSign size={14} />} label="Estimated Premium" value={formatCurrency(quote.estimatedPremium)} bold />
            </div>
            <div className="space-y-3">
              {quote.industry && <Detail icon={<Building2 size={14} />} label="Industry" value={quote.industry} />}
              {quote.location && <Detail icon={<MapPin size={14} />} label="Location" value={quote.location} />}
              {quote.employeeCount && <Detail icon={<Users size={14} />} label="Employees" value={quote.employeeCount.toLocaleString()} />}
              {quote.revenue && <Detail icon={<DollarSign size={14} />} label="Revenue" value={formatCurrency(quote.revenue)} />}
              <Detail icon={<Clock size={14} />} label="AMS Source" value={quote.amsSource} />
              <Detail icon={<Clock size={14} />} label="Effective Date" value={quote.effectiveDate} />
            </div>
          </div>

          {/* Carrier Comparison */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">
              Carrier Quotes ({quote.carriers.length})
            </h3>
            {quote.carriers.length === 0 ? (
              <div className="text-sm text-gray-400 italic">
                No carrier responses yet. Submission pending.
              </div>
            ) : (
              <div className="space-y-3">
                {quote.carriers
                  .sort((a, b) => b.coverageScore - a.coverageScore)
                  .map((c) => {
                    const isBest = c.carrierId === bestCarrier?.carrierId;
                    const isCheapest = c.carrierId === cheapestCarrier?.carrierId;
                    return (
                      <div
                        key={c.carrierId}
                        className={`rounded-xl border p-4 ${
                          isBest ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-800">{c.carrierName}</span>
                            {isBest && (
                              <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-medium">
                                Best Coverage
                              </span>
                            )}
                            {isCheapest && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">
                                Lowest Premium
                              </span>
                            )}
                          </div>
                          <span className="text-lg font-bold text-gray-900">
                            {formatCurrency(c.premium)}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-xs text-gray-500 mb-2">
                          <div>
                            <div className="font-medium text-gray-700">Deductible</div>
                            <div>{formatCurrency(c.deductible)}</div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-700">Limit</div>
                            <div>{formatCurrency(c.limit)}</div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-700">Response</div>
                            <div>{c.responseDate ?? 'Pending'}</div>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Coverage Score</div>
                          <CoverageBar score={c.coverageScore} />
                        </div>
                        {c.notes && (
                          <div className="mt-2 text-xs text-gray-500 italic">{c.notes}</div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Notes */}
          {quote.notes && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Notes</h3>
              <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4">{quote.notes}</p>
            </div>
          )}

          {/* Actions: Mark as Bound / Mark as Lost */}
          {!['Won', 'Lost', 'Declined'].includes(quote.status) && (
            <div className="border-t border-gray-100 pt-4">
              <h3 className="font-semibold text-gray-800 mb-3">Update Quote Outcome</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => { onUpdateStatus(quote.id, 'Won'); onClose(); }}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-colors"
                >
                  <CheckCircle2 size={16} />
                  Mark as Bound
                </button>
                <button
                  onClick={() => { onUpdateStatus(quote.id, 'Lost'); onClose(); }}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold text-sm py-2.5 px-4 rounded-xl transition-colors"
                >
                  <XCircle size={16} />
                  Mark as Lost
                </button>
              </div>
            </div>
          )}
          {quote.status === 'Won' && (
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                <CheckCircle2 size={16} />
                <span className="font-semibold text-sm">Quote Bound – Policy Issued</span>
              </div>
            </div>
          )}
          {quote.status === 'Lost' && (
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2 text-gray-600 bg-gray-50 border border-gray-200 rounded-xl p-3">
                <XCircle size={16} />
                <span className="font-semibold text-sm">Quote Lost – Closed</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
  bold,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-gray-400 mt-0.5">{icon}</span>
      <div>
        <div className="text-xs text-gray-400">{label}</div>
        <div className={`text-sm text-gray-800 ${bold ? 'font-bold text-base' : ''}`}>{value}</div>
      </div>
    </div>
  );
}
