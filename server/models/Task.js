import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    date: {
      type: String,
      required: [true, 'Task date is required'], // Format: YYYY-MM-DD
    },
    startTime: {
      type: String,
      default: '09:00 AM',
    },
    endTime: {
      type: String,
      default: '10:00 AM',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['In Progress', 'Completed'],
      default: 'In Progress',
    },
    weekStart: {
      type: String, // Monday YYYY-MM-DD
    },
    weekEnd: {
      type: String, // Sunday YYYY-MM-DD
    },
    weekNumber: {
      type: Number,
    },
    year: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Helper static to calculate week bounds for any date string YYYY-MM-DD
taskSchema.statics.calculateWeekBounds = function (dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date string');
  }

  // Weeks start on Monday (1) and end on Sunday (0 or 7)
  const day = d.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
  const diffToMonday = day === 0 ? -6 : 1 - day;
  
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const formatDate = (dateObj) => {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dayOfMonth = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${dayOfMonth}`;
  };

  // Calculate ISO week number
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
    weekStart: formatDate(monday),
    weekEnd: formatDate(sunday),
    weekNumber,
    year: monday.getFullYear(),
  };
};

// Pre-save hook to automatically compute week bounds if not set
taskSchema.pre('save', function (next) {
  if (this.date) {
    const bounds = taskSchema.statics.calculateWeekBounds(this.date);
    this.weekStart = bounds.weekStart;
    this.weekEnd = bounds.weekEnd;
    this.weekNumber = bounds.weekNumber;
    this.year = bounds.year;
  }
  next();
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
