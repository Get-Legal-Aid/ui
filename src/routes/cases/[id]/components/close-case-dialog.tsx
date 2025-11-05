import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { XCircle, Loader2 } from "lucide-react";
import { useCloseCase } from "@/services/cases/cases.hooks";
import type { Case } from "@/services/cases/cases.types";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import type { ApiError } from "@/services/auth/auth.types";

interface CloseCaseDialogProps {
  caseData: Case;
}

export function CloseCaseDialog({ caseData }: CloseCaseDialogProps) {
  const [closureNotes, setClosureNotes] = useState("");
  const [open, setOpen] = useState(false);
  const { mutateAsync: closeCase, isPending: isClosing } = useCloseCase();

  const handleClose = async () => {
    try {
      await closeCase({ 
        id: caseData.id, 
        data: closureNotes.trim() ? { closureNotes: closureNotes.trim() } : undefined 
      });
      toast.success("Case Closed!", {
        description: "The case has been closed.",
      });
      setClosureNotes("");
      setOpen(false);
    } catch (error) {
      if (isAxiosError<ApiError>(error) && error.response?.data) {
        toast.error("Closure Failed", {
          description: error.response.data.error.message || "Failed to close case.",
        });
      } else {
        toast.error("Closure Failed", {
          description: "Failed to close case. Please try again.",
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="lg">
          <XCircle className="mr-2 h-4 w-4" />
          Close Case
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Close Case</DialogTitle>
          <DialogDescription>
            Permanently close this case. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="closure-notes">Closure Notes (Optional)</Label>
            <Textarea
              id="closure-notes"
              placeholder="Explain why the case is being closed..."
              value={closureNotes}
              onChange={(e) => setClosureNotes(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleClose} disabled={isClosing} variant="destructive">
            {isClosing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Close Case
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}