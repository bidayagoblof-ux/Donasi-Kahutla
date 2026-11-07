export interface DonationProgram {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  targetLocation: string;
  targetAmount: number;
  collectedAmount: number;
  donorCount: number;
  imageUrl: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'paused';
  priority: 'darurat' | 'tinggi' | 'menengah';
  needsList: string[];
}

export interface Donation {
  id: string;
  orderId: string;
  programId: string;
  programTitle?: string;
  programName?: string;
  amount: number;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  donorMessage?: string;
  isAnonymous: boolean;
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED' | 'CANCELLED';
  createdAt: string;
  paidAt?: string;
  vaNumber?: string;
  paymentRef?: string;
  qrisUrl?: string;
}

export interface PublicDonor {
  orderId: string;
  donorName: string;
  programTitle: string;
  amount: number;
  createdAt: string;
  message?: string | null;
}

export interface PaymentInstruction {
  orderId: string;
  paymentMethod: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED';
  expiryTime: string;
  qrisPayload?: string;
  qrisSvg?: string;
  vaNumber?: string;
  bankName?: string;
  billKey?: string;
  billerCode?: string;
  deepLink?: string;
  sandboxMode: boolean;
  instructions: string[];
}

export interface Expense {
  id: string;
  title: string;
  programId: string;
  programName: string;
  category: string;
  amount: number;
  expenseDate: string;
  vendorName: string;
  receiptNumber: string;
  status: 'Draft' | 'Menunggu' | 'Disetujui' | 'Dibayar';
  notes: string;
  approvedBy?: string;
  approvalDate?: string;
}

export interface AidDistribution {
  id: string;
  programId: string;
  programName: string;
  distributionDate: string;
  location: string;
  province: string;
  aidType: string;
  quantity: number;
  unit: string;
  beneficiariesCount: number;
  targetGroup: string;
  status: 'Tersalurkan' | 'Dalam Distribusi' | 'Perencanaan';
  documentationUrls: string[];
  notes: string;
  verifiedBy: string;
}

export interface TransparencyReport {
  summary: {
    totalReceived: number;
    successTransactionCount: number;
    totalAllocated: number;
    totalDisbursed: number;
    availableBalance: number;
    totalBeneficiaries: number;
    lastUpdated: string;
  };
  expenseByCategory: Record<string, number>;
  expenses: Expense[];
  distributions: AidDistribution[];
}

export interface KarhutlaDataset {
  metadata: {
    dataset_id: string;
    title: string;
    publisher: string;
    generated_at: string;
    data_cutoff: string;
    version: string;
    description: string;
    usage: {
      recommended: string;
      warning: string;
      update_policy: string;
    };
  };
  definitions: Record<string, string>;
  national_situation: {
    bnpb_snapshot_2026_10_24?: any;
    priority_provinces_bnpb_2026_10_24?: Array<{
      province: string;
      hotspots_count: number;
      burned_area_ha: number;
      area_not_extinguished_ha: number;
      source_id: string;
    }>;
    ihcp_health_snapshot_2026_10_21?: {
      source_id: string;
      ispa_cases: number;
      ispa_under_five_cases: number;
      affected_population: number;
      affected_regencies_cities: number;
      notes: string;
    };
    health_age_risk_breakdown_2026_10_19?: {
      under_five_ispa_cases: number;
      children_6_9_ispa_cases: number;
      elderly_over_60_ispa_cases: number;
      asthma_or_copd_cases: number;
      pregnant_women: number | null;
      outdoor_workers: number | null;
      notes: string;
    };
    [key: string]: any;
  };
  focus_province: {
    province: string;
    bnpb_snapshot_2026_10_24?: any;
    provincial_cumulative_2026_01_01_to_2026_10_28?: any;
    daily_report_2026_10_28?: any;
    response_and_conditions: Array<{
      topic: string;
      description: string;
      source_ids: string[];
    }>;
    priority_assessment_areas: Array<{
      name: string;
      province: string;
      assessment_reason: string;
      source_ids: string[];
      status: string;
    }>;
    ispu_critical_locations_2026_10_19: Array<{
      location: string;
      ispu: number | null;
      category: string;
    }>;
  };
  humanitarian_needs: Array<{
    id: string;
    category: string;
    items: string[];
    priority: string;
    basis: string;
    source_ids: string[];
  }>;
  vulnerable_groups: Array<{
    group: string;
    risk: string;
    recommended_assessment: string[];
  }>;
  sources: Array<{
    id: string;
    publisher: string;
    published_at: string;
    title: string;
    url: string;
    type: string;
    notes: string;
  }>;
  data_quality?: {
    known_inconsistencies: string[];
    missing_data: string[];
    public_display_guidance: string[];
  };
}
