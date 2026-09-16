// // // להורדת ווידיאו מ Google Flow
// import { NextRequest, NextResponse } from "next/server";
// import { google } from "googleapis";
// import { Readable } from "stream";

// export const runtime = "nodejs";
// export const dynamic = "force-dynamic";
// export const maxDuration = 60;

// // הגדרת אימות OAuth 2.0 במקום Service Account
// const oauth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET
// );

// oauth2Client.setCredentials({
//   refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
// });

// const drive = google.drive({ version: "v3", auth: oauth2Client });

// const FLOW_SHARE_HOSTS = new Set([
//   "flow.google.com",
//   "www.flow.google.com",
// ]);

// const FLOW_VIDEO_HOST = "flow-content.google";

// const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB
// const PAGE_TIMEOUT = 20_000;
// const DOWNLOAD_TIMEOUT = 220_000;

// function isFlowShareUrl(url: URL): boolean {
//   return (
//     url.protocol === "https:" &&
//     FLOW_SHARE_HOSTS.has(url.hostname.toLowerCase()) &&
//     url.pathname.startsWith("/shared/video/")
//   );
// }

// function isFlowVideoUrl(url: URL): boolean {
//   return (
//     url.protocol === "https:" &&
//     url.hostname.toLowerCase() === FLOW_VIDEO_HOST &&
//     url.pathname.startsWith("/video/")
//   );
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

// function cleanUrl(value: string): string {
//   return value
//     .replace(/\\\//g, "/")
//     .replace(/\\u0026/gi, "&")
//     .replace(/&amp;/gi, "&")
//     .replace(/^["']|["']$/g, "")
//     .replace(/[),.;]+$/, "");
// }

// /**
//  * מחפש כתובות flow-content.google/video בתוך ה-HTML.
//  */
// function extractVideoUrls(html: string): string[] {
//   const urls = new Set<string>();

//   const patterns = [
//     /https?:\\?\/\\?\/flow-content\.google\\?\/video\\?\/[^"'<>\\\s]+/gi,
//     /https?:\/\/flow-content\.google\/video\/[^"'<>\\\s]+/gi,
//     /\/\/flow-content\.google\/video\/[^"'<>\\\s]+/gi,
//   ];

//   for (const regex of patterns) {
//     for (const match of html.matchAll(regex)) {
//       let value = cleanUrl(match[0]);

//       if (value.startsWith("//")) {
//         value = "https:" + value;
//       }

//       try {
//         const parsed = new URL(value);

//         if (isFlowVideoUrl(parsed)) {
//           urls.add(parsed.toString());
//         }
//       } catch {
//         // URL לא תקין — מתעלמים
//       }
//     }
//   }

//   return [...urls];
// }

// function getFilename(
//   contentDisposition: string | null
// ): string {
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
//       // ממשיכים לשם הבא
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

// function sanitizeFilename(filename: string): string {
//   const cleaned = filename
//     .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
//     .trim();

//   if (!cleaned) {
//     return "flow-video.mp4";
//   }

//   if (cleaned.toLowerCase().endsWith(".mp4")) {
//     return cleaned;
//   }

//   return `${cleaned}.mp4`;
// }

// async function downloadVideo(videoUrl: URL) {
//   if (!isFlowVideoUrl(videoUrl)) {
//     throw new Error("כתובת וידאו לא מורשית.");
//   }

//   const response = await fetchWithTimeout(
//     videoUrl.toString(),
//     {
//       method: "GET",
//       redirect: "follow",

//       headers: {
//         "User-Agent":
//           "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36",

//         Accept:
//           "video/mp4,video/*,*/*;q=0.8",
//       },

//       cache: "no-store",
//     },
//     DOWNLOAD_TIMEOUT
//   );

//   if (!response.ok) {
//     throw new Error(
//       `שרת הווידאו החזיר HTTP ${response.status}`
//     );
//   }

//   const finalUrl = new URL(response.url);

//   if (!isFlowVideoUrl(finalUrl)) {
//     throw new Error(
//       "כתובת הווידאו הופנתה לדומיין לא מורשה."
//     );
//   }

//   const contentLength =
//     response.headers.get("content-length");

//   if (contentLength) {
//     const size = Number(contentLength);

//     if (
//       Number.isFinite(size) &&
//       size > MAX_VIDEO_SIZE
//     ) {
//       throw new Error(
//         "הקובץ גדול מדי. המגבלה היא 500MB."
//       );
//     }
//   }

//   if (!response.body) {
//     throw new Error(
//       "שרת הווידאו לא החזיר stream."
//     );
//   }

