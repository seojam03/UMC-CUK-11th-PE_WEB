import { Link } from "@tanstack/react-router";
import { isHTTPError } from "ky";
import { useState, type SubmitEvent } from "react";

import { checkEmail } from "../../api/members/check-email";
import { checkNickname } from "../../api/members/check-nickname";
import { getMemberRatings } from "../../api/members/get-member-ratings";
import type { AvailabilityResponse, MemberRating } from "../../api/members/models";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

// 평점(우리 백엔드) + 영화 정보(TMDB)를 합친 화면용 데이터
type RatingWithMovie = MemberRating & {
  title: string | null;
  posterUrl: string | null;
};

export function MemberPage() {
  return (
    <main className="min-h-[calc(100vh-56px)] bg-[#f6f7f9] text-[#17191f]">
      <section className="mx-auto w-[min(calc(100%-76px),900px)] pt-[13px] pb-[30px] max-[700px]:w-[calc(100%-32px)]">
        <h1 className="mb-[10px] text-[19px] font-bold tracking-[-0.7px]">회원</h1>

        <div className="grid grid-cols-2 gap-[14px] max-[700px]:grid-cols-1">
          <AvailabilityCheckCard
            title="닉네임 중복 체크"
            label="닉네임"
            placeholder="예: 수현"
            request={checkNickname}
          />
          <AvailabilityCheckCard
            title="이메일 중복 체크"
            label="이메일"
            placeholder="예: noco@umc.com"
            request={checkEmail}
          />
        </div>

        <MemberRatingsCard />
      </section>
    </main>
  );
}

type AvailabilityCheckCardProps = {
  title: string;
  label: string;
  placeholder: string;
  request: (value: string) => Promise<AvailabilityResponse>;
};

function AvailabilityCheckCard({ title, label, placeholder, request }: AvailabilityCheckCardProps) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<{ value: string; available: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedValue = value.trim();
    if (!trimmedValue) return;

    setIsLoading(true);
    setResult(null);
    setErrorMessage(null);

    request(trimmedValue)
      .then((response) => setResult({ value: trimmedValue, available: response.available }))
      .catch(() => setErrorMessage("서버에 연결하지 못했어요. 백엔드 서버와 CORS 설정을 확인해 주세요."))
      .finally(() => setIsLoading(false));
  }

  return (
    <article className="rounded-[8px] border border-[#e4e6ea] bg-white p-[14px]">
      <h2 className="mb-2 text-[11px] font-bold">{title}</h2>
      <form className="flex h-[29px] items-center gap-2 rounded-[6px] border border-[#dfe2e7] bg-white px-2 pl-[11px] focus-within:ring-2 focus-within:ring-[#4c63d9]/30" onSubmit={handleSubmit}>
        <input
          className="min-w-0 flex-1 bg-transparent p-0 text-[9px] text-[#343840] outline-none placeholder:text-[#9da3ad]"
          aria-label={label}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
        />
        <button className="h-[23px] rounded bg-[#17191f] px-2 text-[8px] font-bold text-white disabled:opacity-50" type="submit" disabled={isLoading}>
          {isLoading ? "확인 중..." : "중복 확인"}
        </button>
      </form>

      <p className="mt-2 min-h-[14px] text-[9px]" aria-live="polite">
        {errorMessage ? (
          <span className="text-[#ef4444]">{errorMessage}</span>
        ) : result ? (
          result.available ? (
            <span className="text-[#16a34a]">‘{result.value}’은(는) 사용할 수 있는 {label}이에요.</span>
          ) : (
            <span className="text-[#ef4444]">‘{result.value}’은(는) 이미 사용 중인 {label}이에요.</span>
          )
        ) : null}
      </p>
    </article>
  );
}

