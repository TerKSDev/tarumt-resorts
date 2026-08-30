/**
 * Author: See Wei Jian
 */

import { useState, useEffect } from "react";
import { Link, type MetaFunction } from "react-router"; 
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
  RefreshCw,
  DoorClosed,
  Wrench,
} from "lucide-react";
import {
  type HousekeepingRoom,
  type RoomStatusSummary,
  fetchHousekeepingRoomsApi,
  fetchRoomStatusReportApi,
  advanceRoomStageApi,
  rollbackRoomStageApi,
} from "../../../lib/api/housekeeping";
import { Card, CardHeader } from "../../../components/Card";

export const meta: MetaFunction = () => [
  { title: "Housekeeping & Sanitization Logistics | TARUMT Resorts" },
];

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

const NOT_HOUSEKEEPINGS_TERRITORY = [
  "AVAILABLE",
  "RESERVED",
  "CHECKED_IN",
  "MAINTENANCE",
];

function occupancyReason(status: string): string {
  switch (status) {
    case "CHECKED_IN":
      return "Guest in Room";
    case "RESERVED":
      return "Reserved";
    case "AVAILABLE":
      return "Available";
    case "MAINTENANCE":
      return "Under Maintenance";
    default:
      return status;
  }
}

function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

interface ActionLogItem {
  id: number;
  room: string;
  message: string;
  time: string;
  success?: boolean;
}

export default function Log() {
  const [rooms, setRooms] = useState<HousekeepingRoom[]>([]);
  const [statusReport, setStatusReport] = useState<RoomStatusSummary[]>([]);
  const [historyStack, setHistoryStack] = useState<ActionLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const refreshAll = async () => {
    try {
      setLoading(true);
      const [roomsData, statusData] = await Promise.all([
        fetchHousekeepingRoomsApi().catch(() => []),
        fetchRoomStatusReportApi("", "").catch(() => []),
      ]);
      setRooms(roomsData);
      setStatusReport(statusData);
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
                const outOfTerritory = NOT_HOUSEKEEPINGS_TERRITORY.includes(room.status);
                const reason = occupancyReason(room.status);
                const canRollback = !outOfTerritory && (stage?.canRollback ?? false);
                const canAdvance = !outOfTerritory && !isReady;

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
                          {outOfTerritory ? (
                            <span className="inline-flex items-center gap-1 text-xs text-surface-500 font-medium px-2 py-0.5 rounded-full bg-surface-100 border border-surface-200">
                              {room.status === "MAINTENANCE" ? <Wrench size={12} /> : <DoorClosed size={12} />}
                              {reason}
                            </span>
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold border ${currentCfg.badge}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${currentCfg.dot}`} />
                              <span>{currentCfg.label}</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-surface-500 font-mono">
                          Duration in current stage:{" "}
                          <span className="font-semibold text-surface-800">
                            {stage ? `${formatMinutes(stage.minutesInCurrentStage)}` : "0m"}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => void handleRollback(room.roomId)}
                        disabled={!canRollback}
                        title={
                          outOfTerritory
                            ? `${reason} - not available to housekeeping`
                            : canRollback
                            ? "Undo this suite's last action"
                            : "No undo action available"
                        }
                        className="p-2.5 rounded-xl border border-surface-200 text-surface-600 hover:text-surface-950 hover:bg-surface-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        <Undo2 size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => void handleAdvance(room.roomId)}
                        disabled={!canAdvance}
                        className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                          outOfTerritory
                            ? "bg-surface-100 text-surface-400 border border-surface-200 cursor-not-allowed"
                            : isReady
                            ? "bg-brand-50 text-brand-700 border border-brand-200 cursor-default"
                            : "bg-surface-950 hover:bg-brand-950 text-white shadow-sm hover:shadow"
                        }`}
                      >
                        <span>
                          {outOfTerritory
                            ? reason
                            : isReady
                            ? "Suite Released"
                            : `Advance to ${nextLabel ?? "Next"} →`}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Right Col: Live History Stack */}
        <Card>
          <CardHeader
            title="Dispatch Action Stack"
            subtitle="Most recent undoable transitions."
            icon={Clock}
          />

          <div className="p-4 flex flex-col gap-3 max-h-[580px] overflow-y-auto scrollbar-hidden">
            {historyStack.length === 0 ? (
              <div className="py-12 text-center text-xs text-surface-400 font-light flex flex-col items-center gap-2">
                <Clock size={24} strokeWidth={1.5} className="text-surface-300" />
                <span>No actions executed in current session yet.</span>
              </div>
            ) : (
              historyStack.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-surface-50 border border-surface-200 flex flex-col gap-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-mono text-surface-950">
                      Suite {item.room}
                    </span>
                    <span className="text-[10px] font-mono text-surface-400">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-surface-600 line-clamp-2">{item.message}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Operational Reports & Analytics"
          subtitle="Generate, filter, and download detailed PDF management reports."
          icon={BarChart3}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="border border-surface-200 rounded-2xl p-5 hover:border-brand-300 hover:shadow-md transition-all flex flex-col gap-5 bg-surface-50/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-50 border border-brand-200 text-brand-700 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                <Sparkles size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-surface-950 text-sm">Room Housekeeping Status Report</h3>
                <p className="text-xs text-surface-500 mt-1">
                  Track live bottlenecks and identify which suites have been stuck in cleaning stages the longest.
                </p>
              </div>
            </div>
            <Link 
              to="/report/housekeeping-status" 
              className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 bg-surface-950 text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-brand-950 transition-colors shadow-sm"
            >
              Generate Report <ArrowRight size={14} />
            </Link>
          </div>

          <div className="border border-surface-200 rounded-2xl p-5 hover:border-brand-300 hover:shadow-md transition-all flex flex-col gap-5 bg-surface-50/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-50 border border-brand-200 text-brand-700 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                <Users size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-surface-950 text-sm">Cleaning Turnaround Report</h3>
                <p className="text-xs text-surface-500 mt-1">
                  Analyze staff performance by tracking the duration of completed cleaning cycles per attendant.
                </p>
              </div>
            </div>
            <Link 
              to="/report/cleaning-turnaround" 
              className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 bg-surface-950 text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-brand-950 transition-colors shadow-sm"
            >
              Generate Report <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </Card>
    </div>
  );
}