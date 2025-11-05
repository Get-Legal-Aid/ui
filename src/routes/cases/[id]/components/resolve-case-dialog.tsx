import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, Loader2 } from "lucide-react";
import { useResolveCase } from "@/services/cases/cases.hooks";
import type { Case } from "@/services/cases/cases.types";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import type { ApiError } from "@/services/auth/auth.types";

interface ResolveCaseDialogProps {
  caseData: Case;
}

export function ResolveCaseDialog({ caseData }: ResolveCaseDialogProps) {
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [open, setOpen] = useState(false);
  const { mutateAsync: resolveCase, isPending: isResolving } = useResolveCase();

  const canResolve = caseData.status === "IN_PROGRESS" || caseData.status === "ASSIGNED";

  const handleResolve = async () => {
    try {
      await resolveCase({ 
        id: caseData.id, 
        data: resolutionNotes.trim() ? { resolutionNotes: resolutionNotes.trim() } : undefined 
      });
      toast.success("Case Resolved!", {
        description: "The case has been marked as resolved.",
      });
      setResolutionNotes("");
      setOpen(false);
    } catch (error) {
      if (isAxiosError<ApiError>(error) && error.response?.data) {
        toast.error("Resolution Failed", {
          description: error.response.data.error.message || "Failed to resolve case.",
        });
      } else {
        toast.error("Resolution Failed", {
          description: "Failed to resolve case. Please try again.",
        });
      }
    }
  };

  if (!canResolve) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg">
          <CheckCircle className="mr-2 h-4 w-4" />
          Resolve Case
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resolve Case</DialogTitle>
          <DialogDescription>
            Mark this case as resolved. You can optionally add resolution notes.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="resolution-notes">Resolution Notes (Optional)</Label>
            <Textarea
              id="resolution-notes"
              placeholder="Describe how the case was resolved..."
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleResolve} disabled={isResolving}>
            {isResolving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Resolve Case
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}