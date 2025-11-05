import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "../auth/auth.types";
import type { HealthCheckResponse } from "./health.types";

/**
 * Check API health status
 */
export const checkApiHealth = async (): Promise<HealthCheckResponse> => {
  const response = await apiClient.get<ApiResponse<HealthCheckResponse>>(
    "/api/health"
  );
  return response.data.data!;
};