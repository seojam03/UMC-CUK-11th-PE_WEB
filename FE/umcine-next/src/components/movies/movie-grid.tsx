import type { Movie } from "../../types/movie";
import MovieCard from "./movie-card";

type MovieGridProps = {
  movies: Movie[];
};

export default function MovieGrid({ movies }: MovieGridProps) {
  return (
    <section className="grid grid-cols-3 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {movies.map((movie, index) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isAboveFold={index < 5}
        />
      ))}
    </section>
  );
}
