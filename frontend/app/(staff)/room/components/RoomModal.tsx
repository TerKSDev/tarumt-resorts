import { X } from "lucide-react";
import axios from "axios";

export function AddRoomModal({
  setIsModalOpen,
  refreshData,
}: {
  setIsModalOpen: (isModalOpen: string) => void;
  refreshData: () => void;
}) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const floor = formData.get("floor") as string;
    const roomNo = formData.get("room_no") as string;
    const type = formData.get("type") as string;
    const capacity = formData.get("capacity") as string;
    const pricePerNight = formData.get("price") as string;

    if (!floor || !roomNo || !type || !capacity || !pricePerNight) {
      alert("All fields are required");
      return;
    }

    const paddedRoomNo = roomNo.padStart(2, "0");
    const roomId = floor.concat(paddedRoomNo);

    const room = {
      roomId,
      type,
      capacity: Number(capacity),
      pricePerNight: Number(pricePerNight),
      status: "AVAILABLE",
    };

    try {
      const res = await axios.post(
        "http://localhost:8081/api/room/create",
        room,
      );
      console.log(res.status);
      if (res.status == 200) {
        alert("Room created successfully");
        setIsModalOpen("");
        refreshData();
      }
      console.log(res.data);
    } catch (error: any) {
      console.log(error);
      alert(error.response?.data || "Error creating room");
    }
  };

  return (
    <div className="fixed inset-0 bg-surface-950/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <button
        onClick={() => setIsModalOpen("")}
        className="absolute inset-0 z-[50] cursor-pointer"
      ></button>

      <div className="z-[150] bg-white shadow-2xl rounded-3xl flex flex-col gap-8 p-8 w-full max-w-lg border border-surface-200 transform animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-3xl text-surface-900 tracking-tight">
            New Room
          </h1>
          <button
            onClick={() => setIsModalOpen("")}
            className="cursor-pointer p-2 rounded-full text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-colors"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="floor"
                className="text-xs font-semibold text-surface-500 uppercase tracking-widest pl-1"
              >
                Floor
              </label>
              <input
                id="floor"
                name="floor"
                type="number"
                min={1}
                max={99}
                defaultValue={1}
                required
                className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-surface-900 transition-all text-surface-900"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="room_no"
                className="text-xs font-semibold text-surface-500 uppercase tracking-widest pl-1"
              >
                Room No.
              </label>
              <input
                id="room_no"
                name="room_no"
                type="number"
                min={1}
                max={99}
                defaultValue={10}
                required
                className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-surface-900 transition-all text-surface-900"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="type"
              className="text-xs font-semibold text-surface-500 uppercase tracking-widest pl-1"
            >
              Room Type
            </label>
            <select
              id="type"
              name="type"
              required
              className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-surface-900 transition-all text-surface-900 appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 1rem center",
              }}
            >
              <option value="STANDARD">Standard</option>
              <option value="DOUBLE">Double</option>
              <option value="TWIN">Twin</option>
              <option value="DELUXE">Deluxe</option>
              <option value="SUITES">Suites</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="capacity"
                className="text-xs font-semibold text-surface-500 uppercase tracking-widest pl-1"
              >
                Capacity (Pax)
              </label>
              <input
                id="capacity"
                name="capacity"
                type="number"
                min={1}
                max={10}
                defaultValue={2}
                required
                className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-surface-900 transition-all text-surface-900"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="price"
                className="text-xs font-semibold text-surface-500 uppercase tracking-widest pl-1"
              >
                Price Per Night
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500 font-medium text-sm">
                  RM
                </span>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min={0}
                  placeholder="0.00"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-surface-900 transition-all text-surface-900"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 mt-2 border-t border-surface-100">
            <button
              type="submit"
              className="w-full py-4 bg-surface-900 text-white rounded-xl font-medium tracking-wide hover:bg-surface-800 hover:-translate-y-0.5 transition-all shadow-lg hover:shadow-xl"
            >
              Create Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { Edit } from "lucide-react";

