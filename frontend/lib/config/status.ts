export const ROOM_STATUS = {
  AVAILABLE: {
    name: "Available",
    card: "hover:border-brand-500 hover:shadow-md",
    text: "group-hover:text-brand-600",
    badge: "bg-brand-50 border-brand-200 text-brand-700",
    dot: "bg-brand-500",
  },
  RESERVED: {
    name: "Reserved",
    card: "hover:border-brand-700 hover:shadow-md",
    text: "group-hover:text-brand-700",
    badge: "bg-brand-100/70 border-brand-300 text-brand-900",
    dot: "bg-brand-700",
  },
  MAINTENANCE: {
    name: "Maintenance",
    card: "hover:border-surface-600 hover:shadow-md",
    text: "group-hover:text-surface-700",
    badge: "bg-surface-100 border-surface-300 text-surface-700",
    dot: "bg-surface-600",
  },
  CLEANING: {
    name: "Cleaning",
    card: "hover:border-brand-400 hover:shadow-md",
    text: "group-hover:text-brand-600",
    badge: "bg-brand-50 border-brand-200 text-brand-600",
    dot: "bg-brand-400",
  },
  CHECKED_IN: {
    name: "Checked In",
    card: "hover:border-surface-900 hover:shadow-md",
    text: "group-hover:text-surface-950",
    badge: "bg-surface-900 border-surface-950 text-surface-50",
    dot: "bg-brand-400",
  },
  CHECKED_OUT: {
    name: "Checked Out",
    card: "hover:border-surface-400 hover:shadow-md",
    text: "group-hover:text-surface-600",
    badge: "bg-surface-100 border-surface-200 text-surface-600",
    dot: "bg-surface-400",
  },
} as const;

export const BOOKING_STATUS = {
  CONFIRMED: "Confirmed",
  CHECKED_IN: "Checked In",
  CHECKED_OUT: "Checked Out",
};
