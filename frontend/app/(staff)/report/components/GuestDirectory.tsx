import type { MetaFunction } from "react-router";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import {
  Users,
  CheckCircle,
  UserCircle,
  CalendarDays,
  Hash,
  BedDouble,
} from "lucide-react";
import { LOYALTY_TIER } from "../../../../lib/config/loyalty";

export const meta: MetaFunction = () => [
  { title: "In-House Guest Directory | TARUMT Resorts" },
];

export default function GuestDirectory() {
  const [inHouseGuests, setInHouseGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:8081/api/report/guest-directory",
        );
        setInHouseGuests(response.data);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const { totalInHouse, roomsOccupied, departuresToday } = useMemo(() => {
    let departures = 0;
    const rooms = new Set();
    const today = new Date().toISOString().split("T")[0];

    inHouseGuests.forEach((booking) => {
      if (booking.room?.roomId) {
        rooms.add(booking.room.roomId);
      }
      if (booking.checkOutDate && booking.checkOutDate.startsWith(today)) {
        departures++;
      }
    });

    return {
      totalInHouse: inHouseGuests.length,
      roomsOccupied: rooms.size,
      departuresToday: departures,
    };
  }, [inHouseGuests]);

  const statCard = [
    {
      label: "Total In-House",
      value: totalInHouse,
      statement: "Group of Guest(s)",
    },
    {
      label: "Rooms Occupied",
      value: roomsOccupied,
      statement: "Room(s)",
    },
    {
      label: "Expected Departures",
      value: departuresToday,
      statement: "Checking out today",
    },
  ];

  return (
    <div className="flex flex-col flex-1 rounded-xl border border-surface-300 bg-surface-50">
      <div className="flex items-start justify-between p-4 md:p-6">
        <div className="flex items-start gap-3 md:gap-4">
          <div className="flex items-center justify-center min-w-10.5 min-h-10.5 bg-brand-50 text-brand-600 rounded-xl">
            <Users size={20} />
          </div>
          <div className="flex flex-col gap-1.5">
            <h2 className="text-base md:text-lg font-semibold leading-none">
              In-House Guest Directory
            </h2>
            <p className="text-xs md:text-sm text-surface-600 leading-tight mb-1.5 max-w-3/4">
              Generate a comprehensive directory of all guests currently staying
              at the resort, including their room numbers and reservation
              details.
            </p>
            <span className="text-[10px] md:text-xs text-surface-600 leading-tight">
              Generated On: {new Date().toLocaleDateString("en-GB")} at{" "}
              {new Date().toLocaleTimeString()} • TARUMT Resorts
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm print:hidden px-3 py-2 bg-emerald-100 text-emerald-700 font-semibold border leading-none border-emerald-400 rounded-xl">
          <CheckCircle size={14} />
          Generated
        </div>
      </div>
      <div className="grid grid-cols-3 border-t border-surface-300 border-b">
        {statCard.map((card, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 p-4 md:p-6 border-r last:border-0 border-surface-300"
          >
            <h4 className="text-sm md:text-base text-surface-600 leading-tight">
              {card.label}
            </h4>
            <p className="text-xl md:text-3xl font-bold text-surface-950 leading-tight">
              {card.value}
            </p>
            <span className="text-xs md:text-sm text-surface-600 leading-tight tracking-tighter">
              {card.statement}
            </span>
          </div>
        ))}
      </div>
      <table className="flex-1 relative">
        <thead>
          <tr className="text-surface-600 text-xs md:text-sm leading-none border-b border-surface-300">
            <th className="py-4 text-start px-6 font-normal tracking-wide">
              Guest Name
            </th>
            <th className="py-4 text-start px-6 font-normal tracking-wide">
              Room
            </th>
            <th className="py-4 text-start px-6 font-normal tracking-wide">
              Check-In Date
            </th>
            <th className="py-4 text-start px-6 font-normal tracking-wide">
              Check-Out Date
            </th>
            <th className="py-4 text-start px-6 font-normal tracking-wide">
              Confirmation No.
            </th>
          </tr>
        </thead>
        {loading && (
          <tbody>
            <tr>
              <td colSpan={5} className="h-80 text-center relative">
                <div className="absolute inset-0 flex flex-col gap-4 items-center justify-center opacity-60">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
                </div>
              </td>
            </tr>
          </tbody>
        )}
        {!loading && inHouseGuests.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan={5} className="h-80 text-center relative">
                <div className="absolute inset-0 flex flex-col gap-4 items-center justify-center opacity-60">
                  <span className="text-4xl text-surface-950 tracking-tighter">
                    {"ヽ(*。>Д<)o゜"}
                  </span>
                  <span className="text-base text-surface-600 tracking-wide">
                    No in-house guests found currently.
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {inHouseGuests.map((booking, index) => {
              return (
                <tr
                  key={index}
                  className="border-b border-surface-200 last:border-0 hover:bg-surface-100 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-surface-100 p-2 rounded-full text-surface-500">
                        <UserCircle size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-surface-950 font-semibold">
                          {booking.customer?.name}
                        </span>
                        <span
                          className={`text-[10px] font-medium tracking-wider uppercase ${
                            booking.customer?.loyaltyTier
                              ? (LOYALTY_TIER as any)[
                                  booking.customer.loyaltyTier
                                ]?.color || "text-brand-600"
                              : "text-surface-500"
                          }`}
                        >
                          {booking.customer?.loyaltyTier || "GUEST"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <BedDouble size={16} className="text-surface-400" />
                      <span className="text-sm font-medium text-surface-800">
                        {booking.room?.roomId || "Unassigned"}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-surface-600">
                      <CalendarDays size={14} className="opacity-70" />
                      <span className="text-sm">
                        {booking.checkInDate
                          ? new Date(booking.checkInDate).toLocaleDateString(
                              "en-GB",
                            )
                          : "-"}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-surface-600">
                      <CalendarDays size={14} className="opacity-70" />
                      <span className="text-sm">
                        {booking.checkOutDate
                          ? new Date(booking.checkOutDate).toLocaleDateString(
                              "en-GB",
                            )
                          : "-"}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Hash size={14} className="text-surface-400" />
                      <span className="text-sm text-surface-700 font-mono bg-surface-100 px-2 py-1 rounded-md border border-surface-200">
                        {booking.confirmationNo}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        )}
      </table>
    </div>
  );
}
