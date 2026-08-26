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
      className={`group flex flex-col relative p-5 bg-white border border-surface-200 rounded-3xl shadow-xs transition-all duration-300 ${status.card} ${
        room.booking
          ? "opacity-80 cursor-not-allowed"
          : "hover:-translate-y-1 hover:shadow-md cursor-pointer"
      }`}
    >
      <div className="flex items-start justify-between w-full">
        <div className="flex gap-4 items-center">
          <div
            className={`rounded-full w-12 h-12 flex items-center justify-center ${status.badge} border border-surface-100 shadow-sm`}
          >
            <Bed size={20} strokeWidth={1.5} />
          </div>
          <div className="flex flex-col items-start gap-0.5">
            <h1
              className={`transition-all duration-300 font-serif text-2xl leading-none tracking-wide ${status.text}`}
            >
              {room.roomId}
            </h1>
            <h2 className="text-surface-400 text-[10px] uppercase tracking-widest font-medium leading-tight">
              Floor {room.roomId.slice(0, -2)}
            </h2>
          </div>
        </div>
        <div
          className={`text-[9px] uppercase tracking-widest flex items-center gap-1.5 rounded-full px-3 py-1.5 leading-none border ${status.badge} font-semibold shadow-xs`}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.name}
        </div>
      </div>

      <div className="w-full h-px bg-surface-100 my-5" />

      <div className="flex flex-col gap-5 w-full">
        <div className="flex items-center justify-between text-xs gap-4 px-1">
          <span className="leading-none font-medium uppercase tracking-widest text-surface-600">
            {room.type}
          </span>
          <span className="text-surface-500 leading-none font-semibold flex items-center gap-1.5">
            <Users size={14} strokeWidth={1.5} />
            {room.capacity}
          </span>
        </div>

        {room.booking ? (
          <div className="flex text-sm px-4 bg-surface-50 border border-surface-100 rounded-2xl py-3 items-center justify-between gap-4">
            <span className="truncate max-w-1/2 font-medium leading-none text-surface-800">
              {room.booking.customerName}
            </span>
            <span className="text-surface-400 text-[10px] tracking-wider uppercase">
              Check Out: {formatMonthDate(room.booking.checkOutDate)}
            </span>
          </div>
        ) : (
          <div className="flex text-sm px-4 bg-surface-50 border border-surface-100 rounded-2xl py-3 items-center justify-between gap-4">
            <span className="text-surface-400 text-[10px] tracking-wider uppercase">
              Price Per Night
            </span>
            <span className="font-semibold leading-none text-surface-800">
              RM {room.pricePerNight.toFixed(2)}
            </span>
          </div>
        )}
      </div>
    </button>
  );
}
