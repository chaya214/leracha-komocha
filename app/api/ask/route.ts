// ראוט לשאל את הרב
// נתיבAPI: /api/ask
import { NextRequest, NextResponse } from 'next/server';
import { Question } from '@/models/Question';
import connectDB from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    
    // יצירת שאלה חדשה בסטטוס "ממתין" (pending)
    const newQuestion = await Question.create({
      senderName: body.senderName,
      senderEmail: body.senderEmail,
      subject: body.subject,
      questionText: body.questionText,
      status: "pending"
    });

    return NextResponse.json({ success: true, message: "השאלה נשלחה בהצלחה וממתינה למענה הרב" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "שגיאה בשליחת השאלה" }, { status: 500 });
  }
}

// שליפת שאלות שפורסמו בלבד עבור הדף הציבורי
export async function GET() {
  try {
    await connectDB();
    const questions = await Question.find({ status: "published" }).sort({ createdAt: -1 });
    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json({ error: "שגיאה בשליפת השאלות" }, { status: 500 });
  }
}