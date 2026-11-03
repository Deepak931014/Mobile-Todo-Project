import React from 'react';
import { formatDateKey, parseDateKey, getWeekBounds } from '../utils/dateUtils';

export default function WeekStrip({ selectedDate, onSelectDate }) {
  // Compute the 7-8 day strip around the selected or current date
  const selDate = parseDateKey(selectedDate);
  const { monday } = getWeekBounds(selDate);

  // Generate 7 days starting Monday (matching assignment spec: Weeks start Monday, end Sunday)
  // Also can support 8 days if needed, but 7 days Mon-Sun is standard.
  const days = [];
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  for (let i = 0; i < 7; i++) {
    const cur = new Date(monday);
    cur.setDate(monday.getDate() + i);
    const dateKey = formatDateKey(cur);
    days.push({
      dateKey,
      dayLabel: dayLabels[i],
      dayNumber: String(cur.getDate()).padStart(2, '0'),
      isCurrentDay: dateKey === formatDateKey(new Date()),
      isSelected: dateKey === selectedDate,
    });
  }

  return (
    <div className="w-full px-5 py-2">
      <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-1">
        {days.map((item) => {
          const isSelected = item.isSelected;
          return (
            <button
              key={item.dateKey}
              onClick={() => onSelectDate(item.dateKey)}
              className={`flex-1 min-w-[42px] max-w-[48px] py-2 px-1 rounded-xl flex flex-col items-center justify-center transition-all duration-200 select-none ${
                isSelected
                  ? 'bg-[#3B5DF7] text-white shadow-md shadow-blue-500/30 scale-105'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className={`text-[11px] font-medium tracking-tight ${isSelected ? 'text-white/90' : 'text-slate-400'}`}>
                {item.dayLabel}
              </span>
              <span className={`text-sm font-bold mt-0.5 ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                {item.dayNumber}
              </span>
              {isSelected ? (
                <span className="w-1.5 h-1.5 bg-white rounded-full mt-1"></span>
              ) : (
                <span className="w-1.5 h-1.5 bg-transparent mt-1"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
