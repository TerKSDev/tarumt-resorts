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
    </motion.header>
  );
}
