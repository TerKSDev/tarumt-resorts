import { Building2, LogOut, X } from "lucide-react";
import { PATHS, CATEGORIES } from "../lib/config/routes";
import { Link, NavLink } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

type SideNavProps = {
  setMenuOpen: (menuOpen: boolean) => void;
  menuOpen: boolean;
};

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isDesktop;
}

export default function SideNav({ setMenuOpen, menuOpen }: SideNavProps) {
  const isDesktop = useIsDesktop();

  return (
    <>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-surface-950/50 z-50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        className="fixed lg:relative inset-y-0 left-0 z-100 w-64 bg-brand-950 h-screen flex flex-col"
        initial={false}
        animate={{ x: isDesktop ? 0 : menuOpen ? 0 : "-100%" }}
        transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-7 text-surface-500 flex lg:hidden right-7 z-100 hover:text-surface-50 cursor-pointer"
        >
          <X size={16} />
        </button>
        <div className="flex items-center p-6 text-surface-50 gap-2.5 mb-2">
          <div className="p-2.5 bg-brand-500 rounded-2xl">
            <Building2 size={25} />
          </div>
          <div className="flex flex-col gap-0.5">
            <h1 className="text-xl font-semibold leading-tight tracking-wide">
              TARUMT
            </h1>
            <p className="text-sm text-surface-500 leading-tight tracking-tight">
              Resorts
            </p>
          </div>
        </div>

        <nav className="overflow-y-auto">
          {Object.values(CATEGORIES).map((category) => {
            const filteredPaths = PATHS.filter(
              (path) => path.category === category,
            );

            return (
              <div key={category} className="flex flex-col gap-2.5 px-4">
                <h2 className="text-surface-500 uppercase text-xs font-semibold tracking-wide">
                  {category}
                </h2>
                <div className="flex flex-col gap-1.5 last:mb-4">
                  {filteredPaths.map((path) => (
                    <NavLink
                      to={path.to}
                      key={path.to}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                          isActive
                            ? "bg-brand-500 text-surface-50 font-semibold"
                            : "text-surface-400 hover:text-surface-50 hover:bg-brand-500/8"
                        }`
                      }
                    >
                      <path.icon size={18} />
                      <span className="text-sm">{path.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="mt-auto flex cursor-default items-center justify-between px-4 py-6 border-t border-surface-600/50 bg-brand-900/15 w-full">
          <div className="flex items-center gap-2">
            <div className="bg-brand-900/80 shadow-sm w-9.5 h-9.5 rounded-full text-surface-50 flex items-center justify-center text-base font-bold">
              M
            </div>
            <div className="flex flex-col gap-2 leading-none justify-between">
              <p className="text-surface-50 font-semibold">Mock Account</p>
              <span className="text-[10px] text-surface-400">
                mock@gmail.com
              </span>
            </div>
          </div>
          <Link
            to="/"
            className="flex items-center justify-center w-9 h-9 hover:bg-surface-50/10 rounded-xl transition-all duration-300 text-surface-500 hover:text-surface-50 cursor-pointer"
          >
            <LogOut size={16} />
          </Link>
        </div>
      </motion.aside>
    </>
  );
}
