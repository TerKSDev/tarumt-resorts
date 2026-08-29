import type { MetaFunction } from "react-router";
import {
  BrushCleaning,
  Clock,
  CheckCircle2,
  AlertCircle,
  Timer,
  Sparkles,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

export const meta: MetaFunction = () => [
  { title: "Staff Cleaning Turnaround | TARUMT Resorts" },
];

export default function CleaningTurnaround() {
  const turnaroundMetrics = [
    {
      staff: "Ahmad Razak",
      id: "HK-104",
      roomsCleaned: 14,
      avgMinutes: 28,
      inspectedPassRate: "98%",
      status: "Optimal",
    },
    {
      staff: "Mei Ling Tan",
      id: "HK-108",
      roomsCleaned: 16,
      avgMinutes: 24,
      inspectedPassRate: "100%",
      status: "Optimal",
    },
    {
      staff: "Suresh Kumar",
      id: "HK-112",
      roomsCleaned: 11,
      avgMinutes: 34,
      inspectedPassRate: "94%",
      status: "Attention",
    },
    {
      staff: "Nurul Izzah",
      id: "HK-115",
      roomsCleaned: 15,
      avgMinutes: 26,
      inspectedPassRate: "97%",
      status: "Optimal",
    },
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
            <BrushCleaning size={22} strokeWidth={1.75} />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-xl md:text-2xl font-serif text-surface-950 font-semibold tracking-tight">
              Staff Cleaning Turnaround Efficiency Audit
            </h2>
            <p className="text-xs md:text-sm text-surface-600 font-light leading-relaxed max-w-2xl">
              Performance metrics tracking average housekeeping duration per
              suite, inspection quality pass rates, and daily turnover totals.
            </p>
            <span className="text-[11px] text-surface-500 font-mono mt-1">
              Generated: {new Date().toLocaleDateString("en-GB")} • Housekeeping
              Operations
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs px-3.5 py-1.5 print:hidden bg-brand-50 text-brand-700 font-semibold border border-brand-200 rounded-full w-fit self-start shrink-0 shadow-2xs">
          <Sparkles size={13} className="text-brand-600" />
          <span>Turnaround Benchmark</span>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-surface-200 divide-y sm:divide-y-0 sm:divide-x divide-surface-200 bg-white">
        <div className="flex flex-col gap-2 p-5 md:p-6 justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Avg Turnaround Time
            </span>
            <div className="w-7 h-7 rounded-lg border flex items-center justify-center text-brand-600 bg-brand-50 border-brand-200">
              <Timer size={15} strokeWidth={1.75} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-mono text-surface-950 mt-1">
            27.5 <span className="text-sm font-normal text-surface-500">min/suite</span>
          </p>
          <span className="text-xs text-surface-500 font-light">
            Within target standard (30 min)
          </span>
        </div>

        <div className="flex flex-col gap-2 p-5 md:p-6 justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Suites Ready Today
            </span>
            <div className="w-7 h-7 rounded-lg border flex items-center justify-center text-brand-700 bg-brand-100/60 border-brand-300">
              <CheckCircle2 size={15} strokeWidth={1.75} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-mono text-surface-950 mt-1">
            56 <span className="text-sm font-normal text-surface-500">Completed</span>
          </p>
          <span className="text-xs text-surface-500 font-light">
            100% inspected and released
          </span>
        </div>

        <div className="flex flex-col gap-2 p-5 md:p-6 justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Active Attendants
            </span>
            <div className="w-7 h-7 rounded-lg border flex items-center justify-center text-surface-700 bg-surface-100 border-surface-300">
              <Users size={15} strokeWidth={1.75} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-mono text-surface-950 mt-1">
            8 <span className="text-sm font-normal text-surface-500">On Duty</span>
          </p>
          <span className="text-xs text-surface-500 font-light">
            Across Wing A, Wing B & Villas
          </span>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-surface-600 text-xs font-semibold uppercase tracking-wider bg-surface-100/60 border-b border-surface-200">
              <th className="py-3.5 px-6">Housekeeper</th>
              <th className="py-3.5 px-6">Staff ID</th>
              <th className="py-3.5 px-6">Suites Cleaned</th>
              <th className="py-3.5 px-6">Avg Cleaning Speed</th>
              <th className="py-3.5 px-6">Inspection Score</th>
              <th className="py-3.5 px-6">Evaluation</th>
            </tr>
          </thead>
          <tbody>
            {turnaroundMetrics.map((attendant, idx) => (
              <tr
                key={idx}
                className="border-b border-surface-100 last:border-0 hover:bg-brand-50/30 transition-colors"
              >
                <td className="py-4 px-6">
                  <span className="text-sm font-semibold text-surface-950">
                    {attendant.staff}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-xs font-mono text-surface-600 bg-surface-100 px-2 py-1 rounded border border-surface-200">
                    {attendant.id}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm font-medium font-mono text-surface-900">
                    {attendant.roomsCleaned} Rooms
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-1.5 text-surface-700">
                    <Clock size={14} className="text-surface-400" />
                    <span className="text-xs font-mono">
                      {attendant.avgMinutes} mins
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-xs font-bold text-brand-700">
                    {attendant.inspectedPassRate}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                      attendant.status === "Optimal"
                        ? "bg-brand-50 text-brand-700 border-brand-200"
                        : "bg-surface-100 text-surface-700 border-surface-300"
                    }`}
                  >
                    {attendant.status === "Optimal" ? (
                      <CheckCircle2 size={11} />
                    ) : (
                      <AlertCircle size={11} />
                    )}
                    {attendant.status}
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
