import { Bed, Users } from "lucide-react";
import { formatMonthDate } from "../../../../lib/util/date";
import { ROOM_STATUS } from "../../../../lib/config/status";

export type RoomProps = {
  roomId: string;
  type: string;
  status: string;
  capacity: number;
  pricePerNight: number;
  createdAt: string;
  updatedAt: string;
  booking?: {
    bookingId: number;
    checkOutDate: string;
    status: string;
    customerName: string;
  };
};

export default function RoomCard({
  room,
  canEdit = true,
  setIsModalOpen,
}: {
  room: RoomProps;
  canEdit?: boolean;
  setIsModalOpen: (val: string) => void;
}) {
  const statusKey = (room.status?.toUpperCase() || "AVAILABLE") as keyof typeof ROOM_STATUS;
  const status = ROOM_STATUS[statusKey] || ROOM_STATUS.AVAILABLE;
  
  // Allow editing CHECKED_IN rooms to change status, disable only if booking exists AND status is not CHECKED_IN, or if user cannot edit
  const isEditDisabled = !canEdit || (!!room.booking && room.status !== "CHECKED_IN" && room.status !== "RESERVED");

  return (
    <button
      type="button"
      onClick={() => canEdit && setIsModalOpen("edit")}
      disabled={isEditDisabled}
      className={`group flex flex-col relative p-5 bg-white border border-surface-200 rounded-3xl shadow-xs transition-all duration-300 text-left ${status.card} ${
        isEditDisabled
          ? "opacity-85 cursor-default"
          : "hover:-translate-y-1 hover:shadow-md cursor-pointer hover:border-brand-400"
      }`}
    >
      {/* Card Header: Icon, Room ID, Status Pill */}
      <div className="flex items-start justify-between w-full gap-2">
        <div className="flex gap-3.5 items-center">
          <div
            className={`rounded-2xl w-11 h-11 flex items-center justify-center ${status.badge} border shadow-2xs shrink-0`}
          >
            <Bed size={18} strokeWidth={1.75} />
          </div>
          <div className="flex flex-col items-start">
            <h3
              className={`transition-colors font-serif text-2xl font-bold leading-tight tracking-tight text-surface-950 ${status.text}`}
            >
              Suite {room.roomId}
            </h3>
            <span className="text-surface-500 text-[10px] uppercase tracking-widest font-medium">
              Floor {room.roomId.slice(0, -2) || "1"}
            </span>
          </div>
        </div>

        <div
          className={`text-[10px] uppercase tracking-wider flex items-center gap-1.5 rounded-full px-2.5 py-1 border ${status.badge} font-semibold shrink-0`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.name}
        </div>
      </div>

      <div className="w-full h-px bg-surface-100 my-4" />

      {/* Card Body: Type, Capacity, Pricing / Booking Info */}
      <div className="flex flex-col gap-3.5 w-full">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-semibold uppercase tracking-wider text-surface-700">
            {room.type}
          </span>
          <span className="text-surface-500 font-medium flex items-center gap-1.5">
            <Users size={13} strokeWidth={1.75} className="text-surface-400" />
            <span>{room.capacity} Pax</span>
          </span>
        </div>

        {room.booking ? (
          <div className="flex text-xs px-3.5 py-2.5 bg-surface-50 border border-surface-200 rounded-2xl items-center justify-between gap-3">
            <span className="truncate font-semibold text-surface-900">
              {room.booking.customerName}
            </span>
            <span className="text-surface-500 text-[10px] tracking-wider uppercase shrink-0 font-mono">
              Due {formatMonthDate(room.booking.checkOutDate)}
            </span>
          </div>
        ) : (
          <div className="flex text-xs px-3.5 py-2.5 bg-surface-50 border border-surface-200 rounded-2xl items-center justify-between gap-3">
            <span className="text-surface-500 text-[10px] tracking-wider uppercase font-medium">
              Rate / Night
            </span>
            <span className="font-bold font-mono text-surface-950">
              RM {room.pricePerNight.toFixed(2)}
            </span>
          </div>
        )}
      </div>
    </button>
  );
}
