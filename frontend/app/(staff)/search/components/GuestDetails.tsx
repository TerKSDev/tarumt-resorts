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
      badge: "bg-brand-50 text-brand-600 border-brand-200",
      dot: "bg-brand-500",
      content: "Active",
    },
    CHECKED_IN: {
      badge: "bg-green-50 text-green-600 border-green-200",
      dot: "bg-green-500",
      content: "Checked In",
    },
    CHECKED_OUT: {
      badge: "bg-surface-50 text-surface-600 border-surface-200",
      dot: "bg-surface-500",
      content: "Checked Out",
    },
    CANCELLED: {
      badge: "bg-red-50 text-red-600 border-red-200",
      dot: "bg-red-500",
      content: "Cancelled",
    },
    REFUNDED: {
      badge: "bg-surface-50 text-surface-600 border-surface-200",
      dot: "bg-surface-500",
      content: "Refunded",
    },
  };

  const billing = useBilling(guestData);

  if (!billing) return null;

  return (
    <div className="flex flex-col rounded-xl border border-surface-300 bg-surface-50">
      <div className="flex items-center justify-between gap-2 p-4 md:p-6 border-b border-surface-300">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex items-center justify-center w-10.5 h-10.5 bg-green-50 text-green-600 rounded-xl">
            <CircleCheckBig size={20} />
          </div>
          <div className="flex flex-col gap-1.5 justify-between">
            <p className="text-xs md:text-sm text-surface-600 leading-tight">
              Booking Record Found
            </p>
            <h2 className="text-base md:text-lg tracking-wider font-semibold leading-none">
              #{guestData.confirmationNo}
            </h2>
          </div>
        </div>
        <div
          className={`flex items-center px-3 gap-2 border py-1.5 rounded-full text-[10px] md:text-sm leading-none font-medium ${statusMap[guestData.status as keyof typeof statusMap].badge}`}
        >
          <div
            className={`flex w-1 h-1 md:w-1.5 md:h-1.5 rounded-full animate-pulse ${statusMap[guestData.status as keyof typeof statusMap].dot} `}
          />
          <div className="mb-px">
            {statusMap[guestData.status as keyof typeof statusMap].content}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        <div className="flex flex-col gap-3 border-r border-surface-300 border-b p-6 py-5 hover:bg-surface-100/80">
          <div className="flex items-center gap-1.5 text-sm text-surface-600 leading-none">
            <Users size={14} className="text-surface-600" />
            <span className="leading-none">Guest</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-base leading-none font-semibold">
              {guestData.customer.name}
            </span>
            <span className="text-xs text-surface-600">
              {guestData.customer.identityNo}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-r border-surface-300 border-b p-6 py-5 hover:bg-surface-100/80">
          <div className="flex items-center gap-1.5 text-sm text-surface-600 leading-none">
            <Bed size={14} className="text-surface-600" />
            <span className="leading-none">Room</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-base leading-none font-semibold">
              {guestData.room.roomId}
            </span>
            <span className="text-xs text-surface-600">
              {guestData.room.type}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-r border-surface-300 border-b p-6 py-5 hover:bg-surface-100/80">
          <div className="flex items-center gap-1.5 text-sm text-surface-600 leading-none">
            <Calendar size={14} className="text-surface-600" />
            <span className="leading-none">Check-In / Check-Out</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-base leading-none font-semibold gap-1.5 flex items-center tracking-wider">
              <span>{format2DigitMonthDate(guestData.checkInDate || "")}</span>
              <span>-</span>
              <span>{format2DigitMonthDate(guestData.checkOutDate || "")}</span>
            </div>
            <span className="text-xs text-surface-600">
              {getDayBetween(
                guestData.checkInDate || "",
                guestData.checkOutDate || "",
              )}{" "}
              day(s)
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-surface-300 border-b p-6 py-5 hover:bg-surface-100/80">
          <div className="flex items-center gap-1.5 text-sm text-surface-600 leading-none">
            <Trophy size={14} className="text-surface-600" />
            <span className="leading-none">Loyalty Tier</span>
          </div>
          <div className="flex flex-col gap-1">
            <div
              className={`text-base leading-none font-semibold gap-1.5 flex items-center tracking-wider ${
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
            <span className="text-xs text-surface-600">
              {formatDigitDate(guestData.customer.updatedAt) ||
                formatDigitDate(guestData.customer.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col p-6 py-4 gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt size={16} className="text-brand-600 mt-px" />
            <h1 className="text-base leading-none font-semibold">
              Billing Details
            </h1>
          </div>
          <div
            className={`text-xs border rounded-full font-medium leading-none px-3 py-1 ${
              guestData.isPaid
                ? "bg-green-50 text-green-600 border-green-200"
                : "bg-yellow-50 text-yellow-600 border-yellow-200"
            }`}
          >
            {guestData.isPaid ? "Paid" : "Pending"}
          </div>
        </div>
        <div className="overflow-x-auto w-full">
          <div className="grid grid-cols-4 text-sm min-w-[600px]">
            <div className="w-full flex flex-col">
              <h1 className="text-surface-600 px-1.5 border-b border-surface-300 py-2">
                Items
              </h1>
              <div className="font-medium border-b px-1.5 border-surface-300 text-surface-800 py-2.5">
                Room ({guestData.room.type})
              </div>
              <div className="font-medium border-b px-1.5 border-surface-300 text-surface-800 py-2.5">
                Tax
              </div>
            </div>

            <div className="w-full flex flex-col">
              <h1 className="text-surface-600 px-1.5 border-b border-surface-300 py-2 text-center">
                Details
              </h1>
              <div className="border-b px-1.5 border-surface-300 text-surface-600 py-2.5 text-center">
                {getDayBetween(
                  guestData.checkInDate || "",
                  guestData.checkOutDate || "",
                )}{" "}
                day(s)
              </div>
              <div className="border-b px-1.5 border-surface-300 text-surface-600 py-2.5 text-center">
                10%
              </div>
            </div>

            <div className="w-full flex flex-col">
              <h1 className="text-surface-600 px-1.5 border-b border-surface-300 py-2 text-right">
                Unit Price
              </h1>
              <div className="border-b px-1.5 border-surface-300 text-surface-600 py-2.5 text-right">
                RM {guestData.room.pricePerNight.toFixed(2)}
              </div>
              <div className="border-b px-1.5 border-surface-300 text-surface-600 py-2.5 text-right">
                RM {(guestData.room.pricePerNight * 0.1).toFixed(2)}
              </div>
            </div>

            <div className="w-full flex flex-col">
              <h1 className="text-surface-600 px-1.5 border-b border-surface-300 py-2 text-right">
                Subtotal
              </h1>
              <div className="font-medium border-b px-1.5 border-surface-300 text-surface-800 py-2.5 text-right">
                RM {billing?.roomSubtotal.toFixed(2)}
              </div>
              <div className="font-medium border-b px-1.5 border-surface-300 text-surface-800 py-2.5 text-right">
                RM {billing?.tax.toFixed(2)}
              </div>
            </div>

            <div className="col-start-3 px-1.5 text-surface-600">
              <div className="flex flex-col gap-3 border-surface-300 border-b py-3">
                <div>Subtotal</div>
                {guestData.customer.loyaltyTier !== "BRONZE" && (
                  <div>Member Discount:</div>
                )}
                <div>Deposit Paid (30%):</div>
              </div>
              <div className="font-medium text-base text-green-600 py-3">
                Total Amount
              </div>
            </div>

            <div className="col-start-4 font-medium px-1.5 text-surface-800 text-right">
              <div className="flex flex-col gap-3 border-surface-300 border-b py-3">
                <div>RM {billing?.subtotal.toFixed(2)}</div>

                {guestData.customer.loyaltyTier !== "BRONZE" && (
                  <div className="text-brand-600">
                    - RM {billing?.memberDiscount.toFixed(2)}
                  </div>
                )}

                <div className="text-brand-600">
                  - RM {billing?.depositPaid.toFixed(2)}
                </div>
              </div>
              <div
                className={`font-medium text-base py-3 ${guestData.isPaid ? "text-green-600" : "text-red-600"}`}
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
