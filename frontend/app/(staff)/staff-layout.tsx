import { Outlet, useMatches } from "react-router";
import SideNav from "../../components/SideNav";
import TopBar from "../../components/TopBar";
import { useLocation } from "react-router";
import { useState } from "react";
import { PATHS } from "../../lib/config/routes";
import { motion } from "motion/react";

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useLocation().pathname;
  const path = PATHS.find((path) => path.to === pathname);

  // Any route module can opt out of this layout's ambient padding by
  // exporting `handle = { noPadding: true }` — e.g. loyalty.tsx does this
  // because it manages its own internal spacing. This reads that flag off
  // whichever route is currently matched, instead of hardcoding paths here.
  const matches = useMatches();
  const noPadding = matches.some(
    (m) => (m.handle as { noPadding?: boolean } | undefined)?.noPadding
  );

  return (
    <main className="flex h-screen flex-1 overflow-hidden">
      <SideNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <section className="flex-1 flex flex-col w-full min-h-0 overflow-hidden">
        <TopBar
          title={path?.label || "Unavailable"}  
          desc={path?.desc || "Unavailable"}
          setMenuOpen={setMenuOpen}
        />
        <motion.div
          className={`overflow-y-auto flex-1 flex flex-col border-r border-surface-400 ${noPadding ? "" : "p-3 py-4 sm:p-6 lg:p-8"}`}
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1 }}
        >
          <Outlet />
        </motion.div>
      </section>
    </main>
  );
}