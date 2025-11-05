import { format } from "date-fns";
import type { Case } from "@/services/cases/cases.types";

interface CaseSidebarProps {
  caseData: Case;
}

export function CaseSidebar({ caseData }: CaseSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Client Information */}
      <div className="rounded-lg border p-4 space-y-3">
        <h3 className="font-semibold">Client Information</h3>
        <div className="space-y-2 text-sm">
          <div>
            <p className="text-muted-foreground">Name</p>
            <p className="font-medium">{caseData.clientName}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Email</p>
            <p className="font-medium">{caseData.clientEmail}</p>
          </div>
          {caseData.clientPhone && (
            <div>
              <p className="text-muted-foreground">Phone</p>
              <p className="font-medium">{caseData.clientPhone}</p>
            </div>
          )}
        </div>
      </div>

      {/* Assigned Lawyer */}
      {caseData.assignedTo ? (
        <div className="rounded-lg border p-4 space-y-3">
          <h3 className="font-semibold">Assigned Lawyer</h3>
          <div className="space-y-2 text-sm">
            <div>
              <p className="text-muted-foreground">Name</p>
              <p className="font-medium">
                {caseData.assignedTo.firstName} {caseData.assignedTo.lastName}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{caseData.assignedTo.email}</p>
            </div>
            {caseData.assignedTo.companyName && (
              <div>
                <p className="text-muted-foreground">Company</p>
                <p className="font-medium">{caseData.assignedTo.companyName}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-4 text-center">
          <p className="text-sm text-muted-foreground">
            No lawyer assigned yet
          </p>
        </div>
      )}

      {/* Metadata */}
      <div className="rounded-lg bg-muted p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Created</span>
          <span className="font-medium">
            {format(new Date(caseData.createdAt), "MMM d, yyyy")}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Last Updated</span>
          <span className="font-medium">
            {format(new Date(caseData.updatedAt), "MMM d, yyyy")}
          </span>
        </div>
      </div>
    </div>
  );
}