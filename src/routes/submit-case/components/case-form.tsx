import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useCreateCase } from "@/services/cases/cases.hooks";
import { createCaseSchema, type CreateCaseFormData } from "@/services/cases/cases.schema";
import type { ApiError } from "@/services/auth/auth.types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function CaseForm() {
  const navigate = useNavigate();
  const createCaseMutation = useCreateCase();
  const [trackingCode, setTrackingCode] = useState<string | null>(null);

  const form = useForm<CreateCaseFormData>({
    resolver: zodResolver(createCaseSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
      practiceArea: "",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
    },
  });

  const onSubmit = async (data: CreateCaseFormData) => {
    try {
      const response = await createCaseMutation.mutateAsync(data);
      setTrackingCode(response.code);
      toast.success("Case submitted successfully!");
      form.reset();
    } catch (error) {
      if (isAxiosError<ApiError>(error) && error.response?.data) {
        toast.error(error.response.data.error.message || "Failed to submit case");
      } else {
        toast.error("Failed to submit case. Please try again.");
      }
    }
  };

  // Success state - show tracking code
  if (trackingCode) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl font-serif font-normal">Case Submitted Successfully!</CardTitle>
          <CardDescription>
            Your case has been received and will be reviewed shortly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">Your tracking code:</p>
            <p className="text-2xl font-mono font-bold">{trackingCode}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Save this code to track your case status
            </p>
          </div>

          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                navigator.clipboard.writeText(trackingCode);
                toast.success("Tracking code copied!");
              }}
            >
              Copy Tracking Code
            </Button>
            <Button
              className="w-full"
              onClick={() => {
                setTrackingCode(null);
                navigate("/submit-case");
              }}
            >
              Submit Another Case
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-serif">Submit a Legal Case</CardTitle>
        <CardDescription>
          Fill out the form below to submit your legal case. A lawyer will review and contact you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Case Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Case Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Brief summary of your legal issue"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a clear, concise title (10-200 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Case Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Case Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your legal situation in detail..."
                      className="min-h-[150px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide detailed information about your case (50-2000 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Priority */}
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="LOW">Low - Within 3 months</SelectItem>
                      <SelectItem value="MEDIUM">Medium - Within a month</SelectItem>
                      <SelectItem value="HIGH">High - Within a week</SelectItem>
                      <SelectItem value="URGENT">Urgent - Immediate attention needed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How urgent is your legal matter?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Practice Area */}
            <FormField
              control={form.control}
              name="practiceArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Where do you think your case falls under?</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select practice area" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Criminal Law">Criminal Law</SelectItem>
                      <SelectItem value="Civil Law">Civil Law</SelectItem>
                      <SelectItem value="Family Law">Family Law</SelectItem>
                      <SelectItem value="Corporate Law">Corporate Law</SelectItem>
                      <SelectItem value="Employment Law">Employment Law</SelectItem>
                      <SelectItem value="Real Estate Law">Real Estate Law</SelectItem>
                      <SelectItem value="Intellectual Property">Intellectual Property</SelectItem>
                      <SelectItem value="Immigration Law">Immigration Law</SelectItem>
                      <SelectItem value="Tax Law">Tax Law</SelectItem>
                      <SelectItem value="Environmental Law">Environmental Law</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    What type of legal matter is this?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Your Contact Information</h3>

              {/* Client Name */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Kwame Mensah" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Client Email */}
                <FormField
                  control={form.control}
                  name="clientEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="kwame.mensah@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        We'll use this to send you updates about your case
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Client Phone */}
                <FormField
                  control={form.control}
                  name="clientPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+233 24 123 4567"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={createCaseMutation.isPending}
            >
              {createCaseMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Case"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
