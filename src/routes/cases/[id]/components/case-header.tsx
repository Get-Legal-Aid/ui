import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import type { Case, CaseStatus, CasePriority } from "@/services/cases/cases.types";
import { CaseActionsMenu } from "./case-actions-menu";

interface CaseHeaderProps {
  caseData: Case;
  canPickupCase: boolean;
  canManageCase: boolean;
  isPickingUp: boolean;
  onPickup: () => void;
}

const statusColors: Record<CaseStatus, string> = {
  OPEN: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  UNDER_REVIEW: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
  ASSIGNED: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  RESOLVED: "bg-green-100 text-green-800 hover:bg-green-200",
  CLOSED: "bg-gray-100 text-gray-800 hover:bg-gray-200",
};

const priorityColors: Record<CasePriority, string> = {
  LOW: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  MEDIUM: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  HIGH: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  URGENT: "bg-red-100 text-red-800 hover:bg-red-200",
};

export function CaseHeader({
  caseData,
  canPickupCase,
  canManageCase,
  isPickingUp,
  onPickup,
}: CaseHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className={cn("capitalize", statusColors[caseData.status])}
            >
              {caseData.status.replace("_", " ").toLowerCase()}
            </Badge>
            <Badge
              variant="secondary"
              className={cn("capitalize", priorityColors[caseData.priority])}
            >
              {caseData.priority.toLowerCase()} priority
            </Badge>
          </div>
          <h1 className="text-4xl font-serif">{caseData.title}</h1>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-medium">Tracking Code:</span>
              <code className="bg-muted px-2 py-1 rounded font-mono">
                {caseData.code}
              </code>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                Created {formatDistanceToNow(new Date(caseData.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>

        <CaseActionsMenu
          caseData={caseData}
          canPickupCase={canPickupCase}
          canManageCase={canManageCase}
          isPickingUp={isPickingUp}
          onPickup={onPickup}
        />
      </div>
    </div>
  );
}