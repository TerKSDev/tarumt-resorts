import {
  Bed,
  Calendar,
  CircleCheckBig,
  Receipt,
  Trophy,
  Users,
} from "lucide-react";
import {
  format2DigitMonthDate,
  formatDigitDate,
  getDayBetween,
} from "../../../../lib/util/date";
import { LOYALTY_TIER } from "../../../../lib/config/loyalty";
import { useBilling } from "../../../../hooks/useBilling";

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
  const statusMap = {
    ACTIVE: {
      badge: "bg-surface-100 text-surface-700 border-surface-200",
      dot: "bg-surface-500",
      content: "Active",
    },
    CHECKED_IN: {
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
      content: "Checked In",
    },
    CHECKED_OUT: {
      badge: "bg-surface-50 text-surface-500 border-surface-200",
      dot: "bg-surface-400",
      content: "Checked Out",
    },
    CANCELLED: {
      badge: "bg-rose-50 text-rose-700 border-rose-200",
      dot: "bg-rose-500",
      content: "Cancelled",
    },
    REFUNDED: {
      badge: "bg-surface-50 text-surface-500 border-surface-200",
      dot: "bg-surface-400",
      content: "Refunded",
    },
  };

  const billing = useBilling(guestData);

  if (!billing) return null;

  return (
    <div className="flex flex-col rounded-3xl border border-surface-200 bg-white shadow-xs overflow-hidden">
      <div className="flex items-center justify-between gap-2 p-6 md:p-8 border-b border-surface-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-surface-50 border border-surface-100 text-surface-600 rounded-full shadow-sm">
            <CircleCheckBig size={20} strokeWidth={1.5} />
          </div>
          <div className="flex flex-col gap-1 justify-between">
            <h2 className="text-xl font-serif text-surface-900 tracking-wide leading-none">
              Booking Record Found
            </h2>
            <p className="text-xs text-surface-500 font-light leading-tight uppercase tracking-widest">
              #{guestData.confirmationNo}
            </p>
          </div>
        </div>
        <div
          className={`flex items-center px-4 gap-2.5 border py-2 rounded-full text-[10px] tracking-widest uppercase leading-none font-semibold shadow-xs ${statusMap[guestData.status as keyof typeof statusMap].badge}`}
        >
          <div
            className={`flex w-1.5 h-1.5 rounded-full animate-pulse ${statusMap[guestData.status as keyof typeof statusMap].dot} `}
          />
          <div className="mb-px">
            {statusMap[guestData.status as keyof typeof statusMap].content}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 bg-surface-50/30">
        <div className="flex flex-col gap-3 border-r border-surface-100 border-b p-6 py-5 hover:bg-surface-50 transition-colors">
          <div className="flex items-center gap-2 text-[10px] font-semibold tracking-widest uppercase text-surface-400 leading-none">
            <Users size={12} strokeWidth={2} />
            <span className="leading-none">Guest</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-base leading-none font-medium text-surface-900">
              {guestData.customer.name}
            </span>
            <span className="text-xs text-surface-500 font-light tracking-wide">
              {guestData.customer.identityNo}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-r border-surface-100 border-b p-6 py-5 hover:bg-surface-50 transition-colors">
          <div className="flex items-center gap-2 text-[10px] font-semibold tracking-widest uppercase text-surface-400 leading-none">
            <Bed size={12} strokeWidth={2} />
            <span className="leading-none">Room</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-base leading-none font-medium text-surface-900">
              {guestData.room.roomId}
            </span>
            <span className="text-xs text-surface-500 font-light tracking-wide">
              {guestData.room.type}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-r border-surface-100 border-b p-6 py-5 hover:bg-surface-50 transition-colors">
          <div className="flex items-center gap-2 text-[10px] font-semibold tracking-widest uppercase text-surface-400 leading-none">
            <Calendar size={12} strokeWidth={2} />
            <span className="leading-none">Check-In / Check-Out</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-base leading-none font-medium text-surface-900 gap-1.5 flex items-center">
              <span>{format2DigitMonthDate(guestData.checkInDate || "")}</span>
              <span className="text-surface-300">-</span>
              <span>{format2DigitMonthDate(guestData.checkOutDate || "")}</span>
            </div>
            <span className="text-xs text-surface-500 font-light tracking-wide">
              {getDayBetween(
                guestData.checkInDate || "",
                guestData.checkOutDate || "",
              )}{" "}
              day(s)
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-surface-100 border-b p-6 py-5 hover:bg-surface-50 transition-colors">
          <div className="flex items-center gap-2 text-[10px] font-semibold tracking-widest uppercase text-surface-400 leading-none">
            <Trophy size={12} strokeWidth={2} />
            <span className="leading-none">Loyalty Tier</span>
          </div>
          <div className="flex flex-col gap-1">
            <div
              className={`text-base leading-none font-medium gap-1.5 flex items-center tracking-widest uppercase ${
                LOYALTY_TIER[
                  guestData.customer.loyaltyTier as keyof typeof LOYALTY_TIER
                ].color
              }`}
            >
              <span>
                {
                  LOYALTY_TIER[
                    guestData.customer.loyaltyTier as keyof typeof LOYALTY_TIER
                  ].name
                }
              </span>
            </div>
            <span className="text-xs text-surface-500 font-light tracking-wide">
              {formatDigitDate(guestData.customer.updatedAt) ||
                formatDigitDate(guestData.customer.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col p-6 md:p-8 py-6 gap-6 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Receipt size={18} strokeWidth={1.5} className="text-surface-400" />
            <h1 className="text-lg font-serif tracking-wide text-surface-900 leading-none mt-1">
              Billing Details
            </h1>
          </div>
          <div
            className={`text-[10px] border rounded-full font-semibold uppercase tracking-widest leading-none px-4 py-1.5 shadow-xs ${
              guestData.isPaid
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-surface-50 text-surface-600 border-surface-200"
            }`}
          >
            {guestData.isPaid ? "Paid" : "Pending"}
          </div>
        </div>
        <div className="overflow-x-auto w-full rounded-2xl border border-surface-100 bg-surface-50/50 pb-2">
          <div className="grid grid-cols-4 text-sm min-w-[600px]">
            <div className="w-full flex flex-col">
              <h1 className="text-[10px] font-semibold uppercase tracking-widest text-surface-400 px-4 border-b border-surface-100 py-3">
                Items
              </h1>
              <div className="font-medium border-b px-4 border-surface-100/50 text-surface-700 py-3">
                Room ({guestData.room.type})
              </div>
              <div className="font-medium border-b px-4 border-surface-100/50 text-surface-700 py-3">
                Tax
              </div>
            </div>

            <div className="w-full flex flex-col">
              <h1 className="text-[10px] font-semibold uppercase tracking-widest text-surface-400 px-4 border-b border-surface-100 py-3 text-center">
                Details
              </h1>
              <div className="border-b px-4 border-surface-100/50 text-surface-600 py-3 text-center">
                {getDayBetween(
                  guestData.checkInDate || "",
                  guestData.checkOutDate || "",
                )}{" "}
                day(s)
              </div>
              <div className="border-b px-4 border-surface-100/50 text-surface-600 py-3 text-center">
                10%
              </div>
            </div>

            <div className="w-full flex flex-col">
              <h1 className="text-[10px] font-semibold uppercase tracking-widest text-surface-400 px-4 border-b border-surface-100 py-3 text-right">
                Unit Price
              </h1>
              <div className="border-b px-4 border-surface-100/50 text-surface-600 py-3 text-right font-medium">
                RM {guestData.room.pricePerNight.toFixed(2)}
              </div>
              <div className="border-b px-4 border-surface-100/50 text-surface-600 py-3 text-right font-medium">
                RM {(guestData.room.pricePerNight * 0.1).toFixed(2)}
              </div>
            </div>

            <div className="w-full flex flex-col">
              <h1 className="text-[10px] font-semibold uppercase tracking-widest text-surface-400 px-4 border-b border-surface-100 py-3 text-right">
                Subtotal
              </h1>
              <div className="font-medium border-b px-4 border-surface-100/50 text-surface-900 py-3 text-right">
                RM {billing?.roomSubtotal.toFixed(2)}
              </div>
              <div className="font-medium border-b px-4 border-surface-100/50 text-surface-900 py-3 text-right">
                RM {billing?.tax.toFixed(2)}
              </div>
            </div>

            <div className="col-start-3 px-4 text-surface-500 text-xs mt-2">
              <div className="flex flex-col gap-3 border-surface-100 border-b py-4">
                <div>Subtotal</div>
                {guestData.customer.loyaltyTier !== "BRONZE" && (
                  <div>Member Discount:</div>
                )}
                <div>Deposit Paid (30%):</div>
              </div>
              <div className="font-medium tracking-wide text-base text-surface-900 py-4 uppercase">
                Total Amount
              </div>
            </div>

            <div className="col-start-4 font-medium px-4 text-surface-800 text-right mt-2 text-xs">
              <div className="flex flex-col gap-3 border-surface-100 border-b py-4">
                <div className="text-surface-900">RM {billing?.subtotal.toFixed(2)}</div>

                {guestData.customer.loyaltyTier !== "BRONZE" && (
                  <div className="text-surface-600">
                    - RM {billing?.memberDiscount.toFixed(2)}
                  </div>
                )}

                <div className="text-surface-600">
                  - RM {billing?.depositPaid.toFixed(2)}
                </div>
              </div>
              <div
                className={`font-semibold text-lg py-4 tracking-wide ${guestData.isPaid ? "text-emerald-600" : "text-surface-900"}`}
              >
                RM {billing?.totalAmount.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
