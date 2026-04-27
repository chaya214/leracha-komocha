// סיסמה לאדמין
"use client";
import { useState } from "react";

export default function AdminSettings() {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const updatePassword = async () => {
    const res = await fetch('/api/admin/update-password', {
      method: 'POST',
      body: JSON.stringify({ newPassword }),
      headers: { 'Content-Type': 'application/json' }
    });
    if (res.ok) setMessage("הסיסמה עודכנה בהצלחה!");
  };

  return (
    <div className="pt-32 px-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-primary">הגדרות אבטחה</h1>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-muted">
        <label className="block mb-2 font-bold">סיסמה חדשה</label>
        <input 
          type="password" 
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-3 border rounded-xl mb-4 outline-none focus:ring-2 focus:ring-secondary"
        />
        <button 
          onClick={updatePassword}
          className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-all"
        >
          עדכן פרטי גישה
        </button>
        {message && <p className="mt-4 text-green-600 font-bold text-center">{message}</p>}
      </div>
    </div>
  );
}