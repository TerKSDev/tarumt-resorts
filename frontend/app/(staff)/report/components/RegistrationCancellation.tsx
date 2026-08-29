import axios from "axios";
import { useEffect, useState } from "react";
import {
  ChartNoAxesCombined,
  CheckCircle,
  Hash,
  CalendarDays,
  Sparkles,
  Ban,
  TrendingDown,
  CircleDollarSign,
} from "lucide-react";
import { LOYALTY_TIER } from "../../../../lib/config/loyalty";
import type { MetaFunction } from "react-router";
import { Card, CardHeader } from "../../../../../components/Card";

export const meta: MetaFunction = () => [
  { title: "Registration Cancellation Analysis | TARUMT Resorts" },
];

export default function RegistrationCancellation() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:8081/api/report/registration-cancellation",
        );
        setReport(response.data);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const cancelledBookings: any[] = report?.cancelledBookings ?? [];
  const trends: any[] = report?.trends ?? [];
  const reasonBreakdown: any[] = report?.reasonBreakdown ?? [];

  const formatReason = (reason?: string) =>
    reason
      ? reason
          .split("_")
          .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
          .join(" ")
      : "Unspecified";

  return (
    <Card>
      <CardHeader
        title="Walk-In Registration & Cancellation Analysis"
        subtitle="Historical trend audits tracking cancelled queue requests, reason breakdowns, and revenue loss."
        icon={ChartNoAxesCombined}
        action={
          <div className="flex items-center gap-2 text-xs px-3.5 py-1.5 print:hidden bg-brand-50 text-brand-700 font-semibold border border-brand-200 rounded-full shadow-2xs">
            <Sparkles size={13} className="text-brand-600" />
            <span>Policy Analytics</span>
          </div>
        }
      />

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-surface-100 border-b border-surface-100 bg-surface-50/30">
        <div className="flex flex-col gap-2 p-6 justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Total Cancellations
            </span>
            <div className="w-8 h-8 rounded-xl border border-surface-200 flex items-center justify-center text-surface-700 bg-surface-100">
              <Ban size={16} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-mono text-surface-950 mt-1">
            {report?.totalCancellations ?? 0} <span className="text-xs font-normal text-surface-500">Booking(s)</span>
          </p>
          <span className="text-xs text-surface-500 font-light">Walk-in cancellations</span>
        </div>

        <div className="flex flex-col gap-2 p-6 justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Cancellation Rate
            </span>
            <div className="w-8 h-8 rounded-xl border border-brand-200 flex items-center justify-center text-brand-700 bg-brand-50">
              <TrendingDown size={16} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-mono text-surface-950 mt-1">
            {Number(report?.cancellationRate ?? 0).toFixed(1)}%
          </p>
          <span className="text-xs text-surface-500 font-light">Ratio of all queue registrations</span>
        </div>

        <div className="flex flex-col gap-2 p-6 justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Gross Revenue Loss
            </span>
            <div className="w-8 h-8 rounded-xl border border-brand-200 flex items-center justify-center text-brand-700 bg-brand-50">
              <CircleDollarSign size={16} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-mono text-surface-950 mt-1">
            RM {Number(report?.totalLostRevenue ?? 0).toFixed(2)}
          </p>
          <span className="text-xs text-surface-500 font-light">Potential room revenue uncollected</span>
        </div>
      </div>

      {/* Reason Breakdown Pills */}
      {reasonBreakdown.length > 0 && (
        <div className="flex flex-wrap items-center gap-2.5 p-6 border-b border-surface-100 bg-white">
          <span className="text-xs font-semibold uppercase tracking-wider text-surface-400 mr-1">
            Top Causes:
          </span>
          {reasonBreakdown.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-surface-200 bg-surface-50 text-xs"
            >
              <span className="font-semibold text-surface-950">
                {formatReason(item.reason)}
              </span>
              <span className="font-mono text-surface-500">
                • {item.cancellationCount} cases (RM {Number(item.lostRevenue).toFixed(2)})
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="text-surface-600 uppercase tracking-wider font-semibold bg-surface-100/70 border-b border-surface-200">
              <th className="py-3.5 px-6">Guest Identification</th>
              <th className="py-3.5 px-6">Confirmation Ref</th>
              <th className="py-3.5 px-6">Assigned Suite</th>
              <th className="py-3.5 px-6">Cancellation Reason</th>
              <th className="py-3.5 px-6 text-right">Lost Room Value</th>
            </tr>
          </thead>
          {loading ? (
            <tbody>
              <tr>
                <td colSpan={5} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-brand-600" />
                    <span className="text-xs text-surface-500 font-medium">Analyzing cancellation history...</span>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : cancelledBookings.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={5} className="py-16 text-center text-xs text-surface-400 font-light">
                  No cancellation records found in the resort database.
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="divide-y divide-surface-100">
              {cancelledBookings.map((booking: any, index: number) => {
                const tier =
                  LOYALTY_TIER.find((t) => t.name === booking.customer?.loyaltyTier) ||
                  LOYALTY_TIER[0];
                return (
                  <tr key={index} className="hover:bg-surface-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-surface-100 border border-surface-200 flex items-center justify-center font-bold text-xs text-surface-800">
                          {booking.customer?.name?.charAt(0) || "G"}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-surface-950">{booking.customer?.name}</span>
                          <span className="text-[10px] text-surface-400 font-mono">
                            {booking.customer?.identityNo}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="text-xs font-mono font-bold text-surface-800 bg-surface-100 px-2.5 py-1 rounded-md border border-surface-200">
                        {booking.confirmationNo}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="text-surface-800 font-medium font-mono">
                        Suite {booking.room?.roomId} ({booking.room?.type})
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-surface-100 text-surface-700 border border-surface-300 uppercase tracking-wider">
                        {formatReason(booking.cancellationReason)}
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
