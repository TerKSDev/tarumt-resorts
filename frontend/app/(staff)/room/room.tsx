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
    <main className="flex-1 flex flex-col gap-6 h-fit">
      <div className="flex items-center xl:justify-between gap-6 rounded-sm xl:gap-8 xl:flex-row flex-col">
        <div className="w-full xl:w-fit scrollbar-hidden flex items-center gap-3 overflow-x-auto pb-2 xl:pb-0">
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
        <div className="flex items-center gap-3 sm:gap-4 w-full xl:w-auto">
          <div className="flex items-center h-10 gap-3 px-5 rounded-full bg-white border border-surface-200 shadow-xs focus-within:border-surface-400 focus-within:shadow-md transition-all duration-300 min-w-48 md:min-w-72 flex-1 group">
            <label htmlFor="search">
              <Search
                size={16}
                strokeWidth={1.5}
                className="text-surface-400 group-focus-within:text-surface-700 transition-colors cursor-pointer"
              />
            </label>
            <input
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-full w-full outline-none text-sm text-surface-800 placeholder:text-surface-400 bg-transparent font-light"
              placeholder="Search rooms by ID or type..."
            />
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen("add")}
            className="flex h-10 items-center gap-2 px-6 text-xs uppercase tracking-widest font-medium rounded-full bg-surface-900 hover:bg-surface-800 text-white transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
          >
            <Plus size={16} strokeWidth={2} />
            <span className="hidden sm:flex text-nowrap">Add Room</span>
          </button>
        </div>
      </div>

      {displayedRooms.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center w-full min-h-[50vh] bg-white border border-surface-200 rounded-3xl shadow-xs">
          <Search
            size={48}
            strokeWidth={1.5}
            className="text-surface-300 mb-4"
          />
          <h1 className="text-xl font-serif text-surface-600 tracking-wide">
            No rooms found
          </h1>
          <p className="text-sm text-surface-400 mt-2 font-light">
            Try adjusting your filters or search query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
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
