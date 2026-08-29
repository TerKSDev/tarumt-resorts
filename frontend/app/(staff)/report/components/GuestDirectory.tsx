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
  Home,
  LogOut,
  Sparkles,
} from "lucide-react";
import { LOYALTY_TIER } from "../../../../lib/config/loyalty";
import { motion } from "motion/react";

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
      label: "Total In-House Parties",
      value: totalInHouse,
      statement: "Currently Registered Guests",
      icon: Users,
      iconColor: "text-brand-600 bg-brand-50 border-brand-200",
    },
    {
      label: "Suites Occupied",
      value: roomsOccupied,
      statement: "Active Room Keys Issued",
      icon: Home,
      iconColor: "text-brand-700 bg-brand-100/60 border-brand-300",
    },
    {
      label: "Departures Scheduled",
      value: departuresToday,
      statement: "Checking Out Today",
      icon: LogOut,
      iconColor: "text-surface-700 bg-surface-100 border-surface-300",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col flex-1 rounded-3xl border border-surface-200 bg-white shadow-md overflow-hidden"
    >
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between p-6 md:p-8 gap-4 bg-surface-50 border-b border-surface-200">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-brand-900 text-brand-300 rounded-2xl border border-brand-800 shadow-sm shrink-0">
            <Users size={22} strokeWidth={1.75} />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-xl md:text-2xl font-serif text-surface-950 font-semibold tracking-tight">
              In-House Guest Directory Manifest
            </h2>
            <p className="text-xs md:text-sm text-surface-600 font-light leading-relaxed max-w-2xl">
              Live census of all guests actively occupying suites within TARUMT
              Resorts, including room assignments, arrival dates, and stay
              duration.
            </p>
            <span className="text-[11px] text-surface-500 font-mono mt-1">
              Generated: {new Date().toLocaleDateString("en-GB")} • Front Desk
              Audit
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs px-3.5 py-1.5 print:hidden bg-brand-50 text-brand-700 font-semibold border border-brand-200 rounded-full w-fit self-start shrink-0 shadow-2xs">
          <CheckCircle size={13} className="text-brand-600" />
          <span>Active Registry</span>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-surface-200 divide-y sm:divide-y-0 sm:divide-x divide-surface-200 bg-white">
        {statCard.map((card, index) => (
          <div key={index} className="flex flex-col gap-2 p-5 md:p-6 justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
                {card.label}
              </span>
              <div
                className={`w-7 h-7 rounded-lg border flex items-center justify-center ${card.iconColor}`}
              >
                <card.icon size={15} strokeWidth={1.75} />
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold font-mono text-surface-950 mt-1">
              {card.value}
            </p>
            <span className="text-xs text-surface-500 font-light">
              {card.statement}
            </span>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-surface-600 text-xs font-semibold uppercase tracking-wider bg-surface-100/60 border-b border-surface-200">
              <th className="py-3.5 px-6">Guest Identification</th>
              <th className="py-3.5 px-6">Suite Number</th>
              <th className="py-3.5 px-6">Check-In Date</th>
              <th className="py-3.5 px-6">Scheduled Departure</th>
              <th className="py-3.5 px-6">Folio / Confirmation</th>
            </tr>
          </thead>

          {loading && (
            <tbody>
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
                    <span className="text-xs text-surface-500 font-medium">
                      Loading guest directory...
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          )}

          {!loading && inHouseGuests.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                    <span className="text-sm font-semibold text-surface-700">
                      No In-House Guests Recorded
                    </span>
                    <span className="text-xs text-surface-500 font-light">
                      There are currently no active in-house reservations listed
                      in the resort database.
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {inHouseGuests.map((booking, index) => (
                <tr
                  key={index}
                  className="border-b border-surface-100 last:border-0 hover:bg-brand-50/30 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 border border-brand-200 flex items-center justify-center text-brand-700 shrink-0">
                        <UserCircle size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-surface-950 font-semibold leading-tight">
                          {booking.customer?.name}
                        </span>
                        <span
                          className={`text-[10px] font-semibold tracking-wider uppercase mt-0.5 ${
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
                      <span className="text-sm font-semibold text-surface-900 font-mono">
                        {booking.room?.roomId || "Unassigned"}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-surface-600">
                      <CalendarDays size={14} className="text-surface-400" />
                      <span className="text-xs font-mono">
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
                      <CalendarDays size={14} className="text-surface-400" />
                      <span className="text-xs font-mono">
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
                      <span className="text-xs text-surface-800 font-mono bg-surface-100 px-2.5 py-1 rounded-md border border-surface-200 font-medium">
                        {booking.confirmationNo}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </motion.div>
  );
}
