// ראוט לשאיבה
import { NextResponse } from 'next/server';
import { Question } from '@/models/Question';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    await connectDB();
    // שליפת כל השאלות שטרם נענו או פורסמו
    const questions = await Question.find({}).sort({ createdAt: -1 });
    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json({ error: "שגיאה בשליפת השאלות" }, { status: 500 });
  }
}