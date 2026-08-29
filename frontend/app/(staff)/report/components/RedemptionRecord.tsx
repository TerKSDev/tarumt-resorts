import type { MetaFunction } from "react-router";
import {
  TicketCheck,
  Gift,
  Calendar,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { motion } from "motion/react";

export const meta: MetaFunction = () => [
  { title: "Redemption Record | TARUMT Resorts" },
];

export default function RedemptionRecord() {
  const redemptionLogs = [
    { id: "RDM-9941", member: "Tan Sri Alex Wong", item: "Complimentary Spa & Wellness Pass", points: "15,000", date: "2026-08-29", status: "Claimed" },
    { id: "RDM-9942", member: "Datin Jennifer Lee", item: "Fine Dining Dining Voucher (RM 300)", points: "12,000", date: "2026-08-29", status: "Claimed" },
    { id: "RDM-9943", member: "Dr. Marcus Thorne", item: "Suite Upgrade Voucher (1 Night)", points: "25,000", date: "2026-08-28", status: "Claimed" },
    { id: "RDM-9944", member: "Chloe Lim", item: "Resort Golf Club Day Access", points: "8,000", date: "2026-08-27", status: "Claimed" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col flex-1 rounded-3xl border border-surface-200 bg-white shadow-md overflow-hidden"
    >
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between p-6 md:p-8 gap-4 bg-surface-50 border-b border-surface-200">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-brand-900 text-brand-300 rounded-2xl border border-brand-800 shadow-sm shrink-0">
            <TicketCheck size={22} strokeWidth={1.75} />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-xl md:text-2xl font-serif text-surface-950 font-semibold tracking-tight">
              Member Loyalty Redemption Audit
            </h2>
            <p className="text-xs md:text-sm text-surface-600 font-light leading-relaxed max-w-2xl">
              Audit log of VIP reward redemptions, wellness credits, and dining voucher transactions.
            </p>
            <span className="text-[11px] text-surface-500 font-mono mt-1">
              Generated: {new Date().toLocaleDateString("en-GB")} • Concierge Rewards Desk
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs px-3.5 py-1.5 print:hidden bg-brand-50 text-brand-700 font-semibold border border-brand-200 rounded-full w-fit self-start shrink-0 shadow-2xs">
          <Sparkles size={13} className="text-brand-600" />
          <span>Voucher Registry</span>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-surface-200 divide-y sm:divide-y-0 sm:divide-x divide-surface-200 bg-white">
        <div className="flex flex-col gap-2 p-5 md:p-6 justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Redemptions This Month
            </span>
            <div className="w-7 h-7 rounded-lg border flex items-center justify-center text-brand-600 bg-brand-50 border-brand-200">
              <Gift size={15} strokeWidth={1.75} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-mono text-surface-950 mt-1">
            184 <span className="text-sm font-normal text-surface-500">Claims</span>
          </p>
          <span className="text-xs text-surface-500 font-light">100% Verified & Fulfilled</span>
        </div>

        <div className="flex flex-col gap-2 p-5 md:p-6 justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Points Burn Volume
            </span>
            <div className="w-7 h-7 rounded-lg border flex items-center justify-center text-brand-700 bg-brand-100/60 border-brand-300">
              <ShoppingBag size={15} strokeWidth={1.75} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-mono text-surface-950 mt-1">
            1.12M <span className="text-sm font-normal text-surface-500">Pts</span>
          </p>
          <span className="text-xs text-surface-500 font-light">Loyalty liability offset</span>
        </div>

        <div className="flex flex-col gap-2 p-5 md:p-6 justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Top Claim Category
            </span>
            <div className="w-7 h-7 rounded-lg border flex items-center justify-center text-surface-700 bg-surface-100 border-surface-300">
              <TicketCheck size={15} strokeWidth={1.75} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-mono text-surface-950 mt-1">
            Dining <span className="text-sm font-normal text-surface-500">(42%)</span>
          </p>
          <span className="text-xs text-surface-500 font-light">Followed by Suite Upgrades (31%)</span>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-surface-600 text-xs font-semibold uppercase tracking-wider bg-surface-100/60 border-b border-surface-200">
              <th className="py-3.5 px-6">Redemption ID</th>
              <th className="py-3.5 px-6">Member Name</th>
              <th className="py-3.5 px-6">Reward Item Claimed</th>
              <th className="py-3.5 px-6">Points Deducted</th>
              <th className="py-3.5 px-6">Date Claimed</th>
              <th className="py-3.5 px-6">Fulfillment</th>
            </tr>
          </thead>
          <tbody>
            {redemptionLogs.map((log, idx) => (
              <tr
                key={idx}
                className="border-b border-surface-100 last:border-0 hover:bg-brand-50/30 transition-colors"
              >
                <td className="py-4 px-6">
                  <span className="text-xs font-mono font-bold text-surface-800 bg-surface-100 px-2 py-1 rounded border border-surface-200">
                    {log.id}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm font-semibold text-surface-950">
                    {log.member}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Gift size={14} className="text-brand-600 shrink-0" />
                    <span className="text-xs font-medium text-surface-800">
                      {log.item}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-xs font-bold font-mono text-brand-700">
                    -{log.points} pts
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-1.5 text-surface-600">
                    <Calendar size={13} className="text-surface-400" />
                    <span className="text-xs font-mono">{log.date}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-brand-50 text-brand-700 border border-brand-200 uppercase tracking-wider">
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
