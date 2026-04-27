// app/halacha/[id]/page.tsx - דף הלכה בודדת
// app/halacha/[id]/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Calendar, 
  Share2, 
  Heart, 
  ChevronRight,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

interface DailyHalacha {
  _id: string;
  title: string;
  content: string;
  source?: string;
  dateFor: string;
  createdAt: string;
}

export default function HalachaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [halacha, setHalacha] = useState<DailyHalacha | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchHalacha = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/halacha/${id}`);
        
        if (!res.ok) {
          if (res.status === 404) {
            setError('הלכה לא נמצאה');
          } else {
            setError('שגיאה בטעינת ההלכה');
          }
          return;
        }

        const data = await res.json();
        setHalacha(data);
      } catch (err) {
        console.error('Error fetching halacha:', err);
        setError('שגיאה בטעינת ההלכה');
      } finally {
        setLoading(false);
      }
    };

    fetchHalacha();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: halacha?.title,
          text: halacha?.content.substring(0, 100),
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('הקישור הועתק ללוח');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-40 pb-20 bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen size={48} className="mx-auto text-secondary animate-bounce mb-4" />
          <p className="text-foreground/60">טוען הלכה...</p>
        </div>
      </div>
    );
  }

  if (error || !halacha) {
    return (
      <div className="min-h-screen pt-40 pb-20 bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle size={48} className="mx-auto text-primary mb-4" />
          <h2 className="text-2xl font-bold text-primary mb-4">{error || 'הלכה לא נמצאה'}</h2>
          <p className="text-foreground/70 mb-8">אם אתה חושב שזה שגיאה, אנא חזור לדף הבית.</p>
          <Link href="/halacha" className="bg-primary text-white px-6 py-3 rounded-full font-bold inline-flex items-center gap-2 hover:scale-105 transition-transform">
            חזור להלכה יומית <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="pt-32 pb-20 bg-background min-h-screen">
      <div className="container mx-auto px-6 max-w-3xl">
        
        {/* Navigation Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-foreground/60 mb-8"
        >
          <Link href="/halacha" className="hover:text-secondary transition-colors">הלכה יומית</Link>
          <ChevronRight size={16} />
          <span className="text-foreground">{halacha.title}</span>
        </motion.div>

        {/* Header */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-10"
        >
          <div className="flex items-start justify-between gap-6 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-secondary mb-4 font-bold text-sm">
                <Calendar size={16} />
                {formatDate(halacha.dateFor)}
              </div>
              <h1 className="text-5xl font-black text-primary mb-4 leading-tight">
                {halacha.title}
              </h1>
            </div>
            <button
              onClick={() => setLiked(!liked)}
              className="p-4 rounded-full bg-muted hover:bg-secondary/20 transition-colors flex-shrink-0"
            >
              <Heart
                size={24}
                className={`transition-all ${
                  liked ? 'fill-primary text-primary' : 'text-foreground/50'
                }`}
              />
            </button>
          </div>

          {/* Meta Info */}
          {halacha.source && (
            <p className="text-foreground/60 italic text-sm border-r-4 border-secondary pr-4">
              מקור: {halacha.source}
            </p>
          )}
        </motion.div>

        {/* Main Content */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-10 md:p-14 shadow-sm border border-muted mb-10"
        >
          <div className="text-xl leading-relaxed text-foreground/90 whitespace-pre-wrap">
            {halacha.content}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-4 flex-wrap mb-16"
        >
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
          >
            <Share2 size={18} /> שתף
          </button>
          <Link
            href="/halacha"
            className="flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-full font-bold hover:bg-primary/5 transition-colors"
          >
            חזור לרשימה <ChevronRight size={18} />
          </Link>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-3xl p-10 border border-primary/20"
        >
          <h3 className="text-2xl font-bold text-primary mb-4">רוצה עוד?</h3>
          <p className="text-foreground/70 mb-6 max-w-xl">
            הירשם לקבלת הלכה יומית בדוא"ל או בוואטסאפ - הלכות חדשות בכל בוקר.
          </p>
          <div className="flex gap-4 flex-wrap">
            <button className="bg-primary text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform">
              הרשם לדוא"ל
            </button>
            <button className="bg-green-500 text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform">
              הרשם לוואטסאפ
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}