// // להורדת ווידיאו מ Google Flow
// "use client";

// import { FormEvent, useState } from "react";

// function isSupportedUrl(value: string): boolean {
//   try {
//     const url = new URL(value);

//     const isShareUrl =
//       url.protocol === "https:" &&
//       (url.hostname === "flow.google.com" ||
//         url.hostname === "www.flow.google.com") &&
//       url.pathname.startsWith("/shared/video/");

//     const isDirectVideoUrl =
//       url.protocol === "https:" &&
//       url.hostname === "flow-content.google" &&
//       url.pathname.startsWith("/video/");

//     return isShareUrl || isDirectVideoUrl;
//   } catch {
//     return false;
//   }
// }

// function getInputType(value: string): "share" | "direct" | null {
//   try {
//     const url = new URL(value);

//     if (
//       (url.hostname === "flow.google.com" ||
//         url.hostname === "www.flow.google.com") &&
//       url.pathname.startsWith("/shared/video/")
//     ) {
//       return "share";
//     }

//     if (
//       url.hostname === "flow-content.google" &&
//       url.pathname.startsWith("/video/")
//     ) {
//       return "direct";
//     }

//     return null;
//   } catch {
//     return null;
//   }
// }

// export default function FlowDownloadPage() {
//   const [url, setUrl] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [successData, setSuccessData] = useState<{
//     driveLink: string;
//     message: string;
//   } | null>(null);

//   const inputType = getInputType(url.trim());

//   async function handleDownload(e: FormEvent<HTMLFormElement>) {
//     e.preventDefault();

//     setError("");
//     setSuccessData(null);

//     const cleanUrl = url.trim();

//     if (!cleanUrl) {
//       setError("הדבק קישור של Google Flow.");
//       return;
//     }

