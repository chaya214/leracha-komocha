// app/admin/halacha/new/page.tsx - דף הוספת הלכה חדשה (וגם ניתן לעשות עריכה)
// app/admin/halacha/[id]/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, Save, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

interface DailyHalacha {
  _id?: string;
  title: string;
  content: string;
  source?: string;
  dateFor: string;
}

export default function HalachaFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const isEditing = id && id !== 'new';

  const [formData, setFormData] = useState<DailyHalacha>({
    title: '',
    content: '',
    source: '',
    dateFor: new Date().toISOString().split('T')[0]
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing && id) {
      fetchHalacha();
    }
  }, [id, isEditing]);

  const fetchHalacha = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/halacha/${id}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setFormData({
        ...data,
        dateFor: new Date(data.dateFor).toISOString().split('T')[0]
      });
    } catch (err) {
      setError('שגיאה בטעינת ההלכה');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = isEditing ? `/api/halacha/${id}` : '/api/halacha';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          dateFor: new Date(formData.dateFor).toISOString()
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'שגיאה בשמירה');
      }

      router.push('/admin/halacha');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בשמירת ההלכה');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="min-h-screen pt-40 pb-20 bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">טוען...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-3xl">
        
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-4 mb-8"
        >
          <BookOpen size={32} className="text-primary" />
          <h1 className="text-4xl font-black text-slate-800">
            {isEditing ? 'עריכת הלכה' : 'הוספת הלכה יומית'}
          </h1>
        </motion.div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-slate-600 mb-8">
          <Link href="/admin/halacha" className="hover:text-primary transition-colors">
            ניהול הלכה יומית
          </Link>
          <ArrowRight size={16} />
          <span className="text-slate-800">{isEditing ? 'עריכה' : 'הוספה חדשה'}</span>
        </div>

        {/* Form */}
        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-10 shadow-sm border border-slate-100"
        >
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Title Field */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-slate-700 mb-3">כותרת ההלכה</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="למשל: הלכות גזל וגניבה"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          {/* Date Field */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-slate-700 mb-3">לאיזה תאריך?</label>
            <input
              type="date"
              required
              value={formData.dateFor}
              onChange={(e) => setFormData({ ...formData, dateFor: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
            <p className="text-xs text-slate-500 mt-2">כל תאריך יכול להיות רק עם הלכה אחת</p>
          </div>

          {/* Content Field */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-slate-700 mb-3">תוכן ההלכה</label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="כתבו כאן את ההלכה בפירוט..."
              rows={12}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-vertical"
            />
          </div>

          {/* Source Field */}
          <div className="mb-10">
            <label className="block text-sm font-bold text-slate-700 mb-3">מקור (אופציונלי)</label>
            <input
              type="text"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              placeholder="למשל: לרעך כמוך, כרך ט"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-primary text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg"
            >
              <Save size={20} />
              {saving ? 'שומר...' : isEditing ? 'עדכן' : 'הוסף'}
            </button>
            <Link
              href="/admin/halacha"
              className="flex-1 border border-slate-300 py-3 rounded-lg font-bold text-center hover:bg-slate-50 transition-colors"
            >
              ביטול
            </Link>
          </div>
        </motion.form>

        {/* Info Box */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-10 p-6 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <h4 className="font-bold text-blue-900 mb-2">💡 טיפ</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• הלכה יומית מוצגת בעמוד הבית ותצוגה ציבורית</li>
            <li>• אתה יכול להציג הלכה לתאריך עתידי</li>
            <li>• כל תאריך יכול להיות רק עם הלכה אחת בלבד</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}