"use client";

import React, { useEffect, useState } from "react";
import { api, Task, TimeEntry } from "@/lib/api";
import { formatDateTime, formatDateShort, formatDurationHuman, formatTimerSeconds } from "@/lib/formatters";

interface TaskDetailModalProps {
  taskId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  taskId,
  isOpen,
  onClose,
}) => {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !taskId) {
      setTask(null);
      return;
    }

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getTaskById(taskId);
        setTask(data);
      } catch (err: any) {
        setError(err.message || "Failed to load task details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [taskId, isOpen]);

  if (!isOpen || !taskId) return null;

  const calculateEntryDuration = (entry: TimeEntry): number => {
    const start = new Date(entry.startTime).getTime();
    const end = entry.endTime ? new Date(entry.endTime).getTime() : Date.now();
    return Math.max(0, Math.floor((end - start) / 1000));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-md animate-fadeIn">
      <div className="liquid-glass rounded-3xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Task #{taskId}
            </span>
            <h2 className="text-lg font-bold text-slate-900 truncate">Task Detail &amp; Time Log</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm space-y-3">
            <svg className="animate-spin h-6 w-6 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <div>Loading task details...</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-xl">
            {error}
          </div>
        ) : task ? (
          <div className="overflow-y-auto space-y-5 pr-1">
            {/* Metadata Summary */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{task.title}</h3>
                  {task.description && (
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{task.description}</p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Time Logged</div>
                  <div className="text-xl font-extrabold font-mono text-indigo-600">
                    {formatDurationHuman(task.totalSeconds)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400 block">Status</span>
                  <span className="font-semibold uppercase">{task.status}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Created On</span>
                  <span className="font-medium">{formatDateShort(task.createdAt)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Due Date</span>
                  <span className="font-medium">{formatDateShort(task.dueDate)}</span>
                </div>
              </div>
            </div>

            {/* Time Entries Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>Time Entries Breakdown</span>
                <span className="text-slate-400 font-normal">
                  {task.timeEntries?.length || 0} entries
                </span>
              </h4>

              {!task.timeEntries || task.timeEntries.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-200/60">
                  No time entries logged for this task yet.
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                      <tr>
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Start Time</th>
                        <th className="py-2.5 px-3">End Time</th>
                        <th className="py-2.5 px-3 text-right">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {task.timeEntries.map((entry, index) => {
                        const duration = calculateEntryDuration(entry);
                        const isOpen = entry.endTime === null;

                        return (
                          <tr key={entry.id} className={isOpen ? "bg-emerald-50/50 text-emerald-900" : "hover:bg-slate-50/50"}>
                            <td className="py-2.5 px-3 font-semibold text-slate-500">{index + 1}</td>
                            <td className="py-2.5 px-3 text-slate-700">{formatDateTime(entry.startTime)}</td>
                            <td className="py-2.5 px-3">
                              {isOpen ? (
                                <span className="inline-flex items-center gap-1 font-sans text-[11px] font-bold text-emerald-700">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                  Running now...
                                </span>
                              ) : (
                                <span className="text-slate-700">{formatDateTime(entry.endTime)}</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                              {formatTimerSeconds(duration)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Close Detail
          </button>
        </div>
      </div>
    </div>
  );
};
