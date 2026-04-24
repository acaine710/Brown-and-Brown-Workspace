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
      icon: <Zap size={18} />,
      accent: '#0078D4',
      textColor: 'text-[#0078D4]',
    },
    {
      label: 'Stalled',
      value: stats.stalled,
      icon: <AlertCircle size={18} />,
      accent: '#A4262C',
      textColor: 'text-[#A4262C]',
      sub: 'Needs attention',
    },
    {
      label: 'Expiring Soon',
      value: stats.expiringCount,
      icon: <Clock size={18} />,
      accent: '#CA5010',
      textColor: 'text-[#CA5010]',
      sub: 'Within 30 days',
    },
    {
      label: 'Pipeline Value',
      value: formatCurrency(stats.estimatedPremiumInFlight),
      icon: <DollarSign size={18} />,
      accent: '#2B6CB0',
      textColor: 'text-[#2B6CB0]',
    },
    {
      label: 'Hit Ratio (YTD)',
      value: `${stats.overallHitRatio}%`,
      icon: <Target size={18} />,
      accent: '#005A9E',
      textColor: 'text-[#005A9E]',
    },
    {
      label: 'Avg Response Time',
      value: `${stats.avgResponseTime}d`,
      icon: <TrendingUp size={18} />,
      accent: '#005A9E',
      textColor: 'text-[#005A9E]',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className="bg-white border border-[#D0DAE8] rounded-lg overflow-hidden flex flex-col shadow-sm"
        >
          {/* Microsoft KPI accent bar at top */}
          <div style={{ height: '3px', backgroundColor: c.accent }} />
          <div className="p-3 flex flex-col gap-0.5">
            <div className={`flex items-center gap-1.5 ${c.textColor} text-xs font-semibold uppercase tracking-wide`}>
              {c.icon}
              {c.label}
            </div>
            <div className={`text-2xl font-bold ${c.textColor}`}>{c.value}</div>
            {c.sub && <div className="text-xs text-[#7A95AB]">{c.sub}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
