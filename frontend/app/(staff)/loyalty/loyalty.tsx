import { useMemo, useState, type ReactNode, type SVGProps } from "react";
import { type LinksFunction, type MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
    { title: "Loyalty & Members | TARUMT Resorts" },
];

export const links: LinksFunction = () => [
    {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap",
    },
];

const DISPLAY_FONT = "'Space Grotesk', ui-sans-serif, system-ui, sans-serif";

/* =========================================================================
   TYPES
   ========================================================================= */

type TierName = "Silver" | "Gold" | "Platinum";
type LedgerType = "earn" | "redeem";
type RequestStatus = "Pending" | "Approved" | "Rejected";

interface PointsLedgerEntry {
    id: string;
    date: string; // ISO date
    type: LedgerType;
    amount: number;
    description: string;
    expiryDate?: string; // only set for "earn" entries
}

interface Member {
    id: string;
    name: string;
    email: string;
    city: string;
    tier: TierName;
    points: number; // current redeemable balance
    lifetimePoints: number; // drives tier progression
    joinDate: string;
    lastActivity: string;
    ledger: PointsLedgerEntry[];
    promotions: string[];
}

interface Reward {
    id: string;
    name: string;
    category: string;
    cost: number;
}

interface RedemptionRequest {
    id: string;
    memberId: string;
    rewardId: string;
    pointsCost: number;
    status: RequestStatus;
    requestDate: string;
    decisionDate?: string;
}

type TabKey =
    | "dashboard"
    | "members"
    | "points"
    | "tiers"
    | "redemption"
    | "notifications"
    | "reports";

/* =========================================================================
   CONSTANTS
   ========================================================================= */

const TIER_THRESHOLDS: { tier: TierName; min: number }[] = [
    { tier: "Silver", min: 0 },
    { tier: "Gold", min: 3000 },
    { tier: "Platinum", min: 8000 },
];

const TIER_STYLES: Record<TierName, { badge: string; ring: string }> = {
    Silver: { badge: "bg-slate-100 text-slate-600 border-slate-300", ring: "text-slate-400" },
    Gold: { badge: "bg-amber-50 text-amber-700 border-amber-300", ring: "text-amber-500" },
    Platinum: { badge: "bg-teal-50 text-teal-700 border-teal-300", ring: "text-teal-500" },
};

const REWARDS: Reward[] = [
    { id: "R1", name: "Free Night Stay", category: "Room", cost: 6000 },
    { id: "R2", name: "Room Upgrade", category: "Room", cost: 2000 },
    { id: "R3", name: "Spa Voucher (60 min)", category: "Wellness", cost: 1500 },
    { id: "R4", name: "Airport Transfer", category: "Transport", cost: 800 },
    { id: "R5", name: "Dining Credit (RM100)", category: "Dining", cost: 1000 },
    { id: "R6", name: "Late Checkout (4pm)", category: "Room", cost: 400 },
];

type NavGroup = "Overview" | "Member Operations" | "Insights";

const NAV: { key: TabKey; label: string; group: NavGroup; description: string }[] = [
    { key: "dashboard", label: "Dashboard", group: "Overview", description: "Program health at a glance" },
    { key: "members", label: "Members", group: "Member Operations", description: "Profiles, ledgers, and personalized promotions" },
    { key: "points", label: "Points", group: "Member Operations", description: "Award points and submit redemption requests" },
    { key: "tiers", label: "Tiers", group: "Member Operations", description: "Silver, Gold, and Platinum progression" },
    { key: "redemption", label: "Redemption", group: "Member Operations", description: "Approve or reject reward requests" },
    { key: "notifications", label: "Notifications", group: "Insights", description: "Expiring points, requests, and upgrades" },
    { key: "reports", label: "Reports", group: "Insights", description: "Filtered, sorted, console-style summaries" },
];

const NAV_GROUPS: NavGroup[] = ["Overview", "Member Operations", "Insights"];

function NavIcon({ tab, ...props }: SVGProps<SVGSVGElement> & { tab: TabKey }) {
    const common = {
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.75,
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
        ...props,
    };
    switch (tab) {
        case "dashboard":
            return (
                <svg {...common}>
                    <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
                    <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
                    <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
                    <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
                </svg>
            );
        case "members":
            return (
                <svg {...common}>
                    <circle cx="12" cy="8" r="3.25" />
                    <path d="M5 20c0-3.6 3.13-6 7-6s7 2.4 7 6" />
                </svg>
            );
        case "points":
            return (
                <svg {...common}>
                    <circle cx="12" cy="12" r="8.25" />
                    <path d="M12 7.5v9M9.25 9.75c0-1.25 1.15-2.1 2.75-2.1s2.75.85 2.75 1.9c0 2.7-5.5 1.3-5.5 3.9 0 1.1 1.2 1.95 2.75 1.95s2.75-.85 2.75-2" />
                </svg>
            );
        case "tiers":
            return (
                <svg {...common}>
                    <path d="M12 3.5l2.2 4.5 4.9.7-3.55 3.5.85 4.9L12 14.7l-4.4 2.4.85-4.9-3.55-3.5 4.9-.7z" />
                </svg>
            );
        case "redemption":
            return (
                <svg {...common}>
                    <rect x="3.5" y="9" width="17" height="4" rx="1" />
                    <path d="M4.5 13v6.5a1 1 0 001 1h13a1 1 0 001-1V13" />
                    <path d="M12 9V20.5M12 9C10.5 9 8.75 8 8.75 6.25a2 2 0 013.9-.6c.2.6.35 1.35.35 2.35zm0 0c1.5 0 3.25-1 3.25-2.75a2 2 0 00-3.9-.6c-.2.6-.35 1.35-.35 2.35z" />
                </svg>
            );
        case "notifications":
            return (
                <svg {...common}>
                    <path d="M6 10a6 6 0 0112 0c0 4.2 1.25 5.7 2 6.5H4c.75-.8 2-2.3 2-6.5z" />
                    <path d="M10 19.5a2.1 2.1 0 004 0" />
                </svg>
            );
        case "reports":
            return (
                <svg {...common}>
                    <path d="M4.5 19.5v-7M11 19.5V6.5M17.5 19.5v-11" />
                    <path d="M3.5 19.5h17" />
                </svg>
            );
    }
}

