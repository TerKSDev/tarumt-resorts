import { type MetaFunction } from "react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Plus, MoreVertical, X, Shield, Mail, Lock, User, RefreshCw, CheckCircle2, XCircle } from "lucide-react";

export const meta: MetaFunction = () => [
  { title: "User Management | TARUMT Resorts" },
];

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "HOUSEKEEPING"
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/user-management");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/user-management", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setIsAddModalOpen(false);
        setFormData({ name: "", email: "", password: "", role: "HOUSEKEEPING" });
        fetchUsers();
      }
    } catch (error) {
      console.error("Failed to add user", error);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="flex-1 min-h-screen bg-surface-50 relative">
      <div className="px-12 py-10 max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
        >
          <div className="space-y-3">
            <p className="text-surface-500 font-medium tracking-[0.2em] uppercase text-xs">Administration</p>
            <h1 className="text-5xl font-serif text-surface-900 tracking-tight">Staff Management</h1>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-surface-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search staff by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-surface-200 rounded-full text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-surface-900 transition-all shadow-sm"
              />
            </div>
            
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-surface-900 text-white rounded-full hover:bg-surface-800 transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium tracking-wide">Add Staff</span>
            </button>
          </div>
        </motion.div>

        {/* User List */}
        <div className="bg-white rounded-3xl p-2 shadow-sm border border-surface-100/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-100">
                  <th className="px-6 py-5 text-xs font-semibold text-surface-400 uppercase tracking-[0.15em]">Staff Member</th>
                  <th className="px-6 py-5 text-xs font-semibold text-surface-400 uppercase tracking-[0.15em]">Role</th>
                  <th className="px-6 py-5 text-xs font-semibold text-surface-400 uppercase tracking-[0.15em]">Status</th>
                  <th className="px-6 py-5 text-xs font-semibold text-surface-400 uppercase tracking-[0.15em]">Joined</th>
                  <th className="px-6 py-5 text-xs font-semibold text-surface-400 uppercase tracking-[0.15em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <RefreshCw className="w-8 h-8 text-surface-300 animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <td colSpan={5} className="py-20 text-center text-surface-500 font-serif text-lg">
                        No staff members found.
                      </td>
                    </motion.tr>
                  ) : (
                    filteredUsers.map((user, idx) => (
                      <motion.tr 
                        key={user.staffId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group border-b border-surface-50/50 hover:bg-surface-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-surface-100 flex items-center justify-center text-surface-900 font-serif font-medium">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-serif text-lg text-surface-900 group-hover:text-black transition-colors">{user.name}</p>
                              <p className="text-sm text-surface-500 font-sans">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-wider ${
                            user.role === 'MANAGER' ? 'bg-amber-100 text-amber-800' :
                            user.role === 'FRONT_DESK' ? 'bg-blue-100 text-blue-800' :
                            'bg-surface-100 text-surface-700'
                          }`}>
                            {user.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {user.isActive ? (
                              <><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span className="text-sm text-surface-700">Active</span></>
                            ) : (
                              <><XCircle className="w-4 h-4 text-red-500" /><span className="text-sm text-surface-500">Inactive</span></>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-surface-600 font-sans">
                            {new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleToggleStatus(user.staffId)}
                            disabled={user.role === 'MANAGER'}
                            className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${
                              user.role === 'MANAGER' 
                                ? 'text-surface-300 cursor-not-allowed bg-transparent' 
                                : user.isActive 
                                  ? 'text-red-600 hover:bg-red-50' 
                                  : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-surface-900/40 backdrop-blur-sm z-40"
              onClick={() => setIsAddModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-8 h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-serif text-surface-900">New Staff</h2>
                  <button 
                    onClick={() => setIsAddModalOpen(false)}
                    className="p-2 hover:bg-surface-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-surface-500" />
                  </button>
                </div>

                <form onSubmit={handleAddUser} className="flex-1 flex flex-col gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-surface-500 uppercase tracking-widest">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                      <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-surface-900 transition-all"
                        placeholder="e.g. Eleanor Shellstrop"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-surface-500 uppercase tracking-widest">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                      <input 
                        required
                        type="email" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-surface-900 transition-all"
                        placeholder="eleanor@resort.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-surface-500 uppercase tracking-widest">Role</label>
                    <div className="relative">
                      <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                      <select 
                        required
                        value={formData.role}
                        onChange={e => setFormData({...formData, role: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-surface-900 transition-all appearance-none"
                      >
                        <option value="FRONT_DESK">Front Desk</option>
                        <option value="HOUSEKEEPING">Housekeeping</option>
                      </select>
                    </div>
                    <p className="text-xs text-surface-400 pl-1 mt-1">Managers can only be assigned directly via database.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-surface-500 uppercase tracking-widest">Temporary Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                      <input 
                        required
                        type="password"
                        minLength={6}
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-surface-900 transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="mt-auto pt-8 border-t border-surface-100">
                    <button 
                      type="submit"
                      className="w-full py-4 bg-surface-900 text-white rounded-xl font-medium tracking-wide hover:bg-surface-800 hover:-translate-y-0.5 transition-all shadow-lg hover:shadow-xl"
                    >
                      Create Account
                    </button>
                  </div>
                </form>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
