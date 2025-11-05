import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import type { ApiError } from "@/services/auth/auth.types";
import { useTrackCase } from "@/services/cases/cases.hooks";
import type { TrackCaseResponse } from "@/services/cases/cases.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Search } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
const trackingCodeSchema = z.object({
  trackingCode: z.string().length(6, "Tracking code must be 6 characters"),
});

type TrackingCodeFormData = z.infer<typeof trackingCodeSchema>;

const statusColors = {
  OPEN: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  UNDER_REVIEW: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
  ASSIGNED: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  RESOLVED: "bg-green-100 text-green-800 hover:bg-green-200",
  CLOSED: "bg-gray-100 text-gray-800 hover:bg-gray-200",
};

const priorityColors = {
  LOW: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  MEDIUM: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  HIGH: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  URGENT: "bg-red-100 text-red-800 hover:bg-red-200",
};

const statusDescriptions = {
  OPEN: "Your case has been submitted and is waiting for review",
  UNDER_REVIEW: "Your case is being reviewed by our legal team",
  ASSIGNED: "A lawyer has been assigned to your case",
  IN_PROGRESS: "Your lawyer is actively working on your case",
  RESOLVED: "Your case has been resolved",
  CLOSED: "Your case has been closed",
};

export function TrackCaseForm() {
  const [searchParams] = useSearchParams();
  const trackCaseMutation = useTrackCase();
  const [caseData, setCaseData] = useState<TrackCaseResponse | null>(null);

  const form = useForm<TrackingCodeFormData>({
    resolver: zodResolver(trackingCodeSchema),
    defaultValues: {
      trackingCode: searchParams.get("code") || "",
    },
  });

  const onSubmit = async (data: TrackingCodeFormData) => {
    try {
      const response = await trackCaseMutation.mutateAsync(data.trackingCode);
      setCaseData(response);
    } catch (error) {
      setCaseData(null);
      if (isAxiosError<ApiError>(error) && error.response?.data) {
        toast.error(error.response.data.error.message || "Case not found");
      } else {
        toast.error("Failed to track case. Please check your tracking code.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card className="max-w-2xl mx-auto">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="trackingCode"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormLabel className="text-center">Tracking Code</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={0}
                            className="size-15 text-lg uppercase"
                          />
                          <InputOTPSlot
                            index={1}
                            className="size-15 text-lg uppercase"
                          />
                          <InputOTPSlot
                            index={2}
                            className="size-15 text-lg uppercase"
                          />
                          <InputOTPSlot
                            index={3}
                            className="size-15 text-lg uppercase"
                          />
                          <InputOTPSlot
                            index={4}
                            className="size-15 text-lg uppercase"
                          />
                          <InputOTPSlot
                            index={5}
                            className="size-15 text-lg uppercase"
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={trackCaseMutation.isPending}
              >
                {trackCaseMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Track Case
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Case Details */}
      {caseData && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl font-serif font-normal mb-2">
                  {caseData.title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={cn("capitalize", statusColors[caseData.status])}
                  >
                    {caseData.status.replace("_", " ").toLowerCase()}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "capitalize",
                      priorityColors[caseData.priority]
                    )}
                  >
                    {caseData.priority.toLowerCase()} priority
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status Description */}
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium mb-1">Current Status</p>
              <p className="text-sm text-muted-foreground">
                {statusDescriptions[caseData.status]}
              </p>
            </div>

            {/* Case Information */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Submitted
                </p>
                <p className="text-sm">
                  {formatDistanceToNow(new Date(caseData.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>

              {caseData.updatedAt !== caseData.createdAt && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Last Updated
                  </p>
                  <p className="text-sm">
                    {formatDistanceToNow(new Date(caseData.updatedAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              )}

              {/* Assigned Lawyer */}
              {caseData.assignedTo && (
                <div className="rounded-lg border p-4">
                  <p className="text-sm font-medium mb-2">Assigned Lawyer</p>
                  <div>
                    <p className="font-medium">
                      {caseData.assignedTo.firstName}{" "}
                      {caseData.assignedTo.lastName}
                    </p>
                    {caseData.assignedTo.companyName && (
                      <p className="text-sm text-muted-foreground">
                        {caseData.assignedTo.companyName}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Help Text */}
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex gap-3">
                <svg
                  className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5"
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
                    Need Help?
                  </p>
                  <p className="mt-1 text-sm text-blue-800 dark:text-blue-200">
                    If you have questions about your case, please check your
                    email for updates or contact support.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
