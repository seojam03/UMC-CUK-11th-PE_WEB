// 같은 데이터는 어느 화면에서든 같은 key를 써야 캐시를 함께 쓰고, 한 번에 갱신할 수 있어요.
export const queryKeys = {
  me: ["members", "me"] as const,
  memberRatings: (memberId: number) => ["members", memberId, "ratings"] as const,
  // ["favorites"]로 무효화하면 목록과 영화별 여부가 모두 함께 무효화돼요.
  favorites: ["favorites"] as const,
  favoriteList: ["favorites", "list"] as const,
  favoriteStatus: (movieId: number) => ["favorites", "status", movieId] as const,
};
