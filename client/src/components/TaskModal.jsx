import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar, AlertCircle } from 'lucide-react';
import { formatDateKey, formatDisplayDate } from '../utils/dateUtils';

export default function TaskModal({ isOpen, onClose, onSave, taskToEdit = null, defaultDate = '' }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('10:00 AM');
  const [priority, setPriority] = useState('Medium');
  const [error, setError] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setDate(taskToEdit.date || defaultDate || formatDateKey(new Date()));
      setStartTime(taskToEdit.startTime || '09:00 AM');
      setEndTime(taskToEdit.endTime || '10:00 AM');
      setPriority(taskToEdit.priority || 'Medium');
    } else {
      setTitle('');
      setDescription('');
      setDate(defaultDate || formatDateKey(new Date()));
      setStartTime('09:00 AM');
      setEndTime('10:00 AM');
      setPriority('Medium');
    }
    setError('');
  }, [taskToEdit, defaultDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    if (!date) {
      setError('Date is required');
      return;
    }

    onSave({
      ...(taskToEdit ? { _id: taskToEdit._id } : {}),
      title: title.trim(),
      description: description.trim(),
      date,
      startTime,
      endTime,
      priority,
      status: taskToEdit ? taskToEdit.status : 'In Progress',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-white rounded-t-[32px] p-6 shadow-2xl max-h-[92vh] overflow-y-auto no-scrollbar animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">
            {taskToEdit ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 flex items-center space-x-2 text-rose-600 bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Task Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Task title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Doing Homework"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#3B5DF7] focus:bg-white transition"
            />
          </div>

          {/* Set Time (Start & Ends) */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Set Time <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Clock className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="Start (09:00 AM)"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#3B5DF7] focus:bg-white transition"
                />
              </div>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Clock className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  placeholder="Ends (10:00 AM)"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#3B5DF7] focus:bg-white transition"
                />
              </div>
            </div>
          </div>

          {/* Set Date */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-600">
                Set Date <span className="text-rose-500">*</span>
              </label>
              {date && (
                <span className="text-[11px] font-medium text-[#3B5DF7]">
                  {formatDisplayDate(date)}
                </span>
              )}
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-4 h-4" />
              </span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#3B5DF7] focus:bg-white transition"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Low', 'Medium', 'High'].map((p) => {
                const isActive = priority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                      isActive
                        ? p === 'High'
                          ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                          : p === 'Medium'
                          ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                          : 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add Description"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#3B5DF7] focus:bg-white transition resize-none"
            ></textarea>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-[#3B5DF7] hover:bg-[#2F4FE0] active:scale-[0.98] transition-all text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/25"
            >
              {taskToEdit ? 'Save Changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
