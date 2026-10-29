'use server';

import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function checkDatabaseConnection(): Promise<{
  connected: boolean;
  message: string;
}> {
  try {
    // Clear failed cached connection if any
    if (mongoose.connection.readyState !== 1) {
      if (global.mongooseCache) {
        global.mongooseCache.conn = null;
        global.mongooseCache.promise = null;
      }
    }
    await dbConnect();
    return {
      connected: true,
      message: 'Successfully connected to MongoDB Atlas!',
    };
  } catch (err: unknown) {
    const rawMessage = err instanceof Error ? err.message : String(err);
    return {
      connected: false,
      message: rawMessage,
    };
  }
}
