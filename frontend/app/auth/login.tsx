import { Building2, Mail, ShieldCheck, Lock, EyeOff, Eye } from "lucide-react";
import { Link, useNavigate, type MetaFunction } from "react-router";
import { useState } from "react";

export const meta: MetaFunction = () => [{ title: "Login | TARUMT Resorts" }];

const API_BASE = "http://localhost:8081/api/auth";

// Shared contract used across the app (e.g. Housekeeping's advance/rollback
// calls read from this same key): whoever logs in writes their staffId here.
const STAFF_ID_STORAGE_KEY = "staffId";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleMockAccount = () => {
    setEmail("mock@gmail.com");
    setPassword("12345678");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const params = new URLSearchParams({ email, password });
      const response = await fetch(`${API_BASE}/login?${params}`, {
        method: "POST",
      });

      if (!response.ok) {
        const message = await response.text();
        setError(message || "Invalid email or password.");
        setSubmitting(false);
        return;
      }

      const staff = await response.json();
      localStorage.setItem(STAFF_ID_STORAGE_KEY, staff.staffId);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Could not reach the server. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <section className="flex flex-1 min-h-screen">
      {/* Left Panel - Premium Dark Theme */}
      <div className="relative lg:flex flex-col min-w-1/2 overflow-hidden bg-surface-950 flex-1 p-16 justify-between hidden">
        {/* Subtle background glow */}
        <div className="absolute rounded-full w-120 h-120 bg-surface-800 opacity-20 blur-[100px] -top-20 -left-20" />
        <div className="absolute rounded-full w-120 h-120 bg-surface-800 opacity-20 blur-[100px] -bottom-20 -right-20" />

        {/* Logo Area */}
        <div className="flex items-center gap-4 text-surface-50 relative z-10">
          <div className="flex items-center justify-center w-12 h-12 rounded-full border border-surface-700 text-surface-300">
            <Building2 strokeWidth={1.5} size={24} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-serif tracking-widest uppercase leading-none mb-1">
              Tarumt
            </h1>
            <p className="text-xs uppercase tracking-[0.2em] text-surface-400 leading-none">
              Resorts
            </p>
          </div>
        </div>

        {/* Hero Content */}
        <div className="flex flex-col gap-6 relative z-10 max-w-lg">
          <h2 className="text-4xl xl:text-5xl font-serif leading-tight tracking-wide text-surface-50">
            Welcome to TARUMT<br />
            <span className="text-surface-400 italic">Resorts Management</span>
          </h2>
          <p className="text-base xl:text-lg text-surface-300 leading-relaxed font-light">
            Centralized management of room status, reservations, and customer
            data makes your resort operations more efficient and smoother.
          </p>

          <div className="flex flex-col gap-4 mt-8 text-sm xl:text-base text-surface-400 font-light">
            <div className="flex gap-4 items-center group cursor-default">
              <div className="w-8 h-8 rounded-full border border-surface-800 flex items-center justify-center group-hover:border-surface-600 transition-colors">
                <ShieldCheck size={14} strokeWidth={1.5} className="text-surface-500 group-hover:text-surface-300" />
              </div>
              <p className="group-hover:text-surface-200 transition-colors">View Real-Time Room Availability Overview</p>
            </div>
            <div className="flex gap-4 items-center group cursor-default">
              <div className="w-8 h-8 rounded-full border border-surface-800 flex items-center justify-center group-hover:border-surface-600 transition-colors">
                <ShieldCheck size={14} strokeWidth={1.5} className="text-surface-500 group-hover:text-surface-300" />
              </div>
              <p className="group-hover:text-surface-200 transition-colors">Customer and Membership Management</p>
            </div>
            <div className="flex gap-4 items-center group cursor-default">
              <div className="w-8 h-8 rounded-full border border-surface-800 flex items-center justify-center group-hover:border-surface-600 transition-colors">
                <ShieldCheck size={14} strokeWidth={1.5} className="text-surface-500 group-hover:text-surface-300" />
              </div>
              <p className="group-hover:text-surface-200 transition-colors">Revenue and Occupancy Rate Analysis</p>
            </div>
          </div>
        </div>

        <div className="flex text-surface-500 text-xs tracking-wider relative z-10 font-light">
          © 2026 TARUMT Resorts. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex flex-col flex-1 py-12 lg:max-w-1/2 max-w-150 mx-auto px-6 md:px-16 xl:px-32 gap-10 min-w-1/2 justify-center box-border bg-surface-50">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-serif text-surface-900 tracking-wide">
              Staff Login
            </h2>
            <button
              type="button"
              onClick={handleMockAccount}
              className="text-xs uppercase tracking-widest font-medium text-surface-500 hover:text-surface-900 transition-colors px-3 py-1.5 rounded-full border border-surface-200 hover:border-surface-400 cursor-pointer"
            >
              Mock Account
            </button>
          </div>
          <p className="text-sm text-surface-500 leading-relaxed font-light">
            Please log in using your staff account to access the management system.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-xs uppercase tracking-widest font-medium text-surface-500 ml-1">
              Staff Email
            </label>
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white border border-surface-200 shadow-xs focus-within:border-surface-400 focus-within:shadow-md transition-all duration-300 group">
              <Mail
                className="text-surface-400 group-focus-within:text-surface-700 transition-colors"
                size={18}
                strokeWidth={1.5}
              />
              <input
                required
                id="email"
                type="email"
                placeholder="Enter your staff email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent outline-none text-sm text-surface-900 placeholder:text-surface-400 font-light"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between items-center ml-1">
              <label
                htmlFor="password"
                className="text-xs uppercase tracking-widest font-medium text-surface-500"
              >
                Password
              </label>
              <Link
                to="#"
                className="text-xs text-surface-400 hover:text-surface-700 transition-colors font-light"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white border border-surface-200 shadow-xs focus-within:border-surface-400 focus-within:shadow-md transition-all duration-300 group">
              <Lock
                className="text-surface-400 group-focus-within:text-surface-700 transition-colors"
                size={18}
                strokeWidth={1.5}
              />
              <input
                required
                id="password"
                type={showPassword}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none text-sm text-surface-900 placeholder:text-surface-400 font-light"
              />
              <button
                onClick={() => setShowPassword(showPassword === "password" ? "text" : "password")}
                type="button"
                className="text-surface-400 hover:text-surface-700 transition-colors cursor-pointer ml-2"
                aria-label="Toggle password visibility"
              >
                {showPassword === "password" ? (
                  <EyeOff size={16} strokeWidth={1.5} />
                ) : (
                  <Eye size={16} strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-rose-600 -mt-2 ml-1">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-4 py-4 px-6 rounded-full bg-surface-900 hover:bg-surface-800 text-white text-xs font-medium tracking-widest uppercase transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-xs text-surface-400 text-center mt-2 font-light">
          If you don't have your own staff account, please contact the administrator to create one.
        </p>
      </div>
    </section>
  );
}