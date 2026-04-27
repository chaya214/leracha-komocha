// ווידיאו בודד - דף פרטי של שיעור
// app/videos/[id]/page.tsx - דף שיעור בודד
// app/videos/[id]/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Share2, 
  Heart,
  ChevronRight,
  ArrowRight,
  Calendar,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Video {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  category?: string;
  createdAt: string;
}

export default function VideoDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchVideo = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/videos/${id}`);
        
        if (!res.ok) {
          if (res.status === 404) {
            setError('וידאו לא נמצא');
          } else {
            setError('שגיאה בטעינת הוידאו');
          }
          return;
        }

        const data = await res.json();
        setVideo(data);
      } catch (err) {
        console.error('Error fetching video:', err);
        setError('שגיאה בטעינת הוידאו');
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: video?.title,
          text: video?.description,
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

  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?rel=0`;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-40 pb-20 bg-background flex items-center justify-center">
        <div className="text-center">
          <Play size={48} className="mx-auto text-secondary animate-bounce mb-4" />
          <p className="text-foreground/60">טוען שיעור...</p>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen pt-40 pb-20 bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle size={48} className="mx-auto text-primary mb-4" />
          <h2 className="text-2xl font-bold text-primary mb-4">{error || 'וידאו לא נמצא'}</h2>
          <p className="text-foreground/70 mb-8">אם אתה חושב שזה שגיאה, אנא חזור לדף הבית.</p>
          <Link href="/videos" className="bg-primary text-white px-6 py-3 rounded-full font-bold inline-flex items-center gap-2 hover:scale-105 transition-transform">
            חזור לשיעורים <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(video.videoUrl);

  return (
    <main className="pt-32 pb-20 bg-background min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-foreground/60 mb-8"
        >
          <Link href="/videos" className="hover:text-secondary transition-colors">שיעורים</Link>
          <ChevronRight size={16} />
          <span className="text-foreground line-clamp-1">{video.title}</span>
        </motion.div>

        {/* Video Player */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-10"
        >
          {embedUrl ? (
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-xl border border-muted bg-slate-900">
              <iframe
                width="100%"
                height="100%"
                src={embedUrl}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0"
              />
            </div>
          ) : (
            <div className="w-full aspect-video rounded-3xl bg-slate-900 flex items-center justify-center text-white">
              <div className="text-center">
                <Play size={48} className="mx-auto opacity-50 mb-4" />
                <p className="opacity-60">לא ניתן להוצא וידאו</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Title and Meta */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between gap-6 mb-6">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-black text-primary mb-4 leading-tight">
                {video.title}
              </h1>
              <div className="flex items-center gap-4 flex-wrap">
                {video.category && (
                  <span className="px-4 py-2 bg-muted text-primary font-bold rounded-full text-sm">
                    {video.category}
                  </span>
                )}
                {video.createdAt && (
                  <div className="flex items-center gap-2 text-foreground/60 text-sm">
                    <Calendar size={14} />
                    {formatDate(video.createdAt)}
                  </div>
                )}
              </div>
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
        </motion.div>

        {/* Description */}
        {video.description && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-10 shadow-sm border border-muted mb-10"
          >
            <h3 className="text-xl font-bold text-primary mb-4">על השיעור</h3>
            <p className="text-lg text-foreground/80 leading-relaxed whitespace-pre-wrap">
              {video.description}
            </p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4 flex-wrap mb-16"
        >
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
          >
            <Share2 size={18} /> שתף
          </button>
          <Link
            href="/videos"
            className="flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-full font-bold hover:bg-primary/5 transition-colors"
          >
            חזור לרשימה <ChevronRight size={18} />
          </Link>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-3xl p-10 border border-primary/20"
        >
          <h3 className="text-2xl font-bold text-primary mb-4">רוצה עוד שיעורים?</h3>
          <p className="text-foreground/70 mb-6 max-w-xl">
            הירשם לעדכונים ותקבל התראה לשיעורים חדשים בדוא"ל.
          </p>
          <button className="bg-primary text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-lg">
            הרשם לעדכונים
          </button>
        </motion.div>
      </div>
    </main>
  );
}