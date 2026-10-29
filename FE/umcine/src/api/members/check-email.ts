import { apiClient } from "../api-client";
import type { AvailabilityResponse } from "./models";

function checkEmail(email: string) {
  return apiClient
    .get(`members/email/${encodeURIComponent(email)}`)
    .json<AvailabilityResponse>();
}

export { checkEmail };
