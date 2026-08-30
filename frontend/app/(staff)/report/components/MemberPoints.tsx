// By Tek Shao Xian
import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { Crown, Sparkles } from "lucide-react";
import { Card, CardHeader } from "../../../../components/Card";

import type { Member, TierName } from "../../../../lib/types/loyalty";

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

function binarySearchById(items: Member[], id: string): Member | null {
  let lo = 0;
  let hi = items.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const midId = items[mid].id;
    if (midId === id) return items[mid];
    if (midId < id) lo = mid + 1;
    else hi = mid - 1;
  }
  return null;
}

function filterItems<T>(items: T[], predicates: ((item: T) => boolean)[]): T[] {
  return items.filter((it) => predicates.every((p) => p(it)));
}

import {
  fetchMembersFromApi,
  fetchPointsFromApi,
  fetchRedeemFromApi,
  applyPointsToMembers,
  applyApprovedRedemptions,
  mapRedeemToRequest
} from "../../../../lib/api/loyalty";

/* =========================================================================
   REPORT BUILDER
   ========================================================================= */

function buildMemberReport(members: Member[], sp: URLSearchParams): string[] {
  const lines: string[] = [];

  const tier = (sp.get("tier") || "all") as TierName | "all";
  const minPoints = Number(sp.get("minPoints") || 0);
  const search = (sp.get("search") || "").trim();
  const sortBy = (sp.get("sortBy") || "points-desc") as
    | "points-desc"
    | "points-asc"
    | "name"
    | "joinDate";

  const sortedById = mergeSort(members, (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const directHit = search ? binarySearchById(sortedById, search) : null;

  const predicates: ((m: Member) => boolean)[] = [];
  if (tier !== "all") predicates.push((m) => m.tier === tier);
  if (minPoints > 0) predicates.push((m) => m.points >= minPoints);
  if (search) {
    const q = search.toLowerCase();
    predicates.push((m) => m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q));
  }

  const filtered = filterItems(members, predicates);

  const compareFns: Record<typeof sortBy, (a: Member, b: Member) => number> = {
    "points-desc": (a, b) => b.points - a.points,
    "points-asc": (a, b) => a.points - b.points,
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

export default function MemberPoints() {
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([fetchMembersFromApi(), fetchPointsFromApi(), fetchRedeemFromApi()])
      .then(([rawMembers, points, rawRedeems]) => {
        if (cancelled) return;
        const requests = rawRedeems.map(mapRedeemToRequest);
        const members = applyApprovedRedemptions(applyPointsToMembers(rawMembers, points), requests);
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
  }, [searchParams]);

  return (
    <Card>
      <CardHeader
        title="Loyalty Rewards & Member Points Ledger Audit"
        subtitle="Multi-factor member performance query stream with binary search direct ID hit detection."
        icon={Crown}
        action={
          <div className="flex items-center gap-2 text-xs px-3.5 py-1.5 print:hidden bg-brand-50 text-brand-700 font-semibold border border-brand-200 rounded-full shadow-2xs">
            <Sparkles size={13} className="text-brand-600" />
            <span>Audit Stream</span>
          </div>
        }
      />

      <div className="p-6 md:p-8 bg-surface-950">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-surface-400 font-mono text-xs gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-400" />
            <span>Compiling member performance ledger...</span>
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