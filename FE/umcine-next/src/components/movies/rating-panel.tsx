import Image from "next/image";
import { useState, type SubmitEvent } from "react";
import Link from "next/link";

import type { MemberRating } from "../../api/members/models";
import { useMeQuery } from "../../hooks/use-me-query";
import { useMyRatingQuery, useRatingMutations } from "../../hooks/use-my-rating";
import { useAuthStore } from "../../stores/auth-store";

const MAX_COMMENT_LENGTH = 500;

// 영화 상세의 "내 평점" 영역이에요. 로그인 상태 → 내 정보(memberId) → 내 평점 목록 순서로 서버 상태를 이어서 불러와요.
export function RatingPanel({ movieId }: { movieId: number }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useMeQuery();
  const myRatingQuery = useMyRatingQuery(meQuery.data?.memberId, movieId);

  return (
    <aside className="border-l border-[#dfe2e7] pl-5 max-[700px]:mt-7 max-[700px]:border-l-0 max-[700px]:border-t max-[700px]:pl-0 max-[700px]:pt-[22px]">
      <h2 className="mb-[5px] text-[14px] font-bold">내 평점</h2>

      {!accessToken ? (
        <p className="text-[9px] leading-[1.6] text-[#9aa0aa]">
          평점을 남기려면{" "}
          <Link className="font-bold text-[#4c63d9]" href="/login">
            로그인
          </Link>
          해 주세요.
        </p>
      ) : meQuery.isError || myRatingQuery.isError ? (
        <p className="text-[9px] text-[#ef4444]">내 평점을 불러오지 못했어요.</p>
      ) : !meQuery.data || myRatingQuery.isPending ? (
        <p className="text-[9px] text-[#9aa0aa]">내 평점을 불러오는 중입니다...</p>
      ) : (
        // 등록·수정·삭제로 평점이 바뀌면 key가 바뀌어 폼이 새 값으로 다시 시작해요.
        <RatingForm
          key={myRatingQuery.data?.ratingId ?? "new"}
          memberId={meQuery.data.memberId}
          movieId={movieId}
          myRating={myRatingQuery.data ?? null}
        />
      )}
    </aside>
  );
}

interface RatingFormProps {
  memberId: number;
  movieId: number;
  myRating: MemberRating | null;
}

function RatingForm({ memberId, movieId, myRating }: RatingFormProps) {
  const { createMutation, updateMutation, deleteMutation } = useRatingMutations(memberId, movieId);

  const [score, setScore] = useState(myRating?.score ?? 0);
  const [comment, setComment] = useState(myRating?.comment ?? "");

  const isSaving = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;
  const trimmedComment = comment.trim();
  const isChanged = !myRating || score !== myRating.score || trimmedComment !== (myRating.comment ?? "");
  const canSave = score > 0 && isChanged && !isSaving;

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSave) return;

    // 후기는 선택이라 비어 있으면 null로 보내요.
    const body = { score, comment: trimmedComment || null };
    if (myRating) {
      updateMutation.mutate({ ratingId: myRating.ratingId, body });
    } else {
      createMutation.mutate(body);
    }
  };

  const handleDelete = () => {
    if (!myRating || isSaving) return;
    if (!confirm("내 평점을 삭제할까요?")) return;
    deleteMutation.mutate(myRating.ratingId);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <p className="mb-[9px] text-[9px] text-[#9aa0aa]">
        {myRating ? "남긴 평점을 수정하거나 삭제할 수 있어요." : "별점은 필수, 후기는 선택이에요."}
      </p>
      <div className="mb-1.5 flex gap-1" aria-label={`평점 ${score}점`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="grid h-[25px] w-[25px] place-items-center rounded border border-[#dfe2e7] bg-white disabled:opacity-60"
            onClick={() => setScore(star)}
            disabled={isSaving}
            aria-label={`${star}점`}
          >
            <Image
              className="h-[15px] w-[15px]"
              src={`/icons/movie-icons/${star <= score ? "star.svg" : "star-outline.svg"}`}
              alt="" width={15} height={15} />
          </button>
        ))}
      </div>
      <textarea
        className="box-border h-[68px] w-full resize-none rounded-[5px] border border-[#dfe2e7] bg-white p-[10px] text-[9px] text-[#50545c] outline-none placeholder:text-[#a8adb6]"
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        maxLength={MAX_COMMENT_LENGTH}
        disabled={isSaving}
        placeholder="영화를 보고 느낀 점을 남겨보세요."
      />
      <p className="text-right text-[8px] text-[#a8adb6]">
        {comment.length}/{MAX_COMMENT_LENGTH}
      </p>
      <button
        className="mt-[5px] h-[27px] w-full rounded-[5px] bg-[#17191f] text-[9px] font-bold text-white disabled:opacity-40"
        type="submit"
        disabled={!canSave}
      >
        {createMutation.isPending || updateMutation.isPending ? "저장 중" : myRating ? "평점 수정" : "평점 저장"}
      </button>
      {myRating ? (
        <button
          className="mt-[5px] h-[27px] w-full rounded-[5px] border border-[#ef4444] bg-white text-[9px] font-bold text-[#ef4444] disabled:opacity-40"
          type="button"
          onClick={handleDelete}
          disabled={isSaving}
        >
          {deleteMutation.isPending ? "삭제 중" : "평점 삭제"}
        </button>
      ) : null}
    </form>
  );
}
