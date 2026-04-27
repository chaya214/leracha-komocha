// דף הניהול
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  BookOpen, 
  Video, 
  Mail, 
  Settings, 
  LogOut,
  PlusCircle,
  List,
  LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const adminModules = [
    { 
      title: "שאלות ותשובות", 
      desc: "מענה לשאלות ופרסום לשו״ת הציבורי", 
      icon: <MessageCircle size={28} />, 
      color: "bg-primary/10 text-primary",
      link: "/admin/questions"
    },
    { 
      title: "הלכה יומית", 
      desc: "הוספה ועריכה של הלכות לפי תאריך", 
      icon: <BookOpen size={28} />, 
      color: "bg-secondary/20 text-primary",
      link: "/admin/halacha"
    },
    { 
      title: "שיעורי וידאו", 
      desc: "ניהול סרטוני יוטיוב וקטגוריות", 
      icon: <Video size={28} />, 
      color: "bg-primary/10 text-primary",
      link: "/admin/videos"
    },
    { 
      title: "פניות צור קשר", 
      desc: "צפייה בהודעות כלליות מהאתר", 
      icon: <Mail size={28} />, 
      color: "bg-secondary/20 text-primary",
      link: "/admin/contact-leads"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-right" dir="rtl">
      
      {/* Header / Hero Section */}
      <section className="bg-primary pt-24 pb-20 px-6 relative overflow-hidden shadow-lg">
         {/* אלמנט עיצובי ברקע */}
         <div className="absolute left-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
         
         <div className="container mx-auto max-w-6xl relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <LayoutDashboard className="text-secondary" size={24} />
                <span className="text-secondary font-bold tracking-widest text-sm uppercase">פאנל ניהול</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-2">מרכז שליטה</h1>
              <p className="text-white/60 italic text-lg">"עולם חסד יבנה" — ניהול תוכן האתר</p>
            </div>

            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl font-bold transition-all border border-white/10 backdrop-blur-sm">
              <LogOut size={20} className="text-secondary" /> יציאה מהמערכת
            </button>
         </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-6 -translate-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {adminModules.map((module, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-secondary/10 flex items-start gap-6 group hover:shadow-2xl transition-all duration-500"
            >
              <div className={`p-5 rounded-2xl ${module.color} transition-transform group-hover:scale-110`}>
                {module.icon}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-black text-primary mb-2 transition-colors group-hover:text-secondary">{module.title}</h2>
                <p className="text-foreground/60 mb-8 font-medium leading-relaxed">{module.desc}</p>
                
                <div className="flex flex-wrap gap-3">
                  <Link 
                    href={module.link} 
                    className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md"
                  >
                    <List size={18}/> ניהול רשימה
                  </Link>
                  <Link 
                    href={`${module.link}/new`} 
                    className="bg-secondary/10 text-primary border border-secondary/20 px-6 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 hover:bg-secondary/20 transition-all"
                  >
                    <PlusCircle size={18}/> הוספת חדש
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* קישור הגדרות מעוצב כ-Card רחב */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/admin/settings" className="mt-8 w-full bg-white p-8 rounded-[2.5rem] shadow-sm border border-secondary/10 flex items-center justify-between hover:shadow-lg transition-all group">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-muted/30 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <Settings size={24} />
              </div>
              <div>
                <span className="font-black text-primary text-xl block">הגדרות מערכת</span>
                <span className="text-foreground/50 text-sm italic">ניהול משתמשים, אבטחה ופרמטרים כלליים</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full border border-secondary/20 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-all">
               <span className="text-2xl font-black">←</span>
            </div>
          </Link>
        </motion.div>

        {/* Footer Info */}
        <p className="mt-12 text-center text-foreground/30 text-sm font-medium">
          מערכת ניהול תוכן — לרעך כמוך © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}