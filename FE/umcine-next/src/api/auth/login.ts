import { apiClient } from "../api-client";
import type { ApiResponse } from "../members/models";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResult {
  nickname: string;
  accessToken: string;
}

// 로그인은 토큰이 없을 때 하는 요청이라 인증 처리가 없는 apiClient로 보내요.
function login(body: LoginRequest) {
  return apiClient.post("auth/login", { json: body }).json<ApiResponse<LoginResult>>();
}

export { login, type LoginRequest };
