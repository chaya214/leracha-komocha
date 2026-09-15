// להורדת ווידיאו מ Google Flow
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FLOW_HOSTS = new Set([
  "flow.google.com",
  "www.flow.google.com",
]);

const VIDEO_HOSTS = new Set([
  "flow-content.google",
]);

const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB
const PAGE_TIMEOUT = 50_000;
const DOWNLOAD_TIMEOUT = 220_000;

function isAllowedFlowUrl(url: URL) {
  return (
    url.protocol === "https:" &&
    FLOW_HOSTS.has(url.hostname.toLowerCase()) &&
    url.pathname.startsWith("/shared/video/")
  );
}

function isAllowedVideoUrl(url: URL) {
  return (
    url.protocol === "https:" &&
    VIDEO_HOSTS.has(url.hostname.toLowerCase()) &&
    url.pathname.startsWith("/video/")
  );
}

function extractVideoUrls(html: string): string[] {
  const candidates = new Set<string>();

  /*
   * מחפש URLs מלאים שמופיעים בתוך ה-HTML,
   * כולל URLs שעברו escaping כמו:
   *
   * https:\/\/flow-content.google\/video\/...
   */
  const fullUrlRegex =
    /https?:\\?\/\\?\/flow-content\.google(?:\\?\/)video(?:\\?\/)[^"'\\\s<]+/gi;

  for (const match of html.matchAll(fullUrlRegex)) {
    candidates.add(cleanExtractedUrl(match[0]));
  }

  /*
   * חיפוש נוסף למקרה שהדומיין והנתיב מופיעים
   * בנפרד בתוך JSON / JavaScript.
   */
  const relativeRegex =
    /(?:https?:)?\\?\/\\?\/flow-content\.google\\?\/video\\?\/[A-Za-z0-9_-]+(?:\?[^"'\\\s<]+)/gi;

  for (const match of html.matchAll(relativeRegex)) {
    let value = match[0];

    if (value.startsWith("//")) {
      value = "https:" + value;
    }

    candidates.add(cleanExtractedUrl(value));
  }

  /*
   * לפעמים JSON מכיל את הכתובת כשה-slashes
   * הם escaped.
   */
  const jsonLikeRegex =
    /flow-content\.google(?:\\\/|\/)+video(?:\\\/|\/)+([A-Za-z0-9_-]+)(?:\\?|\?)([^"'<>\\\s]*)/gi;

  for (const match of html.matchAll(jsonLikeRegex)) {
    const id = match[1];
    const query = match[2];

    let url = `https://flow-content.google/video/${id}`;

    if (query) {
      url += "?" + query;
    }

    candidates.add(cleanExtractedUrl(url));
  }

  return Array.from(candidates).filter((value) => {
    try {
      return isAllowedVideoUrl(new URL(value));
    } catch {
      return false;
    }
  });
}

function cleanExtractedUrl(value: string) {
  return value
    .replace(/\\\//g, "/")
    .replace(/\\u0026/gi, "&")
    .replace(/&amp;/gi, "&")
    .replace(/\\+"/g, "")
    .replace(/^"+|"+$/g, "")
    .replace(/[),.;]+$/, "");
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

function getFilename(contentDisposition: string | null) {
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
      // continue
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

function sanitizeFilename(filename: string) {
  const cleaned = filename
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
    .trim();

  if (!cleaned) {
    return "flow-video.mp4";
  }

  return cleaned.toLowerCase().endsWith(".mp4")
    ? cleaned
    : `${cleaned}.mp4`;
}

export async function POST(request: NextRequest) {
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

    let shareUrl: URL;

    try {
      shareUrl = new URL(inputUrl);
    } catch {
      return NextResponse.json(
        {
          error: "הקישור אינו תקין.",
        },
        { status: 400 }
      );
    }

    if (!isAllowedFlowUrl(shareUrl)) {
      return NextResponse.json(
        {
          error:
            "יש להזין קישור שיתוף תקין של Google Flow בפורמט /shared/video/.",
        },
        { status: 400 }
      );
    }

    /*
     * שלב 1:
     * מביאים את דף השיתוף.
     */
    const pageResponse = await fetchWithTimeout(
      shareUrl.toString(),
      {
        method: "GET",
        redirect: "follow",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
        cache: "no-store",
      },
      PAGE_TIMEOUT
    );

    if (!pageResponse.ok) {
      return NextResponse.json(
        {
          error: `לא ניתן לפתוח את דף השיתוף של Flow (HTTP ${pageResponse.status}).`,
        },
        { status: 502 }
      );
    }

    const finalUrl = new URL(pageResponse.url);

    /*
     * מוודאים שגם אחרי redirect אנחנו עדיין
     * בתחום המותר.
     */
    if (!FLOW_HOSTS.has(finalUrl.hostname.toLowerCase())) {
      return NextResponse.json(
        {
          error: "דף השיתוף הפנה לכתובת שאינה נתמכת.",
        },
        { status: 502 }
      );
    }

    const html = await pageResponse.text();

    /*
     * שלב 2:
     * מחפשים את URL הווידאו שהדף מספק.
     */
    const videoUrls = extractVideoUrls(html);

    if (videoUrls.length === 0) {
      return NextResponse.json(
        {
          error:
            "לא נמצאה כתובת וידאו בדף השיתוף. ייתכן ש-Flow שינה את מבנה הדף.",
        },
        { status: 404 }
      );
    }

    /*
     * ננסה את כתובות הווידאו שמצאנו.
     */
    let videoResponse: Response | null = null;
    let selectedVideoUrl: URL | null = null;

    for (const candidate of videoUrls) {
      try {
        const videoUrl = new URL(candidate);

        if (!isAllowedVideoUrl(videoUrl)) {
          continue;
        }

        /*
         * GET אמיתי, ולא HEAD.
         * אנחנו משתמשים ב-stream כדי לא להחזיק
         * את כל הסרטון בזיכרון.
         */
        const response = await fetchWithTimeout(
          videoUrl.toString(),
          {
            method: "GET",
            redirect: "follow",
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
              Accept: "video/mp4,video/*,*/*;q=0.8",
            },
            cache: "no-store",
          },
          DOWNLOAD_TIMEOUT
        );

        if (!response.ok) {
          continue;
        }

        const redirectedUrl = new URL(response.url);

        /*
         * גם לאחר redirect אסור לצאת מה-host המורשה.
         */
        if (!isAllowedVideoUrl(redirectedUrl)) {
          continue;
        }

        videoResponse = response;
        selectedVideoUrl = redirectedUrl;

        break;
      } catch {
        continue;
      }
    }

    if (!videoResponse || !selectedVideoUrl) {
      return NextResponse.json(
        {
          error:
            "נמצאה כתובת וידאו, אבל השרת לא הצליח להוריד את הקובץ.",
        },
        { status: 502 }
      );
    }

    /*
     * בדיקת גודל לפני התחלת ההעברה.
     */
    const contentLength = videoResponse.headers.get("content-length");

    if (contentLength) {
      const size = Number(contentLength);

      if (Number.isFinite(size) && size > MAX_VIDEO_SIZE) {
        return NextResponse.json(
          {
            error:
              "הסרטון גדול מדי להורדה דרך השרת.",
          },
          { status: 413 }
        );
      }
    }

    /*
     * אם אין content-length, ה-stream עצמו עדיין
     * יכול להיות גדול. במקרה כזה אנחנו לא קוראים
     * את כולו לזיכרון — אלא מגבילים תוך כדי.
     */
    const originalFilename = getFilename(
      videoResponse.headers.get("content-disposition")
    );

    const filename = sanitizeFilename(originalFilename);

    const sourceStream = videoResponse.body;

    if (!sourceStream) {
      return NextResponse.json(
        {
          error: "שרת הווידאו לא החזיר נתונים.",
        },
        { status: 502 }
      );
    }

    let totalBytes = 0;

    const limitedStream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const reader = sourceStream.getReader();

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              controller.close();
              break;
            }

            totalBytes += value.byteLength;

            if (totalBytes > MAX_VIDEO_SIZE) {
              await reader.cancel();

              controller.error(
                new Error("Video exceeds maximum size")
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

    /*
     * מחזירים את הווידאו ישירות למשתמש.
     *
     * שים לב:
     * הסרטון עובר דרך השרת שלך,
     * אבל אנחנו לא צריכים לשמור אותו בדיסק.
     */
    return new NextResponse(limitedStream, {
      status: 200,
      headers: {
        "Content-Type":
          videoResponse.headers.get("content-type") ||
          "video/mp4",

        "Content-Disposition": `attachment; filename="${filename}"`,

        "Cache-Control":
          "no-store, no-cache, must-revalidate",

        Pragma: "no-cache",

        "X-Flow-Source": "server-proxy",

        "Access-Control-Expose-Headers":
          "Content-Disposition, Content-Length",
      },
    });
  } catch (error: any) {
    console.error("Flow download error:", error);

    if (error?.name === "AbortError") {
      return NextResponse.json(
        {
          error:
            "הפעולה ארכה יותר מדי זמן והשרת הפסיק אותה.",
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        error:
          "אירעה שגיאה בלתי צפויה במהלך הורדת הסרטון.",
      },
      { status: 500 }
    );
  }
}