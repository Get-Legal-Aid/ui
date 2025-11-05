export interface LawyerProfile {
  id: string;
  userId: string;
  companyName: string;
  practiceArea: string;
  yearOfCall: number;
  operatingRegion: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  schoolName: string;
  expectedGraduationYear: number;
  bio?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FullProfile {
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
  lawyerProfile?: LawyerProfile;
  studentProfile?: StudentProfile;
}

export interface UpdateUserInfoRequest {
  firstName?: string;
  lastName?: string;
}

export interface UpdateLawyerProfileRequest {
  companyName?: string;
  practiceArea?: string;
  yearOfCall?: number;
  operatingRegion?: string;
  bio?: string;
}

export interface UpdateStudentProfileRequest {
  schoolName?: string;
  expectedGraduationYear?: number;
  bio?: string;
}
