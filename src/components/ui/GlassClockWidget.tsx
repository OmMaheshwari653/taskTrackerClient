"use client";

import React from "react";
import { formatTimerSeconds } from "@/lib/formatters";

interface GlassClockWidgetProps {
  totalSeconds: number;
  isRunning: boolean;
  size?: "sm" | "md" | "lg";
  showDigital?: boolean;
}

export const GlassClockWidget: React.FC<GlassClockWidgetProps> = ({
  totalSeconds,
  isRunning,
  size = "md",
  showDigital = true,
}) => {
  const MathMaxSeconds = Math.max(0, Math.floor(totalSeconds));

  // Angles for clock hands (360 degrees = 60 seconds / 60 minutes / 12 hours)
  const secondsAngle = (MathMaxSeconds % 60) * 6;
  const minutesAngle = ((MathMaxSeconds / 60) % 60) * 6 + (MathMaxSeconds % 60) * 0.1;
  const hoursAngle = ((MathMaxSeconds / 3600) % 12) * 30 + ((MathMaxSeconds / 60) % 60) * 0.5;

  const sizeDimensions = {
    sm: "w-20 h-20",
    md: "w-32 h-32",
    lg: "w-44 h-44",
  };

  const svgSizes = {
    sm: 80,
    md: 128,
    lg: 176,
  };

  const currentDimension = sizeDimensions[size];
  const dimensionPx = svgSizes[size];
  const center = dimensionPx / 2;
  const radius = center - 6;

  // Generate 12 hour ticks
  const hourTicks = Array.from({ length: 12 }).map((_, i) => {
    const angle = i * 30 * (Math.PI / 180);
    const innerR = radius - (i % 3 === 0 ? 8 : 5);
    const outerR = radius - 2;

    const x1 = center + innerR * Math.sin(angle);
    const y1 = center - innerR * Math.cos(angle);
    const x2 = center + outerR * Math.sin(angle);
    const y2 = center - outerR * Math.cos(angle);

    return (
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={i % 3 === 0 ? (isRunning ? "#10B981" : "#6366F1") : "#94A3B8"}
        strokeWidth={i % 3 === 0 ? 2 : 1}
        strokeLinecap="round"
        opacity={i % 3 === 0 ? 0.9 : 0.4}
      />
    );
  });

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className={`relative ${currentDimension} flex items-center justify-center`}>
        {/* Glow Ring */}
        <div
          className={`absolute inset-0 rounded-full transition-all duration-500 ${
            isRunning
              ? "bg-gradient-to-tr from-emerald-500/20 to-teal-400/15 blur-md"
              : "bg-gradient-to-tr from-indigo-500/10 to-purple-500/5 blur-xs"
          }`}
        />

        {/* Glass Face Dial */}
        <div className="relative z-10 w-full h-full rounded-full bg-white/70 backdrop-blur-md border border-white/80 shadow-md flex items-center justify-center overflow-hidden">
          <svg
            width={dimensionPx}
            height={dimensionPx}
            viewBox={`0 0 ${dimensionPx} ${dimensionPx}`}
            className="w-full h-full"
          >
            {/* Background Dial Circle */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={isRunning ? "rgba(16, 185, 129, 0.2)" : "rgba(99, 102, 241, 0.15)"}
              strokeWidth="2"
            />

            {/* Hour Ticks */}
            {hourTicks}

            {/* Hour Hand */}
            <line
              x1={center}
              y1={center}
              x2={center + (radius * 0.45) * Math.sin(hoursAngle * (Math.PI / 180))}
              y2={center - (radius * 0.45) * Math.cos(hoursAngle * (Math.PI / 180))}
              stroke="#0F172A"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Minute Hand */}
            <line
              x1={center}
              y1={center}
              x2={center + (radius * 0.65) * Math.sin(minutesAngle * (Math.PI / 180))}
              y2={center - (radius * 0.65) * Math.cos(minutesAngle * (Math.PI / 180))}
              stroke={isRunning ? "#059669" : "#4F46E5"}
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Second Hand (Active Ticking) */}
            <line
              x1={center - (radius * 0.15) * Math.sin(secondsAngle * (Math.PI / 180))}
              y1={center + (radius * 0.15) * Math.cos(secondsAngle * (Math.PI / 180))}
              x2={center + (radius * 0.78) * Math.sin(secondsAngle * (Math.PI / 180))}
              y2={center - (radius * 0.78) * Math.cos(secondsAngle * (Math.PI / 180))}
              stroke={isRunning ? "#DC2626" : "#64748B"}
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Center Pin Cap */}
            <circle
              cx={center}
              cy={center}
              r="4"
              fill={isRunning ? "#DC2626" : "#0F172A"}
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>

      {/* Digital Time Ticker */}
      {showDigital && (
        <div className="text-center font-mono font-extrabold tracking-tight">
          <span
            className={`text-lg sm:text-2xl font-mono font-black tracking-tight ${
              isRunning ? "text-emerald-950" : "text-slate-900"
            }`}
          >
            {formatTimerSeconds(totalSeconds)}
          </span>
        </div>
      )}
    </div>
  );
};
