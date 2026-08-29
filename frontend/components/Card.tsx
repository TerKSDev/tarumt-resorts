import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-surface-200 bg-white shadow-sm overflow-hidden flex flex-col ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  icon: Icon,
  action,
  className = "",
}: {
  title: string;
  subtitle?: string;
  icon?: LucideIcon | any;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 border-b border-surface-100 px-6 py-5 shrink-0 ${className}`}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {Icon && (
          <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center shrink-0 shadow-2xs">
            <Icon size={18} strokeWidth={1.75} />
          </div>
        )}
        <div className="flex flex-col min-w-0">
          <h2 className="text-base font-serif font-semibold text-surface-950 tracking-tight leading-tight truncate">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-surface-500 font-light leading-relaxed mt-0.5 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0 flex items-center">{action}</div>}
    </div>
  );
}

