import { useState, useEffect } from "react";
import { type MetaFunction } from "react-router";
import StatCard from "../../../components/StatCard";
import {
  Brush, Sparkles, ClipboardCheck, Trash2, Undo2, Clock,
  BarChart3, Users, CheckCircle2, AlertCircle
} from "lucide-react";

export const meta: MetaFunction = () => [
  { title: "Housekeeping | TARUMT Resorts" },
];

const API_BASE = "http://localhost:8081/api/housekeeping";

interface Room {
  roomId: string;
  type: string;
  status: string;
}

interface RoomStatusSummary {
  roomId: string;
  currentStage: string;
  nextStage: string | null;
  minutesInCurrentStage: number;
  canRollback: boolean;
}

interface StaffTurnaround {
  roomId: string;
  staffId: string;
  staffName: string;
  cycleStart: string;
  cycleEnd: string;
  durationMinutes: number;
}

type ReportTab = "status" | "turnaround";

const stageLabel: Record<string, string> = {
  DIRTY: "Dirty",
  CLEANING_INPROGRESS: "Cleaning In Progress",
  INSPECTING: "Inspecting",
  READY_FOR_CHECKIN: "Ready For Check-In",
};

export default function Housekeeping() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [statusReport, setStatusReport] = useState<RoomStatusSummary[]>([]);
  const [turnaroundReport, setTurnaroundReport] = useState<StaffTurnaround[]>([]);
  const [activeTab, setActiveTab] = useState<ReportTab>("status");

  // Frontend-only display log - NOT persisted, resets on page refresh.
  // (The actual rollback capability is tracked server-side per room via
  // canRollback in statusReport, independent of this list.)
  const [historyStack, setHistoryStack] = useState<any[]>([]);

  // Report 1 filter criteria (multi-criteria: status + minimum wait time)
  const [statusFilter, setStatusFilter] = useState("");
  const [minMinutesFilter, setMinMinutesFilter] = useState("");

  // Report 2 filter criteria (multi-criteria: staff + date range)
  const [staffFilter, setStaffFilter] = useState("");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");

  async function safeFetchArray<T>(url: string, setter: (v: T[]) => void, label: string) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok || !Array.isArray(data)) {
        console.error(`Unexpected ${label} response:`, data);
        setter([]);
        return;
      }
      setter(data);
    } catch (error) {
      console.error(`Failed to fetch ${label}:`, error);
      setter([]);
    }
  }

  const fetchRooms = () => safeFetchArray<Room>(`${API_BASE}/rooms`, setRooms, "/rooms");

  const fetchStatusReport = () => {
    const params = new URLSearchParams();
    if (statusFilter) params.set("filterStatus", statusFilter);
    if (minMinutesFilter) params.set("minMinutesWaiting", minMinutesFilter);
    safeFetchArray<RoomStatusSummary>(
      `${API_BASE}/reports/room-status?${params}`, setStatusReport, "/reports/room-status"
    );
  };

  const fetchTurnaroundReport = () => {
    const params = new URLSearchParams();
    if (staffFilter) params.set("filterStaffId", staffFilter);
    if (rangeStart) params.set("rangeStart", rangeStart);
    if (rangeEnd) params.set("rangeEnd", rangeEnd);
    safeFetchArray<StaffTurnaround>(
      `${API_BASE}/reports/staff-turnaround?${params}`, setTurnaroundReport, "/reports/staff-turnaround"
    );
  };

  const refreshAll = () => {
    fetchRooms();
    fetchStatusReport();
    fetchTurnaroundReport();
  };

  useEffect(() => {
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stageByRoomId = new Map(statusReport.map(r => [r.roomId, r]));

  const handleAdvance = async (roomId: string) => {
    try {
      const response = await fetch(
        `${API_BASE}/advance?roomId=${roomId}&remarks=UpdatedViaWeb`,
        { method: "POST" }
      );
      const resultText = await response.text();
      if (!response.ok) {
        console.error("Advance failed:", response.status, resultText);
      } else {
        setHistoryStack(prev => [{
          id: Date.now(), room: roomId, message: resultText,
          time: new Date().toLocaleTimeString()
        }, ...prev].slice(0, 15));
      }
      refreshAll();
    } catch (error) {
      console.error("Advance failed:", error);
    }
  };

  const handleRollback = async (roomId: string) => {
    try {
      const response = await fetch(`${API_BASE}/rollback?roomId=${roomId}`, { method: "POST" });
      const resultText = await response.text();
      if (!response.ok) {
        console.error("Rollback failed:", response.status, resultText);
      } else {
        setHistoryStack(prev => [{
          id: Date.now(), room: roomId, message: resultText,
          time: new Date().toLocaleTimeString()
        }, ...prev].slice(0, 15));
      }
      refreshAll();
    } catch (error) {
      console.error("Rollback failed:", error);
    }
  };

  const countByStage = (stage: string) =>
    statusReport.filter(r => r.currentStage === stage).length;

  return (
    <main className="flex flex-col flex-1 min-h-screen gap-6 p-6">

      <div className="grid sm:grid-cols-2 grid-cols-1 xl:grid-cols-4 gap-4 w-full">
        <StatCard title="Dirty Rooms" value={countByStage("DIRTY").toString()} icon={Trash2} color="rose" />
        <StatCard title="Cleaning In Progress" value={countByStage("CLEANING_INPROGRESS").toString()} icon={Brush} color="amber" />
        <StatCard title="Inspecting" value={countByStage("INSPECTING").toString()} icon={ClipboardCheck} color="yellow" />
        <StatCard title="Ready For Check-In" value={countByStage("READY_FOR_CHECKIN").toString()} icon={Sparkles} color="emerald" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
        {/* Room list - Advance + Undo per room */}
        <div className="xl:col-span-2 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <div className="border-b border-surface-200 dark:border-surface-800 pb-4">
            <h2 className="text-lg font-semibold">Room Status Management</h2>
            <p className="text-sm text-surface-500">Advance rooms through the cleaning sequence, or undo a room's own last action.</p>
          </div>

          <div className="flex flex-col gap-3">
            {rooms.length === 0 ? <p className="text-surface-500">No rooms found in database.</p> : null}
            {rooms.map((room) => {
              const stage = stageByRoomId.get(room.roomId);
              const stageName = stage ? stageLabel[stage.currentStage] : "Dirty";
              const nextLabel = stage?.nextStage ? stageLabel[stage.nextStage] : null;
              const isReady = stage?.currentStage === "READY_FOR_CHECKIN";
              const canRollback = stage?.canRollback ?? false;

              return (
                <div key={room.roomId} className="flex items-center justify-between p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-surface-200 dark:bg-surface-700 flex items-center justify-center font-bold">
                      {room.roomId}
                    </div>
                    <div>
                      <h3 className="font-semibold">{room.type}</h3>
                      <span className="text-xs text-surface-500 font-medium">
                        Stage: {stageName}
                        {stage ? ` · ${stage.minutesInCurrentStage}m` : ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRollback(room.roomId)}
                      disabled={!canRollback}
                      title={canRollback ? "Undo this room's last action" : "No action to undo for this room"}
                      className="p-2 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Undo2 size={16} />
                    </button>
                    <button
                      onClick={() => handleAdvance(room.roomId)}
                      disabled={isReady}
                      className="px-4 py-2 bg-surface-200 hover:bg-surface-300 dark:bg-surface-700 text-sm font-medium rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isReady ? "Ready For Check-In" : `Advance to ${nextLabel} →`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action log - frontend-only, resets on refresh (not persisted) */}
        <div className="bg-brand-50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900 rounded-2xl p-6 shadow-sm flex flex-col gap-4 max-h-[520px]">
          <div className="flex items-center gap-2 border-b border-brand-200 pb-4 text-brand-700 shrink-0">
            <Clock size={20} />
            <h2 className="text-lg font-semibold">Recent Actions</h2>
          </div>

          <div className="flex flex-col gap-3 relative overflow-y-auto pr-1">
            <div className="absolute left-4 top-2 bottom-2 w-px bg-brand-200 z-0"></div>
            {historyStack.length === 0 ? <p className="text-xs text-surface-500 z-10">No recent actions.</p> : null}
            {historyStack.map((h, index) => (
              <div key={h.id} className={`relative z-10 flex gap-4 p-3 rounded-xl border ${index === 0 ? 'bg-white border-brand-300 shadow-sm' : 'bg-transparent border-transparent opacity-60'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${index === 0 ? 'bg-brand-100 text-brand-600' : 'bg-surface-200 text-surface-500'}`}>
                  {index === 0 ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                </div>
                <div className="flex flex-col">
                  <h4 className="text-sm font-semibold">Room {h.room}</h4>
                  <p className="text-xs text-surface-500">{h.message}</p>
                  <span className="text-[10px] text-surface-400 mt-1">{h.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reports section */}
      <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-surface-200 dark:border-surface-800 pb-4">
          <BarChart3 size={20} className="text-brand-600" />
          <h2 className="text-lg font-semibold">Reports</h2>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("status")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === "status" ? "bg-brand-500 text-white" : "bg-surface-100 dark:bg-surface-800 text-surface-600"}`}
          >
            Room Status Report
          </button>
          <button
            onClick={() => setActiveTab("turnaround")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === "turnaround" ? "bg-brand-500 text-white" : "bg-surface-100 dark:bg-surface-800 text-surface-600"}`}
          >
            Staff Turnaround Report
          </button>
        </div>

        {activeTab === "status" && (
          <div className="flex flex-col gap-4">
            {/* Multi-criteria filter: status AND minimum minutes waiting */}
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-surface-500">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm"
                >
                  <option value="">All</option>
                  <option value="DIRTY">Dirty</option>
                  <option value="CLEANING_INPROGRESS">Cleaning In Progress</option>
                  <option value="INSPECTING">Inspecting</option>
                  <option value="READY_FOR_CHECKIN">Ready For Check-In</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-surface-500">Min. minutes waiting</label>
                <input
                  type="number"
                  min={0}
                  value={minMinutesFilter}
                  onChange={(e) => setMinMinutesFilter(e.target.value)}
                  placeholder="e.g. 30"
                  className="px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm w-32"
                />
              </div>
              <button
                onClick={fetchStatusReport}
                className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-medium"
              >
                Apply Filters
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-surface-500 border-b border-surface-200 dark:border-surface-800">
                    <th className="py-2 pr-4">Room</th>
                    <th className="py-2 pr-4">Current Stage</th>
                    <th className="py-2 pr-4">Minutes in Stage</th>
                    <th className="py-2 pr-4">Can Undo?</th>
                  </tr>
                </thead>
                <tbody>
                  {statusReport.length === 0 ? (
                    <tr><td colSpan={4} className="py-4 text-surface-400">No data.</td></tr>
                  ) : statusReport.map((r) => (
                    <tr key={r.roomId} className="border-b border-surface-100 dark:border-surface-800/50">
                      <td className="py-2 pr-4 font-medium">{r.roomId}</td>
                      <td className="py-2 pr-4">{stageLabel[r.currentStage] ?? r.currentStage}</td>
                      <td className="py-2 pr-4">{r.minutesInCurrentStage}</td>
                      <td className="py-2 pr-4">{r.canRollback ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-surface-400 mt-2">Sorted by longest time waiting first.</p>
            </div>
          </div>
        )}

        {activeTab === "turnaround" && (
          <div className="flex flex-col gap-4">
            {/* Multi-criteria filter: staff AND completion date range */}
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-surface-500">Staff ID</label>
                <input
                  type="text"
                  value={staffFilter}
                  onChange={(e) => setStaffFilter(e.target.value)}
                  placeholder="e.g. STF001"
                  className="px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm w-36"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-surface-500">From</label>
                <input
                  type="datetime-local"
                  value={rangeStart}
                  onChange={(e) => setRangeStart(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-surface-500">To</label>
                <input
                  type="datetime-local"
                  value={rangeEnd}
                  onChange={(e) => setRangeEnd(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm"
                />
              </div>
              <button
                onClick={fetchTurnaroundReport}
                className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-medium"
              >
                Apply Filters
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-surface-500 border-b border-surface-200 dark:border-surface-800">
                    <th className="py-2 pr-4"><Users size={14} className="inline mr-1" />Staff</th>
                    <th className="py-2 pr-4">Room</th>
                    <th className="py-2 pr-4">Cycle Start</th>
                    <th className="py-2 pr-4">Cycle End</th>
                    <th className="py-2 pr-4">Duration (min)</th>
                  </tr>
                </thead>
                <tbody>
                  {turnaroundReport.length === 0 ? (
                    <tr><td colSpan={5} className="py-4 text-surface-400">No completed cycles yet.</td></tr>
                  ) : turnaroundReport.map((r, i) => (
                    <tr key={i} className="border-b border-surface-100 dark:border-surface-800/50">
                      <td className="py-2 pr-4 font-medium">{r.staffName}</td>
                      <td className="py-2 pr-4">{r.roomId}</td>
                      <td className="py-2 pr-4">{new Date(r.cycleStart).toLocaleString()}</td>
                      <td className="py-2 pr-4">{new Date(r.cycleEnd).toLocaleString()}</td>
                      <td className="py-2 pr-4">{r.durationMinutes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-surface-400 mt-2">Sorted by fastest turnaround first.</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}