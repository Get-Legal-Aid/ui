import { z } from "zod";
import { loginSchema, verifyOtpSchema, signUpSchema } from "./auth.schema";

export type LoginFormData = z.infer<typeof loginSchema>;
export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    request_id: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "LAWYER" | "STUDENT" | "ADMIN";
  status: "ACTIVE" | "SUSPENDED" | "INACTIVE";
  emailVerified: boolean;
  points: number;
  createdAt: string;
  updatedAt: string;
  lawyerProfile?: {
    companyName: string;
    practiceArea: string;
    yearOfCall: number;
    operatingRegion: string;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SignInResponse {
  success: boolean;
  message: string;
}

export interface SignUpResponse {
  success: boolean;
  message: string;
}

export interface SignUpRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: "LAWYER" | "STUDENT" | "ADMIN";
  // Lawyer fields
  companyName?: string;
  practiceArea?: string;
  yearOfCall?: number;
  operatingRegion?: string;
  // Student fields
  schoolName?: string;
  expectedGraduationYear?: number;
}

export interface VerifyOtpResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
}

export interface Lawyer {
  id: string;
  firstName: string;
  lastName: string;
  lawyerProfile: {
    companyName: string;
    practiceArea: string;
    yearOfCall: number;
    operatingRegion: string;
    bio?: string;
  };
}

export interface GetLawyersParams {
  page?: number;
  limit?: number;
  practiceArea?: string;
  operatingRegion?: string;
  search?: string;
  sortBy?: "firstName" | "lastName" | "yearOfCall" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface GetLawyersResponse {
  lawyers: Lawyer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
