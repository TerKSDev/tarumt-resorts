import { useState } from "react";
import { Search } from "lucide-react";
import { Card, CardHeader, TierBadge, TierRing } from "./UiPrimitives";
import { filterItems, formatDate, nextTierInfo } from "../../../../lib/util/loyalty";
import type { Member } from "../../../../lib/types/loyalty";

export default function MembersTab({
  members,
  selectedMemberId,
  onSelect,
}: {
  members: Member[];
  selectedMemberId: string;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const filtered = filterItems(members, [
    (m) =>
      query
        ? m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.id.toLowerCase().includes(query.toLowerCase())
        : true,
  ]);
  const selected = members.find((m) => m.id === selectedMemberId) ?? members[0];

  if (!selected) {
    return (
      <Card className="p-12 text-center">
        <p className="text-sm text-surface-500 font-light">
          No registered members found in the resort database.
        </p>
      </Card>
    );
  }

  const { next, remaining, pct } = nextTierInfo(selected.lifetimePoints);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Directory List */}
      <Card className="lg:col-span-1 flex flex-col overflow-hidden">
        <CardHeader
          title="Member Directory"
          subtitle={`${filtered.length} of ${members.length} members matching`}
          icon={Users}
        />
        <div className="p-4 border-b border-surface-100">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-100 border border-surface-200 text-xs">
            <Search size={14} className="text-surface-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search member name or ID..."
              className="w-full bg-transparent outline-none text-surface-900 placeholder:text-surface-400 font-normal"
            />
          </div>
        </div>
        <div className="max-h-[500px] divide-y divide-surface-100 overflow-y-auto scrollbar-hidden">
          {filtered.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelect(m.id)}
              className={`flex w-full items-center justify-between px-5 py-3.5 text-left text-xs transition-colors cursor-pointer ${
                m.id === selected.id ? "bg-brand-50/70 border-l-4 border-brand-600" : "hover:bg-surface-50"
              }`}
            >
              <div>
                <p className="font-semibold text-surface-950 text-sm">{m.name}</p>
                <p className="text-xs text-surface-500 font-mono mt-0.5">
                  {m.points.toLocaleString()} pts
                </p>
              </div>
              <TierBadge tier={m.tier} />
            </button>
          ))}
        </div>
      </Card>

      {/* Selected Member Detail */}
      <Card className="lg:col-span-2 flex flex-col">
        <CardHeader
          title={selected.name}
          subtitle={`Member Identifier: ${selected.id} • Registered ${formatDate(selected.joinDate)}`}
          icon={Crown}
          action={<TierBadge tier={selected.tier} />}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 border-b border-surface-100">
          <div className="flex items-center gap-4">
            <TierRing pct={pct} tier={selected.tier} />
            <div>
              <p className="text-xs text-surface-500 uppercase tracking-wider font-semibold">
                {next ? `Next: ${next}` : "Peak Tier"}
              </p>
              <p className="text-sm font-semibold text-surface-950 mt-0.5">
                {next ? `${remaining.toLocaleString()} pts left` : "Platinum Achieved"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Redeemable Balance
            </p>
            <p className="mt-1 text-2xl font-bold font-mono text-surface-950">
              {selected.points.toLocaleString()} <span className="text-xs font-normal text-surface-500">pts</span>
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Lifetime Earned
            </p>
            <p className="mt-1 text-2xl font-bold font-mono text-surface-950">
              {selected.lifetimePoints.toLocaleString()} <span className="text-xs font-normal text-surface-500">pts</span>
            </p>
          </div>
        </div>

        {/* Ledger Activity */}
        <div className="p-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-surface-500 mb-4">
            Points Ledger & Statement History
          </h4>
          <div className="max-h-64 space-y-2.5 overflow-y-auto scrollbar-hidden">
            {[...selected.ledger]
              .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
              .map((l) => (
                <div
                  key={l.id}
                  className="flex items-center justify-between rounded-2xl border border-surface-200 bg-surface-50/60 px-4 py-3 text-xs"
                >
                  <div>
                    <p className="font-semibold text-surface-950">{l.description}</p>
                    <p className="text-[11px] text-surface-500 font-mono mt-0.5">
                      {formatDate(l.date)}
                      {l.expiryDate ? ` \u2022 Expires ${formatDate(l.expiryDate)}` : ""}
                    </p>
                  </div>
                  <span
                    className={`font-mono font-bold text-sm ${
                      l.type === "earn" ? "text-brand-700" : "text-surface-600"
                    }`}
                  >
                    {l.type === "earn" ? "+" : "-"}{l.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            {selected.ledger.length === 0 && (
              <p className="text-xs text-surface-400 italic py-4 text-center">
                No ledger transactions recorded for this member.
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

