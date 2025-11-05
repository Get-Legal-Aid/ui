import type { UseFormReturn } from "react-hook-form";
import type { CreateCaseFormData } from "@/services/cases/cases.schema";
import { Badge } from "@/components/ui/badge";

interface ReviewStepProps {
  form: UseFormReturn<CreateCaseFormData>;
}

const priorityLabels = {
  LOW: "Low Priority",
  MEDIUM: "Medium Priority",
  HIGH: "High Priority",
  URGENT: "Urgent",
};

const priorityColors = {
  LOW: "bg-gray-100 text-gray-800",
  MEDIUM: "bg-blue-100 text-blue-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-800",
};

export function ReviewStep({ form }: ReviewStepProps) {
  const values = form.getValues();

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-muted p-4">
        <p className="text-sm text-muted-foreground">
          Please review your information before submitting. You can go back to make
          changes if needed.
        </p>
      </div>

      {/* Case Details Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Case Details
          </h3>
          <div className="rounded-lg border p-4 space-y-3">
            <div>
              <p className="text-sm font-medium mb-1">Title</p>
              <p className="text-sm text-muted-foreground">{values.title}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Description</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {values.description}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Practice Area</p>
              <p className="text-sm text-muted-foreground">{values.practiceArea}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Priority</p>
              <Badge
                variant="secondary"
                className={priorityColors[values.priority]}
              >
                {priorityLabels[values.priority]}
              </Badge>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Contact Information
          </h3>
          <div className="rounded-lg border p-4 space-y-3">
            <div>
              <p className="text-sm font-medium mb-1">Name</p>
              <p className="text-sm text-muted-foreground">{values.clientName}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Email</p>
              <p className="text-sm text-muted-foreground">{values.clientEmail}</p>
            </div>
            {values.clientPhone && (
              <div>
                <p className="text-sm font-medium mb-1">Phone</p>
                <p className="text-sm text-muted-foreground">
                  {values.clientPhone}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4 border border-blue-200 dark:border-blue-800">
        <div className="flex gap-3">
          <svg
            className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              What happens next?
            </p>
            <ul className="mt-2 text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• You'll receive a tracking code to monitor your case</li>
              <li>• A lawyer will review your case within 24-48 hours</li>
              <li>• We'll email you when your case is assigned</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
