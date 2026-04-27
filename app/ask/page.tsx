// דף שאל את הרב
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Mail, MessageCircle, Info, CheckCircle2, Sparkles } from 'lucide-react';

export default function AskTheRabbiPage() {
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    subject: '',
    questionText: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setStatus('success');
        setFormData({ senderName: '', senderEmail: '', subject: '', questionText: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <main className="min-h-screen bg-background text-right" dir="rtl">
      
      {/* Hero Section - בורדו יוקרתי עם ה-SVG המונפש */}
      <section className="relative w-full bg-primary pt-32 pb-16 overflow-hidden shadow-2xl">
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
               <span className="text-secondary font-bold tracking-widest text-sm uppercase">מענה הלכתי אישי</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
              <span className="text-white drop-shadow-md">שאל את</span> 
              <span className="text-secondary italic mr-4 drop-shadow-sm">הרב</span>
            </h1>
            <p className="text-xl text-muted/90 max-w-2xl font-medium leading-relaxed border-r-4 border-secondary pr-6">
              יש לכם ספק הלכתי? שאלה בחושן משפט או בבין אדם לחברו?
              כאן המקום לשאול ולקבל מענה מפורט.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-[40px] p-12 text-center shadow-xl border border-muted"
              >
                <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-black text-primary mb-4">השאלה נשלחה בהצלחה!</h2>
                <p className="text-lg text-foreground/70 mb-8">
                  תודה רבה. שאלתכם התקבלה במערכת. הרב ישתדל להשיב בהקדם האפשרי לכתובת האימייל שהזנתם.
                </p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg"
                >
                  שאל שאלה נוספת
                </button>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl border border-muted relative overflow-hidden"
              >
                {/* עיטור זהב עדין בצד */}
                <div className="absolute top-0 right-0 w-2 h-full bg-secondary opacity-20" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* שם */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-primary font-bold text-sm">
                      <User size={16} className="text-secondary" /> שם מלא
                    </label>
                    <input 
                      required
                      type="text"
                      value={formData.senderName}
                      onChange={(e) => setFormData({...formData, senderName: e.target.value})}
                      className="w-full px-6 py-4 bg-muted/20 border border-transparent rounded-2xl focus:border-secondary focus:bg-white outline-none transition-all text-lg"
                      placeholder="ישראל ישראלי"
                    />
                  </div>

                  {/* אימייל */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-primary font-bold text-sm">
                      <Mail size={16} className="text-secondary" /> אימייל למענה
                    </label>
                    <input 
                      required
                      type="email"
                      value={formData.senderEmail}
                      onChange={(e) => setFormData({...formData, senderEmail: e.target.value})}
                      className="w-full px-6 py-4 bg-muted/20 border border-transparent rounded-2xl focus:border-secondary focus:bg-white outline-none transition-all text-lg"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                {/* נושא */}
                <div className="space-y-2 mb-8">
                  <label className="flex items-center gap-2 text-primary font-bold text-sm">
                    <Info size={16} className="text-secondary" /> נושא השאלה
                  </label>
                  <input 
                    required
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-6 py-4 bg-muted/20 border border-transparent rounded-2xl focus:border-secondary focus:bg-white outline-none transition-all text-lg"
                    placeholder="למשל: הלכות השבת אבידה"
                  />
                </div>

                {/* תוכן */}
                <div className="space-y-2 mb-10">
                  <label className="flex items-center gap-2 text-primary font-bold text-sm">
                    <MessageCircle size={16} className="text-secondary" /> פירוט השאלה
                  </label>
                  <textarea 
                    required
                    rows={6}
                    value={formData.questionText}
                    onChange={(e) => setFormData({...formData, questionText: e.target.value})}
                    className="w-full px-6 py-4 bg-muted/20 border border-transparent rounded-2xl focus:border-secondary focus:bg-white outline-none transition-all text-lg resize-none"
                    placeholder="כתבו כאן את שאלתכם בפירוט..."
                  />
                </div>

                {status === 'error' && (
                  <p className="text-red-500 font-bold mb-6 text-center bg-red-50 py-3 rounded-xl">חלה שגיאה בשליחת השאלה. נסו שוב מאוחר יותר.</p>
                )}

                <button 
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:bg-primary/95 transition-all shadow-xl disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      שליחת השאלה לרב <Send size={20} />
                    </>
                  )}
                </button>

                <p className="mt-6 text-center text-xs text-foreground/50">
                  * השליחה מהווה הסכמה למדיניות הפרטיות. הפרטים נשמרים לצורך מענה בלבד.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Footer Decoration */}
      <div className="flex justify-center pb-20 text-secondary/30">
        <Sparkles size={32} />
      </div>
    </main>
  );
}