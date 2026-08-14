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
  desc: string;
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
    desc: "Track and analyze loyalty points accumulated and utilized by members across the resort.",
    icon: CircleDollarSign,
    from: "Loyalty and Rewards",
    path: "/report/member-points",
  },
  {
    id: "redemption-record",
    name: "Redemption Record",
    desc: "Review the history of reward redemptions, including items claimed and points spent by loyalty members.",
    icon: TicketCheck,
    from: "Loyalty and Rewards",
    path: "/report/redemption-record",
  },
  {
    id: "cleaning-turnaround",
    name: "Staff Cleaning Turnaround",
    desc: "Monitor staff performance by analyzing the average time taken to clean and prepare rooms.",
    icon: BrushCleaning,
    from: "Housekeeping and Task Log",
    path: "/report/cleaning-turnaround",
  },
  {
    id: "housekeeping-status",
    name: "Room Housekeeping Status",
    desc: "Overview of the current housekeeping status for all rooms, identifying areas requiring immediate attention.",
    icon: Info,
    from: "Housekeeping and Task Log",
    path: "/report/housekeeping-status",
  },
  {
    id: "walkin-summary",
    name: "Daily Walk-In Registration Summary",
    desc: "Daily summary of all walk-in registrations, tracking spontaneous guest arrivals and revenue.",
    icon: Footprints,
    from: "Walk-In Registration",
    path: "/report/walkin-summary",
  },
  {
    id: "registration-cancellation",
    name: "Registration Cancellation Analysis",
    desc: "Analyze trends and reasons for registration cancellations to optimize booking policies and revenue.",
    icon: ChartNoAxesCombined,
    from: "Walk-In Registration",
    path: "/report/registration-cancellation",
  },
];
