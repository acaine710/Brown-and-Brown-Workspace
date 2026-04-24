export type BusinessLine =
  | 'Personal Lines'
  | 'P&C Small Commercial'
  | 'P&C Mid-Market Commercial'
  | 'P&C Large Commercial'
  | 'Employee Benefits'
  | 'Dealer Services'
  | 'Surety / Bonds';

export type InsuranceSegment =
  | "Workers' Comp"
  | 'Commercial Auto'
  | 'General Liability'
  | 'Property'
  | 'Professional Liability';

export type QuoteStatus =
  | 'Open'
  | 'Submitted'
  | 'Quoted'
  | 'Stalled'
  | 'Won'
  | 'Lost'
  | 'Declined';

export type Priority = 'High' | 'Medium' | 'Low';

export interface Carrier {
  id: string;
  name: string;
  appetite: BusinessLine[];
  avgResponseDays: number;
  logo?: string;
}

export interface CoverageOption {
  carrierId: string;
  carrierName: string;
  premium: number;
  deductible: number;
  limit: number;
  coverageScore: number; // 0-100
  responseDate?: string;
  notes?: string;
}

export interface Quote {
  id: string;
  insuredName: string;
  businessLine: BusinessLine;
  producer: string;
  accountExecutive: string;
  segment: InsuranceSegment;
  status: QuoteStatus;
  priority: Priority;
  submittedDate: string;
  effectiveDate: string;
  expirationDate: string;
  estimatedPremium: number;
  carriers: CoverageOption[];
  slaDeadline: string;
  lastActivity: string;
  isStalled: boolean;
  stalledDays?: number;
  amsSource: string;
  notes?: string;
  industry?: string;
  location?: string;
  employeeCount?: number;
  revenue?: number;
}

export interface Producer {
  id: string;
  name: string;
  email: string;
  region: string;
  team: string;
  quotesOpen: number;
  quotesWon: number;
  quotesLost: number;
  hitRatio: number;
  ytdPremium: number;
}

export interface HitRatioData {
  period: string;
  submitted: number;
  won: number;
  lost: number;
  hitRatio: number;
}

export interface CarrierPerformance {
  carrierId: string;
  carrierName: string;
  quotesReceived: number;
  quotesWon: number;
  avgPremium: number;
  avgResponseDays: number;
  hitRatio: number;
  businessLines: BusinessLine[];
}

export interface FilterState {
  businessLine: BusinessLine | 'All';
  segment: InsuranceSegment | 'All';
  status: QuoteStatus | 'All';
  producer: string;
  carrier: string;
  priority: Priority | 'All';
  searchTerm: string;
  dateRange: 'all' | '7d' | '30d' | '90d';
}

export interface DashboardStats {
  totalOpen: number;
  stalled: number;
  expiringCount: number;
  estimatedPremiumInFlight: number;
  overallHitRatio: number;
  avgResponseTime: number;
}
