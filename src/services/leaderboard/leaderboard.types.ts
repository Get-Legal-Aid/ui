export interface LeaderboardUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "LAWYER" | "STUDENT" | "ADMIN";
  points: number;
  rank: number;
  casesAssigned?: number;
  casesResolved?: number;
  joinedAt: string;
  lawyerProfile?: {
    companyName: string;
    practiceArea: string;
    yearOfCall: number;
    operatingRegion: string;
  };
  studentProfile?: {
    schoolName: string;
    expectedGraduationYear: number;
  };
}

export interface LeaderboardStats {
  totalUsers: number;
  totalLawyers: number;
  totalStudents: number;
  averagePoints: number;
  topPerformer: LeaderboardUser;
}

export interface GetLeaderboardParams {
  page?: number;
  limit?: number;
  role?: "LAWYER" | "STUDENT" | "ALL";
  timeframe?: "ALL_TIME" | "MONTHLY" | "WEEKLY";
  region?: string;
  practiceArea?: string;
  sortBy?: "points" | "casesResolved" | "casesAssigned" | "joinedAt";
  sortOrder?: "asc" | "desc";
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardUser[];
  stats?: LeaderboardStats;
  pagination: {
    page: string | number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface UserRankInfo {
  currentUser: LeaderboardUser;
  usersAbove: LeaderboardUser[];
  usersBelow: LeaderboardUser[];
}

// My Position Response (matching API documentation)
export interface MyPositionResponse {
  rank: number;
  userId: string;
  firstName: string;
  lastName: string;
  role: "LAWYER" | "STUDENT" | "ADMIN";
  points: number;
  casesHandled: number;
  casesResolved: number;
  resolutionRate: number;
  percentile: number;
  pointsToNextRank?: number;
  nextRankUser?: {
    rank: number;
    firstName: string;
    lastName: string;
    points: number;
  };
}

// User Position Response (for specific user lookup)
export interface UserPositionResponse {
  rank: number;
  userId: string;
  firstName: string;
  lastName: string;
  role: "LAWYER" | "STUDENT" | "ADMIN";
  points: number;
  casesHandled: number;
  casesResolved: number;
  resolutionRate: number;
  percentile: number;
  pointsToNextRank?: number;
  nextRankUser?: {
    rank: number;
    firstName: string;
    lastName: string;
    points: number;
  };
}

// Leaderboard Statistics Response
export interface LeaderboardStatsResponse {
  totalActiveUsers: number;
  totalPoints: number;
  totalCasesHandled: number;
  totalCasesResolved: number;
  averagePoints: number;
  averageCasesHandled: number;
  averageResolutionRate: number;
  topPerformer: {
    userId: string;
    firstName: string;
    lastName: string;
    points: number;
  };
}