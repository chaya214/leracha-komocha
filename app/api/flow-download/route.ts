// // להורדת ווידיאו מ Google Flow
// import { NextRequest, NextResponse } from "next/server";

// export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

// const FLOW_HOSTS = new Set([
//   "flow.google.com",
//   "www.flow.google.com",
// ]);

// const VIDEO_HOSTS = new Set([
//   "flow-content.google",
// ]);

// const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB
// const PAGE_TIMEOUT = 50_000;
// const DOWNLOAD_TIMEOUT = 220_000;

// function isAllowedFlowUrl(url: URL) {
//   return (
//     url.protocol === "https:" &&
//     FLOW_HOSTS.has(url.hostname.toLowerCase()) &&
//     url.pathname.startsWith("/shared/video/")
//   );
// }

// function isAllowedVideoUrl(url: URL) {
//   return (
//     url.protocol === "https:" &&
//     VIDEO_HOSTS.has(url.hostname.toLowerCase()) &&
//     url.pathname.startsWith("/video/")
//   );
// }

// function extractVideoUrls(html: string): string[] {
//   const candidates = new Set<string>();

//   /*
//    * מחפש URLs מלאים שמופיעים בתוך ה-HTML,
//    * כולל URLs שעברו escaping כמו:
//    *
//    * https:\/\/flow-content.google\/video\/...
//    */
//   const fullUrlRegex =
//     /https?:\\?\/\\?\/flow-content\.google(?:\\?\/)video(?:\\?\/)[^"'\\\s<]+/gi;

//   for (const match of html.matchAll(fullUrlRegex)) {
//     candidates.add(cleanExtractedUrl(match[0]));
//   }

//   /*
//    * חיפוש נוסף למקרה שהדומיין והנתיב מופיעים
//    * בנפרד בתוך JSON / JavaScript.
//    */
//   const relativeRegex =
//     /(?:https?:)?\\?\/\\?\/flow-content\.google\\?\/video\\?\/[A-Za-z0-9_-]+(?:\?[^"'\\\s<]+)/gi;

//   for (const match of html.matchAll(relativeRegex)) {
//     let value = match[0];

//     if (value.startsWith("//")) {
//       value = "https:" + value;
//     }

//     candidates.add(cleanExtractedUrl(value));
//   }

//   /*
//    * לפעמים JSON מכיל את הכתובת כשה-slashes
//    * הם escaped.
//    */
//   const jsonLikeRegex =
//     /flow-content\.google(?:\\\/|\/)+video(?:\\\/|\/)+([A-Za-z0-9_-]+)(?:\\?|\?)([^"'<>\\\s]*)/gi;

//   for (const match of html.matchAll(jsonLikeRegex)) {
//     const id = match[1];
//     const query = match[2];

//     let url = `https://flow-content.google/video/${id}`;

//     if (query) {
//       url += "?" + query;
//     }

//     candidates.add(cleanExtractedUrl(url));
//   }

//   return Array.from(candidates).filter((value) => {
//     try {
//       return isAllowedVideoUrl(new URL(value));
//     } catch {
//       return false;
//     }
//   });
// }

// function cleanExtractedUrl(value: string) {
//   return value
//     .replace(/\\\//g, "/")
//     .replace(/\\u0026/gi, "&")
//     .replace(/&amp;/gi, "&")
//     .replace(/\\+"/g, "")
//     .replace(/^"+|"+$/g, "")
//     .replace(/[),.;]+$/, "");
// }

// async function fetchWithTimeout(
//   url: string,
//   options: RequestInit,
//   timeout: number
// ) {
//   const controller = new AbortController();

//   const timer = setTimeout(() => {
//     controller.abort();
//   }, timeout);

//   try {
//     return await fetch(url, {
//       ...options,
//       signal: controller.signal,
//     });
//   } finally {
//     clearTimeout(timer);
//   }
// }

// function getFilename(contentDisposition: string | null) {
//   if (!contentDisposition) {
//     return "flow-video.mp4";
//   }

//   const utf8Match = contentDisposition.match(
//     /filename\*=UTF-8''([^;]+)/i
//   );

//   if (utf8Match?.[1]) {
//     try {
//       return decodeURIComponent(utf8Match[1]);
//     } catch {
//       // continue
//     }
//   }

//   const normalMatch = contentDisposition.match(
//     /filename="?([^"]+)"?/i
//   );

