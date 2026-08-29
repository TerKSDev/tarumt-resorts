import { type MetaFunction, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import Tab from "../../../components/Tab";
import { Plus, Search, Bed, X, Sparkles } from "lucide-react";
import RoomCard, { type RoomProps } from "./components/RoomCard";
import axios from "axios";
import { AddRoomModal, EditRoomModal } from "./components/RoomModal";
import { motion } from "motion/react";

export const meta: MetaFunction = () => [
  { title: "Room & Suite Inventory Management | TARUMT Resorts" },
];

export default function Room() {
  const [searchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [rooms, setRooms] = useState<RoomProps[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8081/api/room");
      setRooms(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const currentTab = searchParams.get("status") || "all";
  const [searchQuery, setSearchQuery] = useState("");

  const availableRoom = rooms.filter((room) => room.status === "AVAILABLE");
  const checkedInRoom = rooms.filter((room) => room.status === "CHECKED_IN");
  const maintenanceRoom = rooms.filter((room) => room.status === "MAINTENANCE");
  const cleaningRoom = rooms.filter((room) => room.status === "CLEANING");
  const reservedRoom = rooms.filter((room) => room.status === "RESERVED");

  const displayedRooms = rooms
    .filter((room: RoomProps) => {
      if (currentTab === "available" && room.status !== "AVAILABLE")
        return false;
      if (currentTab === "reserved" && room.status !== "RESERVED") return false;
      if (currentTab === "checked-in" && room.status !== "CHECKED_IN")
        return false;
      if (currentTab === "maintenance" && room.status !== "MAINTENANCE")
        return false;
      if (currentTab === "cleaning" && room.status !== "CLEANING") return false;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          String(room.roomId).toLowerCase().includes(query) ||
          String(room.type).toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a: RoomProps, b: RoomProps) => a.roomId.localeCompare(b.roomId));

  const occupancyRate = rooms.length > 0
    ? ((checkedInRoom.length / rooms.length) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="flex-1 flex flex-col gap-8 pb-10">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-surface-950 text-surface-50 relative overflow-hidden shadow-xl border border-surface-800">
        <div className="absolute rounded-full w-96 h-96 bg-brand-900/30 blur-[100px] -top-20 -right-20 pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-900 border border-surface-700/80 text-brand-300 text-xs font-medium tracking-wide w-fit">
              <Sparkles size={13} />
              <span>Live Suite Telemetry</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif tracking-tight font-semibold text-white">
              Accommodations & Suite Inventory
            </h1>
            <p className="text-xs md:text-sm text-surface-300 font-light leading-relaxed">
              Real-time room allocation, sanitation workflows, rate configuration, and capacity management.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="flex flex-col items-center justify-center px-5 py-3 rounded-2xl bg-surface-900/80 border border-surface-800 backdrop-blur-md">
              <span className="text-xl font-bold font-mono text-brand-300">
                {occupancyRate}%
              </span>
              <span className="text-[10px] uppercase tracking-wider text-surface-400 font-medium">
                Occupancy
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen("add")}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-brand-50 text-surface-950 hover:text-brand-900 text-xs font-bold uppercase tracking-widest transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-95"
            >
              <Plus size={16} strokeWidth={2} />
              <span>Add Suite</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="flex items-center xl:justify-between gap-4 xl:flex-row flex-col">
        {/* Status Tabs */}
        <div className="w-full xl:w-fit scrollbar-hidden flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0">
          <Tab label="All Suites" count={rooms.length} value="all" />
          <Tab
            label="Available"
            count={availableRoom.length}
            value="available"
          />
          <Tab
            label="Checked In"
            count={checkedInRoom.length}
            value="checked-in"
          />
          <Tab label="Reserved" count={reservedRoom.length} value="reserved" />
          <Tab
            label="Maintenance"
            count={maintenanceRoom.length}
            value="maintenance"
          />
          <Tab label="Cleaning" count={cleaningRoom.length} value="cleaning" />
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-white border border-surface-300 shadow-2xs focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-100 transition-all w-full xl:w-80 group">
          <label htmlFor="search" className="cursor-pointer">
            <Search
              size={15}
              strokeWidth={1.75}
              className="text-surface-400 group-focus-within:text-brand-600 transition-colors"
            />
          </label>
          <input
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full outline-none text-xs text-surface-900 placeholder:text-surface-400 bg-transparent font-normal"
            placeholder="Search suites by number or type..."
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-surface-400 hover:text-surface-700"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Room Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center w-full min-h-[40vh] bg-white border border-surface-200 rounded-3xl shadow-xs">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mb-3" />
          <span className="text-xs text-surface-500 font-medium">
            Loading accommodation inventory...
          </span>
        </div>
      ) : displayedRooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full min-h-[45vh] bg-white border border-surface-200 rounded-3xl shadow-xs p-8 text-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-surface-100 flex items-center justify-center text-surface-400 border border-surface-200">
            <Bed size={26} strokeWidth={1.5} />
          </div>
          <h2 className="text-lg font-serif text-surface-800 font-semibold">
            No Suites Found
          </h2>
          <p className="text-xs text-surface-500 font-light max-w-sm">
            No rooms match the selected status filter or search parameters.
          </p>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-2 text-xs text-brand-700 font-semibold underline hover:text-brand-900 cursor-pointer"
            >
              Clear Search Query
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {displayedRooms.map((room: RoomProps, idx: number) => (
            <RoomCard
              key={idx}
              room={room}
              setIsModalOpen={(action) => {
                setIsModalOpen(action);
                if (action === "edit") setSelectedRoom(room);
              }}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {isModalOpen === "add" && (
        <AddRoomModal
          setIsModalOpen={setIsModalOpen}
          refreshData={fetchRooms}
        />
      )}
      {isModalOpen === "edit" && selectedRoom && (
        <EditRoomModal
          setIsModalOpen={setIsModalOpen}
          room={selectedRoom}
          refreshData={fetchRooms}
        />
      )}
    </div>
  );
}
