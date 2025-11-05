import { apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  GetLawyersParams,
  GetLawyersResponse,
  User,
} from "./auth.types";

/**
 * Sign up - Create new account
 */
export const signUp = async (data: SignUpRequest): Promise<SignUpResponse> => {
  const response = await apiClient.post<ApiResponse<SignUpResponse>>(
    "/api/auth/signup",
    data
  );
  return response.data.data!;
};

/**
 * Sign in - Request OTP code
 */
export const signIn = async (email: string): Promise<SignInResponse> => {
  const response = await apiClient.post<ApiResponse<SignInResponse>>(
    "/api/auth/signin",
    { email }
  );
  return response.data.data!;
};

/**
 * Verify OTP - cookies are set automatically by server
 */
export const verifyOtp = async (
  data: VerifyOtpRequest
): Promise<User> => {
  const response = await apiClient.post<ApiResponse<VerifyOtpResponse>>(
    "/api/auth/verify-otp",
    data
  );

  const result = response.data.data!;

  // Cookies (accessToken, refreshToken) are set automatically by server
  // Return only the user data for the auth context
  return result.user;
};

/**
 * Refresh access token - cookies are updated automatically by server
 */
export const refreshToken = async (): Promise<void> => {
  await apiClient.post<ApiResponse<{ message: string }>>(
    "/api/auth/refresh-token"
  );

  // Cookies (accessToken, refreshToken) are updated automatically by server
  // No need to return or store anything on the client
};

/**
 * Get current user
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<ApiResponse<User>>("/api/auth/me");
  return response.data.data!;
};

/**
 * Resend OTP code
 */
export const resendOtp = async (
  data: ResendOtpRequest
): Promise<ResendOtpResponse> => {
  const response = await apiClient.post<ApiResponse<ResendOtpResponse>>(
    "/api/auth/resend-otp",
    data
  );
  return response.data.data!;
};

/**
 * Get lawyers list with filtering and pagination
 */
export const getLawyers = async (
  params?: GetLawyersParams
): Promise<GetLawyersResponse> => {
  const response = await apiClient.get<ApiResponse<GetLawyersResponse>>(
    "/api/auth/lawyers",
    { params }
  );
  return response.data.data!;
};

/**
 * Logout user - cookies are cleared automatically by server
 */
export const signOut = async (): Promise<void> => {
  await apiClient.post<ApiResponse<null>>("/api/auth/logout");
  
  // Cookies (accessToken, refreshToken) are cleared automatically by server
  // No need to manually clear anything on the client
};
