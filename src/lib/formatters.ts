/**
 * Formatting Utilities for Time, Seconds, and Dates
 */

/**
 * Format total seconds into HH:MM:SS live timer string
 */
export function formatTimerSeconds(totalSeconds: number): string {
  const MathMaxSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(MathMaxSeconds / 3600);
  const minutes = Math.floor((MathMaxSeconds % 3600) / 60);
  const seconds = MathMaxSeconds % 60;

  const pad = (num: number) => String(num).padStart(2, "0");

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Format seconds into human readable duration (e.g., "2h 15m 30s", "45m 10s", "12s")
 */
export function formatDurationHuman(totalSeconds: number): string {
  const MathMaxSeconds = Math.max(0, Math.floor(totalSeconds));
  if (MathMaxSeconds === 0) return "0s";

  const hours = Math.floor(MathMaxSeconds / 3600);
  const minutes = Math.floor((MathMaxSeconds % 3600) / 60);
  const seconds = MathMaxSeconds % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(" ");
}

/**
 * Format ISO date string into readable date (e.g., "Aug 15, 2026, 02:30 PM")
 */
export function formatDateTime(isoString: string | null | undefined): string {
  if (!isoString) return "N/A";
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  } catch {
    return "Invalid date";
  }
}

/**
 * Format ISO date string into short date (e.g., "Aug 15, 2026")
 */
export function formatDateShort(isoString: string | null | undefined): string {
  if (!isoString) return "No due date";
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return "Invalid date";
  }
}
