import { DataTable } from "@/components/data-table/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAssignmentRequests } from "@/services/cases/cases.hooks";
import type { AssignmentRequestStatus } from "@/services/cases/cases.types";
import type { PaginationState } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { columns } from "./columns";
import { useAuth } from "@/contexts/auth-context";

export function AssignmentRequestsList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState<AssignmentRequestStatus | undefined>(undefined);

  // Server-side pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Fetch data with server-side params
  const { data, isLoading, error } = useGetAssignmentRequests({
    page: pagination.pageIndex + 1, // API uses 1-based pagination
    limit: pagination.pageSize,
    status,
    requestedById: user?.id, // Only show current user's requests
  });

  const pageCount = useMemo(
    () => (data ? data.pagination.totalPages : 0),
    [data]
  );

  const handleRowClick = (request: NonNullable<typeof data>["requests"][0]) => {
    // Navigate to the case details page
    if (request.caseId) {
      navigate(`/cases/${request.caseId}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif">My Assignment Requests</h1>
          <p className="text-muted-foreground mt-1">
            Track the status of your case assignment requests
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          <Select
            value={status || "all"}
            onValueChange={(value) => {
              setStatus(value === "all" ? undefined : (value as AssignmentRequestStatus));
              // Reset to first page when filtering
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        {data && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              Total: <span className="font-medium text-foreground">{data.pagination.total}</span>
            </span>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            Failed to load assignment requests. Please try again.
          </p>
        </div>
      )}

      {/* Data Table with Server-Side Features */}
      <DataTable
        columns={columns}
        data={data?.requests ?? []}
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
        totalRows={data?.pagination.total ?? 0}
        onRowClick={handleRowClick}
      />
    </div>
  );
}
