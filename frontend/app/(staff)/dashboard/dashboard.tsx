import { type MetaFunction } from "react-router";
import StatCard from "../../../components/StatCard";
import { Bed, DollarSign, UserRoundCheck, UserRoundPlus } from "lucide-react";

export const meta: MetaFunction = () => [
  { title: "Dashboard | TARUMT Resorts" },
];

export default function Dashboard() {
  return (
    <main className="flex flex-1 min-h-screen">
      <div className="grid sm:grid-cols-2 grid-cols-1 xl:grid-cols-4 gap-4 h-fit w-full">
        <StatCard
          title="Income"
          value="RM 298,400"
          icon={DollarSign}
          color="emerald"
          mutation={3000000}
        />
        <StatCard title="Occupancy" value="85%" icon={Bed} color="brand" />
        <StatCard
          title="Check-Ins"
          value="123"
          icon={UserRoundPlus}
          color="indigo"
          mutation={100}
        />
        <StatCard
          title="Check-Outs"
          value="123"
          icon={UserRoundCheck}
          color="purple"
          mutation={-100}
        />
      </div>
      <div></div>
    </main>
  );
}
