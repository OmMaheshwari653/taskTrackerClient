"use client";

import { useEffect, useRef, useState } from "react";

interface UseLiveTimerProps {
  startTime: string | null;
  isRunning: boolean;
  baseSeconds?: number;
}

export function useLiveTimer({ startTime, isRunning, baseSeconds = 0 }: UseLiveTimerProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear existing interval immediately to prevent stale timer ticks
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

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

    // Calculate immediately on start
    calculateElapsed();

    // Efficiently manage interval ID in ref
    intervalRef.current = setInterval(calculateElapsed, 1000);

    // Re-sync instantly on tab focus
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        calculateElapsed();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [startTime, isRunning]);

  // Synchronously guard against stale state lag when isRunning toggles to false
  const activeElapsed = isRunning && startTime ? elapsedSeconds : 0;

  return {
    elapsedSeconds: activeElapsed,
    liveTotalSeconds: isRunning && startTime ? baseSeconds + activeElapsed : baseSeconds,
  };
}
