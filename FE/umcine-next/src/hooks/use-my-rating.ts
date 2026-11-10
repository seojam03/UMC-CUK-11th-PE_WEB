import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getMemberRatings } from "../api/members/get-member-ratings";
import type { MemberRating } from "../api/members/models";
import { queryKeys } from "../api/query-keys";
import { createRating, deleteRating, updateRating, type UpdateRatingRequest } from "../api/ratings/ratings";
import { getApiErrorMessage } from "../utils/get-api-error-message";

// 서버에 "영화별 내 평점" API는 없어서, 내 평점 목록(GET /members/{memberId}/ratings)에서 이 영화를 찾아요.
export function useMyRatingQuery(memberId: number | undefined, movieId: number) {
  return useQuery({
    queryKey: queryKeys.memberRatings(memberId ?? 0),
    queryFn: () => getMemberRatings(memberId!),
    enabled: memberId !== undefined,
    select: (ratings) => ratings.find((rating) => rating.movieId === movieId) ?? null,
  });
}

// 등록·수정·삭제 모두 응답(또는 요청)으로 결과를 알 수 있어서, 목록 캐시를 직접 고쳐요.
export function useRatingMutations(memberId: number, movieId: number) {
  const queryClient = useQueryClient();
  const key = queryKeys.memberRatings(memberId);

  const onError = (fallback: string) => (error: unknown) => {
    alert(getApiErrorMessage(error, fallback));
    queryClient.invalidateQueries({ queryKey: key });
  };

  const createMutation = useMutation({
    mutationFn: (body: UpdateRatingRequest) => createRating({ movieId, ...body }),
    onSuccess: (created) => {
      queryClient.setQueryData<MemberRating[]>(key, (prev) => (prev ? [created, ...prev] : prev));
      alert("평점을 등록했어요.");
    },
    onError: onError("평점을 등록하지 못했어요. 다시 시도해 주세요."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ ratingId, body }: { ratingId: number; body: UpdateRatingRequest }) => updateRating(ratingId, body),
    onSuccess: (updated) => {
      queryClient.setQueryData<MemberRating[]>(key, (prev) =>
        prev?.map((rating) => (rating.ratingId === updated.ratingId ? updated : rating)),
      );
      alert("평점을 수정했어요.");
    },
    onError: onError("평점을 수정하지 못했어요. 다시 시도해 주세요."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRating,
    onSuccess: (_, ratingId) => {
      queryClient.setQueryData<MemberRating[]>(key, (prev) => prev?.filter((rating) => rating.ratingId !== ratingId));
      alert("평점을 삭제했어요.");
    },
    onError: onError("평점을 삭제하지 못했어요. 다시 시도해 주세요."),
  });

  return { createMutation, updateMutation, deleteMutation };
}
