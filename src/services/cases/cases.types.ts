export type CaseStatus = "OPEN" | "UNDER_REVIEW" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type CasePriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Case {
  id: string;
  title: string;
  description: string;
  priority: CasePriority;
  status: CaseStatus;
  code: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  practiceArea?: string;
  createdAt: string;
  updatedAt: string;
  assignedToId?: string;
  assignedAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  resolutionNotes?: string;
  closureNotes?: string;
  assignedTo?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    companyName?: string;
  };
}

export interface CreateCaseRequest {
  title: string;
  description: string;
  priority: CasePriority;
  practiceArea?: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
}

export interface CreateCaseResponse {
  id: string;
  title: string;
  description: string;
  priority: CasePriority;
  status: CaseStatus;
  code: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  createdAt: string;
}

export interface GetCasesParams {
  page?: number;
  limit?: number;
  status?: CaseStatus;
  priority?: CasePriority;
  practiceArea?: string;
  assignedToId?: string;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "priority" | "assignedAt";
  sortOrder?: "asc" | "desc";
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetCasesResponse {
  cases: Case[];
  pagination: PaginationMeta;
}

export interface TrackCaseRequest {
  code: string;
}

export interface TrackCaseResponse {
  id: string;
  title: string;
  status: CaseStatus;
  priority: CasePriority;
  createdAt: string;
  updatedAt: string;
  assignedTo?: {
    firstName: string;
    lastName: string;
    companyName?: string;
  };
}

export interface UpdateCaseStatusRequest {
  status: CaseStatus;
}

export interface AssignCaseRequest {
  caseId: string;
  assignedToId: string;
}

export interface AssignCaseResponse {
  id: string;
  status: CaseStatus;
  assignedToId: string;
  assignedAt: string;
  assignedTo: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export interface RequestAssignmentRequest {
  caseId: string;
  message?: string;
}

export type AssignmentRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface AssignmentRequest {
  id: string;
  caseId: string;
  requestedById: string;
  message?: string;
  status: AssignmentRequestStatus;
  createdAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
  case?: {
    id: string;
    title: string;
    priority: CasePriority;
    status: CaseStatus;
  };
  requestedBy?: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface CreateAssignmentRequestResponse {
  id: string;
  caseId: string;
  requestedById: string;
  message?: string;
  status: AssignmentRequestStatus;
  createdAt: string;
}

export interface GetAssignmentRequestsParams {
  page?: number;
  limit?: number;
  status?: AssignmentRequestStatus;
  caseId?: string;
  requestedById?: string;
}

export interface GetAssignmentRequestsResponse {
  requests: AssignmentRequest[];
  pagination: PaginationMeta;
}

export interface ReviewAssignmentRequest {
  action: "approve" | "reject";
  rejectionReason?: string;
}

export interface ResolveCaseRequest {
  resolutionNotes?: string;
}

export interface CloseCaseRequest {
  closureNotes?: string;
}

// Case Notes Types
export interface CaseNote {
  id: string;
  caseId: string;
  authorId: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  content: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCaseNoteRequest {
  content: string;
  isPrivate?: boolean;
}

export interface UpdateCaseNoteRequest {
  content: string;
  isPrivate?: boolean;
}

export interface GetCaseNotesParams {
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
}

export interface GetCaseNotesResponse {
  notes: CaseNote[];
  pagination: PaginationMeta;
}

// Case Timeline Types
export type TimelineUpdateType = 
  | "PICKED_UP" 
  | "STATUS_CHANGED" 
  | "NOTE_ADDED" 
  | "REVIEW_ADDED" 
  | "LAWYER_SUGGESTED" 
  | "RESOLVED" 
  | "CLOSED";

export interface TimelineUpdate {
  id: string;
  caseId: string;
  userId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  updateType: TimelineUpdateType;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface CreateTimelineUpdateRequest {
  title: string;
  description?: string;
  updateType?: TimelineUpdateType;
  metadata?: Record<string, unknown>;
}

export interface GetTimelineParams {
  page?: number;
  limit?: number;
  updateType?: TimelineUpdateType;
  sortOrder?: "asc" | "desc";
}

export interface GetTimelineResponse {
  updates: TimelineUpdate[];
  pagination: PaginationMeta;
}

// Case Review Types (Student Research)
export interface CaseReview {
  id: string;
  caseId: string;
  reviewedById: string;
  reviewedBy: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  findings: string;
  suggestedPracticeArea?: string;
  suggestedLawyerId?: string;
  suggestedLawyer?: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    lawyerProfile?: {
      practiceArea: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateCaseReviewRequest {
  findings: string;
  suggestedPracticeArea?: string;
  suggestedLawyerId?: string;
}

export interface SuggestLawyerRequest {
  lawyerId: string;
  reason?: string;
}

// Lawyer Recommendation Response Types
export type RecommendationStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface LawyerRecommendation {
  id: string;
  caseId: string;
  reviewId: string;
  lawyerId: string;
  status: RecommendationStatus;
  responseMessage?: string;
  createdAt: string;
  updatedAt: string;
  respondedAt?: string;
  case: {
    id: string;
    title: string;
    status: CaseStatus;
  };
  review: {
    id: string;
    findings: string;
    reviewedBy: {
      firstName: string;
      lastName: string;
    };
  };
}

export interface RespondToRecommendationRequest {
  action: "accept" | "reject";
  responseMessage?: string;
}

export interface RespondToRecommendationResponse {
  id: string;
  caseId: string;
  reviewId: string;
  lawyerId: string;
  status: RecommendationStatus;
  responseMessage?: string;
  createdAt: string;
  updatedAt: string;
  respondedAt: string;
  case: {
    id: string;
    title: string;
    status: CaseStatus;
  };
  review: {
    id: string;
    findings: string;
    reviewedBy: {
      firstName: string;
      lastName: string;
    };
  };
}

// My Assigned Cases Types
export interface GetMyAssignedCasesParams {
  page?: number;
  limit?: number;
  status?: CaseStatus;
  priority?: CasePriority;
  practiceArea?: string;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "priority";
  sortOrder?: "asc" | "desc";
}
