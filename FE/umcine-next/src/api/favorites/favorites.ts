import { authApi } from "../auth-api";
import type { ApiResponse } from "../members/models";

interface Favorite {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

interface FavoriteStatus {
  isFavorite: boolean;
}

// 즐겨찾기는 모두 "로그인한 나"의 데이터라 authApi로 요청해요. memberId는 서버가 토큰에서 꺼내요.

// GET /favorites — 최근에 등록한 순서
async function getFavorites(): Promise<Favorite[]> {
  const response = await authApi.get("favorites").json<ApiResponse<Favorite[]>>();
  return response.result;
}

// GET /favorites/{movieId} — 즐겨찾기하지 않았어도 오류가 아니라 isFavorite: false가 와요.
async function getFavoriteStatus(movieId: number): Promise<FavoriteStatus> {
  const response = await authApi.get(`favorites/${movieId}`).json<ApiResponse<FavoriteStatus>>();
  return response.result;
}

// POST /favorites
async function addFavorite(movieId: number): Promise<Favorite> {
  const response = await authApi.post("favorites", { json: { movieId } }).json<ApiResponse<Favorite>>();
  return response.result;
}

// DELETE /favorites/{movieId}
async function removeFavorite(movieId: number): Promise<void> {
  await authApi.delete(`favorites/${movieId}`).json<ApiResponse<null>>();
}

export { addFavorite, getFavorites, getFavoriteStatus, removeFavorite, type Favorite, type FavoriteStatus };
