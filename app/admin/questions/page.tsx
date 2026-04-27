// דף נהיול מענה לשאלות
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, User, MessageSquare, Send, Clock, Trash2, AlertCircle } from "lucide-react";

export default function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = () => {
    setLoading(true);
    fetch('/api/admin/questions')
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        const existingAnswers = data.reduce((acc: any, q: any) => {
          acc[q._id] = q.answerText || "";
          return acc;
        }, {});
        setAnswers(existingAnswers);
      })
      .finally(() => setLoading(false));
  };

  const handleAnswerChange = (id: string, text: string) => {
    setAnswers(prev => ({ ...prev, [id]: text }));
  };

  const handleAnswer = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/questions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          answerText: answers[id], 
          status: 'published'
        })
      });

      if (res.ok) {
        alert("התשובה פורסמה בהצלחה!");
        fetchQuestions(); // רענון רשימה
      }
    } catch (err) {
      alert("שגיאה בשמירה");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("האם אתה בטוח שברצונך למחוק את השאלה לצמיתות?")) return;

    try {
      const res = await fetch(`/api/admin/questions/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setQuestions(questions.filter((q: any) => q._id !== id));
      } else {
        alert("שגיאה במחיקה");
      }
    } catch (err) {
      alert("חלה שגיאה בתקשורת עם השרת");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-32 pb-20 px-6" dir="rtl">
      <div className="container mx-auto max-w-5xl">
        
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-primary mb-2">ניהול שאלות ותשובות</h1>
            <p className="text-foreground/50 italic font-medium">מענה ופרסום לשו"ת הציבורי</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-secondary/10 font-bold text-primary flex items-center gap-2">
            <MessageSquare size={18} className="text-secondary" />
            שאלות במערכת: {questions.length}
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-secondary border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            <AnimatePresence>
              {questions.map((q: any, idx: number) => (
                <motion.div 
                  key={q._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[32px] shadow-sm border border-secondary/10 overflow-hidden group"
                >
                  {/* Header - פרטי השואל + כפתור מחיקה */}
                  <div className="bg-muted/10 p-6 border-b border-muted flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-primary">
                        <User size={18} className="text-secondary" />
                        <span className="font-bold">{q.senderName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-primary/70">
                        <Mail size={18} className="text-secondary" />
                        <a href={`mailto:${q.senderEmail}`} className="text-sm font-medium hover:text-secondary transition-colors border-b border-transparent hover:border-secondary">
                          {q.senderEmail}
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-foreground/40 flex items-center gap-1 font-medium">
                        <Clock size={14} /> {new Date(q.createdAt).toLocaleDateString('he-IL')}
                      </span>
                      {/* כפתור מחיקה */}
                      <button 
                        onClick={() => handleDelete(q._id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                        title="מחק שאלה"
                      >
                        <Trash2 size={20} />
                      </button>
                      <span className={`text-xs font-bold px-4 py-1.5 rounded-full ${
                        q.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {q.status === 'pending' ? 'ממתין' : 'פורסם'}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-8">
                    <div className="mb-8">
                      <h2 className="text-xl font-black text-primary mb-3">נושא: {q.subject}</h2>
                      <div className="bg-slate-50 p-6 rounded-2xl border-r-4 border-secondary/20 text-lg text-foreground/80 leading-relaxed italic">
                        "{q.questionText}"
                      </div>
                    </div>

                    <div className="space-y-4">
                      <textarea 
                        className="w-full p-6 border border-muted rounded-3xl focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all bg-white text-lg min-h-[180px] shadow-inner"
                        placeholder="כתוב את תשובת הרב כאן..."
                        value={answers[q._id]}
                        onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                      />
                      
                      <div className="flex justify-end">
                        <button 
                          onClick={() => handleAnswer(q._id)}
                          className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-lg flex items-center gap-3 hover:bg-primary/95 transition-all shadow-xl hover:translate-y-[-2px] active:translate-y-0"
                        >
                          {q.status === 'published' ? 'עדכן תשובה' : 'פרסם באתר'}
                          <Send size={20} className="rotate-180" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}