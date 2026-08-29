export type TierName = "Bronze" | "Silver" | "Gold" | "Platinum";
export type LedgerType = "earn" | "redeem";
export type RequestStatus = "Pending" | "Approved" | "Rejected";

export interface PointsLedgerEntry {
  id: string;
  date: string;
  type: LedgerType;
  amount: number;
  description: string;
  expiryDate?: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  city: string;
  tier: TierName;
  points: number;
  lifetimePoints: number;
  joinDate: string;
  lastActivity: string;
  ledger: PointsLedgerEntry[];
  promotions: string[];
}

export interface Reward {
  id: string;
  name: string;
  category: string;
  cost: number;
}

export interface RedemptionRequest {
  id: string;
  memberId: string;
  rewardId: string;
  pointsCost: number;
  status: RequestStatus;
  requestDate: string;
  decisionDate?: string;
}

export type TabKey =
  | "dashboard"
  | "members"
  | "points"
  | "tiers"
  | "redemption"
  | "notifications"
  | "reports";

export type NavGroup = "Overview" | "Member Operations" | "Audit & Analytics";

