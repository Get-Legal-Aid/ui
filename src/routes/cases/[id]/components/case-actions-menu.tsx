import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { Case } from "@/services/cases/cases.types";
import { UpdateStatusDialog } from "./update-status-dialog";
import { ResolveCaseDialog } from "./resolve-case-dialog";
import { CloseCaseDialog } from "./close-case-dialog";

interface CaseActionsMenuProps {
  caseData: Case;
  canPickupCase: boolean;
  canManageCase: boolean;
  isPickingUp: boolean;
  onPickup: () => void;
}

export function CaseActionsMenu({
  caseData,
  canPickupCase,
  canManageCase,
  isPickingUp,
  onPickup,
}: CaseActionsMenuProps) {
  return (
    <div className="flex gap-2">
      {/* Pickup Case Button */}
      {canPickupCase && (
        <Button
          onClick={onPickup}
          disabled={isPickingUp}
          className="shrink-0"
          size="lg"
        >
          {isPickingUp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPickingUp ? "Picking Up..." : "Pickup Case"}
        </Button>
      )}

      {/* Case Management Actions */}
      {canManageCase && caseData.status !== "CLOSED" && (
        <div className="flex gap-2">
          <UpdateStatusDialog caseData={caseData} />
          <ResolveCaseDialog caseData={caseData} />
          <CloseCaseDialog caseData={caseData} />
        </div>
      )}
    </div>
  );
}