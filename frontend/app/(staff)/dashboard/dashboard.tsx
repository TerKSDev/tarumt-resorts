import { type MetaFunction, Link } from "react-router";
import { useState, useEffect } from "react";
import {
  Bed,
  UserRoundPlus,
  BrushCleaning,
  Building2,
  Sparkles,
  ArrowRight,
  Clock,
  Search,
  ClipboardPen,
  Users,
  Trophy,
  Activity,
  Layers,
} from "lucide-react";
import { motion } from "motion/react";
import { Card, CardHeader } from "../../../components/Card";
import StatCard from "../../../components/StatCard";

export const meta: MetaFunction = () => [
  { title: "Dashboard | TARUMT Resorts & Hospitality" },
];

type RoomData = {
  roomId: string;
  roomNumber?: string;
  roomType?: string;
  status: string;
  ratePerNight?: number;
};

type QueueItem = {
  id?: string;
  guestName?: string;
  arrivalDate?: string;
};

export default function Dashboard() {
  const [staffName, setStaffName] = useState("Staff Member");
  const [staffRole, setStaffRole] = useState("Front Desk");
  const [currentTime, setCurrentTime] = useState("");

  // Live Metrics State
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [queueCount, setQueueCount] = useState(0);
  const [housekeepingCount, setHousekeepingCount] = useState(0);

  useEffect(() => {
    const savedName = localStorage.getItem("currentStaffName");
    const savedRole = localStorage.getItem("currentStaffRole");
    if (savedName) setStaffName(savedName);
    if (savedRole) setStaffRole(savedRole);

    // Format current date and time
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);

    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // 1. Fetch Rooms
        const roomRes = await fetch("http://localhost:8081/api/room");
        if (roomRes.ok) {
          const roomData: RoomData[] = await roomRes.json();
          if (Array.isArray(roomData)) {
            setRooms(roomData);
          }
        }

        // 2. Fetch Registration Queue
        const queueRes = await fetch("http://localhost:8081/api/registration/queue");
        if (queueRes.ok) {
          const queueData: QueueItem[] = await queueRes.json();
          if (Array.isArray(queueData)) {
            setQueueCount(queueData.length);
          }
        }

        // 3. Fetch Housekeeping Tasks
        const hkRes = await fetch("http://localhost:8081/api/housekeeping/rooms");
        if (hkRes.ok) {
          const hkData = await hkRes.json();
          if (Array.isArray(hkData)) {
            const pending = hkData.filter(
              (r: any) =>
                r.housekeepingStatus === "DIRTY" ||
                r.housekeepingStatus === "CLEANING_IN_PROGRESS" ||
                r.status === "CLEANING"
            );
            setHousekeepingCount(pending.length);
          }
        }
      } catch (err) {
        console.warn("API offline or error fetching live dashboard data:", err);
      }
    };

    void fetchDashboardData();

    return () => clearInterval(timer);
  }, []);

  // Compute Room Metrics
  const totalRooms = rooms.length > 0 ? rooms.length : 24;
  const availableRooms =
    rooms.length > 0
      ? rooms.filter((r) => r.status === "AVAILABLE").length
      : 14;
  const occupiedRooms =
    rooms.length > 0
      ? rooms.filter((r) => r.status === "OCCUPIED" || r.status === "CHECKED_IN").length
      : 7;
  const reservedRooms =
    rooms.length > 0 ? rooms.filter((r) => r.status === "RESERVED").length : 2;
  const cleaningRooms =
    rooms.length > 0 ? rooms.filter((r) => r.status === "CLEANING").length : 1;
  const maintenanceRooms =
    rooms.length > 0
      ? rooms.filter((r) => r.status === "MAINTENANCE").length
      : 0;

  const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);

  // Estimated gross revenue
  const totalGrossRevenue =
    rooms.length > 0
      ? rooms
          .filter((r) => r.status === "OCCUPIED")
          .reduce((acc, curr) => acc + (curr.ratePerNight || 350), 0)
      : occupiedRooms * 420;

  const isManager = staffRole === "Manager" || staffRole === "Admin";
  const isFrontDesk = staffRole === "Front Desk" || isManager;
  const isHousekeeping = staffRole === "Housekeeping" || isManager;

  const occupancyMutation = occupancyRate >= 50 ? 12 : -5;

  return (
    <main className="flex flex-1 flex-col gap-8 pb-12 w-full max-w-7xl mx-auto selection:bg-brand-500 selection:text-white">
      {/* 1. Welcome & Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 md:p-8 rounded-3xl bg-surface-950 text-surface-50 relative overflow-hidden shadow-xl border border-surface-800"
      >
        <div className="absolute rounded-full w-96 h-96 bg-brand-900/25 blur-[120px] -top-20 -right-20 pointer-events-none" />
        <div className="absolute rounded-full w-80 h-80 bg-brand-700/15 blur-[100px] -bottom-20 -left-20 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col gap-2.5 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-900 border border-surface-700/80 text-brand-300 text-xs font-medium tracking-wide">
                <Sparkles size={13} className="text-brand-400" />
                <span>Executive Operations Hub</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/70 text-emerald-300 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Sync Active</span>
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-white">
              Welcome back, {staffName}
            </h1>
            <p className="text-xs md:text-sm text-surface-300 font-light leading-relaxed">
              Real-time telemetry for room occupancy, guest registration queue,
              cleaning pipeline, and resort analytics.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex flex-col items-end justify-center px-5 py-3 rounded-2xl bg-surface-900/90 border border-surface-800 backdrop-blur-md shadow-inner">
              <div className="flex items-center gap-2 text-surface-300 text-xs font-mono">
                <Clock size={13} className="text-brand-400" />
                <span>{currentTime || "Loading..."}</span>
              </div>
              <span className="text-[11px] text-brand-300 font-medium mt-0.5">
                Role: {staffRole}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Key Metrics Stat Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full"
      >
        <StatCard
          title="Resort Occupancy"
          value={`${occupancyRate}%`}
          icon={Bed}
          color="brand"
          mutation={occupancyMutation}
        />
        <StatCard
          title="Available Suites"
          value={`${availableRooms} Suites`}
          icon={Building2}
          color="emerald"
          mutation={availableRooms}
        />
        <StatCard
          title="Front Desk Queue"
          value={`${queueCount} Waiting`}
          icon={UserRoundPlus}
          color="indigo"
          mutation={queueCount}
        />
        <StatCard
          title="Pending Housekeeping"
          value={`${housekeepingCount} Tasks`}
          icon={BrushCleaning}
          color="purple"
          mutation={housekeepingCount}
        />
      </motion.div>

      {/* 3. Operational Visual Hubs: Room Inventory & Cleaning Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Room Inventory Status Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full flex flex-col justify-between">
            <div>
              <CardHeader
                title="Suites Inventory & Status"
                subtitle="Live status distribution across all accommodation tiers"
                icon={Layers}
              />
              <div className="flex flex-col gap-4 mt-6">
                {/* Progress Bar Overview */}
                <div className="w-full h-3.5 bg-surface-100 rounded-full overflow-hidden flex shadow-inner">
                  <div
                    style={{ width: `${(availableRooms / totalRooms) * 100}%` }}
                    className="bg-emerald-500 h-full transition-all duration-500"
                    title={`Available: ${availableRooms}`}
                  />
                  <div
                    style={{ width: `${(occupiedRooms / totalRooms) * 100}%` }}
                    className="bg-brand-600 h-full transition-all duration-500"
                    title={`Occupied: ${occupiedRooms}`}
                  />
                  <div
                    style={{ width: `${(reservedRooms / totalRooms) * 100}%` }}
                    className="bg-purple-500 h-full transition-all duration-500"
                    title={`Reserved: ${reservedRooms}`}
                  />
                  <div
                    style={{ width: `${(cleaningRooms / totalRooms) * 100}%` }}
                    className="bg-amber-500 h-full transition-all duration-500"
                    title={`Cleaning: ${cleaningRooms}`}
                  />
                  <div
                    style={{ width: `${(maintenanceRooms / totalRooms) * 100}%` }}
                    className="bg-rose-500 h-full transition-all duration-500"
                    title={`Maintenance: ${maintenanceRooms}`}
                  />
                </div>

                {/* Status Badges Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="text-xs font-semibold text-emerald-900">Available</span>
                    </div>
                    <span className="text-sm font-bold text-emerald-950 font-mono">{availableRooms}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-brand-50/60 border border-brand-200/80">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-brand-600 shrink-0" />
                      <span className="text-xs font-semibold text-brand-900">Occupied</span>
                    </div>
                    <span className="text-sm font-bold text-brand-950 font-mono">{occupiedRooms}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-50/60 border border-purple-200/80">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
                      <span className="text-xs font-semibold text-purple-900">Reserved</span>
                    </div>
                    <span className="text-sm font-bold text-purple-950 font-mono">{reservedRooms}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                      <span className="text-xs font-semibold text-amber-900">Cleaning</span>
                    </div>
                    <span className="text-sm font-bold text-amber-950 font-mono">{cleaningRooms}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-50/60 border border-rose-200/80">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                      <span className="text-xs font-semibold text-rose-900">Maintenance</span>
                    </div>
                    <span className="text-sm font-bold text-rose-950 font-mono">{maintenanceRooms}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-100 border border-surface-300">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-surface-600 shrink-0" />
                      <span className="text-xs font-semibold text-surface-800">Total Rooms</span>
                    </div>
                    <span className="text-sm font-bold text-surface-950 font-mono">{totalRooms}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-surface-200/80 mt-6 flex items-center justify-between">
              <span className="text-xs text-surface-500 font-light">
                Est. Daily Room Folio Revenue: <strong className="text-surface-900 font-medium font-mono">RM {totalGrossRevenue.toLocaleString()}</strong>
              </span>
              <Link
                to="/room"
                className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1 group transition-colors"
              >
                <span>View Suites Inventory</span>
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </Card>
        </motion.div>

        {/* Housekeeping Pipeline & Turnaround */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full flex flex-col justify-between">
            <div>
              <CardHeader
                title="Housekeeping Workflow"
                subtitle="Sanitation lifecycle and room inspection stages"
                icon={BrushCleaning}
              />
              
              <div className="flex flex-col gap-4 mt-6">
                <div className="flex flex-col gap-3">
                  {/* Stage 1: Dirty */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-50 border border-surface-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                        1
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-surface-900">Dirty / Vacated</h4>
                        <p className="text-[11px] text-surface-500 font-light">Queued for housekeeping turnaround</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                      {cleaningRooms} Suites
                    </span>
                  </div>

                  {/* Stage 2: In Progress */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-50 border border-surface-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs">
                        2
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-surface-900">Cleaning In Progress</h4>
                        <p className="text-[11px] text-surface-500 font-light">Assigned housekeeping attendants active</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-indigo-800 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full">
                      Active
                    </span>
                  </div>

                  {/* Stage 3: Inspected & Clean */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-50 border border-surface-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                        3
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-surface-900">Inspected & Ready</h4>
                        <p className="text-[11px] text-surface-500 font-light">Supervisor approved for check-in</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                      {availableRooms} Ready
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-surface-200/80 mt-6 flex items-center justify-between">
              <span className="text-xs text-surface-500 font-light">
                Turnaround SLA: <strong className="text-emerald-700 font-medium">96.4% on time</strong>
              </span>
              <Link
                to="/log"
                className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1 group transition-colors"
              >
                <span>Open Cleaning Logs</span>
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* 4. Role-Adaptive Quick Launch Console */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader
            title="Operational Shortcuts"
            subtitle={`Role-tailored quick launch actions for ${staffRole}`}
            icon={Activity}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {isFrontDesk && (
              <>
                <Link
                  to="/registration"
                  className="p-4 rounded-2xl bg-surface-50 hover:bg-brand-50/50 border border-surface-200 hover:border-brand-300 transition-all duration-200 group flex items-center gap-3.5 shadow-2xs hover:shadow-xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <UserRoundPlus size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-surface-900 group-hover:text-brand-950">
                      Walk-In Registration
                    </span>
                    <span className="text-[11px] text-surface-500 font-light">
                      Enqueue walk-in arrivals
                    </span>
                  </div>
                </Link>

                <Link
                  to="/search"
                  className="p-4 rounded-2xl bg-surface-50 hover:bg-brand-50/50 border border-surface-200 hover:border-brand-300 transition-all duration-200 group flex items-center gap-3.5 shadow-2xs hover:shadow-xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Search size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-surface-900 group-hover:text-brand-950">
                      Guest Search & Folio
                    </span>
                    <span className="text-[11px] text-surface-500 font-light">
                      8-digit confirmation search
                    </span>
                  </div>
                </Link>

                <Link
                  to="/vip"
                  className="p-4 rounded-2xl bg-surface-50 hover:bg-brand-50/50 border border-surface-200 hover:border-brand-300 transition-all duration-200 group flex items-center gap-3.5 shadow-2xs hover:shadow-xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Trophy size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-surface-900 group-hover:text-brand-950">
                      VIP Priority Queue
                    </span>
                    <span className="text-[11px] text-surface-500 font-light">
                      Tiered membership express
                    </span>
                  </div>
                </Link>
              </>
            )}

            {isHousekeeping && (
              <Link
                to="/log"
                className="p-4 rounded-2xl bg-surface-50 hover:bg-brand-50/50 border border-surface-200 hover:border-brand-300 transition-all duration-200 group flex items-center gap-3.5 shadow-2xs hover:shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <BrushCleaning size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-surface-900 group-hover:text-brand-950">
                    Housekeeping Logs
                  </span>
                  <span className="text-[11px] text-surface-500 font-light">
                    Advance cleaning tasks
                  </span>
                </div>
              </Link>
            )}

            {isManager && (
              <>
                <Link
                  to="/report"
                  className="p-4 rounded-2xl bg-surface-50 hover:bg-brand-50/50 border border-surface-200 hover:border-brand-300 transition-all duration-200 group flex items-center gap-3.5 shadow-2xs hover:shadow-xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <ClipboardPen size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-surface-900 group-hover:text-brand-950">
                      Report Centre
                    </span>
                    <span className="text-[11px] text-surface-500 font-light">
                      Generate executive audits
                    </span>
                  </div>
                </Link>

                <Link
                  to="/user"
                  className="p-4 rounded-2xl bg-surface-50 hover:bg-brand-50/50 border border-surface-200 hover:border-brand-300 transition-all duration-200 group flex items-center gap-3.5 shadow-2xs hover:shadow-xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Users size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-surface-900 group-hover:text-brand-950">
                      User Management
                    </span>
                    <span className="text-[11px] text-surface-500 font-light">
                      Staff accounts & access
                    </span>
                  </div>
                </Link>
              </>
            )}
          </div>
        </Card>
      </motion.div>
    </main>
  );
}
