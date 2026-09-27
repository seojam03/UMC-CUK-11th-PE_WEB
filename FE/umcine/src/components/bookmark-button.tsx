import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
}

export function BookmarkButton({ movieId }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  return (
    <button
      className={cn(
        "absolute right-2 top-2 rounded p-1 text-white border-white/150 border transition-colors duration-200",
        isBookmarked ? "bg-blue-600 border-blue-600" : "bg-black/60",
      )}
      onClick={() => toggleBookmark(movieId)}
      aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
      aria-pressed={isBookmarked}
      type="button"
    >
      <img 
        src={isBookmarked ? "/icons/movie-icons/bookmark.svg" : "/icons/movie-icons/bookmark-outline.svg"} 
        alt="" 
        className="h-4 w-4 object-contain invert" 
      />
    </button>
  );
}

export function DetailBookmarkButton({ movieId }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  return (
    // <button className="inline-flex h-[29px] items-center gap-[5px] rounded-[5px] bg-[#4c63d9] px-[11px] text-[10px] font-bold text-white"
    // type="button" onClick={() => setIsBookmarked((bookmarked) => !bookmarked)} aria-pressed={isBookmarked}>
	// 	<img className="h-[13px] w-[13px] invert" src={isBookmarked ? "/icons/movie-icons/bookmark.svg" : "/icons/movie-icons/bookmark-outline.svg"} alt="" />
	// 	{isBookmarked ? "찜했어요" : "찜하기"}
	// </button>
    <button
      className="inline-flex h-[29px] items-center gap-[5px] rounded-[5px] bg-[#4c63d9] px-[11px] text-[10px] font-bold text-white"
      type="button"
      onClick={() => toggleBookmark(movieId)}
      aria-label={isBookmarked ? "즐겨찾기 해제" : "즐겨찾기"}
      aria-pressed={isBookmarked}
    >
      <img 
        src={isBookmarked ? "/icons/movie-icons/bookmark.svg" : "/icons/movie-icons/bookmark-outline.svg"} 
        alt="" 
        className="h-4 w-4 object-contain invert" 
      />
      {isBookmarked ? "즐겨찾기 해제" : "즐겨찾기"}
    </button>
  );
}
