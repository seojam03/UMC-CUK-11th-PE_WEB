import type { TmdbMovieListItem } from "../../api/movies/models";
import type { Movie } from "../../types/movie";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "./tmdb-image";

// TMDB 목록 응답을 기존 영화 카드(MovieCard)가 쓰는 Movie 형태로 바꿔요.
export function toMovieCard(movie: TmdbMovieListItem): Movie {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    releaseDate: movie.release_date,
    posterPath: getTmdbPosterUrl(movie.poster_path) ?? "",
    backdropPath: getTmdbBackdropUrl(movie.backdrop_path) ?? "",
    genres: [],
    runtime: "",
    tagline: "",
    overview: movie.overview,
    isBookmarked: false,
  };
}
