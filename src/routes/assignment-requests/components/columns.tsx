import type { ColumnDef } from "@tanstack/react-table";
import type { AssignmentRequest, AssignmentRequestStatus } from "@/services/cases/cases.types";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

const statusColors: Record<AssignmentRequestStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  APPROVED: "bg-green-100 text-green-800 hover:bg-green-200",
  REJECTED: "bg-red-100 text-red-800 hover:bg-red-200",
  CANCELLED: "bg-gray-100 text-gray-800 hover:bg-gray-200",
};

export const columns: ColumnDef<AssignmentRequest>[] = [
  {
    accessorKey: "case",
    header: "Case",
    cell: ({ row }) => {
      const caseData = row.original.case;
      if (!caseData) {
        return <span className="text-sm text-muted-foreground">N/A</span>;
      }
      return (
        <div>
          <div className="font-medium max-w-[300px] truncate">
            {caseData.title}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge
              variant="secondary"
              className={cn(
                "text-xs capitalize",
                caseData.priority === "LOW" && "bg-gray-100 text-gray-800",
                caseData.priority === "MEDIUM" && "bg-blue-100 text-blue-800",
                caseData.priority === "HIGH" && "bg-orange-100 text-orange-800",
                caseData.priority === "URGENT" && "bg-red-100 text-red-800"
              )}
            >
              {caseData.priority.toLowerCase()}
            </Badge>
            <Badge
              variant="secondary"
              className={cn(
                "text-xs capitalize",
                caseData.status === "OPEN" && "bg-blue-100 text-blue-800",
                caseData.status === "ASSIGNED" && "bg-purple-100 text-purple-800",
                caseData.status === "IN_PROGRESS" && "bg-yellow-100 text-yellow-800",
                caseData.status === "RESOLVED" && "bg-green-100 text-green-800",
                caseData.status === "CLOSED" && "bg-gray-100 text-gray-800"
              )}
            >
              {caseData.status.replace("_", " ").toLowerCase()}
            </Badge>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => {
      const message = row.getValue("message") as string | undefined;
      if (!message) {
        return <span className="text-sm text-muted-foreground italic">No message</span>;
      }
      return (
        <div className="text-sm max-w-[250px] truncate" title={message}>
          {message}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as AssignmentRequestStatus;
      return (
        <Badge
          variant="secondary"
          className={cn("capitalize", statusColors[status])}
        >
          {status.toLowerCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "rejectionReason",
    header: "Rejection Reason",
    cell: ({ row }) => {
      const rejectionReason = row.getValue("rejectionReason") as string | undefined;
      const status = row.original.status;

      if (status !== "REJECTED") {
        return <span className="text-sm text-muted-foreground">-</span>;
      }

      if (!rejectionReason) {
        return <span className="text-sm text-muted-foreground italic">No reason provided</span>;
      }

      return (
        <div className="text-sm max-w-[200px] truncate text-destructive" title={rejectionReason}>
          {rejectionReason}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Requested",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
      return (
        <div className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </div>
      );
    },
  },
  {
    accessorKey: "reviewedAt",
    header: "Reviewed",
    cell: ({ row }) => {
      const reviewedAt = row.getValue("reviewedAt") as string | undefined;
      if (!reviewedAt) {
        return <span className="text-sm text-muted-foreground">-</span>;
      }
      return (
        <div className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(reviewedAt), { addSuffix: true })}
        </div>
      );
    },
  },
];