//   const originalFilename = getFilename(
//     response.headers.get("content-disposition")
//   );

//   const filename =
//     sanitizeFilename(originalFilename);

//   let totalBytes = 0;

//   const limitedStream = new ReadableStream<Uint8Array>({
//     async start(controller) {
//       const reader = response.body!.getReader();

//       try {
//         while (true) {
//           const { done, value } =
//             await reader.read();

//           if (done) {
//             controller.close();
//             break;
//           }

//           totalBytes += value.byteLength;

//           if (totalBytes > MAX_VIDEO_SIZE) {
//             await reader.cancel();

//             controller.error(
//               new Error(
//                 "הקובץ עבר את מגבלת הגודל של 500MB."
//               )
//             );

//             break;
//           }

//           controller.enqueue(value);
//         }
//       } catch (error) {
//         controller.error(error);
//       }
//     },
//   });

//   return {
//     stream: limitedStream,
//     filename,
//     contentType:
//       response.headers.get("content-type") ||
//       "video/mp4",
//   };
// }

// /**
//  * פונקציית עזר להעלאת ה-Stream ישירות ל-Google Drive
//  */
// async function uploadToDrive(
//   webStream: ReadableStream<Uint8Array>,
//   filename: string,
//   contentType: string
// ) {
//   const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

//   if (!folderId) {
//     throw new Error("חסר GOOGLE_DRIVE_FOLDER_ID במשתני הסביבה.");
//   }

//   const nodeStream = Readable.fromWeb(webStream as any);

//   const fileMetadata = {
//     name: filename,
//     parents: [folderId.trim()],
//   };

//   const media = {
//     mimeType: contentType || "video/mp4",
//     body: nodeStream,
//   };

//   const driveResponse = await drive.files.create({
//     requestBody: fileMetadata,
//     media: media,
//     fields: "id, webViewLink",
//   });

//   return driveResponse.data;
// }

// export async function POST(
//   request: NextRequest
// ) {
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

//     let input: URL;

//     try {
//       input = new URL(inputUrl);
//     } catch {
//       return NextResponse.json(
//         {
//           error: "הקישור שהוזן אינו תקין.",
//         },
//         { status: 400 }
//       );
//     }

//     /*
//      * =====================================================
//      * מצב 1:
//      * URL ישיר של flow-content.google
//      * =====================================================
//      */
//     if (isFlowVideoUrl(input)) {
//       try {
//         const result = await downloadVideo(input);

//         const driveFile = await uploadToDrive(
//           result.stream,
//           result.filename,
//           result.contentType
//         );

//         return NextResponse.json({
//           success: true,
//           message: "הקובץ הועבר בהצלחה לגוגל דרייב!",
//           fileId: driveFile.id,
//           driveLink: driveFile.webViewLink,
//         });
//       } catch (error: any) {
//         console.error(
//           "Direct Flow video error:",
//           error
//         );

//         return NextResponse.json(
//           {
//             error:
//               error?.message ||
//               "לא ניתן להעביר את הסרטון לדרייב.",
//           },
//           { status: 502 }
//         );
//       }
//     }

//     /*
//      * =====================================================
//      * מצב 2:
//      * קישור שיתוף של flow.google.com
//      * =====================================================
//      */
//     if (isFlowShareUrl(input)) {
//       try {
//         const pageResponse =
//           await fetchWithTimeout(
//             input.toString(),
//             {
//               method: "GET",
//               redirect: "follow",

//               headers: {
//                 "User-Agent":
//                   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36",

//                 Accept:
//                   "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",

//                 "Accept-Language":
//                   "en-US,en;q=0.9",
//               },

//               cache: "no-store",
//             },
//             PAGE_TIMEOUT
//           );

//         if (!pageResponse.ok) {
//           return NextResponse.json(
//             {
//               error:
//                 `לא ניתן לפתוח את דף השיתוף. ` +
//                 `HTTP ${pageResponse.status}`,
//             },
//             { status: 502 }
//           );
//         }

//         const html =
//           await pageResponse.text();

//         const videoUrls =
//           extractVideoUrls(html);

//         if (videoUrls.length === 0) {
//           return NextResponse.json(
//             {
//               error:
//                 "דף השיתוף נטען, אבל לא נמצאה בו כתובת ישירה של הסרטון. ייתכן ש-Flow טוען את הווידאו באמצעות JavaScript.",
//             },
//             { status: 404 }
//           );
//         }

//         /*
//          * מנסים את הכתובות שמצאנו.
//          */
//         for (const videoUrl of videoUrls) {
//           try {
//             const parsed =
//               new URL(videoUrl);

