import type { UseFormReturn } from "react-hook-form";
import type { CreateCaseFormData } from "@/services/cases/cases.schema";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CaseDetailsStepProps {
  form: UseFormReturn<CreateCaseFormData>;
}

export function CaseDetailsStep({ form }: CaseDetailsStepProps) {
  return (
    <div className="space-y-6">
      {/* Case Title */}
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Case Title *</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Landlord refused to return security deposit"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Brief summary of your legal issue (10-200 characters)
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
            <FormLabel>Detailed Description *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your legal situation in detail. Include relevant dates, parties involved, and what outcome you're seeking..."
                className="min-h-[200px] resize-none"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Provide as much detail as possible (50-2000 characters)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

    </div>
  );
}
