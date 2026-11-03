import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todo_app';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`[MongoDB] Warning: Could not connect to MongoDB (${error.message}).`);
    console.warn(`[MongoDB] Operating in high-resilience in-memory fallback mode so all APIs remain fully functional.`);
    return false;
  }
};

export const getIsConnected = () => isConnected;