//             const result =
//               await downloadVideo(parsed);

//             const driveFile = await uploadToDrive(
//               result.stream,
//               result.filename,
//               result.contentType
//             );

//             return NextResponse.json({
//               success: true,
//               message: "הקובץ הועבר בהצלחה לגוגל דרייב!",
//               fileId: driveFile.id,
//               driveLink: driveFile.webViewLink,
//             });
//           } catch (error) {
//             console.warn(
//               "Failed video candidate:",
//               error
//             );
//           }
//         }

//         return NextResponse.json(
//           {
//             error:
//               "נמצאה כתובת וידאו, אבל ההעלאה לדרייב נכשלה.",
//           },
//           { status: 502 }
//         );
//       } catch (error: any) {
//         console.error(
//           "Flow share error:",
//           error
//         );

//         if (
//           error?.name ===
//           "AbortError"
//         ) {
//           return NextResponse.json(
//             {
//               error:
//                 "טעינת דף השיתוף ארכה יותר מדי זמן.",
//             },
//             { status: 504 }
//           );
//         }

//         return NextResponse.json(
//           {
//             error:
//               "אירעה שגיאה בטעינת דף השיתוף.",
//           },
//           { status: 500 }
//         );
//       }
//     }

//     /*
//      * שום סוג URL לא התאים.
//      */
//     return NextResponse.json(
//       {
//         error:
//           "יש להזין קישור שיתוף של Google Flow או כתובת וידאו ישירה של flow-content.google.",
//       },
//       { status: 400 }
//     );
//   } catch (error: any) {
//     console.error(
//       "Flow drive upload API error:",
//       error
//     );

//     return NextResponse.json(
//       {
//         error:
//           "אירעה שגיאה בלתי צפויה.",
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

// הגדרת אימות OAuth 2.0
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const drive = google.drive({ version: "v3", auth: oauth2Client });

const FLOW_SHARE_HOSTS = new Set([
  "flow.google.com",
  "www.flow.google.com",
]);

const FLOW_VIDEO_HOST = "flow-content.google";

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
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
  const timer = setTimeout(() => controller.abort(), timeout);

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
 * מחפש כתובות flow-content.google/video בתוך ה-HTML של דף שיתוף
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
        // להתעלם מ-URL לא תקין
      }
    }
  }

  return [...urls];
}

/**
 * חילוץ וקביעת שם הקובץ על פי Content-Disposition, URL או Content-Type
 */
