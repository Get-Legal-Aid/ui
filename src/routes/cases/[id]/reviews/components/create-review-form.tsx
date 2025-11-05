import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateCaseReview } from "@/services/cases/cases.hooks";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import type { CaseReview } from "@/services/cases/cases.types";
import type { ApiError } from "@/services/auth/auth.types";

// Mock practice areas - in real app, fetch from API
const practiceAreas = [
  "Family Law",
  "Criminal Law", 
  "Corporate Law",
  "Real Estate Law",
  "Employment Law",
  "Immigration Law",
  "Intellectual Property",
  "Personal Injury",
  "Tax Law",
  "Environmental Law",
  "Landlord-Tenant Law",
  "Contract Law",
];


interface CreateReviewFormProps {
  caseId: string;
  existingReview?: CaseReview;
  onSuccess: () => void;
}

export function CreateReviewForm({ caseId, existingReview, onSuccess }: CreateReviewFormProps) {
  const [formData, setFormData] = useState({
    findings: existingReview?.findings || "",
    suggestedPracticeArea: existingReview?.suggestedPracticeArea || "not-specified",
  });

  const { mutateAsync: createReview, isPending } = useCreateCaseReview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.findings.trim()) {
      toast.error("Please provide research findings");
      return;
    }

    try {
      await createReview({
        caseId,
        data: {
          findings: formData.findings.trim(),
          suggestedPracticeArea: formData.suggestedPracticeArea === "not-specified" ? undefined : formData.suggestedPracticeArea,
        },
      });
      
      toast.success("Case review submitted successfully");
      onSuccess();
    } catch (error) {
      if (isAxiosError<ApiError>(error) && error.response?.data) {
        toast.error(error.response.data.error.message || "Failed to submit case review");
      } else {
        toast.error("Failed to submit case review");
      }
    }
  };

  return (
    <Card className="max-w-4xl">
      <CardHeader>
        <CardTitle>
          {existingReview ? "Update Case Review" : "Add Case Review"}
        </CardTitle>
        <p className="text-muted-foreground">
          Provide preliminary research findings and practice area categorization for this case.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Research Findings */}
          <div className="space-y-2">
            <Label htmlFor="findings">Research Findings *</Label>
            <Textarea
              id="findings"
              placeholder="Based on preliminary research, this appears to be a case involving..."
              value={formData.findings}
              onChange={(e) => setFormData({ ...formData, findings: e.target.value })}
              rows={12}
              className="min-h-[300px]"
              required
            />
            <p className="text-sm text-muted-foreground">
              Provide detailed research findings, relevant case law, and preliminary analysis.
            </p>
          </div>
          
          {/* Practice Area Suggestion */}
          <div className="space-y-2">
            <Label htmlFor="practiceArea">Suggested Practice Area</Label>
            <Select
              value={formData.suggestedPracticeArea}
              onValueChange={(value) => 
                setFormData({ ...formData, suggestedPracticeArea: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select practice area..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-specified">Not specified</SelectItem>
                {practiceAreas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Based on your research, what practice area best fits this case?
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onSuccess}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.findings.trim() || isPending}
            >
              {isPending ? "Submitting..." : existingReview ? "Update Review" : "Submit Review"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}