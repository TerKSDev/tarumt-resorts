import { useState } from "react";
import { Card, CardHeader } from "./UiPrimitives";
import { REWARDS } from "../../../../lib/config/loyalty";
import {
  binarySearchById,
  filterItems,
  formatDate,
  isoDate,
  mergeSort,
  pad,
  padL,
} from "../../../../lib/util/loyalty";
import type { Member, RedemptionRequest, RequestStatus, TierName } from "../../../../lib/types/loyalty";

export default function ReportsTab({
  members,
  requests,
}: {
  members: Member[];
  requests: RedemptionRequest[];
}) {
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
          icon={FileText}
          action={
            <select
              value={reportKind}
              onChange={(e) => setReportKind(e.target.value as "members" | "redemption")}
              className="rounded-xl border border-surface-300 px-3 py-1.5 text-xs outline-none bg-white font-medium cursor-pointer"
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

