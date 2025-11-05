import { useQuery } from "@tanstack/react-query";
import {
  getLeaderboard,
  getUserRankInfo,
  getLeaderboardByPracticeArea,
  getLeaderboardByRegion,
  getMyPosition,
  getUserPosition,
  getLeaderboardStats,
} from "./leaderboard.service";
import type { GetLeaderboardParams } from "./leaderboard.types";

/**
 * Hook for getting leaderboard with filtering and pagination
 */
export const useGetLeaderboard = (params?: GetLeaderboardParams) => {
  return useQuery({
    queryKey: ["leaderboard", params],
    queryFn: () => getLeaderboard(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook for getting current user's rank and nearby users
 */
export const useGetUserRankInfo = () => {
  return useQuery({
    queryKey: ["leaderboard", "my-rank"],
    queryFn: getUserRankInfo,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook for getting leaderboard by practice area
 */
export const useGetLeaderboardByPracticeArea = (
  practiceArea: string,
  params?: Omit<GetLeaderboardParams, "practiceArea">
) => {
  return useQuery({
    queryKey: ["leaderboard", "practice-area", practiceArea, params],
    queryFn: () => getLeaderboardByPracticeArea(practiceArea, params),
    enabled: !!practiceArea,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook for getting leaderboard by region
 */
export const useGetLeaderboardByRegion = (
  region: string,
  params?: Omit<GetLeaderboardParams, "region">
) => {
  return useQuery({
    queryKey: ["leaderboard", "region", region, params],
    queryFn: () => getLeaderboardByRegion(region, params),
    enabled: !!region,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook for getting current user's position and rank information
 */
export const useGetMyPosition = () => {
  return useQuery({
    queryKey: ["leaderboard", "my-position"],
    queryFn: getMyPosition,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook for getting specific user's position by user ID
 */
export const useGetUserPosition = (userId: string) => {
  return useQuery({
    queryKey: ["leaderboard", "user-position", userId],
    queryFn: () => getUserPosition(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook for getting leaderboard statistics
 */
export const useGetLeaderboardStats = () => {
  return useQuery({
    queryKey: ["leaderboard", "stats"],
    queryFn: getLeaderboardStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};