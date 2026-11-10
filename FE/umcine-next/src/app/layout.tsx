import type { Metadata } from "next";
import { Geist } from "next/font/google";

import Header from "@/components/layout/header";
import { Providers } from "./providers";
import "./globals.css";

// next/font는 빌드할 때 폰트 파일을 내려받아 우리 서버에서 함께 제공해요. (외부 폰트 요청이 없어요)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// metadata는 Server Component에서만 내보낼 수 있어요. 페이지별 metadata가 없으면 이 값을 써요.
export const metadata: Metadata = {
  title: {
    default: "UMCine",
    template: "%s | UMCine", // 페이지에서 title: "검색"을 내보내면 "검색 | UMCine"이 돼요.
  },
  description: "TMDB 영화 정보와 UMC 백엔드로 만든 영화 평점·즐겨찾기 서비스",
};

// TanStack Router의 __root.tsx(Header + <Outlet />)와 index.html을 합친 자리예요.
// <Outlet /> 대신 children 자리에 각 페이지가 그려져요.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
