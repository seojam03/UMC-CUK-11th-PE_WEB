import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addFavorite,
  getFavorites,
  getFavoriteStatus,
  removeFavorite,
  type Favorite,
  type FavoriteStatus,
} from "../api/favorites/favorites";
import { queryKeys } from "../api/query-keys";
import { useAuthStore } from "../stores/auth-store";
import { getApiErrorMessage } from "../utils/get-api-error-message";

// 내 즐겨찾기 목록. 카드가 여러 장이어도 같은 key라서 요청은 한 번만 가요.
export function useFavoriteListQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: queryKeys.favoriteList,
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
  });
}

// 영화 상세에서 이 영화를 즐겨찾기했는지 확인해요.
export function useFavoriteStatusQuery(movieId: number) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: queryKeys.favoriteStatus(movieId),
    queryFn: () => getFavoriteStatus(movieId),
    enabled: Boolean(accessToken),
  });
}

// 즐겨찾기 등록/해제. 넘겨받는 값은 "지금 즐겨찾기 상태인지"예요.
export function useToggleFavoriteMutation(movieId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isFavorite: boolean) => (isFavorite ? removeFavorite(movieId) : addFavorite(movieId)),
    onSuccess: (createdFavorite, wasFavorite) => {
      // 서버 응답으로 결과를 이미 알기 때문에, 목록과 여부를 다시 조회하지 않고 캐시를 직접 고쳐요.
      queryClient.setQueryData<FavoriteStatus>(queryKeys.favoriteStatus(movieId), { isFavorite: !wasFavorite });
      queryClient.setQueryData<Favorite[]>(queryKeys.favoriteList, (prev) => {
        if (!prev) return prev; // 아직 목록을 조회한 적이 없으면 다음에 열 때 새로 받아요.
        if (wasFavorite) return prev.filter((favorite) => favorite.movieId !== movieId);
        return createdFavorite ? [createdFavorite, ...prev] : prev; // 서버와 같은 최신순
      });
    },
    onError: (error) => {
      alert(getApiErrorMessage(error, "즐겨찾기를 변경하지 못했어요. 다시 시도해 주세요."));
      // 409·404는 화면과 서버 상태가 어긋났다는 뜻이라 서버 기준으로 다시 맞춰요.
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites });
    },
  });
}
