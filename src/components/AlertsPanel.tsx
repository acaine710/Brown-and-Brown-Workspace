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
        <div className="bg-[#DFF6DD] border border-[#92C353] rounded-lg p-6 text-center text-[#107C10]">
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
      bg: 'bg-[#FDE7E9]',
      border: 'border-[#F1707B]',
      badge: 'bg-[#F1707B]/20 text-[#A4262C]',
      header: 'text-[#A4262C]',
      icon: <AlertTriangle size={16} className="text-[#A4262C]" />,
    },
    orange: {
      bg: 'bg-[#FAF6ED]',
      border: 'border-[#CA5010]',
      badge: 'bg-[#CA5010]/15 text-[#CA5010]',
      header: 'text-[#CA5010]',
      icon: <Clock size={16} className="text-[#CA5010]" />,
    },
    purple: {
      bg: 'bg-[#E4EDF7]',
      border: 'border-[#4B6EAF]',
      badge: 'bg-[#4B6EAF]/15 text-[#4B6EAF]',
      header: 'text-[#4B6EAF]',
      icon: <AlertTriangle size={16} className="text-[#4B6EAF]" />,
    },
  };
  const c = colorMap[color];

  return (
    <div className={`rounded-lg border ${c.border} ${c.bg} overflow-hidden`}>
      <div className={`px-4 py-3 border-b ${c.border} flex items-center gap-2 ${c.header} font-semibold text-sm`}>
        {c.icon}
        {title}
      </div>
      <div className="divide-y divide-white/60">
        {items.map((item) => (
          <div key={item.id} className="px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="font-medium text-[#1A2B3C] truncate">{item.title}</div>
              <div className="text-xs text-[#4A5E70] truncate">{item.sub}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${c.badge}`}>
                {item.badge}
              </span>
              <span className="text-sm font-bold text-[#1A2B3C]">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
