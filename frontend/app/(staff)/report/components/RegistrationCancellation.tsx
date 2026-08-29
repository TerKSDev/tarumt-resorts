import type { MetaFunction } from "react-router";
import {
  UserRoundX,
  TrendingDown,
  AlertCircle,
  Calendar,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";

export const meta: MetaFunction = () => [
  { title: "Registration Cancellation Analysis | TARUMT Resorts" },
];

export default function RegistrationCancellation() {
  const cancellationLogs = [
    { confNo: "CF-202608-812", guest: "Jonathan Sterling", suite: "Deluxe Ocean Suite", cancelDate: "2026-08-28", reason: "Flight Rescheduling", feeApplied: "RM 0 (48h Notice)" },
    { confNo: "CF-202608-794", guest: "Elena Rostova", suite: "Royal Villa", cancelDate: "2026-08-27", reason: "Personal Emergency", feeApplied: "RM 250 (Late Fee)" },
    { confNo: "CF-202608-761", guest: "Kenji Takahashi", suite: "Executive Suite", cancelDate: "2026-08-25", reason: "Weather / Typhoon Advisory", feeApplied: "RM 0 (Policy Waiver)" },
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
            <UserRoundX size={22} strokeWidth={1.75} />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-xl md:text-2xl font-serif text-surface-950 font-semibold tracking-tight">
              Registration & Reservation Cancellation Analysis
            </h2>
            <p className="text-xs md:text-sm text-surface-600 font-light leading-relaxed max-w-2xl">
              Audit log of booking cancellations, fee assessments, policy waivers, and root-cause trends.
            </p>
            <span className="text-[11px] text-surface-500 font-mono mt-1">
              Generated: {new Date().toLocaleDateString("en-GB")} • Revenue & Policy Audit
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs px-3.5 py-1.5 print:hidden bg-brand-50 text-brand-700 font-semibold border border-brand-200 rounded-full w-fit self-start shrink-0 shadow-2xs">
          <Sparkles size={13} className="text-brand-600" />
          <span>Cancellation Metric</span>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-surface-200 divide-y sm:divide-y-0 sm:divide-x divide-surface-200 bg-white">
        <div className="flex flex-col gap-2 p-5 md:p-6 justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Monthly Cancellation Rate
            </span>
            <div className="w-7 h-7 rounded-lg border flex items-center justify-center text-brand-600 bg-brand-50 border-brand-200">
              <TrendingDown size={15} strokeWidth={1.75} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-mono text-surface-950 mt-1">
            3.2% <span className="text-sm font-normal text-surface-500">of Total Bookings</span>
          </p>
          <span className="text-xs text-surface-500 font-light">Well below industry threshold (5%)</span>
        </div>

        <div className="flex flex-col gap-2 p-5 md:p-6 justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Cancellations (This Week)
            </span>
            <div className="w-7 h-7 rounded-lg border flex items-center justify-center text-brand-700 bg-brand-100/60 border-brand-300">
              <AlertCircle size={15} strokeWidth={1.75} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-mono text-surface-950 mt-1">
            3 <span className="text-sm font-normal text-surface-500">Cases</span>
          </p>
          <span className="text-xs text-surface-500 font-light">Inventory re-released to inventory</span>
        </div>

        <div className="flex flex-col gap-2 p-5 md:p-6 justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Retained Revenue / Fees
            </span>
            <div className="w-7 h-7 rounded-lg border flex items-center justify-center text-surface-700 bg-surface-100 border-surface-300">
              <UserRoundX size={15} strokeWidth={1.75} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-mono text-surface-950 mt-1">
            RM 1,250
          </p>
          <span className="text-xs text-surface-500 font-light">Late cancellation penalty collected</span>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-surface-600 text-xs font-semibold uppercase tracking-wider bg-surface-100/60 border-b border-surface-200">
              <th className="py-3.5 px-6">Confirmation Ref</th>
              <th className="py-3.5 px-6">Guest Name</th>
              <th className="py-3.5 px-6">Cancelled Suite</th>
              <th className="py-3.5 px-6">Date of Cancellation</th>
              <th className="py-3.5 px-6">Stated Reason</th>
              <th className="py-3.5 px-6">Penalty / Waiver</th>
            </tr>
          </thead>
          <tbody>
            {cancellationLogs.map((log, idx) => (
              <tr
                key={idx}
                className="border-b border-surface-100 last:border-0 hover:bg-brand-50/30 transition-colors"
              >
                <td className="py-4 px-6">
                  <span className="text-xs font-mono font-bold text-surface-800 bg-surface-100 px-2 py-1 rounded border border-surface-200">
                    {log.confNo}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm font-semibold text-surface-950">
                    {log.guest}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-xs font-medium text-surface-700">
                    {log.suite}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-1.5 text-surface-600">
                    <Calendar size={13} className="text-surface-400" />
                    <span className="text-xs font-mono">{log.cancelDate}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-xs text-surface-700">
                    {log.reason}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-xs font-semibold font-mono text-brand-900 bg-brand-50 px-2.5 py-1 rounded border border-brand-200">
                    {log.feeApplied}
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
