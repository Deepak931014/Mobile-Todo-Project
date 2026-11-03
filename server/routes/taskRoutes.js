import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getWeeklyStats,
  seedSampleTasks,
} from '../controllers/taskController.js';

const router = express.Router();

// Weekly stats calculation
router.get('/weekly-stats', getWeeklyStats);

// Seed route to quickly reset / load demo data
router.post('/seed', async (req, res) => {
  try {
    await seedSampleTasks();
    res.status(200).json({ success: true, message: 'Database seeded successfully with demo tasks' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Seed failed', error: error.message });
  }
});

// CRUD routes
router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

export default router;
