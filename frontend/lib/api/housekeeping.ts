export interface HousekeepingRoom {
  roomId: string;
  type: string;
  status: string;
}

export interface RoomStatusSummary {
  roomId: string;
  currentStage: string;
  nextStage: string | null;
  minutesInCurrentStage: number;
  canRollback: boolean;
}

export interface StaffTurnaround {
  roomId: string;
  staffId: string;
  staffName: string;
  cycleStart: string;
  cycleEnd: string;
  durationMinutes: number;
}

const API_BASE = "http://localhost:8081/api/housekeeping";

export async function fetchHousekeepingRoomsApi(): Promise<HousekeepingRoom[]> {
  const res = await fetch(`${API_BASE}/rooms`);
  if (!res.ok) throw new Error(`Failed to load rooms (${res.status})`);
  return res.json();
}

export async function fetchRoomStatusReportApi(
  statusFilter?: string,
  minMinutesFilter?: string,
): Promise<RoomStatusSummary[]> {
  const params = new URLSearchParams();
  if (statusFilter) params.set("filterStatus", statusFilter);
  if (minMinutesFilter) params.set("minMinutesWaiting", minMinutesFilter);
  const res = await fetch(`http://localhost:8081/api/report/housekeeping-status?${params}`);
  if (!res.ok) throw new Error(`Failed to load room status report (${res.status})`);
  return res.json();
}

export async function fetchStaffTurnaroundReportApi(
  staffFilter?: string,
  rangeStart?: string,
  rangeEnd?: string,
): Promise<StaffTurnaround[]> {
  const params = new URLSearchParams();
  if (staffFilter) params.set("filterStaffId", staffFilter);
  if (rangeStart) params.set("rangeStart", rangeStart);
  if (rangeEnd) params.set("rangeEnd", rangeEnd);
  const res = await fetch(`http://localhost:8081/api/report/cleaning-turnaround?${params}`);
  if (!res.ok) throw new Error(`Failed to load staff turnaround report (${res.status})`);
  return res.json();
}

export async function advanceRoomStageApi(roomId: string): Promise<string> {
  const staffId = localStorage.getItem("currentStaffId") || "";
  const res = await fetch(
    `${API_BASE}/advance?roomId=${roomId}&staffId=${staffId}&remarks=UpdatedViaWeb`,
    { method: "POST" },
  );
  const text = await res.text();
  if (!res.ok) throw new Error(text || `Advance failed (${res.status})`);
  return text;
}

export async function rollbackRoomStageApi(roomId: string): Promise<string> {
  const res = await fetch(`${API_BASE}/rollback?roomId=${roomId}`, {
    method: "POST",
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text || `Rollback failed (${res.status})`);
  return text;
}

