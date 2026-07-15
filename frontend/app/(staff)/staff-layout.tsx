import { Outlet } from "react-router";
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

  return (
    <main className="flex h-screen w-full overflow-hidden">
      <SideNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <section className="flex-1 flex flex-col w-full overflow-hidden">
        <TopBar
          title={path?.label || "Unavailable"}
          desc={path?.desc || "Unavailable"}
          setMenuOpen={setMenuOpen}
        />
        <motion.div
          className="overflow-y-auto flex-1 flex flex-col p-3 py-4 sm:p-6 lg:p-8 border-r border-surface-400"
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
