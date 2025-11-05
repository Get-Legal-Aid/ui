import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useSuggestLawyer } from "@/services/cases/cases.hooks";
import { useLawyers } from "@/services/auth/auth.hooks";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { UserPlus, Search, Loader2 } from "lucide-react";
import type { ApiError } from "@/services/auth/auth.types";

interface SuggestLawyerFormProps {
  caseId: string;
  onSuccess: () => void;
}

export function SuggestLawyerForm({ caseId, onSuccess }: SuggestLawyerFormProps) {
  const [formData, setFormData] = useState({
    lawyerId: "",
    reason: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const { mutateAsync: suggestLawyer, isPending } = useSuggestLawyer();
  
  // Fetch lawyers with search functionality
  const { data: lawyersData, isLoading: isLoadingLawyers } = useLawyers({
    search: searchQuery.trim() || undefined,
    limit: 50, // Get more results for search
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.lawyerId) {
      toast.error("Please select a lawyer");
      return;
    }

    try {
      await suggestLawyer({
        caseId,
        data: {
          lawyerId: formData.lawyerId,
          reason: formData.reason.trim() || undefined,
        },
      });
      
      toast.success("Lawyer suggestion sent! The lawyer will receive an email notification.");
      onSuccess();
    } catch (error) {
      if (isAxiosError<ApiError>(error) && error.response?.data) {
        toast.error(error.response.data.error.message || "Failed to suggest lawyer");
      } else {
        toast.error("Failed to suggest lawyer");
      }
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Suggest a Lawyer
        </CardTitle>
        <p className="text-muted-foreground">
          Recommend a specific lawyer for this case. This will send an email notification to the lawyer with accept/reject options.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Search Bar */}
          <div className="space-y-2">
            <Label htmlFor="search">Search Lawyers</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by name or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Lawyer Selection */}
          <div className="space-y-2">
            <Label htmlFor="lawyer">Select Lawyer *</Label>
            <Select
              value={formData.lawyerId}
              onValueChange={(value) => 
                setFormData({ ...formData, lawyerId: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={isLoadingLawyers ? "Loading lawyers..." : "Choose a lawyer..."} />
              </SelectTrigger>
              <SelectContent>
                {isLoadingLawyers ? (
                  <SelectItem value="loading" disabled>
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading lawyers...
                    </div>
                  </SelectItem>
                ) : lawyersData?.lawyers?.filter((lawyer) => lawyer.id && lawyer.id.trim() !== "").length ? (
                  lawyersData.lawyers
                    .filter((lawyer) => lawyer.id && lawyer.id.trim() !== "")
                    .map((lawyer) => (
                      <SelectItem key={lawyer.id} value={lawyer.id}>
                        <div className="flex flex-col">
                          <span>{lawyer.firstName} {lawyer.lastName}</span>
                          <span className="text-xs text-muted-foreground">
                            {lawyer.lawyerProfile.practiceArea} • {lawyer.lawyerProfile.companyName}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                ) : (
                  <SelectItem value="no-results" disabled>
                    {searchQuery ? "No lawyers found matching your search" : "No lawyers available"}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Suggestion (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="Why do you recommend this lawyer for this case?"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              rows={4}
            />
            <p className="text-sm text-muted-foreground">
              Explain why this lawyer would be a good fit for this specific case.
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
              disabled={!formData.lawyerId || isPending}
            >
              {isPending ? "Suggesting..." : "Suggest Lawyer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}