import Task from '../models/Task.js';
import { getIsConnected } from '../config/db.js';

// Helper for date bounds
const computeWeekBounds = (dateStr) => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date');
  }
  const day = d.getDay();
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

// High-reliability in-memory fallback store
let memoryTasks = [];

const generateId = () => {
  return 'mem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
};

// Seed sample tasks matching the Figma UI mockup
export const seedSampleTasks = async () => {
  const today = new Date();
  const formatYYYYMMDD = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const day0 = formatYYYYMMDD(today);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const dayPrev = formatYYYYMMDD(yesterday);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayNext = formatYYYYMMDD(tomorrow);

  const initialItems = [
    {
      title: 'Finishing Wireframe',
      description: 'Complete high-fidelity mobile prototype and user flow diagrams',
      date: day0,
      startTime: '09:00 AM',
      endTime: '11:30 AM',
      priority: 'High',
      status: 'In Progress',
    },
    {
      title: 'Meeting with team',
      description: 'Discuss sprint deliverables, roadmap and UI review',
      date: day0,
      startTime: '02:00 PM',
      endTime: '03:00 PM',
      priority: 'Medium',
      status: 'In Progress',
    },
    {
      title: 'Buy a cat food',
      description: 'Get royal canin salmon dry food and treats from pet store',
      date: day0,
      startTime: '05:30 PM',
      endTime: '06:00 PM',
      priority: 'Low',
      status: 'Completed',
    },
    {
      title: 'Finishing daily commission',
      description: 'Finalize illustration vector exports and send invoice to client',
      date: day0,
      startTime: '07:00 PM',
      endTime: '08:30 PM',
      priority: 'Medium',
      status: 'Completed',
    },
    {
      title: 'Doing Homework',
      description: 'Read chapter 4 and solve exercises on full stack architecture',
      date: dayNext,
      startTime: '10:00 AM',
      endTime: '12:00 PM',
      priority: 'Medium',
      status: 'In Progress',
    },
    {
      title: 'Gym & Cardio session',
      description: 'Upper body workout and 20 mins HIIT interval training',
      date: dayPrev,
      startTime: '06:30 AM',
      endTime: '08:00 AM',
      priority: 'Low',
      status: 'Completed',
    },
    {
      title: 'Weekly Sprint Retrospective',
      description: 'Analyze blockers, celebrate wins and update Jira board',
      date: dayNext,
      startTime: '04:00 PM',
      endTime: '05:00 PM',
      priority: 'High',
      status: 'In Progress',
    },
  ];

  if (getIsConnected()) {
    try {
      const count = await Task.countDocuments();
      if (count === 0) {
        for (const item of initialItems) {
          const bounds = computeWeekBounds(item.date);
          await Task.create({ ...item, ...bounds });
        }
        console.log('[Seed] Populated MongoDB with sample tasks');
      }
    } catch (err) {
      console.warn('[Seed] MongoDB seed warning:', err.message);
    }
  }

  // Also initialize memory store
  if (memoryTasks.length === 0) {
    memoryTasks = initialItems.map((item) => {
      const bounds = computeWeekBounds(item.date);
      return {
        _id: generateId(),
        ...item,
        ...bounds,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });
  }
};

/**
 * @desc Get all tasks with optional filters (search, date, weekStart, status, priority)
 * @route GET /api/tasks
 */
export const getTasks = async (req, res) => {
  try {
    const { search, date, weekStart, status, priority } = req.query;

    if (getIsConnected()) {
      const query = {};

      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [{ title: regex }, { description: regex }];
      }

      if (date) {
        query.date = date;
      }

      if (weekStart) {
        query.weekStart = weekStart;
      }

      if (status) {
        query.status = status;
      }

      if (priority) {
        query.priority = priority;
      }

      const tasks = await Task.find(query).sort({ date: 1, startTime: 1, createdAt: -1 });
      return res.status(200).json({ success: true, count: tasks.length, data: tasks });
    }

    // In-memory fallback
    let filtered = [...memoryTasks];

    if (search && search.trim()) {
      const term = search.trim().toLowerCase();
      filtered = filtered.filter(
        (t) =>
          (t.title && t.title.toLowerCase().includes(term)) ||
          (t.description && t.description.toLowerCase().includes(term))
      );
    }

    if (date) {
      filtered = filtered.filter((t) => t.date === date);
    }

    if (weekStart) {
      filtered = filtered.filter((t) => t.weekStart === weekStart);
    }

    if (status) {
      filtered = filtered.filter((t) => t.status === status);
    }

    if (priority) {
      filtered = filtered.filter((t) => t.priority === priority);
    }

    // Sort by date, startTime
    filtered.sort((a, b) => (a.date || '').localeCompare(b.date || '') || (a.startTime || '').localeCompare(b.startTime || ''));

    return res.status(200).json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({ success: false, message: 'Server error while fetching tasks', error: error.message });
  }
};

