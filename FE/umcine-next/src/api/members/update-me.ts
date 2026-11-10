import { authApi } from "../auth-api";
import type { ApiResponse, MemberInfo } from "./models";

interface UpdateMeRequest {
  nickname: string;
}

// 성공 응답의 result가 내 정보 조회와 같은 형태라서 그대로 캐시에 넣을 수 있어요.
function updateMe(body: UpdateMeRequest) {
  return authApi.patch("members/me", { json: body }).json<ApiResponse<MemberInfo>>();
}

export { updateMe, type UpdateMeRequest };