function MemberRatingsCard() {
  const [memberIdText, setMemberIdText] = useState("1");
  const [ratings, setRatings] = useState<RatingWithMovie[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadRatings(memberId: number) {
    setIsLoading(true);
    setRatings(null);
    setErrorMessage(null);

    try {
      const memberRatings = await getMemberRatings(memberId);

      // 영화 정보는 TMDB에서 직접 가져와요. 한 편이 실패해도 평점 목록은 보여줘요.
      const ratingsWithMovie = await Promise.all(
        memberRatings.map(async (rating) => {
          try {
            const movie = await getMovieDetail(rating.movieId);
            return { ...rating, title: movie.title, posterUrl: getTmdbPosterUrl(movie.poster_path) };
          } catch {
            return { ...rating, title: null, posterUrl: null };
          }
        }),
      );

      setRatings(ratingsWithMovie);
    } catch (error) {
      setErrorMessage(
        isHTTPError(error) && error.response.status === 404
          ? "존재하지 않는 유저예요."
          : "평점을 불러오지 못했어요. 백엔드 서버와 CORS 설정을 확인해 주세요.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const memberId = Number(memberIdText);
    if (!Number.isInteger(memberId) || memberId < 1) {
      setErrorMessage("회원 번호는 1 이상의 숫자로 입력해 주세요.");
      return;
    }
    loadRatings(memberId);
  }

  return (
    <article className="mt-[14px] rounded-[8px] border border-[#e4e6ea] bg-white p-[14px]">
      <h2 className="mb-2 text-[11px] font-bold">유저별 평점 조회</h2>
      <form className="flex h-[29px] w-[min(100%,260px)] items-center gap-2 rounded-[6px] border border-[#dfe2e7] bg-white px-2 pl-[11px] focus-within:ring-2 focus-within:ring-[#4c63d9]/30" onSubmit={handleSubmit}>
        <span className="text-[9px] text-[#8e949e]">회원 번호</span>
        <input
          className="min-w-0 flex-1 bg-transparent p-0 text-[9px] text-[#343840] outline-none"
          aria-label="회원 번호"
          inputMode="numeric"
          value={memberIdText}
          onChange={(event) => setMemberIdText(event.target.value)}
        />
        <button className="h-[23px] rounded bg-[#17191f] px-2 text-[8px] font-bold text-white disabled:opacity-50" type="submit" disabled={isLoading}>
          조회
        </button>
      </form>

      {isLoading ? (
        <p className="py-[30px] text-center text-[10px] text-[#8e949e]">평점을 불러오는 중입니다...</p>
      ) : errorMessage ? (
        <p className="py-[30px] text-center text-[10px] text-[#ef4444]">{errorMessage}</p>
      ) : ratings === null ? (
        <p className="py-[30px] text-center text-[10px] text-[#8e949e]">회원 번호를 입력하고 조회해 보세요.</p>
      ) : ratings.length === 0 ? (
        <p className="py-[30px] text-center text-[10px] text-[#8e949e]">아직 남긴 평점이 없어요.</p>
      ) : (
        <ul className="mt-2">
          {ratings.map((rating) => (
            <li className="grid grid-cols-[44px_minmax(0,1fr)] gap-x-[10px] border-b border-[#e4e6ea] py-[10px] last:border-b-0" key={rating.ratingId}>
              {rating.posterUrl ? (
                <img className="h-[66px] w-[44px] rounded object-cover" src={rating.posterUrl} alt={`${rating.title} 포스터`} />
              ) : (
                <div className="h-[66px] w-[44px] rounded bg-[#e4e6ea]" aria-hidden="true" />
              )}
              <div className="min-w-0">
                <div className="flex items-baseline gap-[6px]">
                  <Link
                    className="overflow-hidden text-ellipsis whitespace-nowrap text-[10px] font-bold text-[#17191f] no-underline"
                    to="/movies/$movieId"
                    params={{ movieId: String(rating.movieId) }}
                  >
                    {rating.title ?? `영화 #${rating.movieId}`}
                  </Link>
                  <span className="text-[9px] text-[#f5a524]" aria-label={`별점 ${rating.score}점`}>
                    {"★".repeat(rating.score)}
                    <span className="text-[#d5d8de]">{"★".repeat(5 - rating.score)}</span>
                  </span>
                </div>
                <p className="mt-1 text-[9px] text-[#555b66]">{rating.comment ?? "코멘트 없음"}</p>
                <p className="mt-1 text-[7px] text-[#a2a7b0]">{new Date(rating.createdAt).toLocaleString("ko-KR")}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