export function EditRoomModal({
  setIsModalOpen,
  room,
  refreshData,
}: {
  setIsModalOpen: (isModalOpen: string) => void;
  room: any;
  refreshData: () => void;
}) {
  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const type = formData.get("type") as string;
    const capacity = formData.get("capacity") as string;
    const pricePerNight = formData.get("price") as string;
    const status = formData.get("status") as string;

    const updatedRoom = {
      roomId: room.roomId,
      type,
      capacity: Number(capacity),
      pricePerNight: Number(pricePerNight),
      status,
    };

    try {
      const res = await axios.put(
        "http://localhost:8081/api/room/update",
        updatedRoom,
      );
      if (res.status === 200) {
        alert("Room updated successfully");
        setIsModalOpen("");
        refreshData();
      }
    } catch (error: any) {
      console.log(error);
      alert(error.response?.data || "Error updating room");
    }
  };

  return (
    <div className="fixed inset-0 bg-surface-950/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <button
        onClick={() => setIsModalOpen("")}
        className="absolute inset-0 z-[50] cursor-pointer"
      ></button>

      <div className="z-[150] bg-white shadow-2xl rounded-3xl flex flex-col gap-8 p-8 w-full max-w-lg border border-surface-200 transform animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-3xl text-surface-900 tracking-tight">
            Edit Room
          </h1>
          <button
            onClick={() => setIsModalOpen("")}
            className="cursor-pointer p-2 rounded-full text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-colors"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleEdit} className="flex flex-col gap-6">
          {/* Row 1: Floor & Room No */}
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="edit_floor"
                className="text-xs font-semibold text-surface-500 uppercase tracking-widest pl-1"
              >
                Floor
              </label>
              <input
                id="edit_floor"
                name="floor"
                type="number"
                min={1}
                max={99}
                defaultValue={room?.roomId?.slice(0, -2) || 1}
                disabled
                className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-surface-900 transition-all text-surface-900 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="edit_room_no"
                className="text-xs font-semibold text-surface-500 uppercase tracking-widest pl-1"
              >
                Room No.
              </label>
              <input
                id="edit_room_no"
                name="room_no"
                type="number"
                min={1}
                max={99}
                defaultValue={room?.roomId?.slice(-2) || 1}
                disabled
                className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-surface-900 transition-all text-surface-900 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Row 2: Room Type & Status */}
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="edit_type"
                className="text-xs font-semibold text-surface-500 uppercase tracking-widest pl-1"
              >
                Room Type
              </label>
              <select
                id="edit_type"
                name="type"
                defaultValue={room?.type || "STANDARD"}
                className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-surface-900 transition-all text-surface-900 appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                }}
              >
                <option value="STANDARD">Standard</option>
                <option value="DOUBLE">Double</option>
                <option value="TWIN">Twin</option>
                <option value="DELUXE">Deluxe</option>
                <option value="SUITES">Suites</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="edit_status"
                className="text-xs font-semibold text-surface-500 uppercase tracking-widest pl-1"
              >
                Status
              </label>
              <select
                id="edit_status"
                name="status"
                defaultValue={room?.status || "AVAILABLE"}
                className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-surface-900 transition-all text-surface-900 appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                }}
              >
                <option value="AVAILABLE">Available</option>
                <option value="RESERVED">Reserved</option>
                <option value="CHECKED_IN">Checked In</option>
                <option value="CLEANING">Cleaning</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="CHECKED_OUT">Checked Out</option>
              </select>
            </div>
          </div>

          {/* Row 3: Capacity & Price */}
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="edit_capacity"
                className="text-xs font-semibold text-surface-500 uppercase tracking-widest pl-1"
              >
                Capacity (Pax)
              </label>
              <input
                id="edit_capacity"
                name="capacity"
                type="number"
                min={1}
                max={10}
                defaultValue={room?.capacity || 2}
                className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-surface-900 transition-all text-surface-900"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="edit_price"
                className="text-xs font-semibold text-surface-500 uppercase tracking-widest pl-1"
              >
                Price Per Night
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500 text-sm font-medium">
                  RM
                </span>
                <input
                  id="edit_price"
                  name="price"
                  type="number"
                  step="0.01"
                  min={0}
                  defaultValue={room?.pricePerNight}
                  className="w-full pl-12 pr-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-surface-900 transition-all text-surface-900"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 mt-2 border-t border-surface-100">
            <button
              type="submit"
              className="w-full py-4 bg-surface-900 text-white rounded-xl font-medium tracking-wide hover:bg-surface-800 hover:-translate-y-0.5 transition-all shadow-lg hover:shadow-xl"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
