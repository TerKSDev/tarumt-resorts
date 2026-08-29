import { useState } from "react";
import { useNavigate } from "react-router";
import { Download, FileChartColumnIncreasing, ArrowRight } from "lucide-react";
import { REPORT } from "../../../../lib/config/report";
import { Card, CardHeader } from "../../../../components/Card";

export default function ReportGeneration() {
  const [selectedReport, setSelectedReport] = useState("");
  const navigate = useNavigate();

  const walkInReports = REPORT.filter((f) => f.from === "Walk-In Registration");

  return (
    <Card>
      <CardHeader
        title="Registration & Walk-In Analytics Export"
        subtitle="Generate walk-in volume summaries and cancellation reason trend audits."
        icon={FileChartColumnIncreasing}
      />

      <div className="p-6 md:p-8 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {walkInReports.map((report) => {
            const isSelected = selectedReport === report.id;
            return (
              <label
                key={report.id}
                htmlFor={report.id}
                className={`flex flex-col justify-start p-5 border gap-2 transition-all duration-200 cursor-pointer rounded-2xl ${
                  isSelected
                    ? "border-surface-950 ring-2 ring-surface-950/10 bg-brand-50/30 shadow-md"
                    : "hover:shadow-sm border-surface-200 bg-surface-50/50 hover:bg-white hover:border-surface-300"
                }`}
              >
                <input
                  type="radio"
                  id={report.id}
                  name="report"
                  className="hidden"
                  value={report.id}
                  checked={isSelected}
                  onChange={(e) => setSelectedReport(e.target.value)}
                />
                <div className="flex items-center justify-between">
                  <div
                    className={`rounded-xl flex items-center justify-center w-10 h-10 border transition-colors ${
                      isSelected
                        ? "border-surface-950 text-white bg-surface-950"
                        : "border-surface-200 bg-white text-surface-600"
                    }`}
                  >
                    <report.icon size={18} strokeWidth={1.75} />
                  </div>
                  {isSelected && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-800 bg-brand-100 px-2.5 py-0.5 rounded-full border border-brand-300">
                      Selected
                    </span>
                  )}
                </div>
                <h3 className="text-base font-serif font-semibold text-surface-950 mt-1">
                  {report.name}
                </h3>
                <p className="text-xs text-surface-500 font-light leading-relaxed">
                  {report.desc}
                </p>
              </label>
            );
          })}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => {
              const target = REPORT.find((r) => r.id === selectedReport);
              if (target?.path) navigate(target.path);
            }}
            disabled={selectedReport === ""}
            className="disabled:cursor-not-allowed disabled:bg-surface-100 disabled:text-surface-400 disabled:shadow-none flex items-center gap-2 px-8 h-12 bg-surface-950 hover:bg-brand-950 text-white rounded-full font-semibold uppercase tracking-wider text-xs shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            <Download size={15} strokeWidth={2} />
            <span>Generate Report</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </Card>
  );
}
