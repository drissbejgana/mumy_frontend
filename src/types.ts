export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  plan: "free" | "pro" | "agency";
  role: "user" | "admin";
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  scansUsed: number;
  scansLimit: number; // 3, 100, -1 (unlimited)
  createdAt: string;
  paymentStatus: "active" | "payment_failed" | null;
}

export type VerdictType = "BLOCK_LISTING" | "MANUAL_REVIEW" | "SAFE_TO_PUBLISH";

export interface ScanResult {
  scanId: string;
  userId: string;
  timestamp: string;
  marketplace: string;
  productTitle: string;
  description?: string;
  tags?: string[];
  imageUrl: string;
  verdict: VerdictType;
  riskScore: number; // 0 to 100
  confidenceScore: number; // 0 to 100
  detectedBrand: string;
  violationVectors: string[];
  subScores: {
    visualRisk: number; // 0 to 1
    textRisk: number; // 0 to 1
    metadataRisk: number; // 0 to 1
    crossModal: number; // 0 to 1
    obfuscation: number; // 0 to 1
  };
  chainOfThought: {
    geminiVision: string;
    cloudVision: string;
    blurDetective: string;
    textDecoder: string;
    fusionEngine: string;
  };
  optimizationAdvice: string;
  fullResult?: any;
}

export interface RevenueStats {
  mrr: number;
  totalRevenue: number;
  churnRate: number;
  planDistribution: {
    free: number;
    pro: number;
    agency: number;
  };
  verdictDistribution: {
    block: number;
    review: number;
    safe: number;
  };
}
