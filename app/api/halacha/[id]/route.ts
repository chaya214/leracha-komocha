// ראוט לטיפול בפרטי הלכה יומית לפי מזהה
// app/api/halacha/[id]/route.ts
// app/api/halacha/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { DailyHalacha } from '@/models/DailyHalacha';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // מוגדר כ-Promise ב-Next.js 15
) {
  try {
    await connectDB();
    const { id } = await params; // חילוץ ה-ID בצורה אסינכרונית

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const halacha = await DailyHalacha.findById(id).lean();
    if (!halacha) {
      return NextResponse.json({ error: 'Halacha not found' }, { status: 404 });
    }

    return NextResponse.json(halacha);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    const halacha = await DailyHalacha.findByIdAndUpdate(
      id,
      { ...body, dateFor: body.dateFor ? new Date(body.dateFor) : undefined },
      { new: true, runValidators: true }
    ).lean();

    if (!halacha) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(halacha);
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const halacha = await DailyHalacha.findByIdAndDelete(id);
    if (!halacha) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}