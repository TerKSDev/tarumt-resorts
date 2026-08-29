import {
  Layers,
  Users,
  CircleDollarSign,
  Crown,
  Gift,
  Bell,
  FileText,
} from "lucide-react";
import type { TierName, Reward, TabKey, NavGroup } from "../types/loyalty";

export const LOYALTY_TIER = {
  BRONZE: {
    discount: 0,
    name: "Bronze",
    description: "Standard Resort Rewards Entry",
    color: "text-amber-800",
  },
  SILVER: {
    discount: 5,
    name: "Silver",
    description: "5% Dining Discount & Late Checkout",
    color: "text-slate-500",
  },
  GOLD: {
    discount: 10,
    name: "Gold",
    description: "Priority Check-In & 10% Dining Discount",
    color: "text-yellow-500",
  },
  PLATINUM: {
    discount: 15,
    name: "Platinum",
    description: "VIP Concierge & Complimentary Suite Upgrades",
    color: "text-brand-500",
  },
};

export const TIER_THRESHOLDS: { tier: TierName; min: number }[] = [
  { tier: "Bronze", min: 0 },
  { tier: "Silver", min: 3000 },
  { tier: "Gold", min: 10000 },
  { tier: "Platinum", min: 50000 },
];

export const TIER_STYLES: Record<
  TierName,
  { badge: string; ring: string; text: string; bg: string }
> = {
  Bronze: {
    badge: "bg-surface-100 text-surface-800 border-surface-300",
    ring: "text-surface-600",
    text: "text-surface-800",
    bg: "bg-surface-100",
  },
  Silver: {
    badge: "bg-surface-200 text-surface-900 border-surface-400 font-semibold",
    ring: "text-surface-500",
    text: "text-surface-700",
    bg: "bg-surface-200",
  },
  Gold: {
    badge: "bg-brand-50 text-brand-800 border-brand-300 font-bold",
    ring: "text-brand-600",
    text: "text-brand-700",
    bg: "bg-brand-50",
  },
  Platinum: {
    badge: "bg-surface-950 text-white border-surface-900 font-bold shadow-xs",
    ring: "text-brand-400",
    text: "text-brand-300",
    bg: "bg-surface-950",
  },
};

export const REWARDS: Reward[] = [
  { id: "R1", name: "Complimentary Free Night Stay", category: "Suite Accommodation", cost: 6000 },
  { id: "R2", name: "Presidential Suite Upgrade", category: "Suite Accommodation", cost: 2000 },
  { id: "R3", name: "Luxury Spa & Wellness Voucher (60 min)", category: "Wellness", cost: 1500 },
  { id: "R4", name: "VIP Chauffeur Airport Transfer", category: "Concierge Transport", cost: 800 },
  { id: "R5", name: "Fine Dining Resort Credit (RM100)", category: "Culinary Dining", cost: 1000 },
  { id: "R6", name: "Guaranteed Late Checkout (4:00 PM)", category: "Suite Accommodation", cost: 400 },
];

export const NAV: {
  key: TabKey;
  label: string;
  group: NavGroup;
  description: string;
  icon: any;
}[] = [
  { key: "dashboard", label: "Executive Dashboard", group: "Overview", description: "Program health & live KPIs", icon: Layers },
  { key: "members", label: "Member Directory", group: "Member Operations", description: "Profiles, ledgers & tier standings", icon: Users },
  { key: "points", label: "Award & Redemptions", group: "Member Operations", description: "Award points & create requests", icon: CircleDollarSign },
  { key: "tiers", label: "Tier Velocity", group: "Member Operations", description: "Tier thresholds & progression ranks", icon: Crown },
  { key: "redemption", label: "Redemption Queue", group: "Member Operations", description: "Process & fulfill reward claims", icon: Gift },
  { key: "notifications", label: "Audit Signals", group: "Audit & Analytics", description: "Expiring points & tier upgrades", icon: Bell },
  { key: "reports", label: "Console Reports", group: "Audit & Analytics", description: "Management reports & data exports", icon: FileText },
];

export const NAV_GROUPS: NavGroup[] = ["Overview", "Member Operations", "Audit & Analytics"];
