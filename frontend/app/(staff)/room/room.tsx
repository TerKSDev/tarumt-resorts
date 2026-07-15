import { type MetaFunction, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import Tab from "../../../components/Tab";
import { Plus, Search } from "lucide-react";
import RoomCard, { type RoomProps } from "./components/RoomCard";
import axios from "axios";
import { AddRoomModal, EditRoomModal } from "./components/RoomModal";

export const meta: MetaFunction = () => [
  { title: "Room Management | TARUMT Resorts" },
];

export default function Room() {
  const [searchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/room");
      setRooms(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const currentTab = searchParams.get("status") || "all";
  const [searchQuery, setSearchQuery] = useState("");

  const availableRoom = rooms.filter(
    (room: RoomProps) => room.status === "AVAILABLE",
  );
  const checkedInRoom = rooms.filter(
    (room: RoomProps) => room.status === "CHECKED_IN",
  );
  const maintenanceRoom = rooms.filter(
    (room: RoomProps) => room.status === "MAINTENANCE",
  );
  const cleaningRoom = rooms.filter(
    (room: RoomProps) => room.status === "CLEANING",
  );
  const reservedRoom = rooms.filter(
    (room: RoomProps) => room.status === "RESERVED",
  );

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

  return (
    <main className="flex-1 min-h-screen flex flex-col gap-6">
      <div className="flex items-center xl:justify-between gap-4 rounded-sm xl:gap-8 xl:flex-row flex-col">
        <div className="w-full xl:w-fit scrollbar-hidden flex items-center gap-2 overflow-x-auto">
          <Tab label="All" count={rooms.length} value="all" />
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
        <div className="flex items-center gap-2 sm:gap-4 w-full xl:w-auto">
          <div className="flex min-w-48 md:min-w-72 h-10 gap-3 scrollbar-hidden flex-1 group focus-within:border-brand-600 focus-within:hover:border-brand-600 focus-within:shadow-md focus-within:ring-1 focus-within:ring-brand-600/20 focus-within:scale-105 transition-all duration-300 border px-4 border-surface-400 p-2 items-center rounded-lg bg-surface-50 hover:border-surface-500 shadow-xs">
            <label htmlFor="search">
              <Search
                size={16}
                className="text-surface-600 group-focus-within:text-brand-600 transition-all duration-300 group-focus-within:-rotate-8 group-focus-within:scale-115"
              />
            </label>
            <input
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-full w-full outline-none text-sm text-surface-800 placeholder:text-surface-500 bg-transparent"
              placeholder="Search rooms by ID or type..."
            />
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen("add")}
            className="flex h-10 items-center leading-tight justify-center gap-2 px-4 py-2 font-medium hover:bg-brand-700 text-sm rounded-lg transition-all duration-300 text-surface-50 bg-brand-500 text-nowrap cursor-pointer"
          >
            <Plus size={18} />
            <span className="hidden sm:flex">Add Room</span>
          </button>
        </div>
      </div>

      {displayedRooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full min-h-[50vh] bg-surface-50 border border-surface-200 border-dashed rounded-xl">
          <Search size={48} className="text-surface-300 mb-4" />
          <h1 className="text-lg font-medium text-surface-600">
            No rooms found
          </h1>
          <p className="text-sm text-surface-500">
            Try adjusting your filters or search query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayedRooms.map((room: RoomProps, idx: number) => {
            return (
              <RoomCard
                key={idx}
                room={room}
                setIsModalOpen={(action) => {
                  setIsModalOpen(action);
                  if (action === "edit") setSelectedRoom(room);
                }}
              />
            );
          })}
        </div>
      )}

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
    </main>
  );
}
