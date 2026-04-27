// הגדרת חיבור למונגו
import mongoose from "mongoose";

// השתמשנו ב-let כדי לאפשר גמישות בבדיקה
const MONGODB_URI = process.env.MONGODB_URI;

// אם השגיאה עדיין מופיעה, ננסה להבין אם זה בגלל ה-Environment
if (!MONGODB_URI) {
  console.error("CRITICAL: MONGODB_URI is not defined in environment variables!");
}

/** * שימוש ב-global כדי לשמור על החיבור ב-Development
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // בדיקה נוספת רגע לפני החיבור
    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI missing during connection attempt");
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log("✅ Successfully connected to MongoDB");
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("❌ MongoDB connection error:", e);
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;