import { isHTTPError } from "ky";

// 서버가 보낸 공통 실패 응답({ isSuccess, code, message })의 message를 꺼내요. 없으면 fallback을 써요.
// ky 2는 실패 응답 본문을 error.data에 미리 파싱해 둬요.
export function getApiErrorMessage(error: unknown, fallback: string) {
  if (isHTTPError(error)) {
    const data = error.data;
    if (typeof data === "object" && data !== null && "message" in data && typeof data.message === "string") {
      return data.message;
    }
  }
  return fallback;
}
