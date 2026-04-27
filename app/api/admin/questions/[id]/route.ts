// ראוט למענה על שאלות
import { NextRequest, NextResponse } from 'next/server';
import { Question } from '@/models/Question';
import connectDB from '@/lib/mongodb';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params; // חילוץ ה-id מתוך ה-Promise
    const body = await req.json();

    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      {
        answerText: body.answerText,
        status: body.status, // יכול להיות 'answered' או 'published'
        category: body.category,
        answeredAt: new Date()
      },
      { new: true }
    );

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    return NextResponse.json({ error: "עדכון השאלה נכשל" }, { status: 500 });
  }
}

// הפונקציה המתוקנת: מחיקת שאלה
export async function DELETE(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> } // שינוי ל-Promise
) {
  try {
    await connectDB();
    const { id } = await params; // חילוץ ה-id עם await
    
    await Question.findByIdAndDelete(id);
    
    return NextResponse.json({ success: true, message: "השאלה נמחקה בהצלחה" });
  } catch (error) {
    return NextResponse.json({ error: "שגיאה במחיקת השאלה" }, { status: 500 });
  }
}