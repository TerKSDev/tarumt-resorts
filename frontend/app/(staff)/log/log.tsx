import { useState, useEffect } from "react";
import { type MetaFunction } from "react-router";
import StatCard from "../../../components/StatCard";
import {
  Brush, Sparkles, ClipboardCheck, Trash2, Undo2, Clock,
  CheckCircle2, AlertCircle, DoorClosed, Wrench
} from "lucide-react";

export const meta: MetaFunction = () => [
  { title: "Housekeeping | TARUMT Resorts" },
];

const API_BASE = "http://localhost:8081/api/housekeeping";

interface Room {
  roomId: string;
  type: string;
  status: string; // RoomStatus: AVAILABLE | RESERVED | CHECKED_IN | CHECKED_OUT | MAINTENANCE | CLEANING
}

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

// Rooms in these RoomStatus values are not housekeeping's territory:
// a guest is currently staying (RESERVED/CHECKED_IN), or Room Management
// has pulled the room out of the cleaning cycle entirely (MAINTENANCE).
// The backend rejects advance/rollback for these too - this just keeps
// the UI from offering an action that will fail anyway.
const NOT_HOUSEKEEPINGS_TERRITORY = ["RESERVED", "CHECKED_IN", "MAINTENANCE"];

function occupancyReason(status: string): string | null {
  if (status === "RESERVED" || status === "CHECKED_IN") {
    return "Occupied by a guest";
  }
  if (status === "MAINTENANCE") {
    return "Under maintenance";
  }
  return null;
}

export default function Housekeeping() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [statusReport, setStatusReport] = useState<RoomStatusSummary[]>([]);

  // Frontend-only display log - NOT persisted, resets on page refresh.
  // (The actual rollback capability is tracked server-side per room via
  // canRollback in statusReport, independent of this list.)
  const [historyStack, setHistoryStack] = useState<any[]>([]);

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

  const fetchStatusReport = () =>
    safeFetchArray<RoomStatusSummary>(`${API_BASE}/reports/room-status`, setStatusReport, "/reports/room-status");

  const refreshAll = () => {
    fetchRooms();
    fetchStatusReport();
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

              const outOfTerritory = NOT_HOUSEKEEPINGS_TERRITORY.includes(room.status);
              const reason = occupancyReason(room.status);
              const canRollback = !outOfTerritory && (stage?.canRollback ?? false);
              const canAdvance = !outOfTerritory && !isReady;

              return (
                <div key={room.roomId} className="flex items-center justify-between p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-surface-200 dark:bg-surface-700 flex items-center justify-center font-bold">
                      {room.roomId}
                    </div>
                    <div>
                      <h3 className="font-semibold">{room.type}</h3>
                      {outOfTerritory ? (
                        <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
                          {room.status === "MAINTENANCE" ? <Wrench size={12} /> : <DoorClosed size={12} />}
                          {reason}
                        </span>
                      ) : (
                        <span className="text-xs text-surface-500 font-medium">
                          Stage: {stageName}
                          {stage ? ` · ${formatMinutes(stage.minutesInCurrentStage)}` : ""}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRollback(room.roomId)}
                      disabled={!canRollback}
                      title={
                        outOfTerritory
                          ? `${reason} - not available to housekeeping`
                          : canRollback
                            ? "Undo this room's last action"
                            : "No action to undo for this room"
                      }
                      className="p-2 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Undo2 size={16} />
                    </button>
                    <button
                      onClick={() => handleAdvance(room.roomId)}
                      disabled={!canAdvance}
                      title={outOfTerritory ? `${reason} - not available to housekeeping` : undefined}
                      className="px-4 py-2 bg-surface-200 hover:bg-surface-300 dark:bg-surface-700 text-sm font-medium rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {outOfTerritory ? reason : isReady ? "Ready For Check-In" : `Advance to ${nextLabel} →`}
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
    </main>
  );
}