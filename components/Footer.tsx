// פוטר (סרגל תחתון)
"use client";

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, Facebook, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* עמודה 1: אודות בקצר */}
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-bold text-secondary italic">לרעך כמוך</h3>
            <p className="text-white/80 leading-relaxed">
              המרכז העולמי להפצת הלכות בין אדם לחברו. 
              סדרת הספרים ששינתה את פני לימוד ההלכה בדורנו.
            </p>
          </div>

          {/* עמודה 2: קישורים מהירים */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-white/10 pb-2">ניווט מהיר</h4>
            <ul className="space-y-3">
              <li><Link href="/shut" className="text-white/70 hover:text-secondary transition-colors">שו"ת הלכתי</Link></li>
              <li><Link href="/halacha" className="text-white/70 hover:text-secondary transition-colors">הלכה יומית</Link></li>
              <li><Link href="/videos" className="text-white/70 hover:text-secondary transition-colors">שיעורי וידאו</Link></li>
              {/* <li><Link href="/store" className="text-white/70 hover:text-secondary transition-colors">חנות ספרים</Link></li> */}
              <li><Link href="/about" className="text-white/70 hover:text-secondary transition-colors">אודות הסדרה</Link></li>
              {/* <li><Link href="/privacy" className="text-white/70 hover:text-secondary transition-colors">מדיניות פרטיות</Link></li>
              <li><Link href="/terms" className="text-white/70 hover:text-secondary transition-colors">תנאי שימוש</Link></li> */}
            </ul>
          </div>

          {/* עמודה 3: צור קשר */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-white/10 pb-2">צור קשר</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-white/70">
                <Mail size={18} className="text-secondary" />
                <span>office@lreiach.com</span>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Phone size={18} className="text-secondary" />
                <span>02-1234567</span>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <MapPin size={18} className="text-secondary" />
                <span>ירושלים, ישראל</span>
              </li>
            </ul>
          </div>

          {/* עמודה 4: הרשמה לניוזלטר */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-white/10 pb-2">הלכה יומית במייל</h4>
            <p className="text-sm text-white/70 mb-4">הצטרפו לאלפי מנויים וקבלו הלכה יומית קצרה.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="האימייל שלך" 
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-secondary transition-colors"
              />
              <button className="bg-secondary text-primary p-2 rounded-lg hover:bg-secondary/90 transition-colors">
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* שורת זכויות יוצרים */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
          <p>© {currentYear} לרעך כמוך. כל הזכויות שמורות.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-white transition-colors">תנאי שימוש</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">מדיניות פרטיות</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;