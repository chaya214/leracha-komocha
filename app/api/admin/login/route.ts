// ראוט לאדמין (משתמש)
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Admin } from "@/models/Admin";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    await connectToDatabase();

    const admin = await Admin.findOne({ username });
    if (!admin) return NextResponse.json({ error: "פרטים שגויים" }, { status: 401 });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return NextResponse.json({ error: "פרטים שגויים" }, { status: 401 });

    // יצירת טוקן
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ username: admin.username })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(secret);

    const response = NextResponse.json({ message: "מחובר" });
    response.cookies.set('admin_token', token, {
      httpOnly: true, // הגנה מפני XSS
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // יום אחד
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "שגיאה בשרת" }, { status: 500 });
  }
}