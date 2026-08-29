import type { MetaFunction } from "react-router";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import {
  Users,
  CheckCircle,
  UserCircle,
  Timer,
  BedDouble,
  Zap,
} from "lucide-react";

export const meta: MetaFunction = () => [
  { title: "Staff Cleaning Turnaround | TARUMT Resorts" },
];

interface StaffTurnaround {
  roomId: string;
  staffId: string;
  staffName: string;
  cycleStart: string;
  cycleEnd: string;
  durationMinutes: number;
}

// Converts raw minutes into a more readable "Xh Ym" / "Xm" format.
// The underlying data (and sorting/filtering) still uses raw minutes -
// this is purely a display concern.
function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
}

export default function CleaningTurnaround() {
  const [rows, setRows] = useState<StaffTurnaround[]>([]);
  const [loading, setLoading] = useState(true);

  // Multi-criteria filter: staff AND completion date range
  const [filterStaffId, setFilterStaffId] = useState("");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");

  const fetchReport = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (filterStaffId) params.filterStaffId = filterStaffId;
      if (rangeStart) params.rangeStart = rangeStart;
      if (rangeEnd) params.rangeEnd = rangeEnd;

      const response = await axios.get(
        "http://localhost:8081/api/report/cleaning-turnaround",
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

  const { completedCycles, avgDurationMinutes, fastestDurationMinutes } = useMemo(() => {
    const avg = rows.length
      ? Math.round(rows.reduce((sum, r) => sum + r.durationMinutes, 0) / rows.length)
      : 0;
    const fastest = rows.length
      ? Math.min(...rows.map((r) => r.durationMinutes))
      : 0;

    return {
      completedCycles: rows.length,
      avgDurationMinutes: avg,
      fastestDurationMinutes: fastest,
    };
  }, [rows]);

  const statCard = [
    {
      label: "Completed Cycles",
      value: completedCycles,
      statement: "Dirty → Ready For Check-In",
    },
    {
      label: "Avg. Turnaround",
      value: formatMinutes(avgDurationMinutes),
      statement: "Minutes per cycle",
    },
    {
      label: "Fastest Turnaround",
      value: formatMinutes(fastestDurationMinutes),
      statement: "Minutes, best cycle",
    },
  ];

  return (
    <div className="flex flex-col flex-1 rounded-xl border border-surface-300 bg-surface-50">
      <div className="flex items-start justify-between p-4 md:p-6">
        <div className="flex items-start gap-3 md:gap-4">
          <div className="flex items-center justify-center min-w-10.5 min-h-10.5 bg-brand-50 text-brand-600 rounded-xl">
            <Users size={20} />
          </div>
          <div className="flex flex-col gap-1.5">
            <h2 className="text-base md:text-lg font-semibold leading-none">
              Cleaning Turnaround Report
            </h2>
            <p className="text-xs md:text-sm text-surface-600 leading-tight mb-1.5 max-w-3/4">
              Tracks completed cleaning cycles per staff member, ranked from
              fastest to slowest turnaround.
            </p>
            <span className="text-[10px] md:text-xs text-surface-600 leading-tight">
              Generated On: {new Date().toLocaleDateString("en-GB")} at{" "}
              {new Date().toLocaleTimeString()} • TARUMT Resorts
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm print:hidden px-3 py-2 bg-emerald-100 text-emerald-700 font-semibold border leading-none border-emerald-400 rounded-xl">
          <CheckCircle size={14} />
          Generated
        </div>
      </div>

      <div className="grid grid-cols-3 border-t border-surface-300 border-b">
        {statCard.map((card, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 p-4 md:p-6 border-r last:border-0 border-surface-300"
          >
            <h4 className="text-sm md:text-base text-surface-600 leading-tight">
              {card.label}
            </h4>
            <p className="text-xl md:text-3xl font-bold text-surface-950 leading-tight">
              {card.value}
            </p>
            <span className="text-xs md:text-sm text-surface-600 leading-tight tracking-tighter">
              {card.statement}
            </span>
          </div>
        ))}
      </div>

      {/* Multi-criteria filter: staff AND completion date range */}
      <div className="flex flex-wrap items-end gap-3 px-4 md:px-6 py-4 border-b border-surface-300 print:hidden">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-surface-600">Staff ID or Name</label>
          <input
            type="text"
            value={filterStaffId}
            onChange={(e) => setFilterStaffId(e.target.value)}
            placeholder="e.g. STF001 or Alice"
            className="px-3 py-2 rounded-lg border border-surface-300 bg-white text-sm w-44"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-surface-600">From</label>
          <input
            type="datetime-local"
            value={rangeStart}
            onChange={(e) => setRangeStart(e.target.value)}
            className="px-3 py-2 rounded-lg border border-surface-300 bg-white text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-surface-600">To</label>
          <input
            type="datetime-local"
            value={rangeEnd}
            onChange={(e) => setRangeEnd(e.target.value)}
            className="px-3 py-2 rounded-lg border border-surface-300 bg-white text-sm"
          />
        </div>
        <button
          onClick={fetchReport}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium"
        >
          Apply Filters
        </button>
      </div>

      <table className="flex-1 relative">
        <thead>
          <tr className="text-surface-600 text-xs md:text-sm leading-none border-b border-surface-300">
            <th className="py-4 text-start px-6 font-normal tracking-wide">
              Staff ID
            </th>
            <th className="py-4 text-start px-6 font-normal tracking-wide">
              Staff
            </th>
            <th className="py-4 text-start px-6 font-normal tracking-wide">
              Room
            </th>
            <th className="py-4 text-start px-6 font-normal tracking-wide">
              Cycle Start
            </th>
            <th className="py-4 text-start px-6 font-normal tracking-wide">
              Cycle End
            </th>
            <th className="py-4 text-start px-6 font-normal tracking-wide">
              Duration
            </th>
          </tr>
        </thead>
        {loading && (
          <tbody>
            <tr>
              <td colSpan={6} className="h-80 text-center relative">
                <div className="absolute inset-0 flex flex-col gap-4 items-center justify-center opacity-60">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
                </div>
              </td>
            </tr>
          </tbody>
        )}
        {!loading && rows.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan={6} className="h-80 text-center relative">
                <div className="absolute inset-0 flex flex-col gap-4 items-center justify-center opacity-60">
                  <span className="text-4xl text-surface-950 tracking-tighter">
                    {"ヽ(*。>Д<)o゜"}
                  </span>
                  <span className="text-base text-surface-600 tracking-wide">
                    No completed cleaning cycles found.
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {rows.map((r, index) => (
              <tr
                key={index}
                className="border-b border-surface-200 last:border-0 hover:bg-surface-100 transition-colors"
              >
                <td className="py-4 px-6">
                  <span className="text-xs font-mono text-surface-600 bg-surface-100 px-2 py-1 rounded-md border border-surface-200">
                    {r.staffId}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-surface-100 p-2 rounded-full text-surface-500">
                      <UserCircle size={18} />
                    </div>
                    <span className="text-sm text-surface-950 font-semibold">
                      {r.staffName}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <BedDouble size={16} className="text-surface-400" />
                    <span className="text-sm font-medium text-surface-800">
                      {r.roomId}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-surface-600">
                    {new Date(r.cycleStart).toLocaleString("en-GB")}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-surface-600">
                    {new Date(r.cycleEnd).toLocaleString("en-GB")}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    {index === 0 && <Zap size={14} className="text-amber-500" />}
                    <Timer size={14} className="text-surface-400" />
                    <span className="text-sm font-mono bg-surface-100 px-2 py-1 rounded-md border border-surface-200">
                      {formatMinutes(r.durationMinutes)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
}