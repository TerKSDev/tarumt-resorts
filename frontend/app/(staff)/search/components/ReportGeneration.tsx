import {
  ChartNoAxesCombined,
  Download,
  FileChartColumnIncreasing,
  UserRoundX,
} from "lucide-react";
import { useState } from "react";

export default function ReportGeneration() {
  const [report, setReport] = useState("");

  return (
    <div className="flex flex-col rounded-xl gap-5 border p-4 md:p-6 border-surface-300 bg-surface-50">
      <div className="flex items-center gap-3 md:gap-4">
        <div className="flex items-center justify-center w-10.5 h-10.5 bg-brand-50 text-brand-600 rounded-xl">
          <FileChartColumnIncreasing size={20} />
        </div>
        <div className="flex flex-col gap-1.5 justify-between">
          <h2 className="text-base md:text-lg font-semibold leading-none">
            Report Generation
          </h2>
          <p className="text-xs md:text-sm text-surface-600 leading-tight">
            Generate invoices, receipts, and more. Download or print them for
            your guests.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label
          htmlFor="bills"
          className={`flex flex-col justify-start shadow-xs p-5 border gap-1 transition-all duration-300 cursor-pointer rounded-xl tracking-wide  hover:-translate-y-0.5 ${report === "bills" ? "border-brand-600 ring-1 ring-brand-600/20 bg-brand-50" : "hover:shadow-sm border-surface-300 bg-surface-100 hover:border-surface-400"}`}
        >
          <input
            type="radio"
            id="bills"
            name="report"
            className="hidden"
            value="bills"
            checked={report === "bills"}
            onChange={(e) => setReport(e.target.value)}
          />
          <div
            className={`rounded-lg flex items-center justify-center w-10 h-10 ${report === "bills" ? "text-surface-50 bg-brand-600" : "bg-surface-200 text-surface-600"}`}
          >
            <ChartNoAxesCombined size={20} />
          </div>
          <h1
            className={`text-base tracking-tight mt-3 font-medium ${
              report === "bills" ? "text-brand-800" : "text-surface-950"
            }`}
          >
            Guests with Outstanding Balance and High Value Bills for the Day
          </h1>
          <p className="text-xs text-surface-600">
            Lists guests with outstanding balances for the day, sorted by amount
            from highest to lowest, to help the front desk prioritize collection
            efforts.
          </p>
        </label>
        <label
          htmlFor="blacklist"
          className={`flex flex-col shadow-xs p-5 border justify-center gap-1 transition-all duration-300 cursor-pointer rounded-xl tracking-wide hover:-translate-y-0.5 ${report === "blacklist" ? "border-brand-600 ring-1 ring-brand-600/20 bg-brand-50" : "border-surface-300 hover:shadow-sm bg-surface-100 hover:border-surface-400"}`}
        >
          <input
            type="radio"
            id="blacklist"
            name="report"
            className="hidden"
            value="blacklist"
            checked={report === "blacklist"}
            onChange={(e) => setReport(e.target.value)}
          />
          <div
            className={`rounded-lg flex items-center justify-center w-10 h-10 ${report === "blacklist" ? "text-surface-50 bg-brand-600" : "bg-surface-200 text-surface-600"}`}
          >
            <UserRoundX size={20} />
          </div>
          <h1
            className={`text-base tracking-tight font-medium mt-3 ${
              report === "blacklist" ? "text-brand-800" : "text-surface-950"
            }`}
          >
            Analyze the blacklist of guests who did not show up after making a
            reservation
          </h1>
          <p className="text-xs text-surface-600">
            This section compiles records of past guests who did not show up
            after making a reservation, assesses the risk level and lost
            revenue, and provides a reference for booking policies.
          </p>
        </label>
        <button
          disabled={report === ""}
          className="disabled:cursor-not-allowed md:col-span-2 mt-1 w-fit ml-auto disabled:bg-surface-200 disabled:text-surface-600 disabled:opacity-60 disabled:border-surface-300 border border-transparent flex items-center gap-2 justify-center py-2.5 h-12.5 px-6 bg-brand-500 hover:bg-brand-600 hover:shadow-sm transition-all duration-300 cursor-pointer text-surface-50 rounded-xl font-medium uppercase tracking-wide"
        >
          <Download size={18} />
          <p className="leading-none text-sm">Generate Report</p>
        </button>
      </div>
    </div>
  );
}
