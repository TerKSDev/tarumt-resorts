import { type MetaFunction, useSearchParams } from "react-router";
import { useState, useEffect } from "react";
import { Search, Plus, X, User, Mail, Shield, Lock, CheckCircle2, XCircle } from "lucide-react";
import Tab from "../../../components/Tab";

export const meta: MetaFunction = () => [
  { title: "User Management | TARUMT Resorts" },
];

export default function UserManagement() {
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/user-management");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const currentTab = searchParams.get("status") || "all";

  const frontDeskUsers = users.filter((u) => u.role === "FRONT_DESK");
  const housekeepingUsers = users.filter((u) => u.role === "HOUSEKEEPING");
  const managerUsers = users.filter((u) => u.role === "MANAGER");

  const displayedUsers = users
    .filter((u) => {
      if (currentTab === "front-desk" && u.role !== "FRONT_DESK") return false;
      if (currentTab === "housekeeping" && u.role !== "HOUSEKEEPING") return false;
      if (currentTab === "manager" && u.role !== "MANAGER") return false;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          u.name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleToggleStatus = async (staffId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/user-management/${staffId}/toggle`, {
        method: "PUT"
      });
      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error("Failed to toggle status", error);
    }
  };

  return (
    <main className="flex-1 flex flex-col gap-6 h-fit">
      <div className="flex items-center xl:justify-between gap-6 rounded-sm xl:gap-8 xl:flex-row flex-col">
        <div className="w-full xl:w-fit scrollbar-hidden flex items-center gap-3 overflow-x-auto pb-2 xl:pb-0">
          <Tab label="All" count={users.length} value="all" />
          <Tab label="Front Desk" count={frontDeskUsers.length} value="front-desk" />
          <Tab label="Housekeeping" count={housekeepingUsers.length} value="housekeeping" />
          <Tab label="Managers" count={managerUsers.length} value="manager" />
        </div>
        <div className="flex items-center gap-3 sm:gap-4 w-full xl:w-auto">
          <div className="flex items-center h-10 gap-3 px-5 rounded-full bg-white border border-surface-200 shadow-xs focus-within:border-surface-400 focus-within:shadow-md transition-all duration-300 min-w-48 md:min-w-72 flex-1 group">
            <label htmlFor="search">
              <Search
                size={16}
                strokeWidth={1.5}
                className="text-surface-400 group-focus-within:text-surface-700 transition-colors cursor-pointer"
              />
            </label>
            <input
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-full w-full outline-none text-sm text-surface-800 placeholder:text-surface-400 bg-transparent font-light"
              placeholder="Search staff by name or email..."
            />
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen("add")}
            className="flex h-10 items-center gap-2 px-6 text-xs uppercase tracking-widest font-medium rounded-full bg-surface-900 hover:bg-surface-800 text-white transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
          >
            <Plus size={16} strokeWidth={2} />
            <span className="hidden sm:flex text-nowrap">Add Staff</span>
          </button>
        </div>
      </div>

      {displayedUsers.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center w-full min-h-[50vh] bg-white border border-surface-200 rounded-3xl shadow-xs">
          <Search size={48} strokeWidth={1.5} className="text-surface-300 mb-4" />
          <h1 className="text-xl font-serif text-surface-600 tracking-wide">
            No staff found
          </h1>
          <p className="text-sm text-surface-400 mt-2 font-light">
            Try adjusting your filters or search query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayedUsers.map((user: any) => (
            <div key={user.staffId} className="bg-white border border-surface-200 rounded-2xl p-6 flex flex-col gap-4 shadow-xs hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 font-serif font-medium text-xl">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-surface-900">{user.name}</h3>
                    <p className="text-sm text-surface-500 font-sans">{user.email}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-wider ${
                  user.role === 'MANAGER' ? 'bg-amber-100 text-amber-800' :
                  user.role === 'FRONT_DESK' ? 'bg-blue-100 text-blue-800' :
                  'bg-surface-100 text-surface-700'
                }`}>
                  {user.role.replace('_', ' ')}
                </span>
              </div>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-surface-100">
                <div className="flex items-center gap-2">
                  {user.isActive ? (
                    <><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span className="text-sm text-surface-700 font-medium">Active</span></>
                  ) : (
                    <><XCircle className="w-4 h-4 text-red-500" /><span className="text-sm text-surface-500">Inactive</span></>
                  )}
                </div>
                
                <button 
                  onClick={() => handleToggleStatus(user.staffId)}
                  disabled={user.role === 'MANAGER'}
                  className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                    user.role === 'MANAGER' 
                      ? 'text-surface-300 cursor-not-allowed bg-transparent' 
                      : user.isActive 
                        ? 'text-red-600 hover:bg-red-50' 
                        : 'text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  {user.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen === "add" && (
        <AddStaffModal setIsModalOpen={setIsModalOpen} refreshData={fetchUsers} />
      )}
    </main>
  );
}

function AddStaffModal({
  setIsModalOpen,
  refreshData,
}: {
  setIsModalOpen: (isModalOpen: string) => void;
  refreshData: () => void;
}) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("http://localhost:8080/api/user-management", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        setIsModalOpen("");
        refreshData();
      } else {
        alert("Error creating staff");
      }
    } catch (error) {
      console.error(error);
      alert("Error creating staff");
    }
  };

  return (
    <div className="fixed inset-0 bg-surface-950/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <button
        onClick={() => setIsModalOpen("")}
        className="absolute inset-0 z-[50] cursor-pointer"
      ></button>

      <div className="z-[150] bg-white shadow-2xl rounded-3xl flex flex-col gap-8 p-8 w-full max-w-lg border border-surface-200 transform animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-3xl text-surface-900 tracking-tight">
            New Staff
          </h1>
          <button
            onClick={() => setIsModalOpen("")}
            className="cursor-pointer p-2 rounded-full text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-colors"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-xs font-semibold text-surface-500 uppercase tracking-widest pl-1">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400">
                <User size={18} />
              </span>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="e.g. Eleanor Shellstrop"
                className="w-full pl-11 pr-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-surface-900 transition-all text-surface-900"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-xs font-semibold text-surface-500 uppercase tracking-widest pl-1">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400">
                <Mail size={18} />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="eleanor@resort.com"
                className="w-full pl-11 pr-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-surface-900 transition-all text-surface-900"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="role" className="text-xs font-semibold text-surface-500 uppercase tracking-widest pl-1">
              Role
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400">
                <Shield size={18} />
              </span>
              <select
                id="role"
                name="role"
                required
                className="w-full pl-11 pr-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-surface-900 transition-all text-surface-900 appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                }}
              >
                <option value="FRONT_DESK">Front Desk</option>
                <option value="HOUSEKEEPING">Housekeeping</option>
              </select>
            </div>
            <p className="text-xs text-surface-400 pl-1">Managers can only be assigned directly via database.</p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-xs font-semibold text-surface-500 uppercase tracking-widest pl-1">
              Temporary Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400">
                <Lock size={18} />
              </span>
              <input
                id="password"
                name="password"
                type="password"
                minLength={6}
                required
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-surface-900 transition-all text-surface-900"
              />
            </div>
          </div>

          <div className="pt-6 mt-2 border-t border-surface-100">
            <button
              type="submit"
              className="w-full py-4 bg-surface-900 text-white rounded-xl font-medium tracking-wide hover:bg-surface-800 hover:-translate-y-0.5 transition-all shadow-lg hover:shadow-xl cursor-pointer"
            >
              Create Staff Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
