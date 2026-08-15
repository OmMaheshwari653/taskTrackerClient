"use client";

import React from "react";
import { TodaySummary as TodaySummaryType } from "@/lib/api";
import { formatDurationHuman, formatTimerSeconds } from "@/lib/formatters";
import { useLiveTimer } from "@/hooks/useLiveTimer";

interface TodaySummaryProps {
  summary: TodaySummaryType | null;
  loading: boolean;
}

export const TodaySummary: React.FC<TodaySummaryProps> = ({ summary, loading }) => {
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
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs animate-pulse space-y-3">
            <div className="h-4 bg-slate-100 rounded w-1/2"></div>
            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {/* Card 1: Time Logged Today */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-2">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-semibold uppercase tracking-wider">Time Today</span>
          <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
            {formatDurationHuman(totalSecondsTodayWithLive)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Logged across all tasks today
          </div>
        </div>
      </div>

      {/* Card 2: Tasks Worked Today */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-2">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-semibold uppercase tracking-wider">Tasks Worked</span>
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
          </svg>
        </div>
        <div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {summary?.tasksWorkedCount || 0} <span className="text-sm font-semibold text-slate-400">tasks</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Active or updated time entries
          </div>
        </div>
      </div>

      {/* Card 3: Current Running Timer Status */}
      <div className={`rounded-2xl p-5 border shadow-xs flex flex-col justify-between space-y-2 transition-all ${
        isRunning
          ? "bg-emerald-50/70 border-emerald-200/80 text-emerald-900"
          : "bg-white border-slate-200/80 text-slate-900"
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Active Clock
          </span>
          {isRunning ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-300/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              RUNNING
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
              IDLE
            </span>
          )}
        </div>

        <div>
          {isRunning && summary?.runningTask ? (
            <div>
              <div className="text-xl font-bold font-mono text-emerald-700 tracking-tight">
                {formatTimerSeconds(activeElapsed)}
              </div>
              <div className="text-xs font-medium text-emerald-800 break-words line-clamp-2 mt-0.5 leading-snug">
                {summary.runningTask.title}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-xl font-extrabold text-slate-400">No Timer Active</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Select a task below to start clocking
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
