// // להורדת ווידיאו מ Google Flow
// "use client";

// import { FormEvent, useState } from "react";

// export default function FlowDownloadPage() {
//   const [url, setUrl] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   async function handleDownload(e: FormEvent<HTMLFormElement>) {
//     e.preventDefault();

//     setError("");

//     const cleanUrl = url.trim();

//     if (!cleanUrl) {
//       setError("הדבק קישור שיתוף של Google Flow.");
//       return;
//     }

//     if (
//       !cleanUrl.startsWith(
//         "https://flow.google.com/shared/video/"
//       )
//     ) {
//       setError(
//         "זה לא נראה כמו קישור שיתוף תקין של Google Flow."
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

//       if (!response.ok) {
//         let message = "ההורדה נכשלה.";

//         try {
//           const data = await response.json();

//           if (data?.error) {
//             message = data.error;
//           }
//         } catch {
//           // לא JSON — נשאיר הודעת ברירת מחדל
//         }

//         throw new Error(message);
//       }

//       /*
//        * השרת מחזיר את הווידאו עצמו.
//        */
//       const blob = await response.blob();

//       if (!blob.size) {
//         throw new Error("השרת החזיר קובץ ריק.");
//       }

//       /*
//        * ניסיון לקחת את שם הקובץ
//        * מתוך Content-Disposition.
//        */
//       let filename = "flow-video.mp4";

//       const disposition =
//         response.headers.get("Content-Disposition");

//       if (disposition) {
//         const utf8Match = disposition.match(
//           /filename\*=UTF-8''([^;]+)/i
//         );

//         const normalMatch = disposition.match(
//           /filename="?([^"]+)"?/i
//         );

//         try {
//           if (utf8Match?.[1]) {
//             filename = decodeURIComponent(
//               utf8Match[1]
//             );
//           } else if (normalMatch?.[1]) {
//             filename = normalMatch[1];
//           }
//         } catch {
//           // נשאר עם שם ברירת המחדל
//         }
//       }

//       /*
//        * יצירת הורדה מקומית מה-response
//        * שקיבלנו מהשרת שלנו.
//        */
//       const objectUrl = URL.createObjectURL(blob);

//       const a = document.createElement("a");

//       a.href = objectUrl;
//       a.download = filename;

//       document.body.appendChild(a);
//       a.click();
//       a.remove();

//       setTimeout(() => {
//         URL.revokeObjectURL(objectUrl);
//       }, 10_000);
//     } catch (err: any) {
//       console.error(err);

//       setError(
//         err?.message ||
//           "אירעה שגיאה במהלך הורדת הסרטון."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <main
//       dir="rtl"
//       className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4"
//     >
//       <div className="w-full max-w-2xl">
//         <div className="rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl p-6 sm:p-8">
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
//               הורדת סרטון מ־Flow
//             </h1>

//             <p className="mt-3 text-slate-400 leading-7">
//               הדבק קישור שיתוף של Google Flow והשרת
//               יכין עבורך את הסרטון להורדה.
//             </p>
//           </div>

//           <form
//             onSubmit={handleDownload}
//             className="space-y-4"
//           >
//             <div>
//               <label
//                 htmlFor="flow-url"
//                 className="block text-sm font-medium text-slate-300 mb-2"
//               >
//                 קישור שיתוף
//               </label>

//               <input
//                 id="flow-url"
//                 type="url"
//                 dir="ltr"
//                 value={url}
//                 onChange={(e) => {
//                   setUrl(e.target.value);
//                   setError("");
//                 }}
//                 placeholder="https://flow.google.com/shared/video/..."
//                 disabled={loading}
//                 className="w-full h-14 rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-blue-400/50 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-50"
//               />
//             </div>

//             {error && (
//               <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300 leading-6">
//                 {error}
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={loading || !url.trim()}
//               className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold transition flex items-center justify-center gap-3"
//             >
//               {loading ? (
//                 <>
//                   <span
//                     className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"
//                     aria-hidden="true"
//                   />

//                   <span>
//                     מוריד את הסרטון...
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
//                     הורד סרטון
//                   </span>
//                 </>
//               )}
//             </button>
//           </form>

//           <div className="mt-7 pt-6 border-t border-white/10">
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
//               <div>
//                 <div className="text-sm font-semibold text-slate-200">
//                   1. הדבק
//                 </div>
//                 <div className="text-xs text-slate-500 mt-1">
//                   קישור שיתוף
//                 </div>
//               </div>

//               <div>
//                 <div className="text-sm font-semibold text-slate-200">
//                   2. עיבוד
//                 </div>
//                 <div className="text-xs text-slate-500 mt-1">
//                   דרך השרת
//                 </div>
//               </div>

