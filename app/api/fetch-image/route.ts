//לתמונות 
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return NextResponse.json({ error: 'חסרה כתובת תמונה' }, { status: 400 });
  }

  try {
    const imgResponse = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    const contentType = imgResponse.headers['content-type'] || 'image/jpeg';
    const base64Data = Buffer.from(imgResponse.data).toString('base64');
    const base64Source = `data:${contentType};base64,${base64Data}`;

    return NextResponse.json({ base64: base64Source });
  } catch (error) {
    return NextResponse.json({ error: 'שגיאה בהורדת התמונה' }, { status: 500 });
  }
}