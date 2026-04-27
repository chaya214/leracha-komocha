// דף אודות
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Award, Users, BookOpen } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="pt-24">
      {/* Hero Section - אודות */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-primary mb-6"
          >
            הסיפור של "לרעך כמוך"
          </motion.h1>
          <div className="w-24 h-1 bg-secondary mx-auto rounded-full"></div>
        </div>
      </section>

      {/* התוכן המרכזי */}
      <section className="py-20 container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* תמונה או אלמנט ויזואלי */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <div className="bg-primary p-12 text-white aspect-square flex flex-col justify-center items-center text-center">
                <BookOpen size={80} className="mb-6 text-secondary" />
                <h3 className="text-2xl font-bold mb-4">יותר מסדרת ספרים</h3>
                <p className="opacity-80 leading-relaxed">
                  מה שהתחיל כיוזמה מקומית להנגשת ההלכה, הפך למפעל עולמי המקיף עשרות אלפי לומדים מדי יום.
                </p>
              </div>
            </div>
            {/* אלמנט קישוטי */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary/20 rounded-full -z-10"></div>
          </motion.div>

          {/* טקסט אודות */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <h2 className="text-3xl font-bold text-primary">החזון שלנו</h2>
            <p className="text-lg text-foreground/80 leading-relaxed">
              סדרת ספרי <strong>"לרעך כמוך"</strong> נוסדה במטרה להאיר את עולם המצוות שבין אדם לחברו. אנו מאמינים שכל פרט הלכתי, קטן כגדול, הוא נדבך בבניית חברה מתוקנת וערכית יותר.
            </p>
            <p className="text-lg text-foreground/80 leading-relaxed">
              באתר זה ריכזנו עבורכם את תמצית הלימוד - החל משו"ת הלכתי מעשי ועד לשיעורים מוקלטים, הכל מתוך מטרה אחת: להפוך את ההלכה לחלק חי, פועם ומובן בחיי היום-יום של כל אחד מאיתנו.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-secondary" />
                <span className="font-medium">הלכה בהירה ונגישה</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-secondary" />
                <span className="font-medium">מענה אישי ומקצועי</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-secondary" />
                <span className="font-medium">דגש על מקרים אקטואליים</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-secondary" />
                <span className="font-medium">מחקר הלכתי מעמיק</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* מספרים שמספרים את הסיפור */}
      <section className="bg-primary/5 py-20 border-y border-muted">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatItem icon={<Award />} value="15" label="כרכי הלכה" />
            <StatItem icon={<Users />} value="50K+" label="קוראים בארץ ובעולם" />
            <StatItem icon={<BookOpen />} value="1000+" label="מקורות והערות" />
            <StatItem icon={<CheckCircle2 />} value="100%" label="דיוק הלכתי" />
          </div>
        </div>
      </section>
    </main>
  );
}

function StatItem({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-secondary mb-2">{icon}</div>
      <div className="text-3xl font-black text-primary">{value}</div>
      <div className="text-sm font-bold text-foreground/60 uppercase tracking-wide">{label}</div>
    </div>
  );
}