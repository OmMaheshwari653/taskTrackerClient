"use client";

import React, { useState } from "react";
import { Task } from "@/lib/api";
import { useLiveTimer } from "@/hooks/useLiveTimer";
import { GlassClockWidget } from "@/components/ui/GlassClockWidget";

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
    <div className="glass-panel-active rounded-3xl p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300 relative overflow-hidden">
      {/* Background Subtle Glow Accent */}
      <div className="absolute -right-10 -top-10 w-56 h-56 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* Left: Task Meta Info */}
      <div className="flex items-start gap-4 min-w-0 w-full md:w-auto flex-1 z-10">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0 font-bold">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>

        <div className="min-w-0 space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            {/* High-Contrast Dark Green Badge */}
            <span className="px-3 py-0.5 rounded-full text-[11px] font-black tracking-wider uppercase bg-emerald-950/90 text-emerald-300 border border-emerald-400/40 shadow-xs">
              Active Task Clock
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 break-words line-clamp-2 leading-tight">
            {runningTask.title}
          </h3>
          {runningTask.description && (
            <p className="text-xs text-slate-600 line-clamp-1 leading-relaxed">
              {runningTask.description}
            </p>
          )}
        </div>
      </div>

      {/* Center: Live Glass Clock Widget */}
      <div className="z-10 shrink-0 py-1 sm:py-0">
        <GlassClockWidget
          totalSeconds={liveTotalSeconds}
          isRunning={true}
          size="md"
          showDigital={true}
        />
      </div>

      {/* Right: Stop Action Control with Subtle Pulse Glow */}
      <div className="z-10 w-full md:w-auto flex items-center justify-center md:justify-end border-t md:border-t-0 border-emerald-200/60 pt-4 md:pt-0">
        <button
          type="button"
          onClick={handleStop}
          disabled={stopping}
          className="w-full md:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-2xl pulse-red-glow transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5 disabled:opacity-60"
        >
          {stopping ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Stopping Timer...
            </>
          ) : (
            <>
              <div className="w-3 h-3 rounded-xs bg-white"></div>
              Stop Timer Clock
            </>
          )}
        </button>
      </div>
    </div>
  );
};
