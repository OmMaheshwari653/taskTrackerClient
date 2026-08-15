"use client";

import React, { useState } from "react";
import { Task } from "@/lib/api";
import { formatTimerSeconds } from "@/lib/formatters";
import { useLiveTimer } from "@/hooks/useLiveTimer";

interface RunningTimerBarProps {
  runningTask: Task | null;
  onStopTimer: (taskId: number) => Promise<void>;
}

export const RunningTimerBar: React.FC<RunningTimerBarProps> = ({
  runningTask,
  onStopTimer,
}) => {
  const [stopping, setStopping] = useState<boolean>(false);

  const isRunning = !!runningTask;
  const startTime = runningTask?.runningSince || null;

  const { liveTotalSeconds } = useLiveTimer({
    startTime,
    isRunning,
    baseSeconds: runningTask?.totalSeconds || 0,
  });

  if (!runningTask) return null;

  const handleStop = async () => {
    setStopping(true);
    try {
      await onStopTimer(runningTask.id);
    } finally {
      setStopping(false);
    }
  };

  return (
    <div className="bg-emerald-600 text-white rounded-2xl p-4 sm:p-5 shadow-lg shadow-emerald-600/20 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all animate-fadeIn">
      {/* Task Info & Pulse Indicator */}
      <div className="flex items-center gap-3.5 w-full sm:w-auto min-w-0">
        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shrink-0">
          <span className="w-3 h-3 rounded-full bg-white animate-ping"></span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold tracking-wider uppercase bg-emerald-700/80 px-2 py-0.5 rounded text-emerald-100">
              Timer Running Now
            </span>
          </div>
          <h3 className="text-sm sm:text-lg font-bold text-white break-words line-clamp-2 mt-0.5 leading-snug">
            {runningTask.title}
          </h3>
        </div>
      </div>

      {/* Live Counter & Stop Action */}
      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-emerald-500/50">
        <div className="text-right">
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight leading-none">
            {formatTimerSeconds(liveTotalSeconds)}
          </div>
          <div className="text-[10px] text-emerald-100 mt-1 font-medium">
            Elapsed total time
          </div>
        </div>

        <button
          type="button"
          onClick={handleStop}
          disabled={stopping}
          className="px-4 py-2.5 bg-white hover:bg-emerald-50 text-emerald-800 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 shrink-0 disabled:opacity-60"
        >
          {stopping ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5 text-emerald-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Stopping...
            </>
          ) : (
            <>
              <div className="w-2.5 h-2.5 rounded-xs bg-emerald-800"></div>
              Stop Timer
            </>
          )}
        </button>
      </div>
    </div>
  );
};
