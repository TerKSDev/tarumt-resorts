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
  setIsModalOpen,
}: {
  room: RoomProps;
  setIsModalOpen: (val: string) => void;
}) {
  const status =
    ROOM_STATUS[room.status.toUpperCase() as keyof typeof ROOM_STATUS];

  return (
    <button
      onClick={() => setIsModalOpen("edit")}
      disabled={!!room.booking}
      className={`group flex flex-col relative p-4 bg-surface-50 border border-surface-400 rounded-lg shadow-xs transition-all duration-300 ${status.card} ${
        room.booking
          ? "opacity-75 cursor-not-allowed"
          : "hover:-translate-y-0.5 cursor-pointer"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-3 items-center">
          <div
            className={`rounded-lg w-10 h-10 flex items-center justify-center ${status.badge}`}
          >
            <Bed size={20} />
          </div>
          <div className="flex flex-col items-start gap-1">
            <h1
              className={`transition-all duration-300 font-medium text-lg leading-none ${status.text}`}
            >
              {room.roomId}
            </h1>
            <h2 className="text-surface-600 text-xs leading-tight">
              Floor {room.roomId.slice(0, -2)}
            </h2>
          </div>
        </div>
        <div
          className={`text-[10px] flex items-center gap-1.5 rounded-full px-2.5 py-1 leading-none border ${status.badge} font-semibold`}
        >
          <div className={`w-1 h-1 rounded-full ${status.dot}`} />
          {status.name}
        </div>
      </div>

      <div className="w-full h-px bg-surface-300 my-4 mb-3" />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between text-xs gap-4">
          <span className="leading-none font-medium capitalize">
            {room.type.toLowerCase()}
          </span>
          <span className="text-surface-600 leading-none font-semibold flex items-center gap-1.5">
            <Users size={12} />
            {room.capacity}
          </span>
        </div>

        {room.booking ? (
          <div className="flex text-sm px-3 bg-surface-100 border border-surface-300 rounded-lg py-2.5 items-center justify-between gap-4">
            <span className="truncate max-w-1/2 font-medium leading-none">
              {room.booking.customerName}
            </span>
            <span className="text-surface-600 text-xs tracking-tight">
              Check Out: {formatMonthDate(room.booking.checkOutDate)}
            </span>
          </div>
        ) : (
          <div className="flex text-sm px-3 bg-surface-100 border border-surface-300 rounded-lg py-2.5 items-center justify-between gap-4">
            <span className="text-surface-600 text-xs tracking-tight">
              Price Per Night
            </span>
            <span className="font-semibold leading-none">
              RM {room.pricePerNight.toFixed(2)}
            </span>
          </div>
        )}
      </div>
    </button>
  );
}
