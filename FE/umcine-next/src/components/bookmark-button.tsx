import Image from "next/image";
import { useRouter } from "next/navigation";

import { useFavoriteListQuery, useFavoriteStatusQuery, useToggleFavoriteMutation } from "../hooks/use-favorites";
import { useAuthStore } from "../stores/auth-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
}

// 8주차부터 즐겨찾기는 localStorage가 아니라 서버(POST·DELETE /favorites)에 저장해요.
// 로그인 전에는 저장할 주인이 없으니 로그인 화면으로 보내요.
function useFavoriteToggle(movieId: number, isFavorite: boolean) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const toggleMutation = useToggleFavoriteMutation(movieId);

  const toggle = () => {
    if (!accessToken) {
      alert("로그인 후 즐겨찾기할 수 있어요.");
      router.push("/login");
      return;
    }
    if (toggleMutation.isPending) return;
    toggleMutation.mutate(isFavorite);
  };

  return { toggle, isPending: toggleMutation.isPending };
}

// 목록·마이페이지 카드용. 카드마다 요청하지 않도록 내 즐겨찾기 목록 하나로 여부를 판단해요.
export function BookmarkButton({ movieId }: BookmarkButtonProps) {
  const favoriteListQuery = useFavoriteListQuery();
  const isBookmarked = favoriteListQuery.data?.some((favorite) => favorite.movieId === movieId) ?? false;
  const { toggle, isPending } = useFavoriteToggle(movieId, isBookmarked);

  return (
    <button
      className={cn(
        "absolute right-2 top-2 rounded p-1 text-white border-white/150 border transition-colors duration-200 disabled:opacity-60",
        isBookmarked ? "bg-blue-600 border-blue-600" : "bg-black/60",
      )}
      onClick={toggle}
      disabled={isPending}
      aria-label={isBookmarked ? "즐겨찾기 해제" : "즐겨찾기"}
      aria-pressed={isBookmarked}
      type="button"
    >
      <Image
        src={isBookmarked ? "/icons/movie-icons/bookmark.svg" : "/icons/movie-icons/bookmark-outline.svg"}
        alt=""
        className="h-4 w-4 object-contain invert" width={16} height={16} />
    </button>
  );
}

// 영화 상세용. GET /favorites/{movieId}로 이 영화 하나의 여부만 물어봐요.
export function DetailBookmarkButton({ movieId }: BookmarkButtonProps) {
  const favoriteStatusQuery = useFavoriteStatusQuery(movieId);
  const isBookmarked = favoriteStatusQuery.data?.isFavorite ?? false;
  const { toggle, isPending } = useFavoriteToggle(movieId, isBookmarked);

  return (
    <button
      className="inline-flex h-[29px] items-center gap-[5px] rounded-[5px] bg-[#4c63d9] px-[11px] text-[10px] font-bold text-white disabled:opacity-60"
      type="button"
      onClick={toggle}
      disabled={isPending || favoriteStatusQuery.isLoading}
      aria-label={isBookmarked ? "즐겨찾기 해제" : "즐겨찾기"}
      aria-pressed={isBookmarked}
    >
      <Image
        src={isBookmarked ? "/icons/movie-icons/bookmark.svg" : "/icons/movie-icons/bookmark-outline.svg"}
        alt=""
        className="h-4 w-4 object-contain invert" width={16} height={16} />
      {isPending ? "저장 중" : isBookmarked ? "즐겨찾기 해제" : "즐겨찾기"}
    </button>
  );
}
