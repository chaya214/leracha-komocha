import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Admin } from "@/models/Admin";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectToDatabase();

    // בדיקה אם כבר קיים מנהל כדי לא ליצור כפילויות
    const adminExists = await Admin.findOne({ username: "admin" });
    if (adminExists) {
      return NextResponse.json({ message: "המנהל כבר קיים במערכת" }, { status: 400 });
    }

    // הצפנת הסיסמה (חשוב מאוד!)
    const hashedPassword = await bcrypt.hash("055055", 10);

    const newAdmin = await Admin.create({
      username: "אליעזר",
      password: hashedPassword,
    });

    return NextResponse.json({ 
      message: "מנהל נוצר בהצלחה!",
      username: newAdmin.username 
    });
  } catch (error) {
    return NextResponse.json({ error: "שגיאה ביצירת מנהל" }, { status: 500 });
  }
}