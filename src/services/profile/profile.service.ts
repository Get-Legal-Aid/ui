import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/services/auth/auth.types";
import type {
  FullProfile,
  UpdateUserInfoRequest,
  UpdateLawyerProfileRequest,
  UpdateStudentProfileRequest,
  LawyerProfile,
  StudentProfile,
} from "./profile.types";

/**
 * Get full user profile including role-specific information
 */
export const getFullProfile = async (): Promise<FullProfile> => {
  const response = await apiClient.get<ApiResponse<FullProfile>>("/api/profile");
  return response.data.data!;
};

/**
 * Update basic user information (firstName, lastName)
 */
export const updateUserInfo = async (
  data: UpdateUserInfoRequest
): Promise<FullProfile> => {
  const response = await apiClient.patch<ApiResponse<FullProfile>>(
    "/api/profile",
    data
  );
  return response.data.data!;
};

/**
 * Update lawyer profile information
 */
export const updateLawyerProfile = async (
  data: UpdateLawyerProfileRequest
): Promise<LawyerProfile> => {
  const response = await apiClient.patch<ApiResponse<LawyerProfile>>(
    "/api/profile/lawyer",
    data
  );
  return response.data.data!;
};

/**
 * Update student profile information
 */
export const updateStudentProfile = async (
  data: UpdateStudentProfileRequest
): Promise<StudentProfile> => {
  const response = await apiClient.patch<ApiResponse<StudentProfile>>(
    "/api/profile/student",
    data
  );
  return response.data.data!;
};
