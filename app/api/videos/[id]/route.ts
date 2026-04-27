// ראוט להוספה, עדכון ומחיקה של סרטונים
// app/api/videos/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Video } from '@/models/Video';
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

    const video = await Video.findById(id).lean();
    if (!video) return NextResponse.json({ error: 'Video not found' }, { status: 404 });

    return NextResponse.json(video);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 });
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

    if (body.videoUrl && !body.videoUrl.includes('youtube') && !body.videoUrl.includes('youtu.be')) {
      return NextResponse.json({ error: 'URL must be a YouTube link' }, { status: 400 });
    }

    // timestamps: true במודל יעדכן את updatedAt אוטומטית
    const video = await Video.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    ).lean();

    if (!video) return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    return NextResponse.json(video);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update video' }, { status: 500 });
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

    const video = await Video.findByIdAndDelete(id);
    if (!video) return NextResponse.json({ error: 'Video not found' }, { status: 404 });

    return NextResponse.json({ success: true, message: 'Video deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
  }
}