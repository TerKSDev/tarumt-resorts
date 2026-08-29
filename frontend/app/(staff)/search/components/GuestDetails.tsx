import {
  Bed,
  Calendar,
  CircleCheckBig,
  Receipt,
  Crown,
  Users,
} from "lucide-react";
import {
  format2DigitMonthDate,
  formatDigitDate,
  getDayBetween,
} from "../../../../lib/util/date";
import { TIER_STYLES } from "../../../../lib/config/loyalty";
import type { TierName } from "../../../../lib/types/loyalty";
import { useBilling } from "../../../../hooks/useBilling";
import { Card, CardHeader } from "../../../../components/Card";

export type GuestDetailsProps = {
  guestData: {
    bookingId: number;
    confirmationNo: string;
    checkInDate: string | undefined;
    checkOutDate: string | undefined;
    totalAmount: number;
    isPaid: boolean;
    status: string;
    createdAt: string | undefined;
    updatedAt: string | undefined;
    customer: {
      identityNo: string;
      name: string;
      loyaltyTier: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string | undefined;
    };
    room: {
      roomId: string;
      type: string;
      status: string;
      capacity: number;
      pricePerNight: number;
    };
  };
};

export default function GuestDetails({ guestData }: GuestDetailsProps) {
  const statusMap: Record<string, { badge: string; dot: string; content: string }> = {
    ACTIVE: {
      badge: "bg-surface-100 text-surface-800 border-surface-300",
      dot: "bg-surface-600",
      content: "Active",
    },
    CHECKED_IN: {
      badge: "bg-brand-50 text-brand-800 border-brand-300",
      dot: "bg-brand-600",
      content: "Checked In",
    },
    CHECKED_OUT: {
      badge: "bg-surface-100 text-surface-600 border-surface-200",
      dot: "bg-surface-400",
      content: "Checked Out",
    },
    CANCELLED: {
      badge: "bg-surface-100 text-surface-500 border-surface-300",
      dot: "bg-surface-400",
      content: "Cancelled",
    },
    REFUNDED: {
      badge: "bg-surface-100 text-surface-500 border-surface-200",
      dot: "bg-surface-400",
      content: "Refunded",
    },
  };

  const currentStatus = statusMap[guestData.status] ?? {
    badge: "bg-surface-100 text-surface-700 border-surface-300",
    dot: "bg-surface-500",
    content: guestData.status || "Unknown",
  };

  const normalizedTier = (
    guestData.customer.loyaltyTier
      ? guestData.customer.loyaltyTier.charAt(0).toUpperCase() +
        guestData.customer.loyaltyTier.slice(1).toLowerCase()
      : "Bronze"
  ) as TierName;

  const tierStyle = TIER_STYLES[normalizedTier] || TIER_STYLES.Bronze;
  const billing = useBilling(guestData);

  if (!billing) return null;

  return (
    <Card>
      {/* Unified Header */}
      <CardHeader
        title="Verified Reservation Record"
        subtitle={`Confirmation: #${guestData.confirmationNo}`}
        icon={CircleCheckBig}
        action={
          <div
            className={`flex items-center px-4 py-2 gap-2 border rounded-full text-xs uppercase tracking-wider font-semibold shadow-xs ${currentStatus.badge}`}
          >
            <div className={`w-2 h-2 rounded-full animate-pulse ${currentStatus.dot}`} />
            <span>{currentStatus.content}</span>
          </div>
        }
      />

      {/* Grid of Key Properties */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-surface-100 border-b border-surface-100 bg-surface-50/20">
        {/* Guest */}
        <div className="p-6 flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-surface-400">
            <Users size={14} className="text-brand-600" />
            <span>Registered Guest</span>
          </div>
          <p className="text-base font-semibold text-surface-950">{guestData.customer.name}</p>
          <p className="text-xs text-surface-500 font-mono">{guestData.customer.identityNo}</p>
        </div>

        {/* Room */}
        <div className="p-6 flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-surface-400">
            <Bed size={14} className="text-brand-600" />
            <span>Suite Allocation</span>
          </div>
          <p className="text-base font-semibold font-serif text-surface-950">
            Suite {guestData.room.roomId}
          </p>
          <p className="text-xs text-surface-500">{guestData.room.type}</p>
        </div>

        {/* Check-In / Out */}
        <div className="p-6 flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-surface-400">
            <Calendar size={14} className="text-brand-600" />
            <span>Stay Duration</span>
          </div>
          <div className="text-sm font-semibold text-surface-950 flex items-center gap-1.5 font-mono">
            <span>{format2DigitMonthDate(guestData.checkInDate || "")}</span>
            <span className="text-surface-400">&rarr;</span>
            <span>{format2DigitMonthDate(guestData.checkOutDate || "")}</span>
          </div>
          <p className="text-xs text-surface-500 font-mono">
            {getDayBetween(guestData.checkInDate || "", guestData.checkOutDate || "")} night(s)
          </p>
        </div>

        {/* Loyalty Tier */}
        <div className="p-6 flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-surface-400">
            <Crown size={14} className="text-brand-600" />
            <span>Loyalty Status</span>
          </div>
          <div>
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${tierStyle.badge}`}
            >
              <Crown size={11} />
              <span>{normalizedTier}</span>
            </span>
          </div>
          <p className="text-[11px] text-surface-400 font-mono">
            Member Since {formatDigitDate(guestData.customer.createdAt)}
          </p>
        </div>
      </div>

      {/* Billing Breakdown */}
      <div className="flex flex-col p-6 md:p-8 gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Receipt size={20} className="text-brand-600" />
            <h3 className="text-base font-serif font-semibold text-surface-950">
              Folio Itemization & Settlement
            </h3>
          </div>
          <span
            className={`text-xs border rounded-full font-semibold uppercase tracking-wider px-3.5 py-1 shadow-xs ${
              guestData.isPaid
                ? "bg-surface-950 text-white border-surface-950"
                : "bg-brand-50 text-brand-800 border-brand-200"
            }`}
          >
            {guestData.isPaid ? "Settled & Paid" : "Payment Pending"}
          </span>
        </div>

        <div className="rounded-2xl border border-surface-200 overflow-hidden bg-surface-50/40">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-surface-100/70 border-b border-surface-200 text-surface-600 uppercase tracking-wider font-semibold text-left">
                <th className="py-3.5 px-5">Description</th>
                <th className="py-3.5 px-5 text-center">Unit / Metric</th>
                <th className="py-3.5 px-5 text-right">Rate</th>
                <th className="py-3.5 px-5 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              <tr>
                <td className="py-3.5 px-5 font-semibold text-surface-900">
                  Suite Accommodation ({guestData.room.type})
                </td>
                <td className="py-3.5 px-5 text-center text-surface-600 font-mono">
                  {getDayBetween(guestData.checkInDate || "", guestData.checkOutDate || "")} night(s)
                </td>
                <td className="py-3.5 px-5 text-right text-surface-600 font-mono">
                  RM {guestData.room.pricePerNight.toFixed(2)}
                </td>
                <td className="py-3.5 px-5 text-right font-semibold text-surface-950 font-mono">
                  RM {billing.roomSubtotal.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-5 font-semibold text-surface-900">
                  Tourism & Service Tax
                </td>
                <td className="py-3.5 px-5 text-center text-surface-600 font-mono">
                  10%
                </td>
                <td className="py-3.5 px-5 text-right text-surface-600 font-mono">
                  RM {(guestData.room.pricePerNight * 0.1).toFixed(2)}
                </td>
                <td className="py-3.5 px-5 text-right font-semibold text-surface-950 font-mono">
                  RM {billing.tax.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Financial Summary Footer */}
          <div className="border-t border-surface-200 p-5 bg-white flex flex-col items-end gap-2 text-xs">
            <div className="flex justify-between w-full max-w-xs text-surface-600">
              <span>Gross Total:</span>
              <span className="font-mono font-medium">RM {billing.subtotal.toFixed(2)}</span>
            </div>

            {guestData.customer.loyaltyTier.toUpperCase() !== "BRONZE" && (
              <div className="flex justify-between w-full max-w-xs text-brand-700 font-medium">
                <span>VIP Membership Discount:</span>
                <span className="font-mono">- RM {billing.memberDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between w-full max-w-xs text-surface-600">
              <span>Deposit Collected (30%):</span>
              <span className="font-mono">- RM {billing.depositPaid.toFixed(2)}</span>
            </div>

            <div className="flex justify-between w-full max-w-xs pt-3 mt-1 border-t border-surface-200 text-sm font-bold text-surface-950">
              <span className="uppercase tracking-wider">Settlement Balance:</span>
              <span
                className={`font-mono text-base ${
                  guestData.isPaid ? "text-surface-950" : "text-brand-700"
                }`}
              >
                RM {billing.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
