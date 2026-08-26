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
    <div className="flex flex-col rounded-3xl gap-6 border p-6 md:p-8 border-surface-200 bg-white shadow-xs">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 border border-surface-100 bg-surface-50 text-surface-600 rounded-full shadow-sm">
          <FileChartColumnIncreasing size={20} strokeWidth={1.5} />
        </div>
        <div className="flex flex-col gap-1 justify-between">
          <h2 className="text-xl font-serif text-surface-900 tracking-wide leading-none">
            Report Generation
          </h2>
          <p className="text-xs text-surface-500 font-light leading-tight">
            Generate invoices, receipts, and more. Download or print them for
            your guests.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REPORT.filter((f) => f.from === "Guest Search").map((report) => (
          <label
            key={report.id}
            htmlFor={report.id}
            className={`flex flex-col justify-start shadow-xs p-6 border gap-1 transition-all duration-300 cursor-pointer rounded-2xl tracking-wide hover:-translate-y-1 ${
              selectedReport === report.id
                ? "border-surface-900 ring-1 ring-surface-900/20 bg-surface-50 shadow-md"
                : "hover:shadow-md border-surface-200 bg-white hover:border-surface-400"
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
              className={`rounded-full flex items-center justify-center w-12 h-12 border shadow-sm transition-colors duration-300 ${
                selectedReport === report.id
                  ? "border-surface-900 text-white bg-surface-900"
                  : "border-surface-100 bg-surface-50 text-surface-500"
              }`}
            >
              <report.icon size={20} strokeWidth={1.5} />
            </div>
            <h1
              className={`text-lg tracking-wide mt-3 font-serif leading-none ${
                selectedReport === report.id
                  ? "text-surface-900"
                  : "text-surface-800"
              }`}
            >
              {report.name}
            </h1>
            <p className="text-xs text-surface-500 font-light mt-1">
              {report.desc}
            </p>
          </label>
        ))}
        <button
          onClick={() =>
            navigate(REPORT.find((r) => r.id === selectedReport)?.path!)
          }
          disabled={selectedReport === ""}
          className="disabled:cursor-not-allowed md:col-span-2 mt-2 w-fit ml-auto disabled:bg-surface-100 disabled:text-surface-400 disabled:shadow-none border border-transparent flex items-center gap-2 justify-center py-2.5 h-14 px-8 bg-surface-900 hover:bg-surface-800 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer text-white rounded-full font-medium uppercase tracking-widest"
        >
          <Download size={16} strokeWidth={1.5} />
          <p className="leading-none text-xs">Generate Report</p>
        </button>
      </div>
    </div>
  );
}
