import { useMemo } from 'react';
import { differenceInDays, parseISO, isAfter, isBefore, addDays } from 'date-fns';
import type { FilterState, DashboardStats } from '../types';
import { QUOTES } from '../data/fakeData';

const TODAY = new Date('2025-04-23'); // Fixed date for demo

export function useQuotes(filters: FilterState) {
  const filtered = useMemo(() => {
    return QUOTES.filter((q) => {
      if (filters.businessLine !== 'All' && q.businessLine !== filters.businessLine) return false;
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
  }, [filters]);

  return filtered;
}

export function useDashboardStats(): DashboardStats {
  return useMemo(() => {
    const open = QUOTES.filter((q) =>
      ['Open', 'Submitted', 'Quoted', 'Stalled'].includes(q.status)
    );
    const stalled = open.filter((q) => q.isStalled);
    const dueToday = open.filter((q) => {
      const deadline = parseISO(q.slaDeadline);
      return (
        differenceInDays(deadline, TODAY) <= 2 && isAfter(deadline, TODAY)
      );
    });
    const totalPremium = open.reduce((sum, q) => sum + q.estimatedPremium, 0);
    const won = QUOTES.filter((q) => q.status === 'Won').length;
    const total = QUOTES.filter((q) => ['Won', 'Lost'].includes(q.status)).length;
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
      dueTodayCount: dueToday.length,
      estimatedPremiumInFlight: totalPremium,
      overallHitRatio: total > 0 ? Math.round((won / total) * 100) : 0,
      avgResponseTime: Math.round(avgResponse * 10) / 10,
    };
  }, []);
}

export function getDaysUntilSla(slaDeadline: string): number {
  return differenceInDays(parseISO(slaDeadline), TODAY);
}

export function getSlaColor(days: number): string {
  if (days < 0) return 'text-red-600 bg-red-50';
  if (days <= 2) return 'text-orange-600 bg-orange-50';
  if (days <= 5) return 'text-yellow-600 bg-yellow-50';
  return 'text-green-600 bg-green-50';
}

export function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    Open: 'bg-blue-100 text-blue-700',
    Submitted: 'bg-purple-100 text-purple-700',
    Quoted: 'bg-green-100 text-green-700',
    Stalled: 'bg-red-100 text-red-700',
    Won: 'bg-emerald-100 text-emerald-700',
    Lost: 'bg-gray-100 text-gray-600',
    Declined: 'bg-gray-100 text-gray-500',
  };
  return map[status] ?? 'bg-gray-100 text-gray-600';
}

export function getPriorityColor(priority: string): string {
  const map: Record<string, string> = {
    High: 'text-red-600',
    Medium: 'text-yellow-600',
    Low: 'text-gray-400',
  };
  return map[priority] ?? 'text-gray-500';
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
