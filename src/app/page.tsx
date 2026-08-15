"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api, Task, TodaySummary as TodaySummaryType } from "@/lib/api";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Header } from "@/components/layout/Header";
import { TodaySummary } from "@/components/tasks/TodaySummary";
import { RunningTimerBar } from "@/components/tasks/RunningTimerBar";
import { TaskList } from "@/components/tasks/TaskList";
import { AddTaskModal } from "@/components/tasks/AddTaskModal";
import { TaskDetailModal } from "@/components/tasks/TaskDetailModal";

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Auth View state
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Dashboard Data State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [summary, setSummary] = useState<TodaySummaryType | null>(null);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Network & Mid-Request Error Banner
  const [networkError, setNetworkError] = useState<string | null>(null);

  // Modals state
  const [isAddTaskOpen, setIsAddTaskOpen] = useState<boolean>(false);
  const [selectedDetailTaskId, setSelectedDetailTaskId] = useState<number | null>(null);

  // Fetch Dashboard Data (Tasks & Today Summary)
  const fetchDashboardData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoadingData(true);

    setNetworkError(null);

    try {
      const [tasksData, summaryData] = await Promise.all([
        api.getTasks(),
        api.getTodaySummary(),
      ]);

      setTasks(tasksData);
      setSummary(summaryData);
    } catch (err: any) {
      setNetworkError(err.message || "Failed to connect to backend server");
    } finally {
      setLoadingData(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated, fetchDashboardData]);

  // Timer Start Handler (Enforces Single-Timer Rule atomically)
  const handleStartTimer = async (taskId: number) => {
    setNetworkError(null);
    try {
      await api.startTaskTimer(taskId);
      // Re-fetch to update state across all tasks
      await fetchDashboardData(true);
    } catch (err: any) {
      setNetworkError(err.message || "Failed to start timer");
    }
  };

  // Timer Stop Handler
  const handleStopTimer = async (taskId: number) => {
    setNetworkError(null);
    try {
      await api.stopTaskTimer(taskId);
      await fetchDashboardData(true);
    } catch (err: any) {
      setNetworkError(err.message || "Failed to stop timer");
    }
  };

  // Create Task Handler
  const handleCreateTask = async (taskData: {
    title: string;
    description?: string;
    dueDate?: string;
  }) => {
    setNetworkError(null);
    try {
      await api.createTask(taskData);
      await fetchDashboardData(true);
    } catch (err: any) {
      setNetworkError(err.message || "Failed to create task");
      throw err;
    }
  };

  // Filter Tasks locally
  const filteredTasks = tasks.filter((t) => {
    if (activeFilter === "running") return t.isRunning || t.status === "running";
    if (activeFilter === "open") return t.status === "open" && !t.isRunning;
    if (activeFilter === "done") return t.status === "done";
    return true;
  });

  // Find currently running task
  const runningTask = tasks.find((t) => t.isRunning || t.status === "running") || null;

  // Unauthenticated Session Check Loading State
  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-slate-600 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-xs">
          <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm font-medium">Restoring session...</span>
        </div>
      </main>
    );
  }

  // Unauthenticated State: Render Sign In / Sign Up Forms
  if (!isAuthenticated || !user) {
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
                  ? "bg-white text-indigo-600 shadow-xs"
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
                  ? "bg-white text-indigo-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Auth Components */}
          {authMode === "login" ? (
            <LoginForm onSwitchToRegister={() => setAuthMode("register")} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setAuthMode("login")} />
          )}
        </div>
      </main>
    );
  }

  // Authenticated State: Main Task Tracker Dashboard
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Header
        onOpenAddTask={() => setIsAddTaskOpen(true)}
        onRefresh={() => fetchDashboardData(true)}
        isRefreshing={refreshing}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Network Error Toast / Banner (PDF Requirement) */}
        {networkError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-2xl flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <span>{networkError}</span>
            </div>
            <button
              onClick={() => fetchDashboardData(true)}
              className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 font-bold rounded-lg transition-colors text-[11px]"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Global Active Running Timer Banner */}
        <RunningTimerBar
          runningTask={runningTask}
          onStopTimer={handleStopTimer}
        />

        {/* Today Summary Top Cards */}
        <TodaySummary
          summary={summary}
          loading={loadingData}
        />

        {/* Task List Section */}
        <TaskList
          tasks={filteredTasks}
          loading={loadingData}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onStartTimer={handleStartTimer}
          onStopTimer={handleStopTimer}
          onViewDetails={(taskId) => setSelectedDetailTaskId(taskId)}
          onOpenAddTask={() => setIsAddTaskOpen(true)}
          onRefresh={() => fetchDashboardData(true)}
        />
      </main>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onSubmitTask={handleCreateTask}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        taskId={selectedDetailTaskId}
        isOpen={selectedDetailTaskId !== null}
        onClose={() => setSelectedDetailTaskId(null)}
      />
    </div>
  );
}
