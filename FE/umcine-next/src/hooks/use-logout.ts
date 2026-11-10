import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { queryKeys } from "../api/query-keys";
import { useAuthStore } from "../stores/auth-store";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  return () => {
    // 9주차: setAccessToken(null) 대신 logout()으로 "직접 로그아웃"을 표시해요.
    // Next.js의 router.push는 화면 전환을 transition으로 처리해서 이동이 끝날 때까지 지금 페이지가 남아 있어요.
    // 그 사이 보호 레이아웃이 빈 토큰을 보고 /login으로 보내 버리지 않도록 구분해 줘요.
    logout();
    // 다음에 로그인하는 사람에게 이전 사람의 정보가 보이지 않도록 캐시를 지워요.
    queryClient.removeQueries({ queryKey: queryKeys.me });
    queryClient.removeQueries({ queryKey: queryKeys.favorites });
    router.push("/");
  };
}