/**
 * @desc Get single task by ID
 * @route GET /api/tasks/:id
 */
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
      return res.status(200).json({ success: true, data: task });
    }

    const task = memoryTasks.find((t) => t._id === id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    return res.status(200).json({ success: true, data: task });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * @desc Create new task
 * @route POST /api/tasks
 */
export const createTask = async (req, res) => {
  try {
    const { title, description, date, startTime, endTime, priority, status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Task title is required' });
    }

    if (!date) {
      return res.status(400).json({ success: false, message: 'Task date is required' });
    }

    const bounds = computeWeekBounds(date);

    const taskData = {
      title: title.trim(),
      description: description ? description.trim() : '',
      date,
      startTime: startTime || '09:00 AM',
      endTime: endTime || '10:00 AM',
      priority: priority || 'Medium',
      status: status || 'In Progress',
      weekStart: bounds.weekStart,
      weekEnd: bounds.weekEnd,
      weekNumber: bounds.weekNumber,
      year: bounds.year,
    };

    if (getIsConnected()) {
      const newTask = await Task.create(taskData);
      return res.status(201).json({ success: true, message: 'Task created successfully', data: newTask });
    }

    // In-memory
    const newTask = {
      _id: generateId(),
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryTasks.push(newTask);

    return res.status(201).json({ success: true, message: 'Task created successfully', data: newTask });
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ success: false, message: 'Server error while creating task', error: error.message });
  }
};

/**
 * @desc Update task
 * @route PUT /api/tasks/:id
 */
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // If date changed, recalculate week bounds
    if (updates.date) {
      const bounds = computeWeekBounds(updates.date);
      updates.weekStart = bounds.weekStart;
      updates.weekEnd = bounds.weekEnd;
      updates.weekNumber = bounds.weekNumber;
      updates.year = bounds.year;
    }

    if (getIsConnected()) {
      const updatedTask = await Task.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });

      if (!updatedTask) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }

      return res.status(200).json({ success: true, message: 'Task updated successfully', data: updatedTask });
    }

    // In-memory
    const index = memoryTasks.findIndex((t) => t._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    memoryTasks[index] = {
      ...memoryTasks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return res.status(200).json({ success: true, message: 'Task updated successfully', data: memoryTasks[index] });
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({ success: false, message: 'Server error while updating task', error: error.message });
  }
};

/**
 * @desc Delete task
 * @route DELETE /api/tasks/:id
 */
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const task = await Task.findByIdAndDelete(id);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
      return res.status(200).json({ success: true, message: 'Task deleted successfully' });
    }

    const index = memoryTasks.findIndex((t) => t._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    memoryTasks.splice(index, 1);
    return res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({ success: false, message: 'Server error while deleting task', error: error.message });
  }
};

/**
 * @desc Get weekly organized stats (open vs completed for each week, plus current week metrics)
 * @route GET /api/tasks/weekly-stats
 */
export const getWeeklyStats = async (req, res) => {
  try {
    let allTasks = [];

    if (getIsConnected()) {
      allTasks = await Task.find({}).sort({ date: 1 });
    } else {
      allTasks = [...memoryTasks].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    }

    // Group tasks by weekStart
    const weeksMap = new Map();

    allTasks.forEach((task) => {
      const weekStart = task.weekStart || computeWeekBounds(task.date).weekStart;
      const weekEnd = task.weekEnd || computeWeekBounds(task.date).weekEnd;
      const weekNumber = task.weekNumber || computeWeekBounds(task.date).weekNumber;
      const year = task.year || computeWeekBounds(task.date).year;

      if (!weeksMap.has(weekStart)) {
        weeksMap.set(weekStart, {
          weekStart,
          weekEnd,
          weekNumber,
          year,
          label: `Week ${weekNumber} (${weekStart} - ${weekEnd})`,
          openCount: 0,
          completedCount: 0,
          total: 0,
          tasks: [],
        });
      }

      const weekGroup = weeksMap.get(weekStart);
      weekGroup.total += 1;
      if (task.status === 'Completed') {
        weekGroup.completedCount += 1;
      } else {
        weekGroup.openCount += 1;
      }
      weekGroup.tasks.push(task);
    });

    // Determine current active week bounds
    const now = new Date();
    const currentWeekBounds = computeWeekBounds(
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    );

    // If current week doesn't have tasks yet, ensure an empty entry exists
    if (!weeksMap.has(currentWeekBounds.weekStart)) {
      weeksMap.set(currentWeekBounds.weekStart, {
        weekStart: currentWeekBounds.weekStart,
        weekEnd: currentWeekBounds.weekEnd,
        weekNumber: currentWeekBounds.weekNumber,
        year: currentWeekBounds.year,
        label: `Week ${currentWeekBounds.weekNumber} (${currentWeekBounds.weekStart} - ${currentWeekBounds.weekEnd})`,
        openCount: 0,
        completedCount: 0,
        total: 0,
        tasks: [],
      });
    }

    const weeks = Array.from(weeksMap.values()).map((w) => ({
      ...w,
      progressPercentage: w.total > 0 ? Math.round((w.completedCount / w.total) * 100) : 0,
    }));

    // Sort weeks descending or ascending
    weeks.sort((a, b) => a.weekStart.localeCompare(b.weekStart));

    const currentWeekData = weeksMap.get(currentWeekBounds.weekStart) || {
      weekStart: currentWeekBounds.weekStart,
      weekEnd: currentWeekBounds.weekEnd,
      weekNumber: currentWeekBounds.weekNumber,
      year: currentWeekBounds.year,
      openCount: 0,
      completedCount: 0,
      total: 0,
      progressPercentage: 0,
    };

    return res.status(200).json({
      success: true,
      currentWeek: {
        ...currentWeekData,
        progressPercentage:
          currentWeekData.total > 0 ? Math.round((currentWeekData.completedCount / currentWeekData.total) * 100) : 0,
      },
      weeks,
    });
  } catch (error) {
    console.error('Error compiling weekly stats:', error);
    return res.status(500).json({ success: false, message: 'Failed to compute weekly stats', error: error.message });
  }
};

