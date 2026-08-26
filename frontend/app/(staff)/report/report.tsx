import { useParams, Link, type MetaFunction } from "react-router";
import { REPORT } from "../../../lib/config/report";
import GuestDirectory from "./components/GuestDirectory";
import ArrivalDeparture from "./components/ArrivalDepartune";
import HousekeepingStatus from "./components/HousekeepingStatus";
import MemberPoints from "./components/MemberPoints";
import RedemptionRecord from "./components/RedemptionRecord";
import RegistrationCancellation from "./components/RegistrationCancellation";
import CleaningTurnaround from "./components/CleaningTurnaround";
import WalkInSummary from "./components/WalkInSummary";
import { PATHS } from "../../../lib/config/routes";
import { ArrowLeft, ChevronRight, Printer } from "lucide-react";

export const meta: MetaFunction = () => [
  { title: "Report Centre | TARUMT Resorts" },
];

export default function Report() {
  const { report_name } = useParams();

  if (!report_name) {
    return (
      <main className="flex-1 min-h-fit flex flex-col gap-10 mt-2">
        {Array.from(new Set(REPORT.map((r) => r.from))).map((category) => (
          <div key={category} className="flex flex-col gap-4">
            <h2 className="text-[10px] font-semibold text-surface-400 uppercase tracking-[0.2em] flex items-center gap-3">
              <span className="w-6 h-px bg-surface-300 inline-block"></span>
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {REPORT.filter((r) => r.from === category).map((report) => (
                <Link
                  key={report.id}
                  to={report.path}
                  className="p-6 border rounded-3xl gap-4 flex flex-col shadow-xs transition-all duration-300 bg-white border-surface-200 hover:border-surface-400 hover:shadow-md hover:-translate-y-1 group"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-100 text-surface-500 group-hover:bg-surface-900 group-hover:text-white transition-colors border border-surface-200 group-hover:border-surface-900 shadow-sm">
                    <report.icon size={20} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-xl font-serif tracking-wide text-surface-900">
                      {report.name}
                    </h3>
                    <p className="text-sm text-surface-500 font-light leading-relaxed">
                      {report.desc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </main>
    );
  }

  const currentReport = REPORT.find((report) => report.id === report_name);
  if (!currentReport)
    return (
      <main className="flex-1 min-h-screen flex items-center justify-center">
        <p className="text-lg font-serif text-surface-500">Report not found</p>
      </main>
    );

  return (
    <main className="flex-1 flex flex-col gap-6">
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Link
            className="flex items-center gap-2 group bg-white border-surface-200 rounded-full border transition-all px-5 py-2.5 text-xs uppercase tracking-widest font-medium text-surface-600 hover:text-surface-900 hover:border-surface-400 shadow-xs hover:shadow-sm"
            to={PATHS.filter((path) => path.label === "Report Centre")[0].to}
          >
            <ArrowLeft
              size={14}
              strokeWidth={1.5}
              className="group-hover:-translate-x-1 transition-all duration-300"
            />
            Report Centre
          </Link>
          <div className="text-[10px] uppercase tracking-widest text-surface-400 flex items-center gap-2">
            <ChevronRight size={14} strokeWidth={1.5} />
            {currentReport.from}
            <ChevronRight size={14} strokeWidth={1.5} />
            <span className="text-surface-900 font-semibold border-b border-surface-900/30 pb-0.5">
              {currentReport.name}
            </span>
          </div>
        </div>
      </div>

      {currentReport.id === "guest-directory" && <GuestDirectory />}
      {currentReport.id === "arrival-departure" && <ArrivalDeparture />}
      {currentReport.id === "housekeeping-status" && <HousekeepingStatus />}
      {currentReport.id === "member-points" && <MemberPoints />}
      {currentReport.id === "redemption-record" && <RedemptionRecord />}
      {currentReport.id === "registration-cancellation" && (
        <RegistrationCancellation />
      )}
      {currentReport.id === "cleaning-turnaround" && <CleaningTurnaround />}
      {currentReport.id === "walk-in-summary" && <WalkInSummary />}

      <div className="flex items-center mt-auto pt-6 border-t border-surface-200 justify-center gap-6 w-full print:hidden">
        <h3 className="text-[10px] font-semibold text-surface-400 uppercase tracking-[0.2em]">
          More from {currentReport.from}:
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          {REPORT.filter((r) => r.from === currentReport.from).map(
            (related) => (
              <Link
                key={related.id}
                to={related.path}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium tracking-widest uppercase transition-all duration-300 shadow-xs ${
                  currentReport.id === related.id
                    ? "bg-surface-900 text-white border-surface-900 shadow-md cursor-default"
                    : "bg-white hover:bg-surface-100 hover:shadow-sm text-surface-600 border border-surface-200 hover:border-surface-400"
                }`}
              >
                <related.icon size={14} strokeWidth={1.5} />
                {related.name}
              </Link>
            ),
          )}
          {REPORT.filter(
            (r) => r.from === currentReport.from && r.id !== currentReport.id,
          ).length === 0 && (
            <span className="text-xs text-surface-400 italic font-light tracking-wide">
              No other reports in this category.
            </span>
          )}
        </div>
      </div>
    </main>
  );
}
