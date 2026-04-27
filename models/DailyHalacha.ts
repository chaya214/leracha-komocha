// מודל הלכה יומית
// models/DailyHalacha.ts
import mongoose, { Schema, model, models, Document } from "mongoose";

// 1. הגדרת ממשק (Interface) כדי ש-TypeScript יכיר את השדות של ההלכה
export interface IDailyHalacha extends Document {
  title: string;
  content: string;
  source?: string;
  dateFor: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DailyHalachaSchema = new Schema<IDailyHalacha>(
  {
    title: { 
      type: String, 
      required: true,
      trim: true 
    },
    content: { 
      type: String, 
      required: true 
    },
    source: { 
      type: String, 
      trim: true 
    },
    dateFor: { 
      type: Date, 
      required: true,
      unique: true,
      index: true 
    },
  },
  { 
    // 2. ניהול אוטומטי של createdAt ו-updatedAt ללא צורך ב-Middleware ידני
    timestamps: true 
  }
);

// 3. יצירת המודל (מוודא שלא ייווצר כפל מודלים ב-Hot Reload של Next.js)
export const DailyHalacha = models.DailyHalacha || model<IDailyHalacha>("DailyHalacha", DailyHalachaSchema);