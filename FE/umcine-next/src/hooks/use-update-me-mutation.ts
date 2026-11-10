import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { MemberInfo } from "../api/members/models";
import { updateMe } from "../api/members/update-me";
import { queryKeys } from "../api/query-keys";
import { getApiErrorMessage } from "../utils/get-api-error-message";

export function useUpdateMeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: (response) => {
      // 응답에 수정된 내 정보가 통째로 담겨 오므로 다시 조회하지 않고 캐시를 바로 바꿔요.
      // 헤더와 마이페이지처럼 같은 key를 쓰는 화면에 새 닉네임이 바로 보여요.
      queryClient.setQueryData<MemberInfo>(queryKeys.me, response.result);
    },
    onError: (error) => {
      alert(getApiErrorMessage(error, "내 정보 수정에 실패했어요. 다시 시도해 주세요."));
    },
  });
}
