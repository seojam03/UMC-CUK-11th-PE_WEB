import { authApi } from "../auth-api";
import type { ApiResponse, MemberRating } from "../members/models";

interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment: string | null;
}

type UpdateRatingRequest = Omit<CreateRatingRequest, "movieId">;

// 평점 등록·수정·삭제는 토큰으로 "누가"를 확인하므로 authApi로 요청해요.
// 조회(GET /members/{memberId}/ratings)는 공개 API라 기존 get-member-ratings.ts를 그대로 써요.

async function createRating(body: CreateRatingRequest): Promise<MemberRating> {
  const response = await authApi.post("ratings", { json: body }).json<ApiResponse<MemberRating>>();
  return response.result;
}

async function updateRating(ratingId: number, body: UpdateRatingRequest): Promise<MemberRating> {
  const response = await authApi.patch(`ratings/${ratingId}`, { json: body }).json<ApiResponse<MemberRating>>();
  return response.result;
}

async function deleteRating(ratingId: number): Promise<void> {
  await authApi.delete(`ratings/${ratingId}`).json<ApiResponse<null>>();
}

export { createRating, deleteRating, updateRating, type CreateRatingRequest, type UpdateRatingRequest };
