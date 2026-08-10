import { Menu, Plus, Search } from "lucide-react";
import { motion } from "motion/react";

type TopBarProps = {
  title: string;
  desc: string;
  setMenuOpen: (menuOpen: boolean) => void;
};

export default function TopBar({ title, desc, setMenuOpen }: TopBarProps) {
  return (
    <motion.header
      className="sticky top-0 right-0 bg-white left-0 justify-between items-center flex pl-4 lg:pl-8 pr-4 py-3 border border-surface-300"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden cursor-pointer flex items-center justify-center w-10 h-10 hover:bg-surface-100 hover:shadow-inner rounded-xl hover:border-surface-200 border border-transparent transition-all duration-300 text-surface-600"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={20} />
        </button>
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-bold leading-tight tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-surface-600 leading-snug tracking-wide">
            {desc}
          </p>
        </div>
      </div>
      <div className="md:flex items-center gap-4 hidden">
        <div className="flex h-10 gap-3 group focus-within:border-brand-600 focus-within:shadow-md focus-within:ring-1 focus-within:ring-brand-600/20 focus-within:scale-105 transition-all duration-300 border px-4 border-surface-300 p-2 items-center rounded-xl bg-surface-100 hover:border-surface-400 focus-within:bg-surface-50 shadow-xs w-72">
          <label htmlFor="search">
            <Search
              size={16}
              className="text-surface-600 group-focus-within:text-brand-600 transition-all duration-300 group-focus-within:-rotate-8 group-focus-within:scale-115"
            />
          </label>
          <input
            id="search"
            className="h-full w-full outline-none text-sm text-surface-800 placeholder:text-surface-500 bg-transparent"
            placeholder="Search customer, room, staff..."
          />
        </div>
        <button className="flex h-10 items-center leading-tight justify-center gap-2 px-4 py-2 font-medium hover:bg-brand-700 text-sm rounded-xl transition-all duration-300 text-surface-50 bg-brand-500 text-nowrap cursor-pointer">
          <Plus size={16} /> New Reservation
        </button>
      </div>
    </motion.header>
  );
}
