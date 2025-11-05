import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "../auth/auth.types";
import type {
  Case,
  CreateCaseRequest,
  CreateCaseResponse,
  GetCasesParams,
  GetCasesResponse,
  TrackCaseRequest,
  TrackCaseResponse,
  UpdateCaseStatusRequest,
  AssignCaseRequest,
  AssignCaseResponse,
  RequestAssignmentRequest,
  CreateAssignmentRequestResponse,
  GetAssignmentRequestsParams,
  GetAssignmentRequestsResponse,
  ReviewAssignmentRequest,
  ResolveCaseRequest,
  CloseCaseRequest,
  GetMyAssignedCasesParams,
  CaseNote,
  CreateCaseNoteRequest,
  UpdateCaseNoteRequest,
  GetCaseNotesParams,
  GetCaseNotesResponse,
  TimelineUpdate,
  CreateTimelineUpdateRequest,
  GetTimelineParams,
  GetTimelineResponse,
  CaseReview,
  CreateCaseReviewRequest,
  SuggestLawyerRequest,
  RespondToRecommendationRequest,
  RespondToRecommendationResponse,
  LawyerRecommendation,
} from "./cases.types";

/**
 * Create a new case
 */
export const createCase = async (
  data: CreateCaseRequest
): Promise<CreateCaseResponse> => {
  const response = await apiClient.post<ApiResponse<CreateCaseResponse>>(
    "/api/cases",
    data
  );
  return response.data.data!;
};

/**
 * Get all cases with filtering and pagination
 */
export const getCases = async (
  params?: GetCasesParams
): Promise<GetCasesResponse> => {
  const response = await apiClient.get<ApiResponse<GetCasesResponse>>(
    "/api/cases",
    { params }
  );
  return response.data.data!;
};

/**
 * Track a case by tracking code
 */
export const trackCase = async (
  data: TrackCaseRequest
): Promise<TrackCaseResponse> => {
  const response = await apiClient.post<ApiResponse<TrackCaseResponse>>(
    "/api/cases/track",
    data
  );
  return response.data.data!;
};

/**
 * Get a case by ID
 */
export const getCaseById = async (id: string): Promise<Case> => {
  const response = await apiClient.get<ApiResponse<Case>>(`/api/cases/${id}`);
  return response.data.data!;
};

/**
 * Update case status
 */
export const updateCaseStatus = async (
  id: string,
  data: UpdateCaseStatusRequest
): Promise<Case> => {
  const response = await apiClient.patch<ApiResponse<Case>>(
    `/api/cases/${id}/status`,
    data
  );
  return response.data.data!;
};

/**
 * Assign a case to a user
 */
export const assignCase = async (
  data: AssignCaseRequest
): Promise<AssignCaseResponse> => {
  const response = await apiClient.post<ApiResponse<AssignCaseResponse>>(
    "/api/cases/assign",
    data
  );
  return response.data.data!;
};

/**
 * Request case assignment
 */
export const requestAssignment = async (
  data: RequestAssignmentRequest
): Promise<CreateAssignmentRequestResponse> => {
  const response = await apiClient.post<
    ApiResponse<CreateAssignmentRequestResponse>
  >("/api/cases/assignment-requests", data);
  return response.data.data!;
};

/**
 * Get assignment requests
 */
export const getAssignmentRequests = async (
  params?: GetAssignmentRequestsParams
): Promise<GetAssignmentRequestsResponse> => {
  const response = await apiClient.get<
    ApiResponse<GetAssignmentRequestsResponse>
  >("/api/cases/assignment-requests", { params });
  return response.data.data!;
};

/**
 * Review an assignment request (approve or reject)
 */
export const reviewAssignmentRequest = async (
  id: string,
  data: ReviewAssignmentRequest
): Promise<void> => {
  await apiClient.patch<ApiResponse<void>>(
    `/api/cases/assignment-requests/${id}/review`,
    data
  );
};

/**
 * Resolve a case
 */
export const resolveCase = async (
  id: string,
  data?: ResolveCaseRequest
): Promise<Case> => {
  const response = await apiClient.post<ApiResponse<Case>>(
    `/api/cases/${id}/resolve`,
    data || {}
  );
  return response.data.data!;
};

/**
 * Close a case
 */
export const closeCase = async (
  id: string,
  data?: CloseCaseRequest
): Promise<Case> => {
  const response = await apiClient.post<ApiResponse<Case>>(
    `/api/cases/${id}/close`,
    data || {}
  );
  return response.data.data!;
};

