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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryStepProps {
  form: UseFormReturn<CreateCaseFormData>;
}

export function CategoryStep({ form }: CategoryStepProps) {
  return (
    <div className="space-y-6">
      {/* Practice Area */}
      <FormField
        control={form.control}
        name="practiceArea"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Where do you think your case falls under? *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select practice area" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Criminal Law">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Criminal Law</span>
                    <span className="text-xs text-muted-foreground">
                      Criminal charges, defense matters
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="Civil Law">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Civil Law</span>
                    <span className="text-xs text-muted-foreground">
                      Disputes, contracts, civil matters
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="Family Law">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Family Law</span>
                    <span className="text-xs text-muted-foreground">
                      Divorce, custody, marriage matters
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="Corporate Law">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Corporate Law</span>
                    <span className="text-xs text-muted-foreground">
                      Business formation, corporate matters
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="Employment Law">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Employment Law</span>
                    <span className="text-xs text-muted-foreground">
                      Workplace issues, labor disputes
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="Real Estate Law">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Real Estate Law</span>
                    <span className="text-xs text-muted-foreground">
                      Property transactions, landlord issues
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="Intellectual Property">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Intellectual Property</span>
                    <span className="text-xs text-muted-foreground">
                      Patents, trademarks, copyrights
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="Immigration Law">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Immigration Law</span>
                    <span className="text-xs text-muted-foreground">
                      Visa, citizenship, immigration matters
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="Tax Law">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Tax Law</span>
                    <span className="text-xs text-muted-foreground">
                      Tax disputes, compliance matters
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="Environmental Law">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Environmental Law</span>
                    <span className="text-xs text-muted-foreground">
                      Environmental regulations, compliance
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="Other">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Other</span>
                    <span className="text-xs text-muted-foreground">
                      Not sure or other legal matter
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              This helps us match you with a lawyer who specializes in your area
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
            <FormLabel>How urgent is this matter? *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select priority level" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="LOW">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Low Priority</span>
                    <span className="text-xs text-muted-foreground">
                      Within 3 months
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="MEDIUM">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Medium Priority</span>
                    <span className="text-xs text-muted-foreground">
                      Within a month
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="HIGH">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">High Priority</span>
                    <span className="text-xs text-muted-foreground">
                      Within a week
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="URGENT">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Urgent</span>
                    <span className="text-xs text-muted-foreground">
                      Immediate attention needed
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              This helps lawyers prioritize cases appropriately
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}