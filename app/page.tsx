"use client";

import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { BookOpen, MessageCircle, Video, ShoppingCart, ArrowLeft } from 'lucide-react';

// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/navigation';
// @ts-ignore
import 'swiper/css/pagination';
// עיצובים של Swiper


export default function HomePage() {
  const [halachas, setHalachas] = useState<any[]>([]);
const [videos, setVideos] = useState<any[]>([]);
const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    // משיכת כל הנתונים במקביל
    Promise.all([
      fetch('/api/halacha').then(res => res.json()),
      fetch('/api/videos').then(res => res.json()),
      fetch('/api/ask').then(res => res.json()) // מניח שמחזיר שאלות בסטטוס published
    ]).then(([halachaData, videoData, questionData]) => {
      // בדיקה שהנתונים תקינים (מערכים) לפני שמירה ב-State
      if (Array.isArray(halachaData)) setHalachas(halachaData);
      if (Array.isArray(videoData)) setVideos(videoData);
      if (Array.isArray(questionData)) setQuestions(questionData);
    }).catch(err => console.error("Error fetching data:", err));
  }, []);

  const swiperOptions = {
    modules: [Navigation, Pagination, Autoplay],
    spaceBetween: 24,
    slidesPerView: 1,
    navigation: true,
    pagination: { clickable: true },
    breakpoints: {
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
    autoplay: { delay: 5000, disableOnInteraction: false }
  };

  return (
    <div className="flex flex-col gap-16 pb-20 overflow-hidden" dir="rtl">
      
      {/* --- Hero Section --- */}
      <section className="relative min-h-[80vh] flex items-center bg-[url('/paper-texture.png')] bg-muted pt-20 overflow-hidden">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          
          {/* טקסט וכותרות */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="z-10"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6 leading-tight">
              לרעך כמוך
              <span className="block text-secondary text-3xl md:text-4xl mt-2 font-medium">לחיות חיים של קדושה ויושרה</span>
            </h1>
            <p className="text-xl text-foreground/80 mb-10 max-w-lg leading-relaxed">
              המרכז העולמי להפצת הלכות בין אדם לחברו. 
              תשובות לשאלות אקטואליות, שיעורי וידאו וגישה לכרך החדש - הלכות גזל.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-primary text-white px-10 py-4 rounded-full font-bold shadow-xl hover:scale-105 transition-transform flex items-center gap-2">
                לחנות הספרים <ShoppingCart size={20} />
              </button>
              <Link href="/ask">
                <button className="bg-white border-2 border-primary text-primary px-10 py-4 rounded-full font-bold hover:bg-primary/5 transition-colors">
                  שאל את הרב
                </button>
              </Link>
            </div>
          </motion.div>

          {/* תצוגת הספר */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative flex justify-center"
          >
            <div className="w-72 h-[450px] bg-primary rounded-r-lg rounded-l-3xl shadow-[20px_20px_60px_rgba(0,0,0,0.3)] border-l-8 border-secondary flex flex-col justify-between p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/gold-dust.png')]"></div>
              <div className="text-center z-10">
                <p className="text-sm tracking-widest opacity-80 uppercase">סדרת הספרים</p>
                <h2 className="text-3xl font-bold mt-2">לרעך כמוך</h2>
              </div>
              <div className="text-center border-t border-white/20 pt-4 z-10">
                <p className="text-xl font-medium">כרך ט"ו</p>
                <p className="text-lg text-secondary font-bold">הלכות גזל</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- Quick Links / Features --- */}
      <section className="container mx-auto px-6 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            href="/ask"
            icon={<MessageCircle size={32} />}
            title="שו״ת אקטואלי"
            description="מאגר תשובות הלכתיות למקרים המצויים ביותר בחיי היום-יום."
            linkText="לכל השאלות"
          />
          <FeatureCard 
            href="/videos"
            icon={<Video size={32} />}
            title="שיעורי וידאו"
            description="צפו בהלכות המוגשות בצורה מוחשית, ברורה ומרתקת."
            linkText="לצפייה בשיעורים"
          />
          <FeatureCard 
            href="/halacha"
            icon={<BookOpen size={32} />}
            title="הלכה יומית"
            description="הצטרפו לאלפים שמקבלים שתי הלכות קצרות בכל יום."
            linkText="להרשמה חינם"
          />
        </div>
      </section>

      {/* --- Section: הגישה שלנו --- */}
      <section className="bg-primary text-white py-20 mt-10">
        <div className="container mx-auto px-6 text-center">
          <motion.div 
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">"מה ששנוא עליך - לחברך לא תעשה"</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-10 leading-relaxed">
              סדרת 'לרעך כמוך' חוללה מהפכה בהבנת המצוות שבין אדם לחברו. 
              מטרת האתר היא להנגיש את הידע הזה לכל יהודי, בכל מקום, בצורה בהירה ומדויקת.
            </p>
            <div className="flex justify-center gap-12">
              <div className="text-center">
                <p className="text-4xl font-bold text-secondary">15+</p>
                <p className="text-sm opacity-80 font-medium">כרכים שיצאו לאור</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-secondary">10,000+</p>
                <p className="text-sm opacity-80 font-medium">לומדים מדי יום</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- Dynamic Content Section (Carousels) --- */}
      <div className="container mx-auto px-6 space-y-24 mt-16">
        
        {/* קרוסלת הלכות יומיומיות */}
        {halachas.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold flex items-center gap-3 text-primary">
                <BookOpen className="text-secondary" /> הלכה יומית
              </h2>
              <Link href="/halacha" className="text-primary font-bold hover:text-secondary transition-colors">לכל ההלכות ←</Link>
            </div>
            <Swiper {...swiperOptions} className="pb-12 px-4">
              {halachas.map((h: any) => (
                <SwiperSlide key={h._id}>
                  <Link href={`/halacha/${h._id}`}>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-64 flex flex-col justify-between hover:shadow-xl transition-all cursor-pointer group">
                      <div>
                        <span className="text-xs text-slate-400 font-medium bg-slate-50 px-3 py-1 rounded-full">
                          {new Date(h.dateFor).toLocaleDateString('he-IL')}
                        </span>
                        <h3 className="text-xl font-bold mt-4 text-primary line-clamp-2 group-hover:text-secondary transition-colors">{h.title}</h3>
                        <p className="text-slate-600 mt-3 line-clamp-3 leading-relaxed">{h.content}</p>
                      </div>
                      <span className="text-secondary font-bold text-sm flex items-center gap-2">
                        קרא עוד <ArrowLeft size={16} />
                      </span>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
        )}

        {/* קרוסלת שיעורי וידאו */}
        {videos.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold flex items-center gap-3 text-primary">
                <Video className="text-secondary" /> שיעורי וידאו אחרונים
              </h2>
              <Link href="/videos" className="text-primary font-bold hover:text-secondary transition-colors">לכל הסרטונים ←</Link>
            </div>
            <Swiper {...swiperOptions} className="pb-12 px-4">
              {videos.map((v: any) => (
                <SwiperSlide key={v._id}>
                  <Link href={`/videos/${v._id}`}>
                    <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-100 hover:shadow-xl transition-all cursor-pointer group h-full flex flex-col">
                      <div className="relative aspect-video bg-slate-100 overflow-hidden">
                        <img 
                          src={v.thumbnailUrl || (v.videoUrl?.includes('v=') ? `https://img.youtube.com/vi/${v.videoUrl.split('v=')[1]?.split('&')[0]}/hqdefault.jpg` : '/placeholder-video.jpg')} 
                          alt={v.title} 
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center text-primary shadow-lg group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 flex-grow flex flex-col justify-between">
                        <div>
                          <span className="text-xs font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full">{v.category || "כללי"}</span>
                          <h3 className="font-bold text-lg mt-3 line-clamp-2 text-primary">{v.title}</h3>
                        </div>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
        )}

        {/* קרוסלת שאלות ותשובות */}
        {questions.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold flex items-center gap-3 text-primary">
                <MessageCircle className="text-secondary" /> שאלות ותשובות
              </h2>
              <Link href="/ask" className="text-primary font-bold hover:text-secondary transition-colors">לכל השאלות ←</Link>
            </div>
            <Swiper {...swiperOptions} className="pb-12 px-4">
              {questions.map((q: any) => (
                <SwiperSlide key={q._id}>
                  <Link href={`/ask/${q._id}`}>
                    <div className="bg-stone-50 p-8 rounded-3xl border border-stone-200 h-72 flex flex-col justify-between hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                        <MessageCircle size={80} />
                      </div>
                      <div className="relative z-10">
                        <h3 className="text-xl font-bold text-primary mb-3 line-clamp-2">{q.subject}</h3>
                        <p className="text-slate-600 italic line-clamp-3 font-serif">"{q.questionText}"</p>
                      </div>
                      <div className="mt-4 flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">הרב</div>
                          <span className="text-sm font-bold text-primary">קרא תשובה</span>
                        </div>
                        <ArrowLeft size={18} className="text-secondary opacity-0 group-hover:opacity-100 group-hover:-translate-x-2 transition-all" />
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
        )}

      </div>
    </div>
  );
}

// קומפוננטת כרטיס שירות שעודכנה להיות לחיצה
function FeatureCard({ href, icon, title, description, linkText }: { href: string, icon: React.ReactNode, title: string, description: string, linkText: string }) {
  return (
    <Link href={href} className="block group">
      <motion.div 
        whileHover={{ y: -10 }}
        className="p-10 bg-white rounded-3xl shadow-sm border border-muted flex flex-col items-start gap-4 hover:shadow-xl transition-all h-full"
      >
        <div className="p-4 bg-muted rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-primary">{title}</h3>
        <p className="text-foreground/70 leading-relaxed">{description}</p>
        <div className="text-secondary font-bold flex items-center gap-2 mt-auto group-hover:gap-4 transition-all">
          {linkText} <ArrowLeft size={18} />
        </div>
      </motion.div>
    </Link>
  );
}