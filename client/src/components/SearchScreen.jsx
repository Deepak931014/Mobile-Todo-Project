import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, X, Check } from 'lucide-react';
import TaskCard from './TaskCard';
import StatusBar from './StatusBar';

export default function SearchScreen({
  tasks = [],
  onBack,
  onToggleStatus,
  onEditTask,
  onDeleteTask,
}) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus search input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Filter tasks based on query
  const filtered = query.trim()
    ? tasks.filter((t) => {
        const q = query.toLowerCase();
        return (
          (t.title && t.title.toLowerCase().includes(q)) ||
          (t.description && t.description.toLowerCase().includes(q))
        );
      })
    : tasks;

  return (
    <div className="flex flex-col h-full w-full bg-white select-none">
      {/* Status Bar */}
      <StatusBar dark={false} />

      {/* Search Header matching Figma Frame 9 */}
      <div className="px-5 pt-2 pb-4 border-b border-slate-100 flex items-center space-x-3">
        <button
          onClick={onBack}
          className="p-2 -ml-1 text-slate-700 hover:text-black hover:bg-slate-100 rounded-full transition"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Search Input Bar */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a task..."
            className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#3B5DF7] focus:bg-white transition"
          />
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
            {query ? (
              <button
                onClick={() => setQuery('')}
                className="text-slate-400 hover:text-slate-600 transition"
                aria-label="Clear query"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <Search className="w-4 h-4 text-slate-400 pointer-events-none" />
            )}
          </div>
        </div>
      </div>

      {/* Search Results Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 no-scrollbar">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400">
            {query.trim() ? `Search results for "${query}"` : 'All tasks'}
          </span>
          <span className="text-xs font-bold text-slate-700">
            {filtered.length} found
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">No matching tasks</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Try searching with different keywords like wireframe, meeting, homework...
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((t) => (
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
  );
}

