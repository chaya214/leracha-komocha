// רכיב ניווט
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, MessageCircle, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // זיהוי גלילה לשינוי עיצוב
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'דף הבית', href: '/' },
    { name: 'שו"ת הלכתי', href: '/shut' },
    { name: 'הלכה יומית', href: '/halacha' },
    { name: 'שיעורי וידאו', href: '/videos' },
    { name: 'אודות הסדרה', href: '/about' },
  ];

  // צבע הטקסט משתנה לפי מצב הגלילה
  // כשלא גללנו (על הרקע הבורדו) - הטקסט לבן. כשגללנו - הטקסט כהה.
  const textColorClass = scrolled ? 'text-foreground' : 'text-white';
  const logoSecondaryClass = scrolled ? 'text-secondary' : 'text-secondary-light opacity-90';

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-500 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' 
        : 'bg-transparent py-6'
    }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        
        {/* כפתור פעולה - שאל את הרב */}
        <div className="hidden md:flex items-center gap-4">
          <Link 
            href="/ask" 
            className={`${
              scrolled ? 'bg-primary text-white' : 'bg-white text-primary'
            } px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-md`}
          >
            <MessageCircle size={18} />
            שאל את הרב
          </Link>
          <Link href="/cart" className={`${textColorClass} p-2 hover:bg-white/10 rounded-full transition-colors`}>
            <ShoppingCart size={22} />
          </Link>
        </div>

        {/* תפריט ניווט מרכזי (Desktop) */}
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

        {/* לוגו - משנה צבע לפי רקע */}
        <Link href="/" className="flex flex-col items-end group">
          <span className={`text-2xl md:text-3xl font-black tracking-tighter transition-colors ${
            scrolled ? 'text-primary' : 'text-white'
          }`}>
            לרעך <span className="text-secondary">כמוך</span>
          </span>
          <span className={`text-[10px] font-bold leading-none tracking-[0.2em] uppercase ${logoSecondaryClass}`}>
            בין אדם לחברו
          </span>
        </Link>

        {/* כפתור המבורגר (Mobile) */}
        <button 
          className={scrolled ? 'text-primary' : 'text-white'} 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* תפריט מובייל (Mobile Menu) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-100 md:hidden"
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