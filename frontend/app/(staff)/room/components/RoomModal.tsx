import { Plus, X, Edit, Bed } from "lucide-react";
import axios from "axios";
import { motion } from "motion/react";

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
      if (res.status === 200) {
        alert("Room created successfully");
        setIsModalOpen("");
        refreshData();
      }
    } catch (error: any) {
      console.log(error);
      alert(error.response?.data || "Error creating room");
    }
  };

  return (
    <div className="fixed inset-0 bg-surface-950/60 backdrop-blur-sm z-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-surface-200 flex flex-col gap-6"
      >
        <div className="flex items-center justify-between border-b border-surface-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-200">
              <Plus size={18} strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-lg font-serif font-semibold text-surface-950">
                Add New Suite
              </h2>
              <p className="text-xs text-surface-500">
                Register a new accommodation unit to resort inventory.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen("")}
            className="text-surface-400 hover:text-surface-700 p-1.5 rounded-lg hover:bg-surface-100 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="floor"
                className="text-xs font-semibold uppercase tracking-wider text-surface-700"
              >
                Floor Number
              </label>
              <input
                id="floor"
                name="floor"
                type="number"
                min={1}
                max={99}
                defaultValue={1}
                required
                className="px-4 py-2.5 rounded-xl border border-surface-300 text-sm focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="room_no"
                className="text-xs font-semibold uppercase tracking-wider text-surface-700"
              >
                Room Index No.
              </label>
              <input
                id="room_no"
                name="room_no"
                type="number"
                min={1}
                max={99}
                defaultValue={10}
                required
                className="px-4 py-2.5 rounded-xl border border-surface-300 text-sm focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="type"
              className="text-xs font-semibold uppercase tracking-wider text-surface-700"
            >
              Suite Category
            </label>
            <select
              id="type"
              name="type"
              required
              className="px-4 py-2.5 rounded-xl border border-surface-300 text-sm focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none bg-white cursor-pointer"
            >
              <option value="STANDARD">Standard Suite</option>
              <option value="DOUBLE">Double Ocean Deluxe</option>
              <option value="TWIN">Twin Garden Suite</option>
              <option value="DELUXE">Deluxe Villa</option>
              <option value="SUITES">Presidential Suite</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="capacity"
                className="text-xs font-semibold uppercase tracking-wider text-surface-700"
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
                className="px-4 py-2.5 rounded-xl border border-surface-300 text-sm focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="price"
                className="text-xs font-semibold uppercase tracking-wider text-surface-700"
              >
                Price Per Night
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500 text-xs font-mono font-bold">
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
                  className="pl-11 pr-4 py-2.5 rounded-xl border border-surface-300 text-sm focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none w-full font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 mt-2 border-t border-surface-100">
            <button
              type="button"
              onClick={() => setIsModalOpen("")}
              className="px-4 py-2 text-xs font-semibold text-surface-600 hover:text-surface-900 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-surface-950 hover:bg-brand-950 text-white text-xs font-semibold uppercase tracking-wider shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              Add Suite
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

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
    <div className="fixed inset-0 bg-surface-950/60 backdrop-blur-sm z-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-surface-200 flex flex-col gap-6"
      >
        <div className="flex items-center justify-between border-b border-surface-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-200">
              <Edit size={18} strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-lg font-serif font-semibold text-surface-950">
                Configure Suite {room?.roomId}
              </h2>
              <p className="text-xs text-surface-500">
                Update accommodation status, rate, and capacity.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen("")}
            className="text-surface-400 hover:text-surface-700 p-1.5 rounded-lg hover:bg-surface-100 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleEdit} className="flex flex-col gap-4">
          {/* Row 1: Floor & Room No */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="edit_floor"
                className="text-xs font-semibold uppercase tracking-wider text-surface-700"
              >
                Floor
              </label>
              <input
                id="edit_floor"
                name="floor"
                type="number"
                defaultValue={room?.roomId?.slice(0, -2) || 1}
                disabled
                className="px-4 py-2.5 rounded-xl border border-surface-200 bg-surface-100 text-sm text-surface-500 cursor-not-allowed outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="edit_room_no"
                className="text-xs font-semibold uppercase tracking-wider text-surface-700"
              >
                Room Index
              </label>
              <input
                id="edit_room_no"
                name="room_no"
                type="number"
                defaultValue={room?.roomId?.slice(-2) || 1}
                disabled
                className="px-4 py-2.5 rounded-xl border border-surface-200 bg-surface-100 text-sm text-surface-500 cursor-not-allowed outline-none"
              />
            </div>
          </div>

          {/* Row 2: Room Type & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="edit_type"
                className="text-xs font-semibold uppercase tracking-wider text-surface-700"
              >
                Suite Category
              </label>
              <select
                id="edit_type"
                name="type"
                defaultValue={room?.type || "STANDARD"}
                className="px-4 py-2.5 rounded-xl border border-surface-300 text-sm focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none bg-white cursor-pointer"
              >
                <option value="STANDARD">Standard Suite</option>
                <option value="DOUBLE">Double Ocean Deluxe</option>
                <option value="TWIN">Twin Garden Suite</option>
                <option value="DELUXE">Deluxe Villa</option>
                <option value="SUITES">Presidential Suite</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="edit_status"
                className="text-xs font-semibold uppercase tracking-wider text-surface-700"
              >
                Operational Status
              </label>
              <select
                id="edit_status"
                name="status"
                defaultValue={room?.status || "AVAILABLE"}
                className="px-4 py-2.5 rounded-xl border border-surface-300 text-sm focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none bg-white cursor-pointer"
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
                className="text-xs font-semibold uppercase tracking-wider text-surface-700"
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
                className="px-4 py-2.5 rounded-xl border border-surface-300 text-sm focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="edit_price"
                className="text-xs font-semibold uppercase tracking-wider text-surface-700"
              >
                Rate Per Night
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500 text-xs font-mono font-bold">
                  RM
                </span>
                <input
                  id="edit_price"
                  name="price"
                  type="number"
                  step="0.01"
                  min={0}
                  defaultValue={room?.pricePerNight}
                  className="pl-11 pr-4 py-2.5 rounded-xl border border-surface-300 text-sm focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none w-full font-mono"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 mt-2 border-t border-surface-100">
            <button
              type="button"
              onClick={() => setIsModalOpen("")}
              className="px-4 py-2 text-xs font-semibold text-surface-600 hover:text-surface-900 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-surface-950 hover:bg-brand-950 text-white text-xs font-semibold uppercase tracking-wider shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
