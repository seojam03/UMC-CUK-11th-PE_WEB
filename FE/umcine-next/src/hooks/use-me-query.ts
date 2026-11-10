import { useQuery } from "@tanstack/react-query";

import { getMe } from "../api/members/me";
import { queryKeys } from "../api/query-keys";
import { useAuthStore } from "../stores/auth-store";

// 내 정보의 원본은 서버에 있으니 query 캐시 한 곳에서만 관리해요. (전역 store에 복사해 두지 않아요)
export function useMeQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: queryKeys.me,
    queryFn: getMe,
    // 토큰이 있을 때만 조회해요.
    enabled: Boolean(accessToken),
    // 내 정보는 자주 바뀌지 않아서 5분 동안은 다시 요청하지 않아요.
    staleTime: 5 * 60 * 1000,
    // 401로 토큰을 지운 뒤 같은 요청을 다시 보내지 않도록 재시도를 꺼요.
    retry: false,
  });
}
