"use client";

import { useQueries } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { BookmarkButton } from "../../components/bookmark-button";
import Pagination from "../../components/movies/pagination";
import { ProfileAvatar } from "../../components/profile-avatar";
import { useFavoriteListQuery } from "../../hooks/use-favorites";
import { useMeQuery } from "../../hooks/use-me-query";
import { useProfileImageStore } from "../../stores/profile-image-store";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

const FAVORITES_PER_PAGE = 10;

// 8주차: 임시 데이터 대신 GET /members/me(내 정보)와 GET /favorites(내 즐겨찾기)를 보여줘요.
export function MyPage() {
  const meQuery = useMeQuery();
  const profileImageUrl = useProfileImageStore((state) => state.profileImageUrl);

  return (
    <main className="min-h-[calc(100vh-56px)] bg-[#f6f7f9] text-[#17191f]">
      <section className="mx-auto w-[min(calc(100%-76px),900px)] pt-[22px] pb-[30px] max-[700px]:w-[calc(100%-32px)]">
        <div className="mb-[14px] flex items-center justify-between">
          <h1 className="text-[25px] font-extrabold tracking-[-1px]">내 정보</h1>
          <Link
            className="grid h-[28px] place-items-center rounded-[6px] bg-[#4c63d9] px-3 text-[10px] font-bold text-white no-underline"
            href="/my/edit"
          >
            정보 수정
          </Link>
        </div>

        <article className="rounded-[8px] border border-[#e4e6ea] bg-white p-[16px]">
          <h2 className="mb-3 text-[11px] font-bold">기본 정보</h2>
          <div className="flex items-center gap-4">
            <ProfileAvatar className="h-[52px] w-[52px]" imageUrl={profileImageUrl} />
            {meQuery.isError ? (
              <p className="text-[10px] text-[#ef4444]">내 정보를 불러오지 못했어요.</p>
            ) : (
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-[6px] text-[10px]">
                <dt className="text-[#8e949e]">닉네임</dt>
                <dd className="font-bold">{meQuery.data?.nickname ?? "불러오는 중"}</dd>
                <dt className="text-[#8e949e]">이메일</dt>
                <dd className="font-bold">{meQuery.data?.email ?? "불러오는 중"}</dd>
                <dt className="text-[#8e949e]">가입일</dt>
                <dd className="font-bold">
                  {meQuery.data ? new Date(meQuery.data.createdAt).toLocaleDateString("ko-KR") : "불러오는 중"}
                </dd>
              </dl>
            )}
          </div>
        </article>

        <FavoriteMovies />
      </section>
    </main>
  );
}

// 서버에 저장한 내 즐겨찾기(GET /favorites, 최근 등록순)를 보여줘요. 영화 정보는 TMDB에서 가져와요.
function FavoriteMovies() {
  const favoriteListQuery = useFavoriteListQuery();
  const bookmarkedMovieIds = favoriteListQuery.data?.map((favorite) => favorite.movieId) ?? [];
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(bookmarkedMovieIds.length / FAVORITES_PER_PAGE));
  // 즐겨찾기를 해제해서 페이지 수가 줄어도 빈 페이지가 보이지 않게 해요.
  const currentPage = Math.min(page, totalPages);
  const pageMovieIds = bookmarkedMovieIds.slice((currentPage - 1) * FAVORITES_PER_PAGE, currentPage * FAVORITES_PER_PAGE);

  // 상세 페이지와 같은 query key를 써서 이미 본 영화는 캐시를 재사용해요.
  const movieQueries = useQueries({
    queries: pageMovieIds.map((movieId) => ({
      queryKey: ["movies", "detail", movieId],
      queryFn: () => getMovieDetail(movieId),
      staleTime: 30 * 1000,
    })),
  });

  return (
    <section className="mt-[22px]">
      <h2 className="mb-3 text-[13px] font-bold">
        내 즐겨찾기 <span className="text-[10px] font-normal text-[#8e949e]">{bookmarkedMovieIds.length}편</span>
      </h2>

      {favoriteListQuery.isPending ? (
        <p className="rounded-[8px] border border-dashed border-[#dfe2e7] bg-white py-10 text-center text-[10px] text-[#8e949e]">
          즐겨찾기를 불러오는 중입니다...
        </p>
      ) : favoriteListQuery.isError ? (
        <p className="rounded-[8px] border border-dashed border-[#dfe2e7] bg-white py-10 text-center text-[10px] text-[#ef4444]">
          즐겨찾기를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
        </p>
      ) : bookmarkedMovieIds.length === 0 ? (
        <p className="rounded-[8px] border border-dashed border-[#dfe2e7] bg-white py-10 text-center text-[10px] text-[#8e949e]">
          아직 즐겨찾기한 영화가 없어요. 영화 카드의 북마크 버튼을 눌러 추가해 보세요.
        </p>
      ) : (
        <div className="grid grid-cols-5 gap-[14px] max-[900px]:grid-cols-4 max-[700px]:grid-cols-3 max-[420px]:grid-cols-2">
          {pageMovieIds.map((movieId, index) => {
            const movie = movieQueries[index]?.data;
            const posterUrl = movie ? getTmdbPosterUrl(movie.poster_path) : null;

            return (
              <article className="min-w-0" key={movieId}>
                <div className="relative aspect-[0.69] overflow-hidden rounded-[7px] bg-[#dfe2e8]">
                  <Link href={`/movies/${movieId}`} className="relative block h-full w-full">
                    {posterUrl ? (
                      <Image className="object-cover" src={posterUrl} alt={movie?.title ?? ""} fill sizes="(max-width: 420px) 50vw, (max-width: 700px) 33vw, 180px" />
                    ) : null}
                  </Link>
                  <BookmarkButton movieId={movieId} />
                </div>
                <div className="pt-[5px]">
                  <h3 className="truncate text-[10px] font-bold leading-[1.25] text-[#22252b]">
                    {movie?.title ?? (movieQueries[index]?.isError ? "영화 정보를 불러오지 못했어요." : "불러오는 중")}
                  </h3>
                  <p className="mt-0.5 text-[8px] leading-[1.2] text-[#9aa0aa]">{movie?.release_date ?? ""}</p>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
    </section>
  );
}
