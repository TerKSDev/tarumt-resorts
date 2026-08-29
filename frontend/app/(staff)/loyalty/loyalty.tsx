import { useEffect, useMemo, useState, type ReactNode, type SVGProps } from "react";
import { type MetaFunction } from "react-router";
import {
  Crown,
  Sparkles,
  Users,
  Award,
  CircleDollarSign,
  Gift,
  Bell,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Layers,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const meta: MetaFunction = () => [
  { title: "VIP Loyalty & Member Services | TARUMT Resorts" },
];

/* =========================================================================
   TYPES
   ========================================================================= */

type TierName = "Bronze" | "Silver" | "Gold" | "Platinum";
type LedgerType = "earn" | "redeem";
type RequestStatus = "Pending" | "Approved" | "Rejected";

interface PointsLedgerEntry {
  id: string;
  date: string;
  type: LedgerType;
  amount: number;
  description: string;
  expiryDate?: string;
}

interface Member {
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

interface Reward {
  id: string;
  name: string;
  category: string;
  cost: number;
}

interface RedemptionRequest {
  id: string;
  memberId: string;
  rewardId: string;
  pointsCost: number;
  status: RequestStatus;
  requestDate: string;
  decisionDate?: string;
}

type TabKey =
  | "dashboard"
  | "members"
  | "points"
  | "tiers"
  | "redemption"
  | "notifications"
  | "reports";

/* =========================================================================
   CONSTANTS & THEME
   ========================================================================= */

const TIER_THRESHOLDS: { tier: TierName; min: number }[] = [
  { tier: "Bronze", min: 0 },
  { tier: "Silver", min: 3000 },
  { tier: "Gold", min: 10000 },
  { tier: "Platinum", min: 50000 },
];

const TIER_STYLES: Record<TierName, { badge: string; ring: string; text: string; bg: string }> = {
  Bronze: {
    badge: "bg-surface-100 text-surface-800 border-surface-300",
    ring: "text-surface-600",
    text: "text-surface-800",
    bg: "bg-surface-100",
  },
  Silver: {
    badge: "bg-surface-200 text-surface-900 border-surface-400 font-semibold",
    ring: "text-surface-500",
    text: "text-surface-700",
    bg: "bg-surface-200",
  },
  Gold: {
    badge: "bg-brand-50 text-brand-800 border-brand-300 font-bold",
    ring: "text-brand-600",
    text: "text-brand-700",
    bg: "bg-brand-50",
  },
  Platinum: {
    badge: "bg-surface-950 text-white border-surface-900 font-bold shadow-xs",
    ring: "text-brand-400",
    text: "text-brand-300",
    bg: "bg-surface-950",
  },
};

const REWARDS: Reward[] = [
  { id: "R1", name: "Complimentary Free Night Stay", category: "Suite Accommodation", cost: 6000 },
  { id: "R2", name: "Presidential Suite Upgrade", category: "Suite Accommodation", cost: 2000 },
  { id: "R3", name: "Luxury Spa & Wellness Voucher (60 min)", category: "Wellness", cost: 1500 },
  { id: "R4", name: "VIP Chauffeur Airport Transfer", category: "Concierge Transport", cost: 800 },
  { id: "R5", name: "Fine Dining Resort Credit (RM100)", category: "Culinary Dining", cost: 1000 },
  { id: "R6", name: "Guaranteed Late Checkout (4:00 PM)", category: "Suite Accommodation", cost: 400 },
];

type NavGroup = "Overview" | "Member Operations" | "Audit & Analytics";

const NAV: { key: TabKey; label: string; group: NavGroup; description: string; icon: any }[] = [
  { key: "dashboard", label: "Executive Dashboard", group: "Overview", description: "Program health & live KPIs", icon: Layers },
  { key: "members", label: "Member Directory", group: "Member Operations", description: "Profiles, ledgers & tier standings", icon: Users },
  { key: "points", label: "Award & Redemptions", group: "Member Operations", description: "Award points & create requests", icon: CircleDollarSign },
  { key: "tiers", label: "Tier Velocity", group: "Member Operations", description: "Tier thresholds & progression ranks", icon: Crown },
  { key: "redemption", label: "Redemption Queue", group: "Member Operations", description: "Process & fulfill reward claims", icon: Gift },
  { key: "notifications", label: "Audit Signals", group: "Audit & Analytics", description: "Expiring points & tier upgrades", icon: Bell },
  { key: "reports", label: "Console Reports", group: "Audit & Analytics", description: "Management reports & data exports", icon: FileText },
];

const NAV_GROUPS: NavGroup[] = ["Overview", "Member Operations", "Audit & Analytics"];

/* =========================================================================
   HELPERS
   ========================================================================= */

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr).getTime();
  const now = new Date().getTime();
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

function tierForPoints(lifetimePoints: number): TierName {
  let result: TierName = "Bronze";
  for (const t of TIER_THRESHOLDS) {
    if (lifetimePoints >= t.min) result = t.tier;
  }
  return result;
}

function nextTierInfo(lifetimePoints: number): { next: TierName | null; remaining: number; pct: number } {
  const idx = TIER_THRESHOLDS.findIndex((t) => t.tier === tierForPoints(lifetimePoints));
  const next = TIER_THRESHOLDS[idx + 1];
  if (!next) return { next: null, remaining: 0, pct: 100 };
  const current = TIER_THRESHOLDS[idx];
  const span = next.min - current.min;
  const progressed = lifetimePoints - current.min;
  return {
    next: next.tier,
    remaining: next.min - lifetimePoints,
    pct: Math.max(0, Math.min(100, Math.round((progressed / span) * 100))),
  };
}

function pad(str: string | number, len: number): string {
  return String(str).padEnd(len, " ").slice(0, Math.max(len, String(str).length));
}

function padL(str: string | number, len: number): string {
  return String(str).padStart(len, " ");
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/* =========================================================================
   ALGORITHMS: sorting + searching
   ========================================================================= */

function mergeSort<T>(items: T[], compare: (a: T, b: T) => number): T[] {
  if (items.length <= 1) return items;
  const mid = Math.floor(items.length / 2);
  const left = mergeSort(items.slice(0, mid), compare);
  const right = mergeSort(items.slice(mid), compare);
  const merged: T[] = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (compare(left[i], right[j]) <= 0) merged.push(left[i++]);
    else merged.push(right[j++]);
  }
  while (i < left.length) merged.push(left[i++]);
  while (j < right.length) merged.push(right[j++]);
  return merged;
}

function binarySearchById<T extends { id: string }>(sortedById: T[], id: string): T | null {
  let lo = 0;
  let hi = sortedById.length - 1;
  const target = id.trim().toUpperCase();
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const midId = sortedById[mid].id.toUpperCase();
    if (midId === target) return sortedById[mid];
    if (midId < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return null;
}

function filterItems<T>(items: T[], predicates: Array<(item: T) => boolean>): T[] {
  return items.filter((item) => predicates.every((p) => p(item)));
}

/* =========================================================================
   API LAYER
   ========================================================================= */

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

function normalizeTier(raw: string | undefined): TierName {
  const upper = (raw ?? "").toUpperCase();
  if (upper === "BRONZE" || upper === "SILVER" || upper === "GOLD" || upper === "PLATINUM") {
    return (upper.charAt(0) + upper.slice(1).toLowerCase()) as TierName;
  }
  return "Bronze";
}

function mapCustomerToMember(c: CustomerApiResponse): Member {
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

async function fetchMembersFromApi(): Promise<Member[]> {
  const res = await fetch(CUSTOMERS_ENDPOINT);
  if (!res.ok) {
    throw new Error(`Failed to load customers (${res.status})`);
  }
  const data: CustomerApiResponse[] = await res.json();
  return data.map(mapCustomerToMember);
}

async function updateCustomerTierApi(customerId: string, tier: TierName): Promise<void> {
  const res = await fetch(`${CUSTOMERS_ENDPOINT}/${customerId}/tier`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ loyaltyTier: tier.toUpperCase() }),
  });
  if (!res.ok) {
    throw new Error(`Failed to update tier (${res.status})`);
  }
}