/* =========================================================================
   HELPERS: dates, formatting
   ========================================================================= */

function isoDate(d: Date): string {
    return d.toISOString().slice(0, 10);
}

function daysFromNow(offset: number): string {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return isoDate(d);
}

function daysUntil(dateStr: string): number {
    const target = new Date(dateStr).getTime();
    const now = new Date().getTime();
    return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

function tierForPoints(lifetimePoints: number): TierName {
    let result: TierName = "Silver";
    for (const t of TIER_THRESHOLDS) {
        if (lifetimePoints >= t.min) result = t.tier;
    }
    return result;
}

function nextTierInfo(lifetimePoints: number): { next: TierName | null; remaining: number; pct: number } {
    const idx = TIER_THRESHOLDS.findIndex((t) => t.tier === tierForPoints(lifetimePoints));
    const next = TIER_THRESHOLDS[idx + 1];
    if (!next) return { next: null, remaining: 0, pct: 100 };
    const current = TIER_THRESHOLDS[idx];
    const span = next.min - current.min;
    const progressed = lifetimePoints - current.min;
    return {
        next: next.tier,
        remaining: next.min - lifetimePoints,
        pct: Math.max(0, Math.min(100, Math.round((progressed / span) * 100))),
    };
}

function pad(str: string | number, len: number): string {
    return String(str).padEnd(len, " ").slice(0, Math.max(len, String(str).length));
}

function padL(str: string | number, len: number): string {
    return String(str).padStart(len, " ");
}

/* =========================================================================
   ALGORITHMS: sorting + searching (implemented explicitly, not just .sort())
   ========================================================================= */

// Generic merge sort — O(n log n), stable.
function mergeSort<T>(items: T[], compare: (a: T, b: T) => number): T[] {
    if (items.length <= 1) return items;
    const mid = Math.floor(items.length / 2);
    const left = mergeSort(items.slice(0, mid), compare);
    const right = mergeSort(items.slice(mid), compare);
    const merged: T[] = [];
    let i = 0;
    let j = 0;
    while (i < left.length && j < right.length) {
        if (compare(left[i], right[j]) <= 0) merged.push(left[i++]);
        else merged.push(right[j++]);
    }
    while (i < left.length) merged.push(left[i++]);
    while (j < right.length) merged.push(right[j++]);
    return merged;
}

// Binary search by id — requires input already sorted by id. O(log n).
function binarySearchById<T extends { id: string }>(sortedById: T[], id: string): T | null {
    let lo = 0;
    let hi = sortedById.length - 1;
    const target = id.trim().toUpperCase();
    while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        const midId = sortedById[mid].id.toUpperCase();
        if (midId === target) return sortedById[mid];
        if (midId < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return null;
}

// Linear multi-criteria filter — O(n), applies every active predicate.
function filterItems<T>(items: T[], predicates: Array<(item: T) => boolean>): T[] {
    return items.filter((item) => predicates.every((p) => p(item)));
}

/* =========================================================================
   SAMPLE DATA
   ========================================================================= */

function buildMember(
    id: string,
    name: string,
    email: string,
    city: string,
    lifetimePoints: number,
    joinOffsetDays: number,
    ledger: PointsLedgerEntry[],
    promotions: string[]
): Member {
    const redeemed = ledger.filter((l) => l.type === "redeem").reduce((s, l) => s + l.amount, 0);
    const earned = ledger.filter((l) => l.type === "earn").reduce((s, l) => s + l.amount, 0);
    return {
        id,
        name,
        email,
        city,
        tier: tierForPoints(lifetimePoints),
        points: Math.max(0, earned - redeemed),
        lifetimePoints,
        joinDate: daysFromNow(-joinOffsetDays),
        lastActivity: daysFromNow(-Math.min(joinOffsetDays, 6)),
        ledger,
        promotions,
    };
}

function seedMembers(): Member[] {
    return [
        buildMember("M1001", "Aisha Rahman", "aisha.rahman@mail.com", "Kuala Lumpur", 9200, 620,
            [
                { id: "L1", date: daysFromNow(-40), type: "earn", amount: 4200, description: "Stay: 3 nights, Deluxe Suite", expiryDate: daysFromNow(15) },
                { id: "L2", date: daysFromNow(-10), type: "earn", amount: 5000, description: "Promo: Anniversary bonus", expiryDate: daysFromNow(320) },
            ],
            ["Complimentary breakfast on next stay", "Priority late checkout"]),
        buildMember("M1002", "Wei Chen Tan", "weichen.tan@mail.com", "Penang", 6400, 410,
            [
                { id: "L3", date: daysFromNow(-90), type: "earn", amount: 3600, description: "Stay: 2 nights, City View", expiryDate: daysFromNow(-3) },
                { id: "L4", date: daysFromNow(-20), type: "earn", amount: 2800, description: "Stay: Weekend package", expiryDate: daysFromNow(7) },
                { id: "L5", date: daysFromNow(-5), type: "redeem", amount: 800, description: "Redeemed: Airport Transfer" },
            ],
            ["Room upgrade offer, valid 30 days"]),
        buildMember("M1003", "Nur Fatimah Ismail", "nur.fatimah@mail.com", "Malacca", 2100, 95,
            [{ id: "L6", date: daysFromNow(-30), type: "earn", amount: 2100, description: "Stay: 1 night, Standard Room", expiryDate: daysFromNow(20) }],
            ["Welcome dining credit"]),
        buildMember("M1004", "Kevin Lim", "kevin.lim@mail.com", "Johor Bahru", 12500, 900,
            [
                { id: "L7", date: daysFromNow(-200), type: "earn", amount: 7000, description: "Stay: Corporate block booking", expiryDate: daysFromNow(-40) },
                { id: "L8", date: daysFromNow(-60), type: "earn", amount: 5500, description: "Stay: 4 nights, Executive Suite", expiryDate: daysFromNow(305) },
                { id: "L9", date: daysFromNow(-15), type: "redeem", amount: 6000, description: "Redeemed: Free Night Stay" },
            ],
            ["Platinum lounge access", "Complimentary spa upgrade"]),
        buildMember("M1005", "Siti Nabila", "siti.nabila@mail.com", "Ipoh", 800, 40,
            [{ id: "L10", date: daysFromNow(-12), type: "earn", amount: 800, description: "Stay: 1 night, Standard Room", expiryDate: daysFromNow(28) }],
            ["Welcome dining credit"]),
        buildMember("M1006", "Ryan Ooi", "ryan.ooi@mail.com", "Kuala Lumpur", 4300, 260,
            [
                { id: "L11", date: daysFromNow(-70), type: "earn", amount: 2600, description: "Stay: 2 nights, Deluxe Room", expiryDate: daysFromNow(10) },
                { id: "L12", date: daysFromNow(-25), type: "earn", amount: 1700, description: "Promo: Weekday special", expiryDate: daysFromNow(60) },
            ],
            ["Gold tier: free spa voucher on next stay"]),
        buildMember("M1007", "Priya Sundaram", "priya.sundaram@mail.com", "Seremban", 15800, 1100,
            [
                { id: "L13", date: daysFromNow(-400), type: "earn", amount: 9000, description: "Stay: Long-term corporate stay", expiryDate: daysFromNow(-100) },
                { id: "L14", date: daysFromNow(-45), type: "earn", amount: 6800, description: "Stay: 5 nights, Presidential Suite", expiryDate: daysFromNow(275) },
            ],
            ["Platinum lounge access", "Dedicated concierge"]),
        buildMember("M1008", "Farid Hakim", "farid.hakim@mail.com", "Malacca", 1450, 70,
            [{ id: "L15", date: daysFromNow(-18), type: "earn", amount: 1450, description: "Stay: 1 night, City View", expiryDate: daysFromNow(5) }],
            ["Welcome dining credit"]),
        buildMember("M1009", "Grace Lau", "grace.lau@mail.com", "Kuching", 5200, 330,
            [
                { id: "L16", date: daysFromNow(-100), type: "earn", amount: 3200, description: "Stay: 3 nights, Deluxe Room", expiryDate: daysFromNow(-8) },
                { id: "L17", date: daysFromNow(-14), type: "earn", amount: 2000, description: "Promo: Referral bonus", expiryDate: daysFromNow(18) },
            ],
            ["Gold tier: free spa voucher on next stay"]),
        buildMember("M1010", "Daniel Wong", "daniel.wong@mail.com", "Kota Kinabalu", 300, 15,
            [{ id: "L18", date: daysFromNow(-8), type: "earn", amount: 300, description: "Stay: 1 night, Standard Room", expiryDate: daysFromNow(3) }],
            ["Welcome dining credit"]),
    ];
}

function seedRedemptionRequests(): RedemptionRequest[] {
    return [
        { id: "RQ501", memberId: "M1004", rewardId: "R1", pointsCost: 6000, status: "Approved", requestDate: daysFromNow(-15), decisionDate: daysFromNow(-14) },
        { id: "RQ502", memberId: "M1002", rewardId: "R4", pointsCost: 800, status: "Approved", requestDate: daysFromNow(-5), decisionDate: daysFromNow(-5) },
        { id: "RQ503", memberId: "M1001", rewardId: "R3", pointsCost: 1500, status: "Pending", requestDate: daysFromNow(-2) },
        { id: "RQ504", memberId: "M1007", rewardId: "R2", pointsCost: 2000, status: "Pending", requestDate: daysFromNow(-1) },
        { id: "RQ505", memberId: "M1006", rewardId: "R5", pointsCost: 1000, status: "Rejected", requestDate: daysFromNow(-20), decisionDate: daysFromNow(-19) },
        { id: "RQ506", memberId: "M1009", rewardId: "R6", pointsCost: 400, status: "Pending", requestDate: daysFromNow(0) },
    ];
}

/* =========================================================================
   SMALL UI PRIMITIVES
   ========================================================================= */

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
            {children}
        </div>
    );
}

