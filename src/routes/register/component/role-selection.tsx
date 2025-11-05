import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";
import type { SignUpFormData } from "@/services/auth/auth.types";

interface RoleSelectionProps {
  form: UseFormReturn<SignUpFormData>;
  onNext: () => void;
}

export function RoleSelection({ form, onNext }: RoleSelectionProps) {
  return (
    <>
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-medium text-foreground">
          Choose your role
        </h2>
        <p className="text-sm text-muted-foreground">
          Select the option that best describes you
        </p>
      </div>

      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem className="space-y-4">
            <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => field.onChange("LAWYER")}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    field.value === "LAWYER"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 mt-1">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        <rect width="20" height="14" x="2" y="6" rx="2" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        Lawyer
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Licensed legal practitioner providing professional legal services
                      </p>
                    </div>
                    {field.value === "LAWYER" && (
                      <div className="shrink-0">
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="2,6 5,9 10,3" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => field.onChange("STUDENT")}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    field.value === "STUDENT"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 mt-1">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        Law Student
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Currently studying law and learning legal practice
                      </p>
                    </div>
                    {field.value === "STUDENT" && (
                      <div className="shrink-0">
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="2,6 5,9 10,3" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button
        type="button"
        onClick={onNext}
        className="w-full rounded-xl"
        size="lg"
      >
        Continue
      </Button>
    </>
  );
}
