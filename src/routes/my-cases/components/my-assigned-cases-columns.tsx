import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Case } from "@/services/cases/cases.types";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Calendar, Clock, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const statusColors = {
  ASSIGNED: "bg-blue-100 text-blue-800 border-blue-200",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800 border-yellow-200",
  RESOLVED: "bg-green-100 text-green-800 border-green-200",
  CLOSED: "bg-gray-100 text-gray-800 border-gray-200",
} as const;

const priorityColors = {
  LOW: "bg-gray-100 text-gray-700 border-gray-200",
  MEDIUM: "bg-blue-100 text-blue-700 border-blue-200",
  HIGH: "bg-orange-100 text-orange-700 border-orange-200",
  URGENT: "bg-red-100 text-red-700 border-red-200",
} as const;

export const myAssignedCasesColumns: ColumnDef<Case>[] = [
  {
    accessorKey: "title",
    header: "Case Title",
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      const code = row.original.code;
      
      return (
        <div className="space-y-1">
          <div className="font-medium">{title}</div>
          <div className="text-sm text-muted-foreground">#{code}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "clientName",
    header: () => {
      return (
        <div className="flex items-center font-semibold">
          <User className="mr-2 h-4 w-4" />
          Client
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="font-medium">{row.getValue("clientName")}</div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as keyof typeof statusColors;
      
      return (
        <Badge className={statusColors[status]}>
          {status.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Priority
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const priority = row.getValue("priority") as keyof typeof priorityColors;
      
      return (
        <Badge className={priorityColors[priority]}>
          {priority}
        </Badge>
      );
    },
  },
  {
    accessorKey: "practiceArea",
    header: "Practice Area",
    cell: ({ row }) => {
      const practiceArea = row.getValue("practiceArea") as string;
      
      return practiceArea ? (
        <span className="text-sm">{practiceArea}</span>
      ) : (
        <span className="text-sm text-muted-foreground">Not specified</span>
      );
    },
  },
  {
    accessorKey: "assignedAt",
    header: () => {
      return (
        <div className="flex items-center font-semibold">
          <Calendar className="mr-2 h-4 w-4" />
          Assigned
        </div>
      );
    },
    cell: ({ row }) => {
      const assignedAt = row.getValue("assignedAt") as string;
      
      if (!assignedAt) {
        return <span className="text-sm text-muted-foreground">—</span>;
      }
      
      return (
        <div className="text-sm">
          {formatDistanceToNow(new Date(assignedAt), { addSuffix: true })}
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          <Clock className="mr-2 h-4 w-4" />
          Last Updated
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const updatedAt = row.getValue("updatedAt") as string;
      
      return (
        <div className="text-sm">
          {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}
        </div>
      );
    },
  },
];