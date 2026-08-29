import type { MetaFunction } from "react-router";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import {
  Sparkles,
  CheckCircle,
  Timer,
  BedDouble,
  AlertTriangle,
} from "lucide-react";

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

const stageLabel: Record<string, string> = {
  DIRTY: "Dirty",
  CLEANING_INPROGRESS: "Cleaning In Progress",
  INSPECTING: "Inspecting",
  READY_FOR_CHECKIN: "Ready For Check-In",
};

// Converts raw minutes into a more readable "Xh Ym" / "Xm" format.
// The underlying data (and sorting/filtering) still uses raw minutes -
// this is purely a display concern.
function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
}

export default function HousekeepingStatusReport() {
  const [rows, setRows] = useState<RoomStatusSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Multi-criteria filter: status AND minimum minutes waiting
  const [filterStatus, setFilterStatus] = useState("");
  const [minMinutesWaiting, setMinMinutesWaiting] = useState("");

  const fetchReport = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (filterStatus) params.filterStatus = filterStatus;
      if (minMinutesWaiting) params.minMinutesWaiting = minMinutesWaiting;

      const response = await axios.get(
        "http://localhost:8081/api/report/housekeeping-status",
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

  const { totalRooms, roomsNeedingAttention, avgMinutesWaiting } = useMemo(() => {
    const needingAttention = rows.filter((r) => r.currentStage !== "READY_FOR_CHECKIN").length;
    const avgMinutes = rows.length
      ? Math.round(rows.reduce((sum, r) => sum + r.minutesInCurrentStage, 0) / rows.length)
      : 0;

    return {
      totalRooms: rows.length,
      roomsNeedingAttention: needingAttention,
      avgMinutesWaiting: avgMinutes,
    };
  }, [rows]);

  const statCard = [
    {
      label: "Rooms Tracked",
      value: totalRooms.toString(),
      statement: "In this report",
    },
    {
      label: "Needing Attention",
      value: roomsNeedingAttention.toString(),
      statement: "Not yet Ready For Check-In",
    },
    {
      label: "Avg. Wait Time",
      value: formatMinutes(avgMinutesWaiting),
      statement: "In current stage",
    },
  ];

  return (
    <div className="flex flex-col flex-1 rounded-xl border border-surface-300 bg-surface-50">
      <div className="flex items-start justify-between p-4 md:p-6">
        <div className="flex items-start gap-3 md:gap-4">
          <div className="flex items-center justify-center min-w-10.5 min-h-10.5 bg-brand-50 text-brand-600 rounded-xl">
            <Sparkles size={20} />
          </div>
          <div className="flex flex-col gap-1.5">
            <h2 className="text-base md:text-lg font-semibold leading-none">
              Room Housekeeping Status Report
            </h2>
            <p className="text-xs md:text-sm text-surface-600 leading-tight mb-1.5 max-w-3/4">
              Shows every room's current housekeeping stage, sorted by how
              long it has been waiting, so the longest-stuck rooms surface
              first.
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

      {/* Multi-criteria filter: status AND minimum minutes waiting */}
      <div className="flex flex-wrap items-end gap-3 px-4 md:px-6 py-4 border-b border-surface-300 print:hidden">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-surface-600">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-surface-300 bg-white text-sm"
          >
            <option value="">All</option>
            <option value="DIRTY">Dirty</option>
            <option value="CLEANING_INPROGRESS">Cleaning In Progress</option>
            <option value="INSPECTING">Inspecting</option>
            <option value="READY_FOR_CHECKIN">Ready For Check-In</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-surface-600">Min. minutes waiting</label>
          <input
            type="number"
            min={0}
            value={minMinutesWaiting}
            onChange={(e) => setMinMinutesWaiting(e.target.value)}
            placeholder="e.g. 30"
            className="px-3 py-2 rounded-lg border border-surface-300 bg-white text-sm w-32"
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
              Room
            </th>
            <th className="py-4 text-start px-6 font-normal tracking-wide">
              Current Stage
            </th>
            <th className="py-4 text-start px-6 font-normal tracking-wide">
              Time Waiting
            </th>
            <th className="py-4 text-start px-6 font-normal tracking-wide">
              Can Undo?
            </th>
          </tr>
        </thead>
        {loading && (
          <tbody>
            <tr>
              <td colSpan={4} className="h-80 text-center relative">
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
              <td colSpan={4} className="h-80 text-center relative">
                <div className="absolute inset-0 flex flex-col gap-4 items-center justify-center opacity-60">
                  <span className="text-4xl text-surface-950 tracking-tighter">
                    {"ヽ(*。>Д<)o゜"}
                  </span>
                  <span className="text-base text-surface-600 tracking-wide">
                    No rooms match the current filters.
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.roomId}
                className="border-b border-surface-200 last:border-0 hover:bg-surface-100 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <BedDouble size={16} className="text-surface-400" />
                    <span className="text-sm font-medium text-surface-800">
                      {r.roomId}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-surface-700">
                    {stageLabel[r.currentStage] ?? r.currentStage}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2 text-surface-600">
                    <Timer size={14} className="opacity-70" />
                    <span className="text-sm">{formatMinutes(r.minutesInCurrentStage)}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  {r.canRollback ? (
                    <span className="text-sm text-emerald-600 font-medium">Yes</span>
                  ) : (
                    <span className="text-sm text-surface-400 flex items-center gap-1">
                      <AlertTriangle size={12} /> No
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
}