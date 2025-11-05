import { z } from "zod";

// Schema for login - email only
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

// Schema for OTP verification
export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .min(6, "Verification code must be 6 digits")
    .max(6, "Verification code must be 6 digits")
    .regex(/^\d+$/, "Verification code must contain only numbers"),
});

// Base schema for signup
const baseSignUpSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name must be less than 100 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name must be less than 100 characters"),
  role: z.enum(["LAWYER", "STUDENT", "ADMIN"], {
    message: "Please select a role",
  }),
});

// Optional fields that may be present
const optionalFieldsSchema = z.object({
  // Lawyer fields
  companyName: z.string().max(200, "Company name must be less than 200 characters").optional(),
  practiceArea: z.string().max(100, "Practice area must be less than 100 characters").optional(),
  yearOfCall: z.number().int().optional(),
  operatingRegion: z.string().max(100, "Operating region must be less than 100 characters").optional(),

  // Student fields
  schoolName: z.string().max(200, "School name must be less than 200 characters").optional(),
  expectedGraduationYear: z.number().int().optional(),
});

// Step 1: Role selection only
export const step1Schema = z.object({
  role: z.enum(["LAWYER", "STUDENT", "ADMIN"], {
    message: "Please select a role",
  }),
});

// Step 2: Personal information
export const step2Schema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name must be less than 100 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name must be less than 100 characters"),
});

// Schema for signup with conditional lawyer/student fields
export const signUpSchema = baseSignUpSchema
  .and(optionalFieldsSchema)
  .superRefine((data, ctx) => {
    // Check if role is LAWYER
    if (data.role === "LAWYER") {
      if (!data.companyName || data.companyName.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["companyName"],
          message: "Company name is required for lawyers",
        });
      }

      if (!data.practiceArea || data.practiceArea.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["practiceArea"],
          message: "Practice area is required for lawyers",
        });
      }

      if (data.yearOfCall === undefined || data.yearOfCall === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["yearOfCall"],
          message: "Year of call is required for lawyers",
        });
      } else if (data.yearOfCall < 1900 || data.yearOfCall > new Date().getFullYear()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["yearOfCall"],
          message: "Year of call must be between 1900 and current year",
        });
      }

      if (!data.operatingRegion || data.operatingRegion.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["operatingRegion"],
          message: "Operating region is required for lawyers",
        });
      }
    }

    // Check if role is STUDENT
    if (data.role === "STUDENT") {
      if (!data.schoolName || data.schoolName.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["schoolName"],
          message: "School name is required for students",
        });
      }

      if (data.expectedGraduationYear === undefined || data.expectedGraduationYear === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["expectedGraduationYear"],
          message: "Expected graduation year is required for students",
        });
      } else {
        const currentYear = new Date().getFullYear();
        if (data.expectedGraduationYear < currentYear || data.expectedGraduationYear > currentYear + 10) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["expectedGraduationYear"],
            message: "Expected graduation year must be between current year and 10 years from now",
          });
        }
      }
    }
  });
