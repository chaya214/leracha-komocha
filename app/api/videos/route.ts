// app/api/videos/route.ts - ה-API לקבל וליצור וידאו
// app/api/videos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Video } from '@/models/Video';
import  connectDB  from '@/lib/mongodb';

export async function GET() {
  try {
    await connectDB();
    const videos = await Video.find({})
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    // בדוק אם זה קישור יוטיוב
    if (!body.videoUrl.includes('youtube') && !body.videoUrl.includes('youtu.be')) {
      return NextResponse.json(
        { error: 'URL must be a YouTube link' }, 
        { status: 400 }
      );
    }

    const video = new Video({
      ...body,
      createdAt: new Date()
    });

    await video.save();
    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { error: 'Failed to create video' }, 
      { status: 500 }
    );
  }
}