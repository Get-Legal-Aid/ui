import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCase,
  getCases,
  trackCase,
  getCaseById,
  updateCaseStatus,
  assignCase,
  requestAssignment,
  getAssignmentRequests,
  reviewAssignmentRequest,
  resolveCase,
  closeCase,
  pickupCase,
  getMyAssignedCases,
  getCaseNotes,
  createCaseNote,
  updateCaseNote,
  deleteCaseNote,
  getCaseTimeline,
  createTimelineUpdate,
  getCaseReview,
  createCaseReview,
  suggestLawyer,
  respondToRecommendation,
  getRecommendationResponse,
} from "./cases.service";
import type {
  CreateCaseRequest,
  GetCasesParams,
  UpdateCaseStatusRequest,
  AssignCaseRequest,
  RequestAssignmentRequest,
  GetAssignmentRequestsParams,
  ReviewAssignmentRequest,
  ResolveCaseRequest,
  CloseCaseRequest,
  GetMyAssignedCasesParams,
  GetCaseNotesParams,
  CreateCaseNoteRequest,
  UpdateCaseNoteRequest,
  GetTimelineParams,
  CreateTimelineUpdateRequest,
  CreateCaseReviewRequest,
  SuggestLawyerRequest,
  RespondToRecommendationRequest,
} from "./cases.types";

/**
 * Hook for creating a case
 */
export const useCreateCase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCaseRequest) => createCase(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
    },
  });
};

/**
 * Hook for getting cases with pagination and filters
 */
export const useGetCases = (params?: GetCasesParams) => {
  return useQuery({
    queryKey: ["cases", params],
    queryFn: () => getCases(params),
  });
};

/**
 * Hook for tracking a case by code
 */
export const useTrackCase = () => {
  return useMutation({
    mutationFn: (code: string) => trackCase({ code }),
  });
};

/**
 * Hook for getting a single case by ID
 */
export const useGetCaseById = (id: string) => {
  return useQuery({
    queryKey: ["case", id],
    queryFn: () => getCaseById(id),
    enabled: !!id,
  });
};

/**
 * Hook for updating case status
 */
export const useUpdateCaseStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCaseStatusRequest }) =>
      updateCaseStatus(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["case", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["cases"] });
    },
  });
};

/**
 * Hook for assigning a case
 */
export const useAssignCase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AssignCaseRequest) => assignCase(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["case", variables.caseId] });
      queryClient.invalidateQueries({ queryKey: ["cases"] });
    },
  });
};

/**
 * Hook for requesting case assignment
 */
export const useRequestAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RequestAssignmentRequest) => requestAssignment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignment-requests"] });
    },
  });
};

/**
 * Hook for getting assignment requests
 */
export const useGetAssignmentRequests = (
  params?: GetAssignmentRequestsParams
) => {
  return useQuery({
    queryKey: ["assignment-requests", params],
    queryFn: () => getAssignmentRequests(params),
  });
};

/**
 * Hook for reviewing an assignment request
 */
export const useReviewAssignmentRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReviewAssignmentRequest }) =>
      reviewAssignmentRequest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignment-requests"] });
      queryClient.invalidateQueries({ queryKey: ["cases"] });
    },
  });
};

/**
 * Hook for resolving a case
 */
export const useResolveCase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: ResolveCaseRequest }) =>
      resolveCase(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["case", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["cases"] });
    },
  });
};

/**
 * Hook for closing a case
 */
export const useCloseCase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: CloseCaseRequest }) =>
      closeCase(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["case", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["cases"] });
    },
  });
};

/**
 * Hook for picking up a case (self-assign)
 */
export const usePickupCase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pickupCase(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["case", data.id] });
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      queryClient.invalidateQueries({ queryKey: ["my-assigned-cases"] });
    },
  });
};

/**
 * Hook for getting my assigned cases
 */
export const useGetMyAssignedCases = (params?: GetMyAssignedCasesParams) => {
  return useQuery({
    queryKey: ["my-assigned-cases", params],
    queryFn: () => getMyAssignedCases(params),
  });
};

// ============= CASE NOTES HOOKS =============

