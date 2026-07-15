import { Plus, X } from "lucide-react";
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
    <div className="fixed inset-0 bg-surface-950/40 backdrop-blur-sm z-100 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <button
        onClick={() => setIsModalOpen("")}
        className="absolute inset-0 z-50 cursor-pointer"
      ></button>

      <div className="z-150 bg-surface-50 shadow-xl rounded-lg flex flex-col gap-6 p-6 w-full max-w-md border border-surface-200 transform animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-surface-300">
          <h1 className="font-semibold text-surface-900 flex items-center gap-4 text-xl">
            <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
              <Plus size={20} />
            </div>
            Add New Room
          </h1>
          <button
            onClick={() => setIsModalOpen("")}
            className="cursor-pointer p-2 rounded-full text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="floor"
                className="text-sm text-surface-700 font-medium"
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
                className="outline-none text-surface-800 placeholder:text-surface-500 hover:border-surface-500 focus-within:border-brand-600 focus-within:shadow-sm focus-within:ring-1 focus-within:ring-brand-600/20 focus-within:scale-102 transition-all duration-300 border px-4 border-surface-400 p-2.5 items-center rounded-lg bg-surface-100 focus:bg-surface-50 focus-within:bg-surface-50 shadow-xs w-full"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="room_no"
                className="text-sm text-surface-700 font-medium"
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
                className="outline-none text-surface-800 placeholder:text-surface-500 hover:border-surface-500 focus-within:border-brand-600 focus-within:shadow-sm focus-within:ring-1 focus-within:ring-brand-600/20 focus-within:scale-102 transition-all duration-300 border px-4 border-surface-400 p-2.5 items-center rounded-lg bg-surface-100 focus:bg-surface-50 focus-within:bg-surface-50 shadow-xs w-full"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="type"
              className="text-sm text-surface-700 font-medium"
            >
              Room Type
            </label>
            <select
              id="type"
              name="type"
              required
              className="outline-none text-surface-800 hover:border-surface-500 focus-within:border-brand-600 focus-within:shadow-sm focus-within:ring-1 focus-within:ring-brand-600/20 focus-within:scale-102 transition-all duration-300 border px-4 border-surface-400 p-2.5 items-center rounded-lg bg-surface-100 focus:bg-surface-50 focus-within:bg-surface-50 shadow-xs w-full cursor-pointer appearance-none"
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

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="capacity"
                className="text-sm text-surface-700 font-medium"
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
                className="outline-none text-surface-800 placeholder:text-surface-500 hover:border-surface-500 focus-within:border-brand-600 focus-within:shadow-sm focus-within:ring-1 focus-within:ring-brand-600/20 focus-within:scale-102 transition-all duration-300 border px-4 border-surface-400 p-2.5 items-center rounded-lg bg-surface-100 focus:bg-surface-50 focus-within:bg-surface-50 shadow-xs w-full"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="price"
                className="text-sm text-surface-700 font-medium"
              >
                Price Per Night
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 z-100 -translate-y-1/2 text-surface-600 text-sm font-medium">
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
                  className="outline-none text-surface-800 placeholder:text-surface-500 hover:border-surface-500 focus-within:border-brand-600 focus-within:shadow-sm focus-within:ring-1 focus-within:ring-brand-600/20 focus-within:scale-102 transition-all duration-300 border pl-[2.8rem] pr-4 border-surface-400 p-2.5 items-center rounded-lg bg-surface-100 focus:bg-surface-50 focus-within:bg-surface-50 shadow-xs w-full"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 mt-2 border-t border-surface-200">
            <button
              type="button"
              onClick={() => setIsModalOpen("")}
              className="px-5 py-2.5 text-sm font-medium text-surface-700 hover:text-surface-900 hover:bg-surface-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 shadow-sm hover:shadow active:scale-95 rounded-lg transition-all cursor-pointer"
            >
              Add Room
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
    <div className="fixed inset-0 bg-surface-950/40 backdrop-blur-sm z-100 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <button
        onClick={() => setIsModalOpen("")}
        className="absolute inset-0 z-50 cursor-pointer"
      ></button>

      <div className="z-150 bg-surface-50 shadow-xl rounded-lg flex flex-col gap-6 p-6 w-full max-w-md border border-surface-200 transform animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-surface-300">
          <h1 className="font-semibold text-surface-900 flex items-center gap-4 text-xl">
            <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
              <Edit size={20} />
            </div>
            Edit Room
          </h1>
          <button
            onClick={() => setIsModalOpen("")}
            className="cursor-pointer p-2 rounded-full text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleEdit} className="flex flex-col gap-5">
          {/* Row 1: Floor & Room No */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="edit_floor"
                className="text-sm text-surface-700 font-medium"
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
                className="outline-none text-surface-800 disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-surface-500 hover:border-surface-500 focus-within:border-brand-600 focus-within:shadow-sm focus-within:ring-1 focus-within:ring-brand-600/20 focus-within:scale-102 transition-all duration-300 border px-4 border-surface-400 p-2.5 items-center rounded-lg bg-surface-100 focus:bg-surface-50 focus-within:bg-surface-50 shadow-xs w-full"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="edit_room_no"
                className="text-sm text-surface-700 font-medium"
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
                className="outline-none text-surface-800 disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-surface-500 hover:border-surface-500 focus-within:border-brand-600 focus-within:shadow-sm focus-within:ring-1 focus-within:ring-brand-600/20 focus-within:scale-102 transition-all duration-300 border px-4 border-surface-400 p-2.5 items-center rounded-lg bg-surface-100 focus:bg-surface-50 focus-within:bg-surface-50 shadow-xs w-full"
              />
            </div>
          </div>

          {/* Row 2: Room Type & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="edit_type"
                className="text-sm text-surface-700 font-medium"
              >
                Room Type
              </label>
              <select
                id="edit_type"
                name="type"
                defaultValue={room?.type || "STANDARD"}
                className="outline-none text-surface-800 hover:border-surface-500 focus-within:border-brand-600 focus-within:shadow-sm focus-within:ring-1 focus-within:ring-brand-600/20 focus-within:scale-102 transition-all duration-300 border px-4 border-surface-400 p-2.5 items-center rounded-lg bg-surface-100 focus:bg-surface-50 focus-within:bg-surface-50 shadow-xs w-full cursor-pointer appearance-none"
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

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="edit_status"
                className="text-sm text-surface-700 font-medium"
              >
                Status
              </label>
              <select
                id="edit_status"
                name="status"
                defaultValue={room?.status || "AVAILABLE"}
                className="outline-none text-surface-800 hover:border-surface-500 focus-within:border-brand-600 focus-within:shadow-sm focus-within:ring-1 focus-within:ring-brand-600/20 focus-within:scale-102 transition-all duration-300 border px-4 border-surface-400 p-2.5 items-center rounded-lg bg-surface-100 focus:bg-surface-50 focus-within:bg-surface-50 shadow-xs w-full cursor-pointer appearance-none"
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
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="edit_capacity"
                className="text-sm text-surface-700 font-medium"
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
                className="outline-none text-surface-800 placeholder:text-surface-500 hover:border-surface-500 focus-within:border-brand-600 focus-within:shadow-sm focus-within:ring-1 focus-within:ring-brand-600/20 focus-within:scale-102 transition-all duration-300 border px-4 border-surface-400 p-2.5 items-center rounded-lg bg-surface-100 focus:bg-surface-50 focus-within:bg-surface-50 shadow-xs w-full"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="edit_price"
                className="text-sm text-surface-700 font-medium"
              >
                Price Per Night
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 z-100 -translate-y-1/2 text-surface-600 text-sm font-medium">
                  RM
                </span>
                <input
                  id="edit_price"
                  name="price"
                  type="number"
                  step="0.01"
                  min={0}
                  defaultValue={room?.pricePerNight}
                  className="outline-none text-surface-800 placeholder:text-surface-500 hover:border-surface-500 focus-within:border-brand-600 focus-within:shadow-sm focus-within:ring-1 focus-within:ring-brand-600/20 focus-within:scale-102 transition-all duration-300 border pl-[2.8rem] pr-4 border-surface-400 p-2.5 items-center rounded-lg bg-surface-100 focus:bg-surface-50 focus-within:bg-surface-50 shadow-xs w-full"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 mt-2 border-t border-surface-300">
            <button
              type="button"
              onClick={() => setIsModalOpen("")}
              className="px-5 py-2.5 text-sm font-medium text-surface-700 hover:text-surface-900 hover:bg-surface-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 shadow-sm hover:shadow active:scale-95 rounded-lg transition-all cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