function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
            <div>
                <h3 className="text-sm font-semibold tracking-wide text-[#0b1830]">{title}</h3>
                {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
            </div>
            {action}
        </div>
    );
}

function TierBadge({ tier }: { tier: TierName }) {
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${TIER_STYLES[tier].badge}`}>
            {tier}
        </span>
    );
}

function StatusPill({ status }: { status: RequestStatus }) {
    const styles: Record<RequestStatus, string> = {
        Pending: "bg-blue-50 text-blue-700 border-blue-200",
        Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
        Rejected: "bg-rose-50 text-rose-700 border-rose-200",
    };
    return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>{status}</span>;
}

function KpiCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
    return (
        <Card className="p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-[#0b1830]">{value}</p>
            {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
        </Card>
    );
}

// Circular tier-progress ring — signature element linking a member to their next tier.
function TierRing({ pct, tier }: { pct: number; tier: TierName }) {
    const r = 26;
    const c = 2 * Math.PI * r;
    const offset = c - (pct / 100) * c;
    return (
        <svg width="64" height="64" viewBox="0 0 64 64" className="shrink-0">
            <circle cx="32" cy="32" r={r} fill="none" stroke="#e6ebf5" strokeWidth="6" />
            <circle
                cx="32"
                cy="32"
                r={r}
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={c}
                strokeDashoffset={offset}
                transform="rotate(-90 32 32)"
                className={TIER_STYLES[tier].ring}
            />
            <text x="32" y="37" textAnchor="middle" fontSize="13" fontWeight="600" fill="#0b1830">
                {pct}%
            </text>
        </svg>
    );
}

/* =========================================================================
   TOP NAVIGATION
   Horizontal, grouped tab bar with an underline indicator — replaces the
   previous dark vertical sidebar. Groups are visually separated by hairline
   dividers so the operational structure (Overview / Member Operations /
   Insights) still reads clearly without needing a full-height rail.
   ========================================================================= */

function TopNav({ tab, setTab, notificationCount, memberCount }: {
    tab: TabKey;
    setTab: (t: TabKey) => void;
    notificationCount: number;
    memberCount: number;
}) {
    return (
        <header className="flex h-16 shrink-0 items-center gap-1 border-b border-slate-200 bg-white px-6">          
            {/* Grouped tabs */}
            <nav className="flex flex-1 items-center gap-0.5 overflow-x-auto">
                {NAV_GROUPS.map((group, gi) => (
                    <div key={group} className={`flex items-center gap-0.5 ${gi > 0 ? "" : ""}`}>
                        {NAV.filter((item) => item.group === group).map((item) => {
                            const active = tab === item.key;
                            return (
                                <button
                                    key={item.key}
                                    onClick={() => setTab(item.key)}
                                    title={item.description}
                                    className={`group relative flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors ${active ? "text-blue-700" : "text-slate-500 hover:bg-slate-50 hover:text-[#0b1830]"
                                        }`}
                                >
                                    <NavIcon
                                        tab={item.key}
                                        className={`h-[17px] w-[17px] shrink-0 ${active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-500"}`}
                                    />
                                    <span className={active ? "font-medium" : ""}>{item.label}</span>
                                    {item.key === "notifications" && notificationCount > 0 && (
                                        <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                                            {notificationCount}
                                        </span>
                                    )}
                                    <span
                                        className={`absolute inset-x-2 -bottom-[1px] h-[2px] rounded-full transition-opacity ${active ? "bg-blue-600 opacity-100" : "opacity-0"
                                            }`}
                                    />
                                </button>
                            );
                        })}
                    </div>
                ))}
            </nav>          
        </header>
    );
}

