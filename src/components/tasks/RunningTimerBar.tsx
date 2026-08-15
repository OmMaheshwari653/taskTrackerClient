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
    <div className="glass-panel-active rounded-3xl p-5 sm:p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300 relative overflow-hidden">
      {/* Task Info */}
      <div className="min-w-0 w-full md:w-auto flex-1 space-y-1.5 text-center md:text-left z-10">
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 break-words line-clamp-2 leading-tight">
          {runningTask.title}
        </h3>
        {runningTask.description && (
          <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
            {runningTask.description}
          </p>
        )}
      </div>

      {/* Live Analog Clock Widget */}
      <div className="z-10 shrink-0 p-1 sm:p-2">
        <GlassClockWidget
          totalSeconds={liveTotalSeconds}
          isRunning={true}
          size="md"
          showDigital={true}
        />
      </div>

      {/* Frosted Translucent Red Stop Button */}
      <div className="z-10 w-full md:w-auto flex items-center justify-center md:justify-end border-t md:border-t-0 border-white/30 pt-4 md:pt-0">
        <button
          type="button"
          onClick={handleStop}
          disabled={stopping}
          className="w-full md:w-auto glass-red-button px-6 py-3 text-xs rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5 disabled:opacity-60"
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
