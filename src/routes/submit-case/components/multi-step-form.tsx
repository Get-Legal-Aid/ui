import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useCreateCase } from "@/services/cases/cases.hooks";
import { createCaseSchema, type CreateCaseFormData } from "@/services/cases/cases.schema";
import type { ApiError } from "@/services/auth/auth.types";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { CaseDetailsStep } from "./steps/case-details-step";
import { CategoryStep } from "./steps/category-step";
import { ContactInfoStep } from "./steps/contact-info-step";
import { ReviewStep } from "./steps/review-step";
import { SuccessStep } from "./steps/success-step";

const STEPS = [
  { id: 1, title: "Case Details", description: "Tell us about your legal issue" },
  { id: 2, title: "Category & Priority", description: "Categorize your case" },
  { id: 3, title: "Contact Info", description: "How can we reach you?" },
  { id: 4, title: "Review", description: "Review your submission" },
];

export function MultiStepForm() {
  const createCaseMutation = useCreateCase();
  const [currentStep, setCurrentStep] = useState(1);
  const [trackingCode, setTrackingCode] = useState<string | null>(null);

  const form = useForm<CreateCaseFormData>({
    resolver: zodResolver(createCaseSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
      practiceArea: undefined,
      clientName: "",
      clientEmail: "",
      clientPhone: "",
    },
    mode: "onTouched",
  });

  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof CreateCaseFormData)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = ["title", "description"];
        break;
      case 2:
        fieldsToValidate = ["priority", "practiceArea"];
        break;
      case 3:
        fieldsToValidate = ["clientName", "clientEmail", "clientPhone"];
        break;
      default:
        return true;
    }

    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: CreateCaseFormData) => {
    // Only submit on the last step
    if (currentStep !== STEPS.length) {
      // Prevent submission and just advance to next step
      handleNext();
      return;
    }

    try {
      const response = await createCaseMutation.mutateAsync(data);
      setTrackingCode(response.code);
      toast.success("Case submitted successfully!");
    } catch (error) {
      if (isAxiosError<ApiError>(error) && error.response?.data) {
        toast.error(error.response.data.error.message || "Failed to submit case");
      } else {
        toast.error("Failed to submit case. Please try again.");
      }
    }
  };

  // Success state
  if (trackingCode) {
    return (
      <SuccessStep
        trackingCode={trackingCode}
        onSubmitAnother={() => {
          setTrackingCode(null);
          setCurrentStep(1);
          form.reset();
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8 p-6 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl border border-primary/20">
        <div className="flex items-center gap-2">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors shadow-md ${
                    currentStep > step.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : currentStep === step.id
                      ? "border-primary bg-background text-primary ring-4 ring-primary/20"
                      : "border-muted bg-background text-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? (
                    <svg
                      className="h-5 w-5"
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
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <div className="mt-2 hidden md:block text-center">
                  <p className={`text-sm font-medium ${currentStep === step.id ? 'text-primary' : ''}`}>{step.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`h-0.5 w-12 md:w-24 mx-2 transition-colors ${
                    currentStep > step.id ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <Card className="max-w-2xl mx-auto shadow-lg border-2">
        <CardHeader className="bg-gradient-to-r from-muted/30 to-muted/10 border-b-2">
          <CardTitle className="text-2xl font-serif font-semibold text-primary">
            {STEPS[currentStep - 1].title}
          </CardTitle>
          <CardDescription className="text-base">{STEPS[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Step Content */}
              {currentStep === 1 && <CaseDetailsStep form={form} />}
              {currentStep === 2 && <CategoryStep form={form} />}
              {currentStep === 3 && <ContactInfoStep form={form} />}
              {currentStep === 4 && <ReviewStep form={form} />}

              {/* Navigation Buttons */}
              <div className="flex gap-4">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                )}

                {currentStep < STEPS.length ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex-1"
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="flex-1"
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
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
