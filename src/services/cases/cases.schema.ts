import { z } from "zod";

export const createCaseSchema = z.object({
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(2000, "Description must be less than 2000 characters"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"], {
    message: "Please select a priority level",
  }),
  practiceArea: z
    .string()
    .min(1, "Please select a practice area"),
  clientName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  clientEmail: z
    .string()
    .email("Please enter a valid email address"),
  clientPhone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s\-\+\(\)]+$/.test(val),
      "Please enter a valid phone number"
    ),
});

export type CreateCaseFormData = z.infer<typeof createCaseSchema>;

export const requestAssignmentSchema = z.object({
  caseId: z.string().min(1, "Case ID is required"),
  message: z
    .string()
    .max(500, "Message must be less than 500 characters")
    .optional(),
});

export type RequestAssignmentFormData = z.infer<typeof requestAssignmentSchema>;
