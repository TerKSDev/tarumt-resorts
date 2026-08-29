import type { MetaFunction } from "react-router";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import {
  Sparkles,
  CheckCircle,
  Timer,
  BedDouble,
  Brush,
  Filter,
  Trash2,
  ClipboardCheck,
} from "lucide-react";
import { Card, CardHeader } from "../../../../components/Card";

export const meta: MetaFunction = () => [
  { title: "Room Housekeeping Status | TARUMT Resorts" },
];

interface RoomStatusSummary {
  roomId: string;
  currentStage: string;
  nextStage: string | null;
  minutesInCurrentStage: number;
  canRollback: boolean;
}

const stageLabel: Record<string, { label: string; badge: string; dot: string }> = {
  DIRTY: {
    label: "Dirty (Pending)",
    badge: "bg-surface-100 text-surface-700 border-surface-300",
    dot: "bg-surface-500",
  },
  CLEANING_INPROGRESS: {
    label: "Cleaning In Progress",
    badge: "bg-brand-50 text-brand-800 border-brand-300",
    dot: "bg-brand-600",
  },
  INSPECTING: {
    label: "Quality Inspecting",
    badge: "bg-surface-200 text-surface-900 border-surface-400 font-semibold",
    dot: "bg-surface-600",
  },
  READY_FOR_CHECKIN: {
    label: "Ready For Check-In",
    badge: "bg-surface-950 text-white border-surface-950 font-semibold",
    dot: "bg-brand-300",
  },
};

