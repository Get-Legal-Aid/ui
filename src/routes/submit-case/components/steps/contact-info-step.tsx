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

interface ContactInfoStepProps {
  form: UseFormReturn<CreateCaseFormData>;
}

export function ContactInfoStep({ form }: ContactInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-muted p-4">
        <p className="text-sm text-muted-foreground">
          We'll use this information to contact you about your case. Your information
          will be kept confidential.
        </p>
      </div>

      {/* Client Name */}
      <FormField
        control={form.control}
        name="clientName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name *</FormLabel>
            <FormControl>
              <Input placeholder="Kwame Mensah" {...field} />
            </FormControl>
            <FormDescription>Your full legal name</FormDescription>
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
            <FormLabel>Email Address *</FormLabel>
            <FormControl>
              <Input type="email" placeholder="kwame.mensah@example.com" {...field} />
            </FormControl>
            <FormDescription>
              We'll send case updates and your tracking code to this email
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
              <Input type="tel" placeholder="+233 24 123 4567" {...field} />
            </FormControl>
            <FormDescription>
              A lawyer may call you to discuss your case
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