/**
 * Hook for getting case notes
 */
export const useGetCaseNotes = (caseId: string, params?: GetCaseNotesParams) => {
  return useQuery({
    queryKey: ["case-notes", caseId, params],
    queryFn: () => getCaseNotes(caseId, params),
    enabled: !!caseId,
  });
};

/**
 * Hook for creating a case note
 */
export const useCreateCaseNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ caseId, data }: { caseId: string; data: CreateCaseNoteRequest }) =>
      createCaseNote(caseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["case-notes", variables.caseId] });
      queryClient.invalidateQueries({ queryKey: ["case-timeline", variables.caseId] });
    },
  });
};

/**
 * Hook for updating a case note
 */
export const useUpdateCaseNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ 
      caseId, 
      noteId, 
      data 
    }: { 
      caseId: string; 
      noteId: string; 
      data: UpdateCaseNoteRequest 
    }) => updateCaseNote(caseId, noteId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["case-notes", variables.caseId] });
    },
  });
};

/**
 * Hook for deleting a case note
 */
export const useDeleteCaseNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ caseId, noteId }: { caseId: string; noteId: string }) =>
      deleteCaseNote(caseId, noteId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["case-notes", variables.caseId] });
    },
  });
};

// ============= CASE TIMELINE HOOKS =============

/**
 * Hook for getting case timeline
 */
export const useGetCaseTimeline = (caseId: string, params?: GetTimelineParams) => {
  return useQuery({
    queryKey: ["case-timeline", caseId, params],
    queryFn: () => getCaseTimeline(caseId, params),
    enabled: !!caseId,
  });
};

/**
 * Hook for creating a timeline update
 */
export const useCreateTimelineUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ 
      caseId, 
      data 
    }: { 
      caseId: string; 
      data: CreateTimelineUpdateRequest 
    }) => createTimelineUpdate(caseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["case-timeline", variables.caseId] });
    },
  });
};

// ============= CASE REVIEW HOOKS =============

/**
 * Hook for getting case review
 */
export const useGetCaseReview = (caseId: string) => {
  return useQuery({
    queryKey: ["case-review", caseId],
    queryFn: () => getCaseReview(caseId),
    enabled: !!caseId,
  });
};

/**
 * Hook for creating or updating case review
 */
export const useCreateCaseReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ 
      caseId, 
      data 
    }: { 
      caseId: string; 
      data: CreateCaseReviewRequest 
    }) => createCaseReview(caseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["case-review", variables.caseId] });
      queryClient.invalidateQueries({ queryKey: ["case", variables.caseId] });
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      queryClient.invalidateQueries({ queryKey: ["case-timeline", variables.caseId] });
    },
  });
};

/**
 * Hook for suggesting a lawyer
 */
export const useSuggestLawyer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ 
      caseId, 
      data 
    }: { 
      caseId: string; 
      data: SuggestLawyerRequest 
    }) => suggestLawyer(caseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["case-review", variables.caseId] });
      queryClient.invalidateQueries({ queryKey: ["case", variables.caseId] });
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      queryClient.invalidateQueries({ queryKey: ["case-timeline", variables.caseId] });
    },
  });
};

// ============= LAWYER RECOMMENDATION RESPONSE HOOKS =============

/**
 * Hook for responding to a lawyer recommendation (accept/reject)
 */
export const useRespondToRecommendation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ 
      caseId, 
      data 
    }: { 
      caseId: string; 
      data: RespondToRecommendationRequest 
    }) => respondToRecommendation(caseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["case", variables.caseId] });
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      queryClient.invalidateQueries({ queryKey: ["my-assigned-cases"] });
      queryClient.invalidateQueries({ queryKey: ["case-timeline", variables.caseId] });
      queryClient.invalidateQueries({ queryKey: ["recommendation-response", variables.caseId] });
    },
  });
};

/**
 * Hook for getting recommendation response status
 */
export const useGetRecommendationResponse = (caseId: string) => {
  return useQuery({
    queryKey: ["recommendation-response", caseId],
    queryFn: () => getRecommendationResponse(caseId),
    enabled: !!caseId,
  });
};
