// מודל ווידיאו
import mongoose, { Schema, model, models, Document } from "mongoose";

// הגדרת הממשק עבור TypeScript
export interface IVideo extends Document {
  title: string;
  description?: string;
  videoUrl: string;
  category: string;
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema = new Schema<IVideo>(
  {
    title: { 
      type: String, 
      required: true,
      trim: true
    },
    description: { 
      type: String,
      trim: true
    },
    videoUrl: { 
      type: String, 
      required: true,
      validate: {
        validator: function(url: string) {
          return url.includes('youtube') || url.includes('youtu.be');
        },
        message: 'כתובת הוידאו חייבת להיות קישור מיוטיוב'
      }
    },
    category: { 
      type: String,
      default: "כללי",
      trim: true
    },
    thumbnailUrl: { 
      type: String 
    },
  },
  { 
    // זה מחליף את הצורך ב-Middleware ידני ומנהל את updatedAt ו-createdAt לבד
    timestamps: true 
  }
);

export const Video = models.Video || model<IVideo>("Video", VideoSchema);