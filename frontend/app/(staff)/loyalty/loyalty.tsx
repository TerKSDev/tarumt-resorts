import { useEffect, useMemo, useState } from "react";
import { type MetaFunction } from "react-router";
import { Crown, Sparkles, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import type { Member, PointsLedgerEntry, RedemptionRequest, TabKey } from "../../../lib/types/loyalty";
import { NAV, REWARDS } from "../../../lib/config/loyalty";
import { daysUntil, mergeSort, tierForPoints } from "../../../lib/util/loyalty";
import {
  applyApprovedRedemptions,
  applyPointsToMembers,
  awardPointsApi,
  createRedeemApi,
  fetchMembersFromApi,
  fetchPointsFromApi,
  fetchRedeemFromApi,
  mapRedeemToRequest,
  updateCustomerTierApi,
  updateRedeemStatusApi,
} from "../../../lib/api/loyalty";

import DashboardTab from "./components/DashboardTab";
import MembersTab from "./components/MembersTab";
import PointsTab from "./components/PointsTab";
import TiersTab from "./components/TiersTab";
import RedemptionTab from "./components/RedemptionTab";
import NotificationsTab from "./components/NotificationsTab";
import ReportsTab from "./components/ReportsTab";

export const meta: MetaFunction = () => [
  { title: "VIP Loyalty & Member Services | TARUMT Resorts" },
];

export default function LoyaltyAndMember() {
  const [members, setMembers] = useState<Member[]>([]);
  const [requests, setRequests] = useState<RedemptionRequest[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3200);
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [rawMembers, rawPoints, rawRedeems] = await Promise.all([
          fetchMembersFromApi().catch(() => []),
          fetchPointsFromApi().catch(() => []),
          fetchRedeemFromApi().catch(() => []),
        ]);
        if (!isMounted) return;

        const baseRequests: RedemptionRequest[] = rawRedeems
          .map(mapRedeemToRequest)
          .filter(Boolean) as RedemptionRequest[];

        let unified = rawMembers.map((m) => ({
          ...m,
          ledger: [] as PointsLedgerEntry[],
        }));
        unified = applyPointsToMembers(unified, rawPoints);
        unified = applyApprovedRedemptions(unified, baseRequests);

        setMembers(unified);
        setRequests(baseRequests);
        if (unified.length && !selectedMemberId) {
          setSelectedMemberId(unified[0].id);
        }
      } catch (err) {
        console.error("Failed to load initial loyalty data", err);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const expiringSoon = useMemo(() => {
    const list: { member: Member; entry: PointsLedgerEntry; days: number }[] = [];
    members.forEach((m) => {
      m.ledger.forEach((e) => {
        if (e.type === "earn" && e.expiryDate) {
          const d = daysUntil(e.expiryDate);
          if (d >= 0 && d <= 30) list.push({ member: m, entry: e, days: d });
        }
      });
    });
    return mergeSort(list, (a, b) => a.days - b.days);
  }, [members]);

  const pendingRequests = useMemo(
    () => requests.filter((r) => r.status === "Pending"),
    [requests],
  );

  const handleAddPoints = async (memberId: string, amount: number, description: string) => {
    const num = Math.abs(Number(amount));
    if (!num) return;

    try {
      await awardPointsApi(memberId, num, description);
    } catch (e: any) {
      console.warn("Backend awardPoints failed, applying optimistic update", e);
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    const expDate = new Date();
    expDate.setFullYear(expDate.getFullYear() + 1);

    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== memberId) return m;
        const newLifetime = m.lifetimePoints + num;
        const newTier = tierForPoints(newLifetime);

        if (newTier !== m.tier) {
          void updateCustomerTierApi(m.id, newTier).catch(() => {});
        }

        const newLedger: PointsLedgerEntry = {
          id: `p-${Date.now()}`,
          date: todayStr,
          type: "earn",
          amount: num,
          description: description || "Points Awarded",
          expiryDate: expDate.toISOString().slice(0, 10),
        };
        return {
          ...m,
          points: m.points + num,
          lifetimePoints: newLifetime,
          tier: newTier,
          lastActivity: todayStr,
          ledger: [newLedger, ...m.ledger],
        };
      }),
    );
    flash(`Credited ${num.toLocaleString()} points to member.`);
  };

  const handleDirectRedeem = async (memberId: string, rewardId: string) => {
    const m = members.find((x) => x.id === memberId);
    const reward = REWARDS.find((r) => r.id === rewardId);
    if (!m || !reward) return;

    try {
      await createRedeemApi(memberId, reward.cost, reward.name);
      flash("Redemption submitted to authorization queue.");
      const rawRedeems = await fetchRedeemFromApi().catch(() => []);
      const newRequests = rawRedeems.map(mapRedeemToRequest).filter(Boolean) as RedemptionRequest[];
      if (newRequests.length) setRequests(newRequests);
    } catch (err: any) {
      flash(err.message || "Failed to submit redemption.");
    }
  };

  const handleProcessRequest = async (id: string, action: "Approved" | "Rejected") => {
    try {
      await updateRedeemStatusApi(id, action === "Approved");
    } catch (e) {
      console.warn("Backend update status failed, applying optimistic update", e);
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    const req = requests.find((r) => r.id === id);
    if (!req) return;

    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: action, decisionDate: todayStr } : r,
      ),
    );

    if (action === "Approved") {
      setMembers((prev) =>
        prev.map((m) => {
          if (m.id !== req.memberId) return m;
          const newLedger: PointsLedgerEntry = {
            id: `p-${Date.now()}`,
            date: todayStr,
            type: "redeem",
            amount: req.pointsCost,
            description: `Reward Claim: ${req.rewardId}`,
          };
          return {
            ...m,
            points: Math.max(0, m.points - req.pointsCost),
            lastActivity: todayStr,
            ledger: [newLedger, ...m.ledger],
          };
        }),
      );
    }

    flash(
      action === "Approved"
        ? `Request approved and points deducted.`
        : `Request rejected.`,
    );
  };

  return (
    <div className="flex-1 flex flex-col gap-8 pb-10">
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-100 flex items-center gap-2 px-5 py-3 rounded-full bg-surface-950 text-white border border-surface-700 shadow-2xl text-xs font-semibold tracking-wide"
          >
            <Sparkles size={14} className="text-brand-300 shrink-0" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-surface-950 text-surface-50 relative overflow-hidden shadow-xl border border-surface-800">
        <div className="absolute rounded-full w-96 h-96 bg-brand-900/30 blur-[100px] -top-20 -right-20 pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-900 border border-surface-700/80 text-brand-300 text-xs font-medium tracking-wide w-fit">
              <Crown size={13} />
              <span>Privileged Tier Management</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif tracking-tight font-semibold text-white">
              VIP Loyalty & Member Services
            </h1>
            <p className="text-xs md:text-sm text-surface-300 font-light leading-relaxed">
              Resort tier progressions, point amortization ledgers, exclusive perk redemption queues, and member auditing.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex flex-col items-center justify-center px-5 py-3 rounded-2xl bg-surface-900/80 border border-surface-800 backdrop-blur-md">
              <span className="text-xl font-bold font-mono text-brand-300">
                {members.length}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-surface-400 font-medium">
                Active Members
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hidden">
        {NAV.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-surface-950 text-white shadow-md"
                  : "bg-surface-100/80 hover:bg-surface-200 text-surface-600 hover:text-surface-950 border border-surface-200"
              }`}
            >
              <Icon size={14} className={isActive ? "text-brand-300" : "text-surface-500"} />
              <span>{tab.label}</span>
              {tab.key === "redemption" && pendingRequests.length > 0 && (
                <span className="ml-1 w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] flex items-center justify-center font-mono">
                  {pendingRequests.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === "dashboard" && (
        <DashboardTab
          members={members}
          requests={requests}
          expiringSoon={expiringSoon}
          pendingRequests={pendingRequests}
          goTo={setActiveTab}
        />
      )}

      {activeTab === "members" && (
        <MembersTab
          members={members}
          selectedMemberId={selectedMemberId}
          onSelect={setSelectedMemberId}
        />
      )}

      {activeTab === "points" && (
        <PointsTab
          members={members}
          onAddPoints={handleAddPoints}
          onRedeem={handleDirectRedeem}
        />
      )}

      {activeTab === "tiers" && <TiersTab members={members} />}

      {activeTab === "redemption" && (
        <RedemptionTab
          members={members}
          requests={requests}
          onProcess={handleProcessRequest}
        />
      )}

      {activeTab === "notifications" && (
        <NotificationsTab
          members={members}
          expiringSoon={expiringSoon}
        />
      )}

      {activeTab === "reports" && (
        <ReportsTab
          members={members}
          requests={requests}
        />
      )}
    </div>
  );
}