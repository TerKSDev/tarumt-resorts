import { useEffect, useMemo, useState } from "react";
import { type MetaFunction } from "react-router";
import { Crown, Sparkles, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import type { Member, PointsLedgerEntry, RedemptionRequest, TabKey } from "../../../lib/types/loyalty";
import { NAV } from "../../../lib/config/loyalty";
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
  const [tab, setTab] = useState<TabKey>("dashboard");
  const [rawMembers, setRawMembers] = useState<Member[]>([]);
  const [membersLoading, setMembersLoading] = useState(true);
  const [membersError, setMembersError] = useState<string | null>(null);
  const [requests, setRequests] = useState<RedemptionRequest[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2800);
  };

  const members = useMemo(() => applyApprovedRedemptions(rawMembers, requests), [rawMembers, requests]);

  useEffect(() => {
    let cancelled = false;
    setMembersLoading(true);
    setMembersError(null);
    Promise.all([fetchMembersFromApi(), fetchPointsFromApi(), fetchRedeemFromApi()])
      .then(([customers, points, redeemRows]) => {
        if (cancelled) return;
        const merged = applyPointsToMembers(customers, points);
        setRawMembers(merged);
        setRequests(redeemRows.map(mapRedeemToRequest));
        setSelectedMemberId((prev) => prev || merged[0]?.id || "");
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setMembersError(err instanceof Error ? err.message : "Failed to load loyalty records");
      })
      .finally(() => {
        if (!cancelled) setMembersLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function addPoints(memberId: string, amount: number, description: string) {
    if (amount <= 0) return;
    const member = members.find((m) => m.id === memberId);
    awardPointsApi(memberId, amount, description)
      .then(() => fetchPointsFromApi())
      .then((points) => {
        const merged = applyPointsToMembers(rawMembers, points);
        const updated = merged.find((m) => m.id === memberId);
        const newTier = updated ? tierForPoints(updated.lifetimePoints) : undefined;

        if (updated && newTier && newTier !== updated.tier) {
          const oldTier = updated.tier;
          return updateCustomerTierApi(memberId, newTier)
            .then(() => {
              setRawMembers(merged.map((m) => (m.id === memberId ? { ...m, tier: newTier } : m)));
              flash(`${updated.name} upgraded from ${oldTier} to ${newTier}!`);
            })
            .catch((err: unknown) => {
              setRawMembers(merged);
              flash(err instanceof Error ? `Points added, but tier update failed: ${err.message}` : "Points added, but tier update failed");
            });
        }

        setRawMembers(merged);
        flash(member ? `Awarded ${amount.toLocaleString()} points to ${member.name}` : `Awarded ${amount.toLocaleString()} points`);
      })
      .catch((err: unknown) => {
        flash(err instanceof Error ? err.message : "Failed to award points");
      });
  }

  function requestRedemption(memberId: string, rewardId: string) {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;
    createRedeemApi(memberId, 0, rewardId)
      .then(() => fetchRedeemFromApi())
      .then((redeemRows) => {
        setRequests(redeemRows.map(mapRedeemToRequest));
        flash(`Redemption claim for ${rewardId} submitted for authorization.`);
      })
      .catch((err: unknown) => {
        flash(err instanceof Error ? err.message : "Failed to submit redemption request");
      });
  }

  function processRequest(requestId: string, action: "Approved" | "Rejected") {
    updateRedeemStatusApi(requestId, action === "Approved")
      .then(() => fetchRedeemFromApi())
      .then((redeemRows) => {
        setRequests(redeemRows.map(mapRedeemToRequest));
        flash(`Reward redemption request has been ${action.toLowerCase()}.`);
      })
      .catch((err: unknown) => {
        flash(err instanceof Error ? err.message : `Failed to ${action.toLowerCase()} request`);
      });
  }

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

  return (
    <main className="flex-1 flex flex-col gap-8 pb-10">
      {/* Toast Notification */}
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
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="p-6 md:p-8 rounded-3xl bg-surface-950 text-surface-50 relative overflow-hidden shadow-xl border border-surface-800"
      >
        <div className="absolute rounded-full w-96 h-96 bg-brand-900/30 blur-[100px] -top-20 -right-20 pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-900 border border-surface-700/80 text-brand-300 text-xs font-medium tracking-wide w-fit">
              <Crown size={13} />
              <span>TARUMT Privilege & VIP Concierge</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif tracking-tight font-semibold text-white">
              Loyalty Program & VIP Member Ledger
            </h1>
            <p className="text-xs md:text-sm text-surface-300 font-light leading-relaxed">
              Real-time member point issuance, tier progression auditing, and reward redemption fulfillment.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex flex-col items-center justify-center px-5 py-3 rounded-2xl bg-surface-900/80 border border-surface-800 backdrop-blur-md">
              <span className="text-xl font-bold font-mono text-white">
                {members.length}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-surface-400 font-medium">
                Enrolled Guests
              </span>
            </div>
            <div className="flex flex-col items-center justify-center px-5 py-3 rounded-2xl bg-surface-900/80 border border-surface-800 backdrop-blur-md">
              <span className="text-xl font-bold font-mono text-brand-300">
                {pendingRequests.length}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-surface-400 font-medium">
                Pending Claims
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Sub-Menu Bar */}
      <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 scrollbar-hidden border-b border-surface-200">
        {NAV.map((item) => {
          const isActive = tab === item.key;
          const badgeCount =
            item.key === "notifications"
              ? notificationCount
              : item.key === "redemption"
              ? pendingRequests.length
              : 0;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer shrink-0 ${
                isActive
                  ? "bg-surface-950 text-white shadow-sm"
                  : "bg-white text-surface-600 hover:text-surface-950 border border-surface-200 hover:border-surface-300 shadow-2xs"
              }`}
            >
              <item.icon size={15} className={isActive ? "text-brand-300" : "text-surface-400"} />
              <span>{item.label}</span>
              {badgeCount > 0 && (
                <span className="rounded-full bg-brand-500 text-white px-2 py-0.5 text-[10px] font-mono font-bold leading-none">
                  {badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Loading & Error Status */}
      {membersLoading && (
        <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 text-xs text-brand-700 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-600" />
          <span>Synchronizing loyalty records with core database...</span>
        </div>
      )}
      {membersError && (
        <div className="p-4 rounded-2xl bg-surface-100 border border-surface-300 text-xs text-surface-800 flex items-center gap-2">
          <XCircle size={16} className="text-surface-600" />
          <span>Unable to connect to backend: {membersError}</span>
        </div>
      )}

      {/* Tab Panels */}
      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col gap-6"
      >
        {tab === "dashboard" && (
          <DashboardTab
            members={members}
            requests={requests}
            expiringSoon={expiringSoon}
            pendingRequests={pendingRequests}
            goTo={setTab}
          />
        )}
        {tab === "members" && (
          <MembersTab
            members={members}
            selectedMemberId={selectedMemberId}
            onSelect={setSelectedMemberId}
          />
        )}
        {tab === "points" && (
          <PointsTab
            members={members}
            onAddPoints={addPoints}
            onRedeem={requestRedemption}
          />
        )}
        {tab === "tiers" && <TiersTab members={members} />}
        {tab === "redemption" && (
          <RedemptionTab
            members={members}
            requests={requests}
            onProcess={processRequest}
          />
        )}
        {tab === "notifications" && (
          <NotificationsTab
            members={members}
            expiringSoon={expiringSoon}
            pendingRequests={pendingRequests}
          />
        )}
        {tab === "reports" && (
          <ReportsTab members={members} requests={requests} />
        )}
      </motion.div>
    </main>
  );
}