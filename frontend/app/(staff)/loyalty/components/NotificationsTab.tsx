import { Bell, Sparkles } from "lucide-react";
import { Card, CardHeader, TierBadge } from "./UiPrimitives";
import { mergeSort, nextTierInfo } from "../../../../lib/util/loyalty";
import type { Member, PointsLedgerEntry } from "../../../../lib/types/loyalty";

export default function NotificationsTab({
  members,
  expiringSoon,
}: {
  members: Member[];
  expiringSoon: { member: Member; entry: PointsLedgerEntry; days: number }[];
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
          icon={Bell}
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
          icon={Sparkles}
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
