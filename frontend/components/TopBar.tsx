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
      className="sticky top-0 right-0 z-40 h-20 bg-surface-100/70 backdrop-blur-md left-0 gap-4 justify-between items-center flex px-6 lg:px-10 lg:pl-8 border-b border-surface-200/50 print:hidden"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden cursor-pointer flex items-center justify-center w-10 h-10 hover:bg-surface-200/50 rounded-full border border-transparent transition-all duration-300 text-surface-600"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={20} strokeWidth={1.5} />
        </button>
        <div className="flex flex-col">
          <h1 className="text-2xl font-serif text-surface-900 tracking-wide leading-tight">
            {title}
          </h1>
          <p className="text-[10px] text-surface-500 tracking-wider uppercase mt-0.5 font-medium">
            {desc}
          </p>
        </div>
      </div>
      <div className="md:flex items-center gap-6 hidden">
        <div className="flex items-center h-10 gap-3 px-5 rounded-full bg-white border border-surface-200 shadow-xs focus-within:border-surface-400 focus-within:shadow-md transition-all duration-300 w-80 group">
          <label htmlFor="search">
            <Search
              size={16}
              strokeWidth={1.5}
              className="text-surface-400 group-focus-within:text-surface-700 transition-colors cursor-pointer"
            />
          </label>
          <input
            id="search"
            className="h-full w-full outline-none text-sm text-surface-800 placeholder:text-surface-400 bg-transparent"
            placeholder="Search customer, room, staff..."
          />
        </div>
        <button className="flex h-10 items-center gap-2 px-6 text-xs uppercase tracking-widest font-medium rounded-full bg-surface-900 hover:bg-surface-800 text-white transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
          <Plus size={14} strokeWidth={2} /> New Reservation
        </button>
      </div>
    </motion.header>
  );
}
