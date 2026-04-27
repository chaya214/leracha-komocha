// רכיב ניווט
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, MessageCircle, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // זיהוי גלילה לשינוי עיצוב - סף נמוך יותר לתגובה מהירה
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'דף הבית', href: '/' },
    { name: 'שו"ת', href: '/shut' },
    { name: 'הלכה יומית', href: '/halacha' },
    { name: 'שיעורי וידאו', href: '/videos' },
    { name: 'אודות', href: '/about' },
  ];

  // הגדרת מחלקות עיצוב דינמיות
  // 1. רקע: כשהוא שקוף, הוספנו גרדיאנט כהה עדין מלמעלה כדי להבליט טקסט לבן על רקע בהיר
  const navBgClass = scrolled 
    ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' 
    : 'bg-gradient-to-b from-black/50 to-transparent py-6';

  // 2. טקסט: במצב שקוף הוספנו drop-shadow כדי למנוע "היעלמות" על רקע לבן
  const textColorClass = scrolled 
    ? 'text-primary' 
    : 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]';

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-500 ${navBgClass}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        
        {/* צד שמאל: כפתורי פעולה */}
        <div className="hidden md:flex items-center gap-4">
          <Link 
            href="/ask" 
            className={`px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-md ${
              scrolled ? 'bg-primary text-white' : 'bg-white text-primary'
            }`}
          >
            <MessageCircle size={18} />
            שאל את הרב
          </Link>
          {/* <Link href="/cart" className={`${textColorClass} p-2 hover:bg-white/10 rounded-full transition-colors`}>
            <ShoppingCart size={22} />
          </Link> */}
        </div>

        {/* מרכז: תפריט ניווט (Desktop) */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`${textColorClass} hover:text-secondary font-bold transition-colors relative group`}
            >
              {link.name}
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* צד ימין: לוגו */}
        <Link href="/" className="flex flex-col items-end group">
          <span className={`text-2xl md:text-3xl font-black tracking-tighter transition-colors ${textColorClass}`}>
            לרעך <span className="text-secondary">כמוך</span>
          </span>
          <span className={`text-[10px] font-bold leading-none tracking-[0.2em] uppercase transition-colors ${
            scrolled ? 'text-secondary' : 'text-secondary-light opacity-90'
          }`}>
            בין אדם לחברו
          </span>
        </Link>

        {/* המבורגר (Mobile) */}
        <button 
          className={`md:hidden p-2 ${textColorClass}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* תפריט מובייל (Mobile Menu) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-100 md:hidden overflow-hidden"
          >
            <div className="flex flex-col p-8 gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="text-xl font-bold text-primary border-b border-gray-50 pb-4 flex justify-between items-center"
                >
                  {link.name}
                  <div className="w-2 h-2 bg-secondary rounded-full" />
                </Link>
              ))}
              <Link 
                href="/ask" 
                onClick={() => setIsOpen(false)}
                className="bg-primary text-white text-center py-4 rounded-2xl font-black text-lg shadow-lg"
              >
                שאל את הרב
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;