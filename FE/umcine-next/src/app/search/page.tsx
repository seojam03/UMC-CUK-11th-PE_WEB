import type { Metadata } from "next";
import { Suspense } from "react";

import { SearchPage } from "@/screens/movies/search-page";

export const metadata: Metadata = { title: "검색" };

// SearchPage는 useSearchParams()로 ?query=를 읽어요. 검색어는 요청이 와야 알 수 있어서
// Suspense로 감싸야 나머지 화면(헤더 등)을 빌드 때 미리 만들어 둘 수 있어요.
export default function Search() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchPage />
    </Suspense>
  );
}

function SearchFallback() {
  return (
    <main className="min-h-[calc(100vh-56px)] bg-[#f6f7f9] text-[#17191f]">
      <section className="mx-auto w-[min(calc(100%-32px),368px)] pt-[98px]">
        <h1 className="mb-5 text-center text-[30px] font-bold tracking-[-1px]">어떤 영화를 찾고 있나요?</h1>
      </section>
    </main>
  );
}
