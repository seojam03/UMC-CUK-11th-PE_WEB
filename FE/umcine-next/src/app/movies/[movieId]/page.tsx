import { Suspense } from "react";

import { MovieDetailPage } from "@/screens/movies/movie-detail-page";

// routes/movies.$movieId.tsx → app/movies/[movieId]/page.tsx ($movieId → [movieId])
// page.tsx는 Server Component라서 useParams 대신 params prop으로 주소 값을 받아요.
// params는 Promise라 await가 필요하고, 주소 값은 요청이 와야 알 수 있으니 Suspense 안에서 꺼내요.
// 그러면 Suspense 바깥(헤더 등)은 빌드 때 미리 만들어 두고, 영화 부분만 요청 때 채워져요.
export default function MovieDetail({ params }: PageProps<"/movies/[movieId]">) {
  return (
    <Suspense fallback={<MovieDetailFallback />}>
      <MovieDetailContent params={params} />
    </Suspense>
  );
}

async function MovieDetailContent({ params }: Pick<PageProps<"/movies/[movieId]">, "params">) {
  const { movieId } = await params;
  return <MovieDetailPage movieId={movieId} />;
}

function MovieDetailFallback() {
  return (
    <main className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-[#f6f7f9]">
      <p className="text-[14px] text-[#8e949e]">영화를 불러오는 중입니다...</p>
    </main>
  );
}
