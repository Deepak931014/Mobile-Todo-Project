import React, { useState, useEffect, useCallback } from 'react';
import MobileFrame from './components/MobileFrame';
import OnboardingScreen from './components/OnboardingScreen';
import HomeScreen from './components/HomeScreen';
import SearchScreen from './components/SearchScreen';
import TaskModal from './components/TaskModal';
import WeeklyOverviewModal from './components/WeeklyOverviewModal';
import { api } from './services/api';
import { formatDateKey } from './utils/dateUtils';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(() => {
    return localStorage.getItem('taskflow_onboarded') === 'true' ? 'home' : 'onboarding';
  });

  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => formatDateKey(new Date()));
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isWeeklyModalOpen, setIsWeeklyModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [modalDefaultDate, setModalDefaultDate] = useState('');
  const [loading, setLoading] = useState(true);

  // Load tasks and weekly metrics
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [allTasks, stats] = await Promise.all([
        api.getTasks(),
        api.getWeeklyStats(),
      ]);
      setTasks(allTasks);
      setWeeklyStats(stats);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Onboarding Completion
  const handleGetStarted = () => {
    localStorage.setItem('taskflow_onboarded', 'true');
    setCurrentScreen('home');
  };

  // Reset Onboarding (from gear icon)
  const handleResetOnboarding = () => {
    localStorage.removeItem('taskflow_onboarded');
    setCurrentScreen('onboarding');
  };

  // Toggle Task Completion (In Progress <-> Completed)
  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === 'Completed' ? 'In Progress' : 'Completed';
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, status: nextStatus } : t))
    );

    try {
      await api.updateTask(task._id, { status: nextStatus });
      // Refresh stats
      const stats = await api.getWeeklyStats();
      setWeeklyStats(stats);
    } catch (err) {
      console.error('Failed to update status:', err);
      // Rollback
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, status: task.status } : t))
      );
    }
  };

  // Open New Task Modal
  const handleOpenNewTask = (dateToUse) => {
    setTaskToEdit(null);
    setModalDefaultDate(dateToUse || selectedDate || formatDateKey(new Date()));
    setIsTaskModalOpen(true);
  };

  // Open Edit Task Modal
  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  // Save Task (Create or Update)
  const handleSaveTask = async (taskData) => {
    try {
      if (taskData._id) {
        // Update
        const updated = await api.updateTask(taskData._id, taskData);
        setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
      } else {
        // Create
        const created = await api.createTask(taskData);
        setTasks((prev) => [created, ...prev]);
      }
      setIsTaskModalOpen(false);
      setTaskToEdit(null);
      // Refresh stats
      const stats = await api.getWeeklyStats();
      setWeeklyStats(stats);
    } catch (err) {
      console.error('Failed to save task:', err);
      alert('Failed to save task. Please try again.');
    }
  };

  // Delete Task
  const handleDeleteTask = async (id) => {
    const originalTasks = [...tasks];
    // Optimistic removal
    setTasks((prev) => prev.filter((t) => t._id !== id));

    try {
      await api.deleteTask(id);
      const stats = await api.getWeeklyStats();
      setWeeklyStats(stats);
    } catch (err) {
      console.error('Failed to delete task:', err);
      setTasks(originalTasks);
    }
  };

  // Reset to initial demo mock tasks
  const handleResetData = () => {
    const initial = api.resetLocalDemo();
    setTasks(initial);
    loadData();
  };

  return (
    <MobileFrame onResetData={handleResetData}>
      {/* Onboarding Screen */}
      {currentScreen === 'onboarding' && (
        <OnboardingScreen onGetStarted={handleGetStarted} />
      )}

      {/* Home Screen */}
      {currentScreen === 'home' && (
        <HomeScreen
          tasks={tasks}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          weeklyStats={weeklyStats}
          onOpenSearch={() => setCurrentScreen('search')}
          onOpenNewTask={handleOpenNewTask}
          onOpenWeeklyOverview={() => setIsWeeklyModalOpen(true)}
          onToggleStatus={handleToggleStatus}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onResetOnboarding={handleResetOnboarding}
        />
      )}

      {/* Search Screen */}
      {currentScreen === 'search' && (
        <SearchScreen
          tasks={tasks}
          onBack={() => setCurrentScreen('home')}
          onToggleStatus={handleToggleStatus}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
      )}

      {/* Add / Edit Task Modal Bottom Sheet */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
        defaultDate={modalDefaultDate}
      />

      {/* Expandable Weekly Overview Modal */}
      <WeeklyOverviewModal
        isOpen={isWeeklyModalOpen}
        onClose={() => setIsWeeklyModalOpen(false)}
        allTasks={tasks}
        onToggleStatus={handleToggleStatus}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        onAddTask={handleOpenNewTask}
      />
    </MobileFrame>
  );
}
