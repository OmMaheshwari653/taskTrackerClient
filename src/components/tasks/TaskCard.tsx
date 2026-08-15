"use client";

import React, { useState } from "react";
import { Task } from "@/lib/api";
import { formatDateShort, formatDurationHuman, formatTimerSeconds } from "@/lib/formatters";
import { useLiveTimer } from "@/hooks/useLiveTimer";

interface TaskCardProps {
  task: Task;
  onStartTimer: (taskId: number) => Promise<void>;
  onStopTimer: (taskId: number) => Promise<void>;
  onViewDetails: (taskId: number) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStartTimer,
  onStopTimer,
  onViewDetails,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const isRunning = Boolean(task.isRunning && task.status === "running");
  const startTime = task.runningSince || null;

  const { liveTotalSeconds } = useLiveTimer({
    startTime,
    isRunning,
    baseSeconds: task.totalSeconds || 0,
  });

  const handleToggleTimer = async () => {
    setLoading(true);
    try {
      if (isRunning) {
        await onStopTimer(task.id);
      } else {
        await onStartTimer(task.id);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`rounded-2xl p-5 flex flex-col justify-between space-y-4 ${
        isRunning
          ? "glass-panel-active text-emerald-950"
          : "glass-panel-interactive text-slate-900"
      }`}
    >
      {/* Top Header & Status Badge */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          {isRunning ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              RUNNING
            </span>
          ) : task.status === "done" ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              DONE
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
              OPEN
            </span>
          )}

          {task.dueDate && (
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              Due {formatDateShort(task.dueDate)}
            </span>
          )}
        </div>

        {/* Title & Description */}
        <div>
          <h3
            onClick={() => onViewDetails(task.id)}
            className="text-base font-bold text-slate-900 cursor-pointer hover:text-indigo-600 transition-colors line-clamp-2 break-words leading-snug"
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Counter & Action Button */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        {/* Time Display */}
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
            {isRunning ? "Live Elapsed" : "Total Time"}
          </span>
          <div className={`font-mono font-bold text-base ${isRunning ? "text-emerald-600" : "text-slate-800"}`}>
            {isRunning ? formatTimerSeconds(liveTotalSeconds) : formatDurationHuman(task.totalSeconds)}
          </div>
        </div>

        {/* Action Toggle Button & View Details */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onViewDetails(task.id)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            title="View Details & Entries"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </button>

          <button
            type="button"
            onClick={handleToggleTimer}
            disabled={loading}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-60 ${
              isRunning
                ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20"
            }`}
          >
            {loading ? (
              <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : isRunning ? (
              <>
                <div className="w-2 h-2 bg-white rounded-xs"></div>
                Stop
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Start
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
