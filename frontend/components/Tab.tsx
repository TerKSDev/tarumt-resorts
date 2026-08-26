import { Link, useSearchParams } from "react-router";

interface TabProps {
  label: string;
  count: number;
  value: string;
}

export default function Tab({ label, count, value }: TabProps) {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get("status") || "all";
  const isActive = currentTab === value;

  return (
    <Link
      to={`?status=${value}`}
      className={`flex items-center transition-all duration-300 gap-3 rounded-full px-5 py-2 border ${
        isActive
          ? "bg-surface-900 text-white border-surface-900 shadow-md"
          : "bg-white text-surface-600 border-surface-200 hover:border-surface-300 shadow-xs"
      }`}
    >
      <span className="text-xs uppercase tracking-widest font-medium text-nowrap">
        {label}
      </span>
      <span
        className={`text-[10px] min-h-5 min-w-5 flex items-center justify-center rounded-full font-bold ${
          isActive
            ? "bg-surface-700 text-white"
            : "bg-surface-100 text-surface-500"
        }`}
      >
        {count}
      </span>
    </Link>
  );
}
