//By Tek Shao Xian

import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";

/* =========================================================================
   TYPES
   ========================================================================= */

type TierName = "Bronze" | "Silver" | "Gold" | "Platinum";

interface Member {
  id: string;
  name: string;
  tier: TierName;
  points: number;
  joinDate: string;
}

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
   DATA — fetched fresh in this component (Report Centre is a separate
   route tree with no access to the Loyalty page's state).
   ========================================================================= */

const API_BASE_URL = "http://localhost:8081";

function normalizeTier(raw: string | undefined): TierName {
  const upper = (raw ?? "").toUpperCase();
  if (upper === "BRONZE" || upper === "SILVER" || upper === "GOLD" || upper === "PLATINUM") {
    return (upper.charAt(0) + upper.slice(1).toLowerCase()) as TierName;
  }
  return "Bronze";
}

interface CustomerApiResponse {
  customerId: string;
  createdAt?: string;
  loyaltyTier: string;
  name: string;
}

async function fetchMembersRaw(): Promise<Member[]> {
  const res = await fetch(`${API_BASE_URL}/api/customers`);
  if (!res.ok) throw new Error(`Failed to load customers (${res.status})`);
  const data: CustomerApiResponse[] = await res.json();
  return data.map((c) => ({
    id: c.customerId,
    name: c.name,
    tier: normalizeTier(c.loyaltyTier),
    points: 0,
    joinDate: c.createdAt ?? "",
  }));
}

interface PointApiResponse {
  customerId: string;
  point: number;
  expireDate?: string;
}

async function fetchPointsRaw(): Promise<PointApiResponse[]> {
  const res = await fetch(`${API_BASE_URL}/api/points`);
  if (!res.ok) throw new Error(`Failed to load points (${res.status})`);
  return res.json();
}

function applyPointsToMembers(members: Member[], pointsRows: PointApiResponse[]): Member[] {
  const now = Date.now();
  return members.map((m) => {
    const activePoints = pointsRows
      .filter((p) => p.customerId === m.id && (!p.expireDate || new Date(p.expireDate).getTime() > now))
      .reduce((sum, p) => sum + (p.point ?? 0), 0);
    return { ...m, points: activePoints };
  });
}

interface RedeemApiResponse {
  customerId: string;
  point: number;
  status: boolean | null;
}

async function fetchApprovedRedemptionsRaw(): Promise<{ memberId: string; pointsCost: number }[]> {
  const res = await fetch(`${API_BASE_URL}/api/redeem`);
  if (!res.ok) throw new Error(`Failed to load redemption requests (${res.status})`);
  const data: RedeemApiResponse[] = await res.json();
  return data
    .filter((r) => r.status === true)
    .map((r) => ({ memberId: r.customerId, pointsCost: r.point ?? 0 }));
}

function applyApprovedRedemptions(members: Member[], approved: { memberId: string; pointsCost: number }[]): Member[] {
  return members.map((m) => {
    const redeemed = approved.filter((r) => r.memberId === m.id).reduce((sum, r) => sum + r.pointsCost, 0);
    return redeemed > 0 ? { ...m, points: Math.max(0, m.points - redeemed) } : m;
  });
}

/* =========================================================================
   REPORT GENERATOR
   ========================================================================= */

function buildMemberReport(members: Member[], params: URLSearchParams): string[] {
  const lines: string[] = [];
  const tier = (params.get("tier") ?? "All") as TierName | "All";
  const minPoints = Number(params.get("minPoints") ?? 0);
  const search = (params.get("search") ?? "").trim();
  const sortBy = (params.get("sortBy") ?? "points") as "points" | "name" | "joinDate";

  let directHit: Member | null = null;
  if (search && /^M?\d+$/i.test(search)) {
    const normalizedId = search.toUpperCase().startsWith("M") ? search.toUpperCase() : `M${search}`;
    const sortedById = mergeSort(members, (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
    directHit = binarySearchById(sortedById, normalizedId);
  }

  const filtered = filterItems(members, [
    (m) => (tier === "All" ? true : m.tier === tier),
    (m) => m.points >= minPoints,
    (m) => (search ? m.name.toLowerCase().includes(search.toLowerCase()) || m.id.toLowerCase().includes(search.toLowerCase()) : true),
  ]);

  const compareFns: Record<typeof sortBy, (a: Member, b: Member) => number> = {
    points: (a, b) => b.points - a.points,
    name: (a, b) => a.name.localeCompare(b.name),
    joinDate: (a, b) => (a.joinDate < b.joinDate ? -1 : a.joinDate > b.joinDate ? 1 : 0),
  };
  const sorted = mergeSort(filtered, compareFns[sortBy]);

  lines.push("=".repeat(78));
  lines.push("MEMBER PERFORMANCE REPORT".padEnd(50) + `Generated: ${isoDate(new Date())}`);
  lines.push("=".repeat(78));
  lines.push(`Filters -> Tier: ${tier} | Min points: ${minPoints} | Search: "${search || "none"}" | Sort: ${sortBy}`);
  lines.push("-".repeat(78));

  if (directHit) {
    lines.push(`DIRECT LOOKUP (binary search on ID "${directHit.id}"): FOUND`);
    lines.push(`  ${directHit.name} | ${directHit.tier} | ${directHit.points.toLocaleString()} pts | joined ${formatDate(directHit.joinDate)}`);
    lines.push("-".repeat(78));
  } else if (search && /^M?\d+$/i.test(search)) {
    lines.push(`DIRECT LOOKUP (binary search on ID "${search}"): NOT FOUND`);
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

  return lines;
}

/* =========================================================================
   COMPONENT — rendered inside report.tsx, which already provides the page
   chrome (back button, breadcrumb, related-reports footer).
   ========================================================================= */

export default function MemberPoints() {
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([fetchMembersRaw(), fetchPointsRaw(), fetchApprovedRedemptionsRaw()])
      .then(([rawMembers, points, approvedRedemptions]) => {
        if (cancelled) return;
        const members = applyApprovedRedemptions(applyPointsToMembers(rawMembers, points), approvedRedemptions);
        setLines(buildMemberReport(members, searchParams));
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