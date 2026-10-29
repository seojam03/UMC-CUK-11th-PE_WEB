const tmdbApiBaseUrl = import.meta.env.VITE_TMDB_API_BASE_URL;
const tmdbAccessToken = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
// 우리 백엔드(Spring) 주소. 따로 지정하지 않으면 로컬 서버를 사용해요.
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

if (!tmdbApiBaseUrl || !tmdbAccessToken) {
  throw new Error("TMDB 환경 변수가 필요해요.");
}

export const env = {
  tmdbApiBaseUrl,
  tmdbAccessToken,
  apiBaseUrl,
};
