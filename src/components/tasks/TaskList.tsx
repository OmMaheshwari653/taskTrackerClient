"use client";

import React, { useState } from "react";
import { Task } from "@/lib/api";
import { TaskCard } from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onStartTimer: (taskId: number) => Promise<void>;
  onStopTimer: (taskId: number) => Promise<void>;
  onViewDetails: (taskId: number) => void;
  onOpenAddTask: () => void;
  onRefresh: () => void;
}

const FILTER_TABS = [
  { id: "all", label: "All Tasks" },
  { id: "running", label: "Running" },
  { id: "open", label: "Open" },
  { id: "done", label: "Done" },
];

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading,
  activeFilter,
  onFilterChange,
  onStartTimer,
  onStopTimer,
  onViewDetails,
  onOpenAddTask,
  onRefresh,
}) => {
  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        {/* Tabs */}
        <div className="flex items-center bg-slate-200/60 p-1 rounded-xl border border-slate-300/50 self-start sm:self-auto">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onFilterChange(tab.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeFilter === tab.id
                  ? "bg-white text-indigo-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
              {tab.id === "running" && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-700">
                  {tasks.filter((t) => t.isRunning || t.status === "running").length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Task Count & Refresh */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-900">{tasks.length}</strong> tasks
          </span>
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading && tasks.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs animate-pulse space-y-4">
              <div className="h-4 bg-slate-100 rounded w-1/3"></div>
              <div className="h-5 bg-slate-200 rounded w-3/4"></div>
              <div className="h-10 bg-slate-100 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        /* Informative Empty State (PDF Requirement) */
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-4 max-w-md mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">No Tasks Found</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {activeFilter !== "all"
                ? `There are no tasks matching the "${activeFilter}" status filter.`
                : "You don't have any tasks created yet. Click below to create your first task!"}
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-2">
            {activeFilter !== "all" ? (
              <button
                type="button"
                onClick={() => onFilterChange("all")}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all"
              >
                Clear Filter
              </button>
            ) : null}
            <button
              type="button"
              onClick={onOpenAddTask}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/20"
            >
              + Create First Task
            </button>
          </div>
        </div>
      ) : (
        /* Task Cards Horizontal Carousel on Mobile / 3-Col Grid on Desktop */
        <div key={activeFilter} className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-3 -mx-4 px-4 md:mx-0 md:px-0 animate-tab-switch">
          {tasks.map((task) => (
            <div key={task.id} className="min-w-[85vw] sm:min-w-0 snap-start shrink-0 sm:shrink">
              <TaskCard
                task={task}
                onStartTimer={onStartTimer}
                onStopTimer={onStopTimer}
                onViewDetails={onViewDetails}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
