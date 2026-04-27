// app/videos/[id]/page.tsx - דף פרטי של שיעור וידאו
// הוספת שיעור
"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Save, Youtube, Type, Tag, AlignRight, PlayCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function EditVideoPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  // חילוץ ה-ID בצורה שמתאימה ל-Next.js 15
  const resolvedParams = use(params);
  const isNew = resolvedParams.id === 'new';
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    videoUrl: "",
    category: "כללי",
    description: ""
  });

  // טעינת נתונים קיימים אם אנחנו בעריכה
  useEffect(() => {
    if (!isNew) {
      fetch(`/api/videos/${resolvedParams.id}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) setFormData(data);
        });
    }
  }, [isNew, resolvedParams.id]);

  const getYouTubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // ולידציה בסיסית לפני השליחה
    if (!formData.videoUrl.includes('youtube') && !formData.videoUrl.includes('youtu.be')) {
        alert("כתובת הוידאו חייבת להיות קישור מיוטיוב");
        setLoading(false);
        return;
    }

    const url = isNew ? "/api/videos" : `/api/videos/${resolvedParams.id}`;
    const method = isNew ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/videos");
        router.refresh();
      } else {
        const errorData = await res.json();
        alert(`שגיאה: ${errorData.error || "לא ניתן לשמור"}`);
      }
    } catch (err) {
      alert("שגיאה בתקשורת עם השרת");
    } finally {
      setLoading(false);
    }
  };

  const videoId = getYouTubeID(formData.videoUrl);

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-32 pb-20 px-6" dir="rtl">
      <div className="container mx-auto max-w-4xl">
        
        <Link href="/admin/videos" className="flex items-center gap-2 text-primary/60 hover:text-primary font-bold mb-8 transition-colors group">
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          חזרה לניהול שיעורים
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl font-black text-primary mb-2">
            {isNew ? "הוספת שיעור חדש" : "עריכת שיעור"}
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-secondary/10 space-y-6">
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-primary font-bold text-sm mr-2"><Type size={16} className="text-secondary" /> כותרת</label>
                <input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-6 py-4 bg-muted/20 border border-transparent rounded-2xl focus:border-secondary focus:bg-white outline-none transition-all text-lg" />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-primary font-bold text-sm mr-2"><Youtube size={16} className="text-secondary" /> קישור יוטיוב</label>
                <input required type="url" value={formData.videoUrl} onChange={(e) => setFormData({...formData, videoUrl: e.target.value})} className="w-full px-6 py-4 bg-muted/20 border border-transparent rounded-2xl focus:border-secondary focus:bg-white outline-none transition-all text-lg" />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-primary font-bold text-sm mr-2"><Tag size={16} className="text-secondary" /> קטגוריה</label>
                <input required type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-6 py-4 bg-muted/20 border border-transparent rounded-2xl focus:border-secondary focus:bg-white outline-none transition-all text-lg" />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-primary font-bold text-sm mr-2"><AlignRight size={16} className="text-secondary" /> תיאור</label>
                <textarea rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-6 py-4 bg-muted/20 border border-transparent rounded-2xl focus:border-secondary focus:bg-white outline-none transition-all text-lg resize-none" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-primary text-white py-5 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 hover:bg-primary/95 transition-all shadow-xl disabled:opacity-50">
              {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Save size={22} /> שמור שיעור</>}
            </button>
          </form>

          <div className="space-y-6">
            <div className="sticky top-32">
              <h3 className="text-lg font-black text-primary mb-4 flex items-center gap-2"><PlayCircle size={20} className="text-secondary" /> תצוגה מקדימה</h3>
              <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-secondary/10">
                <div className="aspect-video bg-slate-100 flex items-center justify-center relative">
                  {videoId ? (
                    <img src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <div className="text-center p-6 text-slate-300"><Youtube size={48} className="mx-auto mb-2" /><p className="text-xs">הזן לינק תקין</p></div>
                  )}
                </div>
                <div className="p-6">
                  <div className="text-xs font-bold text-secondary mb-1">{formData.category}</div>
                  <h4 className="text-xl font-black text-primary line-clamp-2">{formData.title || "כותרת השיעור"}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}