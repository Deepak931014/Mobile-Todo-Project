import React from 'react';
import { Search, Settings, Bell, CheckSquare, XSquare, Plus } from 'lucide-react';
import StatusBar from './StatusBar';
import WeekStrip from './WeekStrip';
import TaskCard from './TaskCard';

export default function HomeScreen({
  tasks = [],
  selectedDate,
  onSelectDate,
  weeklyStats,
  onOpenSearch,
  onOpenNewTask,
  onOpenWeeklyOverview,
  onToggleStatus,
  onEditTask,
  onDeleteTask,
  onResetOnboarding,
}) {
  // Filter tasks for the selected date
  const dayTasks = tasks.filter((t) => t.date === selectedDate);

  // Compute counts for the active week
  const completedCount = weeklyStats?.currentWeek?.completedCount ?? tasks.filter((t) => t.status === 'Completed').length;
  const pendingCount = weeklyStats?.currentWeek?.openCount ?? tasks.filter((t) => t.status !== 'Completed').length;
  const totalCount = completedCount + pendingCount;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="flex flex-col h-full w-full bg-[#FAFAFC] relative select-none overflow-hidden">
      {/* Mobile Status Bar */}
      <StatusBar dark={false} />

      {/* Top Header & Search Bar */}
      <div className="px-5 pt-1 pb-3 space-y-3">
        {/* Top Control Bar with Gear, Search shortcut, and Bell */}
        <div className="flex items-center justify-between text-slate-700">
          <button
            onClick={onResetOnboarding}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition"
            title="Reset to Onboarding"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenSearch}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition"
              title="Search"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => alert('No new notifications')}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition relative"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Large Search Bar matching Figma */}
        <div
          onClick={onOpenSearch}
          className="w-full bg-white border border-slate-200/90 rounded-2xl px-4 py-3 flex items-center justify-between cursor-pointer shadow-sm hover:border-[#3B5DF7]/50 transition group"
        >
          <span className="text-sm text-slate-400 group-hover:text-slate-600 transition">
            Search for a task
          </span>
          <Search className="w-4 h-4 text-slate-400 group-hover:text-[#3B5DF7] transition" />
        </div>
      </div>

      {/* Week Calendar Strip (Sun-Sun / Mon-Sun) */}
      <div className="bg-white border-y border-slate-100/80">
        <WeekStrip selectedDate={selectedDate} onSelectDate={onSelectDate} />
      </div>

      {/* Scrollable Main Area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 no-scrollbar pb-24">
        {/* Summary Cards Grid: Task Complete & Task Pending */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* Task Complete Card */}
          <div
            onClick={onOpenWeeklyOverview}
            className="bg-[#EEF4FF] hover:bg-[#E5EEFF] active:scale-[0.98] transition-all cursor-pointer rounded-2xl p-4 border border-blue-100 shadow-sm relative group"
          >
            <div className="flex items-center space-x-2 text-[#3B5DF7]">
              <div className="w-5 h-5 rounded-md bg-[#3B5DF7]/15 flex items-center justify-center">
                <CheckSquare className="w-3.5 h-3.5 text-[#3B5DF7]" />
              </div>
              <span className="text-[12px] font-semibold text-slate-800">
                Task Complete
              </span>
            </div>

            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {String(completedCount).padStart(2, '0')}
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                This Week
              </span>
            </div>
          </div>

          {/* Task Pending Card */}
          <div
            onClick={onOpenWeeklyOverview}
            className="bg-[#FFF1F2] hover:bg-[#FFE8EB] active:scale-[0.98] transition-all cursor-pointer rounded-2xl p-4 border border-rose-100 shadow-sm relative group"
          >
            <div className="flex items-center space-x-2 text-rose-500">
              <div className="w-5 h-5 rounded-md bg-rose-500/15 flex items-center justify-center">
                <XSquare className="w-3.5 h-3.5 text-rose-500" />
              </div>
              <span className="text-[12px] font-semibold text-slate-800">
                Task Pending
              </span>
            </div>

            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {String(pendingCount).padStart(2, '0')}
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                This Week
              </span>
            </div>
          </div>
        </div>

        {/* Weekly Progress Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Weekly Progress
            </h2>
            <span className="text-xs font-semibold text-[#3B5DF7]">
              {progressPercent}%
            </span>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full h-3 bg-[#E0E7FF] rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-[#1E3A8A] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Tasks Today Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Tasks Today
            </h2>
            <button
              onClick={onOpenWeeklyOverview}
              className="text-xs font-semibold text-[#3B5DF7] hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          {/* Task List */}
          {dayTasks.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-slate-200">
              <p className="text-xs text-slate-400">No tasks for this date</p>
              <button
                onClick={() => onOpenNewTask(selectedDate)}
                className="mt-2 text-xs font-semibold text-[#3B5DF7] hover:underline"
              >
                + Add a task for today
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {dayTasks.map((t) => (
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

      {/* Floating Action Button (FAB) at bottom center */}
      <div className="absolute bottom-6 inset-x-0 flex justify-center pointer-events-none z-20">
        <button
          onClick={() => onOpenNewTask(selectedDate)}
          className="w-14 h-14 bg-[#3B5DF7] hover:bg-[#2F4FE0] text-white rounded-full flex items-center justify-center shadow-float pointer-events-auto hover:scale-105 active:scale-95 transition-all"
          title="Add New Task"
          aria-label="Add New Task"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
