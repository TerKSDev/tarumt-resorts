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
import { ArrowLeft, ChevronRight } from "lucide-react";

export const meta: MetaFunction = () => [
  { title: "Report Centre | TARUMT Resorts" },
];

export default function Report() {
  const { report_name } = useParams();

  if (!report_name) {
    return (
      <main className="flex-1 min-h-fit flex flex-col gap-8">
        {Array.from(new Set(REPORT.map((r) => r.from))).map((category) => (
          <div key={category} className="flex flex-col gap-3">
            <h2 className="text-md font-semibold text-surface-600 flex items-center gap-2">
              <span className="size-1.5 bg-brand-500 rounded-full inline-block"></span>
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {REPORT.filter((r) => r.from === category).map((report) => (
                <Link
                  key={report.id}
                  to={report.path}
                  className="p-6 border rounded-xl hover:-translate-y-0.5 gap-1 flex flex-col shadow-xs hover:shadow-sm transition-all duration-300 bg-surface-50 border-surface-300 hover:border-brand-600 hover:ring-1 hover:ring-brand-600/20 group tracking-wide"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-200 text-surface-600 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                    <report.icon size={20} />
                  </div>
                  <h3 className="text-lg font-medium tracking-tight text-surface-950 mt-3">
                    {report.name}
                  </h3>
                  <p className="text-sm text-surface-600">{report.desc}</p>
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
      <main className="flex-1 min-h-screen">
        <p className="text-center">Report not found</p>
      </main>
    );

  return (
    <main className="flex-1 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          className="flex items-center gap-2 group bg-surface-50 border-surface-300 rounded-xl border transition-all px-4 py-2 text-sm tracking-wide font-medium text-surface-700 hover:text-surface-950"
          to={PATHS.filter((path) => path.label === "Report Centre")[0].to}
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-0.5 transition-all duration-300"
          />
          Report Centre
        </Link>
        <div className="text-md tracking-tight text-surface-600 flex items-center gap-1.5">
          <ChevronRight size={16} className="mt-0.5" />
          {currentReport.from}
          <ChevronRight size={16} className="mt-0.5" />
          <span className="text-brand-600 font-medium">
            {currentReport.name}
          </span>
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
    </main>
  );
}
