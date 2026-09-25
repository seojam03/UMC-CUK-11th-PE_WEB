import type { Movie } from "../../types/movie";
import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

type MovieCardProps = {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
};

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="min-w-0">
      <div className="relative aspect-[0.69] overflow-hidden rounded-[7px] bg-[#dfe2e8]">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <img src={movie.posterPath} alt={movie.title} className="block h-full w-full object-cover" />
        </Link>
        <button
          className={cn(
            "absolute right-2 top-2 rounded p-1 text-white border-white/150 border transition-colors duration-200",
            movie.isBookmarked ? "bg-blue-600 border-blue-600" : "bg-black/60",
          )}
          onClick={() => onToggleBookmark(movie.id)}
          aria-label={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
          aria-pressed={movie.isBookmarked}
          type="button"
        >
        <img src={movie.isBookmarked ? "/icons/movie-icons/bookmark.svg" : "/icons/movie-icons/bookmark-outline.svg"} alt="" className="h-4 w-4 object-contain invert" />
        </button>
      </div>
      
      <div className="pt-[5px] text-left">
        <h2 className="overflow-hidden text-ellipsis whitespace-nowrap text-[10px] font-bold leading-[1.25] text-[#22252b]">{movie.title}</h2>
        <p className="mt-0.5 text-[8px] leading-[1.2] text-[#9aa0aa]">{movie.releaseDate}</p>
      </div>
    </article>
  );
}
