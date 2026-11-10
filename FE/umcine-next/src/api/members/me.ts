import { authApi } from "../auth-api";
import type { ApiResponse, MemberInfo } from "./models";

// GET /members/me는 토큰이 필요하므로 authApi로 요청해요.
async function getMe(): Promise<MemberInfo> {
  const response = await authApi.get("members/me").json<ApiResponse<MemberInfo>>();
  return response.result;
}

export { getMe };
