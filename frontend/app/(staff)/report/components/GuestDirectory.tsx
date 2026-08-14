import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
  { title: "In-House Guest Directory | TARUMT Resorts" },
];

export default function GuestDirectory() {
  return (
    <div>
      <p>Guest Directory</p>
    </div>
  );
}
