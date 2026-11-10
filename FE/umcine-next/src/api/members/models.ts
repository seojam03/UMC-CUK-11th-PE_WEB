interface AvailabilityResponse {
  available: boolean;
}

interface MemberRating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

// 6주차부터 서버가 쓰는 공통 응답 형식
interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

interface SignupResult {
  memberId: number;
  email: string;
  nickname: string;
}

// GET·PATCH /members/me 응답. memberId는 내 평점 목록(GET /members/{memberId}/ratings)을 찾을 때 써요.
interface MemberInfo {
  memberId: number;
  email: string;
  nickname: string;
  createdAt: string;
}

export type { ApiResponse, AvailabilityResponse, MemberInfo, MemberRating, SignupResult };
