import { useState } from "react";
import "../../index.css";
import { movies as initialMovies } from "../../data/movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import type { Movie } from "../../types/movie";

const MOVIES_PER_PAGE = 10;

export function MovieListPage() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(movies.length / MOVIES_PER_PAGE));
  const firstMovieIndex = (currentPage - 1) * MOVIES_PER_PAGE;
  const visibleMovies = movies.slice(
    firstMovieIndex,
    firstMovieIndex + MOVIES_PER_PAGE
  );

  const handleToggleBookmark = (movieId: number) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie
      )
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f8fa] text-[#17191f]">
      <main id="movies" className="mx-auto w-full max-w-[1028px] flex-1 px-0 pb-16 pt-[18px] max-[1080px]:px-7 max-[700px]:px-4 max-[700px]:pb-12">
        <h1 className="mb-[10px] text-left text-[25px] font-extrabold tracking-[-1px] text-[#17191f]">영화 목록</h1>
        <MovieGrid
          movies={visibleMovies}
          onToggleBookmark={handleToggleBookmark}
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