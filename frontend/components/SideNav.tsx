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
        className="fixed lg:relative inset-y-0 left-0 z-100 w-64 bg-surface-950 border-r border-surface-800 h-screen flex flex-col print:hidden"
        initial={false}
        animate={{ x: isDesktop ? 0 : menuOpen ? 0 : "-100%" }}
        transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-7 text-surface-500 flex lg:hidden right-7 z-100 hover:text-surface-300 cursor-pointer transition-colors"
        >
          <X size={16} />
        </button>

        <div className="flex items-center p-8 text-surface-50 gap-4 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-surface-700 text-surface-300">
            <Building2 strokeWidth={1.5} size={20} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-serif tracking-widest text-surface-50 uppercase leading-none mb-1">
              Tarumt
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-surface-400 leading-none">
              Resorts
            </p>
          </div>
        </div>

        <nav className="overflow-y-auto flex-1 pb-6">
          {Object.values(CATEGORIES).map((category) => {
            const filteredPaths = PATHS.filter(
              (path) => path.category === category,
            );

            return (
              <div key={category} className="flex flex-col gap-2 mb-6 last:mb-0">
                <h2 className="text-surface-500 uppercase text-[10px] font-semibold tracking-[0.15em] px-8 mb-1">
                  {category}
                </h2>
                <div className="flex flex-col">
                  {filteredPaths.map((path) => (
                    <NavLink
                      to={path.to}
                      key={path.to}
                      className="relative px-8 py-3 flex items-center gap-4 group outline-none"
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <motion.div
                              layoutId="active-nav-indicator"
                              className="absolute left-0 top-0 bottom-0 w-1 bg-surface-50 rounded-r-full"
                              initial={false}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                          <path.icon
                            size={18}
                            strokeWidth={isActive ? 2 : 1.5}
                            className={`transition-colors duration-300 relative z-10 ${
                              isActive ? "text-surface-50" : "text-surface-500 group-hover:text-surface-300"
                            }`}
                          />
                          <span
                            className={`text-sm transition-colors duration-300 relative z-10 ${
                              isActive ? "text-surface-50 font-medium" : "text-surface-500 group-hover:text-surface-300"
                            }`}
                          >
                            {path.label}
                          </span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="mt-auto flex cursor-default items-center justify-between px-8 py-6 border-t border-surface-800 bg-surface-950 w-full shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-surface-700 flex items-center justify-center text-surface-300 text-sm font-serif uppercase">
              M
            </div>
            <div className="flex flex-col">
              <p className="text-surface-200 text-sm font-medium leading-none mb-1">Mock Account</p>
              <span className="text-[10px] text-surface-500 leading-none">mock@gmail.com</span>
            </div>
          </div>
          <Link
            to="/"
            className="text-surface-500 hover:text-surface-200 transition-colors cursor-pointer"
          >
            <LogOut size={18} strokeWidth={1.5} />
          </Link>
        </div>
      </motion.aside>
    </>
  );
}
