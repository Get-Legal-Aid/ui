import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "../auth/auth.types";
import type {
  GetLeaderboardParams,
  LeaderboardResponse,
  UserRankInfo,
  MyPositionResponse,
  UserPositionResponse,
  LeaderboardStatsResponse,
} from "./leaderboard.types";

/**
 * Get leaderboard with filtering and pagination
 */
export const getLeaderboard = async (
  params?: GetLeaderboardParams
): Promise<LeaderboardResponse> => {
  const response = await apiClient.get<ApiResponse<LeaderboardResponse>>(
    "/api/leaderboard",
    { params }
  );
  return response.data.data!;
};

/**
 * Get current user's position and rank information
 */
export const getMyPosition = async (): Promise<MyPositionResponse> => {
  const response = await apiClient.get<ApiResponse<MyPositionResponse>>(
    "/api/leaderboard/my-position"
  );
  return response.data.data!;
};

/**
 * Get specific user's position by user ID
 */
export const getUserPosition = async (userId: string): Promise<UserPositionResponse> => {
  const response = await apiClient.get<ApiResponse<UserPositionResponse>>(
    `/api/leaderboard/user/${userId}`
  );
  return response.data.data!;
};

/**
 * Get leaderboard statistics
 */
export const getLeaderboardStats = async (): Promise<LeaderboardStatsResponse> => {
  const response = await apiClient.get<ApiResponse<LeaderboardStatsResponse>>(
    "/api/leaderboard/stats"
  );
  return response.data.data!;
};

/**
 * Get current user's rank and nearby users (legacy function - keeping for compatibility)
 * @deprecated Use getMyPosition instead
 */
export const getUserRankInfo = async (): Promise<UserRankInfo> => {
  const response = await apiClient.get<ApiResponse<UserRankInfo>>(
    "/api/leaderboard/my-rank"
  );
  return response.data.data!;
};

/**
 * Get leaderboard for a specific practice area (legacy function - keeping for compatibility)
 * @deprecated Use getLeaderboard with practiceArea parameter instead
 */
export const getLeaderboardByPracticeArea = async (
  practiceArea: string,
  params?: Omit<GetLeaderboardParams, "practiceArea">
): Promise<LeaderboardResponse> => {
  const response = await apiClient.get<ApiResponse<LeaderboardResponse>>(
    `/api/leaderboard/practice-area/${encodeURIComponent(practiceArea)}`,
    { params }
  );
  return response.data.data!;
};

/**
 * Get leaderboard for a specific region (legacy function - keeping for compatibility)
 * @deprecated Use getLeaderboard with operatingRegion parameter instead
 */
export const getLeaderboardByRegion = async (
  region: string,
  params?: Omit<GetLeaderboardParams, "region">
): Promise<LeaderboardResponse> => {
  const response = await apiClient.get<ApiResponse<LeaderboardResponse>>(
    `/api/leaderboard/region/${encodeURIComponent(region)}`,
    { params }
  );
  return response.data.data!;
};