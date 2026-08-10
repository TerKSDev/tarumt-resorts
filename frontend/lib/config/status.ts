export const ROOM_STATUS = {
  AVAILABLE: {
    name: "Available",
    card: "hover:border-emerald-600 hover:shadow-sm",
    text: "group-hover:text-emerald-600",
    badge: "bg-emerald-50 border-emerald-200 text-emerald-600",
    dot: "bg-emerald-600",
  },
  RESERVED: {
    name: "Reserved",
    card: "hover:border-amber-600 hover:shadow-sm",
    text: "group-hover:text-amber-600",
    badge: "bg-amber-50 border-amber-200 text-amber-600",
    dot: "bg-amber-600",
  },
  MAINTENANCE: {
    name: "Maintenance",
    card: "hover:border-slate-600 hover:shadow-sm",
    text: "group-hover:text-slate-600",
    badge: "bg-slate-50 border-slate-200 text-slate-600",
    dot: "bg-slate-600",
  },
  CLEANING: {
    name: "Cleaning",
    card: "hover:border-sky-600 hover:shadow-sm",
    text: "group-hover:text-sky-600",
    badge: "bg-sky-50 border-sky-200 text-sky-600",
    dot: "bg-sky-600",
  },
  CHECKED_IN: {
    name: "Checked In",
    card: "hover:border-indigo-600 hover:shadow-sm",
    text: "group-hover:text-indigo-600",
    badge: "bg-indigo-50 border-indigo-200 text-indigo-600",
    dot: "bg-indigo-600",
  },
  CHECKED_OUT: {
    name: "Checked Out",
    card: "hover:border-rose-600 hover:shadow-sm",
    text: "group-hover:text-rose-600",
    badge: "bg-rose-50 border-rose-200 text-rose-600",
    dot: "bg-rose-600",
  },
} as const;

export const BOOKING_STATUS = {
  CONFIRMED: "Confirmed",
  CHECKED_IN: "Checked In",
  CHECKED_OUT: "Checked Out",
};
