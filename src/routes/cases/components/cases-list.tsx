import { DataTable } from "@/components/data-table/data-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { useWebSocket } from "@/lib/websocket/websocket-context";
import { useGetCases } from "@/services/cases/cases.hooks";
import type { CasePriority, CaseStatus } from "@/services/cases/cases.types";
import { useQueryClient } from "@tanstack/react-query";
import type { PaginationState, SortingState } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { columns } from "./columns";

export function CasesList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { onCasePickedUp } = useWebSocket();
  
  // No default filtering - show all cases
  const [status, setStatus] = useState<CaseStatus | "all">("all");
  const [priority, setPriority] = useState<CasePriority | "all">("all");
  const [search, setSearch] = useState("");

  // Debounce search input
  const debouncedSearch = useDebounce(search, 500);

  // Server-side pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Server-side sorting state
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);

  // Fetch data with server-side params (using debounced search)
  const { data, isLoading, error } = useGetCases({
    page: pagination.pageIndex + 1, // API uses 1-based pagination
    limit: pagination.pageSize,
    status: status === "all" ? undefined : status,
    priority: priority === "all" ? undefined : priority,
    search: debouncedSearch || undefined,
    sortBy: sorting[0]?.id as
      | "createdAt"
      | "updatedAt"
      | "priority"
      | undefined,
    sortOrder: sorting[0]?.desc ? "desc" : "asc",
  });

  const pageCount = useMemo(
    () => (data ? data.pagination.totalPages : 0),
    [data]
  );

  const handleRowClick = (caseItem: NonNullable<typeof data>["cases"][0]) => {
    navigate(`/cases/${caseItem.id}`);
  };

  // Listen for real-time case pickup events
  useEffect(() => {
    const unsubscribe = onCasePickedUp(() => {
      // Invalidate cases query to refetch and update the list
      queryClient.invalidateQueries({ queryKey: ["cases"] });
    });

    return unsubscribe;
  }, [onCasePickedUp, queryClient]);

  return (
    <div className="space-y-6">

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search cases..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              // Reset to first page when searching
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value as CaseStatus | "all");
              // Reset to first page when filtering
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
              <SelectItem value="ASSIGNED">Assigned</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={priority}
            onValueChange={(value) => {
              setPriority(value as CasePriority | "all");
              // Reset to first page when filtering
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            Failed to load cases. Please try again.
          </p>
        </div>
      )}

      {/* Data Table with Server-Side Features */}
      <DataTable
        columns={columns}
        data={data?.cases ?? []}
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        isLoading={isLoading}
        totalRows={data?.pagination.total ?? 0}
        onRowClick={handleRowClick}
      />
    </div>
  );
}
