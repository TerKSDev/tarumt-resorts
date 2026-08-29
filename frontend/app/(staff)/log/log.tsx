import { useState, useEffect } from "react";
import { type MetaFunction } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Brush,
  Sparkles,
  ClipboardCheck,
  Trash2,
  Undo2,
  Clock,
  BarChart3,
  Users,
  ShieldCheck,
  BedDouble,
  ArrowRight,
  Filter,
  RefreshCw,
} from "lucide-react";
import {
  type HousekeepingRoom,
  type RoomStatusSummary,
  type StaffTurnaround,
  fetchHousekeepingRoomsApi,
  fetchRoomStatusReportApi,
  fetchStaffTurnaroundReportApi,
  advanceRoomStageApi,
  rollbackRoomStageApi,
} from "../../../lib/api/housekeeping";
import { Card, CardHeader } from "../../../components/Card";

export const meta: MetaFunction = () => [
  { title: "Housekeeping & Sanitization Logistics | TARUMT Resorts" },
];

type ReportTab = "status" | "turnaround";

const stageConfig: Record<
  string,
  { label: string; badge: string; dot: string }
> = {
  DIRTY: {
    label: "Dirty (Pending Cleaning)",
    badge: "bg-surface-100 text-surface-700 border-surface-300",
    dot: "bg-surface-500",
  },
  CLEANING_INPROGRESS: {
    label: "Cleaning In Progress",
    badge: "bg-brand-50 text-brand-800 border-brand-300",
    dot: "bg-brand-600",
  },
  INSPECTING: {
    label: "Quality Inspection",
    badge: "bg-surface-200 text-surface-900 border-surface-400 font-semibold",
    dot: "bg-surface-600",
  },
  READY_FOR_CHECKIN: {
    label: "Ready For Check-In",
    badge: "bg-surface-950 text-white border-surface-950 font-semibold",
    dot: "bg-brand-300",
  },
};

