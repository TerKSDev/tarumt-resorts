import {
  ClipboardClock,
  ClipboardPen,
  LayoutDashboard,
  Bed,
  Trophy,
  UserRound,
  Crown,
  UserRoundPlus,
  UserRoundSearch,
} from "lucide-react";

export const ROLES = {
  MANAGER: "Manager",
  FRONT_DESK: "Front Desk",
  HOUSEKEEPING: "Housekeeping",
} as const;

export const CATEGORIES = {
  MAIN_MENU: "Main Menu",
  MANAGEMENT: "Management",
  FRONT_DESK: "Front Desk",
  HOUSEKEEPING: "Housekeeping",
} as const;

export const PATHS = [
  {
    label: "Dashboard",
    desc: "Overview of system statistics",
    to: "/dashboard",
    icon: LayoutDashboard,
    category: CATEGORIES.MAIN_MENU,
    role: [ROLES.MANAGER, ROLES.FRONT_DESK],
  },
  {
    label: "Room Management",
    desc: "Manage room types, rates, and availability",
    to: "/room",
    icon: Bed,
    category: CATEGORIES.MANAGEMENT,
    role: [ROLES.MANAGER, ROLES.FRONT_DESK],
  },
  {
    label: "User Management",
    desc: "Manage staff and user accounts",
    to: "/user",
    icon: UserRound,
    category: CATEGORIES.MANAGEMENT,
    role: [ROLES.MANAGER],
  },
  {
    label: "Loyalty & Members",
    desc: "Manage loyalty programs and members",
    to: "/loyalty",
    icon: Crown,
    category: CATEGORIES.MANAGEMENT,
    role: [ROLES.MANAGER, ROLES.FRONT_DESK],
  },
  {
    label: "Analytical Report",
    desc: "View operational performance metrics and summaries",
    to: "/report",
    icon: ClipboardPen,
    category: CATEGORIES.MANAGEMENT,
    role: [ROLES.MANAGER],
  },
  {
    label: "Walk-In Registration",
    desc: "Register new guests for walk-in reservations",
    to: "/registration",
    icon: UserRoundPlus,
    category: CATEGORIES.FRONT_DESK,
    role: [ROLES.FRONT_DESK, ROLES.MANAGER],
  },
  {
    label: "Guest Search",
    desc: "Search for existing guests",
    to: "/search",
    icon: UserRoundSearch,
    category: CATEGORIES.FRONT_DESK,
    role: [ROLES.FRONT_DESK, ROLES.MANAGER],
  },
  {
    label: "VIP Priority Queue",
    desc: "Manage VIP priority queue",
    to: "/vip",
    icon: Trophy,
    category: CATEGORIES.FRONT_DESK,
    role: [ROLES.FRONT_DESK, ROLES.MANAGER],
  },
  {
    label: "Task Logs",
    desc: "Track and log room cleaning tasks and rollback history",
    to: "/log",
    icon: ClipboardClock,
    category: CATEGORIES.HOUSEKEEPING,
    role: [ROLES.HOUSEKEEPING, ROLES.MANAGER],
  },
];
