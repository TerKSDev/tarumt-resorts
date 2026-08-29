import type {
  Member,
  PointsLedgerEntry,
  RedemptionRequest,
  TierName,
} from "../types/loyalty";

interface CustomerApiResponse {
  customerId: string;
  confirmationNo?: number;
  createdAt?: string;
  isActive?: boolean;
  loyaltyTier: string;
  name: string;
  updatedAt?: string;
}

const API_BASE_URL = "http://localhost:8081";
const CUSTOMERS_ENDPOINT = `${API_BASE_URL}/api/customers`;
const POINTS_ENDPOINT = `${API_BASE_URL}/api/points`;
const REDEEM_ENDPOINT = `${API_BASE_URL}/api/redeem`;

export function normalizeTier(raw: string | undefined): TierName {
  const upper = (raw ?? "").toUpperCase();
  if (upper === "BRONZE" || upper === "SILVER" || upper === "GOLD" || upper === "PLATINUM") {
    return (upper.charAt(0) + upper.slice(1).toLowerCase()) as TierName;
  }
  return "Bronze";
}

export function mapCustomerToMember(c: CustomerApiResponse): Member {
  return {
    id: c.customerId,
    name: c.name,
    email: "",
    city: "",
    tier: normalizeTier(c.loyaltyTier),
    points: 0,
    lifetimePoints: 0,
    joinDate: c.createdAt ?? "",
    lastActivity: c.updatedAt ?? "",
    ledger: [],
    promotions: [],
  };
}

export async function fetchMembersFromApi(): Promise<Member[]> {
  const res = await fetch(CUSTOMERS_ENDPOINT);
  if (!res.ok) {
    throw new Error(`Failed to load customers (${res.status})`);
  }
  const data: CustomerApiResponse[] = await res.json();
  return data.map(mapCustomerToMember);
}

export async function updateCustomerTierApi(customerId: string, tier: TierName): Promise<void> {
  const res = await fetch(`${CUSTOMERS_ENDPOINT}/${customerId}/tier`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ loyaltyTier: tier.toUpperCase() }),
  });
  if (!res.ok) {
    throw new Error(`Failed to update tier (${res.status})`);
  }
}

export interface PointApiResponse {
  id: string;
  customerId: string;
  point: number;
  description?: string;
  date?: string;
  expireDate?: string;
}

export async function fetchPointsFromApi(): Promise<PointApiResponse[]> {
  const res = await fetch(POINTS_ENDPOINT);
  if (!res.ok) {
    throw new Error(`Failed to load points (${res.status})`);
  }
  return res.json();
}

export async function awardPointsApi(
  customerId: string,
  point: number,
  description: string,
): Promise<void> {
  const res = await fetch(POINTS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customerId, point, description }),
  });
  if (!res.ok) {
    throw new Error(`Failed to award points (${res.status})`);
  }
}

export function applyPointsToMembers(members: Member[], pointsRows: PointApiResponse[]): Member[] {
  const now = Date.now();
  return members.map((m) => {
    const rows = pointsRows.filter((p) => p.customerId === m.id);
    const lifetimePoints = rows.reduce((sum, p) => sum + (p.point ?? 0), 0);
    const activePoints = rows
      .filter((p) => !p.expireDate || new Date(p.expireDate).getTime() > now)
      .reduce((sum, p) => sum + (p.point ?? 0), 0);
    const ledger: PointsLedgerEntry[] = rows
      .slice()
      .sort((a, b) => {
        const dateA = new Date(a.date ?? 0).getTime();
        const dateB = new Date(b.date ?? 0).getTime();
        return dateB - dateA;
      })
      .map((p) => ({
        id: p.id,
        date: p.date ?? "",
        type: "earn",
        amount: p.point ?? 0,
        description: p.description ?? "",
        expiryDate: p.expireDate ?? "",
      }));
    return { ...m, points: activePoints, lifetimePoints, ledger };
  });
}

export interface RedeemApiResponse {
  id: number;
  customerId: string;
  point: number;
  status: boolean | null;
  description: string;
  date?: string;
  decisionDate?: string;
}

export async function fetchRedeemFromApi(): Promise<RedeemApiResponse[]> {
  const res = await fetch(REDEEM_ENDPOINT);
  if (!res.ok) {
    throw new Error(`Failed to load redemption requests (${res.status})`);
  }
  return res.json();
}

export async function createRedeemApi(
  customerId: string,
  point: number,
  description: string,
): Promise<void> {
  const res = await fetch(REDEEM_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customerId, point, description }),
  });
  if (!res.ok) {
    throw new Error(`Failed to submit redemption request (${res.status})`);
  }
}

export async function updateRedeemStatusApi(id: string, status: boolean): Promise<void> {
  const res = await fetch(`${REDEEM_ENDPOINT}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    throw new Error(`Failed to update request (${res.status})`);
  }
}

export function mapRedeemToRequest(r: RedeemApiResponse): RedemptionRequest {
  return {
    id: String(r.id),
    memberId: r.customerId,
    rewardId: r.description,
    pointsCost: r.point ?? 0,
    status: r.status === true ? "Approved" : r.status === false ? "Rejected" : "Pending",
    requestDate: r.date ?? "",
    decisionDate: r.decisionDate ?? "",
  };
}

export function applyApprovedRedemptions(
  members: Member[],
  requests: RedemptionRequest[],
): Member[] {
  return members.map((m) => {
    const approved = requests.filter((r) => r.memberId === m.id && r.status === "Approved");
    if (approved.length === 0) return m;
    const redeemed = approved.reduce((sum, r) => sum + r.pointsCost, 0);
    const redeemEntries: PointsLedgerEntry[] = approved.map((r) => ({
      id: `RD${r.id}`,
      date: r.decisionDate || r.requestDate || "",
      type: "redeem",
      amount: r.pointsCost,
      description: `Redeemed: ${r.rewardId}`,
    }));
    return {
      ...m,
      points: Math.max(0, m.points - redeemed),
      ledger: [...redeemEntries, ...m.ledger],
    };
  });
}

