import { useState } from "react";
import "../../index.css";
import { movies as initialMovies } from "../../data/movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { useBookmark } from "../../hooks/useBookmark";

const MOVIES_PER_PAGE = 10;

export function MovieListPage() {
  const { bookmarks,  toggleBookmark } = useBookmark();
  // const [movies, setMovies] = useState<Movie[]>(initialMovies);

  // 로컬 state로 영화 데이터를 복사해서 들고 있을 필요가 없습니다.
  // 원본 initialMovies 배열과 커스텀 훅의 bookmarks 배열을 실시간으로 결합합니다.
  const moviesWithBookmarks = initialMovies.map((movie) => ({
    ...movie,
    isBookmarked: bookmarks.includes(movie.id),
  }));

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(moviesWithBookmarks.length / MOVIES_PER_PAGE));
  const firstMovieIndex = (currentPage - 1) * MOVIES_PER_PAGE;
  const visibleMovies = moviesWithBookmarks.slice(
    firstMovieIndex,
    firstMovieIndex + MOVIES_PER_PAGE
  );

  // const handleToggleBookmark = (movieId: number) => {
  //   setMovies((prevMovies) =>
  //     prevMovies.map((movie) =>
  //       movie.id === movieId
  //         ? { ...movie, isBookmarked: !movie.isBookmarked }
  //         : movie
  //     )
  //   );
  // };

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f8fa] text-[#17191f]">
      <main id="movies" className="mx-auto w-full max-w-[1028px] flex-1 px-0 pb-16 pt-[18px] max-[1080px]:px-7 max-[700px]:px-4 max-[700px]:pb-12">
        <h1 className="mb-[10px] text-left text-[25px] font-extrabold tracking-[-1px] text-[#17191f]">영화 목록</h1>
        <MovieGrid
          movies={visibleMovies}
          onToggleBookmark={toggleBookmark} // 여기서 toggleBookmark를 사용하여 북마크 상태를 토글합니다.
          // onToggleBookmark={handleToggleBookmark}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>
      <footer className="flex min-h-[32px] items-center justify-end border-t border-[#e7e9ed] bg-white px-12 text-[8px] text-[#8e949e] max-[1080px]:px-7 max-[700px]:justify-center max-[700px]:px-4">
        <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      </footer>
    </div>

  );
}

