// By Tek Shao Xian
import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { TicketCheck, Sparkles } from "lucide-react";
import { Card, CardHeader } from "../../../../../components/Card";

/* =========================================================================
   TYPES
   ========================================================================= */

type RequestStatus = "Pending" | "Approved" | "Rejected";

interface MemberLite {
  id: string;
  name: string;
}

interface RedemptionRequest {
  id: string;
  memberId: string;
  rewardId: string;
  pointsCost: number;
  status: RequestStatus;
  requestDate: string;
}

interface Reward {
  id: string;
  name: string;
  category: string;
  cost: number;
}

const REWARDS: Reward[] = [
  { id: "R1", name: "Free Night Stay", category: "Room", cost: 6000 },
  { id: "R2", name: "Room Upgrade", category: "Room", cost: 2000 },
  { id: "R3", name: "Spa Voucher (60 min)", category: "Wellness", cost: 1500 },
  { id: "R4", name: "Airport Transfer", category: "Transport", cost: 800 },
  { id: "R5", name: "Dining Credit (RM100)", category: "Dining", cost: 1000 },
  { id: "R6", name: "Late Checkout (4pm)", category: "Room", cost: 400 },
];

/* =========================================================================
   SMALL HELPERS
   ========================================================================= */

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
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

function mergeSort<T>(items: T[], compare: (a: T, b: T) => number): T[] {
  if (items.length <= 1) return items;
  const mid = Math.floor(items.length / 2);
  const left = mergeSort(items.slice(0, mid), compare);
  const right = mergeSort(items.slice(mid), compare);

  const out: T[] = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (compare(left[i], right[j]) <= 0) {
      out.push(left[i++]);
    } else {
      out.push(right[j++]);
    }
  }
  return out.concat(left.slice(i)).concat(right.slice(j));
}

function filterItems<T>(items: T[], predicates: ((item: T) => boolean)[]): T[] {
  return items.filter((it) => predicates.every((p) => p(it)));
}

/* =========================================================================
   LIVE DATA FETCHING
   ========================================================================= */

const API_BASE = "http://localhost:8081";

interface RawCustomer {
  identityNo: string;
  name: string;
}

interface RawRedeemRecord {
  redeemId?: number;
  memberId?: string;
  points?: number;
  status?: string;
  redeemedAt?: string;
  remarks?: string;
}

async function fetchMembersRaw(): Promise<MemberLite[]> {
  try {
    const res = await fetch(`${API_BASE}/api/loyalty/members`);
    if (!res.ok) return [];
    const list: RawCustomer[] = await res.json();
    return list.map((c) => ({ id: c.identityNo, name: c.name }));
  } catch {
    return [];
  }
}

async function fetchRedeemRaw(): Promise<RedemptionRequest[]> {
  try {
    const res = await fetch(`${API_BASE}/api/loyalty/redeem`);
    if (!res.ok) return [];
    const list: RawRedeemRecord[] = await res.json();
    return list.map((r, idx) => {
      const rewardMatch =
        REWARDS.find((rw) => rw.name.toLowerCase() === (r.remarks || "").toLowerCase()) ||
        REWARDS.find((rw) => rw.cost === Number(r.points || 0));
      return {
        id: `REQ-${String(r.redeemId ?? idx + 1).padStart(4, "0")}`,
        memberId: r.memberId || "UNKNOWN",
        rewardId: rewardMatch ? rewardMatch.id : "R1",
        pointsCost: Number(r.points || 0),
        status: (r.status as RequestStatus) || "Pending",
        requestDate: r.redeemedAt ? r.redeemedAt.slice(0, 10) : isoDate(new Date()),
      };
    });
  } catch {
    return [];
  }
}

/* =========================================================================
   REPORT BUILDER
   ========================================================================= */

