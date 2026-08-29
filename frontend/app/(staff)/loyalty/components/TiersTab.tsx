import { Crown, Trophy } from "lucide-react";
import { Card, CardHeader, TierBadge, TierRing } from "./UiPrimitives";
import { TIER_THRESHOLDS } from "../../../../lib/config/loyalty";
import { mergeSort, nextTierInfo } from "../../../../lib/util/loyalty";
import type { Member } from "../../../../lib/types/loyalty";

export default function TiersTab({ members }: { members: Member[] }) {
  const sorted = mergeSort(members, (a, b) => b.lifetimePoints - a.lifetimePoints);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader
          title="Tier Thresholds & Qualifications"
          subtitle="Cumulative lifetime spend points required per tier status"
          icon={Crown}
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
          icon={Trophy}
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
