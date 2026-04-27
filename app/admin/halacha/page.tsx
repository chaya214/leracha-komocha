// app/admin/halacha/page.tsx - דף ניהול הלכה יומית (רשימה)
// app/admin/halacha/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  Search,
  Eye
} from 'lucide-react';
import Link from 'next/link';

interface DailyHalacha {
  _id: string;
  title: string;
  content: string;
  source?: string;
  dateFor: string;
  createdAt: string;
}

export default function AdminHalachaPage() {
  const [halachas, setHalachas] = useState<DailyHalacha[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchHalachas();
  }, []);

  const fetchHalachas = async () => {
    try {
      const res = await fetch('/api/halacha');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setHalachas(data);
    } catch (err) {
      console.error('Error fetching halachas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/halacha/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setHalachas(halachas.filter(h => h._id !== id));
        setDeleteConfirm(null);
      }
    } catch (err) {
      console.error('Error deleting halacha:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  };

  const filteredHalachas = halachas.filter(h =>
    h.title.toLowerCase().includes(search.toLowerCase()) || 
    h.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-10 border-b pb-8 border-slate-200">
          <div>
            <h1 className="text-4xl font-black text-primary mb-2 flex items-center gap-3">
              <BookOpen size={40} />
              ניהול הלכה יומית
            </h1>
            <p className="text-slate-500 text-lg">סה"כ {halachas.length} הלכות</p>
          </div>
          <Link
            href="/admin/halacha/new"
            className="bg-primary text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-lg"
          >
            <Plus size={20} /> הוספה חדשה
          </Link>
        </div>

        {/* Search */}
        <div className="mb-8 relative">
          <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="חיפוש בכותרות או תוכן..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <BookOpen size={40} className="mx-auto text-secondary animate-spin mb-4" />
            <p className="text-slate-500">טוען הלכות...</p>
          </div>
        )}

        {/* Table */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100"
          >
            {filteredHalachas.length > 0 ? (
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-bold text-slate-700">כותרת</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-slate-700">תאריך</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-slate-700">מקור</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-slate-700">פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHalachas.map((halacha, idx) => (
                    <motion.tr
                      key={halacha._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-slate-800">{halacha.title}</p>
                          <p className="text-sm text-slate-500 line-clamp-1">
                            {halacha.content.substring(0, 60)}...
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar size={14} />
                          {formatDate(halacha.dateFor)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {halacha.source ? halacha.source : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/halacha/${halacha._id}`}
                            className="p-2 hover:bg-green-100 rounded-lg text-green-600 transition-colors"
                            title="צפה"
                          >
                            <Eye size={18} />
                          </Link>
                          <Link
                            href={`/admin/halacha/${halacha._id}`}
                            className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                            title="ערוך"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => setDeleteConfirm(halacha._id)}
                            className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                            title="מחק"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-20">
                <BookOpen size={40} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 text-lg">
                  {search ? 'לא נמצאו תוצאות' : 'אין הלכות עדיין'}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full"
            >
              <h3 className="text-xl font-bold text-slate-800 mb-4">האם אתה בטוח?</h3>
              <p className="text-slate-600 mb-8">פעולה זו תמחק את ההלכה לצמיתות.</p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 transition-colors"
                >
                  מחיקה
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 border border-slate-300 py-2 rounded-lg font-bold hover:bg-slate-50 transition-colors"
                >
                  ביטול
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}