import {
  Building2,
  Mail,
  ShieldCheck,
  Lock,
  EyeOff,
  Eye,
  ArrowRight,
  Sparkles,
  Crown,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import { Link, useNavigate, type MetaFunction } from "react-router";
import { useState } from "react";
import { motion } from "motion/react";

export const meta: MetaFunction = () => [
  { title: "Staff Login | TARUMT Resorts Management" },
];

const PRESET_ACCOUNTS = [
  {
    role: "General Staff",
    email: "mock@gmail.com",
    password: "password123",
    badge: "Demo",
  },
  {
    role: "Front Desk",
    email: "frontdesk@tarumtresorts.com",
    password: "password123",
    badge: "Front Desk",
  },
  {
    role: "Manager",
    email: "manager@tarumtresorts.com",
    password: "password123",
    badge: "Admin",
  },
] as const;

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberTerminal, setRememberTerminal] = useState(true);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const handleApplyPreset = (account: (typeof PRESET_ACCOUNTS)[number]) => {
    setEmail(account.email);
    setPassword(account.password);
    setActivePreset(account.role);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const mockStaffId = email.split('@')[0].toUpperCase() + "-001";
    const mockStaffName = activePreset || "Staff";

    localStorage.setItem("currentStaffId", mockStaffId);
    localStorage.setItem("currentStaffName", mockStaffName);

    navigate("/dashboard"); 
  };

  return (
    <section className="flex flex-1 min-h-screen w-full bg-surface-100 selection:bg-brand-500 selection:text-white">
      {/* Left Panel - Premium Resort Showcase */}
      <div className="relative lg:flex flex-col w-1/2 overflow-hidden bg-surface-950 flex-1 p-10 xl:p-12 justify-between hidden box-border">
        {/* Subtle Ambient Light Accents */}
        <div className="absolute rounded-full w-140 h-140 bg-brand-900/30 blur-[120px] -top-28 -left-28 pointer-events-none" />
        <div className="absolute rounded-full w-120 h-120 bg-brand-700/15 blur-[100px] -bottom-24 -right-24 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

        {/* Brand Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center gap-4 text-surface-50 relative z-10"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-950 border border-brand-800 text-brand-300 shadow-inner">
            <Building2 strokeWidth={1.75} size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-serif tracking-[0.25em] uppercase leading-tight text-surface-50 font-bold">
              Tarumt
            </span>
            <span className="text-[11px] uppercase tracking-[0.3em] text-brand-300 font-medium leading-none mt-0.5">
              Resorts & Hospitality
            </span>
          </div>
        </motion.div>

        {/* Hero Narrative & Telemetry */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="flex flex-col gap-8 relative z-10 max-w-xl my-auto py-8"
        >
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl xl:text-4xl font-serif leading-tight tracking-wide text-surface-50">
              Elevating Hospitality Operations{" "}
              <span className="text-brand-300 italic text-nowrap">With Distinction.</span>
            </h2>

            <p className="text-sm xl:text-base text-surface-300 leading-relaxed font-light">
              Unified resort management platform for real-time room inventories,
              guest loyalty synchronization, and seamless front desk workflows.
            </p>
          </div>

          {/* Real-time Status Card */}
          <div className="rounded-2xl bg-surface-900/80 border border-surface-800 p-5 backdrop-blur-md shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-surface-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-500" />
                </span>
                <span className="text-xs uppercase tracking-wider font-semibold text-surface-200">
                  Resort Operational Status
                </span>
              </div>
              <span className="text-[11px] text-surface-400 font-mono">
                System v2.4 Online
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col bg-surface-950/70 rounded-xl p-3 border border-surface-800">
                <span className="text-[11px] text-surface-400 uppercase tracking-wider">
                  Occupancy
                </span>
                <span className="text-lg font-semibold text-surface-100 font-mono mt-0.5">
                  94.2%
                </span>
              </div>
              <div className="flex flex-col bg-surface-950/70 rounded-xl p-3 border border-surface-800">
                <span className="text-[11px] text-surface-400 uppercase tracking-wider">
                  Rooms Ready
                </span>
                <span className="text-lg font-semibold text-surface-100 font-mono mt-0.5">
                  148 / 160
                </span>
              </div>
              <div className="flex flex-col bg-surface-950/70 rounded-xl p-3 border border-surface-800">
                <span className="text-[11px] text-surface-400 uppercase tracking-wider">
                  VIP Arrivals
                </span>
                <span className="text-lg font-semibold text-brand-300 font-mono mt-0.5">
                  12 Expected
                </span>
              </div>
            </div>
          </div>

          {/* System Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs xl:text-sm text-surface-400 font-light">
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-900/50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-brand-950 border border-brand-800 flex items-center justify-center text-brand-300 shrink-0">
                <Sparkles size={16} strokeWidth={1.75} />
              </div>
              <span className="text-surface-200">
                Automated Room Status & Cleaning
              </span>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-900/50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-brand-950 border border-brand-800 flex items-center justify-center text-brand-300 shrink-0">
                <Crown size={16} strokeWidth={1.75} />
              </div>
              <span className="text-surface-200">
                VIP Priority Queue & Tier Rewards
              </span>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-900/50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-brand-950 border border-brand-800 flex items-center justify-center text-brand-300 shrink-0">
                <ShieldCheck size={16} strokeWidth={1.75} />
              </div>
              <span className="text-surface-200">
                Role-Based Audit & Rollback Logs
              </span>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-900/50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-brand-950 border border-brand-800 flex items-center justify-center text-brand-300 shrink-0">
                <KeyRound size={16} strokeWidth={1.75} />
              </div>
              <span className="text-surface-200">
                Secure Keycard & Check-in Desk
              </span>
            </div>
          </div>
        </motion.div>

        {/* Footer Meta */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-between text-surface-500 text-xs tracking-wider relative z-10 border-t border-surface-900 pt-6"
        >
          <span className="font-light">
            © 2026 TARUMT Resorts Group. All rights reserved.
          </span>
          <span className="inline-flex items-center gap-1.5 text-surface-400">
            <ShieldCheck size={14} className="text-brand-400" />
            256-bit SSL Protected
          </span>
        </motion.div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex flex-col flex-1 min-w-1/2 py-10 lg:py-16 max-w-160 mx-auto px-6 sm:px-12 md:px-16 xl:px-24 justify-center bg-surface-50 border-l border-surface-200 shadow-2xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md mx-auto flex flex-col gap-8"
        >
          {/* Mobile Logo Display */}
          <div className="flex items-center gap-3 text-surface-950 lg:hidden">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-surface-950 text-brand-300">
              <Building2 strokeWidth={1.75} size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-serif tracking-[0.2em] uppercase font-bold text-surface-950">
                Tarumt
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-700 font-medium">
                Resorts Management
              </span>
            </div>
          </div>

          {/* Form Header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl sm:text-3xl font-serif text-surface-950 tracking-tight font-semibold">
              Staff Portal Login
            </h1>
            <p className="text-sm text-surface-600 font-light leading-relaxed">
              Enter your credentials to access the resort operational console.
            </p>
          </div>

          {/* Preset Quick Accounts (Enhanced Mock Selector) */}
          <div className="flex flex-col gap-2.5 p-3.5 rounded-2xl bg-surface-100 border border-surface-200/80">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-widest font-semibold text-surface-600 flex items-center gap-1.5">
                <Sparkles size={13} className="text-brand-600" />
                Quick Mock Profiles
              </span>
              <span className="text-[11px] text-surface-500 font-light">
                Click to autofill
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {PRESET_ACCOUNTS.map((preset) => {
                const isSelected = activePreset === preset.role;
                return (
                  <button
                    key={preset.role}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-brand-50 border-brand-500 text-brand-900 shadow-xs"
                        : "bg-surface-50 hover:bg-surface-200/60 border-surface-300/80 text-surface-700 hover:border-surface-400"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-semibold truncate">
                        {preset.role}
                      </span>
                      {isSelected && (
                        <CheckCircle2 size={12} className="text-brand-600 shrink-0 ml-1" />
                      )}
                    </div>
                    <span className="text-[10px] text-surface-500 truncate w-full mt-0.5">
                      {preset.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-xs uppercase tracking-widest font-semibold text-surface-700 ml-1"
              >
                Staff Email Address
              </label>
              <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white border border-surface-300 shadow-2xs focus-within:border-brand-600 focus-within:ring-3 focus-within:ring-brand-100 transition-all duration-200 group">
                <Mail
                  className="text-surface-400 group-focus-within:text-brand-600 transition-colors shrink-0"
                  size={18}
                  strokeWidth={1.5}
                />
                <input
                  required
                  id="email"
                  type="email"
                  placeholder="e.g. staff@tarumtresorts.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setActivePreset(null);
                  }}
                  className="w-full bg-transparent outline-none text-sm text-surface-900 placeholder:text-surface-400 font-normal"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2 w-full">
              <div className="flex justify-between items-center ml-1">
                <label
                  htmlFor="password"
                  className="text-xs uppercase tracking-widest font-semibold text-surface-700"
                >
                  Password
                </label>
                <Link
                  to="#"
                  className="text-xs text-brand-700 hover:text-brand-900 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white border border-surface-300 shadow-2xs focus-within:border-brand-600 focus-within:ring-3 focus-within:ring-brand-100 transition-all duration-200 group">
                <Lock
                  className="text-surface-400 group-focus-within:text-brand-600 transition-colors shrink-0"
                  size={18}
                  strokeWidth={1.5}
                />
                <input
                  required
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your security password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setActivePreset(null);
                  }}
                  className="w-full bg-transparent outline-none text-sm text-surface-900 placeholder:text-surface-400 font-normal"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                  className="text-surface-400 hover:text-surface-700 transition-colors cursor-pointer p-1 -mr-1 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={16} strokeWidth={1.5} />
                  ) : (
                    <Eye size={16} strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Terminal Checkbox */}
            <div className="flex items-center justify-between ml-1 pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberTerminal}
                  onChange={(e) => setRememberTerminal(e.target.checked)}
                  className="w-4 h-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500 accent-brand-600 cursor-pointer"
                />
                <span className="text-xs text-surface-600 font-medium">
                  Remember this workstation
                </span>
              </label>
              <span className="text-[11px] text-surface-400">
                Single Sign-On (SSO)
              </span>
            </div>

            {/* Submit Action */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full mt-2 py-4 px-6 rounded-2xl bg-surface-950 hover:bg-brand-950 text-surface-50 text-xs font-semibold tracking-[0.15em] uppercase transition-colors shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center gap-2 group border border-surface-800"
            >
              <span>Sign In to Console</span>
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform duration-200"
              />
            </motion.button>
          </form>

          {/* Footer Notice */}
          <div className="flex flex-col gap-2 pt-2 border-t border-surface-200/80 text-center">
            <p className="text-xs text-surface-500 font-light">
              Need access? Contact the IT Administrator at{" "}
              <span className="text-surface-700 font-medium underline cursor-pointer">
                it-support@tarumtresorts.com
              </span>
            </p>
            <span className="text-[10px] text-surface-400 tracking-wider uppercase font-medium">
              Authorized Personnel Only • Audit Log Active
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
