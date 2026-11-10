"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

import { DetailBookmarkButton } from "../../components/bookmark-button";
import { RatingPanel } from "../../components/movies/rating-panel";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";

interface MovieDetailPageProps {
  // 주소의 [movieId] 값이에요. 서버의 page.tsx가 params에서 꺼내 넘겨줘요. (URL 값은 항상 문자열)
  movieId: string;
}

// TanStack Router에서는 useParams({ from: "/movies/$movieId" })로 직접 꺼냈어요.
// Next.js에서는 page.tsx가 params를 받아 props로 넘겨주는 방식으로 바꿨어요.
export function MovieDetailPage({ movieId }: MovieDetailPageProps) {
  
  const parsedMovieId = Number(movieId);
  const isValidId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  // 영화 ID를 query key에 넣어 영화마다 캐시를 따로 저장해요. 상세는 전역 기본값(1분) 대신 30초만 최신으로 봐요.
  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", parsedMovieId],
    queryFn: () => getMovieDetail(parsedMovieId),
    enabled: isValidId,
    staleTime: 30 * 1000,
  });
  const movie = movieDetailQuery.data;

  // 상영 시간을 'X시간 Y분' 형식으로 변환하는 헬퍼 함수
  const formatRuntime = (runtime: number | null | undefined) => {
    if (typeof runtime !== "number") return "상영 시간 정보가 없어요.";
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;
  };

  // 잘못된 번호는 요청하지 않아도 isPending이 참이므로 로딩보다 먼저 처리해요.
  if (!isValidId) {
    return (
      <main className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-[#f6f7f9]">
        <p className="text-[14px] text-[#ef4444]">올바르지 않은 영화 번호예요.</p>
      </main>
    );
  }

  if (movieDetailQuery.isError) {
    return (
      <main className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-[#f6f7f9]">
        <p className="text-[14px] text-[#ef4444]">{getMovieDetailErrorMessage(movieDetailQuery.error)}</p>
      </main>
    );
  }

  if (movieDetailQuery.isPending || !movie) {
    return (
      <main className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-[#f6f7f9]">
        <p className="text-[14px] text-[#8e949e]">영화를 불러오는 중입니다...</p>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-56px)] bg-[#f6f7f9] text-[#17191f]">
      <section className="relative h-[244px] overflow-hidden bg-[#20242b] text-white max-[700px]:h-[250px] after:absolute after:inset-0 after:bg-[linear-gradient(90deg,rgba(10,12,16,0.7),rgba(10,12,16,0.05)_75%)] after:content-['']">
        {/* 상세 화면에서 가장 먼저 크게 보이는 이미지(LCP)라 preload로 미리 받아요. (Next 16에서 priority → preload) */}
        {movie.backdrop_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
            alt=""
            aria-hidden="true"
            fill
            preload
            sizes="100vw"
            className="object-cover object-[center_38%] brightness-[0.72]"
          />
        ) : null}
        <div className="absolute inset-0 z-[1] mx-auto flex w-[min(calc(100%-104px),862px)] flex-col justify-between box-border py-4 max-[700px]:w-[calc(100%-32px)]">
          <Link href="/" className="text-[10px] text-white no-underline">‹ 영화 목록</Link>
          <div>
            <h1 className="mb-[5px] text-[27px] font-bold leading-[1.15] tracking-[-1.2px]">{movie.title}</h1>
            <p className="mb-1.5 text-[10px]">{movie.original_title}</p>
            <div className="flex gap-[9px] text-[9px]">
              <span>{movie.release_date}</span>
              <span>{movie.genres?.map((genre) => genre.name).join(", ") || "장르 정보 없음"}</span>
              <span>{formatRuntime(movie.runtime)}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid min-h-[346px] w-[min(calc(100%-104px),862px)] grid-cols-[minmax(0,1fr)_220px] gap-5 box-border px-0 pb-[42px] pt-4 max-[700px]:block max-[700px]:w-[calc(100%-32px)]">
        <div className="flex gap-5 max-[700px]:gap-[14px]">
          {movie.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={`${movie.title} 포스터`}
              width={135}
              height={192}
              className="h-[192px] w-[135px] flex-none rounded-[7px] object-cover shadow-[0_12px_20px_rgba(25,29,38,0.16)] max-[700px]:h-[160px] max-[700px]:w-[112px]"
            />
          ) : (
            <div className="h-[192px] w-[135px] flex-none rounded-[7px] bg-[#e4e6ea] max-[700px]:h-[160px] max-[700px]:w-[112px]" aria-hidden="true" />
          )}
          <div className="pt-px">
            <h2 className="mb-3 text-[15px] font-bold leading-[1.3] max-[700px]:text-[13px]">{movie.tagline}</h2>
            <p className="mb-[11px] max-w-[450px] text-[10px] leading-[1.8] text-[#737985] max-[700px]:text-[9px] max-[700px]:leading-[1.6]">{movie.overview}</p>
            <DetailBookmarkButton movieId={movie.id} />
          </div>
        </div>

        {/* 8주차: 평점 조회·등록·수정·삭제를 서버와 연결했어요. */}
        <RatingPanel movieId={movie.id} />
      </section>

      <footer className="flex min-h-[32px] items-center justify-end border-t border-[#e7e9ed] bg-white px-12 text-[8px] text-[#8e949e] max-[700px]:justify-center max-[700px]:px-4 max-[700px]:text-center">이 제품은 TMDB API를 사용하지만 TMDB에서 보증하거나 인증하지 않았습니다.</footer>
    </main>
  );
}