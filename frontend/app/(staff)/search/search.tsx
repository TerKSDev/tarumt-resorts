import { type MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
  { title: "Guest Search | TARUMT Resorts" },
];

export default function GuestSearch() {
  return <main className="flex-1 min-h-screen">GuestSearch</main>;
}
