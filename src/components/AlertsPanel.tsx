import { AlertTriangle, Clock } from 'lucide-react';
import { QUOTES } from '../data/fakeData';
import { formatCurrency, getDaysUntilSla } from '../hooks/useQuotes';

export default function AlertsPanel() {
  const stalled = QUOTES.filter((q) => q.isStalled);
  const overdue = QUOTES.filter((q) => {
    const d = getDaysUntilSla(q.slaDeadline);
    return d < 0 && !['Won', 'Lost', 'Declined'].includes(q.status);
  });
  const dueSoon = QUOTES.filter((q) => {
    const d = getDaysUntilSla(q.slaDeadline);
    return d >= 0 && d <= 3 && !['Won', 'Lost', 'Declined'].includes(q.status);
  });

  return (
    <div className="space-y-4">
      {/* Overdue SLAs */}
      {overdue.length > 0 && (
        <AlertSection
          title={`⚠️ SLA Overdue (${overdue.length})`}
          color="red"
          items={overdue.map((q) => ({
            id: q.id,
            title: q.insuredName,
            sub: `${q.producer} · ${q.businessLine}`,
            badge: `${Math.abs(getDaysUntilSla(q.slaDeadline))}d overdue`,
            value: formatCurrency(q.estimatedPremium),
          }))}
        />
      )}

      {/* Due Soon */}
      {dueSoon.length > 0 && (
        <AlertSection
          title={`⏱ Due Within 3 Days (${dueSoon.length})`}
          color="orange"
          items={dueSoon.map((q) => ({
            id: q.id,
            title: q.insuredName,
            sub: `${q.producer} · ${q.businessLine}`,
            badge: `${getDaysUntilSla(q.slaDeadline)}d left`,
            value: formatCurrency(q.estimatedPremium),
          }))}
        />
      )}

      {/* Stalled Quotes */}
      {stalled.length > 0 && (
        <AlertSection
          title={`🚫 Stalled Quotes (${stalled.length})`}
          color="purple"
          items={stalled.map((q) => ({
            id: q.id,
            title: q.insuredName,
            sub: `${q.producer} · Last activity: ${q.lastActivity}`,
            badge: `${q.stalledDays}d stalled`,
            value: formatCurrency(q.estimatedPremium),
          }))}
        />
      )}

      {overdue.length === 0 && dueSoon.length === 0 && stalled.length === 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center text-emerald-700">
          <div className="text-2xl mb-2">✅</div>
          <p className="font-semibold">All clear! No alerts at this time.</p>
        </div>
      )}
    </div>
  );
}

interface AlertItem {
  id: string;
  title: string;
  sub: string;
  badge: string;
  value: string;
}

function AlertSection({
  title,
  color,
  items,
}: {
  title: string;
  color: 'red' | 'orange' | 'purple';
  items: AlertItem[];
}) {
  const colorMap = {
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      badge: 'bg-red-100 text-red-700',
      header: 'text-red-800',
      icon: <AlertTriangle size={16} className="text-red-500" />,
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      badge: 'bg-orange-100 text-orange-700',
      header: 'text-orange-800',
      icon: <Clock size={16} className="text-orange-500" />,
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      badge: 'bg-purple-100 text-purple-700',
      header: 'text-purple-800',
      icon: <AlertTriangle size={16} className="text-purple-500" />,
    },
  };
  const c = colorMap[color];

  return (
    <div className={`rounded-xl border ${c.border} ${c.bg} overflow-hidden`}>
      <div className={`px-4 py-3 border-b ${c.border} flex items-center gap-2 ${c.header} font-semibold text-sm`}>
        {c.icon}
        {title}
      </div>
      <div className="divide-y divide-white/60">
        {items.map((item) => (
          <div key={item.id} className="px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="font-medium text-gray-800 truncate">{item.title}</div>
              <div className="text-xs text-gray-500 truncate">{item.sub}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.badge}`}>
                {item.badge}
              </span>
              <span className="text-sm font-bold text-gray-700">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
