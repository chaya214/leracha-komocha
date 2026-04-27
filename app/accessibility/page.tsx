// הצהרת נגישות
"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Accessibility, CheckCircle2, Phone, Mail, AlertCircle } from 'lucide-react';

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white shadow-sm border border-purple-100 rounded-[3rem] overflow-hidden"
      >
        {/* Header Section */}
        <div className="bg-purple-900 p-12 text-center text-white">
          <div className="inline-block p-4 bg-white/10 rounded-2xl mb-4">
            <Accessibility size={40} />
          </div>
          <h1 className="text-4xl font-bold mb-4">הצהרת נגישות</h1>
          <p className="text-purple-100 opacity-90 max-w-2xl mx-auto leading-relaxed">
            אני בשרה לוין מאמינה שכל אמא ראויה לגישה נוחה ופשוטה למידע מקצועי. 
            אני משקיעה מאמצים רבים כדי להפוך את האתר לנגיש וידידותי עבור כולם.
          </p>
        </div>

        <div className="p-8 md:p-12 space-y-12">
          
          {/* Status Section */}
          <section className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-purple-900 mb-4">סטטוס נגישות</h2>
              <p className="text-slate-600 leading-relaxed">
                האתר עומד בדרישות תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התש"ע-2013, 
                ומותאם להמלצות התקן הישראלי (ת"י 5568) לנגישות תכנים באינטרנט ברמת <strong>AA</strong>.
              </p>
            </div>
            <div className="w-full md:w-auto bg-green-50 border border-green-100 p-6 rounded-3xl flex items-center gap-4">
              <CheckCircle2 className="text-green-600" size={32} />
              <span className="text-green-800 font-bold">האתר נבדק <br/>ונמצא נגיש</span>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Features Grid */}
          <section>
            <h2 className="text-2xl font-bold text-purple-900 mb-6">התאמות שבוצעו באתר</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "תמיכה מלאה בכל הדפדפנים המודרניים",
                "ניווט מלא באמצעות המקלדת (Tab)",
                "התאמה למסכים קטנים (רספונסיביות)",
                "שימוש בצבעים עם ניגודיות גבוהה",
                "היררכיית כותרות מסודרת לקוראי מסך",
                "טקסט חלופי (Alt) לכל התמונות"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="w-2 h-2 bg-purple-400 rounded-full" />
                  <span className="text-slate-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-purple-50 rounded-[2rem] p-8 md:p-10 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="text-purple-600" size={28} />
                <h2 className="text-2xl font-bold text-purple-900">נתקלת בבעיה?</h2>
              </div>
              <p className="text-slate-700 mb-8 max-w-2xl">
                למרות מאמציי להנגיש את כלל הדפים באתר, ייתכן שיתגלו חלקים שטרם הונגשו במלואם. 
                אם מצאת תקלה או שיש לך הצעה לשיפור, אשמח מאוד לשמוע ממך.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm">
                  <div className="bg-purple-100 p-2 rounded-xl text-purple-600">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">טלפון</p>
                    <p className="font-bold text-slate-800">058-7633059</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm">
                  <div className="bg-purple-100 p-2 rounded-xl text-purple-600">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">אימייל</p>
                    <p className="font-bold text-slate-800">sara@levin.com</p>
                  </div>
                </div>
              </div>
              
              <p className="mt-8 text-sm text-slate-500 italic">
                הצהרה זו עודכנה לאחרונה בתאריך: מרץ 2024.
              </p>
            </div>
            
            {/* Background Decoration */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-100 rounded-full opacity-50 blur-3xl" />
          </section>
        </div>
      </motion.div>
    </div>
  );
}