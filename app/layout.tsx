import type { Metadata } from "next";
import { Assistant } from "next/font/google"; 
import "./globals.css";
import Navbar from "@/components/Navbar"; 
import Footer from "@/components/Footer";

// הגדרת הפונט Assistant כפונט המרכזי
const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-assistant",
});

export const metadata: Metadata = {
  title: "לרעך כמוך | המרכז להלכות בין אדם לחברו",
  description: "המרכז העולמי לסדרת ספרי 'לרעך כמוך'. שאלות ותשובות בהלכה, שיעורים, הלכה יומית ורכישת הכרכים החדשים בנושאי בין אדם לחברו וחושן משפט.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={assistant.variable}>
      {/* השימוש ב-font-assistant מבטיח מראה נקי ומקצועי בכל האתר */}
      <body className="font-assistant antialiased text-right bg-background text-foreground">

        {/* רכיב הניווט - יופיע בכל דפי האתר */}
        <Navbar />

        {/* תוכן העמוד */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* רכיב פוטר */}
        <Footer /> 
        
      </body>
    </html>
  );
}