function buildRedemptionReport(
  members: MemberLite[],
  requests: RedemptionRequest[],
  sp: URLSearchParams,
): string[] {
  const lines: string[] = [];

  const status = (sp.get("status") || "all") as RequestStatus | "all";
  const rewardId = (sp.get("rewardId") || "all") as string;
  const memberId = (sp.get("memberId") || "all") as string;
  const search = (sp.get("search") || "").trim().toLowerCase();
  const sortBy = (sp.get("sortBy") || "date-desc") as
    | "date-desc"
    | "date-asc"
    | "points-desc"
    | "points-asc"
    | "memberName";

  const memberMap = new Map(members.map((m) => [m.id, m.name]));
  const rewardMap = new Map(REWARDS.map((r) => [r.id, r]));

  const predicates: ((r: RedemptionRequest) => boolean)[] = [];
  if (status !== "all") predicates.push((r) => r.status === status);
  if (rewardId !== "all") predicates.push((r) => r.rewardId === rewardId);
  if (memberId !== "all") predicates.push((r) => r.memberId === memberId);
  if (search) {
    predicates.push((r) => {
      const mName = (memberMap.get(r.memberId) ?? "").toLowerCase();
      const rName = (rewardMap.get(r.rewardId)?.name ?? "").toLowerCase();
      return (
        r.id.toLowerCase().includes(search) ||
        r.memberId.toLowerCase().includes(search) ||
        mName.includes(search) ||
        rName.includes(search)
      );
    });
  }

  const filtered = filterItems(requests, predicates);

  const compareFns: Record<typeof sortBy, (a: RedemptionRequest, b: RedemptionRequest) => number> = {
    "date-desc": (a, b) => (a.requestDate < b.requestDate ? 1 : -1),
    "date-asc": (a, b) => (a.requestDate > b.requestDate ? 1 : -1),
    "points-desc": (a, b) => b.pointsCost - a.pointsCost,
    "points-asc": (a, b) => a.pointsCost - b.pointsCost,
    memberName: (a, b) => {
      const na = memberMap.get(a.memberId) ?? a.memberId;
      const nb = memberMap.get(b.memberId) ?? b.memberId;
      return na.localeCompare(nb);
    },
  };
  const sorted = mergeSort(filtered, compareFns[sortBy]);

  lines.push("=".repeat(88));
  lines.push("REDEMPTION ACTIVITY AUDIT REPORT".padEnd(55) + `Generated: ${isoDate(new Date())}`);
  lines.push("=".repeat(88));
  lines.push(`Filters -> Status: ${status} | Reward: ${rewardId} | Member: ${memberId} | Search: "${search || "none"}" | Sort: ${sortBy}`);
  lines.push("-".repeat(88));
  lines.push(
    pad("REQ ID", 10) +
      pad("MEMBER", 22) +
      pad("REWARD", 24) +
      padL("COST (PTS)", 11) +
      "  " +
      pad("STATUS", 10) +
      pad("DATE", 11),
  );
  lines.push("-".repeat(88));

  for (const r of sorted) {
    const mName = memberMap.get(r.memberId) ?? r.memberId;
    const rName = rewardMap.get(r.rewardId)?.name ?? r.rewardId;
    lines.push(
      pad(r.id, 10) +
        pad(mName, 22) +
        pad(rName, 24) +
        padL(r.pointsCost.toLocaleString(), 11) +
        "  " +
        pad(r.status, 10) +
        pad(formatDate(r.requestDate), 11),
    );
  }
  lines.push("-".repeat(88));

  const totalPoints = sorted.reduce((s, r) => s + r.pointsCost, 0);
  const byStatus: Record<string, number> = {};
  for (const r of sorted) byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;

  lines.push(`Matched claims: ${sorted.length}`);
  lines.push(`Total points value: ${totalPoints.toLocaleString()} pts`);
  lines.push(`Status breakdown: ${Object.entries(byStatus).map(([st, c]) => `${st}=${c}`).join("  ") || "none"}`);
  lines.push("=".repeat(88));

  return lines;
}

export default function RedemptionRecord() {
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([fetchMembersRaw(), fetchRedeemRaw()])
      .then(([members, requests]) => {
        if (cancelled) return;
        setLines(buildRedemptionReport(members, requests, searchParams));
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load report data");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  return (
    <Card>
      <CardHeader
        title="VIP Member Loyalty Redemption Audit Report"
        subtitle="Verification records of perk claims, status breakdown, and points liabilities."
        icon={TicketCheck}
        action={
          <div className="flex items-center gap-2 text-xs px-3.5 py-1.5 print:hidden bg-brand-50 text-brand-700 font-semibold border border-brand-200 rounded-full shadow-2xs">
            <Sparkles size={13} className="text-brand-600" />
            <span>Voucher Audit</span>
          </div>
        }
      />

      <div className="p-6 md:p-8 bg-surface-950">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-surface-400 font-mono text-xs gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-400" />
            <span>Compiling redemption claims ledger...</span>
          </div>
        ) : error ? (
          <div className="p-6 text-xs text-red-400 font-mono">Failed to load report: {error}</div>
        ) : (
          <pre className="max-h-[70vh] overflow-auto whitespace-pre font-mono text-xs leading-relaxed text-brand-200 scrollbar-hidden">
            {lines.join("\n")}
          </pre>
        )}
      </div>
    </Card>
  );
}