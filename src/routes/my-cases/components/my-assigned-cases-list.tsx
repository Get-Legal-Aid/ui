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
import { useGetMyAssignedCases } from "@/services/cases/cases.hooks";
import type { CasePriority, CaseStatus } from "@/services/cases/cases.types";
import type { PaginationState, SortingState } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { myAssignedCasesColumns } from "./my-assigned-cases-columns";

export function MyAssignedCasesList() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<CaseStatus | undefined>(undefined);
  const [priority, setPriority] = useState<CasePriority | undefined>(undefined);
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
    { id: "updatedAt", desc: true },
  ]);

  // Fetch my assigned cases with server-side params
  const { data, isLoading, error } = useGetMyAssignedCases({
    page: pagination.pageIndex + 1, // API uses 1-based pagination
    limit: pagination.pageSize,
    status,
    priority,
    search: debouncedSearch || undefined,
    sortBy: sorting[0]?.id as "createdAt" | "updatedAt" | "priority",
    sortOrder: sorting[0]?.desc ? "desc" : "asc",
  });

  // Calculate page count
  const pageCount = data?.pagination ? Math.ceil(data.pagination.total / data.pagination.limit) : 0;

  const handleRowClick = (caseItem: NonNullable<typeof data>["cases"][0]) => {
    navigate(`/cases/${caseItem.id}`);
  };

  const statusOptions = [
    { value: "ASSIGNED", label: "Assigned" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "RESOLVED", label: "Resolved" },
    { value: "CLOSED", label: "Closed" },
  ];

  const priorityOptions = [
    { value: "LOW", label: "Low" },
    { value: "MEDIUM", label: "Medium" },
    { value: "HIGH", label: "High" },
    { value: "URGENT", label: "Urgent" },
  ];

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Failed to load your assigned cases.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search cases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2">
          <Select
            value={status || "all"}
            onValueChange={(value) => setStatus(value === "all" ? undefined : (value as CaseStatus))}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={priority || "all"}
            onValueChange={(value) => setPriority(value === "all" ? undefined : (value as CasePriority))}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              {priorityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={myAssignedCasesColumns}
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