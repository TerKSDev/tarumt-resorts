import { useState } from "react";
import { CircleDollarSign, Gift } from "lucide-react";
import { Card, CardHeader } from "./UiPrimitives";
import { REWARDS } from "../../../../lib/config/loyalty";
import type { Member } from "../../../../lib/types/loyalty";

export default function PointsTab({
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
          icon={CircleDollarSign}
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
          icon={Gift}
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
            {REWARDS.map((r) => {
              const currentMember = members.find((m) => m.id === redeemMember);
              const canAfford = currentMember ? currentMember.points >= r.cost : false;

              return (
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
                    disabled={!canAfford}
                    onClick={() => onRedeem(redeemMember, r.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                      canAfford
                        ? "bg-brand-900 hover:bg-brand-950 text-white cursor-pointer"
                        : "bg-surface-200 text-surface-400 cursor-not-allowed"
                    }`}
                  >
                    {canAfford ? "Claim" : "Insufficient Pts"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
