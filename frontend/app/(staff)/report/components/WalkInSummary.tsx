import type { MetaFunction } from "react-router";
import {
  Footprints,
  CreditCard,
  BedDouble,
  Clock,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";

export const meta: MetaFunction = () => [
  { title: "Daily Walk-In Registration Summary | TARUMT Resorts" },
];

export default function WalkInSummary() {
  const walkInList = [
    { regNo: "WI-202608-101", guest: "David Miller", room: "105", type: "Deluxe Ocean Suite", checkInTime: "14:20", nights: 2, totalPaid: "RM 1,560", paymentMethod: "Credit Card (Visa)" },
    { regNo: "WI-202608-102", guest: "Sarah Jenkins", room: "107", type: "Deluxe Ocean Suite", checkInTime: "16:45", nights: 1, totalPaid: "RM 780", paymentMethod: "Online Banking (FPX)" },
    { regNo: "WI-202608-103", guest: "Bryan Koh", room: "204", type: "Executive Suite", checkInTime: "18:10", nights: 3, totalPaid: "RM 3,240", paymentMethod: "Credit Card (Mastercard)" },
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
            <Footprints size={22} strokeWidth={1.75} />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-xl md:text-2xl font-serif text-surface-950 font-semibold tracking-tight">
              Daily Walk-In Guest Registration Manifest
            </h2>
            <p className="text-xs md:text-sm text-surface-600 font-light leading-relaxed max-w-2xl">
              Real-time summary of same-day walk-in guest arrivals, instant suite assignments, and front-desk revenue captures.
            </p>
            <span className="text-[11px] text-surface-500 font-mono mt-1">
              Generated: {new Date().toLocaleDateString("en-GB")} • Front Desk Immediate Ledger
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs px-3.5 py-1.5 print:hidden bg-brand-50 text-brand-700 font-semibold border border-brand-200 rounded-full w-fit self-start shrink-0 shadow-2xs">
          <Sparkles size={13} className="text-brand-600" />
          <span>Walk-In Ledger</span>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-surface-200 divide-y sm:divide-y-0 sm:divide-x divide-surface-200 bg-white">
        <div className="flex flex-col gap-2 p-5 md:p-6 justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Walk-Ins Registered Today
            </span>
            <div className="w-7 h-7 rounded-lg border flex items-center justify-center text-brand-600 bg-brand-50 border-brand-200">
              <Footprints size={15} strokeWidth={1.75} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-mono text-surface-950 mt-1">
            3 <span className="text-sm font-normal text-surface-500">Parties</span>
          </p>
          <span className="text-xs text-surface-500 font-light">Direct spot bookings</span>
        </div>

        <div className="flex flex-col gap-2 p-5 md:p-6 justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Direct Spot Revenue
            </span>
            <div className="w-7 h-7 rounded-lg border flex items-center justify-center text-brand-700 bg-brand-100/60 border-brand-300">
              <TrendingUp size={15} strokeWidth={1.75} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-mono text-surface-950 mt-1">
            RM 5,580
          </p>
          <span className="text-xs text-surface-500 font-light">100% Collected at desk</span>
        </div>

        <div className="flex flex-col gap-2 p-5 md:p-6 justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Avg Room Rate Captured
            </span>
            <div className="w-7 h-7 rounded-lg border flex items-center justify-center text-surface-700 bg-surface-100 border-surface-300">
              <CreditCard size={15} strokeWidth={1.75} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-mono text-surface-950 mt-1">
            RM 930 <span className="text-sm font-normal text-surface-500">/ night</span>
          </p>
          <span className="text-xs text-surface-500 font-light">Standard Rack Rate Achieved</span>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-surface-600 text-xs font-semibold uppercase tracking-wider bg-surface-100/60 border-b border-surface-200">
              <th className="py-3.5 px-6">Reg No.</th>
              <th className="py-3.5 px-6">Guest Name</th>
              <th className="py-3.5 px-6">Allocated Suite</th>
              <th className="py-3.5 px-6">Check-In Time</th>
              <th className="py-3.5 px-6">Stay Length</th>
              <th className="py-3.5 px-6">Settlement Method</th>
              <th className="py-3.5 px-6">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {walkInList.map((wi, idx) => (
              <tr
                key={idx}
                className="border-b border-surface-100 last:border-0 hover:bg-brand-50/30 transition-colors"
              >
                <td className="py-4 px-6">
                  <span className="text-xs font-mono font-bold text-surface-800 bg-surface-100 px-2 py-1 rounded border border-surface-200">
                    {wi.regNo}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm font-semibold text-surface-950">
                    {wi.guest}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-1.5">
                    <BedDouble size={15} className="text-surface-400" />
                    <span className="text-xs font-medium text-surface-800">
                      Suite {wi.room} ({wi.type})
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-1.5 text-surface-600">
                    <Clock size={13} className="text-surface-400" />
                    <span className="text-xs font-mono">{wi.checkInTime}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-xs text-surface-700 font-medium">
                    {wi.nights} Night(s)
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-xs text-surface-600">
                    {wi.paymentMethod}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm font-bold font-mono text-surface-950">
                    {wi.totalPaid}
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