function getFilename(
  contentDisposition: string | null,
  contentType: string | null,
  targetUrl: URL
): string {
  // 1. ניסיון לחלץ מכותרת Content-Disposition
  if (contentDisposition) {
    const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
    if (utf8Match?.[1]) {
      try { return decodeURIComponent(utf8Match[1]); } catch {}
    }
    const normalMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
    if (normalMatch?.[1]) {
      return normalMatch[1];
    }
  }

  // 2. ניסיון לחלץ מנתיב ה-URL (תומך בקישורים מורכבים כמו Kling/Leonardo)
  const pathname = targetUrl.pathname;
  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments.pop() || "";

  const extensionMatch = lastSegment.match(/\.(mp4|webm|mov|m4v|jpg|jpeg|png|webp|gif|mp3|wav|m4a|aac|ogg|pdf)(?=[_?&#.]|$)/i);
  
  if (extensionMatch) {
    const ext = extensionMatch[1].toLowerCase();
    if (lastSegment.length < 90) {
      return lastSegment;
    }
    return `media-file.${ext}`;
  }

  // 3. ברירת מחדל לפי Content-Type
  if (contentType) {
    if (contentType.includes("video/mp4")) return "video.mp4";
    if (contentType.includes("video/webm")) return "video.webm";
    if (contentType.includes("video/quicktime")) return "video.mov";
    if (contentType.includes("image/jpeg")) return "image.jpg";
    if (contentType.includes("image/png")) return "image.png";
    if (contentType.includes("image/webp")) return "image.webp";
    if (contentType.includes("image/gif")) return "image.gif";
    if (contentType.includes("audio/mpeg") || contentType.includes("audio/mp3")) return "audio.mp3";
    if (contentType.includes("audio/wav")) return "audio.wav";
  }

  return "downloaded-media.mp4";
}

function sanitizeFilename(filename: string): string {
  return filename.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").trim() || "downloaded-media.mp4";
}

/**
 * מוריד את הקובץ מכל קישור ישיר נתון ויוצר Stream מוגבל גודל
 */
async function downloadDirectFile(fileUrl: URL) {
  const response = await fetchWithTimeout(
    fileUrl.toString(),
    {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
        Accept: "*/*",
      },
      cache: "no-store",
    },
    DOWNLOAD_TIMEOUT
  );

  if (!response.ok) {
    throw new Error(`השרת המארח החזיר HTTP ${response.status}`);
  }

  const contentLength = response.headers.get("content-length");
  if (contentLength) {
    const size = Number(contentLength);
    if (Number.isFinite(size) && size > MAX_FILE_SIZE) {
      throw new Error("הקובץ גדול מדי. המגבלה היא 500MB.");
    }
  }

  if (!response.body) {
    throw new Error("השרת המארח לא החזיר תוכן (stream).");
  }

  const contentType = response.headers.get("content-type") || "application/octet-stream";
  const rawFilename = getFilename(response.headers.get("content-disposition"), contentType, fileUrl);
  const filename = sanitizeFilename(rawFilename);

  let totalBytes = 0;

  const limitedStream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = response.body!.getReader();

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            controller.close();
            break;
          }

          totalBytes += value.byteLength;

          if (totalBytes > MAX_FILE_SIZE) {
            await reader.cancel();
            controller.error(
              new Error("הקובץ עבר את מגבלת הגודל של 500MB.")
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
    contentType,
  };
}

/**
 * העלאת ה-Stream ל-Google Drive
 */
async function uploadToDrive(
  webStream: ReadableStream<Uint8Array>,
  filename: string,
  contentType: string
) {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!folderId) {
    throw new Error("חסר GOOGLE_DRIVE_FOLDER_ID במשתני הסביבה.");
  }

  const nodeStream = Readable.fromWeb(webStream as any);

  const fileMetadata = {
    name: filename,
    parents: [folderId.trim()],
  };

  const media = {
    mimeType: contentType || "application/octet-stream",
    body: nodeStream,
  };

  const driveResponse = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: "id, webViewLink",
  });

  return driveResponse.data;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const inputUrl =
      typeof body?.url === "string" ? body.url.trim() : "";

    if (!inputUrl) {
      return NextResponse.json({ error: "לא הוזן קישור." }, { status: 400 });
    }

    let input: URL;
    try {
      input = new URL(inputUrl);
    } catch {
      return NextResponse.json({ error: "הקישור שהוזן אינו תקין." }, { status: 400 });
    }

    /*
     * =====================================================
     * מצב 1: קישור שיתוף של Google Flow (דף HTML)
     * =====================================================
     */
    if (isFlowShareUrl(input)) {
      try {
        const pageResponse = await fetchWithTimeout(
          input.toString(),
          {
            method: "GET",
            redirect: "follow",
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
              Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
              "Accept-Language": "en-US,en;q=0.9",
            },
            cache: "no-store",
          },
          PAGE_TIMEOUT
        );

        if (!pageResponse.ok) {
          return NextResponse.json(
            { error: `לא ניתן לפתוח את דף השיתוף. HTTP ${pageResponse.status}` },
            { status: 502 }
          );
        }

        const html = await pageResponse.text();
        const videoUrls = extractVideoUrls(html);

        if (videoUrls.length === 0) {
          return NextResponse.json(
            { error: "לא נמצאה כתובת מדיה ישירה בתוך דף השיתוף." },
            { status: 404 }
          );
        }

        for (const videoUrl of videoUrls) {
          try {
            const parsed = new URL(videoUrl);
            const result = await downloadDirectFile(parsed);
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
            console.warn("Failed video candidate:", error);
          }
        }

        return NextResponse.json(
          { error: "נמצאה כתובת וידאו, אך ההורדה או ההעלאה לדרייב נכשלה." },
          { status: 502 }
        );
      } catch (error: any) {
        console.error("Flow share error:", error);
        return NextResponse.json(
          { error: error?.message || "אירעה שגיאה בטעינת דף השיתוף." },
          { status: 500 }
        );
      }
    }

    /*
     * =====================================================
     * מצב 2: קישור ישיר לקובץ (Kling, Leonardo, Flow CDN וכד')
     * =====================================================
     */
    try {
      const result = await downloadDirectFile(input);

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
      console.error("Direct file upload error:", error);

      return NextResponse.json(
        { error: error?.message || "לא ניתן להעביר את הקובץ לדרייב." },
        { status: 502 }
      );
    }

  } catch (error: any) {
    console.error("General drive upload API error:", error);

    return NextResponse.json(
      { error: "אירעה שגיאה בלתי צפויה." },
      { status: 500 }
    );
  }
}