import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFullProfile,
  updateUserInfo,
  updateLawyerProfile,
  updateStudentProfile,
} from "./profile.service";
import type {
  UpdateUserInfoRequest,
  UpdateLawyerProfileRequest,
  UpdateStudentProfileRequest,
} from "./profile.types";

/**
 * Hook for getting full user profile
 */
export const useGetFullProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getFullProfile,
  });
};

/**
 * Hook for updating basic user info
 */
export const useUpdateUserInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateUserInfoRequest) => updateUserInfo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
};

/**
 * Hook for updating lawyer profile
 */
export const useUpdateLawyerProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateLawyerProfileRequest) => updateLawyerProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

/**
 * Hook for updating student profile
 */
export const useUpdateStudentProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateStudentProfileRequest) => updateStudentProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
