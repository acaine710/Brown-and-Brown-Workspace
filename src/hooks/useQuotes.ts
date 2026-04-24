import { useMemo } from 'react';
import { differenceInDays, parseISO, isBefore, addDays } from 'date-fns';
import type { FilterState, DashboardStats, Quote } from '../types';

const TODAY = new Date('2025-04-23'); // Fixed date for demo

export function useQuotes(filters: FilterState, quotes: Quote[]) {
  const filtered = useMemo(() => {
    return quotes.filter((q) => {
      if (filters.businessLine !== 'All' && q.businessLine !== filters.businessLine) return false;
      if (filters.segment !== 'All' && q.segment !== filters.segment) return false;
      if (filters.status !== 'All' && q.status !== filters.status) return false;
      if (filters.producer && q.producer !== filters.producer) return false;
      if (filters.priority !== 'All' && q.priority !== filters.priority) return false;
      if (
        filters.carrier &&
        !q.carriers.some((c) => c.carrierName === filters.carrier)
      )
        return false;
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        if (
          !q.insuredName.toLowerCase().includes(term) &&
          !q.id.toLowerCase().includes(term) &&
          !q.producer.toLowerCase().includes(term)
        )
          return false;
      }
      if (filters.dateRange !== 'all') {
        const days = filters.dateRange === '7d' ? 7 : filters.dateRange === '30d' ? 30 : 90;
        const cutoff = addDays(TODAY, -days);
        if (isBefore(parseISO(q.submittedDate), cutoff)) return false;
      }
      return true;
    });
  }, [filters, quotes]);

  return filtered;
}

export function useDashboardStats(quotes: Quote[]): DashboardStats {
  return useMemo(() => {
    const open = quotes.filter((q) =>
      ['Open', 'Submitted', 'Quoted', 'Stalled'].includes(q.status)
    );
    const stalled = open.filter((q) => q.isStalled);
    const expiring = open.filter((q) => {
      const expDate = parseISO(q.expirationDate);
      const daysUntilExp = differenceInDays(expDate, TODAY);
      return daysUntilExp >= 0 && daysUntilExp <= 30;
    });
    const totalPremium = open.reduce((sum, q) => sum + q.estimatedPremium, 0);
    const won = quotes.filter((q) => q.status === 'Won').length;
    const total = quotes.filter((q) => ['Won', 'Lost'].includes(q.status)).length;
    const avgResponse =
      open
        .filter((q) => q.carriers.length > 0)
        .flatMap((q) =>
          q.carriers
            .filter((c) => c.responseDate)
            .map((c) =>
              differenceInDays(parseISO(c.responseDate!), parseISO(q.submittedDate))
            )
        )
        .reduce((a, b, _, arr) => a + b / arr.length, 0);

    return {
      totalOpen: open.length,
      stalled: stalled.length,
      expiringCount: expiring.length,
      estimatedPremiumInFlight: totalPremium,
      overallHitRatio: total > 0 ? Math.round((won / total) * 100) : 0,
      avgResponseTime: Math.round(avgResponse * 10) / 10,
    };
  }, [quotes]);
}

export function getDaysUntilSla(slaDeadline: string): number {
  return differenceInDays(parseISO(slaDeadline), TODAY);
}

export function getSlaColor(days: number): string {
  if (days < 0) return 'text-[#A4262C] bg-[#FDE7E9]';
  if (days <= 2) return 'text-[#CA5010] bg-[#FAF6ED]';
  if (days <= 5) return 'text-[#8A5B00] bg-[#FFF4CE]';
  return 'text-[#107C10] bg-[#DFF6DD]';
}

export function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    Open:     'bg-[#EDF5FF] text-[#0078D4]',
    Submitted:'bg-[#EDF2FF] text-[#4B6EAF]',
    Quoted:   'bg-[#DFF6DD] text-[#107C10]',
    Stalled:  'bg-[#FDE7E9] text-[#A4262C]',
    Won:      'bg-[#DFF6DD] text-[#107C10]',
    Lost:     'bg-[#EBF0F8] text-[#4A5E70]',
    Declined: 'bg-[#EBF0F8] text-[#7A95AB]',
  };
  return map[status] ?? 'bg-[#EBF0F8] text-[#4A5E70]';
}

export function getPriorityColor(priority: string): string {
  const map: Record<string, string> = {
    High:   'text-[#A4262C]',
    Medium: 'text-[#CA5010]',
    Low:    'text-[#7A95AB]',
  };
  return map[priority] ?? 'text-[#4A5E70]';
}

export function getBusinessLineIcon(line: string): string {
  const map: Record<string, string> = {
    'Personal Lines': '🏠',
    'P&C Small Commercial': '🏪',
    'P&C Mid-Market Commercial': '🏢',
    'P&C Large Commercial': '🏗️',
    'Employee Benefits': '👥',
    'Dealer Services': '🚗',
    'Surety / Bonds': '🔒',
  };
  return map[line] ?? '📋';
}
