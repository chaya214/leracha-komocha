// דף תנאי שימוש ודיסקליימר משפטי
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Scale, AlertTriangle, Copyright, HelpCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <main className="pt-32 pb-20 bg-background">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* כותרת הדף */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Scale size={64} className="mx-auto text-secondary mb-4" />
          <h1 className="text-4xl font-bold text-primary mb-4">תנאי שימוש</h1>
          <p className="text-foreground/60">עודכן לאחרונה: אפריל 2026</p>
        </motion.div>

        {/* תוכן התנאים */}
        <div className="space-y-10 text-foreground/80 leading-relaxed">
          
          <section className="bg-white p-8 rounded-2xl shadow-sm border-r-4 border-primary">
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
              <HelpCircle className="text-secondary" size={24} /> 1. הסכמה לתנאים
            </h2>
            <p>
              השימוש באתר "לרעך כמוך" (להלן: "האתר") כפוף להסכמתך לתנאים המפורטים להלן. בעצם הגלישה או השימוש בשירותי האתר, הנך מצהיר כי קראת והבנת את התנאים וכי הנך מסכים להם במלואם.
            </p>
          </section>

          {/* סעיף הבהרה הלכתית - חשוב מאוד! */}
          <section className="bg-amber-50 p-8 rounded-2xl border border-amber-200">
            <h2 className="text-2xl font-bold text-amber-900 mb-4 flex items-center gap-3">
              <AlertTriangle className="text-amber-600" size={24} /> 2. הבהרה הלכתית ואחריות
            </h2>
            <p className="font-medium text-amber-900">
              התכנים המופיעים באתר, לרבות תשובות לשאלות (שו"ת), מאמרים ושיעורים, מובאים למטרת העשרה ולימוד כללי בלבד.
            </p>
            <p className="mt-2 text-amber-800">
              אין לראות בתשובות המפורסמות באתר פסיקה הלכתית סופית למקרה ספציפי. במקרה של ספק הלכתי או שאלה מעשית, יש להתייעץ תמיד עם רב פוסק המכיר את פרטי המקרה מקרוב. בעל האתר וצוות האתר אינם נושאים באחריות לכל פעולה שתינקט על סמך המידע המופיע באתר.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
              <Copyright className="text-secondary" size={24} /> 3. זכויות יוצרים וקניין רוחני
            </h2>
            <p>
              כל הזכויות בתכנים המופיעים באתר, לרבות טקסטים מתוך סדרת הספרים "לרעך כמוך", צילומים, גרפיקה, סרטוני וידאו וקוד האתר, שמורות לבעלים (אלא אם צוין אחרת).
            </p>
            <p className="mt-2 font-bold">
              אין להעתיק, להפיץ, לשדר, למכור או לעשות כל שימוש מסחרי בתכני האתר ללא אישור מפורש בכתב מבעלי הזכויות.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">4. שימוש הוגן באתר</h2>
            <p>
              המשתמש מתחייב לעשות שימוש באתר למטרות חוקיות בלבד ובצורה שאינה פוגעת באתר או בגולשים אחרים. חל איסור מוחלט על שליחת תוכן פוגעני, פרסומי או כזה המפר את פרטיותו של אדם אחר במסגרת שירותי ה"שו"ת".
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">5. שינויים באתר ובתנאים</h2>
            <p>
              אנו שומרים לעצמנו את הזכות להפסיק את פעילות האתר, לשנות את מבנהו או לעדכן את תנאי השימוש בכל עת ללא הודעה מוקדמת. מומלץ להתעדכן בדף זה מעת לעת.
            </p>
          </section>

          <section className="border-t pt-8 text-center">
            <p className="text-sm">
              לבירורים נוספים בנושא תנאי השימוש, ניתן ליצור קשר דרך עמוד <a href="/contact" className="text-secondary font-bold underline">צור קשר</a>.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}