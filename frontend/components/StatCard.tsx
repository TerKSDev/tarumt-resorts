import {
  TrendingDown,
  TrendingUp,
  TrendingUpDown,
  type LucideIcon,
} from "lucide-react";

const colorMap = {
  emerald: {
    icon: "bg-emerald-50 text-emerald-600",
    text: "text-emerald-950",
  },
  brand: {
    icon: "bg-brand-50 text-brand-600",
    text: "text-brand-950",
  },
  indigo: {
    icon: "bg-indigo-50 text-indigo-600",
    text: "text-indigo-950",
  },
  purple: {
    icon: "bg-purple-50 text-purple-600",
    text: "text-purple-950",
  },
};

type StatCardProps = {
  icon: LucideIcon;
  color: keyof typeof colorMap;
  value: string;
  title: string;
  mutation?: number;
};

const mutationIndicator = (mutation: number) => {
  if (mutation === 0) {
    return (
      <div className="p-1 slashed-zero tabular-nums font-medium flex items-center gap-2 text-sm text-surface-600">
        <TrendingUpDown size={14} />
        <p>0</p>
      </div>
    );
  } else if (mutation > 0) {
    return (
      <div className="p-1 slashed-zero tabular-nums font-medium flex items-center gap-2 text-sm text-emerald-600">
        <TrendingUp size={14} />
        <p>+{mutation}</p>
      </div>
    );
  } else if (mutation < 0) {
    return (
      <div className="p-1 slashed-zero tabular-nums font-medium flex items-center gap-2 text-sm text-rose-600">
        <TrendingDown size={14} />
        <p>{mutation}</p>
      </div>
    );
  }
};

export default function StatCard({
  color,
  icon,
  value,
  title,
  mutation = 0,
}: StatCardProps) {
  const Icon = icon;

  return (
    <div className="flex gap-4 justify-between items-start bg-surface-50 border border-surface-400 shadow-xs p-5 rounded-xl hover:shadow-sm hover:-translate-y-1 transition-all duration-300 hover:border-surface-500">
      <div className="flex flex-col gap-4">
        <div
          className={`flex items-center justify-center rounded-xl w-12 h-12 ${colorMap[color].icon}`}
        >
          <Icon size={24} />
        </div>
        <div className="flex flex-col gap-px">
          <h1 className="font-semibold text-2xl slashed-zero tabular-nums tracking-tight">
            {value}
          </h1>
          <p className="text-surface-600 text-sm">{title}</p>
        </div>
      </div>
      {mutationIndicator(mutation)}
    </div>
  );
}
