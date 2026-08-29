import axios from "axios";
import { useEffect, useState } from "react";
import {
  Footprints,
  CheckCircle,
  Clock,
  Hash,
  BedDouble,
  Sparkles,
  TrendingUp,
  CreditCard,
} from "lucide-react";
import { LOYALTY_TIER } from "../../../../lib/config/loyalty";
import type { MetaFunction } from "react-router";
import { Card, CardHeader } from "../../../../components/Card";

export const meta: MetaFunction = () => [
  { title: "Daily Walk-In Registration Summary | TARUMT Resorts" },
];

export default function WalkInSummary() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:8081/api/report/walkin-summary",
        );
        setSummary(response.data);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const walkIns: any[] = summary?.walkIns ?? [];

  return (
    <Card>
      <CardHeader
        title="Daily Walk-In Guest Registration Manifest"
        subtitle="Real-time audit log of same-day walk-in guest arrivals, instant suite assignments, and revenue captures."
        icon={Footprints}
        action={
          <div className="flex items-center gap-2 text-xs px-3.5 py-1.5 print:hidden bg-brand-50 text-brand-700 font-semibold border border-brand-200 rounded-full shadow-2xs">
            <Sparkles size={13} className="text-brand-600" />
            <span>Walk-In Manifest</span>
          </div>
        }
      />

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-surface-100 border-b border-surface-100 bg-surface-50/30">
        <div className="flex flex-col gap-2 p-6 justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Total Walk-Ins Today
            </span>
            <div className="w-8 h-8 rounded-xl border border-surface-200 flex items-center justify-center text-surface-700 bg-surface-100">
              <Footprints size={16} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-mono text-surface-950 mt-1">
            {summary?.totalRegistrations ?? 0} <span className="text-xs font-normal text-surface-500">Arrivals</span>
          </p>
          <span className="text-xs text-surface-500 font-light">Direct desk walk-in check-ins</span>
        </div>

        <div className="flex flex-col gap-2 p-6 justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Captured Revenue
            </span>
            <div className="w-8 h-8 rounded-xl border border-brand-200 flex items-center justify-center text-brand-700 bg-brand-50">
              <TrendingUp size={16} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-mono text-surface-950 mt-1">
            RM {Number(summary?.totalRevenue ?? 0).toFixed(2)}
          </p>
          <span className="text-xs text-surface-500 font-light">Gross walk-in folio balance</span>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="text-surface-600 uppercase tracking-wider font-semibold bg-surface-100/70 border-b border-surface-200">
              <th className="py-3.5 px-6">Guest Identification</th>
              <th className="py-3.5 px-6">Assigned Suite</th>
              <th className="py-3.5 px-6">Registered At</th>
              <th className="py-3.5 px-6">Confirmation Ref</th>
              <th className="py-3.5 px-6 text-right">Folio Total</th>
            </tr>
          </thead>
          {loading ? (
            <tbody>
              <tr>
                <td colSpan={5} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-brand-600" />
                    <span className="text-xs text-surface-500 font-medium">Fetching walk-in manifest...</span>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : walkIns.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={5} className="py-16 text-center text-xs text-surface-400 font-light">
                  No walk-in registrations recorded today.
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="divide-y divide-surface-100">
              {walkIns.map((booking: any, index: number) => {
                const tier =
                  LOYALTY_TIER.find((t) => t.name === booking.customer?.loyaltyTier) ||
                  LOYALTY_TIER[0];
                return (
                  <tr key={index} className="hover:bg-surface-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center font-bold text-xs text-brand-800">
                          {booking.customer?.name?.charAt(0) || "W"}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-surface-950">
                            {booking.customer?.name}
                          </span>
                          <span className="text-[10px] text-surface-400 font-mono">
                            {booking.customer?.loyaltyTier || "GUEST"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5">
                        <BedDouble size={14} className="text-brand-600" />
                        <span className="font-mono font-bold text-surface-800">
                          Suite {booking.room?.roomId || "Unassigned"}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-mono text-surface-600">
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} className="text-surface-400" />
                        <span>
                          {booking.createdAt
                            ? new Date(booking.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="text-xs font-mono font-bold text-surface-800 bg-surface-100 px-2.5 py-1 rounded-md border border-surface-200">
                        {booking.confirmationNo}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right font-mono font-bold text-surface-950">
                      RM {Number(booking.totalAmount ?? 0).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>
    </Card>
  );
}
