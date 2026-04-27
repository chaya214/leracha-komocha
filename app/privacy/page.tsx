// מדיניות פרטיות
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, EyeOff, FileText } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <main className="pt-32 pb-20 bg-background">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* כותרת הדף */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <ShieldCheck size={64} className="mx-auto text-secondary mb-4" />
          <h1 className="text-4xl font-bold text-primary mb-4">מדיניות פרטיות</h1>
          <p className="text-foreground/60">עודכן לאחרונה: אפריל 2026</p>
        </motion.div>

        {/* תוכן המדיניות */}
        <div className="prose prose-lg max-w-none text-foreground/80 leading-relaxed space-y-12">
          
          <section className="bg-white p-8 rounded-2xl shadow-sm border-r-4 border-primary">
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
              <Lock className="text-secondary" size={24} /> 1. כללי
            </h2>
            <p>
              אנו במיזם "לרעך כמוך" מכבדים את פרטיות המשתמשים באתר. מדיניות זו מסבירה כיצד אנו אוספים, משתמשים ושומרים על המידע שנמסר לנו על ידך בעת הגלישה והשימוש בשירותי האתר (כגון שאלת רב, הרשמה להלכה יומית או רכישת ספרים).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">2. המידע שאנו אוספים</h2>
            <p>בעת שימוש באתר, עשוי להיאסף מידע בשתי דרכים:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li><strong>מידע שנמסר מרצון:</strong> שם, כתובת אימייל, מספר טלפון ופרטי השאלה בטפסי "צור קשר" או "שאל את הרב".</li>
              <li><strong>מידע טכני:</strong> כתובת IP, סוג דפדפן, וזמני שהייה באתר (באמצעות עוגיות - Cookies) לצורך שיפור חוויית המשתמש.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">3. השימוש במידע</h2>
            <p>המידע שנאסף ישמש למטרות הבאות בלבד:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li>מתן מענה הלכתי לשאלות שנשלחו.</li>
              <li>שליחת ה"הלכה היומית" או עדכונים על כרכים חדשים (למי שנרשם לכך).</li>
              <li>שיפור תכני האתר והתאמתם לצורכי הלומדים.</li>
              <li>ניהול תהליך רכישת ספרים ומשלוחם.</li>
            </ul>
          </section>

          <section className="bg-muted p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
              <EyeOff className="text-secondary" size={24} /> 4. העברת מידע לצד ג'
            </h2>
            <p>
              אנו מתחייבים שלא למכור, להשכיר או להעביר את פרטיך האישיים לצדדים שלישיים לצרכי שיווק. מידע יועבר לצד ג' רק במקרים הבאים:
            </p>
            <ul className="list-disc pr-6 mt-4">
              <li>לצורך השלמת רכישה (כגון חברת סליקה או חברת שליחויות).</li>
              <li>אם נדרש לכך על פי חוק או צו שיפוטי.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">5. אבטחת מידע</h2>
            <p>
              האתר נוקט באמצעי זהירות מקובלים כדי להגן על המידע האישי שלך. עם זאת, יש לזכור כי אף מערכת אינה חסינה לחלוטין, ואנו ממליצים לא לשלוח מידע רגיש ואישי מדי בטפסים המקוונים.
            </p>
          </section>

          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold text-primary mb-4">6. צור קשר</h2>
            <p>
              לכל שאלה בנושא פרטיות או לבקשה למחיקת מידע מהמאגר שלנו, ניתן לפנות אלינו במייל: 
              <span className="text-secondary font-bold mr-2">privacy@lreiach.com</span>
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}