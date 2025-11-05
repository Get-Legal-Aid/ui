import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { useUpdateCaseStatus } from "@/services/cases/cases.hooks";
import type { Case, CaseStatus } from "@/services/cases/cases.types";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import type { ApiError } from "@/services/auth/auth.types";

interface UpdateStatusDialogProps {
  caseData: Case;
}

// Available status transitions based on current status
const getAvailableStatuses = (currentStatus: CaseStatus): CaseStatus[] => {
  switch (currentStatus) {
    case "OPEN":
      return ["ASSIGNED", "CLOSED"];
    case "ASSIGNED":
      return ["IN_PROGRESS", "OPEN", "CLOSED"];
    case "IN_PROGRESS":
      return ["ASSIGNED", "RESOLVED", "CLOSED"];
    case "RESOLVED":
      return ["IN_PROGRESS", "CLOSED"];
    case "CLOSED":
      return [];
    default:
      return [];
  }
};

export function UpdateStatusDialog({ caseData }: UpdateStatusDialogProps) {
  const [newStatus, setNewStatus] = useState<CaseStatus | "">("");
  const [open, setOpen] = useState(false);
  const { mutateAsync: updateCaseStatus, isPending: isUpdatingStatus } = useUpdateCaseStatus();

  const availableStatuses = getAvailableStatuses(caseData.status);

  const handleStatusUpdate = async () => {
    if (!newStatus) return;

    try {
      await updateCaseStatus({ id: caseData.id, data: { status: newStatus } });
      toast.success("Status Updated!", {
        description: `Case status changed to ${newStatus.replace("_", " ").toLowerCase()}.`,
      });
      setNewStatus("");
      setOpen(false);
    } catch (error) {
      if (isAxiosError<ApiError>(error) && error.response?.data) {
        toast.error("Update Failed", {
          description: error.response.data.error.message || "Failed to update case status.",
        });
      } else {
        toast.error("Update Failed", {
          description: "Failed to update case status. Please try again.",
        });
      }
    }
  };

  if (availableStatuses.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg">
          <MoreHorizontal className="mr-2 h-4 w-4" />
          Update Status
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Case Status</DialogTitle>
          <DialogDescription>
            Change the status of this case to reflect its current state.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="status-select">New Status</Label>
            <Select value={newStatus} onValueChange={(value: CaseStatus) => setNewStatus(value)}>
              <SelectTrigger id="status-select">
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                {availableStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.replace("_", " ").toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleStatusUpdate} 
            disabled={!newStatus || isUpdatingStatus}
          >
            {isUpdatingStatus && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}