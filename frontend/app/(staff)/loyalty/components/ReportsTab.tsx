import { useState } from "react";
import { Card, CardHeader } from "./UiPrimitives";
import { REWARDS } from "../../../../lib/config/loyalty";
import type { RequestStatus, TierName } from "../../../../lib/types/loyalty";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router";

export default function ReportsTab() {
  const navigate = useNavigate();
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

  function generateMemberReport() {
    const params = new URLSearchParams();
    if (mTier !== "All") params.set("tier", mTier);
    if (mMinPoints > 0) params.set("minPoints", mMinPoints.toString());
    if (mSearch.trim()) params.set("search", mSearch.trim());
    
    let mappedSort = "points-desc";
    if (mSortBy === "name") mappedSort = "name";
    if (mSortBy === "joinDate") mappedSort = "joinDate";
    params.set("sortBy", mappedSort);

    navigate(`/report/member-points?${params.toString()}`);
  }

  function generateRedemptionReport() {
    const params = new URLSearchParams();
    if (rStatus !== "All") params.set("status", rStatus);
    
    // ReportsTab filters by Category, but RedemptionRecord component expects rewardId or search for category...
    // Actually, RedemptionRecord searches by reward name. We can pass the category as a search term if needed, or leave it out if not strictly supported.
    if (rCategory !== "All") {
      params.set("search", rCategory);
    }
    
    let mappedSort = "date-desc";
    if (rSortBy === "points") mappedSort = "points-desc";
    params.set("sortBy", mappedSort);

    navigate(`/report/redemption-record?${params.toString()}`);
  }

  const rewardCategories = ["All", ...Array.from(new Set(REWARDS.map((r) => r.category)))];

  return (
    <div className="grid grid-cols-1 gap-6">
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
    </div>
  );
}

