import { useAuthStore } from "../stores/auth-store";
import { apiClient } from "./api-client";

// 기존 apiClient 설정(서버 주소)을 이어받고, 인증 처리만 더한 인스턴스예요.
export const authApi = apiClient.extend({
  hooks: {
    beforeRequest: [
      ({ request }) => {
        // 컴포넌트 바깥이라 훅 대신 getState()로 요청 직전의 최신 토큰을 읽어요.
        const accessToken = useAuthStore.getState().accessToken;
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      ({ response }) => {
        // 토큰이 만료됐거나 잘못됐으면 비워서 로그인 전 상태로 돌려요.
        if (response.status === 401) {
          useAuthStore.getState().setAccessToken(null);
        }
      },
    ],
  },
});