/* =========================================================================
   MAIN COMPONENT
   ========================================================================= */

export default function LoyaltyAndMember() {
    const [tab, setTab] = useState<TabKey>("dashboard");
    const [members, setMembers] = useState<Member[]>(() => seedMembers());
    const [requests, setRequests] = useState<RedemptionRequest[]>(() => seedRedemptionRequests());
    const [selectedMemberId, setSelectedMemberId] = useState<string>("M1001");
    const [toast, setToast] = useState<string | null>(null);

    const flash = (msg: string) => {
        setToast(msg);
        window.setTimeout(() => setToast(null), 2600);
    };

    const selectedMember = members.find((m) => m.id === selectedMemberId) ?? members[0];

    /* --------------------------- domain actions --------------------------- */

    function addPoints(memberId: string, amount: number, description: string) {
        setMembers((prev) =>
            prev.map((m) => {
                if (m.id !== memberId || amount <= 0) return m;
                const newLifetime = m.lifetimePoints + amount;
                const entry: PointsLedgerEntry = {
                    id: `L${Date.now()}`,
                    date: isoDate(new Date()),
                    type: "earn",
                    amount,
                    description,
                    expiryDate: daysFromNow(365),
                };
                const oldTier = m.tier;
                const newTier = tierForPoints(newLifetime);
                if (newTier !== oldTier) flash(`${m.name} upgraded from ${oldTier} to ${newTier}!`);
                return {
                    ...m,
                    points: m.points + amount,
                    lifetimePoints: newLifetime,
                    tier: newTier,
                    lastActivity: isoDate(new Date()),
                    ledger: [entry, ...m.ledger],
                };
            })
        );
    }

    function requestRedemption(memberId: string, rewardId: string) {
        const member = members.find((m) => m.id === memberId);
        const reward = REWARDS.find((r) => r.id === rewardId);
        if (!member || !reward) return;
        if (member.points < reward.cost) {
            flash(`${member.name} does not have enough points for ${reward.name}.`);
            return;
        }
        const newRequest: RedemptionRequest = {
            id: `RQ${Math.floor(Math.random() * 9000) + 1000}`,
            memberId,
            rewardId,
            pointsCost: reward.cost,
            status: "Pending",
            requestDate: isoDate(new Date()),
        };
        setRequests((prev) => [newRequest, ...prev]);
        flash(`Redemption request for ${reward.name} submitted — awaiting processing.`);
    }

    function processRequest(requestId: string, action: "Approved" | "Rejected") {
        setRequests((prev) =>
            prev.map((r) => (r.id === requestId ? { ...r, status: action, decisionDate: isoDate(new Date()) } : r))
        );
        const req = requests.find((r) => r.id === requestId);
        if (req && action === "Approved") {
            setMembers((prev) =>
                prev.map((m) => {
                    if (m.id !== req.memberId) return m;
                    const reward = REWARDS.find((rw) => rw.id === req.rewardId);
                    const entry: PointsLedgerEntry = {
                        id: `L${Date.now()}`,
                        date: isoDate(new Date()),
                        type: "redeem",
                        amount: req.pointsCost,
                        description: `Redeemed: ${reward?.name ?? req.rewardId}`,
                    };
                    return { ...m, points: Math.max(0, m.points - req.pointsCost), ledger: [entry, ...m.ledger] };
                })
            );
        }
    }

    /* ------------------------------ derived -------------------------------- */

    const expiringSoon = useMemo(() => {
        const out: { member: Member; entry: PointsLedgerEntry; days: number }[] = [];
        for (const m of members) {
            for (const e of m.ledger) {
                if (e.type === "earn" && e.expiryDate) {
                    const d = daysUntil(e.expiryDate);
                    if (d >= 0 && d <= 30) out.push({ member: m, entry: e, days: d });
                }
            }
        }
        return mergeSort(out, (a, b) => a.days - b.days);
    }, [members]);

    const pendingRequests = requests.filter((r) => r.status === "Pending");

    const notificationCount = expiringSoon.length + pendingRequests.length;

    /* ------------------------------- render -------------------------------- */

    return (
        <main className="flex h-screen w-full flex-1 flex-col overflow-hidden bg-[#f4f7fc] text-[#0b1830]" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
            <TopNav tab={tab} setTab={setTab} notificationCount={notificationCount} memberCount={members.length} />

            {toast && (
                <div className="pointer-events-none fixed inset-x-0 top-20 z-50 flex justify-center px-4">
                    <div className="pointer-events-auto rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-medium text-[#0b1830] shadow-lg">
                        {toast}
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto px-8 py-6">
                {tab === "dashboard" && (
                    <DashboardTab members={members} requests={requests} expiringSoon={expiringSoon} pendingRequests={pendingRequests} goTo={setTab} />
                )}
                {tab === "members" && (
                    <MembersTab members={members} selectedMemberId={selectedMemberId} onSelect={setSelectedMemberId} />
                )}
                {tab === "points" && (
                    <PointsTab members={members} onAddPoints={addPoints} onRedeem={requestRedemption} />
                )}
                {tab === "tiers" && <TiersTab members={members} />}
                {tab === "redemption" && (
                    <RedemptionTab members={members} requests={requests} onProcess={processRequest} />
                )}
                {tab === "notifications" && (
                    <NotificationsTab members={members} expiringSoon={expiringSoon} pendingRequests={pendingRequests} requests={requests} />
                )}
                {tab === "reports" && <ReportsTab members={members} requests={requests} />}
            </div>
        </main>
    );
}

/* =========================================================================
   DASHBOARD
   ========================================================================= */

function DashboardTab({
    members,
    requests,
    expiringSoon,
    pendingRequests,
    goTo,
}: {
    members: Member[];
    requests: RedemptionRequest[];
    expiringSoon: { member: Member; entry: PointsLedgerEntry; days: number }[];
    pendingRequests: RedemptionRequest[];
    goTo: (t: TabKey) => void;
}) {
    const totalIssued = members.reduce((s, m) => s + m.ledger.filter((l) => l.type === "earn").reduce((a, l) => a + l.amount, 0), 0);
    const totalRedeemed = members.reduce((s, m) => s + m.ledger.filter((l) => l.type === "redeem").reduce((a, l) => a + l.amount, 0), 0);
    const nearUpgrade = members.filter((m) => nextTierInfo(m.lifetimePoints).remaining <= 1000 && nextTierInfo(m.lifetimePoints).next).length;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <KpiCard label="Total members" value={String(members.length)} />
                <KpiCard label="Points issued" value={totalIssued.toLocaleString()} />
                <KpiCard label="Points redeemed" value={totalRedeemed.toLocaleString()} />
                <KpiCard label="Pending requests" value={String(pendingRequests.length)} hint="Awaiting redemption processing" />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader
                        title="Points expiring soon"
                        subtitle="Within the next 30 days"
                        action={
                            <button onClick={() => goTo("notifications")} className="text-xs font-medium text-blue-600 hover:underline">
                                View all
                            </button>
                        }
                    />
                    <div className="divide-y divide-slate-100">
                        {expiringSoon.slice(0, 5).map((row) => (
                            <div key={row.entry.id} className="flex items-center justify-between px-5 py-3 text-sm">
                                <div>
                                    <p className="font-medium text-[#0b1830]">{row.member.name}</p>
                                    <p className="text-xs text-slate-500">{row.entry.amount.toLocaleString()} pts &middot; {row.entry.description}</p>
                                </div>
                                <span className={`text-xs font-semibold ${row.days <= 7 ? "text-rose-600" : "text-amber-600"}`}>{row.days}d left</span>
                            </div>
                        ))}
                        {expiringSoon.length === 0 && <p className="px-5 py-6 text-sm text-slate-400">Nothing expiring soon.</p>}
                    </div>
                </Card>

                <Card>
                    <CardHeader
                        title="Redemption requests"
                        subtitle={`${nearUpgrade} members nearing their next tier`}
                        action={
                            <button onClick={() => goTo("redemption")} className="text-xs font-medium text-blue-600 hover:underline">
                                Process
                            </button>
                        }
                    />
                    <div className="divide-y divide-slate-100">
                        {requests.slice(0, 5).map((r) => {
                            const member = members.find((m) => m.id === r.memberId);
                            const reward = REWARDS.find((rw) => rw.id === r.rewardId);
                            return (
                                <div key={r.id} className="flex items-center justify-between px-5 py-3 text-sm">
                                    <div>
                                        <p className="font-medium text-[#0b1830]">{member?.name}</p>
                                        <p className="text-xs text-slate-500">{reward?.name} &middot; {r.pointsCost.toLocaleString()} pts</p>
                                    </div>
                                    <StatusPill status={r.status} />
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>
        </div>
    );
}

/* =========================================================================
   MEMBERS
   ========================================================================= */

function MembersTab({
    members,
    selectedMemberId,
    onSelect,
}: {
    members: Member[];
    selectedMemberId: string;
    onSelect: (id: string) => void;
}) {
    const [query, setQuery] = useState("");
    const filtered = filterItems(members, [
        (m) => (query ? m.name.toLowerCase().includes(query.toLowerCase()) || m.id.toLowerCase().includes(query.toLowerCase()) : true),
    ]);
    const selected = members.find((m) => m.id === selectedMemberId) ?? members[0];
    const { next, remaining, pct } = nextTierInfo(selected.lifetimePoints);

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-1">
                <CardHeader title="Member directory" subtitle={`${filtered.length} of ${members.length} members`} />
                <div className="px-5 py-3">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name or ID..."
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                    />
                </div>
                <div className="max-h-[520px] divide-y divide-slate-100 overflow-y-auto">
                    {filtered.map((m) => (
                        <button
                            key={m.id}
                            onClick={() => onSelect(m.id)}
                            className={`flex w-full items-center justify-between px-5 py-3 text-left text-sm hover:bg-slate-50 ${m.id === selected.id ? "bg-blue-50" : ""
                                }`}
                        >
                            <div>
                                <p className="font-medium text-[#0b1830]">{m.name}</p>
                                <p className="text-xs text-slate-500">{m.id} &middot; {m.points.toLocaleString()} pts</p>
                            </div>
                            <TierBadge tier={m.tier} />
                        </button>
                    ))}
                </div>
            </Card>

            <Card className="lg:col-span-2">
                <CardHeader title={selected.name} subtitle={`${selected.id} \u2022 ${selected.email} \u2022 ${selected.city}`} action={<TierBadge tier={selected.tier} />} />
                <div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-3">
                    <div className="flex items-center gap-4">
                        <TierRing pct={pct} tier={selected.tier} />
                        <div>
                            <p className="text-xs text-slate-500">{next ? `To ${next}` : "Top tier reached"}</p>
                            <p className="text-sm font-medium text-[#0b1830]">{next ? `${remaining.toLocaleString()} pts to go` : "Platinum status"}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">Redeemable balance</p>
                        <p className="mt-1 text-2xl font-semibold text-[#0b1830]">{selected.points.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">Lifetime points</p>
                        <p className="mt-1 text-2xl font-semibold text-[#0b1830]">{selected.lifetimePoints.toLocaleString()}</p>
                    </div>
                </div>

                <div className="border-t border-slate-100 px-5 py-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Personalized promotions</p>
                    <div className="flex flex-wrap gap-2">
                        {selected.promotions.map((p, i) => (
                            <span key={i} className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-blue-700">{p}</span>
                        ))}
                    </div>
                </div>

                <div className="border-t border-slate-100 px-5 py-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Points ledger</p>
                    <div className="max-h-64 space-y-2 overflow-y-auto">
                        {selected.ledger.map((l) => (
                            <div key={l.id} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm">
                                <div>
                                    <p className="text-[#0b1830]">{l.description}</p>
                                    <p className="text-xs text-slate-400">{l.date}{l.expiryDate ? ` \u2022 expires ${l.expiryDate}` : ""}</p>
                                </div>
                                <span className={`font-semibold ${l.type === "earn" ? "text-emerald-600" : "text-rose-600"}`}>
                                    {l.type === "earn" ? "+" : "-"}{l.amount.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
}

/* =========================================================================
   POINTS (accumulation + redemption)
   ========================================================================= */

function PointsTab({
    members,
    onAddPoints,
    onRedeem,
}: {
    members: Member[];
    onAddPoints: (memberId: string, amount: number, description: string) => void;
    onRedeem: (memberId: string, rewardId: string) => void;
}) {
    const [memberId, setMemberId] = useState(members[0]?.id ?? "");
    const [amount, setAmount] = useState(500);
    const [reason, setReason] = useState("Stay: room charge");
    const [redeemMember, setRedeemMember] = useState(members[0]?.id ?? "");

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader title="Award points" subtitle="Record a qualifying stay or purchase" />
                <div className="space-y-4 p-5">
                    <div>
                        <label className="text-xs font-medium text-slate-500">Member</label>
                        <select value={memberId} onChange={(e) => setMemberId(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                            {members.map((m) => (
                                <option key={m.id} value={m.id}>{m.name} ({m.id})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-slate-500">Points</label>
                        <input type="number" value={amount} min={1} onChange={(e) => setAmount(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-slate-500">Reason</label>
                        <input value={reason} onChange={(e) => setReason(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                    </div>
                    <button
                        onClick={() => memberId && onAddPoints(memberId, amount, reason)}
                        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        Add points
                    </button>
                </div>
            </Card>

            <Card>
                <CardHeader title="Rewards catalog" subtitle="Submit a redemption request on a member's behalf" />
                <div className="space-y-3 p-5">
                    <select value={redeemMember} onChange={(e) => setRedeemMember(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                        {members.map((m) => (
                            <option key={m.id} value={m.id}>{m.name} \u2014 {m.points.toLocaleString()} pts</option>
                        ))}
                    </select>
                    <div className="divide-y divide-slate-100 rounded-lg border border-slate-100">
                        {REWARDS.map((r) => (
                            <div key={r.id} className="flex items-center justify-between px-4 py-3 text-sm">
                                <div>
                                    <p className="font-medium text-[#0b1830]">{r.name}</p>
                                    <p className="text-xs text-slate-500">{r.category} &middot; {r.cost.toLocaleString()} pts</p>
                                </div>
                                <button
                                    onClick={() => onRedeem(redeemMember, r.id)}
                                    className="rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50"
                                >
                                    Request
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
}

/* =========================================================================
   TIERS
   ========================================================================= */

function TiersTab({ members }: { members: Member[] }) {
    const sorted = mergeSort(members, (a, b) => b.lifetimePoints - a.lifetimePoints);
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader title="Tier thresholds" subtitle="Lifetime points required per tier" />
                <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3">
                    {TIER_THRESHOLDS.map((t) => (
                        <div key={t.tier} className="rounded-xl border border-slate-100 p-4">
                            <TierBadge tier={t.tier} />
                            <p className="mt-2 text-lg font-semibold text-[#0b1830]">{t.min.toLocaleString()}+ pts</p>
                        </div>
                    ))}
                </div>
            </Card>

            <Card>
                <CardHeader title="Member progression" subtitle="Sorted by lifetime points, highest first" />
                <div className="divide-y divide-slate-100">
                    {sorted.map((m) => {
                        const { next, remaining, pct } = nextTierInfo(m.lifetimePoints);
                        return (
                            <div key={m.id} className="flex items-center gap-4 px-5 py-4">
                                <TierRing pct={pct} tier={m.tier} />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-[#0b1830]">{m.name}</p>
                                        <TierBadge tier={m.tier} />
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        {m.lifetimePoints.toLocaleString()} lifetime pts {next ? `\u2014 ${remaining.toLocaleString()} to ${next}` : "\u2014 top tier"}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
}

/* =========================================================================
   REDEMPTION PROCESSING
   ========================================================================= */

function RedemptionTab({
    members,
    requests,
    onProcess,
}: {
    members: Member[];
    requests: RedemptionRequest[];
    onProcess: (id: string, action: "Approved" | "Rejected") => void;
}) {
    const [filter, setFilter] = useState<RequestStatus | "All">("Pending");
    const visible = filterItems(requests, [(r) => (filter === "All" ? true : r.status === filter)]);
    const sorted = mergeSort(visible, (a, b) => (a.requestDate < b.requestDate ? 1 : -1));

    return (
        <Card>
            <CardHeader
                title="Redemption processing"
                subtitle={`${requests.filter((r) => r.status === "Pending").length} pending requests`}
                action={
                    <select value={filter} onChange={(e) => setFilter(e.target.value as RequestStatus | "All")} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs">
                        {(["All", "Pending", "Approved", "Rejected"] as const).map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                }
            />
            <div className="divide-y divide-slate-100">
                {sorted.map((r) => {
                    const member = members.find((m) => m.id === r.memberId);
                    const reward = REWARDS.find((rw) => rw.id === r.rewardId);
                    return (
                        <div key={r.id} className="flex items-center justify-between px-5 py-4">
                            <div>
                                <p className="font-medium text-[#0b1830]">{member?.name} <span className="text-xs font-normal text-slate-400">{r.id}</span></p>
                                <p className="text-xs text-slate-500">{reward?.name} &middot; {r.pointsCost.toLocaleString()} pts &middot; requested {r.requestDate}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <StatusPill status={r.status} />
                                {r.status === "Pending" && (
                                    <div className="flex gap-2">
                                        <button onClick={() => onProcess(r.id, "Approved")} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700">Approve</button>
                                        <button onClick={() => onProcess(r.id, "Rejected")} className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50">Reject</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
                {sorted.length === 0 && <p className="px-5 py-6 text-sm text-slate-400">No requests match this filter.</p>}
            </div>
        </Card>
    );
}

/* =========================================================================
   NOTIFICATIONS
   ========================================================================= */

function NotificationsTab({
    members,
    expiringSoon,
    pendingRequests,
    requests,
}: {
    members: Member[];
    expiringSoon: { member: Member; entry: PointsLedgerEntry; days: number }[];
    pendingRequests: RedemptionRequest[];
    requests: RedemptionRequest[];
}) {
    const nearUpgrade = mergeSort(
        members.filter((m) => {
            const info = nextTierInfo(m.lifetimePoints);
            return info.next && info.remaining <= 1000;
        }),
        (a, b) => nextTierInfo(a.lifetimePoints).remaining - nextTierInfo(b.lifetimePoints).remaining
    );

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader title="Points expiring within 30 days" subtitle={`${expiringSoon.length} ledger entries`} />
                <div className="divide-y divide-slate-100">
                    {expiringSoon.map((row) => (
                        <div key={row.entry.id} className="flex items-center justify-between px-5 py-3 text-sm">
                            <div>
                                <p className="font-medium text-[#0b1830]">{row.member.name}</p>
                                <p className="text-xs text-slate-500">{row.entry.amount.toLocaleString()} pts &middot; {row.entry.description}</p>
                            </div>
                            <span className={`text-xs font-semibold ${row.days <= 7 ? "text-rose-600" : "text-amber-600"}`}>Expires in {row.days}d</span>
                        </div>
                    ))}
                    {expiringSoon.length === 0 && <p className="px-5 py-6 text-sm text-slate-400">No points expiring soon.</p>}
                </div>
            </Card>

            <Card>
                <CardHeader title="Redemption requests awaiting action" subtitle={`${pendingRequests.length} pending`} />
                <div className="divide-y divide-slate-100">
                    {pendingRequests.map((r) => {
                        const member = members.find((m) => m.id === r.memberId);
                        const reward = REWARDS.find((rw) => rw.id === r.rewardId);
                        return (
                            <div key={r.id} className="flex items-center justify-between px-5 py-3 text-sm">
                                <p className="font-medium text-[#0b1830]">{member?.name}</p>
                                <p className="text-xs text-slate-500">{reward?.name} &middot; {r.pointsCost.toLocaleString()} pts</p>
                            </div>
                        );
                    })}
                    {pendingRequests.length === 0 && <p className="px-5 py-6 text-sm text-slate-400">Nothing pending.</p>}
                </div>
            </Card>

            <Card>
                <CardHeader title="Members nearing tier upgrade" subtitle="Within 1,000 points of the next tier" />
                <div className="divide-y divide-slate-100">
                    {nearUpgrade.map((m) => {
                        const info = nextTierInfo(m.lifetimePoints);
                        return (
                            <div key={m.id} className="flex items-center justify-between px-5 py-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-[#0b1830]">{m.name}</p>
                                    <TierBadge tier={m.tier} />
                                </div>
                                <span className="text-xs font-semibold text-blue-600">{info.remaining.toLocaleString()} pts to {info.next}</span>
                            </div>
                        );
                    })}
                    {nearUpgrade.length === 0 && <p className="px-5 py-6 text-sm text-slate-400">No members close to upgrading.</p>}
                </div>
            </Card>
        </div>
    );
}

/* =========================================================================
   REPORTS — combines filtering, searching, and sorting; renders as a
   console-style, fixed-width text report suitable for management review.
   ========================================================================= */

function ReportsTab({ members, requests }: { members: Member[]; requests: RedemptionRequest[] }) {
    const [reportKind, setReportKind] = useState<"members" | "redemption">("members");

    // --- Member Performance Report filters/sort ---
    const [mTier, setMTier] = useState<TierName | "All">("All");
    const [mMinPoints, setMMinPoints] = useState(0);
    const [mSearch, setMSearch] = useState("");
    const [mSortBy, setMSortBy] = useState<"points" | "name" | "joinDate">("points");

    // --- Redemption Activity Report filters/sort ---
    const [rStatus, setRStatus] = useState<RequestStatus | "All">("All");
    const [rCategory, setRCategory] = useState<string>("All");
    const [rSortBy, setRSortBy] = useState<"date" | "points">("date");

    const [output, setOutput] = useState<string[]>([
        "TARUMT RESORTS — LOYALTY & REWARDS REPORTING CONSOLE",
        "Select a report, set filters, then click Generate.",
    ]);

    function generateMemberReport() {
        const lines: string[] = [];
        const bySearch = mSearch.trim();
        let directHit: Member | null = null;
        if (bySearch && /^M?\d+$/i.test(bySearch)) {
            const normalizedId = bySearch.toUpperCase().startsWith("M") ? bySearch.toUpperCase() : `M${bySearch}`;
            const sortedById = mergeSort(members, (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
            directHit = binarySearchById(sortedById, normalizedId);
        }

        const filtered = filterItems(members, [
            (m) => (mTier === "All" ? true : m.tier === mTier),
            (m) => m.points >= mMinPoints,
            (m) => (bySearch ? m.name.toLowerCase().includes(bySearch.toLowerCase()) || m.id.toLowerCase().includes(bySearch.toLowerCase()) : true),
        ]);

        const compareFns: Record<typeof mSortBy, (a: Member, b: Member) => number> = {
            points: (a, b) => b.points - a.points,
            name: (a, b) => a.name.localeCompare(b.name),
            joinDate: (a, b) => (a.joinDate < b.joinDate ? -1 : a.joinDate > b.joinDate ? 1 : 0),
        };
        const sorted = mergeSort(filtered, compareFns[mSortBy]);

        lines.push("=".repeat(78));
        lines.push("MEMBER PERFORMANCE REPORT".padEnd(50) + `Generated: ${isoDate(new Date())}`);
        lines.push("=".repeat(78));
        lines.push(`Filters -> Tier: ${mTier} | Min points: ${mMinPoints} | Search: "${bySearch || "(none)"}" | Sort: ${mSortBy}`);
        lines.push("-".repeat(78));

        if (directHit) {
            lines.push(`DIRECT LOOKUP (binary search on ID "${directHit.id}"): FOUND`);
            lines.push(`  ${directHit.name} | ${directHit.tier} | ${directHit.points.toLocaleString()} pts | joined ${directHit.joinDate}`);
            lines.push("-".repeat(78));
        } else if (bySearch && /^M?\d+$/i.test(bySearch)) {
            lines.push(`DIRECT LOOKUP (binary search on ID "${bySearch}"): NOT FOUND`);
            lines.push("-".repeat(78));
        }

        lines.push(pad("ID", 8) + pad("NAME", 20) + pad("TIER", 10) + padL("POINTS", 10) + "   " + pad("JOINED", 12));
        lines.push("-".repeat(78));
        for (const m of sorted) {
            lines.push(pad(m.id, 8) + pad(m.name, 20) + pad(m.tier, 10) + padL(m.points.toLocaleString(), 10) + "   " + pad(m.joinDate, 12));
        }
        lines.push("-".repeat(78));

        const totalPoints = sorted.reduce((s, m) => s + m.points, 0);
        const avgPoints = sorted.length ? Math.round(totalPoints / sorted.length) : 0;
        const byTier: Record<string, number> = {};
        for (const m of sorted) byTier[m.tier] = (byTier[m.tier] ?? 0) + 1;

        lines.push(`Matched records: ${sorted.length}`);
        lines.push(`Total points (matched): ${totalPoints.toLocaleString()}   Average per member: ${avgPoints.toLocaleString()}`);
        lines.push(`Tier breakdown: ${Object.entries(byTier).map(([t, c]) => `${t}=${c}`).join("  ") || "none"}`);
        lines.push("=".repeat(78));

        setOutput(lines);
    }

    function generateRedemptionReport() {
        const lines: string[] = [];
        const filtered = filterItems(requests, [
            (r) => (rStatus === "All" ? true : r.status === rStatus),
            (r) => {
                if (rCategory === "All") return true;
                const reward = REWARDS.find((rw) => rw.id === r.rewardId);
                return reward?.category === rCategory;
            },
        ]);

        const compareFns: Record<typeof rSortBy, (a: RedemptionRequest, b: RedemptionRequest) => number> = {
            date: (a, b) => (a.requestDate < b.requestDate ? 1 : a.requestDate > b.requestDate ? -1 : 0),
            points: (a, b) => b.pointsCost - a.pointsCost,
        };
        const sorted = mergeSort(filtered, compareFns[rSortBy]);

        lines.push("=".repeat(84));
        lines.push("REDEMPTION ACTIVITY REPORT".padEnd(55) + `Generated: ${isoDate(new Date())}`);
        lines.push("=".repeat(84));
        lines.push(`Filters -> Status: ${rStatus} | Category: ${rCategory} | Sort: ${rSortBy}`);
        lines.push("-".repeat(84));
        lines.push(
            pad("REQ ID", 9) + pad("MEMBER", 18) + pad("REWARD", 22) + padL("POINTS", 8) + "   " + pad("STATUS", 10) + pad("DATE", 12)
        );
        lines.push("-".repeat(84));

        for (const r of sorted) {
            const member = members.find((m) => m.id === r.memberId);
            const reward = REWARDS.find((rw) => rw.id === r.rewardId);
            lines.push(
                pad(r.id, 9) +
                pad(member?.name ?? r.memberId, 18) +
                pad(reward?.name ?? r.rewardId, 22) +
                padL(r.pointsCost.toLocaleString(), 8) +
                "   " +
                pad(r.status, 10) +
                pad(r.requestDate, 12)
            );
        }
        lines.push("-".repeat(84));

        const totalPointsRedeemed = sorted.filter((r) => r.status === "Approved").reduce((s, r) => s + r.pointsCost, 0);
        const byStatus: Record<string, number> = {};
        for (const r of sorted) byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;

        lines.push(`Matched records: ${sorted.length}`);
        lines.push(`Points redeemed (approved only): ${totalPointsRedeemed.toLocaleString()}`);
        lines.push(`Status breakdown: ${Object.entries(byStatus).map(([s, c]) => `${s}=${c}`).join("  ") || "none"}`);
        lines.push("=".repeat(84));

        setOutput(lines);
    }

    const rewardCategories = ["All", ...Array.from(new Set(REWARDS.map((r) => r.category)))];

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader
                    title="Report builder"
                    subtitle="Combines filtering, searching, and sorting before printing to the console"
                    action={
                        <select value={reportKind} onChange={(e) => setReportKind(e.target.value as "members" | "redemption")} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs">
                            <option value="members">Member Performance</option>
                            <option value="redemption">Redemption Activity</option>
                        </select>
                    }
                />

                {reportKind === "members" ? (
                    <div className="space-y-4 p-5">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-medium text-slate-500">Tier</label>
                                <select value={mTier} onChange={(e) => setMTier(e.target.value as TierName | "All")} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                                    {(["All", "Silver", "Gold", "Platinum"] as const).map((t) => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500">Min. points</label>
                                <input type="number" value={mMinPoints} onChange={(e) => setMMinPoints(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500">Search (name or ID, e.g. "M1004")</label>
                            <input value={mSearch} onChange={(e) => setMSearch(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Leave blank to include everyone" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500">Sort by</label>
                            <select value={mSortBy} onChange={(e) => setMSortBy(e.target.value as typeof mSortBy)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                                <option value="points">Points (high to low)</option>
                                <option value="name">Name (A-Z)</option>
                                <option value="joinDate">Join date (oldest first)</option>
                            </select>
                        </div>
                        <button onClick={generateMemberReport} className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                            Generate report
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4 p-5">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-medium text-slate-500">Status</label>
                                <select value={rStatus} onChange={(e) => setRStatus(e.target.value as RequestStatus | "All")} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                                    {(["All", "Pending", "Approved", "Rejected"] as const).map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500">Reward category</label>
                                <select value={rCategory} onChange={(e) => setRCategory(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                                    {rewardCategories.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500">Sort by</label>
                            <select value={rSortBy} onChange={(e) => setRSortBy(e.target.value as typeof rSortBy)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                                <option value="date">Request date (newest first)</option>
                                <option value="points">Points cost (high to low)</option>
                            </select>
                        </div>
                        <button onClick={generateRedemptionReport} className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                            Generate report
                        </button>
                    </div>
                )}
            </Card>

            <Card className="overflow-hidden">
                <CardHeader title="Console output" subtitle="Formatted for management review" />
                <pre className="max-h-[560px] overflow-auto whitespace-pre bg-[#081226] p-5 font-mono text-[11px] leading-relaxed text-blue-100">
                    {output.join("\n")}
                </pre>
            </Card>
        </div>
    );
}