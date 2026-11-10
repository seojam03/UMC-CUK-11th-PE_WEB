// 9주차: Vite의 import.meta.env.VITE_* → Next.js의 process.env.NEXT_PUBLIC_*
// NEXT_PUBLIC_이 붙은 값만 빌드할 때 브라우저 코드에 들어가요. (붙지 않은 값은 서버에서만 읽을 수 있어요)
// process.env[변수] 처럼 동적으로 꺼내면 값이 들어가지 않으니 꼭 process.env.NEXT_PUBLIC_XXX 형태로 써요.
const tmdbApiBaseUrl = process.env.NEXT_PUBLIC_TMDB_API_BASE_URL;
const tmdbAccessToken = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
// 우리 백엔드(Spring) 주소. 따로 지정하지 않으면 로컬 서버를 사용해요.
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

if (!tmdbApiBaseUrl || !tmdbAccessToken) {
  throw new Error("TMDB 환경 변수가 필요해요.");
}

export const env = {
  tmdbApiBaseUrl,
  tmdbAccessToken,
  apiBaseUrl,
};
