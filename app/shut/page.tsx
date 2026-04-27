// דף השות הציבורי
"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MessageSquare, Quote, ChevronLeft, BookOpen, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface QuestionType {
  _id: string;
  subject: string;
  questionText: string;
  answerText: string;
  status: string;
  answeredAt: string;
}

export default function ShutPage() {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // התיקון כאן: שימוש בראוט הנכון לפי הקוד ששלחת
        const res = await fetch('/api/ask'); 
        if (!res.ok) throw new Error('Failed to fetch questions');
        
        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // סינון השאלות לפי חיפוש
  const filteredQuestions = questions.filter(q => 
    q.subject.includes(searchTerm) || 
    q.questionText.includes(searchTerm) || 
    (q.answerText && q.answerText.includes(searchTerm))
  );

  return (
    <main className="min-h-screen bg-background text-right" dir="rtl">
      
      {/* Hero Section - בורדו יוקרתי עם גובה מופחת */}
      <section className="relative w-full bg-primary pt-32 pb-16 overflow-hidden shadow-2xl">
        
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

        <div className="container mx-auto px-6 relative z-10 text-center md:text-right">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
               <div className="h-[2px] w-12 bg-secondary" />
               <span className="text-secondary font-bold tracking-widest text-sm uppercase">בירורי הלכה</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
              <span className="text-white drop-shadow-md">שו"ת</span> 
              <span className="text-secondary italic mr-4 drop-shadow-sm">הלכתי</span>
            </h1>

            {/* שורת חיפוש מוקטנת ומשולבת (py-2.5) */}
            <div className="relative max-w-xl mx-auto md:mx-0 mt-10">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
              <input 
                type="text"
                placeholder="חפש נושא בשאלות ותשובות..."
                className="w-full pr-12 pl-6 py-2.5 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-white/40 focus:bg-white/20 focus:outline-none transition-all backdrop-blur-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-6 py-20">
  {loading ? (
    <div className="flex justify-center py-20">
      <div className="w-12 h-12 border-4 border-secondary border-t-primary rounded-full animate-spin" />
    </div>
  ) : (
    <motion.div 
      layout
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      <AnimatePresence>
        {filteredQuestions.map((q, idx) => (
          <motion.article
            key={q._id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="group bg-white rounded-[40px] shadow-sm border border-secondary/10 overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col"
          >
            <div className="p-8 relative flex flex-col h-full">
              {/* עיטור בצד */}
              <div className="absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b from-primary to-secondary opacity-40" />
              
              {/* השאלה */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3 text-secondary font-bold">
                  <MessageSquare size={18} />
                  <span className="text-xs tracking-widest uppercase">השאלה</span>
                </div>
                <h2 className="text-xl font-black text-primary mb-4 leading-tight group-hover:text-secondary transition-colors">
                  {q.subject}
                </h2>
                <div className="bg-muted/15 p-5 rounded-[2rem] border-r-4 border-secondary/30 relative">
                  <p className="text-base text-foreground/90 leading-relaxed italic line-clamp-4">
                    {q.questionText}
                  </p>
                </div>
              </div>

              {/* מפריד */}
              <div className="mt-auto pt-6 border-t border-muted relative">
                <div className="flex items-center gap-2 mb-4 text-primary font-bold">
                  <BookOpen size={18} className="text-secondary" />
                  <span className="text-xs tracking-widest uppercase">תשובת הרב</span>
                </div>
                <div className="text-base leading-relaxed text-foreground/80 font-medium whitespace-pre-wrap line-clamp-6">
                  {q.answerText || "התשובה בבדיקה..."}
                </div>
                
                {/* כפתור "קרא עוד" קטן - אופציונלי אם יש דף פנימי */}
                <div className="mt-6 flex justify-end">
                   <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                      <ChevronLeft size={20} />
                   </div>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </AnimatePresence>
    </motion.div>
  )}
</section>

      {/* Footer CTA */}
      <footer className="container mx-auto px-6 pb-20">
        <div className="bg-primary rounded-[50px] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-white text-3xl md:text-5xl font-black mb-6">יש לך שאלה אישית?</h2>
            <p className="text-muted text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              הרב כאן כדי להשיב על כל בירור הלכתי בחושן משפט ובין אדם לחברו.
            </p>
            <Link href="/ask" className="inline-block bg-secondary hover:bg-white text-primary px-12 py-5 rounded-full font-black text-xl transition-all hover:scale-105 shadow-xl">
              שלח שאלה לרב
            </Link>
          </div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        </div>
      </footer>
    </main>
  );
}