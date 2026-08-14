import { useParams, Link, type MetaFunction } from "react-router";
import { REPORT } from "../../../lib/config/report";
import GuestDirectory from "./components/GuestDirectory";
import ArrivalDeparture from "./components/ArrivalDepartune";

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
            <h2 className="text-lg font-semibold text-surface-950 flex items-center gap-2">
              <span className="size-1.5 bg-brand-500 rounded-full inline-block animate-pulse"></span>
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
    <main>
      <h1>{currentReport.name}</h1>
      {currentReport.id === "guest-directory" && <GuestDirectory />}
      {currentReport.id === "arrival-departure" && <ArrivalDeparture />}
    </main>
  );
}
