/**
 * Date and Week utilities for To-Do Mobile App
 * Adheres strictly to the requirement: Weeks start on Monday and end on Sunday.
 */

// Format Date object to YYYY-MM-DD
export const formatDateKey = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Parse YYYY-MM-DD safely without timezone shifts
export const parseDateKey = (dateStr) => {
  if (!dateStr) return new Date();
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

// Calculate Monday to Sunday bounds for any given date
export const getWeekBounds = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
  // Diff to reach Monday (if Sunday (0), go back 6 days)
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  // ISO Week number
  const target = new Date(d.valueOf());
  const dayNr = (d.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  const weekNumber = 1 + Math.ceil((firstThursday - target) / 604800000);

  return {
    monday,
    sunday,
    weekStart: formatDateKey(monday),
    weekEnd: formatDateKey(sunday),
    weekNumber,
    year: monday.getFullYear(),
  };
};

// Generate 7-day array for a given week (Monday to Sunday)
export const getDaysOfWeek = (date = new Date()) => {
  const { monday } = getWeekBounds(date);
  const days = [];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  for (let i = 0; i < 7; i++) {
    const current = new Date(monday);
    current.setDate(monday.getDate() + i);
    days.push({
      dateObj: current,
      dateKey: formatDateKey(current),
      dayName: dayNames[i],
      dayNumber: String(current.getDate()).padStart(2, '0'),
      isToday: formatDateKey(current) === formatDateKey(new Date()),
    });
  }
  return days;
};

// Format human friendly date like "Friday 14, January" as shown in Figma
export const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '';
  const d = parseDateKey(dateStr);
  const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
  const day = d.getDate();
  const month = d.toLocaleDateString('en-US', { month: 'long' });
  return `${weekday} ${day}, ${month}`;
};

// Format concise week label e.g. "Nov 02 - Nov 08"
export const formatWeekLabel = (weekStart, weekEnd) => {
  const startD = parseDateKey(weekStart);
  const endD = parseDateKey(weekEnd);
  const startFmt = startD.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endFmt = endD.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${startFmt} - ${endFmt}`;
};

