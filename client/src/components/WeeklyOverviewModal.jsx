import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, CheckSquare, XSquare, Calendar, Plus } from 'lucide-react';
import TaskCard from './TaskCard';
import { getWeekBounds, formatWeekLabel, formatDateKey } from '../utils/dateUtils';

export default function WeeklyOverviewModal({
  isOpen,
  onClose,
  allTasks = [],
  onToggleStatus,
  onEditTask,
  onDeleteTask,
  onAddTask,
}) {
  const [currentOffset, setCurrentOffset] = useState(0); // Offset in weeks (0 = current week, -1 = last week, +1 = next week)

  if (!isOpen) return null;

  // Calculate target week date
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + currentOffset * 7);

  const { weekStart, weekEnd, weekNumber, year } = getWeekBounds(targetDate);

  // Filter tasks belonging to this week
  const weekTasks = allTasks.filter((t) => {
    // If task has weekStart saved, compare; otherwise calculate from task.date
    if (t.weekStart) return t.weekStart === weekStart;
    const b = getWeekBounds(new Date(t.date));
    return b.weekStart === weekStart;
  });

  const openCount = weekTasks.filter((t) => t.status !== 'Completed').length;
  const completedCount = weekTasks.filter((t) => t.status === 'Completed').length;
  const total = weekTasks.length;
  const progressPercent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
      <div
        className="w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <span className="text-[11px] font-bold text-[#3B5DF7] uppercase tracking-wider">
              Weekly Overview
            </span>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              Week {weekNumber}, {year}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Week Switcher Navigation */}
        <div className="px-6 py-3 bg-white border-b border-slate-100 flex items-center justify-between">
          <button
            onClick={() => setCurrentOffset((prev) => prev - 1)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95 transition"
            title="Previous Week"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="text-center">
            <span className="text-xs font-semibold text-slate-800 flex items-center justify-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-[#3B5DF7] mr-1" />
              {formatWeekLabel(weekStart, weekEnd)}
            </span>
            <span className="text-[10px] text-slate-400">
              Monday to Sunday
            </span>
          </div>

          <button
            onClick={() => setCurrentOffset((prev) => prev + 1)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95 transition"
            title="Next Week"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 no-scrollbar">
          {/* Week Summary Cards Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Completed Tasks Card */}
            <div className="bg-[#EEF4FF] rounded-2xl p-4 border border-blue-100">
              <div className="flex items-center space-x-2 text-[#3B5DF7]">
                <CheckSquare className="w-4 h-4" />
                <span className="text-xs font-semibold">Completed</span>
              </div>
              <div className="mt-2 flex items-baseline space-x-1.5">
                <span className="text-2xl font-black text-slate-900">
                  {String(completedCount).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Tasks</span>
              </div>
            </div>

            {/* Open / Pending Tasks Card */}
            <div className="bg-[#FFF1F2] rounded-2xl p-4 border border-rose-100">
              <div className="flex items-center space-x-2 text-rose-500">
                <XSquare className="w-4 h-4" />
                <span className="text-xs font-semibold">Open / Pending</span>
              </div>
              <div className="mt-2 flex items-baseline space-x-1.5">
                <span className="text-2xl font-black text-slate-900">
                  {String(openCount).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Tasks</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>Weekly Completion</span>
              <span className="text-[#3B5DF7]">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#3B5DF7] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Week Tasks List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Tasks This Week ({weekTasks.length})
              </h3>
              <button
                onClick={() => {
                  onClose();
                  onAddTask(weekStart);
                }}
                className="text-xs text-[#3B5DF7] font-semibold flex items-center hover:underline"
              >
                <Plus className="w-3.5 h-3.5 mr-0.5" />
                Add to Week
              </button>
            </div>

            {weekTasks.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-400">No tasks scheduled for this week</p>
                <button
                  onClick={() => {
                    onClose();
                    onAddTask(weekStart);
                  }}
                  className="mt-2 text-xs font-semibold text-[#3B5DF7] hover:underline"
                >
                  Create task for this week
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {weekTasks.map((t) => (
                  <TaskCard
                    key={t._id}
                    task={t}
                    onToggleStatus={onToggleStatus}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-xl transition"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
}

