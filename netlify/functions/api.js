import serverless from 'serverless-http';
import app from '../../server/server.js';
import { connectDB } from '../../server/config/db.js';
import { seedSampleTasks } from '../../server/controllers/taskController.js';

let initialized = false;

const init = async () => {
  if (!initialized) {
    try {
      await connectDB();
      await seedSampleTasks();
      initialized = true;
    } catch (err) {
      console.warn('Netlify function init warning:', err);
    }
  }
};

const serverlessHandler = serverless(app);

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await init();
  return await serverlessHandler(event, context);
};
