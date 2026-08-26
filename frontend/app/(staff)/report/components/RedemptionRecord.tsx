//By Tek Shao Xian

import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";

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
   SMALL HELPERS — same formatting rules as the Loyalty page.
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

function filterItems<T>(items: T[], predicates: Array<(item: T) => boolean>): T[] {
  return items.filter((item) => predicates.every((p) => p(item)));
}

/* =========================================================================
   DATA — fetched fresh in this component (Report Centre is a separate
   route tree with no access to the Loyalty page's state).
   ========================================================================= */

const API_BASE_URL = "http://localhost:8081";

interface CustomerApiResponse {
  customerId: string;
  name: string;
}

async function fetchMembersRaw(): Promise<MemberLite[]> {
  const res = await fetch(`${API_BASE_URL}/api/customers`);
  if (!res.ok) throw new Error(`Failed to load customers (${res.status})`);
  const data: CustomerApiResponse[] = await res.json();
  return data.map((c) => ({ id: c.customerId, name: c.name }));
}

interface RedeemApiResponse {
  id: number;
  customerId: string;
  point: number;
  status: boolean | null;
  description: string;
  date?: string;
}

async function fetchRedeemRaw(): Promise<RedemptionRequest[]> {
  const res = await fetch(`${API_BASE_URL}/api/redeem`);
  if (!res.ok) throw new Error(`Failed to load redemption requests (${res.status})`);
  const data: RedeemApiResponse[] = await res.json();
  return data.map((r) => ({
    id: String(r.id),
    memberId: r.customerId,
    rewardId: r.description,
    pointsCost: r.point ?? 0,
    status: r.status === true ? "Approved" : r.status === false ? "Rejected" : "Pending",
    requestDate: r.date ?? "",
  }));
}

/* =========================================================================
   REPORT GENERATOR
   ========================================================================= */

function buildRedemptionReport(members: MemberLite[], requests: RedemptionRequest[], params: URLSearchParams): string[] {
  const lines: string[] = [];
  const status = (params.get("status") ?? "All") as RequestStatus | "All";
  const category = params.get("category") ?? "All";
  const sortBy = (params.get("sortBy") ?? "date") as "date" | "points";

  const filtered = filterItems(requests, [
    (r) => (status === "All" ? true : r.status === status),
    (r) => {
      if (category === "All") return true;
      const reward = REWARDS.find((rw) => rw.id === r.rewardId);
      return reward?.category === category;
    },
  ]);

  const compareFns: Record<typeof sortBy, (a: RedemptionRequest, b: RedemptionRequest) => number> = {
    date: (a, b) => (a.requestDate < b.requestDate ? 1 : a.requestDate > b.requestDate ? -1 : 0),
    points: (a, b) => b.pointsCost - a.pointsCost,
  };
  const sorted = mergeSort(filtered, compareFns[sortBy]);

  lines.push("=".repeat(84));
  lines.push("REDEMPTION ACTIVITY REPORT".padEnd(55) + `Generated: ${isoDate(new Date())}`);
  lines.push("=".repeat(84));
  lines.push(`Filters -> Status: ${status} | Category: ${category} | Sort: ${sortBy}`);
  lines.push("-".repeat(84));
  lines.push(pad("REQ ID", 9) + pad("MEMBER", 18) + pad("REWARD", 22) + padL("POINTS", 8) + "   " + pad("STATUS", 10) + pad("DATE", 12));
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

  return lines;
}

/* =========================================================================
   COMPONENT — rendered inside report.tsx, which already provides the page
   chrome (back button, breadcrumb, related-reports footer).
   ========================================================================= */

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  return (
    <div className="overflow-hidden rounded-xl border border-surface-300 bg-surface-50 shadow-xs">
      {loading ? (
        <div className="p-6 text-sm text-surface-500">Loading report…</div>
      ) : error ? (
        <div className="p-6 text-sm text-red-600">Couldn&apos;t load report: {error}</div>
      ) : (
        <pre className="max-h-[70vh] overflow-auto whitespace-pre bg-[#081226] p-5 font-mono text-[11px] leading-relaxed text-blue-100">
          {lines.join("\n")}
        </pre>
      )}
    </div>
  );
}