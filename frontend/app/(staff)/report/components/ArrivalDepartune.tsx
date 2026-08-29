import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import {
  ChartNoAxesCombined,
  CheckCircle,
  UserCircle,
  Clock,
  Hash,
  BedDouble,
  ArrowDownRight,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { LOYALTY_TIER } from "../../../../lib/config/loyalty";
import type { MetaFunction } from "react-router";
import { motion } from "motion/react";

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
      statement: "Arriving Guest Group(s)",
      icon: ArrowDownRight,
      iconColor: "text-brand-600 bg-brand-50 border-brand-200",
    },
    {
      label: "Today Check-Out",
      value: todayCheckOut,
      statement: "Departing Guest Group(s)",
      icon: ArrowUpRight,
      iconColor: "text-surface-700 bg-surface-100 border-surface-300",
    },
    {
      label: "Net Room Differential",
      value: netDwellingChange >= 0 ? `+${netDwellingChange}` : `${netDwellingChange}`,
      statement: "Net Turnover Room(s)",
      icon: Sparkles,
      iconColor: "text-brand-700 bg-brand-100/60 border-brand-300",
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
            <ChartNoAxesCombined size={22} strokeWidth={1.75} />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-xl md:text-2xl font-serif text-surface-950 font-semibold tracking-tight">
              Today's Arrival & Departure Manifest
            </h2>
            <p className="text-xs md:text-sm text-surface-600 font-light leading-relaxed max-w-2xl">
              Comprehensive operational roster of all verified guest parties
              scheduled to check in or check out of resort accommodations today.
            </p>
            <span className="text-[11px] text-surface-500 font-mono mt-1">
              Generated: {new Date().toLocaleDateString("en-GB")} • TARUMT Live
              Audit
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs px-3.5 py-1.5 print:hidden bg-brand-50 text-brand-700 font-semibold border border-brand-200 rounded-full w-fit self-start shrink-0 shadow-2xs">
          <CheckCircle size={13} className="text-brand-600" />
          <span>Real-Time Feed</span>
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
              <th className="py-3.5 px-6">Movement</th>
              <th className="py-3.5 px-6">Guest Profile</th>
              <th className="py-3.5 px-6">Assigned Suite</th>
              <th className="py-3.5 px-6">Schedule Time</th>
              <th className="py-3.5 px-6">Confirmation Ref</th>
            </tr>
          </thead>

          {loading && (
            <tbody>
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
                    <span className="text-xs text-surface-500 font-medium">
                      Loading real-time manifest...
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          )}

          {!loading && todayArrival.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                    <span className="text-sm font-semibold text-surface-700">
                      No Scheduled Movements for Today
                    </span>
                    <span className="text-xs text-surface-500 font-light">
                      All arrivals and departures for the current calendar date
                      have been settled or none are scheduled.
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
                    className="border-b border-surface-100 last:border-0 hover:bg-brand-50/30 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border uppercase tracking-wider ${
                          isArrival
                            ? "text-brand-700 border-brand-200 bg-brand-50"
                            : "text-surface-700 bg-surface-100 border-surface-300"
                        }`}
                      >
                        {type}
                      </span>
                    </td>
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
                        <span className="text-sm font-medium text-surface-800 font-mono">
                          {booking.room?.roomId || "Unassigned"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-surface-600">
                        <Clock size={14} className="text-surface-400" />
                        <span className="text-xs font-mono">
                          {time
                            ? new Date(time).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
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
                );
              })}
            </tbody>
          )}
        </table>
      </div>
    </motion.div>
  );
}
