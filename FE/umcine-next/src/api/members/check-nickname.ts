import { apiClient } from "../api-client";
import type { AvailabilityResponse } from "./models";

function checkNickname(nickname: string) {
  return apiClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<AvailabilityResponse>();
}

export { checkNickname };