//               <div>
//                 <div className="text-sm font-semibold text-slate-200">
//                   3. הורד
//                 </div>
//                 <div className="text-xs text-slate-500 mt-1">
//                   קובץ הווידאו
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

    const isShareUrl =
      url.protocol === "https:" &&
      (url.hostname === "flow.google.com" ||
        url.hostname === "www.flow.google.com") &&
      url.pathname.startsWith("/shared/video/");

    const isDirectVideoUrl =
      url.protocol === "https:" &&
      url.hostname === "flow-content.google" &&
      url.pathname.startsWith("/video/");

    return isShareUrl || isDirectVideoUrl;
  } catch {
    return false;
  }
}

function getInputType(value: string): "share" | "direct" | null {
  try {
    const url = new URL(value);

    if (
      (url.hostname === "flow.google.com" ||
        url.hostname === "www.flow.google.com") &&
      url.pathname.startsWith("/shared/video/")
    ) {
      return "share";
    }

    if (
      url.hostname === "flow-content.google" &&
      url.pathname.startsWith("/video/")
    ) {
      return "direct";
    }

    return null;
  } catch {
    return null;
  }
}

export default function FlowDownloadPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputType = getInputType(url.trim());

  async function handleDownload(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");

    const cleanUrl = url.trim();

    if (!cleanUrl) {
      setError("הדבק קישור של Google Flow.");
      return;
    }

    if (!isSupportedUrl(cleanUrl)) {
      setError(
        "הקישור אינו נתמך. אפשר להדביק קישור שיתוף של Flow או קישור ישיר של flow-content.google."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/flow-download",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            url: cleanUrl,
          }),
        }
      );

      if (!response.ok) {
        let message = "ההורדה נכשלה.";

        try {
          const data = await response.json();

          if (data?.error) {
            message = data.error;
          }
        } catch {
          // לא JSON
        }

        throw new Error(message);
      }

      /*
       * השרת מחזיר את קובץ הווידאו.
       */
      const blob = await response.blob();

      if (!blob.size) {
        throw new Error(
          "השרת החזיר קובץ ריק."
        );
      }

      /*
       * מנסים לקבל את שם הקובץ
       * מהשרת.
       */
      let filename = "flow-video.mp4";

      const disposition =
        response.headers.get(
          "Content-Disposition"
        );

      if (disposition) {
        const utf8Match =
          disposition.match(
            /filename\*=UTF-8''([^;]+)/i
          );

        const normalMatch =
          disposition.match(
            /filename="?([^"]+)"?/i
          );

        try {
          if (utf8Match?.[1]) {
            filename = decodeURIComponent(
              utf8Match[1]
            );
          } else if (normalMatch?.[1]) {
            filename = normalMatch[1];
          }
        } catch {
          filename = "flow-video.mp4";
        }
      }

      /*
       * יוצרים הורדה מהקובץ שקיבלנו
       * מהשרת שלנו.
       */
      const objectUrl =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = objectUrl;
      link.download = filename;

      document.body.appendChild(link);

      link.click();

      link.remove();

      setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 10_000);
    } catch (err: any) {
      console.error(
        "Flow download error:",
        err
      );

      setError(
        err?.message ||
          "אירעה שגיאה במהלך הורדת הסרטון."
      );
    } finally {
      setLoading(false);
    }
  }

  function clearInput() {
    setUrl("");
    setError("");
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
              הורדת סרטון מ־Flow
            </h1>

            <p className="mt-3 text-slate-400 leading-7">
              הדבק קישור שיתוף של Flow או קישור
              ישיר לסרטון והורד אותו דרך האתר.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleDownload}
            className="space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="flow-url"
                  className="block text-sm font-medium text-slate-300"
                >
                  קישור הסרטון
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
                  id="flow-url"
                  type="url"
                  dir="ltr"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setError("");
                  }}
                  placeholder="https://flow.google.com/shared/video/..."
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
                      : "• קישור ישיר לסרטון"}
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
                    מוריד את הסרטון...
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
                    הורד סרטון
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Supported links */}
          <div className="mt-8 grid gap-3">
            <div className="rounded-2xl border border-white/5 bg-black/10 p-4">
              <div className="text-xs font-medium text-slate-400 mb-2">
                קישור שיתוף
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
                קישור ישיר
              </div>

              <div
                dir="ltr"
                className="text-xs text-slate-500 break-all"
              >
                https://flow-content.google/video/...?Expires=...&amp;Signature=...
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
                  קישור Flow
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-slate-200">
                  2. עיבוד
                </div>

                <div className="text-xs text-slate-500 mt-1">
                  דרך השרת
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-slate-200">
                  3. הורד
                </div>

                <div className="text-xs text-slate-500 mt-1">
                  קובץ הווידאו
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}