interface PointApiResponse {
  id: string;
  customerId: string;
  point: number;
  description?: string;
  date?: string;
  expireDate?: string;
}

const POINTS_ENDPOINT = `${API_BASE_URL}/api/points`;

async function fetchPointsFromApi(): Promise<PointApiResponse[]> {
  const res = await fetch(POINTS_ENDPOINT);
  if (!res.ok) {
    throw new Error(`Failed to load points (${res.status})`);
  }
  return res.json();
}

async function awardPointsApi(customerId: string, point: number, description: string): Promise<void> {
  const res = await fetch(POINTS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customerId, point, description }),
  });
  if (!res.ok) {
    throw new Error(`Failed to award points (${res.status})`);
  }
}

function applyPointsToMembers(members: Member[], pointsRows: PointApiResponse[]): Member[] {
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

interface RedeemApiResponse {
  id: number;
  customerId: string;
  point: number;
  status: boolean | null;
  description: string;
  date?: string;
  decisionDate?: string;
}

const REDEEM_ENDPOINT = `${API_BASE_URL}/api/redeem`;

async function fetchRedeemFromApi(): Promise<RedeemApiResponse[]> {
  const res = await fetch(REDEEM_ENDPOINT);
  if (!res.ok) {
    throw new Error(`Failed to load redemption requests (${res.status})`);
  }
  return res.json();
}

async function createRedeemApi(customerId: string, point: number, description: string): Promise<void> {
  const res = await fetch(REDEEM_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customerId, point, description }),
  });
  if (!res.ok) {
    throw new Error(`Failed to submit redemption request (${res.status})`);
  }
}

async function updateRedeemStatusApi(id: string, status: boolean): Promise<void> {
  const res = await fetch(`${REDEEM_ENDPOINT}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    throw new Error(`Failed to update request (${res.status})`);
  }
}

function mapRedeemToRequest(r: RedeemApiResponse): RedemptionRequest {
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

function applyApprovedRedemptions(members: Member[], requests: RedemptionRequest[]): Member[] {
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

/* =========================================================================
   LUXURY UI PRIMITIVES
   ========================================================================= */

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl border border-surface-200 bg-white shadow-sm hover:shadow-md transition-all ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-surface-100 px-6 py-5">
      <div>
        <h3 className="text-base font-serif font-semibold tracking-tight text-surface-950">
          {title}
        </h3>
        {subtitle && <p className="mt-0.5 text-xs text-surface-500 font-light">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function TierBadge({ tier }: { tier: TierName }) {
  const style = TIER_STYLES[tier] || TIER_STYLES.Bronze;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${style.badge}`}
    >
      <Crown size={11} />
      <span>{tier}</span>
    </span>
  );
}

