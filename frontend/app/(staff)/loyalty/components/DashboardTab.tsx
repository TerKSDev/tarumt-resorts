import { Users, TrendingUp, Gift, Clock, ChevronRight } from "lucide-react";
import { Card, CardHeader, KpiCard, StatusPill } from "./UiPrimitives";
import { REWARDS } from "../../../../lib/config/loyalty";
import type { Member, RedemptionRequest, PointsLedgerEntry, TabKey } from "../../../../lib/types/loyalty";

export default function DashboardTab({
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
            icon={Clock}
            action={
              <button
                type="button"
                onClick={() => goTo("notifications")}
                className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1 cursor-pointer"
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
            icon={Gift}
            action={
              <button
                type="button"
                onClick={() => goTo("redemption")}
                className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1 cursor-pointer"
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

