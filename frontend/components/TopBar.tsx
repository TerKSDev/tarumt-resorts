import { Menu, Sparkles, Calendar } from "lucide-react";
import { motion } from "motion/react";
import { format } from "date-fns";

type TopBarProps = {
  title: string;
  desc: string;
  setMenuOpen: (menuOpen: boolean) => void;
};

export default function TopBar({ title, desc, setMenuOpen }: TopBarProps) {
  const todayFormatted = format(new Date(), "EEE, dd MMM yyyy");

  return (
    <motion.header
      className="sticky top-0 right-0 z-40 h-20 bg-surface-100/80 backdrop-blur-md left-0 gap-4 justify-between items-center flex px-4 sm:px-6 lg:px-8 border-b border-surface-200/80 print:hidden transition-colors"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Left Section: Mobile Menu & Page Heading */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          type="button"
          aria-label="Open navigation menu"
          className="lg:hidden cursor-pointer flex items-center justify-center w-10 h-10 hover:bg-surface-200/70 rounded-xl border border-surface-300/80 transition-all duration-200 text-surface-700 active:scale-95 shrink-0"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={20} strokeWidth={1.5} />
        </button>

        <div className="flex flex-col min-w-0">
          <h1 className="text-xl sm:text-2xl font-serif text-surface-950 font-semibold tracking-tight leading-tight truncate">
            {title}
          </h1>
          <p className="text-[11px] text-surface-500 tracking-wider uppercase mt-0.5 font-medium truncate">
            {desc}
          </p>
        </div>
      </div>

      {/* Right Section: Resort Status & Date */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Date Display (Hidden on very small screens) */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-50 border border-surface-200/80 text-surface-600 text-xs font-medium shadow-2xs">
          <Calendar size={14} className="text-surface-400" />
          <span>{todayFormatted}</span>
        </div>

        {/* Live Operational Status Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-50 border border-surface-200/90 shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
          </span>
          <span className="text-xs font-semibold text-surface-800 tracking-wide hidden sm:inline">
            TARUMT Console
          </span>
          <span className="text-[10px] text-brand-600 font-semibold uppercase tracking-wider flex items-center gap-1">
            <Sparkles size={11} />
            Live
          </span>
        </div>
      </div>
    </motion.header>
  );
}
