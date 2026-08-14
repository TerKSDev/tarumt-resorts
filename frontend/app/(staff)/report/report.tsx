import { useParams, type MetaFunction } from "react-router";
import { REPORT } from "../../../lib/config/report";
import GuestDirectory from "./components/GuestDirectory";
import ArrivalDeparture from "./components/ArrivalDepartune";

export const meta: MetaFunction = () => [
  { title: "Report Centre | TARUMT Resorts" },
];

export default function Report() {
  const { report_name } = useParams();

  if (!report_name) {
    return <main className="flex-1 min-h-screen">Report</main>;
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
