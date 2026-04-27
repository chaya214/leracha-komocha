// מודל שו"ת
import mongoose, { Schema, model, models } from "mongoose";

const QuestionSchema = new Schema({
  // פרטי השואל (לא מוצג באתר, רק לניהול)
  senderName: { type: String, required: true },
  senderEmail: { type: String, required: true },
  
  // תוכן השאלה והתשובה
  subject: { type: String, required: true }, // נושא השאלה
  questionText: { type: String, required: true },
  answerText: { type: String, default: "" }, // הרב ימלא את זה בניהול
  
  // ניהול תצוגה
  category: { type: String, default: "כללי" },
  status: { 
    type: String, 
    enum: ["pending", "answered", "published"], 
    default: "pending" 
  }, // pending = חדש, answered = הרב ענה, published = מוצג באתר לכולם
  
  createdAt: { type: Date, default: Date.now },
  answeredAt: { type: Date },
});

export const Question = models.Question || model("Question", QuestionSchema);