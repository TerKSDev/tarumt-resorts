import { Building2, Mail, ShieldCheck, Lock, EyeOff, Eye } from "lucide-react";
import { Link, type MetaFunction } from "react-router";
import { useState } from "react";

export const meta: MetaFunction = () => [{ title: "Login | TARUMT Resorts" }];

export default function Login() {
  const [showPassword, setShowPassword] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleMockAccount = () => {
    setEmail("mock@gmail.com");
    setPassword("12345678");
  };

  return (
    <section className="flex flex-1 min-h-screen">
      <div className="relative lg:flex flex-col min-w-1/2 overflow-hidden bg-brand-950 flex-1! p-12 justify-between hidden">
        <div className="absolute rounded-full w-120 h-120 bg-brand-500 opacity-8 blur-3xl -top-50 -left-50" />
        <div className="absolute rounded-full w-120 h-120 bg-brand-500 opacity-8 blur-3xl -bottom-50 -right-50" />

        <div className="flex items-center text-surface-50 gap-2.5">
          <div className="p-2.5 bg-brand-500 rounded-2xl">
            <Building2 size={25} />
          </div>
          <div className="flex flex-col gap-0.5">
            <h1 className="text-xl font-semibold leading-tight tracking-wide">
              TARUMT
            </h1>
            <p className="text-sm text-surface-500 leading-tight tracking-tight">
              Resorts
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-3xl xl:text-4xl font-bold leading-snug tracking-wide uppercase text-surface-50">
            Welcome to TARUMT
            <br />
            Resorts Management System
          </h1>
          <p className="text-base xl:text-lg text-surface-500 leading-relaxed tracking-tight">
            Centralized management of room status, reservations, and customer
            data makes your resort operations more efficient and smoother.
          </p>
          <div className="flex gap-5 flex-col mt-6 text-sm xl:text-base text-surface-500">
            <div className="flex gap-2.5 items-center hover:scale-105 transition-all duration-300 cursor-default hover:text-surface-50 w-fit">
              <div className="p-1.5 flex items-center justify-center rounded-full bg-brand-900 text-surface-50">
                <ShieldCheck size={18} />
              </div>
              <p>View Real-Time Room Availability Overview</p>
            </div>
            <div className="flex gap-2.5 items-center hover:scale-105 transition-all duration-300 cursor-default hover:text-surface-50 w-fit">
              <div className="p-1.5 flex items-center justify-center rounded-full bg-brand-900 text-surface-50">
                <ShieldCheck size={18} />
              </div>
              <p>Customer and Membership Management</p>
            </div>
            <div className="flex gap-2.5 items-center hover:scale-105 transition-all duration-300 cursor-default hover:text-surface-50 w-fit">
              <div className="p-1.5 flex items-center justify-center rounded-full bg-brand-900 text-surface-50">
                <ShieldCheck size={18} />
              </div>
              <p>Revenue and Occupancy Rate Analysis</p>
            </div>
          </div>
        </div>

        <div className="flex text-surface-500 text-xs">
          © 2026 TARUMT Resorts. All rights reserved.
        </div>
      </div>

      <div className="flex flex-col flex-1! py-12 lg:max-w-1/2 max-w-150 mx-auto px-4 md:px-16 xl:px-36 gap-10 min-w-1/2 justify-center box-border">
        <div className="flex flex-col gap-1.5">
          <div className="flex text-3xl gap-2 font-bold leading-snug tracking-wide uppercase items-start">
            Staff Login
            <button
              type="button"
              onClick={handleMockAccount}
              className="mt-2 text-[10px] font-medium bg-brand-50 text-brand-500 border-brand-200 border rounded-sm cursor-pointer px-2 py-0.5"
            >
              Mock Account
            </button>
          </div>
          <span className="text-base text-surface-600 leading-tight tracking-tight">
            Please log in using your staff account to access the management
            system.
          </span>
        </div>

        <form action="/dashboard" className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 text-sm">
            <label htmlFor="email" className="text-surface-700 font-medium">
              Staff Email
            </label>
            <div className="flex gap-3 group focus-within:border-brand-600 focus-within:shadow-sm focus-within:ring-1 focus-within:ring-brand-600/20 focus-within:scale-102 transition-all duration-300 border px-4 border-surface-400 p-2.5 items-center rounded-lg bg-surface-50 shadow-xs w-full">
              <Mail
                className="text-surface-600 group-focus-within:text-brand-600 transition-all duration-300 group-focus-within:-rotate-8 group-focus-within:scale-115"
                size={20}
              />
              <input
                required
                id="email"
                type="email"
                placeholder="Please enter your staff email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-full outline-none text-surface-800 placeholder:text-surface-500 "
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full text-sm">
            <div className="flex justify-between items-center">
              <label
                htmlFor="password"
                className="text-surface-700 font-medium"
              >
                Password
              </label>
              <Link
                to="#"
                className="text-xs text-brand-400 hover:text-brand-600 hover:underline underline-offset-2 transition-all duration-200"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="flex gap-3 group focus-within:border-brand-600 focus-within:shadow-sm focus-within:ring-1 focus-within:ring-brand-600/20 focus-within:scale-102 transition-all duration-300 border px-4 border-surface-400 p-2.5 items-center rounded-lg bg-white shadow-xs w-full">
              <Lock
                className="text-surface-600 group-focus-within:text-brand-600 transition-all duration-300 group-focus-within:-rotate-8 group-focus-within:scale-115"
                size={20}
              />
              <input
                required
                id="password"
                type={showPassword}
                placeholder="Please enter your password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-full outline-none text-surface-800 placeholder:text-surface-500 "
              />
              {showPassword === "password" ? (
                <button
                  onClick={() => setShowPassword("text")}
                  type="button"
                  className="text-surface-500 cursor-pointer hover:text-surface-700 transition-all duration-300"
                  aria-label="Toggle password visibility"
                >
                  <EyeOff size={16} />
                </button>
              ) : (
                <button
                  onClick={() => setShowPassword("password")}
                  type="button"
                  className="text-surface-500 cursor-pointer hover:text-surface-700 transition-all duration-300"
                  aria-label="Toggle password visibility"
                >
                  <Eye size={16} />
                </button>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 py-2 font-semibold px-4 bg-brand-600 hover:bg-brand-700 transition-all duration-200 hover:scale-102 hover:shadow-sm active:scale-99 cursor-pointer text-white rounded-lg"
          >
            Login
          </button>
        </form>

        <span className="text-xs -mt-4 text-surface-600 text-center mx-4">
          If you don't have your own staff account, please contact the
          administrator to create one.
        </span>
      </div>
    </section>
  );
}
