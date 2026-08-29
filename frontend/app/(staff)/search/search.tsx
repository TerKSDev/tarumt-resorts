import { useState } from "react";
import { type MetaFunction } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Search, FileSearch, Sparkles } from "lucide-react";

import GuestSearchBar from "./components/GuestSearchBar";
import GuestDetails from "./components/GuestDetails";
import ReportGeneration from "./components/ReportGeneration";

export const meta: MetaFunction = () => [
  { title: "Guest Folio Search & Verification | TARUMT Resorts" },
];

export default function GuestSearch() {
  const [showGuestDetail, setShowGuestDetail] = useState(false);
  const [guestData, setGuestData] = useState<any>(null);

  return (
    <main className="flex-1 flex flex-col gap-8 pb-10">
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
              <FileSearch size={13} />
              <span>Front Desk Folio & Verification</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif tracking-tight font-semibold text-white">
              Guest Folio & Booking Verification
            </h1>
            <p className="text-xs md:text-sm text-surface-300 font-light leading-relaxed">
              Instant retrieval of guest reservation records, billing itemization, membership discount breakdowns, and documentation export.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-surface-900/80 border border-surface-800 backdrop-blur-md text-surface-300 text-xs">
              <Sparkles size={16} className="text-brand-300 shrink-0" />
              <span>Real-Time Folio Lookup</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search Input Bar */}
      <GuestSearchBar
        setShowGuestDetail={setShowGuestDetail}
        setGuestData={setGuestData}
      />

      {/* Guest Details */}
      <AnimatePresence mode="wait">
        {showGuestDetail && guestData && (
          <motion.div
            key={guestData.confirmationNo}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <GuestDetails guestData={guestData} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Generation Section */}
      <ReportGeneration />
    </main>
  );
}
