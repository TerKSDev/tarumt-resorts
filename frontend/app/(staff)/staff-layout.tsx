import { Outlet } from "react-router";
import SideNav from "../../components/SideNav";
import TopBar from "../../components/TopBar";
import { useLocation } from "react-router";
import { useState } from "react";
import { PATHS } from "../../lib/config/routes";

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useLocation().pathname;
  const path = PATHS.find((path) => path.to === pathname);

  return (
    <main className="flex min-h-screen flex-1 overflow-hidden">
      <SideNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <section className="flex-1 flex flex-col w-full overflow-hidden">
        <TopBar
          title={path?.label || "Unavailable"}
          desc={path?.desc || "Unavailable"}
          setMenuOpen={setMenuOpen}
        />
        <div className="overflow-y-auto">
          <Outlet />
        </div>
      </section>
    </main>
  );
}
