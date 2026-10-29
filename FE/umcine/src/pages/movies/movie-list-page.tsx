import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import "../../index.css";
import { getMovies } from "../../api/movies/get-movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { useBookmark } from "../../hooks/useBookmark";
import { toMovieCard } from "../../utils/movies/to-movie-card";

// TMDB는 page를 500까지만 받아요.
const TMDB_MAX_PAGE = 500;

export function MovieListPage() {
  const { toggleBookmark } = useBookmark();
  const [page, setPage] = useState(1);

  // page를 query key에 넣어 페이지마다 캐시를 따로 저장해요.
  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const movies = (moviesQuery.data?.results ?? []).map(toMovieCard);
  const totalPages = Math.min(moviesQuery.data?.total_pages ?? 0, TMDB_MAX_PAGE);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f8fa] text-[#17191f]">
      <main id="movies" className="mx-auto w-full max-w-[1028px] flex-1 px-0 pb-16 pt-[18px] max-[1080px]:px-7 max-[700px]:px-4 max-[700px]:pb-12">
        <h1 className="mb-[10px] text-left text-[25px] font-extrabold tracking-[-1px] text-[#17191f]">영화 목록</h1>
        {moviesQuery.isPending ? (
          <p className="py-[45px] text-center text-[10px] text-[#8e949e]">영화를 불러오는 중이에요.</p>
        ) : moviesQuery.isError ? (
          <p className="py-[45px] text-center text-[10px] text-[#ef4444]">영화 목록을 불러오지 못했어요.</p>
        ) : movies.length === 0 ? (
          <p className="py-[45px] text-center text-[10px] text-[#8e949e]">표시할 영화가 없어요.</p>
        ) : (
          <>
            <MovieGrid movies={movies} onToggleBookmark={toggleBookmark} />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>
      <footer className="flex min-h-[32px] items-center justify-end border-t border-[#e7e9ed] bg-white px-12 text-[8px] text-[#8e949e] max-[1080px]:px-7 max-[700px]:justify-center max-[700px]:px-4">
        <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      </footer>
    </div>
  );
}
