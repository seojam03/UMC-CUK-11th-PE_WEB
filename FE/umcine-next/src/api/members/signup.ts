import { apiClient } from "../api-client";
import type { ApiResponse, SignupResult } from "./models";

interface SignupRequest {
  email: string;
  nickname: string;
  password: string;
}

// 6주차 서버의 POST /members. passwordConfirm은 화면에서만 검사하므로 보내지 않아요.
function signup(body: SignupRequest) {
  return apiClient.post("members", { json: body }).json<ApiResponse<SignupResult>>();
}

export { signup, type SignupRequest };
