import { format } from "date-fns";

export function format2DigitMonthDate(dateStr: string | undefined) {
  if (!dateStr) return "-";
  return format(new Date(dateStr), "dd/MM");
}

export function formatDigitDate(dateStr: string | undefined) {
  if (!dateStr) return "-";
  return format(new Date(dateStr), "dd/MM/yyyy");
}

export function getDayBetween(
  startDate: string | undefined,
  endDate: string | undefined,
) {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end.getTime() - start.getTime();
  return `${Math.round(diffMs / (1000 * 60 * 60 * 24))} day(s)`;
}
