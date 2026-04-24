import {
  AlertCircle,
  Clock,
  DollarSign,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import type { DashboardStats } from '../types';
import { formatCurrency } from '../hooks/useQuotes';

interface Props {
  stats: DashboardStats;
}

export default function StatsBar({ stats }: Props) {
  const cards = [
    {
      label: 'Active Quotes',
      value: stats.totalOpen,
      icon: <Zap size={20} />,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
    },
    {
      label: 'Stalled',
      value: stats.stalled,
      icon: <AlertCircle size={20} />,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      sub: 'Needs attention',
    },
    {
      label: 'Expiring Soon',
      value: stats.expiringCount,
      icon: <Clock size={20} />,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      sub: 'Within 30 days',
    },
    {
      label: 'Pipeline Value',
      value: formatCurrency(stats.estimatedPremiumInFlight),
      icon: <DollarSign size={20} />,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
    },
    {
      label: 'Hit Ratio (YTD)',
      value: `${stats.overallHitRatio}%`,
      icon: <Target size={20} />,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      border: 'border-violet-200',
    },
    {
      label: 'Avg Response Time',
      value: `${stats.avgResponseTime}d`,
      icon: <TrendingUp size={20} />,
      color: 'text-sky-600',
      bg: 'bg-sky-50',
      border: 'border-sky-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`rounded-xl border ${c.border} ${c.bg} p-4 flex flex-col gap-1`}
        >
          <div className={`flex items-center gap-1.5 ${c.color} text-xs font-semibold uppercase tracking-wide`}>
            {c.icon}
            {c.label}
          </div>
          <div className={`text-2xl font-bold ${c.color}`}>{c.value}</div>
          {c.sub && <div className="text-xs text-gray-500">{c.sub}</div>}
        </div>
      ))}
    </div>
  );
}
