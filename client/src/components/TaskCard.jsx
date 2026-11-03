import React from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2, Edit3, Clock } from 'lucide-react';

export default function TaskCard({ task, onToggleStatus, onEdit, onDelete }) {
  const isCompleted = task.status === 'Completed';

  // Priority color accents
  const priorityBadge = {
    High: 'bg-rose-50 text-rose-600 border border-rose-200',
    Medium: 'bg-amber-50 text-amber-600 border border-amber-200',
    Low: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  }[task.priority] || 'bg-slate-50 text-slate-500 border border-slate-200';

  return (
    <div className="relative overflow-hidden rounded-2xl mb-2.5 group">
      {/* Red Delete Background revealed on swipe left */}
      <div className="absolute inset-0 bg-rose-500 flex items-center justify-end px-5 rounded-2xl">
        <button
          onClick={() => onDelete(task._id)}
          className="flex items-center space-x-1 text-white font-medium text-xs px-2 py-1 bg-rose-600 rounded-lg hover:bg-rose-700 active:scale-95 transition"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </button>
      </div>

      {/* Swipeable Foreground Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -75, right: 0 }}
        dragElastic={0.1}
        className="relative bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center justify-between transition-colors hover:border-slate-200"
      >
        {/* Left: Custom Checkbox and Task Details */}
        <div className="flex items-center space-x-3.5 flex-1 min-w-0 pr-2">
          {/* Checkbox */}
          <button
            onClick={() => onToggleStatus(task)}
            className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
              isCompleted
                ? 'bg-[#3B5DF7] text-white shadow-sm shadow-blue-500/30'
                : 'border-2 border-slate-300 hover:border-[#3B5DF7]'
            }`}
            aria-label={isCompleted ? 'Mark as pending' : 'Mark as completed'}
          >
            {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>

          {/* Title and meta */}
          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onEdit(task)}>
            <p
              className={`text-[14px] font-medium leading-snug truncate transition-all duration-200 ${
                isCompleted ? 'line-through text-slate-400 font-normal' : 'text-slate-800'
              }`}
            >
              {task.title}
            </p>

            <div className="flex items-center space-x-2 mt-1">
              {task.startTime && (
                <span className="flex items-center text-[11px] text-slate-400 font-normal">
                  <Clock className="w-3 h-3 mr-1 text-slate-300" />
                  {task.startTime}
                  {task.endTime ? ` - ${task.endTime}` : ''}
                </span>
              )}
              {task.priority && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${priorityBadge}`}>
                  {task.priority}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Actions: Delete & Edit */}
        <div className="flex items-center space-x-2.5 text-slate-400 flex-shrink-0">
          <button
            onClick={() => onDelete(task._id)}
            className="p-1 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition"
            title="Delete Task"
            aria-label="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(task)}
            className="p-1 hover:text-[#3B5DF7] hover:bg-blue-50 rounded-lg transition"
            title="Edit Task"
            aria-label="Edit Task"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

