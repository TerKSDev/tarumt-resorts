import { Outlet, useLocation } from "react-router";
import { useState } from "react";
import SideNav from "../../components/SideNav";
import TopBar from "../../components/TopBar";
import { PATHS } from "../../lib/config/routes";

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useLocation().pathname;
  const path = PATHS.find(
    (p) => pathname === p.to || pathname.startsWith(p.to + "/"),
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface-50">
      <SideNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
        <TopBar
          title={path?.label || "TARUMT Resorts"}
          desc={path?.desc || "Hospitality Management System"}
          setMenuOpen={setMenuOpen}
        />
        <main className="overflow-y-auto flex-1 flex flex-col p-4 sm:p-6 lg:p-8 print:p-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
