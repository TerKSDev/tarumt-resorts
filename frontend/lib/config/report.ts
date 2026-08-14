import {
  ChartNoAxesCombined,
  UserRoundX,
  CircleDollarSign,
  type LucideIcon,
  TicketCheck,
  Bath,
  BrushCleaning,
  Info,
  Footprints,
} from "lucide-react";

export type Report = {
  id: string;
  name: string;
  desc?: string;
  icon: LucideIcon;
  from: string;
  path: string;
};

export const REPORT: Report[] = [
  {
    id: "arrival-departure",
    name: "Today's Arrival & Departure List",
    desc: "Generate a comprehensive list of all guests scheduled to arrive at or depart from the resort on the current date.",
    icon: ChartNoAxesCombined,
    from: "Guest Search",
    path: "/report/arrival-departure",
  },
  {
    id: "guest-directory",
    name: "In-House Guest Directory",
    desc: "Generate a comprehensive directory of all guests currently staying at the resort, including their room numbers, reservation details, and contact information.",
    icon: UserRoundX,
    from: "Guest Search",
    path: "/report/guest-directory",
  },
  {
    id: "member-points",
    name: "Member Points",
    icon: CircleDollarSign,
    from: "Loyalty and Rewards",
    path: "/report/member-points",
  },
  {
    id: "redemption-record",
    name: "Redemption Record",
    icon: TicketCheck,
    from: "Loyalty and Rewards",
    path: "/report/redemption-record",
  },
  {
    id: "cleaning-turnaround",
    name: "Staff Cleaning Turnaround",
    icon: BrushCleaning,
    from: "Housekeeping and Task Log",
    path: "/report/cleaning-turnaround",
  },
  {
    id: "housekeeping-status",
    name: "Room Housekeeping Status",
    icon: Info,
    from: "Housekeeping and Task Log",
    path: "/report/housekeeping-status",
  },
  {
    id: "walkin-summary",
    name: "Daily Walk-In Registration Summary",
    icon: Footprints,
    from: "Walk-In Registration",
    path: "/report/walkin-summary",
  },
  {
    id: "registration-cancellation",
    name: "Registration Cancellation Analysis",
    icon: ChartNoAxesCombined,
    from: "Walk-In Registration",
    path: "/report/registration-cancellation",
  },
];
