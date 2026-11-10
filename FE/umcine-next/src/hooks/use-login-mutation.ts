import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { login } from "../api/auth/login";
import { queryKeys } from "../api/query-keys";
import { useAuthStore } from "../stores/auth-store";
import { getApiErrorMessage } from "../utils/get-api-error-message";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      setAccessToken(response.result.accessToken);
      alert(`${response.result.nickname}님, 환영해요!`);
      // 로그인한 사람이 바뀌었으니 staleTime이 남아 있어도 내 정보와 즐겨찾기를 다시 조회하게 해요.
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites });
      router.push("/");
    },
    onError: (error) => {
      alert(getApiErrorMessage(error, "로그인에 실패했어요. 다시 시도해 주세요."));
    },
  });
}
