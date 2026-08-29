import type { ReactNode } from "react";
import { Crown, CheckCircle, XCircle, Clock } from "lucide-react";
import { TIER_STYLES } from "../../../../lib/config/loyalty";
import type { TierName, RequestStatus } from "../../../../lib/types/loyalty";
import { Card, CardHeader } from "../../../../components/Card";

export { Card, CardHeader };

export function TierBadge({ tier }: { tier: TierName }) {
  const style = TIER_STYLES[tier] || TIER_STYLES.Bronze;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${style.badge}`}
    >
      <Crown size={11} />
      <span>{tier}</span>
    </span>
  );
}

export function StatusPill({ status }: { status: RequestStatus }) {
  const styles: Record<RequestStatus, string> = {
    Pending: "bg-brand-50 text-brand-700 border-brand-200 font-semibold",
    Approved: "bg-surface-950 text-white border-surface-950 font-semibold",
    Rejected: "bg-surface-100 text-surface-600 border-surface-300",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-0.5 text-[11px] uppercase tracking-wider ${styles[status]}`}
    >
      {status === "Approved" ? (
        <CheckCircle size={11} className="text-brand-300" />
      ) : status === "Rejected" ? (
        <XCircle size={11} className="text-surface-400" />
      ) : (
        <Clock size={11} className="text-brand-600" />
      )}
      {status}
    </span>
  );
}

export function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: any;
}) {
  return (
    <Card className="p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
          {label}
        </span>
        <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 shadow-2xs">
          <Icon size={18} strokeWidth={1.75} />
        </div>
      </div>
      <p className="mt-3 text-2xl md:text-3xl font-bold font-mono text-surface-950 tracking-tight">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-surface-500 font-light">{hint}</p>}
    </Card>
  );
}

export function TierRing({ pct, tier }: { pct: number; tier: TierName }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  const style = TIER_STYLES[tier] || TIER_STYLES.Bronze;

  return (
    <svg width="68" height="68" viewBox="0 0 64 64" className="shrink-0">
      <circle cx="32" cy="32" r={r} fill="none" stroke="#e2e8f0" strokeWidth="5.5" />
      <circle
        cx="32"
        cy="32"
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform="rotate(-90 32 32)"
        className={style.ring}
      />
      <text
        x="32"
        y="37"
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fontFamily="monospace"
        fill="#0f172a"
      >
        {pct}%
      </text>
    </svg>
  );
}
