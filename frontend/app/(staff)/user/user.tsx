import { type MetaFunction } from "react-router";
import { useState } from "react";
import {
  Users,
  Plus,
  Search,
  ShieldCheck,
  Building2,
  Mail,
  MoreVertical,
  X,
  UserCheck,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const meta: MetaFunction = () => [
  { title: "Staff & User Management | TARUMT Resorts" },
];

type StaffUser = {
  id: string;
  name: string;
  email: string;
  role: "Manager" | "Front Desk" | "Housekeeping";
  department: string;
  status: "Active" | "On-Duty" | "Inactive";
  lastLogin: string;
};

const INITIAL_STAFF: StaffUser[] = [
  {
    id: "STF-1001",
    name: "Alex Wong (General Manager)",
    email: "manager@tarumtresorts.com",
    role: "Manager",
    department: "Executive Management",
    status: "Active",
    lastLogin: "Today, 08:30 AM",
  },
  {
    id: "STF-2041",
    name: "Jessica Tan",
    email: "frontdesk@tarumtresorts.com",
    role: "Front Desk",
    department: "Guest Services & Concierge",
    status: "On-Duty",
    lastLogin: "Today, 07:45 AM",
  },
  {
    id: "STF-2042",
    name: "Daniel Lee",
    email: "daniel.lee@tarumtresorts.com",
    role: "Front Desk",
    department: "Guest Services & Concierge",
    status: "Active",
    lastLogin: "Yesterday, 10:15 PM",
  },
  {
    id: "STF-3015",
    name: "Ahmad Razak",
    email: "ahmad.razak@tarumtresorts.com",
    role: "Housekeeping",
    department: "Housekeeping & Operations",
    status: "On-Duty",
    lastLogin: "Today, 06:30 AM",
  },
  {
    id: "STF-3018",
    name: "Mei Ling Tan",
    email: "meiling.tan@tarumtresorts.com",
    role: "Housekeeping",
    department: "Housekeeping & Operations",
    status: "Active",
    lastLogin: "Today, 07:00 AM",
  },
  {
    id: "STF-1002",
    name: "Mock Staff Terminal",
    email: "mock@gmail.com",
    role: "Manager",
    department: "System Administration",
    status: "Active",
    lastLogin: "Just Now",
  },
];

export default function UserManagement() {
  const [staffList, setStaffList] = useState<StaffUser[]>(INITIAL_STAFF);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter staff based on role & search query
  const filteredStaff = staffList.filter((staff) => {
    if (roleFilter !== "all" && staff.role.toLowerCase() !== roleFilter.toLowerCase()) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        staff.name.toLowerCase().includes(q) ||
        staff.email.toLowerCase().includes(q) ||
        staff.id.toLowerCase().includes(q) ||
        staff.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAddStaff = (newStaff: StaffUser) => {
    setStaffList((prev) => [newStaff, ...prev]);
    setIsAddModalOpen(false);
  };

  const activeCount = staffList.filter((s) => s.status !== "Inactive").length;
  const managerCount = staffList.filter((s) => s.role === "Manager").length;
  const frontDeskCount = staffList.filter((s) => s.role === "Front Desk").length;
  const housekeepingCount = staffList.filter((s) => s.role === "Housekeeping").length;

  return (
    <main className="flex-1 flex flex-col gap-8 pb-10">
      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="p-6 md:p-8 rounded-3xl bg-surface-950 text-surface-50 relative overflow-hidden shadow-xl border border-surface-800"
      >
        <div className="absolute rounded-full w-96 h-96 bg-brand-900/30 blur-[100px] -top-20 -right-20 pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-900 border border-surface-700/80 text-brand-300 text-xs font-medium tracking-wide w-fit">
              <ShieldCheck size={13} />
              <span>Role-Based Access Control</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif tracking-tight font-semibold text-white">
              Resort Staff & Personnel Directory
            </h1>
            <p className="text-xs md:text-sm text-surface-300 font-light leading-relaxed">
              Manage system permissions, terminal authentications, and credentials across all resort departments.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-brand-50 text-surface-950 hover:text-brand-900 text-xs font-bold uppercase tracking-widest transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-95"
            >
              <Plus size={16} strokeWidth={2} />
              <span>Create Account</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-surface-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Total Personnel
            </span>
            <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600">
              <Users size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-surface-950 mt-2">
            {staffList.length}
          </p>
          <span className="text-xs text-surface-500 font-light mt-1">
            {activeCount} Active Terminal Sessions
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-surface-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Administrators
            </span>
            <div className="w-8 h-8 rounded-xl bg-brand-900 border border-brand-800 flex items-center justify-center text-brand-300">
              <ShieldCheck size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-surface-950 mt-2">
            {managerCount}
          </p>
          <span className="text-xs text-surface-500 font-light mt-1">
            Full Audit & Configuration Clearance
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-surface-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Front Desk Crew
            </span>
            <div className="w-8 h-8 rounded-xl bg-brand-100/60 border border-brand-300 flex items-center justify-center text-brand-700">
              <UserCheck size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-surface-950 mt-2">
            {frontDeskCount}
          </p>
          <span className="text-xs text-surface-500 font-light mt-1">
            Check-In & Concierge Access
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-surface-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Housekeeping Staff
            </span>
            <div className="w-8 h-8 rounded-xl bg-surface-100 border border-surface-300 flex items-center justify-center text-surface-700">
              <Building2 size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-surface-950 mt-2">
            {housekeepingCount}
          </p>
          <span className="text-xs text-surface-500 font-light mt-1">
            Room Sanitation & Inspection Logs
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Role Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-hidden">
          {[
            { label: "All Roles", value: "all", count: staffList.length },
            { label: "Managers", value: "manager", count: managerCount },
            { label: "Front Desk", value: "front desk", count: frontDeskCount },
            { label: "Housekeeping", value: "housekeeping", count: housekeepingCount },
          ].map((tab) => {
            const isActive = roleFilter === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setRoleFilter(tab.value)}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? "bg-surface-950 text-white shadow-sm"
                    : "bg-white text-surface-600 hover:text-surface-900 border border-surface-200 hover:border-surface-300"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                    isActive ? "bg-surface-800 text-brand-300" : "bg-surface-100 text-surface-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Field */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-white border border-surface-300 shadow-2xs focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-100 transition-all w-full sm:w-80 group">
          <Search size={15} className="text-surface-400 group-focus-within:text-brand-600 transition-colors shrink-0" />
          <input
            type="text"
            placeholder="Search by name, ID, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-xs text-surface-900 placeholder:text-surface-400 font-normal"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-surface-400 hover:text-surface-700"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Staff Table */}
      <div className="rounded-3xl border border-surface-200 bg-white shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-surface-600 text-xs font-semibold uppercase tracking-wider bg-surface-100/60 border-b border-surface-200">
                <th className="py-4 px-6">Personnel</th>
                <th className="py-4 px-6">Staff Identifier</th>
                <th className="py-4 px-6">Role & Department</th>
                <th className="py-4 px-6">Terminal Status</th>
                <th className="py-4 px-6">Last Activity</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-sm font-semibold text-surface-700">
                        No Staff Accounts Match Query
                      </span>
                      <span className="text-xs text-surface-500 font-light">
                        Try resetting the role filter or search keyword.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staff) => (
                  <tr
                    key={staff.id}
                    className="border-b border-surface-100 last:border-0 hover:bg-brand-50/30 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-brand-950 border border-brand-800 text-brand-300 font-serif font-bold text-sm flex items-center justify-center shrink-0 shadow-inner">
                          {staff.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-surface-950">
                            {staff.name}
                          </span>
                          <span className="text-xs text-surface-500 flex items-center gap-1">
                            <Mail size={12} className="text-surface-400" />
                            {staff.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="text-xs font-mono font-bold text-surface-800 bg-surface-100 px-2.5 py-1 rounded-md border border-surface-200">
                        {staff.id}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1 items-start">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                            staff.role === "Manager"
                              ? "bg-brand-900 text-white border-brand-900"
                              : staff.role === "Front Desk"
                              ? "bg-brand-50 text-brand-700 border-brand-200"
                              : "bg-surface-100 text-surface-700 border-surface-300"
                          }`}
                        >
                          <ShieldCheck size={11} />
                          {staff.role}
                        </span>
                        <span className="text-[11px] text-surface-500 font-light">
                          {staff.department}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-surface-800">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            staff.status === "On-Duty"
                              ? "bg-brand-500 animate-ping"
                              : staff.status === "Active"
                              ? "bg-brand-400"
                              : "bg-surface-400"
                          }`}
                        />
                        {staff.status}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="text-xs font-mono text-surface-600">
                        {staff.lastLogin}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        className="p-1.5 text-surface-400 hover:text-surface-800 hover:bg-surface-100 rounded-lg transition-colors cursor-pointer"
                        title="Options"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-surface-950/60 backdrop-blur-sm z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border border-surface-200 flex flex-col gap-6"
            >
              <div className="flex items-center justify-between border-b border-surface-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-200">
                    <Plus size={18} strokeWidth={2} />
                  </div>
                  <div>
                    <h2 className="text-lg font-serif font-semibold text-surface-950">
                      Provision Staff Account
                    </h2>
                    <p className="text-xs text-surface-500">
                      Create credentials for authenticated resort terminal access.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-surface-400 hover:text-surface-700 p-1 rounded-lg hover:bg-surface-100"
                >
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const formData = new FormData(form);
                  const name = formData.get("name") as string;
                  const email = formData.get("email") as string;
                  const role = formData.get("role") as StaffUser["role"];
                  const department = formData.get("department") as string;

                  const newStaff: StaffUser = {
                    id: `STF-${Math.floor(1000 + Math.random() * 9000)}`,
                    name,
                    email,
                    role: role || "Front Desk",
                    department: department || "Resort Operations",
                    status: "Active",
                    lastLogin: "Pending First Login",
                  };
                  handleAddStaff(newStaff);
                }}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-surface-700">
                    Full Name & Title
                  </label>
                  <input
                    required
                    name="name"
                    placeholder="e.g. Nicholas Raymond"
                    className="px-4 py-2.5 rounded-xl border border-surface-300 text-sm focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-surface-700">
                    Staff Corporate Email
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="e.g. nicholas.r@tarumtresorts.com"
                    className="px-4 py-2.5 rounded-xl border border-surface-300 text-sm focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-surface-700">
                      Assigned Role
                    </label>
                    <select
                      name="role"
                      className="px-4 py-2.5 rounded-xl border border-surface-300 text-sm focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none bg-white cursor-pointer"
                    >
                      <option value="Front Desk">Front Desk</option>
                      <option value="Housekeeping">Housekeeping</option>
                      <option value="Manager">Manager</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-surface-700">
                      Department
                    </label>
                    <input
                      required
                      name="department"
                      placeholder="e.g. Guest Concierge"
                      className="px-4 py-2.5 rounded-xl border border-surface-300 text-sm focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-100 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-surface-600 hover:text-surface-900 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-surface-950 hover:bg-brand-950 text-white text-xs font-semibold uppercase tracking-wider shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    Save & Issue ID
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
