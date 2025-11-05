import type { ColumnDef } from "@tanstack/react-table";
import type { Case, CaseStatus, CasePriority } from "@/services/cases/cases.types";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

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

export const columns: ColumnDef<Case>[] = [
  {
    accessorKey: "code",
    header: "Tracking Code",
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.getValue("code")}</div>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="font-medium max-w-[300px] truncate">
        {row.getValue("title")}
      </div>
    ),
  },
  {
    accessorKey: "clientName",
    header: "Client",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("clientName")}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.clientEmail}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as CasePriority;
      return (
        <Badge
          variant="secondary"
          className={cn("capitalize", priorityColors[priority])}
        >
          {priority.toLowerCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as CaseStatus;
      return (
        <Badge
          variant="secondary"
          className={cn("capitalize", statusColors[status])}
        >
          {status.replace("_", " ").toLowerCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "assignedTo",
    header: "Assigned To",
    cell: ({ row }) => {
      const assignedTo = row.original.assignedTo;
      if (!assignedTo) {
        return <span className="text-sm text-muted-foreground">Unassigned</span>;
      }
      return (
        <div>
          <div className="font-medium text-sm">
            {assignedTo.firstName} {assignedTo.lastName}
          </div>
          {assignedTo.companyName && (
            <div className="text-xs text-muted-foreground">
              {assignedTo.companyName}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-right">Created</div>,
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
      return (
        <div className="text-right text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </div>
      );
    },
  },
];
