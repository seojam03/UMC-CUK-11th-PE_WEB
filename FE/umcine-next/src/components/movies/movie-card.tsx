import type { Movie } from "../../types/movie";
import Image from "next/image";
import Link from "next/link";
// import { cn } from "../../utils/cn";
import { BookmarkButton } from '../bookmark-button';

type MovieCardProps = {
  movie: Movie;
  // 첫 화면에 바로 보이는 카드면 지연 로딩하지 않고 바로 받아요. (LCP 경고 해결)
  isAboveFold?: boolean;
  // onToggleBookmark: (movieId: number) => void;
};

export default function MovieCard({ movie, isAboveFold = false }: MovieCardProps) {
  return (
    <article className="min-w-0">
      <div className="relative aspect-[0.69] overflow-hidden rounded-[7px] bg-[#dfe2e8]">
        {/* fill 이미지는 가장 가까운 부모가 relative/absolute여야 해서 Link(a 태그)에 relative를 줬어요. */}
        <Link href={`/movies/${movie.id}`} className="relative block h-full w-full">
          {/* next/image: 화면 너비에 맞는 크기(sizes)의 webp로 바꿔서 내려줘요. 포스터가 없으면 회색 배경만 보여요. */}
          {movie.posterPath ? (
            <Image
              src={movie.posterPath}
              alt={movie.title}
              fill
              sizes="(max-width: 700px) 33vw, (max-width: 1280px) 25vw, 200px"
              loading={isAboveFold ? "eager" : "lazy"}
              className="object-cover"
            />
          ) : null}
        </Link>

        <BookmarkButton movieId={movie.id}></BookmarkButton>
        {/* <button
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
        </button> */}
      </div>
      
      <div className="pt-[5px] text-left">
        <h2 className="overflow-hidden text-ellipsis whitespace-nowrap text-[10px] font-bold leading-[1.25] text-[#22252b]">{movie.title}</h2>
        <p className="mt-0.5 text-[8px] leading-[1.2] text-[#9aa0aa]">{movie.releaseDate}</p>
      </div>
    </article>
  );
}