//   if (normalMatch?.[1]) {
//     return normalMatch[1];
//   }

//   return "flow-video.mp4";
// }

// function sanitizeFilename(filename: string) {
//   const cleaned = filename
//     .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
//     .trim();

//   if (!cleaned) {
//     return "flow-video.mp4";
//   }

//   return cleaned.toLowerCase().endsWith(".mp4")
//     ? cleaned
//     : `${cleaned}.mp4`;
// }

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();

//     const inputUrl =
//       typeof body?.url === "string"
//         ? body.url.trim()
//         : "";

//     if (!inputUrl) {
//       return NextResponse.json(
//         {
//           error: "לא הוזן קישור.",
//         },
//         { status: 400 }
//       );
//     }

//     let shareUrl: URL;

//     try {
//       shareUrl = new URL(inputUrl);
//     } catch {
//       return NextResponse.json(
//         {
//           error: "הקישור אינו תקין.",
//         },
//         { status: 400 }
//       );
//     }

//     if (!isAllowedFlowUrl(shareUrl)) {
//       return NextResponse.json(
//         {
//           error:
//             "יש להזין קישור שיתוף תקין של Google Flow בפורמט /shared/video/.",
//         },
//         { status: 400 }
//       );
//     }

//     /*
//      * שלב 1:
//      * מביאים את דף השיתוף.
//      */
//     const pageResponse = await fetchWithTimeout(
//       shareUrl.toString(),
//       {
//         method: "GET",
//         redirect: "follow",
//         headers: {
//           "User-Agent":
//             "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
//           Accept:
//             "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
//           "Accept-Language": "en-US,en;q=0.9",
//         },
//         cache: "no-store",
//       },
//       PAGE_TIMEOUT
//     );

//     if (!pageResponse.ok) {
//       return NextResponse.json(
//         {
//           error: `לא ניתן לפתוח את דף השיתוף של Flow (HTTP ${pageResponse.status}).`,
//         },
//         { status: 502 }
//       );
//     }

//     const finalUrl = new URL(pageResponse.url);

//     /*
//      * מוודאים שגם אחרי redirect אנחנו עדיין
//      * בתחום המותר.
//      */
//     if (!FLOW_HOSTS.has(finalUrl.hostname.toLowerCase())) {
//       return NextResponse.json(
//         {
//           error: "דף השיתוף הפנה לכתובת שאינה נתמכת.",
//         },
//         { status: 502 }
//       );
//     }

//     const html = await pageResponse.text();

//     /*
//      * שלב 2:
//      * מחפשים את URL הווידאו שהדף מספק.
//      */
//     const videoUrls = extractVideoUrls(html);

//     if (videoUrls.length === 0) {
//       return NextResponse.json(
//         {
//           error:
//             "לא נמצאה כתובת וידאו בדף השיתוף. ייתכן ש-Flow שינה את מבנה הדף.",
//         },
//         { status: 404 }
//       );
//     }

//     /*
//      * ננסה את כתובות הווידאו שמצאנו.
//      */
//     let videoResponse: Response | null = null;
//     let selectedVideoUrl: URL | null = null;

//     for (const candidate of videoUrls) {
//       try {
//         const videoUrl = new URL(candidate);

//         if (!isAllowedVideoUrl(videoUrl)) {
//           continue;
//         }

//         /*
//          * GET אמיתי, ולא HEAD.
//          * אנחנו משתמשים ב-stream כדי לא להחזיק
//          * את כל הסרטון בזיכרון.
//          */
//         const response = await fetchWithTimeout(
//           videoUrl.toString(),
//           {
//             method: "GET",
//             redirect: "follow",
//             headers: {
//               "User-Agent":
//                 "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
//               Accept: "video/mp4,video/*,*/*;q=0.8",
//             },
//             cache: "no-store",
//           },
//           DOWNLOAD_TIMEOUT
//         );

//         if (!response.ok) {
//           continue;
//         }

//         const redirectedUrl = new URL(response.url);

//         /*
//          * גם לאחר redirect אסור לצאת מה-host המורשה.
//          */
//         if (!isAllowedVideoUrl(redirectedUrl)) {
//           continue;
//         }

//         videoResponse = response;
//         selectedVideoUrl = redirectedUrl;

//         break;
//       } catch {
//         continue;
//       }
//     }

