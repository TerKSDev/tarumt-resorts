import {
  Download,
  FileChartColumnIncreasing,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { REPORT } from "../../../../lib/config/report";

export default function ReportGeneration() {
  const [selectedReport, setSelectedReport] = useState("");
  const navigate = useNavigate();

  return (
    <div className="flex flex-col rounded-xl gap-5 border p-4 md:p-6 border-surface-300 bg-surface-50">
      <div className="flex items-center gap-3 md:gap-4">
        <div className="flex items-center justify-center min-w-10.5 min-h-10.5 bg-brand-50 text-brand-600 rounded-xl">
          <FileChartColumnIncreasing size={20} />
        </div>
        <div className="flex flex-col gap-1.5 justify-between">
          <h2 className="text-base md:text-lg font-semibold leading-none">
            Report Generation
          </h2>
          <p className="text-xs md:text-sm text-surface-600 leading-tight">
            Generate walk-in and cancellation reports. Download or print them
            for your records.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REPORT.filter((f) => f.from === "Walk-In Registration").map(
          (report) => (
            <label
              htmlFor={report.id}
              className={`flex flex-col justify-start shadow-xs p-5 border gap-1 transition-all duration-300 cursor-pointer rounded-xl tracking-wide hover:-translate-y-0.5 ${
                selectedReport === report.id
                  ? "border-brand-600 ring-1 ring-brand-600/20 bg-brand-50"
                  : "hover:shadow-sm border-surface-300 bg-surface-100 hover:border-surface-400"
              }`}
            >
              <input
                type="radio"
                id={report.id}
                name="report"
                className="hidden"
                value={report.id}
                checked={selectedReport === report.id}
                onChange={(e) => setSelectedReport(e.target.value)}
              />
              <div
                className={`rounded-lg flex items-center justify-center w-10 h-10 ${selectedReport === report.id ? "text-surface-50 bg-brand-600" : "bg-surface-200 text-surface-600"}`}
              >
                <report.icon size={20} />
              </div>
              <h1
                className={`text-base tracking-tight mt-3 font-medium ${
                  selectedReport === report.id
                    ? "text-brand-800"
                    : "text-surface-950"
                }`}
              >
                {report.name}
              </h1>
              <p className="text-xs text-surface-600">{report.desc}</p>
            </label>
          ),
        )}
        <button
          onClick={() =>
            navigate(REPORT.find((r) => r.id === selectedReport)?.path!)
          }
          disabled={selectedReport === ""}
          className="disabled:cursor-not-allowed md:col-span-2 mt-1.5 w-fit ml-auto disabled:bg-surface-200 disabled:text-surface-600 disabled:opacity-60 disabled:border-surface-300 border border-transparent flex items-center gap-2 justify-center py-2.5 h-12.5 px-6 bg-brand-500 hover:bg-brand-600 hover:shadow-sm transition-all duration-300 cursor-pointer text-surface-50 rounded-xl font-medium uppercase tracking-wide"
        >
          <Download size={18} />
          <p className="leading-none text-sm">Generate Report</p>
        </button>
      </div>
    </div>
  );
}
