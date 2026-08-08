import { Bed, Calendar, CircleCheckBig, Trophy, Users } from "lucide-react";
import {
  format2DigitMonthDate,
  formatDigitDate,
  getDayBetween,
} from "../../../../lib/config/util/date";

type GuestDetailsProps = {
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

  const loyaltyTierMap = {
    BRONZE: {
      badge: "text-brown-500 border-brown-200",
      dot: "bg-brown-500",
      content: "Bronze",
    },
    SILVER: {
      badge: "text-zinc-500 border-zinc-200",
      dot: "bg-zinc-500",
      content: "Silver",
    },
    GOLD: {
      badge: "text-yellow-500 border-yellow-200",
      dot: "bg-amber-500",
      content: "Gold",
    },
    PLATINUM: {
      badge: "text-brand-500 border-brand-200",
      dot: "bg-brand-500",
      content: "Platinum",
    },
  };

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
        <div className="flex flex-col gap-3 border-r border-surface-300 border-b p-5 py-4">
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

        <div className="flex flex-col gap-3 border-r border-surface-300 border-b p-5 py-4">
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

        <div className="flex flex-col gap-3 border-r border-surface-300 border-b p-5 py-4">
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
              )}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-r border-surface-300 border-b p-5 py-4">
          <div className="flex items-center gap-1.5 text-sm text-surface-600 leading-none">
            <Trophy size={14} className="text-surface-600" />
            <span className="leading-none">Loyalty Tier</span>
          </div>
          <div className="flex flex-col gap-1">
            <div
              className={`text-base leading-none font-semibold gap-1.5 flex items-center tracking-wider ${
                loyaltyTierMap[
                  guestData.customer.loyaltyTier as keyof typeof loyaltyTierMap
                ].badge
              }`}
            >
              <span>
                {
                  loyaltyTierMap[
                    guestData.customer
                      .loyaltyTier as keyof typeof loyaltyTierMap
                  ].content
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
    </div>
  );
}
