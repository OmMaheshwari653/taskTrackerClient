"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function Home() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-slate-600 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm">
          <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm font-medium">Checking authentication...</span>
        </div>
      </main>
    );
  }

  // Authenticated State View
  if (isAuthenticated && user) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-8 space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>

          <div className="space-y-1">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70 mb-2">
              Authentication Active
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Welcome, {user.name || user.email.split("@")[0]}!
            </h1>
            <p className="text-xs text-slate-500 font-mono bg-slate-100 py-1 px-3 rounded-lg inline-block">
              {user.email} (ID: #{user.id})
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-left space-y-2 text-xs">
            <div className="font-semibold text-slate-700">Auth Status Summary:</div>
            <div className="text-slate-600 flex justify-between">
              <span>JWT Token:</span>
              <span className="font-mono text-emerald-600 font-bold">Verified &amp; Stored</span>
            </div>
            <div className="text-slate-600 flex justify-between">
              <span>Backend Status:</span>
              <span className="font-mono text-indigo-600 font-bold">Connected</span>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all border border-slate-300 text-sm"
          >
            Sign Out
          </button>
        </div>
      </main>
    );
  }

  // Unauthenticated State: Sign In / Sign Up Card View
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/70 to-indigo-50/40 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-4">
        {/* Tab Toggle Header */}
        <div className="flex bg-slate-200/60 p-1.5 rounded-2xl border border-slate-300/60">
          <button
            type="button"
            onClick={() => setAuthMode("login")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              authMode === "login"
                ? "bg-white text-indigo-600 shadow-sm shadow-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setAuthMode("register")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              authMode === "register"
                ? "bg-white text-indigo-600 shadow-sm shadow-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Auth Forms */}
        {authMode === "login" ? (
          <LoginForm onSwitchToRegister={() => setAuthMode("register")} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setAuthMode("login")} />
        )}
      </div>
    </main>
  );
}
