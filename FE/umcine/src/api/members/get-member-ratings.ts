import { apiClient } from "../api-client";
import type { MemberRating } from "./models";

function getMemberRatings(memberId: number) {
  return apiClient
    .get(`members/${memberId}/ratings`)
    .json<MemberRating[]>();
}

export { getMemberRatings };
