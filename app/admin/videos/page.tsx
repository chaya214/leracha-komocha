// app/admin/videos/page.tsx - דף ניהול שיעורי וידיאו
// app/admin/videos/page.tsx
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  PlusCircle, 
  Trash2, 
  Video as VideoIcon, 
  ExternalLink, 
  Tag,
  Search,
  LayoutGrid
} from "lucide-react";
import Link from "next/link";

export default function AdminVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/videos');
      const data = await res.json();
      setVideos(data);
    } catch (err) {
      console.error("Error fetching videos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("האם למחוק את השיעור לצמיתות?")) return;
    try {
      const res = await fetch(`/api/videos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setVideos(videos.filter((v: any) => v._id !== id));
      }
    } catch (err) {
      alert("שגיאה במחיקה");
    }
  };

  // פונקציית עזר לחילוץ ID של יוטיוב לתצוגה מקדימה
  const getYouTubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const filteredVideos = videos.filter((v: any) => 
    v.title.includes(searchTerm) || (v.category && v.category.includes(searchTerm))
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-32 pb-20 px-6" dir="rtl">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <LayoutGrid className="text-secondary" size={24} />
              <span className="text-secondary font-bold tracking-widest text-sm uppercase">ניהול תכנים</span>
            </div>
            <h1 className="text-4xl font-black text-primary mb-2">שיעורי וידאו</h1>
            <p className="text-foreground/50 italic">ניהול סרטוני יוטיוב, קטגוריות וכותרות</p>
          </div>
          
          <Link 
            href="/admin/videos/new" 
            className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-lg flex items-center gap-3 hover:bg-primary/90 transition-all shadow-xl hover:-translate-y-1"
          >
            <PlusCircle size={24} /> הוספת שיעור חדש
          </Link>
        </header>

        {/* Search & Filters */}
        <div className="mb-10 relative max-w-md">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/30" size={20} />
          <input 
            type="text"
            placeholder="חפש לפי כותרת או קטגוריה..."
            className="w-full pr-12 pl-6 py-4 bg-white border border-secondary/10 rounded-2xl focus:border-secondary outline-none shadow-sm transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-secondary border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence>
              {filteredVideos.map((video: any, idx) => {
                const ytId = getYouTubeID(video.videoUrl);
                return (
                  <motion.div 
                    key={video._id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-[32px] p-4 shadow-sm border border-secondary/10 hover:shadow-md transition-all group flex flex-col md:flex-row gap-6 items-center"
                  >
                    {/* Thumbnail Preview */}
                    <div className="relative w-full md:w-64 h-36 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                      {ytId ? (
                        <img 
                          src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} 
                          alt="" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <VideoIcon size={48} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
                        <Play className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={40} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-center md:text-right w-full">
                      <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                        <span className="bg-secondary/10 text-primary text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
                          <Tag size={12} /> {video.category || "ללא קטגוריה"}
                        </span>
                        <span className="text-xs text-foreground/40 font-medium">
                          פורסם ב: {new Date(video.createdAt).toLocaleDateString('he-IL')}
                        </span>
                      </div>
                      <h2 className="text-xl font-black text-primary mb-2">{video.title}</h2>
                      <p className="text-foreground/60 text-sm line-clamp-1 mb-4">{video.description || "אין תיאור לשיעור זה"}</p>
                      
                      <div className="flex items-center justify-center md:justify-start gap-4">
                        <a 
                          href={video.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary/60 hover:text-secondary flex items-center gap-1 text-sm font-bold transition-colors"
                        >
                          צפייה ביוטיוב <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex md:flex-col gap-2 border-t md:border-t-0 md:border-r border-muted pt-4 md:pt-0 md:pr-6 w-full md:w-auto justify-center">
                      <Link 
                        href={`/admin/videos/${video._id}`}
                        className="p-3 text-primary hover:bg-primary/5 rounded-xl transition-all font-bold text-sm flex items-center gap-2"
                      >
                         עריכה
                      </Link>
                      <button 
                        onClick={() => handleDelete(video._id)}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold text-sm flex items-center gap-2"
                      >
                        <Trash2 size={18} /> מחיקה
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}