function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export default function HousekeepingStatus() {
  const [rows, setRows] = useState<RoomStatusSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Multi-criteria filters: status AND min-minutes-waiting
  const [filterStatus, setFilterStatus] = useState("");
  const [minMinutesWaiting, setMinMinutesWaiting] = useState("");

  const fetchReport = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (filterStatus) params.filterStatus = filterStatus;
      if (minMinutesWaiting) params.minMinutesWaiting = minMinutesWaiting;

      const response = await axios.get(
        "http://localhost:8081/api/housekeeping/reports/room-status",
        { params },
      );
      setRows(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setRows([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { dirtyCount, cleaningCount, inspectingCount, readyCount } =
    useMemo(() => {
      let dirty = 0;
      let cleaning = 0;
      let inspecting = 0;
      let ready = 0;

      for (const r of rows) {
        if (r.currentStage === "DIRTY") dirty++;
        else if (r.currentStage === "CLEANING_INPROGRESS") cleaning++;
        else if (r.currentStage === "INSPECTING") inspecting++;
        else if (r.currentStage === "READY_FOR_CHECKIN") ready++;
      }

      return {
        dirtyCount: dirty,
        cleaningCount: cleaning,
        inspectingCount: inspecting,
        readyCount: ready,
      };
    }, [rows]);

  return (
    <Card>
      <CardHeader
        title="Suite Sanitization & Readiness Lifecycle Audit"
        subtitle="Real-time room hygiene state tracking across Dirty, Cleaning, Inspecting, and Ready For Check-In."
        icon={BedDouble}
        action={
          <div className="flex items-center gap-2 text-xs px-3.5 py-1.5 print:hidden bg-brand-50 text-brand-700 font-semibold border border-brand-200 rounded-full shadow-2xs">
            <Sparkles size={13} className="text-brand-600" />
            <span>Telemetry Active</span>
          </div>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-surface-100 border-b border-surface-100 bg-surface-50/30">
        <div className="flex flex-col gap-2 p-6 justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Dirty Pending
            </span>
            <div className="w-8 h-8 rounded-xl border border-surface-200 flex items-center justify-center text-surface-700 bg-surface-100">
              <Trash2 size={16} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-mono text-surface-950 mt-1">
            {dirtyCount}
          </p>
          <span className="text-xs text-surface-500 font-light">
            Awaiting maid assignment
          </span>
        </div>

        <div className="flex flex-col gap-2 p-6 justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              In Cleaning
            </span>
            <div className="w-8 h-8 rounded-xl border border-brand-200 flex items-center justify-center text-brand-700 bg-brand-50">
              <Brush size={16} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-mono text-surface-950 mt-1">
            {cleaningCount}
          </p>
          <span className="text-xs text-surface-500 font-light">
            Linen replacement active
          </span>
        </div>

        <div className="flex flex-col gap-2 p-6 justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Quality Audit
            </span>
            <div className="w-8 h-8 rounded-xl border border-brand-200 flex items-center justify-center text-brand-700 bg-brand-50">
              <ClipboardCheck size={16} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-mono text-surface-950 mt-1">
            {inspectingCount}
          </p>
          <span className="text-xs text-surface-500 font-light">
            Supervisor inspection
          </span>
        </div>

        <div className="flex flex-col gap-2 p-6 justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Ready For Check-In
            </span>
            <div className="w-8 h-8 rounded-xl border border-surface-800 flex items-center justify-center text-brand-300 bg-surface-950">
              <CheckCircle size={16} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-mono text-surface-950 mt-1">
            {readyCount}
          </p>
          <span className="text-xs text-surface-500 font-light">
            Pristine suites released
          </span>
        </div>
      </div>

      {/* Multi-criteria filter */}
      <div className="flex flex-wrap items-end gap-4 p-6 border-b border-surface-100 print:hidden bg-white">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-surface-700">
            Hygiene Stage
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-surface-300 bg-white text-xs outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100 cursor-pointer font-medium"
          >
            <option value="">All Hygiene Stages</option>
            <option value="DIRTY">Dirty</option>
            <option value="CLEANING_INPROGRESS">Cleaning In Progress</option>
            <option value="INSPECTING">Inspecting</option>
            <option value="READY_FOR_CHECKIN">Ready For Check-In</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-surface-700">
            Min. Waiting Duration (Mins)
          </label>
          <input
            type="number"
            min={0}
            value={minMinutesWaiting}
            onChange={(e) => setMinMinutesWaiting(e.target.value)}
            placeholder="e.g. 15"
            className="px-3.5 py-2.5 rounded-xl border border-surface-300 bg-white text-xs w-36 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100 font-mono"
          />
        </div>

        <button
          type="button"
          onClick={fetchReport}
          className="h-10 px-6 bg-surface-950 hover:bg-brand-950 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-sm hover:shadow cursor-pointer flex items-center gap-2"
        >
          <Filter size={13} />
          <span>Filter Report</span>
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="text-surface-600 uppercase tracking-wider font-semibold bg-surface-100/70 border-b border-surface-200">
              <th className="py-3.5 px-6">Suite Number</th>
              <th className="py-3.5 px-6">Current Stage</th>
              <th className="py-3.5 px-6">Next Scheduled Stage</th>
              <th className="py-3.5 px-6">Time in Stage</th>
              <th className="py-3.5 px-6 text-right">Undo Action Available</th>
            </tr>
          </thead>
          {loading ? (
            <tbody>
              <tr>
                <td colSpan={5} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-brand-600" />
                    <span className="text-xs text-surface-500 font-medium">Loading suite status telemetry...</span>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : rows.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={5} className="py-16 text-center text-xs text-surface-400 font-light">
                  No rooms found matching filter criteria.
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="divide-y divide-surface-100">
              {rows.map((r) => {
                const cfg = stageLabel[r.currentStage] || stageLabel.DIRTY;
                const nextCfg = r.nextStage ? stageLabel[r.nextStage]?.label || r.nextStage : "None (Complete)";
                return (
                  <tr key={r.roomId} className="hover:bg-surface-50 transition-colors">
                    <td className="py-4 px-6 font-bold font-mono text-surface-950 text-sm">
                      Suite {r.roomId}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold border ${cfg.badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        <span>{cfg.label}</span>
                      </span>
                    </td>

                    <td className="py-4 px-6 text-surface-600 font-medium">
                      {nextCfg}
                    </td>

                    <td className="py-4 px-6 font-mono text-surface-700">
                      <div className="flex items-center gap-1.5">
                        <Timer size={14} className="text-surface-400" />
                        <span>{formatMinutes(r.minutesInCurrentStage)}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right font-medium">
                      <span
                        className={`text-xs ${
                          r.canRollback ? "text-brand-700 font-semibold" : "text-surface-400"
                        }`}
                      >
                        {r.canRollback ? "Yes (Reversible)" : "No"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>
    </Card>
  );
}