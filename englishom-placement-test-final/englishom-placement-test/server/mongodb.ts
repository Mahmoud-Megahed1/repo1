import mongoose from 'mongoose';

/**
 * MongoDB Connection Module
 * 
 * يتعامل مع الاتصال بـ MongoDB والتحقق من حالة الاتصال
 * يستخدم Mongoose كـ ODM (Object Document Mapper)
 */

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/englishom-placement-test';

let isConnected = false;

/**
 * الاتصال بـ MongoDB
 * @returns {Promise<typeof mongoose.connection>}
 */
export async function connectToDatabase() {
  if (isConnected) {
    console.log('[MongoDB] ✅ Already connected');
    return mongoose.connection;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      retryWrites: true,
      w: 'majority',
    });
    
    isConnected = true;
    console.log('[MongoDB] ✅ Successfully connected to MongoDB');
    return mongoose.connection;
  } catch (error) {
    console.error('[MongoDB] ❌ Connection failed:', error);
    isConnected = false;
    throw error;
  }
}

/**
 * الحصول على اتصال MongoDB الحالي
 * @returns {typeof mongoose.connection}
 */
export function getConnection() {
  return mongoose.connection;
}

/**
 * قطع الاتصال بـ MongoDB
 */
export async function disconnectDatabase() {
  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('[MongoDB] ✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('[MongoDB] ❌ Disconnection failed:', error);
    throw error;
  }
}

/**
 * التحقق من حالة الاتصال
 * @returns {boolean}
 */
export function isMongoConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}

export default mongoose;
