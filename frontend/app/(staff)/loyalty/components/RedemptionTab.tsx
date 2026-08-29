import { useState } from "react";
import { Clock } from "lucide-react";
import { Card, CardHeader, StatusPill } from "./UiPrimitives";
import { REWARDS } from "../../../../lib/config/loyalty";
import { filterItems, formatDate, mergeSort } from "../../../../lib/util/loyalty";
import type { Member, RedemptionRequest, RequestStatus } from "../../../../lib/types/loyalty";

export default function RedemptionTab({
  members,
  requests,
  onProcess,
}: {
  members: Member[];
  requests: RedemptionRequest[];
  onProcess: (id: string, action: "Approved" | "Rejected") => void;
}) {
  const [filter, setFilter] = useState<RequestStatus | "All">("Pending");
  const visible = filterItems(requests, [(r) => (filter === "All" ? true : r.status === filter)]);
  const sorted = mergeSort(visible, (a, b) => (a.requestDate < b.requestDate ? 1 : -1));

  return (
    <Card>
      <CardHeader
        title="Redemption Authorization Queue"
        subtitle={`${requests.filter((r) => r.status === "Pending").length} pending claims requiring desk approval`}
        icon={Clock}
        action={
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as RequestStatus | "All")}
            className="rounded-xl border border-surface-300 px-3 py-1.5 text-xs outline-none bg-white font-medium cursor-pointer"
          >
            {(["All", "Pending", "Approved", "Rejected"] as const).map((s) => (
              <option key={s} value={s}>
                Status: {s}
              </option>
            ))}
          </select>
        }
      />
      <div className="divide-y divide-surface-100">
        {sorted.map((r) => {
          const member = members.find((m) => m.id === r.memberId);
          const reward = REWARDS.find((rw) => rw.id === r.rewardId);

          return (
            <div
              key={r.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4 hover:bg-surface-50 transition-colors"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-surface-950">
                    {member?.name || r.memberId}
                  </span>
                  <span className="text-xs text-surface-400 font-mono">
                    ({r.memberId})
                  </span>
                </div>
                <p className="text-xs text-surface-600 font-mono">
                  {reward?.name ?? r.rewardId} &bull;{" "}
                  <span className="font-bold text-brand-700">{r.pointsCost.toLocaleString()} pts</span>
                  {r.requestDate ? ` \u2022 Requested: ${formatDate(r.requestDate)}` : ""}
                  {r.decisionDate ? ` \u2022 Decided: ${formatDate(r.decisionDate)}` : ""}
                </p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <StatusPill status={r.status} />
                {r.status === "Pending" && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onProcess(r.id, "Approved")}
                      className="px-4 py-1.5 rounded-full bg-surface-950 hover:bg-brand-950 text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
                    >
                      Authorize
                    </button>
                    <button
                      type="button"
                      onClick={() => onProcess(r.id, "Rejected")}
                      className="px-4 py-1.5 rounded-full border border-surface-300 hover:bg-surface-100 text-surface-700 text-xs font-semibold uppercase tracking-wider cursor-pointer"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {sorted.length === 0 && (
          <p className="p-8 text-xs text-surface-500 font-light text-center">
            No redemption requests match this filter criteria.
          </p>
        )}
      </div>
    </Card>
  );
}
