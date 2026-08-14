import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import {
  ChartNoAxesCombined,
  CheckCircle,
  UserCircle,
  Clock,
  Hash,
  BedDouble,
} from "lucide-react";
import { LOYALTY_TIER } from "../../../../lib/config/loyalty";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
  { title: "Today's Arrival & Departure List | TARUMT Resorts" },
];

export default function ArrivalDeparture() {
  const [todayArrival, setTodayArrival] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:8081/api/report/arrival-departure",
        );
        setTodayArrival(response.data);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const { todayCheckIn, todayCheckOut, netDwellingChange } = useMemo(() => {
    let checkIn = 0;
    let checkOut = 0;

    const today = new Date().toISOString().split("T")[0];
    todayArrival.forEach((booking) => {
      if (booking.checkInDate && booking.checkInDate.startsWith(today))
        checkIn++;
      if (booking.checkOutDate && booking.checkOutDate.startsWith(today))
        checkOut++;
    });
    return {
      todayCheckIn: checkIn,
      todayCheckOut: checkOut,
      netDwellingChange: checkIn - checkOut,
    };
  }, [todayArrival]);

  const statCard = [
    {
      label: "Today Check-In",
      value: todayCheckIn,
      statement: "Group of Guest(s)",
    },
    {
      label: "Today Check-Out",
      value: todayCheckOut,
      statement: "Group of Guest(s)",
    },
    {
      label: "Net Dwelling Changes",
      value: netDwellingChange,
      statement: "Room(s)",
    },
  ];
  return (
    <div className="flex flex-col flex-1 rounded-xl border border-surface-300 bg-surface-50">
      <div className="flex items-start justify-between p-4 md:p-6">
        <div className="flex items-start gap-3 md:gap-4">
          <div className="flex items-center justify-center min-w-10.5 min-h-10.5 bg-brand-50 text-brand-600 rounded-xl">
            <ChartNoAxesCombined size={20} />
          </div>
          <div className="flex flex-col gap-1.5">
            <h2 className="text-base md:text-lg font-semibold leading-none">
              Today's Arrival & Departure List
            </h2>
            <p className="text-xs md:text-sm text-surface-600 leading-tight mb-1.5 max-w-3/4">
              Generate a comprehensive list of all guests scheduled to arrive at
              or depart from the resort on the current date.
            </p>
            <span className="text-[10px] md:text-xs text-surface-600 leading-tight">
              Generated On: {new Date().toLocaleDateString("en-GB")} at{" "}
              {new Date().toLocaleTimeString()} • TARUMT Resorts
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm px-3 py-2 print:hidden bg-emerald-100 text-emerald-700 font-semibold border leading-none border-emerald-400 rounded-xl">
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
              Status
            </th>
            <th className="py-4 text-start px-6 font-normal tracking-wide">
              Guest
            </th>
            <th className="py-4 text-start px-6 font-normal tracking-wide">
              Room
            </th>
            <th className="py-4 text-start px-6 font-normal tracking-wide">
              Time
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
        {todayArrival.length === 0 && !loading ? (
          <tbody>
            <tr>
              <td colSpan={5} className="h-80 text-center relative">
                <div className="absolute inset-0 flex flex-col gap-4 items-center justify-center opacity-60">
                  <span className="text-4xl text-surface-950 tracking-tighter">
                    {"ヽ(*。>Д<)o゜"}
                  </span>
                  <span className="text-base text-surface-600 tracking-wide">
                    No Bookings for Today's Arrivals & Departures.
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {todayArrival.map((booking, index) => {
              const today = new Date().toISOString().split("T")[0];
              const isArrival =
                booking.checkInDate?.split("T")[0] === today ||
                booking.checkInDate?.split(" ")[0] === today;
              const type = isArrival ? "Arrival" : "Departure";
              const time = isArrival
                ? booking.checkInDate
                : booking.checkOutDate;

              return (
                <tr
                  key={index}
                  className="border-b border-surface-200 last:border-0 hover:bg-surface-100 transition-colors"
                >
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-1 rounded-xl text-[10px] font-medium border uppercase tracking-wider ${
                        isArrival
                          ? "text-brand-600 border-brand-300 bg-brand-50"
                          : "text-amber-600 bg-amber-50 border-amber-300"
                      }`}
                    >
                      {type}
                    </span>
                  </td>
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
                                ]?.color || "text-surface-500"
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
                      <Clock size={14} className="opacity-70" />
                      <span className="text-sm">
                        {new Date(time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
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
