import React from 'react';
import { Search, Settings, Bell, CheckSquare, XSquare, Plus, Calendar } from 'lucide-react';
import StatusBar from './StatusBar';
import WeekStrip from './WeekStrip';
import TaskCard from './TaskCard';
import { showInfoAlert } from '../utils/alertUtils';
import { formatDisplayDate } from '../utils/dateUtils';

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
  isPhoneFrame = true,
}) {
  // Filter tasks for the selected date
  const dayTasks = tasks.filter((t) => t.date === selectedDate);

  // Compute counts for the active week
  const completedCount = weeklyStats?.currentWeek?.completedCount ?? tasks.filter((t) => t.status === 'Completed').length;
  const pendingCount = weeklyStats?.currentWeek?.openCount ?? tasks.filter((t) => t.status !== 'Completed').length;
  const totalCount = completedCount + pendingCount;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleNotificationsClick = () => {
    showInfoAlert('Notifications', 'You have no new notifications right now. Keep up the great work!');
  };

  // If in Full Responsive mode on a Laptop/Desktop screen
  if (!isPhoneFrame) {
    return (
      <div className="w-full flex-1 flex flex-col bg-[#FAFAFC] select-none">
        {/* Top Desktop Navigation Bar */}
        <div className="px-8 py-5 border-b border-slate-200/80 bg-white flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Task Dashboard
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Organize, track, and complete your weekly goals
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Search Input Bar */}
            <div
              onClick={onOpenSearch}
              className="w-72 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 flex items-center justify-between cursor-pointer hover:border-[#3B5DF7]/50 hover:bg-white transition"
            >
              <span className="text-xs text-slate-400">Search for a task...</span>
              <Search className="w-4 h-4 text-slate-400" />
            </div>

            <button
              onClick={handleNotificationsClick}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
            </button>

            <button
              onClick={() => onOpenNewTask(selectedDate)}
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-[#3B5DF7] hover:bg-[#2F4FE0] text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/25 active:scale-95 transition"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add New Task</span>
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Laptop Layout */}
        <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
          {/* Left Column: Calendar & Weekly Metrics */}
          <div className="lg:col-span-5 space-y-6">
            {/* Week Calendar Strip Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center">
                  <Calendar className="w-3.5 h-3.5 text-[#3B5DF7] mr-1.5" />
                  Select Schedule Day
                </span>
                <span className="text-xs font-semibold text-[#3B5DF7]">
                  {formatDisplayDate(selectedDate)}
                </span>
              </div>
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-1">
                <WeekStrip selectedDate={selectedDate} onSelectDate={onSelectDate} />
              </div>
            </div>

            {/* Weekly Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Task Complete Card */}
              <div
                onClick={onOpenWeeklyOverview}
                className="bg-[#EEF4FF] hover:bg-[#E5EEFF] active:scale-[0.98] transition-all cursor-pointer rounded-2xl p-5 border border-blue-100 shadow-sm relative group"
              >
                <div className="flex items-center space-x-2 text-[#3B5DF7]">
                  <div className="w-6 h-6 rounded-lg bg-[#3B5DF7]/15 flex items-center justify-center">
                    <CheckSquare className="w-4 h-4 text-[#3B5DF7]" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    Task Complete
                  </span>
                </div>

                <div className="mt-4 flex items-baseline space-x-2">
                  <span className="text-4xl font-black text-slate-900 tracking-tight">
                    {String(completedCount).padStart(2, '0')}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    This Week
                  </span>
                </div>
              </div>

              {/* Task Pending Card */}
              <div
                onClick={onOpenWeeklyOverview}
                className="bg-[#FFF1F2] hover:bg-[#FFE8EB] active:scale-[0.98] transition-all cursor-pointer rounded-2xl p-5 border border-rose-100 shadow-sm relative group"
              >
                <div className="flex items-center space-x-2 text-rose-500">
                  <div className="w-6 h-6 rounded-lg bg-rose-500/15 flex items-center justify-center">
                    <XSquare className="w-4 h-4 text-rose-500" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    Task Pending
                  </span>
                </div>

                <div className="mt-4 flex items-baseline space-x-2">
                  <span className="text-4xl font-black text-slate-900 tracking-tight">
                    {String(pendingCount).padStart(2, '0')}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    This Week
                  </span>
                </div>
              </div>
            </div>

            {/* Weekly Progress Section */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Weekly Progress
                  </h3>
                  <p className="text-xs text-slate-400">
                    Based on total scheduled tasks for this week
                  </p>
                </div>
                <span className="text-sm font-extrabold text-[#3B5DF7]">
                  {progressPercent}%
                </span>
              </div>

              <div className="w-full h-3.5 bg-[#E0E7FF] rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-[#1E3A8A] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={onOpenWeeklyOverview}
                  className="text-xs font-semibold text-[#3B5DF7] hover:underline flex items-center"
                >
                  Expand Weekly Overview & Breakdown →
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Tasks for Selected Day */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Tasks for {formatDisplayDate(selectedDate)}
                </h3>
                <span className="text-xs text-slate-400 font-medium">
                  {dayTasks.length} task{dayTasks.length === 1 ? '' : 's'} scheduled
                </span>
              </div>

              <button
                onClick={() => onOpenNewTask(selectedDate)}
                className="text-xs font-semibold text-[#3B5DF7] hover:underline flex items-center"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Task
              </button>
            </div>

            {/* Task List */}
            {dayTasks.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-16 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-sm font-semibold text-slate-600">No tasks for this date</p>
                <p className="text-xs text-slate-400 mt-1">Enjoy your free time or schedule a new task</p>
                <button
                  onClick={() => onOpenNewTask(selectedDate)}
                  className="mt-4 px-4 py-2 bg-[#3B5DF7] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-sm transition"
                >
                  + Add task for {formatDisplayDate(selectedDate)}
                </button>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1 flex-1">
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
      </div>
    );
  }

  // Phone Mockup Mode matching exact Figma layout
  return (
    <div className="flex flex-col h-full w-full bg-[#FAFAFC] relative select-none overflow-hidden min-h-0">
      {/* Mobile Status Bar */}
      <StatusBar dark={false} />

      {/* Top Header & Search Bar */}
      <div className="px-5 pt-1 pb-3 space-y-3 flex-shrink-0">
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
              onClick={handleNotificationsClick}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition relative"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
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
      <div className="bg-white border-y border-slate-100/80 flex-shrink-0">
        <WeekStrip selectedDate={selectedDate} onSelectDate={onSelectDate} />
      </div>

      {/* Scrollable Main Area - min-h-0 allows flex child to scroll properly */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-5 custom-scrollbar pb-28">
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
                + Add a task for this date
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
