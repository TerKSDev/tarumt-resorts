import { Building2, LogOut, X, ShieldCheck } from "lucide-react";
import { PATHS, CATEGORIES } from "../lib/config/routes";
import { Link, NavLink } from "react-router";
import { AnimatePresence, motion } from "motion/react";

type SideNavProps = {
  setMenuOpen: (menuOpen: boolean) => void;
  menuOpen: boolean;
};

function NavContent({
  isMobile = false,
  onClose,
}: {
  isMobile?: boolean;
  onClose?: () => void;
}) {
  return (
    <div className="flex flex-col h-full bg-surface-950 text-surface-50 border-r border-surface-800">
      {/* Mobile Close Button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-surface-400 hover:text-white cursor-pointer p-2 rounded-xl hover:bg-surface-900 transition-colors z-20 lg:hidden"
          aria-label="Close navigation menu"
        >
          <X size={18} />
        </button>
      )}

      {/* Brand Header */}
      <div className="flex items-center p-5 gap-3.5 border-b border-surface-900 shrink-0">
        <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-brand-950 border border-brand-800 text-brand-300 shadow-sm shrink-0">
          <Building2 strokeWidth={1.75} size={22} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-serif tracking-[0.2em] text-surface-50 uppercase leading-none font-bold">
            Tarumt
          </h1>
          <p className="text-[10px] uppercase tracking-[0.25em] text-brand-300 font-medium leading-none mt-1">
            Resorts & Hospitality
          </p>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="overflow-y-auto flex-1 py-5 px-3.5 scrollbar-hidden flex flex-col gap-6">
        {Object.values(CATEGORIES).map((category) => {
          const filteredPaths = PATHS.filter((path) => path.category === category);
          if (filteredPaths.length === 0) return null;

          return (
            <div key={category} className="flex flex-col gap-1">
              <h2 className="text-surface-400 uppercase text-[10px] font-semibold tracking-[0.18em] px-3 mb-1">
                {category}
              </h2>
              <div className="flex flex-col gap-1">
                {filteredPaths.map((path) => (
                  <NavLink
                    to={path.to}
                    key={path.to}
                    onClick={() => onClose?.()}
                    className="relative px-3.5 py-2.5 rounded-2xl flex items-center gap-3.5 group outline-none transition-all duration-200 cursor-pointer"
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.div
                            layoutId={isMobile ? "mobile-active-nav" : "desktop-active-nav"}
                            className="absolute inset-0 bg-brand-900/60 border border-brand-500/50 rounded-2xl shadow-xs pointer-events-none"
                            transition={{
                              type: "spring",
                              stiffness: 350,
                              damping: 30,
                            }}
                          />
                        )}

                        <path.icon
                          size={18}
                          strokeWidth={isActive ? 2 : 1.5}
                          className={`transition-colors duration-200 relative z-10 shrink-0 ${
                            isActive
                              ? "text-brand-300"
                              : "text-surface-400 group-hover:text-surface-100"
                          }`}
                        />

                        <span
                          className={`text-xs tracking-wide transition-colors duration-200 relative z-10 truncate ${
                            isActive
                              ? "text-white font-semibold"
                              : "text-surface-300 group-hover:text-white font-normal"
                          }`}
                        >
                          {path.label}
                        </span>

                        {isActive && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse relative z-10 shrink-0" />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User / Staff Profile Footer */}
      <div className="p-3.5 border-t border-surface-900 shrink-0">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-900/90 border border-surface-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-brand-900 border border-brand-700 flex items-center justify-center text-brand-200 font-serif font-bold text-sm shrink-0 shadow-inner">
              M
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-surface-100 text-xs font-semibold leading-tight truncate">
                  Mock Account
                </p>
                <ShieldCheck size={13} className="text-brand-400 shrink-0" />
              </div>
              <span className="text-[10px] text-surface-400 truncate mt-0.5">
                mock@gmail.com
              </span>
            </div>
          </div>

          <Link
            to="/auth/login"
            title="Sign Out"
            className="text-surface-400 hover:text-white hover:bg-surface-800 p-2 rounded-xl transition-all duration-200 cursor-pointer ml-1 shrink-0"
          >
            <LogOut size={16} strokeWidth={1.75} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SideNav({ setMenuOpen, menuOpen }: SideNavProps) {
  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 h-screen shrink-0 relative z-30 shadow-xl print:hidden">
        <NavContent isMobile={false} />
      </aside>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-surface-950/70 z-90 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeInOut" }}
              className="fixed inset-y-0 left-0 z-100 w-72 h-screen flex flex-col lg:hidden shadow-2xl print:hidden"
            >
              <NavContent isMobile={true} onClose={() => setMenuOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
