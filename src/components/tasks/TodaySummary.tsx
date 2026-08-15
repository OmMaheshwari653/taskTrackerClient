"use client";

import React from "react";
import { TodaySummary as TodaySummaryType } from "@/lib/api";
import { formatDurationHuman } from "@/lib/formatters";
import { useLiveTimer } from "@/hooks/useLiveTimer";

interface TodaySummaryProps {
  summary: TodaySummaryType | null;
  loading: boolean;
  completedTasksCount?: number;
}

export const TodaySummary: React.FC<TodaySummaryProps> = ({
  summary,
  loading,
  completedTasksCount = 0,
}) => {
  const isRunning = !!summary?.runningTask;
  const startTime = summary?.runningTask?.startTime || null;
  const initialElapsed = summary?.runningTask?.elapsedSeconds || 0;

  const { elapsedSeconds } = useLiveTimer({
    startTime,
    isRunning,
    baseSeconds: initialElapsed,
  });

  const activeElapsed = isRunning ? Math.max(initialElapsed, elapsedSeconds) : 0;
  const totalSecondsTodayWithLive = (summary?.totalSecondsToday || 0) + (isRunning ? (activeElapsed - initialElapsed) : 0);

  if (loading && !summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-panel rounded-2xl p-5 animate-pulse space-y-2">
            <div className="h-3 bg-slate-200/60 rounded w-1/3"></div>
            <div className="h-6 bg-slate-300/60 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex sm:grid sm:grid-cols-3 overflow-x-auto snap-x snap-mandatory scrollbar-none gap-4 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 mb-6">
      {/* Card 1: Time Logged Today */}
      <div className="glass-panel-interactive rounded-2xl p-5 flex flex-col justify-between space-y-3 min-w-[78vw] sm:min-w-0 snap-start shrink-0 sm:shrink">
        <div className="flex items-center justify-between text-slate-600">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600">Total Time Today</span>
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
        <div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
            {formatDurationHuman(totalSecondsTodayWithLive)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">
            Logged across all entries today
          </div>
        </div>
      </div>

      {/* Card 2: Tasks Worked Today */}
      <div className="glass-panel-interactive rounded-2xl p-5 flex flex-col justify-between space-y-3 min-w-[78vw] sm:min-w-0 snap-start shrink-0 sm:shrink">
        <div className="flex items-center justify-between text-slate-600">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-600">Tasks Worked</span>
          <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
            </svg>
          </div>
        </div>
        <div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {summary?.tasksWorkedCount || 0} <span className="text-sm font-bold text-slate-400">tasks</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">
            Active or updated time entries
          </div>
        </div>
      </div>

      {/* Card 3: Completed Tasks (Replaced Redundant Active Clock Card) */}
      <div className="glass-panel-interactive rounded-2xl p-5 flex flex-col justify-between space-y-3 min-w-[78vw] sm:min-w-0 snap-start shrink-0 sm:shrink">
        <div className="flex items-center justify-between text-slate-600">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600">Completed Tasks</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
        <div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {completedTasksCount} <span className="text-sm font-bold text-slate-400">completed</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">
            Tasks marked done & finished
          </div>
        </div>
      </div>
    </div>
  );
};
