"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const SEED_USERS = [
  { name: "Alex Johnson", email: "alex@example.com" },
  { name: "Sarah Connor", email: "sarah@example.com" },
  { name: "Dev Developer", email: "dev@example.com" },
];

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState<string>("alex@example.com");
  const [password, setPassword] = useState<string>("password123");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSeedUser = (seedEmail: string) => {
    setEmail(seedEmail);
    setPassword("password123");
    setError(null);
  };

  return (
    <div className="w-full max-w-md liquid-glass rounded-3xl p-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-1 border border-indigo-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Welcome back
        </h2>
        <p className="text-sm text-slate-500">
          Sign in to your Task Tracker account
        </p>
      </div>

      {/* Quick Seed Users Selector */}
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 space-y-2">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            Quick Test Seed Accounts
          </span>
          <span className="text-slate-400 font-normal">Pass: password123</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {SEED_USERS.map((user) => (
            <button
              key={user.email}
              type="button"
              onClick={() => handleSelectSeedUser(user.email)}
              className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-all text-left truncate ${
                email === user.email
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
              title={user.email}
            >
              <span className="block font-semibold truncate">{user.name.split(" ")[0]}</span>
              <span className="block text-[10px] opacity-80 truncate">{user.email.split("@")[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error Callout */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl flex items-start gap-2.5">
          <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <div className="leading-tight">{error}</div>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-slate-50 border border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all outline-none pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-medium"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="text-center pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-semibold text-indigo-600 hover:text-indigo-700 underline underline-offset-2 transition-colors"
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
};
