import { useMutation, useQuery } from "@tanstack/react-query";
import { signIn, signUp, verifyOtp, refreshToken, getCurrentUser, resendOtp, getLawyers } from "./auth.service";
import type { SignUpRequest, VerifyOtpRequest, ResendOtpRequest, GetLawyersParams } from "./auth.types";

/**
 * Hook for signing up (creating account)
 */
export const useSignUp = () => {
  return useMutation({
    mutationFn: (data: SignUpRequest) => signUp(data),
  });
};

/**
 * Hook for signing in (requesting OTP)
 */
export const useSignIn = () => {
  return useMutation({
    mutationFn: (email: string) => signIn(email),
  });
};

/**
 * Hook for verifying OTP
 */
export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: (data: VerifyOtpRequest) => verifyOtp(data),
  });
};

/**
 * Hook for refreshing access token
 */
export const useRefreshToken = () => {
  return useMutation({
    mutationFn: () => refreshToken(),
  });
};

/**
 * Hook for resending OTP
 */
export const useResendOtp = () => {
  return useMutation({
    mutationFn: (data: ResendOtpRequest) => resendOtp(data),
  });
};

/**
 * Hook for getting lawyers list
 */
export const useLawyers = (params?: GetLawyersParams) => {
  return useQuery({
    queryKey: ["lawyers", params],
    queryFn: () => getLawyers(params),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Hook for getting current user
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
};
