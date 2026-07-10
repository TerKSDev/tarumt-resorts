import { type MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
  { title: "Room Management | TARUMT Resorts" },
];

export default function Room() {
  return <main className="flex-1 min-h-screen">Room</main>;
}
