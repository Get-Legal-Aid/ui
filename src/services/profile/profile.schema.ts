import { z } from "zod";

export const updateUserInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(100, "First name must be less than 100 characters")
    .optional(),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(100, "Last name must be less than 100 characters")
    .optional(),
});

export const updateLawyerProfileSchema = z.object({
  companyName: z
    .string()
    .max(200, "Company name must be less than 200 characters")
    .optional(),
  practiceArea: z
    .string()
    .max(100, "Practice area must be less than 100 characters")
    .optional(),
  yearOfCall: z
    .number()
    .int()
    .min(1900, "Year of call must be at least 1900")
    .max(new Date().getFullYear(), "Year of call cannot be in the future")
    .optional(),
  operatingRegion: z
    .string()
    .max(100, "Operating region must be less than 100 characters")
    .optional(),
  bio: z
    .string()
    .max(500, "Bio must be less than 500 characters")
    .optional(),
});

export const updateStudentProfileSchema = z.object({
  schoolName: z
    .string()
    .max(200, "School name must be less than 200 characters")
    .optional(),
  expectedGraduationYear: z
    .number()
    .int()
    .min(new Date().getFullYear(), "Graduation year cannot be in the past")
    .max(new Date().getFullYear() + 10, "Graduation year is too far in the future")
    .optional(),
  bio: z
    .string()
    .max(500, "Bio must be less than 500 characters")
    .optional(),
});

export type UpdateUserInfoFormData = z.infer<typeof updateUserInfoSchema>;
export type UpdateLawyerProfileFormData = z.infer<typeof updateLawyerProfileSchema>;
export type UpdateStudentProfileFormData = z.infer<typeof updateStudentProfileSchema>;