//     if (!videoResponse || !selectedVideoUrl) {
//       return NextResponse.json(
//         {
//           error:
//             "נמצאה כתובת וידאו, אבל השרת לא הצליח להוריד את הקובץ.",
//         },
//         { status: 502 }
//       );
//     }

//     /*
//      * בדיקת גודל לפני התחלת ההעברה.
//      */
//     const contentLength = videoResponse.headers.get("content-length");

//     if (contentLength) {
//       const size = Number(contentLength);

//       if (Number.isFinite(size) && size > MAX_VIDEO_SIZE) {
//         return NextResponse.json(
//           {
//             error:
//               "הסרטון גדול מדי להורדה דרך השרת.",
//           },
//           { status: 413 }
//         );
//       }
//     }

//     /*
//      * אם אין content-length, ה-stream עצמו עדיין
//      * יכול להיות גדול. במקרה כזה אנחנו לא קוראים
//      * את כולו לזיכרון — אלא מגבילים תוך כדי.
//      */
//     const originalFilename = getFilename(
//       videoResponse.headers.get("content-disposition")
//     );

//     const filename = sanitizeFilename(originalFilename);

//     const sourceStream = videoResponse.body;

//     if (!sourceStream) {
//       return NextResponse.json(
//         {
//           error: "שרת הווידאו לא החזיר נתונים.",
//         },
//         { status: 502 }
//       );
//     }

//     let totalBytes = 0;

//     const limitedStream = new ReadableStream<Uint8Array>({
//       async start(controller) {
//         const reader = sourceStream.getReader();

//         try {
//           while (true) {
//             const { done, value } = await reader.read();

//             if (done) {
//               controller.close();
//               break;
//             }

//             totalBytes += value.byteLength;

//             if (totalBytes > MAX_VIDEO_SIZE) {
//               await reader.cancel();

//               controller.error(
//                 new Error("Video exceeds maximum size")
//               );

//               break;
//             }

//             controller.enqueue(value);
//           }
//         } catch (error) {
//           controller.error(error);
//         }
//       },
//     });

//     /*
//      * מחזירים את הווידאו ישירות למשתמש.
//      *
//      * שים לב:
//      * הסרטון עובר דרך השרת שלך,
//      * אבל אנחנו לא צריכים לשמור אותו בדיסק.
//      */
//     return new NextResponse(limitedStream, {
//       status: 200,
//       headers: {
//         "Content-Type":
//           videoResponse.headers.get("content-type") ||
//           "video/mp4",

//         "Content-Disposition": `attachment; filename="${filename}"`,

//         "Cache-Control":
//           "no-store, no-cache, must-revalidate",

//         Pragma: "no-cache",

//         "X-Flow-Source": "server-proxy",

//         "Access-Control-Expose-Headers":
//           "Content-Disposition, Content-Length",
//       },
//     });
//   } catch (error: any) {
//     console.error("Flow download error:", error);

//     if (error?.name === "AbortError") {
//       return NextResponse.json(
//         {
//           error:
//             "הפעולה ארכה יותר מדי זמן והשרת הפסיק אותה.",
//         },
//         { status: 504 }
//       );
//     }

//     return NextResponse.json(
//       {
//         error:
//           "אירעה שגיאה בלתי צפויה במהלך הורדת הסרטון.",
//       },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { Readable } from "stream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// הגדרת הרשאות עבור Google Drive API
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

const drive = google.drive({ version: "v3", auth });

const FLOW_SHARE_HOSTS = new Set([
  "flow.google.com",
  "www.flow.google.com",
]);

const FLOW_VIDEO_HOST = "flow-content.google";

const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB
const PAGE_TIMEOUT = 20_000;
const DOWNLOAD_TIMEOUT = 220_000;

function isFlowShareUrl(url: URL): boolean {
  return (
    url.protocol === "https:" &&
    FLOW_SHARE_HOSTS.has(url.hostname.toLowerCase()) &&
    url.pathname.startsWith("/shared/video/")
  );
}

