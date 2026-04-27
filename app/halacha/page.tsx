// app/halacha/page.tsx - דף הלכה יומית
// app/halacha/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, Share2, BookOpen, Calendar } from 'lucide-react';
import Link from 'next/link';

interface DailyHalacha {
  _id: string;
  title: string;
  content: string;
  source?: string;
  dateFor: string;
  createdAt: string;
}

export default function HalachaPage() {
  const [halachas, setHalachas] = useState<DailyHalacha[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchHalachas();
  }, []);

  const fetchHalachas = async () => {
    try {
      const res = await fetch('/api/halacha');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setHalachas(data);
    } catch (err) {
      console.error('Error fetching halachas:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredHalachas = halachas.filter(h => 
    h.title.includes(searchTerm) || h.content.includes(searchTerm)
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <main className="min-h-screen bg-background text-right" dir="rtl">
      
      {/* Hero Section - Full Width */}
      {/* pt-32 מבטיח שה-Navbar הגלובלי שלך לא יסתיר את הכותרת */}
      <section className="relative w-full bg-primary pt-48 pb-20 overflow-hidden shadow-2xl">
        
        {/* SVG מונפש ברקע (מבוסס על הלוגו שלך) */}
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
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-3 mb-6">
               <div className="h-[2px] w-12 bg-secondary" />
               <span className="text-secondary font-bold tracking-widest text-sm uppercase">שיעור יומי</span>
            </div>
            
            {/* תיקון צבעים: לבן וזהב על רקע בורדו עם צל ליצירת עומק */}
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
              <span className="text-white drop-shadow-md">הלכה</span> 
              <span className="text-secondary italic mr-4 drop-shadow-sm">יומית</span>
            </h1>

            {/* שורת חיפוש משולבת בתוך ה-Hero */}
            <div className="relative max-w-xl mt-10">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
              <input 
                type="text"
                placeholder="חפש נושא בהלכה..."
                className="w-full pr-12 pl-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-white/40 focus:bg-white/20 focus:outline-none transition-all backdrop-blur-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content - Grid Layout */}
      <section className="container mx-auto px-6 py-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-secondary border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            <AnimatePresence>
              {filteredHalachas.map((halacha, idx) => (
                <motion.article
                  key={halacha._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group bg-white rounded-[40px] p-8 border border-secondary/10 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col"
                >
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-black text-secondary bg-secondary/5 px-3 py-1 rounded-full italic">
                      {formatDate(halacha.dateFor)}
                    </span>
                    <Share2 size={18} className="text-primary/20 cursor-pointer hover:text-secondary transition-colors" />
                  </div>

                  <h2 className="text-2xl font-bold text-primary mb-4 leading-snug group-hover:text-secondary transition-colors">
                    {halacha.title}
                  </h2>

                  <p className="text-foreground/80 leading-relaxed text-lg mb-8 flex-1">
                    {halacha.content}
                  </p>

                  <div className="pt-6 border-t border-muted flex justify-between items-center">
                    <div className="flex items-center gap-2 text-secondary font-medium text-sm">
                      <BookOpen size={16} />
                      {halacha.source || "מקורות חז״ל"}
                    </div>
                    <Link href={`/halacha/${halacha._id}`} className="p-3 rounded-full bg-muted text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <ChevronLeft size={20} />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* Footer CTA */}
      <footer className="container mx-auto px-6 pb-20">
        <div className="bg-primary rounded-[50px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-white text-4xl font-black mb-6 italic">להתעלות בכל יום מחדש</h2>
            <button className="bg-secondary text-primary px-12 py-5 rounded-full font-black text-xl hover:bg-white transition-all shadow-xl">
              הצטרפות לקבוצת הווטסאפ
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}