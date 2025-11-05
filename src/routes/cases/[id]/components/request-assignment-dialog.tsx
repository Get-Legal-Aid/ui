import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useRequestAssignment } from "@/services/cases/cases.hooks";
import {
  requestAssignmentSchema,
  type RequestAssignmentFormData,
} from "@/services/cases/cases.schema";
import type { ApiError } from "@/services/auth/auth.types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { isAxiosError } from "axios";

interface RequestAssignmentDialogProps {
  caseId: string;
  caseTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RequestAssignmentDialog({
  caseId,
  caseTitle,
  open,
  onOpenChange,
}: RequestAssignmentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync: requestAssignment } = useRequestAssignment();

  const form = useForm<RequestAssignmentFormData>({
    resolver: zodResolver(requestAssignmentSchema),
    defaultValues: {
      caseId,
      message: "",
    },
  });

  const onSubmit = async (data: RequestAssignmentFormData) => {
    setIsSubmitting(true);
    try {
      await requestAssignment(data);
      toast.success("Assignment Request Submitted", {
        description:
          "Your request has been sent to the admin for review. You'll be notified once it's approved.",
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      if (isAxiosError<ApiError>(error) && error.response?.data) {
        toast.error("Request Failed", {
          description:
            error.response.data.error.message ||
            "Failed to submit assignment request. Please try again.",
        });
      } else {
        toast.error("Request Failed", {
          description: "Failed to submit assignment request. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Case Assignment</DialogTitle>
          <DialogDescription>
            Submit a request to be assigned to this case. An admin will review
            your request and notify you of their decision.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Case Title Display */}
            <div className="rounded-lg bg-muted p-3 space-y-1">
              <p className="text-sm font-medium">Case</p>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {caseTitle}
              </p>
            </div>

            {/* Message Field */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Message{" "}
                    <span className="text-muted-foreground font-normal">
                      (Optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add a message to explain why you're interested in this case or what makes you qualified to handle it..."
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Submit Request
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
