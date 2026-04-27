// app/videos/page.tsx - דף כל שיעורי הווידיאו
// app/videos/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Grid, List, Filter, ChevronLeft, Search, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Video {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  category?: string;
  createdAt: string;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('כל השיעורים');
  const [categories, setCategories] = useState<string[]>(['כל השיעורים']);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/videos');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setVideos(data);

      const uniqueCategories = Array.from(
        new Set(data.map((v: Video) => v.category).filter(Boolean))
      ) as string[];
      setCategories(['כל השיעורים', ...uniqueCategories]);
    } catch (err) {
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredVideos = videos.filter(v => {
    const matchesCategory = selectedCategory === 'כל השיעורים' || v.category === selectedCategory;
    const matchesSearch = v.title.includes(searchTerm) || (v.description?.includes(searchTerm));
    return matchesCategory && matchesSearch;
  });

  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  return (
    <main className="min-h-screen bg-background text-right" dir="rtl">
      
      {/* Hero Section - מותאם לדף ההלכה */}
      <section className="relative w-full bg-primary pt-32 pb-12 overflow-hidden shadow-2xl">
        {/* ה-SVG המונפש שלך ברקע */}
        {/* <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full md:w-1/2 opacity-20 pointer-events-none px-10">
          <motion.svg viewBox="0 0 500 500" initial="hidden" animate="visible" className="w-full h-auto max-w-lg">
            <motion.path
              d="M250,50 A200,200 0 1,1 249.9,50"
              fill="none"
              stroke="var(--color-brand-gold)"
              strokeWidth="1.5"
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                visible: { pathLength: 1, opacity: 1, transition: { duration: 3 } }
              }}
            />
          </motion.svg>
        </div> */}

        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
               <div className="h-[2px] w-12 bg-secondary" />
               <span className="text-secondary font-bold tracking-widest text-sm uppercase">ספריית הווידאו</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
              <span className="text-white drop-shadow-md">שיעורי</span> 
              <span className="text-secondary italic mr-4 drop-shadow-sm">וידיאו</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted/90 leading-relaxed max-w-xl font-medium border-r-4 border-secondary pr-6">
              צפו בהלכות המוגשות בצורה מוחשית, ברורה ומרתקת. 
              לראות את ההלכה בעיניים.
            </p>

            {/* חיפוש משולב ב-Hero */}
            <div className="relative max-w-xl mt-10">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
              <input 
                type="text"
                placeholder="חפש שיעור או נושא..."
                className="w-full pr-12 pl-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-white/40 focus:bg-white/20 focus:outline-none transition-all backdrop-blur-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Controls Bar */}
      <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-secondary/10 py-4 shadow-sm">
        <div className="container mx-auto px-6 flex flex-wrap items-center justify-between gap-6">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full font-bold transition-all text-sm whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-muted/30 text-primary hover:bg-muted'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex gap-2 bg-muted/20 rounded-xl p-1">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow text-primary' : 'text-primary/40'}`}>
              <Grid size={20} />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow text-primary' : 'text-primary/40'}`}>
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Videos Section */}
      <section className="container mx-auto px-6 py-20">
        {loading ? (
          <div className="flex justify-center py-20">
             <div className="w-12 h-12 border-4 border-secondary border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div 
            layout
            className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10' : 'space-y-6 max-w-4xl mx-auto'}
          >
            <AnimatePresence>
              {filteredVideos.map((video, idx) => {
                const videoId = getYouTubeVideoId(video.videoUrl);
                return (
                  <motion.div
                    key={video._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link href={`/videos/${video._id}`}>
                      <article className={`group bg-white rounded-[40px] overflow-hidden border border-secondary/10 shadow-sm hover:shadow-2xl transition-all duration-500 ${viewMode === 'list' ? 'flex flex-col md:flex-row' : ''}`}>
                        
                        {/* Thumbnail */}
                        <div className={`relative overflow-hidden bg-primary ${viewMode === 'list' ? 'md:w-72 aspect-video' : 'aspect-video'}`}>
                          {videoId ? (
                            <Image
                              src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                              alt={video.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-90"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><Play size={40} className="text-secondary" /></div>
                          )}
                          <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center scale-90 group-hover:scale-100 transition-transform">
                              <Play size={32} className="text-white fill-white ml-1" />
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 flex flex-col flex-1">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-black text-secondary uppercase tracking-widest">{video.category || "שיעור כללי"}</span>
                            <div className="flex items-center gap-1 text-primary/30 text-xs font-bold">
                              <Clock size={14} />
                              {new Date(video.createdAt).toLocaleDateString('he-IL')}
                            </div>
                          </div>
                          
                          <h2 className="text-2xl font-bold text-primary mb-4 leading-tight group-hover:text-secondary transition-colors">
                            {video.title}
                          </h2>
                          
                          <p className="text-foreground/70 leading-relaxed mb-6 line-clamp-2">
                            {video.description}
                          </p>

                          <div className="mt-auto pt-6 border-t border-muted flex justify-end">
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all transform group-hover:-translate-x-2">
                              <ChevronLeft size={24} />
                            </div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* Footer CTA */}
      <footer className="container mx-auto px-6 pb-20">
        <div className="bg-primary rounded-[50px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-white text-4xl font-black mb-6 italic">רוצה לקבל עדכון על שיעור חדש?</h2>
            <p className="text-muted text-lg mb-10 max-w-lg mx-auto">הצטרפו לרשימת התפוצה שלנו וקבלו את השיעורים הכי חדשים ישירות אליכם.</p>
            <button className="bg-secondary text-primary px-12 py-5 rounded-full font-black text-xl hover:bg-white transition-all shadow-xl">
              הרשמה לעדכונים
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        </div>
      </footer>
    </main>
  );
}