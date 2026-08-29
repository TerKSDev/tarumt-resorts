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
import {
  ArrowLeft,
  ChevronRight,
  Printer,
  Sparkles,
  ArrowUpRight,
  Building2,
  FileText,
} from "lucide-react";
import { motion } from "motion/react";

export const meta: MetaFunction = () => [
  { title: "Report Centre | TARUMT Resorts Management" },
];

export default function Report() {
  const { report_name } = useParams();

  // If no specific report is selected, show the Report Hub
  if (!report_name) {
    const categories = Array.from(new Set(REPORT.map((r) => r.from)));

    return (
      <main className="flex-1 min-h-fit flex flex-col gap-8 pb-8">
        {/* Hub Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-6 md:p-8 rounded-3xl bg-surface-950 text-surface-50 relative overflow-hidden shadow-xl border border-surface-800"
        >
          <div className="absolute rounded-full w-96 h-96 bg-brand-900/30 blur-[100px] -top-20 -right-20 pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex flex-col gap-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-900 border border-surface-700/80 text-brand-300 text-xs font-medium tracking-wide w-fit">
                <Sparkles size={13} />
                <span>Executive Intelligence & Audit</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-serif tracking-tight font-semibold text-white">
                Resort Analytics & Operational Reports
              </h1>
              <p className="text-xs md:text-sm text-surface-300 font-light leading-relaxed">
                Generate real-time audit logs, guest directory manifests,
                occupancy metrics, and staff turnaround records.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="flex flex-col items-center justify-center px-5 py-3 rounded-2xl bg-surface-900/80 border border-surface-800 backdrop-blur-md">
                <span className="text-xl font-bold font-mono text-white">
                  {REPORT.length}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-surface-400 font-medium">
                  Active Modules
                </span>
              </div>
              <div className="flex flex-col items-center justify-center px-5 py-3 rounded-2xl bg-surface-900/80 border border-surface-800 backdrop-blur-md">
                <span className="text-xl font-bold font-mono text-brand-300">
                  {categories.length}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-surface-400 font-medium">
                  Departments
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Categories & Reports Grid */}
        <div className="flex flex-col gap-10">
          {categories.map((category) => {
            const categoryReports = REPORT.filter((r) => r.from === category);

            return (
              <div key={category} className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-surface-700 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-500 inline-block" />
                    {category}
                  </h2>
                  <span className="text-xs text-surface-500 font-medium">
                    {categoryReports.length} Reports
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {categoryReports.map((report) => (
                    <Link
                      key={report.id}
                      to={report.path}
                      className="p-6 border rounded-3xl gap-5 flex flex-col shadow-xs transition-all duration-300 bg-white border-surface-200 hover:border-brand-500/60 hover:shadow-lg hover:-translate-y-0.5 group relative overflow-hidden"
                    >
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-brand-50 text-brand-600 group-hover:bg-brand-950 group-hover:text-brand-300 transition-all duration-300 border border-brand-200/80 group-hover:border-brand-800 shadow-xs">
                          <report.icon size={22} strokeWidth={1.75} />
                        </div>

                        <div className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center text-surface-400 group-hover:text-brand-600 group-hover:bg-brand-50 transition-colors">
                          <ArrowUpRight size={16} />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <h3 className="text-lg font-serif tracking-wide text-surface-950 font-semibold group-hover:text-brand-700 transition-colors">
                          {report.name}
                        </h3>
                        <p className="text-xs md:text-sm text-surface-600 font-light leading-relaxed line-clamp-2">
                          {report.desc}
                        </p>
                      </div>

                      <div className="mt-auto pt-4 border-t border-surface-100 flex items-center justify-between text-xs text-surface-500 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Building2 size={13} className="text-surface-400" />
                          TARUMT Standard Manifest
                        </span>
                        <span className="text-brand-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                          Open &rarr;
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    );
  }

  // Find matching report
  const currentReport = REPORT.find(
    (report) =>
      report.id === report_name ||
      (report_name === "walk-in-summary" && report.id === "walkin-summary") ||
      (report_name === "walkin-summary" && report.id === "walk-in-summary"),
  );

  if (!currentReport) {
    return (
      <main className="flex-1 min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-3xl bg-surface-200 flex items-center justify-center text-surface-500">
          <FileText size={28} />
        </div>
        <p className="text-xl font-serif text-surface-800 font-semibold">
          Report Module Not Found
        </p>
        <Link
          to={PATHS.find((p) => p.label === "Report Centre")?.to || "/report"}
          className="px-5 py-2.5 rounded-full bg-brand-900 hover:bg-brand-950 text-white text-xs uppercase tracking-wider font-semibold transition-colors"
        >
          Return to Report Hub
        </Link>
      </main>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="flex-1 flex flex-col gap-6 pb-8">
      {/* Detail View Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            className="flex items-center gap-2 group bg-white border-surface-200 rounded-full border transition-all px-4 py-2 text-xs uppercase tracking-widest font-semibold text-surface-700 hover:text-brand-700 hover:border-brand-300 shadow-2xs hover:shadow-xs"
            to={PATHS.find((path) => path.label === "Report Centre")?.to || "/report"}
          >
            <ArrowLeft
              size={14}
              strokeWidth={1.75}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Report Centre
          </Link>

          <div className="text-xs uppercase tracking-wider text-surface-500 flex items-center gap-2 font-medium">
            <ChevronRight size={14} className="text-surface-400" />
            <span>{currentReport.from}</span>
            <ChevronRight size={14} className="text-surface-400" />
            <span className="text-surface-950 font-bold bg-surface-200/70 px-2.5 py-0.5 rounded-md">
              {currentReport.name}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-900 hover:bg-surface-800 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-xs hover:shadow-md cursor-pointer active:scale-95"
          >
            <Printer size={14} strokeWidth={1.75} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Render Component */}
      {(currentReport.id === "guest-directory" ||
        report_name === "guest-directory") && <GuestDirectory />}
      {(currentReport.id === "arrival-departure" ||
        report_name === "arrival-departure") && <ArrivalDeparture />}
      {(currentReport.id === "housekeeping-status" ||
        report_name === "housekeeping-status") && <HousekeepingStatus />}
      {(currentReport.id === "member-points" ||
        report_name === "member-points") && <MemberPoints />}
      {(currentReport.id === "redemption-record" ||
        report_name === "redemption-record") && <RedemptionRecord />}
      {(currentReport.id === "registration-cancellation" ||
        report_name === "registration-cancellation") && (
        <RegistrationCancellation />
      )}
<<<<<<< HEAD
      {(currentReport.id === "cleaning-turnaround" ||
        report_name === "cleaning-turnaround") && <CleaningTurnaround />}
      {(currentReport.id === "walkin-summary" ||
        currentReport.id === "walk-in-summary" ||
        report_name === "walkin-summary" ||
        report_name === "walk-in-summary") && <WalkInSummary />}

      {/* Related Reports in Department */}
      <div className="flex flex-col md:flex-row items-center mt-6 pt-6 border-t border-surface-200 justify-between gap-4 w-full print:hidden">
        <h3 className="text-xs font-bold text-surface-600 uppercase tracking-[0.18em]">
          Department Modules ({currentReport.from}):
=======
      {currentReport.id === "cleaning-turnaround" && <CleaningTurnaround />}
      {currentReport.id === "walkin-summary" && <WalkInSummary />}
      <div className="flex items-center justify-center gap-4 w-fit print:hidden">
        <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
          More from {currentReport.from}:
>>>>>>> main
        </h3>
        <div className="flex flex-wrap items-center gap-2.5">
          {REPORT.filter((r) => r.from === currentReport.from).map((related) => {
            const isCurrent =
              currentReport.id === related.id ||
              report_name === related.id ||
              (report_name === "walkin-summary" &&
                related.id === "walk-in-summary");

            return (
              <Link
                key={related.id}
                to={related.path}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all shadow-2xs ${
                  isCurrent
                    ? "bg-brand-900 text-white border-brand-900 shadow-sm cursor-default font-semibold"
                    : "bg-white hover:bg-surface-100 text-surface-700 border border-surface-200 hover:border-surface-300"
                }`}
              >
                <related.icon size={13} strokeWidth={1.75} />
                <span>{related.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}