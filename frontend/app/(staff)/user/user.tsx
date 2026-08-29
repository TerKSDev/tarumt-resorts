import { type MetaFunction } from "react-router";
import { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Search,
  ShieldCheck,
  Building2,
  Mail,
  X,
  UserCheck,
  Sparkles,
  Lock,
  User,
  Shield,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardHeader } from "../../../components/Card";

export const meta: MetaFunction = () => [
  { title: "Staff & User Management | TARUMT Resorts" },
];

export type StaffUser = {
  staffId: string;
  name: string;
  email: string;
  role: "MANAGER" | "FRONT_DESK" | "HOUSEKEEPING";
  isActive: boolean;
};

const API_BASE = "http://localhost:8081/api/user-management";

export default function UserManagement() {
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE);
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to fetch staff accounts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchUsers();
  }, []);

  const handleToggleStatus = async (staffId: string) => {
    try {
      const res = await fetch(`${API_BASE}/${staffId}/toggle`, {
        method: "PUT",
      });
      if (res.ok) {
        flash(`Staff status updated successfully.`);
        await fetchUsers();
      } else {
        const text = await res.text();
        flash(text || "Failed to update staff status.");
      }
    } catch (err: any) {
      flash(err.message || "Failed to toggle status.");
    }
  };

  const filteredUsers = users
    .filter((u) => {
      if (roleFilter !== "all" && u.role.toLowerCase() !== roleFilter.toLowerCase()) {
        return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.staffId.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const activeCount = users.filter((s) => s.isActive).length;
  const managerCount = users.filter((s) => s.role === "MANAGER").length;
  const frontDeskCount = users.filter((s) => s.role === "FRONT_DESK").length;
  const housekeepingCount = users.filter((s) => s.role === "HOUSEKEEPING").length;

  return (
    <div className="flex-1 flex flex-col gap-8 pb-10">
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-100 flex items-center gap-2 px-5 py-3 rounded-full bg-surface-950 text-white border border-surface-700 shadow-2xl text-xs font-semibold tracking-wide"
          >
            <Sparkles size={14} className="text-brand-300 shrink-0" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-surface-950 text-surface-50 relative overflow-hidden shadow-xl border border-surface-800">
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
              Manage system access permissions, terminal authentications, and credentials across all resort departments.
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
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl border border-surface-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Total Personnel
            </span>
            <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 shadow-2xs">
              <Users size={18} strokeWidth={1.75} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-mono text-surface-950 mt-3">
            {users.length}
          </p>
          <span className="text-xs text-surface-500 font-light mt-1">
            {activeCount} Active Terminal Accounts
          </span>
        </div>

        <div className="p-6 rounded-3xl border border-surface-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Administrators
            </span>
            <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 shadow-2xs">
              <ShieldCheck size={18} strokeWidth={1.75} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-mono text-surface-950 mt-3">
            {managerCount}
          </p>
          <span className="text-xs text-surface-500 font-light mt-1">
            Full Audit & System Clearance
          </span>
        </div>

        <div className="p-6 rounded-3xl border border-surface-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Front Desk Crew
            </span>
            <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 shadow-2xs">
              <UserCheck size={18} strokeWidth={1.75} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-mono text-surface-950 mt-3">
            {frontDeskCount}
          </p>
          <span className="text-xs text-surface-500 font-light mt-1">
            Check-In & Concierge Terminal
          </span>
        </div>

        <div className="p-6 rounded-3xl border border-surface-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-surface-500">
              Housekeeping Staff
            </span>
            <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 shadow-2xs">
              <Building2 size={18} strokeWidth={1.75} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-mono text-surface-950 mt-3">
            {housekeepingCount}
          </p>
          <span className="text-xs text-surface-500 font-light mt-1">
            Room Sanitation & Quality Audit
          </span>
        </div>
      </div>

      {/* Staff Table Card */}
      <Card>
        <CardHeader
          title="Active Personnel Directory"
          subtitle={`${filteredUsers.length} staff account(s) matching current criteria`}
          icon={Users}
          action={
            <div className="flex items-center gap-3">
              {/* Role Filters */}
              <div className="hidden sm:flex items-center gap-1.5 bg-surface-100 p-1 rounded-full border border-surface-200">
                {[
                  { label: "All", value: "all" },
                  { label: "Managers", value: "manager" },
                  { label: "Front Desk", value: "front_desk" },
                  { label: "Housekeeping", value: "housekeeping" },
                ].map((tab) => {
                  const isActive = roleFilter === tab.value;
                  return (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => setRoleFilter(tab.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        isActive
                          ? "bg-surface-950 text-white shadow-xs"
                          : "text-surface-600 hover:text-surface-950"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Search Box */}
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-100 border border-surface-200 text-xs w-56 focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-100">
                <Search size={14} className="text-surface-400" />
                <input
                  type="text"
                  placeholder="Search name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent outline-none text-surface-900 placeholder:text-surface-400 font-normal"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-surface-400 hover:text-surface-700 cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
          }
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-brand-600" />
            <span className="text-xs text-surface-500">Loading personnel records...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-16 text-center text-xs text-surface-400 font-light">
            No staff accounts found matching current query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="text-surface-600 uppercase tracking-wider font-semibold bg-surface-100/70 border-b border-surface-200">
                  <th className="py-3.5 px-6">Personnel Member</th>
                  <th className="py-3.5 px-6">Staff Identifier</th>
                  <th className="py-3.5 px-6">System Role</th>
                  <th className="py-3.5 px-6">Account Status</th>
                  <th className="py-3.5 px-6 text-right">Access Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {filteredUsers.map((user) => (
                  <tr key={user.staffId} className="hover:bg-surface-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200 text-brand-800 font-serif font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-surface-950">
                            {user.name}
                          </span>
                          <span className="text-xs text-surface-500 flex items-center gap-1 mt-0.5">
                            <Mail size={12} className="text-surface-400" />
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-mono font-bold text-surface-700">
                      {user.staffId}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                          user.role === "MANAGER"
                            ? "bg-surface-950 text-white border-surface-950"
                            : user.role === "FRONT_DESK"
                            ? "bg-brand-50 text-brand-700 border-brand-200"
                            : "bg-surface-100 text-surface-700 border-surface-300"
                        }`}
                      >
                        <ShieldCheck size={11} />
                        {user.role.replace("_", " ")}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                        {user.isActive ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span className="text-emerald-800 font-semibold">Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-red-500" />
                            <span className="text-surface-400">Suspended</span>
                          </>
                        )}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => void handleToggleStatus(user.staffId)}
                        disabled={user.role === "MANAGER"}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                          user.role === "MANAGER"
                            ? "text-surface-300 cursor-not-allowed bg-transparent"
                            : user.isActive
                            ? "border border-red-200 text-red-700 hover:bg-red-50"
                            : "border border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                        }`}
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <AddStaffModal
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            setIsAddModalOpen(false);
            void fetchUsers();
            flash("New staff account created successfully.");
          }}
        />
      )}
    </div>
  );
}

function AddStaffModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      setIsSubmitting(true);
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        onSuccess();
      } else {
        const text = await res.text();
        alert(text || "Failed to create staff account.");
      }
    } catch (error) {
      console.error(error);
      alert("Error occurred while creating staff account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-surface-950/60 backdrop-blur-xs z-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-3xl flex flex-col gap-6 p-8 w-full max-w-lg border border-surface-200">
        <div className="flex items-center justify-between border-b border-surface-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center shadow-2xs">
              <User size={18} strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-surface-950">
                Enroll New Staff
              </h2>
              <p className="text-xs text-surface-500 font-light">Issue credentials for hotel department personnel</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold uppercase tracking-wider text-surface-700">
              Full Legal Name
            </label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
              <input
                name="name"
                required
                placeholder="e.g. Nicholas Raymond"
                className="w-full pl-10 pr-4 py-2.5 bg-surface-50 border border-surface-300 rounded-xl focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none text-surface-900"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold uppercase tracking-wider text-surface-700">
              Corporate Email
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
              <input
                name="email"
                type="email"
                required
                placeholder="e.g. nicholas.r@tarumtresorts.com"
                className="w-full pl-10 pr-4 py-2.5 bg-surface-50 border border-surface-300 rounded-xl focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none text-surface-900"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold uppercase tracking-wider text-surface-700">
              Department Role Assignment
            </label>
            <div className="relative">
              <Shield size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
              <select
                name="role"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-surface-50 border border-surface-300 rounded-xl focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none text-surface-900 cursor-pointer font-medium"
              >
                <option value="FRONT_DESK">Front Desk Concierge</option>
                <option value="HOUSEKEEPING">Housekeeping Sanitation</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold uppercase tracking-wider text-surface-700">
              Initial Account Password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
              <input
                name="password"
                type="password"
                minLength={6}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-surface-50 border border-surface-300 rounded-xl focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none text-surface-900 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-surface-600 hover:text-surface-900 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-surface-950 hover:bg-brand-950 text-white rounded-full font-semibold uppercase tracking-wider text-xs shadow-md transition-all cursor-pointer"
            >
              {isSubmitting ? "Creating..." : "Issue Credentials"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
