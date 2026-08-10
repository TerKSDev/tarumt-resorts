import { Link, useSearchParams } from "react-router";

interface TabProps {
  label: string;
  count: number;
  value: string;
}
export default function Tab({ label, count, value }: TabProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("status") || "all";
  const isActive = currentTab === value;

  return (
    <Link
      to={`?status=${value}`}
      className={`flex items-center transition-all duration-300 gap-2.5 ${isActive ? "bg-brand-600 text-surface-50 shadow-sm border-transparent" : "shadow-xs bg-surface-50 text-surface-800 border-surface-400"} border rounded-lg px-4 pr-3 py-2`}
    >
      <h1 className="text-sm mb-px leading-none text-nowrap font-medium">
        {label}
      </h1>
      <p
        className={`text-[10px] min-h-5 shadow-inner font-bold ${isActive ? "bg-brand-300/50 border-brand-300/55" : "bg-surface-300/50 border-surface-400"} border min-w-5 flex items-center justify-center rounded-full leading-none`}
      >
        {count}
      </p>
    </Link>
  );
}
