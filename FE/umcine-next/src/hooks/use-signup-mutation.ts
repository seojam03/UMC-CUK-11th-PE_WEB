import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { signup } from "../api/members/signup";
import { getApiErrorMessage } from "../utils/get-api-error-message";

// 7주차의 isSubmitting + try/catch를 useMutation으로 옮겼어요.
// 성공 처리는 onSuccess, 실패 처리는 onError로 가고, 진행 여부는 isPending으로 알 수 있어요.
export function useSignupMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: signup,
    onSuccess: (response) => {
      alert(response.message);
      router.push("/login");
    },
    onError: (error) => {
      alert(getApiErrorMessage(error, "회원가입에 실패했어요. 다시 시도해 주세요."));
    },
  });
}
