import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { SignUpFormData } from "@/services/auth/auth.types";

interface BiodataFormProps {
  form: UseFormReturn<SignUpFormData>;
  onNext: () => void;
  onBack: () => void;
}

export function BiodataForm({ form, onNext, onBack }: BiodataFormProps) {
  return (
    <>
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-medium text-foreground">
          Personal Information
        </h2>
        <p className="text-sm text-muted-foreground">
          Tell us a bit about yourself
        </p>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Kwame"
                  className="rounded-xl"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Mensah"
                  className="rounded-xl"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="kwame.mensah@example.com"
                  className="rounded-xl"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Button
          type="button"
          onClick={onNext}
          className="w-full rounded-xl"
          size="lg"
        >
          Continue
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="w-full rounded-xl"
          size="lg"
        >
          Back
        </Button>
      </div>
    </>
  );
}
