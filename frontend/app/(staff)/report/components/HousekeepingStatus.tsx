import type { MetaFunction } from "react-router";
import {
  Info,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Bed,
  BrushCleaning,
  Clock,
} from "lucide-react";
import { motion } from "motion/react";

export const meta: MetaFunction = () => [
  { title: "Room Housekeeping Status | TARUMT Resorts" },
];

export default function HousekeepingStatus() {
  const roomStatusList = [
    { room: "101", type: "Deluxe Ocean Suite", status: "Clean & Ready", attendant: "Ahmad R.", priority: "Normal" },
    { room: "102", type: "Deluxe Ocean Suite", status: "In Cleaning", attendant: "Mei Ling T.", priority: "High (VIP)" },
    { room: "103", type: "Executive Suite", status: "Dirty / Checkout", attendant: "Pending", priority: "Urgent" },
    { room: "201", type: "Royal Villa", status: "Clean & Ready", attendant: "Nurul I.", priority: "Normal" },
    { room: "202", type: "Royal Villa", status: "Inspection Required", attendant: "Suresh K.", priority: "Normal" },
    { room: "301", type: "Presidential Penthouse", status: "Clean & Ready", attendant: "Mei Ling T.", priority: "High (VIP)" },
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
            <Info size={22} strokeWidth={1.75} />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-xl md:text-2xl font-serif text-surface-950 font-semibold tracking-tight">
              Suite Housekeeping & Sanitization Status
            </h2>
            <p className="text-xs md:text-sm text-surface-600 font-light leading-relaxed max-w-2xl">
              Live room hygiene telemetry and status breakdown across all accommodation wings and villas.
            </p>
            <span className="text-[11px] text-surface-500 font-mono mt-1">
              Generated: {new Date().toLocaleDateString("en-GB")} • Live Housekeeping Dispatch
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs px-3.5 py-1.5 print:hidden bg-brand-50 text-brand-700 font-semibold border border-brand-200 rounded-full w-fit self-start shrink-0 shadow-2xs">
          <Sparkles size={13} className="text-brand-600" />
          <span>Real-Time Audit</span>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-surface-200 divide-y sm:divide-y-0 sm:divide-x divide-surface-200 bg-white">
        <div className="flex flex-col gap-2 p-5 md:p-6 justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Clean & Inspected
            </span>
            <div className="w-7 h-7 rounded-lg border flex items-center justify-center text-brand-600 bg-brand-50 border-brand-200">
              <CheckCircle size={15} strokeWidth={1.75} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-mono text-surface-950 mt-1">
            148 <span className="text-sm font-normal text-surface-500">Suites</span>
          </p>
          <span className="text-xs text-surface-500 font-light">92.5% Ready for Check-in</span>
        </div>

        <div className="flex flex-col gap-2 p-5 md:p-6 justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              In Cleaning Progress
            </span>
            <div className="w-7 h-7 rounded-lg border flex items-center justify-center text-brand-700 bg-brand-100/60 border-brand-300">
              <BrushCleaning size={15} strokeWidth={1.75} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-mono text-surface-950 mt-1">
            7 <span className="text-sm font-normal text-surface-500">Suites</span>
          </p>
          <span className="text-xs text-surface-500 font-light">Assigned to floor attendants</span>
        </div>

        <div className="flex flex-col gap-2 p-5 md:p-6 justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Dirty / Priority
            </span>
            <div className="w-7 h-7 rounded-lg border flex items-center justify-center text-surface-700 bg-surface-100 border-surface-300">
              <AlertTriangle size={15} strokeWidth={1.75} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-mono text-surface-950 mt-1">
            5 <span className="text-sm font-normal text-surface-500">Suites</span>
          </p>
          <span className="text-xs text-surface-500 font-light">Queued for expedited turnaround</span>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-surface-600 text-xs font-semibold uppercase tracking-wider bg-surface-100/60 border-b border-surface-200">
              <th className="py-3.5 px-6">Suite Number</th>
              <th className="py-3.5 px-6">Room Category</th>
              <th className="py-3.5 px-6">Current Status</th>
              <th className="py-3.5 px-6">Assigned Attendant</th>
              <th className="py-3.5 px-6">Turnaround Priority</th>
            </tr>
          </thead>
          <tbody>
            {roomStatusList.map((item, idx) => (
              <tr
                key={idx}
                className="border-b border-surface-100 last:border-0 hover:bg-brand-50/30 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Bed size={16} className="text-surface-400" />
                    <span className="text-sm font-bold font-mono text-surface-950">
                      Suite {item.room}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-xs font-medium text-surface-700">
                    {item.type}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                      item.status.includes("Clean")
                        ? "bg-brand-50 text-brand-700 border-brand-200"
                        : item.status.includes("Cleaning")
                        ? "bg-brand-100/60 text-brand-900 border-brand-300"
                        : "bg-surface-100 text-surface-700 border-surface-300"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        item.status.includes("Clean")
                          ? "bg-brand-500"
                          : item.status.includes("Cleaning")
                          ? "bg-brand-400 animate-pulse"
                          : "bg-surface-400"
                      }`}
                    />
                    {item.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-xs text-surface-700 font-medium">
                    {item.attendant}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`text-[11px] font-semibold uppercase tracking-wider ${
                      item.priority.includes("Urgent")
                        ? "text-brand-900 font-bold underline"
                        : item.priority.includes("VIP")
                        ? "text-brand-600"
                        : "text-surface-500"
                    }`}
                  >
                    {item.priority}
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
