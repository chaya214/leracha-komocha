// app/api/halacha/route.ts - ה-API לקבל וליצור הלכות
// app/api/halacha/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { DailyHalacha } from '@/models/DailyHalacha';
import  connectDB  from '@/lib/mongodb';

export async function GET() {
  try {
    await connectDB();
    const halachas = await DailyHalacha.find({})
      .sort({ dateFor: -1 })
      .lean();
    
    return NextResponse.json(halachas);
  } catch (error) {
    console.error('Error fetching halachas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch halachas' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    // בדוק אם תאריך כזה כבר קיים
    const dateOnly = new Date(body.dateFor);
    dateOnly.setHours(0, 0, 0, 0);

    const existing = await DailyHalacha.findOne({ 
      dateFor: {
        $gte: dateOnly,
        $lt: new Date(dateOnly.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'יש כבר הלכה לתאריך זה' }, 
        { status: 400 }
      );
    }

    const halacha = new DailyHalacha({
      ...body,
      dateFor: new Date(body.dateFor)
    });

    await halacha.save();
    return NextResponse.json(halacha, { status: 201 });
  } catch (error) {
    console.error('Error creating halacha:', error);
    return NextResponse.json(
      { error: 'Failed to create halacha' }, 
      { status: 500 }
    );
  }
}