function isFlowVideoUrl(url: URL): boolean {
  return (
    url.protocol === "https:" &&
    url.hostname.toLowerCase() === FLOW_VIDEO_HOST &&
    url.pathname.startsWith("/video/")
  );
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number
) {
  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

function cleanUrl(value: string): string {
  return value
    .replace(/\\\//g, "/")
    .replace(/\\u0026/gi, "&")
    .replace(/&amp;/gi, "&")
    .replace(/^["']|["']$/g, "")
    .replace(/[),.;]+$/, "");
}

/**
 * מחפש כתובות flow-content.google/video בתוך ה-HTML.
 */
function extractVideoUrls(html: string): string[] {
  const urls = new Set<string>();

  const patterns = [
    /https?:\\?\/\\?\/flow-content\.google\\?\/video\\?\/[^"'<>\\\s]+/gi,
    /https?:\/\/flow-content\.google\/video\/[^"'<>\\\s]+/gi,
    /\/\/flow-content\.google\/video\/[^"'<>\\\s]+/gi,
  ];

  for (const regex of patterns) {
    for (const match of html.matchAll(regex)) {
      let value = cleanUrl(match[0]);

      if (value.startsWith("//")) {
        value = "https:" + value;
      }

      try {
        const parsed = new URL(value);

        if (isFlowVideoUrl(parsed)) {
          urls.add(parsed.toString());
        }
      } catch {
        // URL לא תקין — מתעלמים
      }
    }
  }

  return [...urls];
}

function getFilename(
  contentDisposition: string | null
): string {
  if (!contentDisposition) {
    return "flow-video.mp4";
  }

  const utf8Match = contentDisposition.match(
    /filename\*=UTF-8''([^;]+)/i
  );

  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch {
      // ממשיכים לשם הבא
    }
  }

  const normalMatch = contentDisposition.match(
    /filename="?([^"]+)"?/i
  );

  if (normalMatch?.[1]) {
    return normalMatch[1];
  }

  return "flow-video.mp4";
}

function sanitizeFilename(filename: string): string {
  const cleaned = filename
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
    .trim();

  if (!cleaned) {
    return "flow-video.mp4";
  }

  if (cleaned.toLowerCase().endsWith(".mp4")) {
    return cleaned;
  }

  return `${cleaned}.mp4`;
}

async function downloadVideo(videoUrl: URL) {
  if (!isFlowVideoUrl(videoUrl)) {
    throw new Error("כתובת וידאו לא מורשית.");
  }

  const response = await fetchWithTimeout(
    videoUrl.toString(),
    {
      method: "GET",
      redirect: "follow",

      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36",

        Accept:
          "video/mp4,video/*,*/*;q=0.8",
      },

      cache: "no-store",
    },
    DOWNLOAD_TIMEOUT
  );

  if (!response.ok) {
    throw new Error(
      `שרת הווידאו החזיר HTTP ${response.status}`
    );
  }

  const finalUrl = new URL(response.url);

  if (!isFlowVideoUrl(finalUrl)) {
    throw new Error(
      "כתובת הווידאו הופנתה לדומיין לא מורשה."
    );
  }

  const contentLength =
    response.headers.get("content-length");

  if (contentLength) {
    const size = Number(contentLength);

    if (
      Number.isFinite(size) &&
      size > MAX_VIDEO_SIZE
    ) {
      throw new Error(
        "הקובץ גדול מדי. המגבלה היא 500MB."
      );
    }
  }

  if (!response.body) {
    throw new Error(
      "שרת הווידאו לא החזיר stream."
    );
  }

  const originalFilename = getFilename(
    response.headers.get("content-disposition")
  );

  const filename =
    sanitizeFilename(originalFilename);

  let totalBytes = 0;

  const limitedStream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = response.body!.getReader();

      try {
        while (true) {
          const { done, value } =
            await reader.read();

          if (done) {
            controller.close();
            break;
          }

          totalBytes += value.byteLength;

          if (totalBytes > MAX_VIDEO_SIZE) {
            await reader.cancel();

            controller.error(
              new Error(
                "הקובץ עבר את מגבלת הגודל של 500MB."
              )
            );

            break;
          }

          controller.enqueue(value);
        }
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return {
    stream: limitedStream,
    filename,
    contentType:
      response.headers.get("content-type") ||
      "video/mp4",
  };
}

/**
 * פונקציית עזר להעלאת ה-Stream ישירות ל-Google Drive
 */
async function uploadToDrive(
  webStream: ReadableStream<Uint8Array>,
  filename: string,
  contentType: string
) {
  const nodeStream = Readable.fromWeb(webStream as any);

  const fileMetadata = {
    name: filename,
    parents: process.env.GOOGLE_DRIVE_FOLDER_ID
      ? [process.env.GOOGLE_DRIVE_FOLDER_ID]
      : [],
  };

  const media = {
    mimeType: contentType || "video/mp4",
    body: nodeStream,
  };

  const driveResponse = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: "id, webViewLink",
  });

  return driveResponse.data;
}

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const inputUrl =
      typeof body?.url === "string"
        ? body.url.trim()
        : "";

    if (!inputUrl) {
      return NextResponse.json(
        {
          error: "לא הוזן קישור.",
        },
        { status: 400 }
      );
    }

    let input: URL;

    try {
      input = new URL(inputUrl);
    } catch {
      return NextResponse.json(
        {
          error: "הקישור שהוזן אינו תקין.",
        },
        { status: 400 }
      );
    }

    /*
     * =====================================================
     * מצב 1:
     * URL ישיר של flow-content.google
     * =====================================================
     */
    if (isFlowVideoUrl(input)) {
      try {
        const result = await downloadVideo(input);

        const driveFile = await uploadToDrive(
          result.stream,
          result.filename,
          result.contentType
        );

        return NextResponse.json({
          success: true,
          message: "הקובץ הועבר בהצלחה לגוגל דרייב!",
          fileId: driveFile.id,
          driveLink: driveFile.webViewLink,
        });
      } catch (error: any) {
        console.error(
          "Direct Flow video error:",
          error
        );

        return NextResponse.json(
          {
            error:
              error?.message ||
              "לא ניתן להעביר את הסרטון לדרייב.",
          },
          { status: 502 }
        );
      }
    }

    /*
     * =====================================================
     * מצב 2:
     * קישור שיתוף של flow.google.com
     * =====================================================
     */
    if (isFlowShareUrl(input)) {
      try {
        const pageResponse =
          await fetchWithTimeout(
            input.toString(),
            {
              method: "GET",
              redirect: "follow",

              headers: {
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36",

                Accept:
                  "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",

                "Accept-Language":
                  "en-US,en;q=0.9",
              },

              cache: "no-store",
            },
            PAGE_TIMEOUT
          );

        if (!pageResponse.ok) {
          return NextResponse.json(
            {
              error:
                `לא ניתן לפתוח את דף השיתוף. ` +
                `HTTP ${pageResponse.status}`,
            },
            { status: 502 }
          );
        }

        const html =
          await pageResponse.text();

        const videoUrls =
          extractVideoUrls(html);

        if (videoUrls.length === 0) {
          return NextResponse.json(
            {
              error:
                "דף השיתוף נטען, אבל לא נמצאה בו כתובת ישירה של הסרטון. ייתכן ש-Flow טוען את הווידאו באמצעות JavaScript.",
            },
            { status: 404 }
          );
        }

        /*
         * מנסים את הכתובות שמצאנו.
         */
        for (const videoUrl of videoUrls) {
          try {
            const parsed =
              new URL(videoUrl);

            const result =
              await downloadVideo(parsed);

            const driveFile = await uploadToDrive(
              result.stream,
              result.filename,
              result.contentType
            );

            return NextResponse.json({
              success: true,
              message: "הקובץ הועבר בהצלחה לגוגל דרייב!",
              fileId: driveFile.id,
              driveLink: driveFile.webViewLink,
            });
          } catch (error) {
            console.warn(
              "Failed video candidate:",
              error
            );
          }
        }

        return NextResponse.json(
          {
            error:
              "נמצאה כתובת וידאו, אבל ההעלאה לדרייב נכשלה.",
          },
          { status: 502 }
        );
      } catch (error: any) {
        console.error(
          "Flow share error:",
          error
        );

        if (
          error?.name ===
          "AbortError"
        ) {
          return NextResponse.json(
            {
              error:
                "טעינת דף השיתוף ארכה יותר מדי זמן.",
            },
            { status: 504 }
          );
        }

        return NextResponse.json(
          {
            error:
              "אירעה שגיאה בטעינת דף השיתוף.",
          },
          { status: 500 }
        );
      }
    }

    /*
     * שום סוג URL לא התאים.
     */
    return NextResponse.json(
      {
        error:
          "יש להזין קישור שיתוף של Google Flow או כתובת וידאו ישירה של flow-content.google.",
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error(
      "Flow drive upload API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "אירעה שגיאה בלתי צפויה.",
      },
      { status: 500 }
    );
  }
}