//     if (!isSupportedUrl(cleanUrl)) {
//       setError(
//         "הקישור אינו נתמך. אפשר להדביק קישור שיתוף של Flow או קישור ישיר של flow-content.google."
//       );
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch("/api/flow-download", {
//         method: "POST",

//         headers: {
//           "Content-Type": "application/json",
//         },

//         body: JSON.stringify({
//           url: cleanUrl,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok || !data.success) {
//         throw new Error(data?.error || "העברת הקובץ לדרייב נכשלה.");
//       }

//       setSuccessData({
//         driveLink: data.driveLink,
//         message: data.message || "הקובץ הועבר בהצלחה לגוגל דרייב!",
//       });
//     } catch (err: any) {
//       console.error("Flow drive upload error:", err);

//       setError(
//         err?.message || "אירעה שגיאה במהלך העברת הסרטון לדרייב."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   function clearInput() {
//     setUrl("");
//     setError("");
//     setSuccessData(null);
//   }

//   return (
//     <main
//       dir="rtl"
//       className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-10"
//     >
//       <div className="w-full max-w-2xl">
//         <div className="rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl p-6 sm:p-8">
//           {/* Header */}
//           <div className="mb-8 text-center">
//             <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-400/20 mb-5">
//               <svg
//                 width="30"
//                 height="30"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="1.8"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path d="M12 3v12" />
//                 <path d="m7 10 5 5 5-5" />
//                 <path d="M5 21h14" />
//               </svg>
//             </div>

//             <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
//               העברת סרטון מ־Flow לגוגל דרייב
//             </h1>

//             <p className="mt-3 text-slate-400 leading-7">
//               הדבק קישור שיתוף של Flow או קישור ישיר לסרטון והעבר אותו ישירות לחשבון גוגל דרייב שלך.
//             </p>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleDownload} className="space-y-4">
//             <div>
//               <div className="flex items-center justify-between mb-2">
//                 <label
//                   htmlFor="flow-url"
//                   className="block text-sm font-medium text-slate-300"
//                 >
//                   קישור הסרטון
//                 </label>

//                 {url && !loading && (
//                   <button
//                     type="button"
//                     onClick={clearInput}
//                     className="text-xs text-slate-500 hover:text-slate-300 transition"
//                   >
//                     נקה
//                   </button>
//                 )}
//               </div>

//               <div className="relative">
//                 <input
//                   id="flow-url"
//                   type="url"
//                   dir="ltr"
//                   value={url}
//                   onChange={(e) => {
//                     setUrl(e.target.value);
//                     setError("");
//                     setSuccessData(null);
//                   }}
//                   placeholder="https://flow.google.com/shared/video/..."
//                   disabled={loading}
//                   autoComplete="off"
//                   spellCheck={false}
//                   className="w-full h-14 rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-blue-400/50 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-50"
//                 />
//               </div>
//             </div>

//             {/* זיהוי סוג הקישור */}
//             {inputType && (
//               <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/5 px-4 py-3">
//                 <div className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-400" />

//                 <div className="text-sm">
//                   <span className="text-emerald-300 font-medium">
//                     קישור תקין
//                   </span>

//                   <span className="text-slate-500 mr-2">
//                     {inputType === "share"
//                       ? "• קישור שיתוף של Flow"
//                       : "• קישור ישיר לסרטון"}
//                   </span>
//                 </div>
//               </div>
//             )}

//             {/* Error */}
//             {error && (
//               <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300 leading-6">
//                 {error}
//               </div>
//             )}

//             {/* Success Card */}
//             {successData && (
//               <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center space-y-3">
//                 <p className="text-emerald-300 font-medium text-sm">
//                   {successData.message}
//                 </p>

//                 {successData.driveLink && (
//                   <a
//                     href={successData.driveLink}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition shadow-lg"
//                   >
//                     <span>פתח את הסרטון בגוגל דרייב</span>
//                     <svg
//                       width="16"
//                       height="16"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
//                       <polyline points="15 3 21 3 21 9" />
//                       <line x1="10" y1="14" x2="21" y2="3" />
//                     </svg>
//                   </a>
//                 )}
//               </div>
//             )}

//             {/* Button */}
//             <button
//               type="submit"
//               disabled={
//                 loading ||
//                 !url.trim() ||
//                 !inputType
//               }
//               className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold transition flex items-center justify-center gap-3"
//             >
//               {loading ? (
//                 <>
//                   <span
//                     className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"
//                     aria-hidden="true"
//                   />

//                   <span>
//                     מעביר את הסרטון לגוגל דרייב...
//                   </span>
//                 </>
//               ) : (
//                 <>
//                   <svg
//                     width="21"
//                     height="21"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <path d="M12 3v12" />
//                     <path d="m7 10 5 5 5-5" />
//                     <path d="M5 21h14" />
//                   </svg>

//                   <span>
//                     העבר לגוגל דרייב
//                   </span>
//                 </>
//               )}
//             </button>
//           </form>

//           {/* Supported links */}
//           <div className="mt-8 grid gap-3">
//             <div className="rounded-2xl border border-white/5 bg-black/10 p-4">
//               <div className="text-xs font-medium text-slate-400 mb-2">
//                 קישור שיתוף
//               </div>

//               <div
//                 dir="ltr"
//                 className="text-xs text-slate-500 break-all"
//               >
//                 https://flow.google.com/shared/video/...
//               </div>
//             </div>

//             <div className="rounded-2xl border border-white/5 bg-black/10 p-4">
//               <div className="text-xs font-medium text-slate-400 mb-2">
//                 קישור ישיר
//               </div>

//               <div
//                 dir="ltr"
//                 className="text-xs text-slate-500 break-all"
//               >
//                 https://flow-content.google/video/...?Expires=...&amp;Signature=...
//               </div>
//             </div>
//           </div>

//           {/* Steps */}
//           <div className="mt-7 pt-6 border-t border-white/10">
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
//               <div>
//                 <div className="text-sm font-semibold text-slate-200">
//                   1. הדבק
//                 </div>

//                 <div className="text-xs text-slate-500 mt-1">
//                   קישור Flow
//                 </div>
//               </div>

//               <div>
//                 <div className="text-sm font-semibold text-slate-200">
//                   2. עיבוד
//                 </div>

//                 <div className="text-xs text-slate-500 mt-1">
//                   העלאה לדרייב
//                 </div>
//               </div>

//               <div>
//                 <div className="text-sm font-semibold text-slate-200">
//                   3. צפה
//                 </div>

//                 <div className="text-xs text-slate-500 mt-1">
//                   בגוגל דרייב
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }
"use client";

import { FormEvent, useState } from "react";

function isSupportedUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function getInputType(value: string): "share" | "direct" | null {
  try {
    const url = new URL(value);

    // זיהוי קישור שיתוף ייחודי של Google Flow
    if (
      (url.hostname === "flow.google.com" ||
        url.hostname === "www.flow.google.com") &&
      url.pathname.startsWith("/shared/video/")
    ) {
      return "share";
    }

    // כל קישור תקין אחר נחשב כקישור ישיר למדיה (Kling, Leonardo, Flow CDN וכד')
    if (url.protocol === "http:" || url.protocol === "https:") {
      return "direct";
    }

    return null;
  } catch {
    return null;
  }
}

export default function MediaDownloadPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState<{
    driveLink: string;
    message: string;
  } | null>(null);

  const inputType = getInputType(url.trim());

  async function handleDownload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccessData(null);

    const cleanUrl = url.trim();

    if (!cleanUrl) {
      setError("אנא הדבק קישור למדיה.");
      return;
    }

    if (!isSupportedUrl(cleanUrl)) {
      setError("הקישור אינו תקין. יש להזין כתובת אינטרנט מלאה (HTTP/HTTPS).");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/flow-download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: cleanUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.error || "העברת הקובץ לדרייב נכשלה.");
      }

      setSuccessData({
        driveLink: data.driveLink,
        message: data.message || "הקובץ הועבר בהצלחה לגוגל דרייב!",
      });
    } catch (err: any) {
      console.error("Drive upload error:", err);

      setError(
        err?.message || "אירעה שגיאה במהלך העברת הקובץ לדרייב."
      );
    } finally {
      setLoading(false);
    }
  }

  function clearInput() {
    setUrl("");
    setError("");
    setSuccessData(null);
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-10"
    >
      <div className="w-full max-w-2xl">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl p-6 sm:p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-400/20 mb-5">
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v12" />
                <path d="m7 10 5 5 5-5" />
                <path d="M5 21h14" />
              </svg>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              העברת מדיה לגוגל דרייב
            </h1>

            <p className="mt-3 text-slate-400 leading-7">
              הדבק קישור שיתוף או קישור ישיר לקובץ (מאתרים כמו Kling, Leonardo, Flow ועוד) והעבר אותו ישירות לחשבון הדרייב שלך.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleDownload} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="media-url"
                  className="block text-sm font-medium text-slate-300"
                >
                  קישור הקובץ
                </label>

                {url && !loading && (
                  <button
                    type="button"
                    onClick={clearInput}
                    className="text-xs text-slate-500 hover:text-slate-300 transition"
                  >
                    נקה
                  </button>
                )}
              </div>

              <div className="relative">
                <input
                  id="media-url"
                  type="url"
                  dir="ltr"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setError("");
                    setSuccessData(null);
                  }}
                  placeholder="https://..."
                  disabled={loading}
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full h-14 rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-blue-400/50 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-50"
                />
              </div>
            </div>

            {/* זיהוי סוג הקישור */}
            {inputType && (
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/5 px-4 py-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-400" />

                <div className="text-sm">
                  <span className="text-emerald-300 font-medium">
                    קישור תקין
                  </span>

                  <span className="text-slate-500 mr-2">
                    {inputType === "share"
                      ? "• קישור שיתוף של Flow"
                      : "• קישור ישיר למדיה"}
                  </span>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300 leading-6">
                {error}
              </div>
            )}

            {/* Success Card */}
            {successData && (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center space-y-3">
                <p className="text-emerald-300 font-medium text-sm">
                  {successData.message}
                </p>

                {successData.driveLink && (
                  <a
                    href={successData.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition shadow-lg"
                  >
                    <span>פתח את הקובץ בגוגל דרייב</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                )}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={
                loading ||
                !url.trim() ||
                !inputType
              }
              className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold transition flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <span
                    className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"
                    aria-hidden="true"
                  />

                  <span>
                    מעביר את הקובץ לגוגל דרייב...
                  </span>
                </>
              ) : (
                <>
                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3v12" />
                    <path d="m7 10 5 5 5-5" />
                    <path d="M5 21h14" />
                  </svg>

                  <span>
                    העבר לגוגל דרייב
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Supported links */}
          <div className="mt-8 grid gap-3">
            <div className="rounded-2xl border border-white/5 bg-black/10 p-4">
              <div className="text-xs font-medium text-slate-400 mb-2">
                קישור שיתוף (Google Flow)
              </div>

              <div
                dir="ltr"
                className="text-xs text-slate-500 break-all"
              >
                https://flow.google.com/shared/video/...
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-black/10 p-4">
              <div className="text-xs font-medium text-slate-400 mb-2">
                קישורים ישירים (Kling, Leonardo, CDN וכד')
              </div>

              <div
                dir="ltr"
                className="text-xs text-slate-500 break-all"
              >
                https://s16-kling.klingai.com/... / https://flow-content.google/...
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="mt-7 pt-6 border-t border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm font-semibold text-slate-200">
                  1. הדבק
                </div>

                <div className="text-xs text-slate-500 mt-1">
                  קישור למדיה
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-slate-200">
                  2. עיבוד
                </div>

                <div className="text-xs text-slate-500 mt-1">
                  העלאה לדרייב
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-slate-200">
                  3. צפה
                </div>

                <div className="text-xs text-slate-500 mt-1">
                  בגוגל דרייב
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}