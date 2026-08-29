import type { MetaFunction } from "react-router";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import {
  Users,
  Timer,
  BedDouble,
  Zap,
  Filter,
  CheckCircle2,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader } from "../../../../../components/Card";

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
        "http://localhost:8081/api/housekeeping/reports/staff-turnaround",
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

  return (
    <Card>
      <CardHeader
        title="Housekeeping Turnaround & Sanitization Speed Audit"
        subtitle="Completed room turnover cycles measured from checkout inspection to ready-for-checkin release."
        icon={Timer}
        action={
          <div className="flex items-center gap-2 text-xs px-3.5 py-1.5 print:hidden bg-brand-50 text-brand-700 font-semibold border border-brand-200 rounded-full shadow-2xs">
            <Sparkles size={13} className="text-brand-600" />
            <span>Turnaround Telemetry</span>
          </div>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-surface-100 border-b border-surface-100 bg-surface-50/30">
        <div className="flex flex-col gap-2 p-6 justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Completed Turnarounds
            </span>
            <div className="w-8 h-8 rounded-xl border border-brand-200 flex items-center justify-center text-brand-700 bg-brand-50">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-mono text-surface-950 mt-1">
            {completedCycles} <span className="text-xs font-normal text-surface-500">Cycles</span>
          </p>
          <span className="text-xs text-surface-500 font-light">
            Dirty &rarr; Released for guest check-in
          </span>
        </div>

        <div className="flex flex-col gap-2 p-6 justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Average Turnaround
            </span>
            <div className="w-8 h-8 rounded-xl border border-brand-200 flex items-center justify-center text-brand-700 bg-brand-50">
              <Timer size={16} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-mono text-surface-950 mt-1">
            {avgDurationMinutes} <span className="text-xs font-normal text-surface-500">min/suite</span>
          </p>
          <span className="text-xs text-surface-500 font-light">
            Target benchmark standard: 30 min
          </span>
        </div>

        <div className="flex flex-col gap-2 p-6 justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Fastest Turnaround Record
            </span>
            <div className="w-8 h-8 rounded-xl border border-brand-200 flex items-center justify-center text-brand-700 bg-brand-50">
              <Zap size={16} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-mono text-surface-950 mt-1">
            {fastestDurationMinutes} <span className="text-xs font-normal text-surface-500">min</span>
          </p>
          <span className="text-xs text-surface-500 font-light">
            Fastest recorded cleaning cycle
          </span>
        </div>
      </div>

      {/* Multi-criteria filter */}
      <div className="flex flex-wrap items-end gap-4 p-6 border-b border-surface-100 print:hidden bg-white">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-surface-700">
            Attendant Staff ID
          </label>
          <input
            type="text"
            value={filterStaffId}
            onChange={(e) => setFilterStaffId(e.target.value)}
            placeholder="e.g. STF001"
            className="px-3.5 py-2.5 rounded-xl border border-surface-300 bg-white text-xs w-40 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-surface-700">
            Cycle Start Timestamp
          </label>
          <input
            type="datetime-local"
            value={rangeStart}
            onChange={(e) => setRangeStart(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-surface-300 bg-white text-xs outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100 font-mono"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-surface-700">
            Cycle End Timestamp
          </label>
          <input
            type="datetime-local"
            value={rangeEnd}
            onChange={(e) => setRangeEnd(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-surface-300 bg-white text-xs outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100 font-mono"
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
              <th className="py-3.5 px-6">Attendant Staff</th>
              <th className="py-3.5 px-6">Serviced Suite</th>
              <th className="py-3.5 px-6">Cleaning Commenced</th>
              <th className="py-3.5 px-6">Quality Inspected</th>
              <th className="py-3.5 px-6 text-right">Cycle Duration</th>
            </tr>
          </thead>
          {loading ? (
            <tbody>
              <tr>
                <td colSpan={5} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-brand-600" />
                    <span className="text-xs text-surface-500 font-medium">Fetching turnaround analytics...</span>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : rows.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={5} className="py-16 text-center text-xs text-surface-400 font-light">
                  No completed cleaning cycles found matching query criteria.
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="divide-y divide-surface-100">
              {rows.map((r, index) => (
                <tr key={index} className="hover:bg-surface-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center font-bold text-xs">
                        {r.staffName.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-surface-950">{r.staffName}</span>
                        <span className="text-[10px] text-surface-400 font-mono">({r.staffId})</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <BedDouble size={15} className="text-brand-600" />
                      <span className="font-bold font-mono text-surface-800">
                        Suite {r.roomId}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-6 font-mono text-surface-600">
                    {new Date(r.cycleStart).toLocaleString("en-MY")}
                  </td>

                  <td className="py-4 px-6 font-mono text-surface-600">
                    {new Date(r.cycleEnd).toLocaleString("en-MY")}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {index === 0 && <Zap size={14} className="text-brand-600" />}
                      <span className="font-mono font-bold text-xs bg-brand-50 text-brand-900 border border-brand-200 px-2.5 py-1 rounded-full">
                        {r.durationMinutes} min
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </Card>
  );
}