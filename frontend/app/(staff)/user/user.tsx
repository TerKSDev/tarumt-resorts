import { type MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
  { title: "User Management | TARUMT Resorts" },
];

export default function UserManagement() {
  return <main className="flex-1 min-h-screen">UserManagement</main>;
}
