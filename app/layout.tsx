import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: "내시경 검사 사전교육",
  description: "온라인 위/대장 내시경 사전교육 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.variable} antialiased bg-gray-200`} style={{ fontFamily: 'var(--font-noto-sans-kr), sans-serif' }}>
        {/* 모바일 컨테이너 - 너비와 높이 모두 제한 */}
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-full max-w-[480px] h-screen max-h-[932px] relative shadow-xl overflow-hidden">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
