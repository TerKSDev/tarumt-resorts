import { LOYALTY_TIER } from "../lib/config/loyalty";
import { getDayBetween } from "../lib/util/date";
import { type GuestDetailsProps } from "../app/(staff)/search/components/GuestDetails";

export function useBilling(data: GuestDetailsProps["guestData"]) {
  if (!data) return null;

  const days = getDayBetween(data.checkInDate || "", data.checkOutDate || "");
  const roomSubtotal = data.room.pricePerNight * days;
  const tax = roomSubtotal * 0.1;
  const subtotal = roomSubtotal + tax;
  const memberDiscount =
    roomSubtotal *
    (LOYALTY_TIER[data.customer.loyaltyTier as keyof typeof LOYALTY_TIER]
      .discount /
      100);
  const depositPaid = roomSubtotal * 0.3;
  const totalAmount = subtotal - memberDiscount - depositPaid;

  return {
    days,
    roomSubtotal,
    tax,
    subtotal,
    memberDiscount,
    depositPaid,
    totalAmount,
  };
}
