import type { MetaFunction } from "react-router";
import {
  CircleDollarSign,
  Crown,
  TrendingUp,
  Award,
  Users,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";

export const meta: MetaFunction = () => [
  { title: "Member Points | TARUMT Resorts" },
];

export default function MemberPoints() {
  const memberPointRecords = [
    { name: "Tan Sri Alex Wong", tier: "Platinum", memberId: "TR-8801", balance: "145,200", accumulated: "18,400", tierProgress: "92%" },
    { name: "Datin Jennifer Lee", tier: "Gold", memberId: "TR-6523", balance: "82,500", accumulated: "9,200", tierProgress: "78%" },
    { name: "Dr. Marcus Thorne", tier: "Platinum", memberId: "TR-9014", balance: "210,000", accumulated: "34,000", tierProgress: "100%" },
    { name: "Chloe Lim", tier: "Silver", memberId: "TR-3412", balance: "24,800", accumulated: "4,500", tierProgress: "45%" },
    { name: "Robert Davies", tier: "Bronze", memberId: "TR-1029", balance: "8,900", accumulated: "2,100", tierProgress: "18%" },
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
            <CircleDollarSign size={22} strokeWidth={1.75} />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-xl md:text-2xl font-serif text-surface-950 font-semibold tracking-tight">
              Loyalty Rewards & Member Points Ledger
            </h2>
            <p className="text-xs md:text-sm text-surface-600 font-light leading-relaxed max-w-2xl">
              Track points accumulation, active redemption balances, and tier promotion velocities across all loyalty tiers.
            </p>
            <span className="text-[11px] text-surface-500 font-mono mt-1">
              Generated: {new Date().toLocaleDateString("en-GB")} • Loyalty Management System
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs px-3.5 py-1.5 print:hidden bg-brand-50 text-brand-700 font-semibold border border-brand-200 rounded-full w-fit self-start shrink-0 shadow-2xs">
          <Crown size={13} className="text-brand-600" />
          <span>Loyalty Analytics</span>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-surface-200 divide-y sm:divide-y-0 sm:divide-x divide-surface-200 bg-white">
        <div className="flex flex-col gap-2 p-5 md:p-6 justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Total Points in Circulation
            </span>
            <div className="w-7 h-7 rounded-lg border flex items-center justify-center text-brand-600 bg-brand-50 border-brand-200">
              <TrendingUp size={15} strokeWidth={1.75} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-mono text-surface-950 mt-1">
            2.48M <span className="text-sm font-normal text-surface-500">Pts</span>
          </p>
          <span className="text-xs text-surface-500 font-light">+12.4% vs last month</span>
        </div>

        <div className="flex flex-col gap-2 p-5 md:p-6 justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Active VIP Members
            </span>
            <div className="w-7 h-7 rounded-lg border flex items-center justify-center text-brand-700 bg-brand-100/60 border-brand-300">
              <Crown size={15} strokeWidth={1.75} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-mono text-surface-950 mt-1">
            428 <span className="text-sm font-normal text-surface-500">Gold & Platinum</span>
          </p>
          <span className="text-xs text-surface-500 font-light">High-value guest retention</span>
        </div>

        <div className="flex flex-col gap-2 p-5 md:p-6 justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Avg Reward Velocity
            </span>
            <div className="w-7 h-7 rounded-lg border flex items-center justify-center text-surface-700 bg-surface-100 border-surface-300">
              <Award size={15} strokeWidth={1.75} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-mono text-surface-950 mt-1">
            18.5k <span className="text-sm font-normal text-surface-500">pts/stay</span>
          </p>
          <span className="text-xs text-surface-500 font-light">Direct resort spend multiplier</span>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-surface-600 text-xs font-semibold uppercase tracking-wider bg-surface-100/60 border-b border-surface-200">
              <th className="py-3.5 px-6">Member Profile</th>
              <th className="py-3.5 px-6">Membership ID</th>
              <th className="py-3.5 px-6">Tier Level</th>
              <th className="py-3.5 px-6">Current Balance</th>
              <th className="py-3.5 px-6">Earned This Quarter</th>
              <th className="py-3.5 px-6">Tier Progress</th>
            </tr>
          </thead>
          <tbody>
            {memberPointRecords.map((m, idx) => (
              <tr
                key={idx}
                className="border-b border-surface-100 last:border-0 hover:bg-brand-50/30 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-brand-900 text-brand-300 font-bold text-xs flex items-center justify-center font-serif">
                      {m.name.charAt(0)}
                    </div>
                    <span className="text-sm font-semibold text-surface-950">
                      {m.name}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-xs font-mono text-surface-700 bg-surface-100 px-2 py-1 rounded border border-surface-200">
                    {m.memberId}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                      m.tier === "Platinum"
                        ? "bg-brand-900 text-white border-brand-900"
                        : m.tier === "Gold"
                        ? "bg-brand-50 text-brand-700 border-brand-300 font-bold"
                        : "bg-surface-100 text-surface-700 border-surface-300"
                    }`}
                  >
                    <Crown size={10} />
                    {m.tier}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm font-bold font-mono text-surface-950">
                    {m.balance} pts
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-xs font-mono text-brand-700 font-medium">
                    +{m.accumulated} pts
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2 max-w-28">
                    <div className="flex-1 h-1.5 bg-surface-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-600 rounded-full"
                        style={{ width: m.tierProgress }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-surface-600">
                      {m.tierProgress}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
