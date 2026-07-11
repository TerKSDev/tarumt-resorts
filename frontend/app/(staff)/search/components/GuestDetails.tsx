import { SearchX } from "lucide-react";

export default function GuestDetails() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-surface-300 bg-surface-50 py-14">
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-surface-100 text-surface-400">
        <SearchX size={24} />
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm font-medium text-surface-700">
          No guest selected
        </p>
        <p className="text-xs text-surface-500">
          Search for a confirmation number above to view guest details.
        </p>
      </div>
    </div>
  );
}
