import { type MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
  { title: "Task Logs | TARUMT Resorts" },
];

export default function TaskLogs() {
  return <main className="flex-1 min-h-screen">TaskLogs</main>;
}
