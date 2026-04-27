// כניסה לניהול
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("admin"); // ברירת המחדל שיצרנו ב-Setup
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // הצלחנו! ה-Cookie כבר הוגדר ע"י השרת (HttpOnly)
        // אבל בשביל ה-Middleware הפשוט שלנו, נוודא שיש סימון מקומי
        router.push("/admin");
        router.refresh(); // רענון כדי שה-Middleware יקלוט את השינוי
      } else {
        setError(data.error || "פרטי התחברות שגויים");
      }
    } catch (err) {
      setError("שגיאת תקשורת עם השרת");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#4a0404] flex items-center justify-center p-6 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-md w-full border border-gold/20">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-amber-100">
          <Lock className="text-amber-600" size={36} />
        </div>
        
        <h1 className="text-3xl font-black text-slate-800 mb-2 text-center">כניסת מנהל</h1>
        <p className="text-slate-500 mb-8 text-center font-medium">שלום הרב, אנא הזן פרטים</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1 mr-2">שם משתמש</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              placeholder="admin"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1 mr-2">סיסמה</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 transition-all text-left"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold text-center border border-red-100">
              {error}
            </div>
          )}

          <button 
            disabled={isLoading}
            className="w-full bg-[#4a0404] text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-[#630606] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "התחברות למערכת"}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-400">
          מערכת ניהול מאובטחת - לרעך כמוך © 2026
        </div>
      </div>
    </div>
  );
}