export default function Housekeeping() {
  const [rooms, setRooms] = useState<HousekeepingRoom[]>([]);
  const [statusReport, setStatusReport] = useState<RoomStatusSummary[]>([]);
  const [turnaroundReport, setTurnaroundReport] = useState<StaffTurnaround[]>([]);
  const [activeTab, setActiveTab] = useState<ReportTab>("status");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [historyStack, setHistoryStack] = useState<
    Array<{ id: number; room: string; message: string; time: string; success: boolean }>
  >([]);

  // Report 1 filters
  const [statusFilter, setStatusFilter] = useState("");
  const [minMinutesFilter, setMinMinutesFilter] = useState("");

  // Report 2 filters
  const [staffFilter, setStaffFilter] = useState("");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3000);
  };

  const refreshAll = async () => {
    try {
      setLoading(true);
      const [roomsData, statusData, turnaroundData] = await Promise.all([
        fetchHousekeepingRoomsApi().catch(() => []),
        fetchRoomStatusReportApi(statusFilter, minMinutesFilter).catch(() => []),
        fetchStaffTurnaroundReportApi(staffFilter, rangeStart, rangeEnd).catch(() => []),
      ]);
      setRooms(roomsData);
      setStatusReport(statusData);
      setTurnaroundReport(turnaroundData);
    } catch (err) {
      console.error("Failed to refresh housekeeping data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshAll();
  }, []);

  const stageByRoomId = new Map(statusReport.map((r) => [r.roomId, r]));

  const handleAdvance = async (roomId: string) => {
    try {
      const resultText = await advanceRoomStageApi(roomId);
      setHistoryStack((prev) => [
        {
          id: Date.now(),
          room: roomId,
          message: resultText || `Suite ${roomId} advanced to next stage.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          success: true,
        },
        ...prev,
      ].slice(0, 15));
      flash(`Suite ${roomId} advanced successfully.`);
      await refreshAll();
    } catch (error: any) {
      flash(error.message || "Failed to advance stage.");
      setHistoryStack((prev) => [
        {
          id: Date.now(),
          room: roomId,
          message: error.message || "Advance action failed.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          success: false,
        },
        ...prev,
      ].slice(0, 15));
    }
  };

  const handleRollback = async (roomId: string) => {
    try {
      const resultText = await rollbackRoomStageApi(roomId);
      setHistoryStack((prev) => [
        {
          id: Date.now(),
          room: roomId,
          message: resultText || `Reverted last action on Suite ${roomId}.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          success: true,
        },
        ...prev,
      ].slice(0, 15));
      flash(`Suite ${roomId} status reverted.`);
      await refreshAll();
    } catch (error: any) {
      flash(error.message || "Failed to revert action.");
    }
  };

  const countByStage = (stage: string) =>
    statusReport.filter((r) => r.currentStage === stage).length;

  return (
    <div className="flex-1 flex flex-col gap-8 pb-10">
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-100 flex items-center gap-2 px-5 py-3 rounded-full bg-surface-950 text-white border border-surface-700 shadow-2xl text-xs font-semibold tracking-wide"
          >
            <Sparkles size={14} className="text-brand-300 shrink-0" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-surface-950 text-surface-50 relative overflow-hidden shadow-xl border border-surface-800">
        <div className="absolute rounded-full w-96 h-96 bg-brand-900/30 blur-[100px] -top-20 -right-20 pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-900 border border-surface-700/80 text-brand-300 text-xs font-medium tracking-wide w-fit">
              <ShieldCheck size={13} />
              <span>Housekeeping & Sanitation Telemetry</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif tracking-tight font-semibold text-white">
              Housekeeping Log & Turnaround Dispatch
            </h1>
            <p className="text-xs md:text-sm text-surface-300 font-light leading-relaxed">
              Real-time room cleanliness lifecycle, sanitization turnaround tracking, and automated staff dispatch audit logs.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => void refreshAll()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-surface-900/80 hover:bg-surface-800 border border-surface-700 text-surface-300 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              <span>Sync Status</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl border border-surface-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Dirty Pending
            </span>
            <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 shadow-2xs">
              <Trash2 size={18} strokeWidth={1.75} />
            </div>
          </div>
          <p className="mt-3 text-2xl md:text-3xl font-bold font-mono text-surface-950">
            {countByStage("DIRTY")}
          </p>
          <p className="mt-1 text-xs text-surface-500 font-light">Awaiting maid assignment</p>
        </div>

        <div className="p-6 rounded-3xl border border-surface-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              In Progress
            </span>
            <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 shadow-2xs">
              <Brush size={18} strokeWidth={1.75} />
            </div>
          </div>
          <p className="mt-3 text-2xl md:text-3xl font-bold font-mono text-surface-950">
            {countByStage("CLEANING_INPROGRESS")}
          </p>
          <p className="mt-1 text-xs text-surface-500 font-light">Undergoing linen replacement</p>
        </div>

        <div className="p-6 rounded-3xl border border-surface-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Inspecting
            </span>
            <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 shadow-2xs">
              <ClipboardCheck size={18} strokeWidth={1.75} />
            </div>
          </div>
          <p className="mt-3 text-2xl md:text-3xl font-bold font-mono text-surface-950">
            {countByStage("INSPECTING")}
          </p>
          <p className="mt-1 text-xs text-surface-500 font-light">Quality supervisor auditing</p>
        </div>

        <div className="p-6 rounded-3xl border border-surface-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Ready For Check-In
            </span>
            <div className="w-10 h-10 rounded-2xl bg-surface-950 text-brand-300 border border-surface-800 flex items-center justify-center shadow-2xs">
              <Sparkles size={18} strokeWidth={1.75} />
            </div>
          </div>
          <p className="mt-3 text-2xl md:text-3xl font-bold font-mono text-surface-950">
            {countByStage("READY_FOR_CHECKIN")}
          </p>
          <p className="mt-1 text-xs text-surface-500 font-light">Pristine guest suite available</p>
        </div>
      </div>

      {/* Main Two Column: Room Status Lifecycle + Live Action Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Room Status Operations */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Suite Sanitization Queue & Progression"
            subtitle="Advance rooms through hygiene stages or undo previous actions."
            icon={BedDouble}
          />

          <div className="divide-y divide-surface-100 max-h-[580px] overflow-y-auto scrollbar-hidden">
            {rooms.length === 0 ? (
              <div className="p-12 text-center text-xs text-surface-400 font-light">
                No rooms currently loaded from the resort database.
              </div>
            ) : (
              rooms.map((room) => {
                const stage = stageByRoomId.get(room.roomId);
                const currentCfg = stage ? stageConfig[stage.currentStage] : stageConfig.DIRTY;
                const nextLabel = stage?.nextStage
                  ? stageConfig[stage.nextStage]?.label || stage.nextStage
                  : null;
                const isReady = stage?.currentStage === "READY_FOR_CHECKIN";
                const canRollback = stage?.canRollback ?? false;

                return (
                  <div
                    key={room.roomId}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 hover:bg-surface-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-surface-100 border border-surface-200 flex items-center justify-center font-bold font-mono text-sm text-surface-950 shrink-0">
                        {room.roomId}
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-surface-950 text-sm">{room.type}</span>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold border ${currentCfg.badge}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${currentCfg.dot}`} />
                            <span>{currentCfg.label}</span>
                          </span>
                        </div>
                        <p className="text-xs text-surface-500 font-mono">
                          Duration in current stage:{" "}
                          <span className="font-semibold text-surface-800">
                            {stage ? `${stage.minutesInCurrentStage} min` : "0 min"}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => void handleRollback(room.roomId)}
                        disabled={!canRollback}
                        title={canRollback ? "Undo this suite's last action" : "No undo action available"}
                        className="p-2.5 rounded-xl border border-surface-200 text-surface-600 hover:text-surface-950 hover:bg-surface-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        <Undo2 size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => void handleAdvance(room.roomId)}
                        disabled={isReady}
                        className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                          isReady
                            ? "bg-surface-100 text-surface-400 cursor-not-allowed border border-surface-200"
                            : "bg-surface-950 hover:bg-brand-950 text-white shadow-sm hover:shadow"
                        }`}
                      >
                        <span>{isReady ? "Ready For Check-In" : `Advance to ${nextLabel}`}</span>
                        {!isReady && <ArrowRight size={13} />}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Right 1 Col: Live Action Timeline */}
        <Card className="max-h-[660px]">
          <CardHeader
            title="Live Audit Activity"
            subtitle="Session dispatch event stream"
            icon={Clock}
          />

          <div className="p-5 flex-1 overflow-y-auto scrollbar-hidden flex flex-col gap-3">
            {historyStack.length === 0 ? (
              <div className="py-16 text-center text-xs text-surface-400 font-light">
                No recent actions recorded in this session.
              </div>
            ) : (
              historyStack.map((item, idx) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    idx === 0
                      ? "bg-brand-50/60 border-brand-200 shadow-xs"
                      : "bg-surface-50/60 border-surface-100 text-surface-600"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-surface-950 text-xs font-mono">
                      Suite {item.room}
                    </span>
                    <span className="text-[10px] text-surface-400 font-mono">{item.time}</span>
                  </div>
                  <p className="text-xs text-surface-700 leading-snug">{item.message}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Housekeeping Analytics & Report Generation */}
      <Card>
        <CardHeader
          title="Housekeeping Performance & Turnaround Audit"
          subtitle="Query bottleneck metrics and staff turnaround speed logs."
          icon={BarChart3}
          action={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("status")}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "status"
                    ? "bg-surface-950 text-white shadow-xs"
                    : "bg-surface-100 text-surface-600 hover:text-surface-950 border border-surface-200"
                }`}
              >
                Room Status Report
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("turnaround")}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "turnaround"
                    ? "bg-surface-950 text-white shadow-xs"
                    : "bg-surface-100 text-surface-600 hover:text-surface-950 border border-surface-200"
                }`}
              >
                Staff Turnaround Report
              </button>
            </div>
          }
        />

        {activeTab === "status" ? (
          <div className="p-6 flex flex-col gap-5">
            {/* Filter Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-surface-700">
                  Hygiene Stage Filter
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-surface-300 text-xs focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none bg-white cursor-pointer font-medium"
                >
                  <option value="">All Hygiene Stages</option>
                  <option value="DIRTY">Dirty</option>
                  <option value="CLEANING_INPROGRESS">Cleaning In Progress</option>
                  <option value="INSPECTING">Quality Inspecting</option>
                  <option value="READY_FOR_CHECKIN">Ready For Check-In</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-surface-700">
                  Minimum Wait Time (Minutes)
                </label>
                <input
                  type="number"
                  min={0}
                  value={minMinutesFilter}
                  onChange={(e) => setMinMinutesFilter(e.target.value)}
                  placeholder="e.g. 30"
                  className="px-3.5 py-2.5 rounded-xl border border-surface-300 text-xs focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none font-mono"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => void fetchRoomStatusReportApi(statusFilter, minMinutesFilter).then(setStatusReport)}
                  className="w-full h-10 px-6 rounded-xl bg-surface-950 hover:bg-brand-950 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm hover:shadow cursor-pointer flex items-center justify-center gap-2"
                >
                  <Filter size={13} />
                  <span>Filter Report</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-surface-200">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-surface-100/70 border-b border-surface-200 text-surface-600 uppercase tracking-wider font-semibold">
                    <th className="py-3.5 px-6">Suite Number</th>
                    <th className="py-3.5 px-6">Current Hygiene Stage</th>
                    <th className="py-3.5 px-6">Elapsed Duration</th>
                    <th className="py-3.5 px-6 text-right">Undo Available</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {statusReport.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-xs text-surface-400 font-light">
                        No rooms match the specified filter constraints.
                      </td>
                    </tr>
                  ) : (
                    statusReport.map((r) => {
                      const cfg = stageConfig[r.currentStage] || stageConfig.DIRTY;
                      return (
                        <tr key={r.roomId} className="hover:bg-surface-50 transition-colors">
                          <td className="py-4 px-6 font-bold font-mono text-surface-950">
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
                          <td className="py-4 px-6 font-mono text-surface-700">
                            {r.minutesInCurrentStage} min
                          </td>
                          <td className="py-4 px-6 text-right font-medium">
                            <span
                              className={`text-xs ${
                                r.canRollback ? "text-brand-700 font-semibold" : "text-surface-400"
                              }`}
                            >
                              {r.canRollback ? "Yes" : "No"}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-6 flex flex-col gap-5">
            {/* Turnaround Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-surface-700">
                  Staff Identifier
                </label>
                <input
                  type="text"
                  value={staffFilter}
                  onChange={(e) => setStaffFilter(e.target.value)}
                  placeholder="e.g. STF001"
                  className="px-3.5 py-2.5 rounded-xl border border-surface-300 text-xs focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-surface-700">
                  From Timestamp
                </label>
                <input
                  type="datetime-local"
                  value={rangeStart}
                  onChange={(e) => setRangeStart(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-surface-300 text-xs focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-surface-700">
                  To Timestamp
                </label>
                <input
                  type="datetime-local"
                  value={rangeEnd}
                  onChange={(e) => setRangeEnd(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-surface-300 text-xs focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none font-mono"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() =>
                    void fetchStaffTurnaroundReportApi(staffFilter, rangeStart, rangeEnd).then(
                      setTurnaroundReport,
                    )
                  }
                  className="w-full h-10 px-6 rounded-xl bg-surface-950 hover:bg-brand-950 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm hover:shadow cursor-pointer flex items-center justify-center gap-2"
                >
                  <Filter size={13} />
                  <span>Filter Records</span>
                </button>
              </div>
            </div>

            {/* Turnaround Table */}
            <div className="overflow-x-auto rounded-2xl border border-surface-200">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-surface-100/70 border-b border-surface-200 text-surface-600 uppercase tracking-wider font-semibold">
                    <th className="py-3.5 px-6">Attendant Staff</th>
                    <th className="py-3.5 px-6">Serviced Suite</th>
                    <th className="py-3.5 px-6">Cycle Begun</th>
                    <th className="py-3.5 px-6">Cycle Completed</th>
                    <th className="py-3.5 px-6 text-right">Turnaround Speed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {turnaroundReport.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-xs text-surface-400 font-light">
                        No completed housekeeping turnaround cycles recorded for this period.
                      </td>
                    </tr>
                  ) : (
                    turnaroundReport.map((r, i) => (
                      <tr key={i} className="hover:bg-surface-50 transition-colors">
                        <td className="py-4 px-6 font-semibold text-surface-950 flex items-center gap-2">
                          <Users size={14} className="text-brand-600" />
                          <span>{r.staffName}</span>
                          <span className="text-xs text-surface-400 font-mono">({r.staffId})</span>
                        </td>
                        <td className="py-4 px-6 font-bold font-mono text-surface-800">
                          Suite {r.roomId}
                        </td>
                        <td className="py-4 px-6 font-mono text-surface-600">
                          {new Date(r.cycleStart).toLocaleString()}
                        </td>
                        <td className="py-4 px-6 font-mono text-surface-600">
                          {new Date(r.cycleEnd).toLocaleString()}
                        </td>
                        <td className="py-4 px-6 text-right font-mono font-bold text-brand-800">
                          {r.durationMinutes} min
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}