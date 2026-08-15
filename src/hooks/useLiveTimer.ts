"use client";

import { useEffect, useState } from "react";

interface UseLiveTimerProps {
  startTime: string | null;
  isRunning: boolean;
  baseSeconds?: number;
}

export function useLiveTimer({ startTime, isRunning, baseSeconds = 0 }: UseLiveTimerProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  useEffect(() => {
    if (!isRunning || !startTime) {
      setElapsedSeconds(0);
      return;
    }

    const calculateElapsed = () => {
      const startMs = new Date(startTime).getTime();
      const nowMs = Date.now();
      const diffSeconds = Math.max(0, Math.floor((nowMs - startMs) / 1000));
      setElapsedSeconds(diffSeconds);
    };

    // Calculate immediately on mount / start
    calculateElapsed();

    // Update every second
    const interval = setInterval(calculateElapsed, 1000);

    // Recalculate immediately when tab becomes visible after backgrounding
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        calculateElapsed();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [startTime, isRunning]);

  return {
    elapsedSeconds,
    liveTotalSeconds: isRunning ? baseSeconds + elapsedSeconds : baseSeconds,
  };
}