/**
 * Pickup a case (self-assign and start working on it immediately)
 */
export const pickupCase = async (id: string): Promise<Case> => {
  const response = await apiClient.post<ApiResponse<Case>>(
    `/api/cases/${id}/pickup`
  );
  return response.data.data!;
};

/**
 * Get my assigned cases
 */
export const getMyAssignedCases = async (
  params?: GetMyAssignedCasesParams
): Promise<GetCasesResponse> => {
  const response = await apiClient.get<ApiResponse<GetCasesResponse>>(
    "/api/cases/my-assignments",
    { params }
  );
  return response.data.data!;
};

// ============= CASE NOTES =============

/**
 * Get case notes with pagination
 */
export const getCaseNotes = async (
  caseId: string,
  params?: GetCaseNotesParams
): Promise<GetCaseNotesResponse> => {
  const response = await apiClient.get<ApiResponse<GetCaseNotesResponse>>(
    `/api/cases/${caseId}/notes`,
    { params }
  );
  return response.data.data!;
};

/**
 * Create a case note
 */
export const createCaseNote = async (
  caseId: string,
  data: CreateCaseNoteRequest
): Promise<CaseNote> => {
  const response = await apiClient.post<ApiResponse<CaseNote>>(
    `/api/cases/${caseId}/notes`,
    data
  );
  return response.data.data!;
};

/**
 * Update a case note
 */
export const updateCaseNote = async (
  caseId: string,
  noteId: string,
  data: UpdateCaseNoteRequest
): Promise<CaseNote> => {
  const response = await apiClient.patch<ApiResponse<CaseNote>>(
    `/api/cases/${caseId}/notes/${noteId}`,
    data
  );
  return response.data.data!;
};

/**
 * Delete a case note
 */
export const deleteCaseNote = async (
  caseId: string,
  noteId: string
): Promise<void> => {
  await apiClient.delete(`/api/cases/${caseId}/notes/${noteId}`);
};

// ============= CASE TIMELINE =============

/**
 * Get case timeline
 */
export const getCaseTimeline = async (
  caseId: string,
  params?: GetTimelineParams
): Promise<GetTimelineResponse> => {
  const response = await apiClient.get<ApiResponse<GetTimelineResponse>>(
    `/api/cases/${caseId}/timeline`,
    { params }
  );
  return response.data.data!;
};

/**
 * Add timeline update
 */
export const createTimelineUpdate = async (
  caseId: string,
  data: CreateTimelineUpdateRequest
): Promise<TimelineUpdate> => {
  const response = await apiClient.post<ApiResponse<TimelineUpdate>>(
    `/api/cases/${caseId}/timeline`,
    data
  );
  return response.data.data!;
};

// ============= CASE REVIEW (Student Research) =============

/**
 * Get case review
 */
export const getCaseReview = async (caseId: string): Promise<CaseReview | null> => {
  const response = await apiClient.get<ApiResponse<CaseReview | null>>(
    `/api/cases/${caseId}/review`
  );
  return response.data.data!;
};

/**
 * Create or update case review
 */
export const createCaseReview = async (
  caseId: string,
  data: CreateCaseReviewRequest
): Promise<CaseReview> => {
  const response = await apiClient.post<ApiResponse<CaseReview>>(
    `/api/cases/${caseId}/review`,
    data
  );
  return response.data.data!;
};

/**
 * Suggest lawyer for case
 */
export const suggestLawyer = async (
  caseId: string,
  data: SuggestLawyerRequest
): Promise<CaseReview> => {
  const response = await apiClient.post<ApiResponse<CaseReview>>(
    `/api/cases/${caseId}/suggest-lawyer`,
    data
  );
  return response.data.data!;
};

// ============= LAWYER RECOMMENDATION RESPONSES =============

/**
 * Respond to a lawyer recommendation (accept or reject)
 */
export const respondToRecommendation = async (
  caseId: string,
  data: RespondToRecommendationRequest
): Promise<RespondToRecommendationResponse> => {
  const response = await apiClient.post<ApiResponse<RespondToRecommendationResponse>>(
    `/api/cases/${caseId}/recommendation/respond`,
    data
  );
  return response.data.data!;
};

/**
 * Get recommendation response status
 */
export const getRecommendationResponse = async (
  caseId: string
): Promise<LawyerRecommendation> => {
  const response = await apiClient.get<ApiResponse<LawyerRecommendation>>(
    `/api/cases/${caseId}/recommendation/response`
  );
  return response.data.data!;
};
