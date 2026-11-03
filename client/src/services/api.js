/**
 * API Service for Task Management
 * Seamlessly interfaces with Node/Express REST API with resilient offline fallback
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api/tasks';
const STORAGE_KEY = 'taskflow_local_tasks_v1';

// Initial seed tasks matching Figma UI
const getSeedTasks = () => {
  const today = new Date();
  const formatYYYYMMDD = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const day0 = formatYYYYMMDD(today);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayNext = formatYYYYMMDD(tomorrow);

  return [
    {
      _id: 'seed-1',
      title: 'Finishing Wireframe',
      description: 'Design mobile high-fidelity UI components in Figma',
      date: day0,
      startTime: '09:00 AM',
      endTime: '11:30 AM',
      priority: 'High',
      status: 'In Progress',
    },
    {
      _id: 'seed-2',
      title: 'Meeting with team',
      description: 'Discuss sprint deliverables and project roadmap',
      date: day0,
      startTime: '02:00 PM',
      endTime: '03:00 PM',
      priority: 'Medium',
      status: 'In Progress',
    },
    {
      _id: 'seed-3',
      title: 'Buy a cat food',
      description: 'Get royal canin salmon dry food and treats',
      date: day0,
      startTime: '05:30 PM',
      endTime: '06:00 PM',
      priority: 'Low',
      status: 'Completed',
    },
    {
      _id: 'seed-4',
      title: 'Finishing daily commission',
      description: 'Export illustrations and email deliverables to client',
      date: day0,
      startTime: '07:00 PM',
      endTime: '08:30 PM',
      priority: 'Medium',
      status: 'Completed',
    },
    {
      _id: 'seed-5',
      title: 'Doing Homework',
      description: 'Read system architecture documentation and prepare report',
      date: dayNext,
      startTime: '10:00 AM',
      endTime: '12:00 PM',
      priority: 'Medium',
      status: 'In Progress',
    },
  ];
};

const getLocalTasks = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getSeedTasks();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    return getSeedTasks();
  }
};

const saveLocalTasks = (tasks) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
};

export const api = {
  // Fetch all tasks with optional params: { search, date, status, priority, weekStart }
  async getTasks(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        query.append(k, v);
      }
    });

    try {
      const res = await fetch(`${API_BASE}?${query.toString()}`, {
        headers: { 'Accept': 'application/json' },
      });
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      console.warn('[API fallback to local storage]:', err.message);
      let list = getLocalTasks();
      if (params.search) {
        const s = params.search.toLowerCase();
        list = list.filter(
          (t) => (t.title && t.title.toLowerCase().includes(s)) || (t.description && t.description.toLowerCase().includes(s))
        );
      }
      if (params.date) {
        list = list.filter((t) => t.date === params.date);
      }
      if (params.status) {
        list = list.filter((t) => t.status === params.status);
      }
      if (params.priority) {
        list = list.filter((t) => t.priority === params.priority);
      }
      return list;
    }
  },

  // Fetch weekly statistics
  async getWeeklyStats() {
    try {
      const res = await fetch(`${API_BASE}/weekly-stats`);
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.warn('[API fallback weekly stats]:', err.message);
      const list = getLocalTasks();
      const openCount = list.filter((t) => t.status !== 'Completed').length;
      const completedCount = list.filter((t) => t.status === 'Completed').length;
      const total = list.length;
      const progressPercentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

      return {
        success: true,
        currentWeek: {
          openCount,
          completedCount,
          total,
          progressPercentage,
        },
        weeks: [],
      };
    }
  },

  // Create new task
  async createTask(taskData) {
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('[API fallback createTask]:', err.message);
      const list = getLocalTasks();
      const newTask = {
        _id: 'local_' + Date.now(),
        ...taskData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      list.push(newTask);
      saveLocalTasks(list);
      return newTask;
    }
  },

  // Update existing task
  async updateTask(id, updates) {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('[API fallback updateTask]:', err.message);
      const list = getLocalTasks();
      const idx = list.findIndex((t) => t._id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
        saveLocalTasks(list);
        return list[idx];
      }
      throw new Error('Task not found in local store');
    }
  },

  // Delete task
  async deleteTask(id) {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      return true;
    } catch (err) {
      console.warn('[API fallback deleteTask]:', err.message);
      const list = getLocalTasks();
      const filtered = list.filter((t) => t._id !== id);
      saveLocalTasks(filtered);
      return true;
    }
  },

  // Reset to initial demo tasks
  resetLocalDemo() {
    const initial = getSeedTasks();
    saveLocalTasks(initial);
    return initial;
  },
};