function StatusPill({ status }: { status: RequestStatus }) {
  const styles: Record<RequestStatus, string> = {
    Pending: "bg-brand-50 text-brand-700 border-brand-200 font-semibold",
    Approved: "bg-surface-950 text-white border-surface-950 font-semibold",
    Rejected: "bg-surface-100 text-surface-600 border-surface-300",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-0.5 text-[11px] uppercase tracking-wider ${styles[status]}`}
    >
      {status === "Approved" ? (
        <CheckCircle size={11} className="text-brand-300" />
      ) : status === "Rejected" ? (
        <XCircle size={11} className="text-surface-400" />
      ) : (
        <Clock size={11} className="text-brand-600" />
      )}
      {status}
    </span>
  );
}

function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: any;
}) {
  return (
    <Card className="p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
          {label}
        </span>
        <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600">
          <Icon size={16} strokeWidth={1.75} />
        </div>
      </div>
      <p className="mt-3 text-2xl md:text-3xl font-bold font-mono text-surface-950 tracking-tight">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-surface-500 font-light">{hint}</p>}
    </Card>
  );
}

function TierRing({ pct, tier }: { pct: number; tier: TierName }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  const style = TIER_STYLES[tier] || TIER_STYLES.Bronze;

  return (
    <svg width="68" height="68" viewBox="0 0 64 64" className="shrink-0">
      <circle cx="32" cy="32" r={r} fill="none" stroke="#e2e8f0" strokeWidth="5.5" />
      <circle
        cx="32"
        cy="32"
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform="rotate(-90 32 32)"
        className={style.ring}
      />
      <text
        x="32"
        y="37"
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fontFamily="monospace"
        fill="#0f172a"
      >
        {pct}%
      </text>
    </svg>
  );
}

/* =========================================================================
   MAIN COMPONENT
   ========================================================================= */

export default function LoyaltyAndMember() {
  const [tab, setTab] = useState<TabKey>("dashboard");
  const [rawMembers, setRawMembers] = useState<Member[]>([]);
  const [membersLoading, setMembersLoading] = useState(true);
  const [membersError, setMembersError] = useState<string | null>(null);
  const [requests, setRequests] = useState<RedemptionRequest[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2800);
  };

  const members = useMemo(() => applyApprovedRedemptions(rawMembers, requests), [rawMembers, requests]);

  useEffect(() => {
    let cancelled = false;
    setMembersLoading(true);
    setMembersError(null);
    Promise.all([fetchMembersFromApi(), fetchPointsFromApi(), fetchRedeemFromApi()])
      .then(([customers, points, redeemRows]) => {
        if (cancelled) return;
        const merged = applyPointsToMembers(customers, points);
        setRawMembers(merged);
        setRequests(redeemRows.map(mapRedeemToRequest));
        setSelectedMemberId((prev) => prev || merged[0]?.id || "");
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setMembersError(err instanceof Error ? err.message : "Failed to load loyalty records");
      })
      .finally(() => {
        if (!cancelled) setMembersLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function addPoints(memberId: string, amount: number, description: string) {
    if (amount <= 0) return;
    const member = members.find((m) => m.id === memberId);
    awardPointsApi(memberId, amount, description)
      .then(() => fetchPointsFromApi())
      .then((points) => {
        const merged = applyPointsToMembers(rawMembers, points);
        const updated = merged.find((m) => m.id === memberId);
        const newTier = updated ? tierForPoints(updated.lifetimePoints) : undefined;

        if (updated && newTier && newTier !== updated.tier) {
          const oldTier = updated.tier;
          return updateCustomerTierApi(memberId, newTier)
            .then(() => {
              setRawMembers(merged.map((m) => (m.id === memberId ? { ...m, tier: newTier } : m)));
              flash(`${updated.name} upgraded from ${oldTier} to ${newTier}!`);
            })
            .catch((err: unknown) => {
              setRawMembers(merged);
              flash(err instanceof Error ? `Points added, but tier update failed: ${err.message}` : "Points added, but tier update failed");
            });
        }

        setRawMembers(merged);
        flash(member ? `Awarded ${amount.toLocaleString()} points to ${member.name}` : `Awarded ${amount.toLocaleString()} points`);
      })
      .catch((err: unknown) => {
        flash(err instanceof Error ? err.message : "Failed to award points");
      });
  }

  function requestRedemption(memberId: string, rewardId: string) {
    const member = members.find((m) => m.id === memberId);
    const reward = REWARDS.find((r) => r.id === rewardId);
    if (!member || !reward) return;
    if (member.points < reward.cost) {
      flash(`${member.name} has insufficient points for ${reward.name}.`);
      return;
    }
    createRedeemApi(memberId, reward.cost, reward.name)
      .then(() => fetchRedeemFromApi())
      .then((redeemRows) => {
        setRequests(redeemRows.map(mapRedeemToRequest));
        flash(`Redemption claim for ${reward.name} submitted for authorization.`);
      })
      .catch((err: unknown) => {
        flash(err instanceof Error ? err.message : "Failed to submit redemption request");
      });
  }

  function processRequest(requestId: string, action: "Approved" | "Rejected") {
    updateRedeemStatusApi(requestId, action === "Approved")
      .then(() => fetchRedeemFromApi())
      .then((redeemRows) => {
        setRequests(redeemRows.map(mapRedeemToRequest));
        flash(`Reward redemption request has been ${action.toLowerCase()}.`);
      })
      .catch((err: unknown) => {
        flash(err instanceof Error ? err.message : `Failed to ${action.toLowerCase()} request`);
      });
  }

  const expiringSoon = useMemo(() => {
    const out: { member: Member; entry: PointsLedgerEntry; days: number }[] = [];
    for (const m of members) {
      for (const e of m.ledger) {
        if (e.type === "earn" && e.expiryDate) {
          const d = daysUntil(e.expiryDate);
          if (d >= 0 && d <= 30) out.push({ member: m, entry: e, days: d });
        }
      }
    }
    return mergeSort(out, (a, b) => a.days - b.days);
  }, [members]);

  const pendingRequests = requests.filter((r) => r.status === "Pending");
  const notificationCount = expiringSoon.length + pendingRequests.length;

  return (
    <main className="flex-1 flex flex-col gap-8 pb-10">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-100 flex items-center gap-2 px-5 py-3 rounded-full bg-surface-950 text-white border border-surface-700 shadow-2xl text-xs font-semibold tracking-wide"
          >
            <Sparkles size={14} className="text-brand-300 shrink-0" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="p-6 md:p-8 rounded-3xl bg-surface-950 text-surface-50 relative overflow-hidden shadow-xl border border-surface-800"
      >
        <div className="absolute rounded-full w-96 h-96 bg-brand-900/30 blur-[100px] -top-20 -right-20 pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-900 border border-surface-700/80 text-brand-300 text-xs font-medium tracking-wide w-fit">
              <Crown size={13} />
              <span>TARUMT Privilege & VIP Concierge</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif tracking-tight font-semibold text-white">
              Loyalty Program & VIP Member Ledger
            </h1>
            <p className="text-xs md:text-sm text-surface-300 font-light leading-relaxed">
              Real-time member point issuance, tier progression auditing, and reward redemption fulfillment.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex flex-col items-center justify-center px-5 py-3 rounded-2xl bg-surface-900/80 border border-surface-800 backdrop-blur-md">
              <span className="text-xl font-bold font-mono text-white">
                {members.length}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-surface-400 font-medium">
                Enrolled Guests
              </span>
            </div>
            <div className="flex flex-col items-center justify-center px-5 py-3 rounded-2xl bg-surface-900/80 border border-surface-800 backdrop-blur-md">
              <span className="text-xl font-bold font-mono text-brand-300">
                {pendingRequests.length}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-surface-400 font-medium">
                Pending Claims
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Sub-Menu Bar */}
      <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 scrollbar-hidden border-b border-surface-200">
        {NAV.map((item) => {
          const isActive = tab === item.key;
          const badgeCount =
            item.key === "notifications"
              ? notificationCount
              : item.key === "redemption"
              ? pendingRequests.length
              : 0;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer shrink-0 ${
                isActive
                  ? "bg-surface-950 text-white shadow-sm"
                  : "bg-white text-surface-600 hover:text-surface-950 border border-surface-200 hover:border-surface-300 shadow-2xs"
              }`}
            >
              <item.icon size={15} className={isActive ? "text-brand-300" : "text-surface-400"} />
              <span>{item.label}</span>
              {badgeCount > 0 && (
                <span className="rounded-full bg-brand-500 text-white px-2 py-0.5 text-[10px] font-mono font-bold leading-none">
                  {badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Loading & Error Status */}
      {membersLoading && (
        <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 text-xs text-brand-700 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-600" />
          <span>Synchronizing loyalty records with core database...</span>
        </div>
      )}
      {membersError && (
        <div className="p-4 rounded-2xl bg-surface-100 border border-surface-300 text-xs text-surface-800 flex items-center gap-2">
          <XCircle size={16} className="text-surface-600" />
          <span>Unable to connect to backend: {membersError}</span>
        </div>
      )}

      {/* Tab Panels */}
      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col gap-6"
      >
        {tab === "dashboard" && (
          <DashboardTab
            members={members}
            requests={requests}
            expiringSoon={expiringSoon}
            pendingRequests={pendingRequests}
            goTo={setTab}
          />
        )}
        {tab === "members" && (
          <MembersTab
            members={members}
            selectedMemberId={selectedMemberId}
            onSelect={setSelectedMemberId}
          />
        )}
        {tab === "points" && (
          <PointsTab
            members={members}
            onAddPoints={addPoints}
            onRedeem={requestRedemption}
          />
        )}
        {tab === "tiers" && <TiersTab members={members} />}
        {tab === "redemption" && (
          <RedemptionTab
            members={members}
            requests={requests}
            onProcess={processRequest}
          />
        )}
        {tab === "notifications" && (
          <NotificationsTab
            members={members}
            expiringSoon={expiringSoon}
            pendingRequests={pendingRequests}
          />
        )}
        {tab === "reports" && (
          <ReportsTab members={members} requests={requests} />
        )}
      </motion.div>
    </main>
  );
}

/* =========================================================================
   DASHBOARD TAB
   ========================================================================= */

function DashboardTab({
  members,
  expiringSoon,
  pendingRequests,
  goTo,
}: {
  members: Member[];
  requests: RedemptionRequest[];
  expiringSoon: { member: Member; entry: PointsLedgerEntry; days: number }[];
  pendingRequests: RedemptionRequest[];
  goTo: (t: TabKey) => void;
}) {
  const totalIssued = members.reduce(
    (s, m) => s + m.ledger.filter((l) => l.type === "earn").reduce((a, l) => a + l.amount, 0),
    0,
  );
  const totalRedeemed = members.reduce(
    (s, m) => s + m.ledger.filter((l) => l.type === "redeem").reduce((a, l) => a + l.amount, 0),
    0,
  );

  return (
    <div className="flex flex-col gap-6">
      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Enrolled Members"
          value={String(members.length)}
          hint="Active resort guest roster"
          icon={Users}
        />
        <KpiCard
          label="Points Issued to Date"
          value={totalIssued.toLocaleString()}
          hint="Earned from room stays & dining"
          icon={TrendingUp}
        />
        <KpiCard
          label="Points Redeemed"
          value={totalRedeemed.toLocaleString()}
          hint="Reward perks & suite upgrades"
          icon={Gift}
        />
        <KpiCard
          label="Pending Redemptions"
          value={String(pendingRequests.length)}
          hint="Awaiting concierge authorization"
          icon={Clock}
        />
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader
            title="Points Expiring Soon"
            subtitle="Ledger entries maturing within the next 30 days"
            action={
              <button
                type="button"
                onClick={() => goTo("notifications")}
                className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1"
              >
                <span>View Signals</span>
                <ChevronRight size={14} />
              </button>
            }
          />
          <div className="divide-y divide-surface-100">
            {expiringSoon.slice(0, 5).map((row) => (
              <div
                key={row.entry.id}
                className="flex items-center justify-between px-6 py-4 text-xs hover:bg-surface-50 transition-colors"
              >
                <div>
                  <p className="font-semibold text-surface-950 text-sm">
                    {row.member.name}
                  </p>
                  <p className="text-xs text-surface-500 mt-0.5">
                    {row.entry.amount.toLocaleString()} pts &bull; {row.entry.description}
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-surface-800 bg-surface-100 px-2.5 py-1 rounded-full border border-surface-200">
                  {row.days}d remaining
                </span>
              </div>
            ))}
            {expiringSoon.length === 0 && (
              <p className="px-6 py-8 text-xs text-surface-500 font-light text-center">
                All points are currently in good standing.
              </p>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Pending Redemption Claims"
            subtitle={`${pendingRequests.length} requests awaiting desk verification`}
            action={
              <button
                type="button"
                onClick={() => goTo("redemption")}
                className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1"
              >
                <span>Process Queue</span>
                <ChevronRight size={14} />
              </button>
            }
          />
          <div className="divide-y divide-surface-100">
            {pendingRequests.slice(0, 5).map((r) => {
              const member = members.find((m) => m.id === r.memberId);
              const reward = REWARDS.find((rw) => rw.id === r.rewardId);
              return (
                <div
                  key={r.id}
                  className="flex items-center justify-between px-6 py-4 text-xs hover:bg-surface-50 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-surface-950 text-sm">
                      {member?.name || r.memberId}
                    </p>
                    <p className="text-xs text-surface-500 mt-0.5">
                      {reward?.name ?? r.rewardId} &bull; {r.pointsCost.toLocaleString()} pts
                    </p>
                  </div>
                  <StatusPill status={r.status} />
                </div>
              );
            })}
            {pendingRequests.length === 0 && (
              <p className="px-6 py-8 text-xs text-surface-500 font-light text-center">
                No pending redemption requests in the queue.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* =========================================================================
   MEMBERS TAB
   ========================================================================= */

function MembersTab({
  members,
  selectedMemberId,
  onSelect,
}: {
  members: Member[];
  selectedMemberId: string;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const filtered = filterItems(members, [
    (m) =>
      query
        ? m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.id.toLowerCase().includes(query.toLowerCase())
        : true,
  ]);
  const selected = members.find((m) => m.id === selectedMemberId) ?? members[0];

  if (!selected) {
    return (
      <Card className="p-12 text-center">
        <p className="text-sm text-surface-500 font-light">
          No registered members found in the resort database.
        </p>
      </Card>
    );
  }

  const { next, remaining, pct } = nextTierInfo(selected.lifetimePoints);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Directory List */}
      <Card className="lg:col-span-1 flex flex-col overflow-hidden">
        <CardHeader
          title="Member Directory"
          subtitle={`${filtered.length} of ${members.length} members matching`}
        />
        <div className="p-4 border-b border-surface-100">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-100 border border-surface-200 text-xs">
            <Search size={14} className="text-surface-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search member name or ID..."
              className="w-full bg-transparent outline-none text-surface-900 placeholder:text-surface-400 font-normal"
            />
          </div>
        </div>
        <div className="max-h-[500px] divide-y divide-surface-100 overflow-y-auto scrollbar-hidden">
          {filtered.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelect(m.id)}
              className={`flex w-full items-center justify-between px-5 py-3.5 text-left text-xs transition-colors cursor-pointer ${
                m.id === selected.id ? "bg-brand-50/70 border-l-4 border-brand-600" : "hover:bg-surface-50"
              }`}
            >
              <div>
                <p className="font-semibold text-surface-950 text-sm">{m.name}</p>
                <p className="text-xs text-surface-500 font-mono mt-0.5">
                  {m.points.toLocaleString()} pts
                </p>
              </div>
              <TierBadge tier={m.tier} />
            </button>
          ))}
        </div>
      </Card>

      {/* Selected Member Detail */}
      <Card className="lg:col-span-2 flex flex-col">
        <CardHeader
          title={selected.name}
          subtitle={`Member Identifier: ${selected.id} • Registered ${formatDate(selected.joinDate)}`}
          action={<TierBadge tier={selected.tier} />}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 border-b border-surface-100">
          <div className="flex items-center gap-4">
            <TierRing pct={pct} tier={selected.tier} />
            <div>
              <p className="text-xs text-surface-500 uppercase tracking-wider font-semibold">
                {next ? `Next: ${next}` : "Peak Tier"}
              </p>
              <p className="text-sm font-semibold text-surface-950 mt-0.5">
                {next ? `${remaining.toLocaleString()} pts left` : "Platinum Achieved"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Redeemable Balance
            </p>
            <p className="mt-1 text-2xl font-bold font-mono text-surface-950">
              {selected.points.toLocaleString()} <span className="text-xs font-normal text-surface-500">pts</span>
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Lifetime Earned
            </p>
            <p className="mt-1 text-2xl font-bold font-mono text-surface-950">
              {selected.lifetimePoints.toLocaleString()} <span className="text-xs font-normal text-surface-500">pts</span>
            </p>
          </div>
        </div>

        {/* Ledger Activity */}
        <div className="p-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-surface-500 mb-4">
            Points Ledger & Statement History
          </h4>
          <div className="max-h-64 space-y-2.5 overflow-y-auto scrollbar-hidden">
            {[...selected.ledger]
              .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
              .map((l) => (
                <div
                  key={l.id}
                  className="flex items-center justify-between rounded-2xl border border-surface-200 bg-surface-50/60 px-4 py-3 text-xs"
                >
                  <div>
                    <p className="font-semibold text-surface-950">{l.description}</p>
                    <p className="text-[11px] text-surface-500 font-mono mt-0.5">
                      {formatDate(l.date)}
                      {l.expiryDate ? ` \u2022 Expires ${formatDate(l.expiryDate)}` : ""}
                    </p>
                  </div>
                  <span
                    className={`font-mono font-bold text-sm ${
                      l.type === "earn" ? "text-brand-700" : "text-surface-600"
                    }`}
                  >
                    {l.type === "earn" ? "+" : "-"}{l.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            {selected.ledger.length === 0 && (
              <p className="text-xs text-surface-400 italic py-4 text-center">
                No ledger transactions recorded for this member.
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

/* =========================================================================
   POINTS TAB
   ========================================================================= */

function PointsTab({
  members,
  onAddPoints,
  onRedeem,
}: {
  members: Member[];
  onAddPoints: (memberId: string, amount: number, description: string) => void;
  onRedeem: (memberId: string, rewardId: string) => void;
}) {
  const [memberId, setMemberId] = useState(members[0]?.id ?? "");
  const [amount, setAmount] = useState(500);
  const [reason, setReason] = useState("Direct Stay Spend");
  const [redeemMember, setRedeemMember] = useState(members[0]?.id ?? "");

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader
          title="Award Loyalty Points"
          subtitle="Credit member account for qualifying suite stays, dining or activities"
        />
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-surface-700">
              Select Guest Member
            </label>
            <select
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-surface-300 text-sm focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none bg-white cursor-pointer"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.tier}) — {m.points.toLocaleString()} pts
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-surface-700">
              Points Amount
            </label>
            <input
              type="number"
              value={amount}
              min={1}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="px-4 py-2.5 rounded-xl border border-surface-300 text-sm focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none font-mono"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-surface-700">
              Transaction Reason / Folio Reference
            </label>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Deluxe Villa Stay Folio #4492"
              className="px-4 py-2.5 rounded-xl border border-surface-300 text-sm focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => memberId && onAddPoints(memberId, amount, reason)}
            className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-surface-950 hover:bg-brand-950 text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            Credit Points to Member
          </button>
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Rewards & Perks Catalog"
          subtitle="Submit an expedited redemption claim on member's behalf"
        />
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-surface-700">
              Beneficiary Member
            </label>
            <select
              value={redeemMember}
              onChange={(e) => setRedeemMember(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-surface-300 text-sm focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none bg-white cursor-pointer"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — Balance: {m.points.toLocaleString()} pts
                </option>
              ))}
            </select>
          </div>

          <div className="divide-y divide-surface-100 rounded-2xl border border-surface-200 overflow-hidden">
            {REWARDS.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-4 text-xs hover:bg-surface-50 transition-colors"
              >
                <div>
                  <p className="font-semibold text-surface-950 text-sm">{r.name}</p>
                  <p className="text-xs text-surface-500 font-mono mt-0.5">
                    {r.category} &bull; {r.cost.toLocaleString()} pts
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRedeem(redeemMember, r.id)}
                  className="px-4 py-1.5 rounded-full bg-brand-900 hover:bg-brand-950 text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Claim
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

/* =========================================================================
   TIERS TAB
   ========================================================================= */

function TiersTab({ members }: { members: Member[] }) {
  const sorted = mergeSort(members, (a, b) => b.lifetimePoints - a.lifetimePoints);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader
          title="Tier Thresholds & Qualifications"
          subtitle="Cumulative lifetime spend points required per tier status"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
          {TIER_THRESHOLDS.map((t) => (
            <div
              key={t.tier}
              className="p-5 rounded-2xl border border-surface-200 bg-surface-50 flex flex-col justify-between gap-3"
            >
              <TierBadge tier={t.tier} />
              <p className="text-2xl font-bold font-mono text-surface-950">
                {t.min.toLocaleString()}+ <span className="text-xs font-normal text-surface-500">pts</span>
              </p>
              <span className="text-[11px] text-surface-500 font-light">
                {t.tier === "Platinum"
                  ? "VIP Concierge & Complimentary Suite Upgrades"
                  : t.tier === "Gold"
                  ? "Priority Check-In & 10% Dining Discount"
                  : t.tier === "Silver"
                  ? "5% Dining Discount & Late Checkout"
                  : "Standard Resort Rewards Entry"}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Member Tier Leaderboard & Progress"
          subtitle="Ranked by cumulative lifetime point accumulation"
        />
        <div className="divide-y divide-surface-100">
          {sorted.map((m, idx) => {
            const { next, remaining, pct } = nextTierInfo(m.lifetimePoints);
            return (
              <div key={m.id} className="flex items-center gap-4 px-6 py-4 hover:bg-surface-50 transition-colors">
                <span className="text-xs font-mono font-bold text-surface-400 w-6">
                  #{idx + 1}
                </span>
                <TierRing pct={pct} tier={m.tier} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-surface-950 text-sm truncate">{m.name}</p>
                    <TierBadge tier={m.tier} />
                  </div>
                  <p className="text-xs text-surface-500 font-mono mt-0.5">
                    {m.lifetimePoints.toLocaleString()} lifetime pts &bull;{" "}
                    {next ? `${remaining.toLocaleString()} pts to ${next}` : "Top Tier Attained"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

/* =========================================================================
   REDEMPTION QUEUE TAB
   ========================================================================= */

function RedemptionTab({
  members,
  requests,
  onProcess,
}: {
  members: Member[];
  requests: RedemptionRequest[];
  onProcess: (id: string, action: "Approved" | "Rejected") => void;
}) {
  const [filter, setFilter] = useState<RequestStatus | "All">("Pending");
  const visible = filterItems(requests, [(r) => (filter === "All" ? true : r.status === filter)]);
  const sorted = mergeSort(visible, (a, b) => (a.requestDate < b.requestDate ? 1 : -1));

  return (
    <Card>
      <CardHeader
        title="Redemption Authorization Queue"
        subtitle={`${requests.filter((r) => r.status === "Pending").length} pending claims requiring desk approval`}
        action={
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as RequestStatus | "All")}
            className="rounded-xl border border-surface-300 px-3 py-1.5 text-xs outline-none bg-white font-medium"
          >
            {(["All", "Pending", "Approved", "Rejected"] as const).map((s) => (
              <option key={s} value={s}>
                Status: {s}
              </option>
            ))}
          </select>
        }
      />
      <div className="divide-y divide-surface-100">
        {sorted.map((r) => {
          const member = members.find((m) => m.id === r.memberId);
          const reward = REWARDS.find((rw) => rw.id === r.rewardId);

          return (
            <div
              key={r.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4 hover:bg-surface-50 transition-colors"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-surface-950">
                    {member?.name || r.memberId}
                  </span>
                  <span className="text-xs text-surface-400 font-mono">
                    ({r.memberId})
                  </span>
                </div>
                <p className="text-xs text-surface-600 font-mono">
                  {reward?.name ?? r.rewardId} &bull;{" "}
                  <span className="font-bold text-brand-700">{r.pointsCost.toLocaleString()} pts</span>
                  {r.requestDate ? ` \u2022 Requested: ${formatDate(r.requestDate)}` : ""}
                  {r.decisionDate ? ` \u2022 Decided: ${formatDate(r.decisionDate)}` : ""}
                </p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <StatusPill status={r.status} />
                {r.status === "Pending" && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onProcess(r.id, "Approved")}
                      className="px-4 py-1.5 rounded-full bg-surface-950 hover:bg-brand-950 text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
                    >
                      Authorize
                    </button>
                    <button
                      type="button"
                      onClick={() => onProcess(r.id, "Rejected")}
                      className="px-4 py-1.5 rounded-full border border-surface-300 hover:bg-surface-100 text-surface-700 text-xs font-semibold uppercase tracking-wider cursor-pointer"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {sorted.length === 0 && (
          <p className="p-8 text-xs text-surface-500 font-light text-center">
            No redemption requests match this filter criteria.
          </p>
        )}
      </div>
    </Card>
  );
}

/* =========================================================================
   NOTIFICATIONS TAB
   ========================================================================= */

function NotificationsTab({
  members,
  expiringSoon,
  pendingRequests,
}: {
  members: Member[];
  expiringSoon: { member: Member; entry: PointsLedgerEntry; days: number }[];
  pendingRequests: RedemptionRequest[];
}) {
  const nearUpgrade = mergeSort(
    members.filter((m) => {
      const info = nextTierInfo(m.lifetimePoints);
      return info.next && info.remaining <= 1000;
    }),
    (a, b) => nextTierInfo(a.lifetimePoints).remaining - nextTierInfo(b.lifetimePoints).remaining,
  );

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader
          title="Expiring Loyalty Points (30-Day Window)"
          subtitle={`${expiringSoon.length} member ledgers due for point amortization`}
        />
        <div className="divide-y divide-surface-100">
          {expiringSoon.map((row) => (
            <div
              key={row.entry.id}
              className="flex items-center justify-between px-6 py-4 text-xs hover:bg-surface-50 transition-colors"
            >
              <div>
                <p className="font-semibold text-surface-950 text-sm">{row.member.name}</p>
                <p className="text-xs text-surface-500 font-mono mt-0.5">
                  {row.entry.amount.toLocaleString()} pts &bull; {row.entry.description}
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-brand-900 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
                Expires in {row.days} days
              </span>
            </div>
          ))}
          {expiringSoon.length === 0 && (
            <p className="p-6 text-xs text-surface-500 font-light text-center">
              No points are expiring in the next 30 days.
            </p>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Members Within Upgrade Threshold"
          subtitle="VIP members within 1,000 points of automatic tier progression"
        />
        <div className="divide-y divide-surface-100">
          {nearUpgrade.map((m) => {
            const info = nextTierInfo(m.lifetimePoints);
            return (
              <div
                key={m.id}
                className="flex items-center justify-between px-6 py-4 text-xs hover:bg-surface-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-surface-950 text-sm">{m.name}</p>
                  <TierBadge tier={m.tier} />
                </div>
                <span className="text-xs font-mono font-bold text-brand-700">
                  {info.remaining.toLocaleString()} pts needed for {info.next}
                </span>
              </div>
            );
          })}
          {nearUpgrade.length === 0 && (
            <p className="p-6 text-xs text-surface-500 font-light text-center">
              No members are currently within 1,000 points of the next tier.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}

/* =========================================================================
   REPORTS TAB
   ========================================================================= */

function ReportsTab({ members, requests }: { members: Member[]; requests: RedemptionRequest[] }) {
  const [reportKind, setReportKind] = useState<"members" | "redemption">("members");

  // Member Performance filters
  const [mTier, setMTier] = useState<TierName | "All">("All");
  const [mMinPoints, setMMinPoints] = useState(0);
  const [mSearch, setMSearch] = useState("");
  const [mSortBy, setMSortBy] = useState<"points" | "name" | "joinDate">("points");

  // Redemption Activity filters
  const [rStatus, setRStatus] = useState<RequestStatus | "All">("All");
  const [rCategory, setRCategory] = useState<string>("All");
  const [rSortBy, setRSortBy] = useState<"date" | "points">("date");

  const [output, setOutput] = useState<string[]>([
    "TARUMT RESORTS — EXECUTIVE LOYALTY & REWARDS REPORTING CONSOLE",
    "Select a report specification, configure parameters, and click Generate Report.",
  ]);

  function generateMemberReport() {
    const lines: string[] = [];
    const bySearch = mSearch.trim();
    let directHit: Member | null = null;
    if (bySearch && /^M?\d+$/i.test(bySearch)) {
      const normalizedId = bySearch.toUpperCase().startsWith("M") ? bySearch.toUpperCase() : `M${bySearch}`;
      const sortedById = mergeSort(members, (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
      directHit = binarySearchById(sortedById, normalizedId);
    }

    const filtered = filterItems(members, [
      (m) => (mTier === "All" ? true : m.tier === mTier),
      (m) => m.points >= mMinPoints,
      (m) =>
        bySearch
          ? m.name.toLowerCase().includes(bySearch.toLowerCase()) ||
            m.id.toLowerCase().includes(bySearch.toLowerCase())
          : true,
    ]);

    const compareFns: Record<typeof mSortBy, (a: Member, b: Member) => number> = {
      points: (a, b) => b.points - a.points,
      name: (a, b) => a.name.localeCompare(b.name),
      joinDate: (a, b) => (a.joinDate < b.joinDate ? -1 : a.joinDate > b.joinDate ? 1 : 0),
    };
    const sorted = mergeSort(filtered, compareFns[mSortBy]);

    lines.push("=".repeat(78));
    lines.push("MEMBER PERFORMANCE REPORT".padEnd(50) + `Generated: ${isoDate(new Date())}`);
    lines.push("=".repeat(78));
    lines.push(`Filters -> Tier: ${mTier} | Min points: ${mMinPoints} | Search: "${bySearch || "none"}" | Sort: ${mSortBy}`);
    lines.push("-".repeat(78));

    if (directHit) {
      lines.push(`DIRECT LOOKUP (binary search on ID "${directHit.id}"): FOUND`);
      lines.push(`  ${directHit.name} | ${directHit.tier} | ${directHit.points.toLocaleString()} pts | joined ${formatDate(directHit.joinDate)}`);
      lines.push("-".repeat(78));
    }

    lines.push(pad("NAME", 22) + pad("TIER", 10) + padL("POINTS", 10) + "   " + pad("JOINED", 12));
    lines.push("-".repeat(78));
    for (const m of sorted) {
      lines.push(pad(m.name, 22) + pad(m.tier, 10) + padL(m.points.toLocaleString(), 10) + "   " + pad(formatDate(m.joinDate), 12));
    }
    lines.push("-".repeat(78));

    const totalPoints = sorted.reduce((s, m) => s + m.points, 0);
    const avgPoints = sorted.length ? Math.round(totalPoints / sorted.length) : 0;
    const byTier: Record<string, number> = {};
    for (const m of sorted) byTier[m.tier] = (byTier[m.tier] ?? 0) + 1;

    lines.push(`Matched records: ${sorted.length}`);
    lines.push(`Total points: ${totalPoints.toLocaleString()}   Average per member: ${avgPoints.toLocaleString()}`);
    lines.push(`Tier breakdown: ${Object.entries(byTier).map(([t, c]) => `${t}=${c}`).join("  ") || "none"}`);
    lines.push("=".repeat(78));

    setOutput(lines);
  }

  function generateRedemptionReport() {
    const lines: string[] = [];
    const filtered = filterItems(requests, [
      (r) => (rStatus === "All" ? true : r.status === rStatus),
      (r) => {
        if (rCategory === "All") return true;
        const reward = REWARDS.find((rw) => rw.id === r.rewardId);
        return reward?.category === rCategory;
      },
    ]);

    const compareFns: Record<typeof rSortBy, (a: RedemptionRequest, b: RedemptionRequest) => number> = {
      date: (a, b) => (a.requestDate < b.requestDate ? 1 : a.requestDate > b.requestDate ? -1 : 0),
      points: (a, b) => b.pointsCost - a.pointsCost,
    };
    const sorted = mergeSort(filtered, compareFns[rSortBy]);

    lines.push("=".repeat(84));
    lines.push("REDEMPTION ACTIVITY REPORT".padEnd(55) + `Generated: ${isoDate(new Date())}`);
    lines.push("=".repeat(84));
    lines.push(`Filters -> Status: ${rStatus} | Category: ${rCategory} | Sort: ${rSortBy}`);
    lines.push("-".repeat(84));
    lines.push(
      pad("REQ ID", 9) + pad("MEMBER", 18) + pad("REWARD", 22) + padL("POINTS", 8) + "   " + pad("STATUS", 10) + pad("DATE", 12)
    );
    lines.push("-".repeat(84));

    for (const r of sorted) {
      const member = members.find((m) => m.id === r.memberId);
      const reward = REWARDS.find((rw) => rw.id === r.rewardId);
      lines.push(
        pad(r.id, 9) +
          pad(member?.name ?? r.memberId, 18) +
          pad(reward?.name ?? r.rewardId, 22) +
          padL(r.pointsCost.toLocaleString(), 8) +
          "   " +
          pad(r.status, 10) +
          pad(r.requestDate ? formatDate(r.requestDate) : "", 12)
      );
    }
    lines.push("-".repeat(84));

    const totalPointsRedeemed = sorted.filter((r) => r.status === "Approved").reduce((s, r) => s + r.pointsCost, 0);
    const byStatus: Record<string, number> = {};
    for (const r of sorted) byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;

    lines.push(`Matched records: ${sorted.length}`);
    lines.push(`Points redeemed (approved only): ${totalPointsRedeemed.toLocaleString()}`);
    lines.push(`Status breakdown: ${Object.entries(byStatus).map(([s, c]) => `${s}=${c}`).join("  ") || "none"}`);
    lines.push("=".repeat(84));

    setOutput(lines);
  }

  const rewardCategories = ["All", ...Array.from(new Set(REWARDS.map((r) => r.category)))];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader
          title="Management Report Generator"
          subtitle="Configure multi-factor parameters and query constraints"
          action={
            <select
              value={reportKind}
              onChange={(e) => setReportKind(e.target.value as "members" | "redemption")}
              className="rounded-xl border border-surface-300 px-3 py-1.5 text-xs outline-none bg-white font-medium"
            >
              <option value="members">Member Performance Report</option>
              <option value="redemption">Redemption Activity Report</option>
            </select>
          }
        />

        {reportKind === "members" ? (
          <div className="p-6 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-surface-700">
                  Tier Qualification
                </label>
                <select
                  value={mTier}
                  onChange={(e) => setMTier(e.target.value as TierName | "All")}
                  className="px-3.5 py-2.5 rounded-xl border border-surface-300 text-xs focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none bg-white cursor-pointer"
                >
                  {(["All", "Bronze", "Silver", "Gold", "Platinum"] as const).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-surface-700">
                  Minimum Points
                </label>
                <input
                  type="number"
                  value={mMinPoints}
                  onChange={(e) => setMMinPoints(Number(e.target.value))}
                  className="px-3.5 py-2.5 rounded-xl border border-surface-300 text-xs focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none font-mono"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-surface-700">
                Search Query (Name or ID)
              </label>
              <input
                value={mSearch}
                onChange={(e) => setMSearch(e.target.value)}
                placeholder="Leave blank for entire guest directory"
                className="px-3.5 py-2.5 rounded-xl border border-surface-300 text-xs focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-surface-700">
                Sort Ordering
              </label>
              <select
                value={mSortBy}
                onChange={(e) => setMSortBy(e.target.value as typeof mSortBy)}
                className="px-3.5 py-2.5 rounded-xl border border-surface-300 text-xs focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none bg-white cursor-pointer"
              >
                <option value="points">Points (Highest First)</option>
                <option value="name">Guest Name (A-Z)</option>
                <option value="joinDate">Enrollment Date (Oldest First)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={generateMemberReport}
              className="w-full mt-2 py-3 px-6 rounded-2xl bg-surface-950 hover:bg-brand-950 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              Compile & Render Report
            </button>
          </div>
        ) : (
          <div className="p-6 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-surface-700">
                  Claim Status
                </label>
                <select
                  value={rStatus}
                  onChange={(e) => setRStatus(e.target.value as RequestStatus | "All")}
                  className="px-3.5 py-2.5 rounded-xl border border-surface-300 text-xs focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none bg-white cursor-pointer"
                >
                  {(["All", "Pending", "Approved", "Rejected"] as const).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-surface-700">
                  Perk Category
                </label>
                <select
                  value={rCategory}
                  onChange={(e) => setRCategory(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-surface-300 text-xs focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none bg-white cursor-pointer"
                >
                  {rewardCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-surface-700">
                Sort Ordering
              </label>
              <select
                value={rSortBy}
                onChange={(e) => setRSortBy(e.target.value as typeof rSortBy)}
                className="px-3.5 py-2.5 rounded-xl border border-surface-300 text-xs focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none bg-white cursor-pointer"
              >
                <option value="date">Request Timestamp (Newest First)</option>
                <option value="points">Points Cost (Highest First)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={generateRedemptionReport}
              className="w-full mt-2 py-3 px-6 rounded-2xl bg-surface-950 hover:bg-brand-950 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              Compile & Render Report
            </button>
          </div>
        )}
      </Card>

      {/* Monospace Console Display */}
      <Card className="overflow-hidden flex flex-col">
        <CardHeader
          title="Terminal Output Stream"
          subtitle="Fixed-width formatted audit ledger for executive review"
        />
        <pre className="flex-1 max-h-[500px] overflow-auto whitespace-pre bg-surface-950 p-6 font-mono text-[11px] leading-relaxed text-brand-200 border-t border-surface-800">
          {output.join("\n")}
        </pre>
      </Card>
    </div>
  );
}